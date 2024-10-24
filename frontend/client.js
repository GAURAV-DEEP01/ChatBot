const askQuestion = async (question) => {
  try {
    const response = await fetch("http://localhost:9090/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat: question,
      }),
    });
    if (!response.ok) {
      console.error(`Error fetching from server! status: ${response.status}`);
      return;
    }
    const data = await response.json();
    if (data.success === true) renderChat(data.data);
  } catch (err) {
    console.error(err);
  }
};

const convoContainer = document.getElementById("conv-container");
const renderChat = (chat) => {
  chat.forEach((e) => {
    if (e.role === "model") {
      createBotChatBlock(e.content);
    }
  });
};

const createBotChatBlock = (content) => {
  const chatBlock = document.createElement("div");
  chatBlock.setAttribute("class", "bot-container");
  const image = document.createElement("img");
  image.setAttribute("src", "Images/bot.svg");
  const botMessage = document.createElement("p");
  botMessage.setAttribute("class", "bot-message");
  botMessage.innerHTML = marked.parse(content);
  chatBlock.append(image);
  chatBlock.append(botMessage);
  convoContainer.append(chatBlock);

  return chatBlock;
};

const createUserChatBlock = (content) => {
  const chatBlock = document.createElement("div");
  chatBlock.setAttribute("class", "user-container");
  const you = document.createElement("p");
  you.setAttribute("class", "user");
  you.innerText = "You";
  const userMessage = document.createElement("p");
  userMessage.setAttribute("class", "user-message");
  userMessage.innerHTML = content;
  chatBlock.append(you);
  chatBlock.append(userMessage);
  convoContainer.append(chatBlock);
};

const sendQuestion = async () => {
  const questionField = document.getElementById("question-field");
  let question = questionField.value;
  questionField.value = "";

  createUserChatBlock(question);
  const typing = createBotChatBlock("...");
  if (question) await askQuestion(question.trim());
  typing.remove();
};
const sendBtn = document.getElementById("send-question");
sendBtn.addEventListener("click", (_) => {
  sendQuestion();
});

document.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    sendQuestion();
  }
});
