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
    console.err(err);
  }
};

const renderChat = (chat) => {
  const convoContainer = document.getElementById("conv-container");
  chat.forEach((e) => {
    const chatBlock = document.createElement("div");
    if (e.role === "user") {
      chatBlock.setAttribute("class", "user-container");
      const you = document.createElement("p");
      you.setAttribute("class", "user");
      you.innerText = "You";
      const userMessage = document.createElement("p");
      userMessage.setAttribute("class", "user-message");
      userMessage.innerText = e.content;
      chatBlock.append(you);
      chatBlock.append(userMessage);
      convoContainer.append(chatBlock);
    } else if (e.role === "model") {
      chatBlock.setAttribute("class", "bot-container");
      const image = document.createElement("img");
      image.setAttribute("src", "Images/bot.svg");
      const botMessage = document.createElement("p");
      botMessage.setAttribute("class", "bot-message");
      botMessage.innerText = e.content;
      chatBlock.append(image);
      chatBlock.append(botMessage);
      convoContainer.append(chatBlock);
    }
  });
};

const sendQuestion = async () => {
  const questionField = document.getElementById("question-field");
  let question = questionField.value;
  questionField.value = "";
  if (question) await askQuestion(question.trim());
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
