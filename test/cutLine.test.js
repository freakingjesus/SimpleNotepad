const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('cutLine', () => {
  it('cuts the current line and copies it to clipboard', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    let copied;
    const dom = new JSDOM(html, {
      url: 'http://localhost',
      runScripts: 'dangerously',
      resources: 'usable',
      beforeParse(window) {
        window.fetch = () => Promise.resolve({ ok: true, text: () => Promise.resolve('') });
        window.navigator.clipboard = {
          writeText: text => { copied = text; return Promise.resolve(); }
        };
      }
    });
    const textarea = dom.window.document.getElementById('note');
    textarea.value = 'one\ntwo\nthree';
    textarea.selectionStart = textarea.selectionEnd = 5; // inside second line
    dom.window.cutLine();
    expect(textarea.value).to.equal('one\nthree');
    expect(copied).to.equal('two\n');
    dom.window.close();
  });
});
