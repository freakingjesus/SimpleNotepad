const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const { loadNotes, saveNotes } = require('../server');

const FILE = path.join(__dirname, '..', 'notes.txt');

describe('loadNotes and saveNotes', () => {
  beforeEach(() => {
    if (fs.existsSync(FILE)) fs.unlinkSync(FILE);
  });

  afterEach(() => {
    if (fs.existsSync(FILE)) fs.unlinkSync(FILE);
  });

  it('returns empty string when file is missing', async () => {
    const result = await loadNotes();
    expect(result).to.equal('');
  });

  it('saves and loads content', async () => {
    await saveNotes('hello');
    const result = await loadNotes();
    expect(result).to.equal('hello');
  });

  it('overwrites existing content', async () => {
    await saveNotes('first');
    await saveNotes('second');
    const result = await loadNotes();
    expect(result).to.equal('second');
  });
});
