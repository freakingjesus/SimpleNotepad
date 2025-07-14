const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('toggleWrap', () => {
  it('toggles the wrap attribute and saves preference', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    const dom = new JSDOM(html, {
      url: 'http://localhost',
      runScripts: 'dangerously',
      resources: 'usable',
      beforeParse(window) {
        window.fetch = () => Promise.resolve({ ok: true, text: () => Promise.resolve('') });
      }
    });
    const textarea = dom.window.document.getElementById('note');
    expect(textarea.getAttribute('wrap')).to.equal('off');
    dom.window.toggleWrap();
    expect(textarea.getAttribute('wrap')).to.equal('soft');
    expect(dom.window.localStorage.getItem('notepad-wrap')).to.equal('1');
    dom.window.toggleWrap();
    expect(textarea.getAttribute('wrap')).to.equal('off');
    expect(dom.window.localStorage.getItem('notepad-wrap')).to.equal('0');
    dom.window.close();
  });
});
