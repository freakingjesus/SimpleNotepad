const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE = path.join(__dirname, 'notes.txt');

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

app.listen(PORT, () => {
  console.log(`Notepad server listening on port ${PORT}`);
});
