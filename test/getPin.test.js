const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('getPin behavior', () => {
  function loadDom(promptValue) {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    return new JSDOM(html, {
      url: 'http://localhost',
      runScripts: 'dangerously',
      resources: 'usable',
      beforeParse(window) {
        window.fetch = () => Promise.resolve({ ok: true, text: () => Promise.resolve('') });
        window.prompt = () => promptValue;
      }
    });
  }

  it('returns null when user cancels prompt', () => {
    const dom = loadDom(null);
    const result = dom.window.getPin();
    expect(result).to.equal(null);
    expect(dom.window.localStorage.getItem('notes-pin')).to.equal(null);
    dom.window.close();
  });

  it('returns null when user enters empty string', () => {
    const dom = loadDom('');
    const result = dom.window.getPin();
    expect(result).to.equal(null);
    expect(dom.window.localStorage.getItem('notes-pin')).to.equal(null);
    dom.window.close();
  });
});
