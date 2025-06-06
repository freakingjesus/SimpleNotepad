const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE = path.join(__dirname, 'notes.txt');

app.use(cors());
app.use(express.json());

function loadNotes() {
  try {
    return fs.readFileSync(FILE, 'utf8');
  } catch (err) {
    return '';
  }
}

function saveNotes(content) {
  fs.writeFileSync(FILE, content, 'utf8');
}

app.get('/notes', (req, res) => {
  res.type('text/plain').send(loadNotes());
});

app.post('/notes', (req, res) => {
  if (typeof req.body.content === 'string') {
    saveNotes(req.body.content);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

app.listen(PORT, () => {
  console.log(`Notepad server listening on port ${PORT}`);
});
