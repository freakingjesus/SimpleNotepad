const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('saveRemote unauthorized', () => {
  it('alerts the user when the server rejects the save', async () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    let alertMsg;
    const dom = new JSDOM(html, {
      url: 'http://localhost',
      runScripts: 'dangerously',
      resources: 'usable',
      beforeParse(window) {
        window.fetch = () => Promise.resolve({
          ok: false,
          status: 401,
          text: () => Promise.resolve('')
        });
        window.alert = msg => { alertMsg = msg; };
      }
    });
    dom.window.saveRemote();
    await new Promise(r => setTimeout(r, 0));
    expect(alertMsg).to.match(/401|unauthorized/i);
    dom.window.close();
  });
});
