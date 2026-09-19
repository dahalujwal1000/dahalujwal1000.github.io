const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright-core');
const { setTimeout: wait } = require('node:timers/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const base = 'http://127.0.0.1:5181';

(async () => {
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5181', '--strictPort'], {
    cwd: root, windowsHide: true, stdio: 'ignore',
    env: { ...process.env, VITE_WEB3FORMS_ACCESS_KEY: 'browser-test-key' },
  });
  let browser;
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      if (server.exitCode !== null) throw Error('Test server failed to start; ensure port 5181 is free.');
      try { ready = (await fetch(base)).ok; } catch {}
      if (ready) break;
      await wait(200);
    }
    assert(ready, 'Test server did not become ready');
    browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    // Stub only the third-party CAPTCHA API. No actual verification or mail is sent.
    await page.addInitScript(() => {
      const widgets = new Map();
      let seq = 0;
      window.hcaptcha = {
        render(el, options) {
          const id = String(++seq);
          const button = document.createElement('button');
          button.type = 'button'; button.textContent = 'Complete test CAPTCHA';
          button.onclick = () => { widgets.get(id).token = 'verified-test-token'; options.callback(); };
          el.append(button); widgets.set(id, { el, options, token: '' }); return id;
        },
        reset(id) { const w = widgets.get(id); if(w) w.token = ''; },
        remove(id) { const w = widgets.get(id); if(w) w.el.replaceChildren(); widgets.delete(id); },
        getResponse(id) { return widgets.get(id)?.token || ''; },
        getRespKey() { return 'test-response-key'; },
      };
    });
    let requests = 0, responseStatus = 500, malformed = false, offline = false;
    await page.route('https://api.web3forms.com/**', async route => {
      requests++;
      const payload = route.request().postDataJSON();
      assert.equal(payload.access_key, 'browser-test-key');
      assert.equal(payload['h-captcha-response'], 'verified-test-token');
      if (offline) return route.abort('failed');
      await wait(100);
      await route.fulfill({ status: responseStatus, contentType: 'application/json', body: malformed ? 'not-json' : JSON.stringify({ success: responseStatus === 200 }) });
    });
    await page.goto(base);
    await page.getByRole('button', { name: 'what is your stack?' }).click();
    await page.getByText('Core: TypeScript / React / Node / Postgres.').waitFor();
    for (const width of [320,390,480,768,940,1024,1440]) {
      await page.setViewportSize({ width, height: 900 });
      for(const route of ['#/', '#/about']) {
        await page.goto(base+'/'+route);
        await page.locator(route === '#/' ? '#home' : '#about').waitFor();
        if (route === '#/about') await page.locator('#about h1.is-in').waitFor();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, 'Page overflow '+width+route);
      }
    }
    await page.goto(base);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.locator('.project-slide').count(), 6);
    assert.equal(await page.locator('.photo-placeholder').count(), 0);
    assert.equal(await page.getByRole('button', { name: 'Scroll projects left' }).isDisabled(), true);
    await page.locator('#project-rail').evaluate(el => el.scrollLeft = el.scrollWidth);
    await page.waitForFunction(() => document.querySelector('[aria-label="Next — scroll projects right"]').disabled);
    await page.locator('#project-rail').evaluate(el => el.scrollLeft = 0);
    await page.waitForFunction(() => document.querySelector('[aria-label="Previous — scroll projects left"]').disabled);
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.locator('#contact .cform.is-in').waitFor();
    await page.locator('input[name=name]').fill('Test visitor');
    await page.locator('input[name=email]').fill('test@example.com');
    await page.locator('textarea[name=message]').fill('Keep this draft after any failure.');
    await page.locator('.cform button[type=submit]').click();
    assert.match(await page.getByRole('alert').innerText(), /spam check/);
    assert.equal(requests, 0, 'Unverified CAPTCHA must block submission');
    for(const failure of ['500','429','malformed','offline']) {
      responseStatus = failure === '429' ? 429 : 500;
      malformed = failure === 'malformed'; offline = failure === 'offline';
      await page.getByRole('button', { name: 'Complete test CAPTCHA' }).click();
      const before = requests;
      await page.locator('.cform button[type=submit]').click();
      await page.waitForFunction(() => document.querySelector('.cform').getAttribute('aria-busy') === 'false');
      assert.equal(requests, before+1);
      assert.equal(await page.locator('textarea[name=message]').inputValue(), 'Keep this draft after any failure.');
      assert.equal(await page.locator('input[name=email]').inputValue(), 'test@example.com');
      assert(await page.getByRole('alert').innerText());
      await page.locator('.cform button[type=submit]').click();
      assert.equal(requests, before+1, 'Consumed CAPTCHA token must be cleared');
    }
    malformed = false; offline = false; responseStatus = 200;
    await page.getByRole('button', { name: 'Complete test CAPTCHA' }).click();
    await page.locator('.cform button[type=submit]').click();
    await page.getByRole('button', { name: 'send another' }).waitFor();
    assert.match(await page.locator('.cform [role=status]').innerText(), /Message sent/);
    await page.getByRole('button', { name: 'send another' }).click();
    assert.equal(await page.locator('textarea[name=message]').inputValue(), '');
    await page.getByRole('button', { name: 'Switch to light theme' }).click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    await page.getByRole('link', { name: 'about', exact: true }).click();
    await page.locator('#about').waitFor();
    assert.equal(await page.locator('.photo-card').count(), 0);
    assert.deepEqual(errors, []);
    console.log('PASS: terminal lazy-load, 14 responsive layouts, six projects, carousel edges, CAPTCHA validation/reset, four failure paths, retained drafts, success, theme, and navigation.');
  } finally {
    if(browser) await browser.close();
    server.kill();
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
