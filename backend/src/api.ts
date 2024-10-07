
import dotenv from "dotenv";
import fetch from "node-fetch"
import { ChatBlock_t, Chats_t, GeminiChatBlock_t, GeminiChats_t } from "types/chats";
import { ISession } from "types/express-session";
dotenv.config();

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.AI_API_KEY_G}`;

export const convertToChatObject = (data: GeminiChats_t): Chats_t => {
    const convertedChat: Chats_t = []
    data.forEach((convo) => {
        const chatblock: ChatBlock_t = { role: undefined, content: undefined };
        chatblock.content = convo.parts[0].text;
        chatblock.role = convo.role;
        convertedChat.push(chatblock);
    })
    return convertedChat;
}

export const chatWithGemini = async (data: GeminiChats_t): Promise<string> => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ contents: data }),
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // this instead of stream, so it'll be eazy on the frontend
        const res = await response.json();
        return res?.candidates[0]?.content?.parts[0]?.text;
    } catch (err) {
        throw err;
    }
}

export const chatRoute = async (req, res) => {
    const { chat } = req.body;
    const userSession = req.session as ISession;
    const userNewChatBlock: GeminiChatBlock_t = {
        parts: [
            {
                text: chat,
            },
        ],
        role: "user",
    };

    if (!userSession.userGeminiChat) {
        userSession.userGeminiChat = []
    }
    userSession.userGeminiChat.push(userNewChatBlock)
    const responseChat = await chatWithGemini(userSession.userGeminiChat)
    const botResponseChatBlock: GeminiChatBlock_t = {
        parts: [
            {
                text: responseChat,
            },
        ],
        role: "model",
    };
    userSession.userGeminiChat.push(botResponseChatBlock);
    const data = convertToChatObject(userSession.userGeminiChat);
    res.send({ success: true, data });
}

