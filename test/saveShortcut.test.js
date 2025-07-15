const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Ctrl+S shortcut', () => {
  it('saves remotely and prevents default', async () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    let saved = false;
    const dom = new JSDOM(html, {
      url: 'http://localhost',
      runScripts: 'dangerously',
      resources: 'usable',
      beforeParse(window) {
        window.fetch = () => {
          saved = true;
          return Promise.resolve({ ok: true, text: () => Promise.resolve('') });
        };
      }
    });
    const event = new dom.window.KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
      cancelable: true
    });
    dom.window.document.dispatchEvent(event);
    await new Promise(r => setTimeout(r, 0));
    expect(event.defaultPrevented).to.be.true;
    expect(saved).to.be.true;
    dom.window.close();
  });
});
