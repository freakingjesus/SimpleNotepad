const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('blank bullet enter behavior', () => {
  it('removes bullet when pressing Enter on empty bullet line', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    const dom = new JSDOM(html, {
      url: 'http://localhost',
      runScripts: 'dangerously',
      resources: 'usable',
      beforeParse(window) {
        window.fetch = () => Promise.resolve({ ok: true, text: () => Promise.resolve('') });
        window.prompt = () => '0043';
      }
    });
    const textarea = dom.window.document.getElementById('note');
    textarea.value = '• ';
    textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
    const event = new dom.window.KeyboardEvent('keydown', { key: 'Enter' });
    textarea.dispatchEvent(event);
    expect(textarea.value).to.equal('\n');
    dom.window.close();
  });
});
