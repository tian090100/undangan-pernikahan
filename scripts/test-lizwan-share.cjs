const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildInvitationMessage } = require('../wedding/lizwan-naomi/share.js');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
function setup(navigator) {
  const button = { textContent: 'Bagikan ↗' };
  const context = {
    navigator, URLSearchParams, location: { search: '?to=Team%20Voya%20%26%20Health%20Today' },
    document: { addEventListener: (_, fn) => fn(), getElementById: () => button },
    setTimeout: () => 1, clearTimeout: () => {}
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../wedding/lizwan-naomi/share.js'), 'utf8'), context);
  return button;
}
test('Native sharing contains the full message and only one URL', async () => {
  let payload;
  const button = setup({ share: async value => { payload = value; } });
  await button.onclick();
  assert.equal(payload.text, buildInvitationMessage('Team Voya & Health Today'));
  assert.equal(payload.url, undefined);
});
test('Without native share, copy the full message instead of only the URL', async () => {
  let copied;
  const button = setup({ clipboard: { writeText: async text => { copied = text; } } });
  await button.onclick();
  assert.equal(copied, buildInvitationMessage('Team Voya & Health Today'));
  assert.equal(button.textContent, 'Pesan disalin ✓');
});
test('Cancelling native share does not unexpectedly overwrite the clipboard', async () => {
  let copied = false;
  const button = setup({ share: async () => { const e = new Error(); e.name = 'AbortError'; throw e; }, clipboard: { writeText: async () => { copied = true; } } });
  await button.onclick();
  assert.equal(copied, false);
});
test('Personal name and production URL match, including ampersands', () => {
  const text = buildInvitationMessage('Team Voya & Health Today');
  assert(text.includes('Bapak/Ibu/Saudara/i\nTeam Voya & Health Today\ndi Tempat'));
  assert(text.includes('https://www.daprita.web.id/wedding/lizwan-naomi/?to=Team%20Voya%20%26%20Health%20Today'));
  assert.equal((text.match(/https:\/\//g) || []).length, 1);
  assert(text.endsWith('Hormat Kami,\nNaomi & Lizwan🤍'));
  assert(text.includes('Mohon maaf perihal undangan hanya di bagikan melalui pesan ini.'));
});
test('Generic link has a valid guest fallback', () => {
  assert(buildInvitationMessage(null).includes('Tamu Undangan\ndi Tempat'));
});
test('Unicode names are retained and URL encoded', () => {
  const text = buildInvitationMessage('  Keluarga José & Istri  ');
  assert(text.includes('Keluarga José & Istri\ndi Tempat'));
  assert(text.includes('?to=Keluarga%20Jos%C3%A9%20%26%20Istri'));
});
