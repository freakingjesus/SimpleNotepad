const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('runGemini', () => {
  it('includes current date and time in the prompt', async () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    let captured;
    const dom = new JSDOM(html, {
      url: 'http://localhost',
      runScripts: 'dangerously',
      resources: 'usable',
      beforeParse(window) {
        window.fetch = (_url, opts = {}) => {
          if (opts.body) {
            captured = JSON.parse(opts.body).prompt;
          }
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ text: '' }),
            text: () => Promise.resolve('')
          });
        };
      }
    });
    dom.window.document.getElementById('note').value = 'hello';
    dom.window.runGemini();
    await new Promise(r => setTimeout(r, 0));
    expect(captured).to.include('hello');
    expect(captured).to.match(/Current date and time:/);
    dom.window.close();
  });
});
