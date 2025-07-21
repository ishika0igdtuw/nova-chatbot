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
git clone https://github.com/ishika0igdtuw/nova-chatbot.git
cd nova-chatbot

### 2.Install Backend Dependencies
npm install

### 3.Add API Keys
GEMINI_API_KEY=your-gemini-api-key-here
OPENAI_API_KEY=your-openai-api-key-here

### 4.Start the Server
node server.js

###🧪 How To Use 
Open public/index.html in your browser.
Start chatting like you would with a real assistant.
Use the mic button for voice input.
Enjoy real-time responses and dynamic suggestions!

###📁 Project Structure
nova-chatbot/
├── public/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── assets (images, etc.)
├── server.js
├── .env
├── .gitignore
├── package.json

###📷 Preview
<img width="1887" height="851" alt="image" src="https://github.com/user-attachments/assets/1625b77a-e3ee-405e-a4a3-e57dd6b06111" />
<img width="1875" height="799" alt="image" src="https://github.com/user-attachments/assets/98ee5a4a-f4ba-44df-abaf-e093af63afd9" />

