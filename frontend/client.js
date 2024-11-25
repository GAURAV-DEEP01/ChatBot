const chatContainer = document.getElementById("chat-container");
const questionField = document.getElementById("question-field");
const sendBtn = document.getElementById("send-question");
const clearBtn = document.getElementById("clear-chat");
let userChats = [];

const askQuestion = async (question) => {
  try {
    const response = await fetch("https://chatbot-cks6.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat: userChats,
      }),
    });

    if (!response.ok) {
      console.error(`Error fetching from server! Status: ${response.status}`);
      return;
    }

    const data = await response.json();
    if (data.success === true) renderChat(data.data);
  } catch (err) {
    console.error(err);
  }
};

const renderChat = (chat) => {
  chat.forEach((e) => {
    if (e.role === "model") {
      createBotChatBlock(e.content);
    }
  });
};

const createBotChatBlock = (content) => {
  const chatBlock = document.createElement("div");
  chatBlock.classList.add("flex");

  const messageDiv = document.createElement("div");
  messageDiv.classList.add(
    "bg-gray-700",
    "text-white",
    "p-3",
    "rounded-lg",
    "max-w-[80%]"
  );
  messageDiv.innerHTML = marked.parse(content);

  chatBlock.appendChild(messageDiv);

  chatContainer.appendChild(chatBlock);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  return chatBlock;
};

const createUserChatBlock = (content) => {
  const chatBlock = document.createElement("div");
  chatBlock.classList.add("flex", "justify-end");

  const messageDiv = document.createElement("div");
  messageDiv.classList.add(
    "bg-purple-600",
    "text-white",
    "p-3",
    "rounded-lg",
    "max-w-[80%]"
  );
  messageDiv.textContent = content;

  chatBlock.appendChild(messageDiv);
  chatContainer.appendChild(chatBlock);
  chatContainer.scrollTop = chatContainer.scrollHeight;
};

const sendQuestion = async () => {
  const question = questionField.value.trim();
  if (!question) return;

  questionField.value = "";
  createUserChatBlock(question);
  userChats.push({ role: "user", content: question });
  const typingBlock = createBotChatBlock("...");
  await askQuestion(question);
  typingBlock.remove();
};

sendBtn.addEventListener("click", sendQuestion);
questionField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendQuestion();
});

clearBtn.addEventListener("click", () => {
  chatContainer.innerHTML = `
          <div class="flex">
              <div class="bg-gray-700 text-white p-3 rounded-lg max-w-[80%]">
                  Hello! I'm your AI companion. How can I assist you today?
              </div>
          </div>
      `;
  userChats = [];
});
