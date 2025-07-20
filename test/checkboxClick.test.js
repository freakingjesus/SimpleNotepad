const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('checkbox click', () => {
  it('moves line to completed list when clicking the box', () => {
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
    const list = dom.window.document.getElementById('completedList');
    textarea.value = '☐ Task\nnext';
    textarea.selectionStart = textarea.selectionEnd = 0;
    dom.window.handleCheckboxClick();
    expect(textarea.value).to.equal('next');
    expect(list.children.length).to.equal(1);
    expect(list.textContent.trim()).to.equal('Task');
    dom.window.close();
  });
});
