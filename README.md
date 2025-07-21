# 🤖 Skillbot (NOVA)

**Skillbot (NOVA)** is a smart chatbot assistant that acts as your personal career guide. You can interact with it just like a real assistant, and it provides **AI-powered, dynamic responses** tailored to your interests.

---

## 💡 Features

- 💬 Chat with an AI assistant
- 🎯 Suggests **career options**
- 📚 Recommends **courses and certifications**
- 🧭 Helps you decide **what to learn next**
- ❓ Clears doubts about **tools, skills, or future roles**
- 🎙️ **Speech-to-text** input support
- 💾 **Chat memory** to remember past messages
- ⚡ AI-generated responses based on your inputs (not static suggestions)

---

## 🛠️ Tech Stack

| Frontend         | Backend            | AI APIs                |
|------------------|--------------------|------------------------|
| HTML, CSS, JavaScript | Node.js, Express | Gemini (Google LLM)    |
|                  | dotenv (.env config) | OpenAI Text-to-Speech |
|                  | CORS, body-parser   |                        |

---

## 🧠 How It Works

1. You type or speak a message.
2. The message is sent to the backend server.
3. The server calls the **Gemini AI API** with the chat history.
4. Gemini returns a **contextual, intelligent response**.
5. If speech is enabled, the response is converted using **OpenAI TTS**.
6. The full chat history is saved for memory and continuity.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/skillbot-nova.git
cd skillbot-nova
Install Dependencies
bash
Copy
Ed
npm install
