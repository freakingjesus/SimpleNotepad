const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('restoreFromCloud failure', () => {
  it('does not change textarea when response not ok', async () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    const dom = new JSDOM(html, {
      url: 'http://localhost',
      runScripts: 'dangerously',
      resources: 'usable',
      beforeParse(window) {
        window.fetch = () => Promise.resolve({
          ok: false,
          status: 500,
          text: () => Promise.resolve('error')
        });
        window.prompt = () => '0043';
      }
    });
    const textarea = dom.window.document.getElementById('note');
    textarea.value = 'local text';
    dom.window.restoreFromCloud();
    await new Promise(r => setTimeout(r, 0));
    expect(textarea.value).to.equal('local text');
    dom.window.close();
  });
});
