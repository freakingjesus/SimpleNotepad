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

  it('returns empty string when file is missing', () => {
    expect(loadNotes()).to.equal('');
  });

  it('saves and loads content', () => {
    saveNotes('hello');
    expect(loadNotes()).to.equal('hello');
  });

  it('overwrites existing content', () => {
    saveNotes('first');
    saveNotes('second');
    expect(loadNotes()).to.equal('second');
  });
});
