const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE = path.join(__dirname, 'notes.txt');
const NOTES_PIN = process.env.NOTES_PIN || '0043';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const { createClient } = require('@supabase/supabase-js');
const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    : null;
// Use the Gemini 2.5 Pro model for API requests.
// See https://ai.google.dev/docs/start for available model names.
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent';

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
  const pin = req.query.pin || req.get('pin');
  if (NOTES_PIN && pin !== NOTES_PIN) return res.sendStatus(403);
  try {
    const content = await loadNotes();
    res
      .type('text/plain')
      .set('Cache-Control', 'no-store')
      .send(content);
  } catch (err) {
    res.sendStatus(500);
  }
});

app.post('/notes', async (req, res) => {
  const pin = req.query.pin || req.get('pin');
  if (NOTES_PIN && pin !== NOTES_PIN) return res.sendStatus(403);
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

app.post('/backup', async (req, res) => {
  const pin = req.query.pin || req.get('pin');
  if (NOTES_PIN && pin !== NOTES_PIN) return res.sendStatus(403);
  if (!supabase) return res.status(500).send('Supabase not configured');
  try {
    const content = await loadNotes();
    const { error } = await supabase
      .from('notes')
      .upsert({ id: 1, content });
    if (error) throw error;
    res.sendStatus(200);
  } catch (err) {
    console.error('Backup failed:', err);
    res.status(500).send('Backup failed');
  }
});

app.get('/restore', async (req, res) => {
  const pin = req.query.pin || req.get('pin');
  if (NOTES_PIN && pin !== NOTES_PIN) return res.sendStatus(403);
  if (!supabase) return res.status(500).send('Supabase not configured');
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('content')
      .eq('id', 1)
      .single();
    if (error) throw error;
    const text = data?.content || '';
    await saveNotes(text);
    res.type('text/plain').send(text);
  } catch (err) {
    console.error('Restore failed:', err);
    res.status(500).send('Restore failed');
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

module.exports = { loadNotes, saveNotes, app };
