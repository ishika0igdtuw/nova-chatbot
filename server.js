console.log("🟢 Starting Nova Server...");

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Gemini API Route ---
app.post('/api/gemini', async (req, res) => {
  const { userMessage } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: userMessage }] }] }
    );

    const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ reply: text });
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).send("Error calling Gemini API");
  }
});

// --- OpenAI TTS Route ---
app.post('/api/speak', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: 'tts-1',
        input: req.body.text,
        voice: 'nova',
        speed: 1.0
      },
      {
        responseType: 'arraybuffer',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': response.data.length
    });
    res.send(response.data);
  } catch (err) {
    console.error("TTS error:", err.message);
    res.status(500).send("TTS failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
