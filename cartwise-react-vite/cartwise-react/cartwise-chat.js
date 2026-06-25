const assistant = document.getElementById("cartwiseAssistant");
const robotButton = document.getElementById("cwRobotButton");
const chatPanel = document.getElementById("cwChatPanel");
const closeButton = document.getElementById("cwCloseButton");
const chatHeader = document.getElementById("cwChatHeader");
const chatForm = document.getElementById("cwChatForm");
const chatInput = document.getElementById("cwChatInput");
const messages = document.getElementById("cwMessages");
const micButton = document.getElementById("cwMicButton");

function openChat() {
  chatPanel.classList.add("is-open");
  chatPanel.setAttribute("aria-hidden", "false");
  setTimeout(() => chatInput.focus(), 50);
}

function closeChat() {
  chatPanel.classList.remove("is-open");
  chatPanel.setAttribute("aria-hidden", "true");
}

robotButton.addEventListener("click", () => {
  if (chatPanel.classList.contains("is-open")) {
    closeChat();
  } else {
    openChat();
  }
});

closeButton.addEventListener("click", closeChat);

function addMessage(text, type = "user") {
  const message = document.createElement("div");
  message.className = `cw-message cw-message-${type}`;
  message.textContent = text;
  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
}

function autoResizeInput() {
  chatInput.style.height = "auto";
  chatInput.style.height = `${Math.min(chatInput.scrollHeight, 132)}px`;
}

chatInput.addEventListener("input", autoResizeInput);

chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  chatInput.value = "";
  autoResizeInput();

  // Demo reply. Kết nối API/AI thật của nhóm tại đây.
  setTimeout(() => {
    addMessage("Mình đã nhận câu hỏi. Ở bản chính thức, CartWise sẽ phân tích giá, phí ship, ưu đãi và mức độ phù hợp trước khi mua.", "bot");
  }, 450);
});

// Kéo thả tự do: không giới hạn trong màn hình
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

chatHeader.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button")) return;

  const rect = chatPanel.getBoundingClientRect();
  isDragging = true;
  dragOffsetX = event.clientX - rect.left;
  dragOffsetY = event.clientY - rect.top;

  chatPanel.style.left = `${rect.left}px`;
  chatPanel.style.top = `${rect.top}px`;
  chatPanel.style.right = "auto";
  chatPanel.style.bottom = "auto";

  chatHeader.setPointerCapture(event.pointerId);
});

chatHeader.addEventListener("pointermove", (event) => {
  if (!isDragging) return;
  chatPanel.style.left = `${event.clientX - dragOffsetX}px`;
  chatPanel.style.top = `${event.clientY - dragOffsetY}px`;
});

chatHeader.addEventListener("pointerup", (event) => {
  isDragging = false;
  chatHeader.releasePointerCapture(event.pointerId);
});

chatHeader.addEventListener("pointercancel", () => {
  isDragging = false;
});

// Nhận giọng nói -> văn bản bằng Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "vi-VN";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.addEventListener("result", (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0]?.transcript || "")
      .join(" ")
      .trim();

    if (transcript) {
      chatInput.value = `${chatInput.value}${chatInput.value ? " " : ""}${transcript}`;
      autoResizeInput();
      chatInput.focus();
    }
  });

  recognition.addEventListener("end", () => {
    isListening = false;
    micButton.classList.remove("is-recording");
  });
}

micButton.addEventListener("click", () => {
  if (!recognition) {
    alert("Trình duyệt này chưa hỗ trợ nhập giọng nói. Bạn có thể thử trên Chrome hoặc Edge.");
    return;
  }

  if (isListening) {
    recognition.stop();
    return;
  }

  isListening = true;
  micButton.classList.add("is-recording");
  recognition.start();
});
