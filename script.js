let messages = [];
let lang = "en";

const textMap = {
  en: {
    placeholder: "Type your prompt...",
    send: "Send",
    thinking: "Thinking...",
    empty: "Please enter something"
  },
  zh: {
    placeholder: "输入你的提示词...",
    send: "发送",
    thinking: "思考中...",
    empty: "请输入内容"
  }
};

function switchLang() {
  lang = document.getElementById("lang").value;
  updateUI();
}

function updateUI() {
  document.getElementById("input").placeholder = textMap[lang].placeholder;
  document.getElementById("sendBtn").innerText = textMap[lang].send;
}

function addMessage(content, role) {
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.innerText = content || "...";
  document.getElementById("messages").appendChild(div);
  div.scrollIntoView();
}

function newChat() {
  messages = [];
  document.getElementById("messages").innerHTML = "";
}

async function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value.trim();

  if (!text) {
    alert(textMap[lang].empty);
    return;
  }

  addMessage(text, "user");
  input.value = "";

  addMessage(textMap[lang].thinking, "bot");

  try {
    const res = await fetch("https://你的vercel域名/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [...messages, { role: "user", content: text }],
        lang
      })
    });

    const data = await res.json();

    const reply = data.reply || "No response";

    document.querySelector(".bot:last-child").innerText = reply;

    messages.push({ role: "user", content: text });
    messages.push({ role: "assistant", content: reply });

  } catch (err) {
    document.querySelector(".bot:last-child").innerText = "Error";
  }
}

updateUI();