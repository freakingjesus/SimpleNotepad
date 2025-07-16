const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
// Use the Gemini 2.5 Pro model for API requests.
// See https://ai.google.dev/docs/start for available model names.
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent';

app.use(cors());
app.use(express.json());


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
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      tools: [{ google_search: {} }]
    };
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      return res.status(500).json({ error: 'Gemini API error' });
    }
    const data = await response.json();
    const candidate = data.candidates?.[0];
    const part = candidate?.content?.parts?.[0];
    const text = part?.text || '';
    const citations =
      part?.groundingMetadata?.web_search_queries || [];
    res.json({ text, citations });
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

module.exports = { app };
