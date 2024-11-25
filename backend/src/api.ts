import "dotenv/config";

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.AI_API_KEY}`;

export const chatWithGemini = async (data) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ contents: data }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }

        const res = await response.json();
        return res?.candidates[0]?.content?.parts[0]?.text;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const chatRoute = async (req, res) => {
    try {
        const { chat } = req.body;

        const geminiChats = chat.map((c) => ({
            parts: [{ text: c.content }],
            role: c.role,
        }));

        const responseChat = await chatWithGemini(geminiChats);

        if (responseChat) {
            const botResponse = { role: "model", content: responseChat };
            return res.json({ success: true, data: [...chat, botResponse] });
        }

        res.status(501).json({ success: false });
    } catch (err) {
        console.error(err);
        res.status(501).json({ success: false });
    }
};
