const { chromium } = require('playwright-core');

const url = process.argv[2] || 'http://127.0.0.1:4173/';
const profile = process.argv[3] || 'mobile';
const screenshot = process.argv[4];
const mobile = profile === 'mobile';

(async () => {
  const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
  });
  const page = await context.newPage();
  const session = await context.newCDPSession(page);
  await session.send('Network.emulateNetworkConditions', mobile
    ? { offline: false, latency: 150, downloadThroughput: 1_600_000 / 8, uploadThroughput: 750_000 / 8, connectionType: 'cellular4g' }
    : { offline: false, latency: 40, downloadThroughput: 10_000_000 / 8, uploadThroughput: 5_000_000 / 8, connectionType: 'wifi' });
  await session.send('Emulation.setCPUThrottlingRate', { rate: mobile ? 4 : 1 });
  await page.addInitScript(() => {
    window.__audit = { lcp: null, cls: 0, longTasks: [] };
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const entry = entries[entries.length - 1];
      window.__audit.lcp = entry ? {
        time: entry.startTime,
        size: entry.size,
        url: entry.url || '',
        tag: entry.element?.tagName || '',
        text: (entry.element?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 160),
        className: entry.element?.className || '',
      } : null;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__audit.cls += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__audit.longTasks.push(Math.round(entry.duration));
    }).observe({ type: 'longtask', buffered: true });
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  if (screenshot) {
    await page.screenshot({
      path: screenshot,
      type: screenshot.toLowerCase().endsWith('.jpg') ? 'jpeg' : 'png',
      quality: screenshot.toLowerCase().endsWith('.jpg') ? 70 : undefined,
    });
  }
  const result = await page.evaluate(() => {
    const rgb = (value) => (value.match(/[\d.]+/g) || []).slice(0, 4).map(Number);
    const luminance = ([r, g, b]) => {
      const linear = [r, g, b].map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    };
    const contrast = (first, second) => {
      const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
      return (values[0] + 0.05) / (values[1] + 0.05);
    };
    const backgroundFor = (element) => {
      let current = element;
      while (current) {
        const value = rgb(getComputedStyle(current).backgroundColor);
        if (value.length >= 3 && (value[3] === undefined || value[3] >= 0.95)) return value;
        current = current.parentElement;
      }
      return [255, 255, 255];
    };
    const lowContrastLinks = [...document.querySelectorAll('a')]
      .filter((link) => link.getClientRects().length && getComputedStyle(link).visibility !== 'hidden')
      .map((link) => {
        const ratio = contrast(rgb(getComputedStyle(link).color), backgroundFor(link));
        return { text: link.textContent.trim().replace(/\s+/g, ' ').slice(0, 80), ratio: Number(ratio.toFixed(2)) };
      })
      .filter((link) => link.ratio < 4.5);
    const nav = performance.getEntriesByType('navigation')[0];
    const paints = Object.fromEntries(performance.getEntriesByType('paint').map((entry) => [entry.name, Math.round(entry.startTime)]));
    const resources = performance.getEntriesByType('resource');
    return {
      ...window.__audit,
      fcp: paints['first-contentful-paint'] || null,
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
      load: Math.round(nav.loadEventEnd),
      transferBytes: Math.round(resources.reduce((sum, entry) => sum + entry.transferSize, 0)),
      decodedBytes: Math.round(resources.reduce((sum, entry) => sum + entry.decodedBodySize, 0)),
      resources: resources.length,
      lowContrastLinks,
      scripts: resources.filter((entry) => entry.initiatorType === 'script').map((entry) => ({ name: entry.name, transferSize: entry.transferSize })),
    };
  });
  console.log(JSON.stringify({ profile, ...result }, null, 2));
  await browser.close();
})().catch((error) => { console.error(error); process.exitCode = 1; });
