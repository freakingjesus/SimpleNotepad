const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE = path.join(__dirname, 'notes.txt');

// Use the Gemini 2.5 Flash Preview model for API requests.
// See https://ai.google.dev/docs/start for available model names.
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview:generateContent';

app.use(cors());
app.use(express.json());

async function loadNotes() {
  try {
    return await fs.promises.readFile(FILE, 'utf8');
  } catch (err) {
    return '';
  }
}

async function saveNotes(content) {
  await fs.promises.writeFile(FILE, content, 'utf8');
}

app.get('/notes', async (req, res) => {
  try {
    const content = await loadNotes();
    res.type('text/plain').send(content);
  } catch (err) {
    res.sendStatus(500);
  }
});

app.post('/notes', async (req, res) => {
  if (typeof req.body.content === 'string') {
    try {
      await saveNotes(req.body.content);
      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(400);
  }
});

app.post('/gemini', async (req, res) => {
  const prompt = req.body.prompt;
  const apiKey = process.env.GEMINI_API_KEY;
  if (typeof prompt !== 'string') {
    return res.sendStatus(400);
  }
  if (!apiKey) {
    return res.status(500).send('GEMINI_API_KEY missing');
  }
  try {
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      return res.status(500).json({ error: 'Gemini API error' });
    }
    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ text });
  } catch (err) {
    console.error('Gemini handler error:', err);
    res.status(500).json({ error: err.message || 'Gemini request failed' });
  }
});


if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Notepad server listening on port ${PORT}`);
  });
}

module.exports = { loadNotes, saveNotes };
