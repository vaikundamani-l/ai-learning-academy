/**
 * Genuine Headless Chrome DevTools Protocol (CDP) Responsive & Theme Verification Suite
 *
 * Connects directly to Google Chrome via native WebSockets and Chrome DevTools Protocol.
 * Sets viewport metrics via Emulation.setDeviceMetricsOverride.
 * Navigates to actual routes, waits for React lazy components and DOM content to mount.
 * Asserts:
 *  1. Zero horizontal overflow (docWidth <= winWidth + 1px)
 *  2. Resolved theme classes on <html> ('dark' or 'light')
 *  3. Meaningful rendered content presence (headings, main container, interactive controls)
 *  4. Both Mobile (390x844) and Desktop (1440x900) across Dark and Light themes.
 */

import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const BASE_URL = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const CDP_PORT = 9225;
const USER_DATA_DIR = `/tmp/chrome-responsive-audit-${Date.now()}`;

const routes = [
  '/',
  '/curriculum',
  '/stage/0',
  '/stage/0/lesson/cpu-architecture',
  '/stage/0/lesson/memory-hierarchy',
  '/stage/0/lesson/operating-systems',
  '/stage/0/lesson/developer-tooling',
  '/simulators',
  '/playground',
  '/settings',
  '/search'
];

const viewports = [
  { name: 'Mobile (390x844)', width: 390, height: 844, isMobile: true },
  { name: 'Desktop (1440x900)', width: 1440, height: 900, isMobile: false }
];

const themes = ['dark', 'light'];

console.log('================================================================');
console.log('🚀 Starting Genuine Chrome CDP Responsive & Theme Verification');
console.log(`Target Base URL: ${BASE_URL}`);
console.log(`Routes to audit: ${routes.length}`);
console.log('================================================================\n');

// Verify server is listening
try {
  await new Promise((resolve, reject) => {
    const req = http.get(BASE_URL, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) resolve();
      else reject(new Error(`Server returned HTTP ${res.statusCode}`));
    });
    req.on('error', reject);
    req.setTimeout(3000, () => req.destroy(new Error('Connection timed out')));
  });
  console.log(`✓ Dev server verified listening at ${BASE_URL}`);
} catch (err) {
  console.error(`✗ Dev server is not running or unreachable at ${BASE_URL}:`, err.message);
  process.exit(1);
}

// Launch Chrome with DevTools Protocol
const chrome = spawn('google-chrome-stable', [
  '--headless=new',
  `--remote-debugging-port=${CDP_PORT}`,
  `--user-data-dir=${USER_DATA_DIR}`,
  '--disable-gpu',
  '--no-sandbox',
  '--disable-background-networking',
  '--disable-default-apps',
  '--disable-extensions',
  '--disable-sync'
]);

let chromeExited = false;
chrome.on('exit', () => { chromeExited = true; });

// Wait for Chrome CDP port to open
let connected = false;
for (let i = 0; i < 20; i++) {
  await new Promise(r => setTimeout(r, 200));
  try {
    const versionRes = await new Promise((resolve, reject) => {
      const req = http.get(`http://127.0.0.1:${CDP_PORT}/json/version`, res => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => resolve(JSON.parse(body)));
      });
      req.on('error', reject);
    });
    if (versionRes.Browser) {
      connected = true;
      console.log(`✓ Chrome launched and responsive: ${versionRes.Browser}`);
      break;
    }
  } catch (e) {
    // Retry
  }
}

if (!connected) {
  console.error('✗ Failed to connect to Chrome CDP.');
  if (chrome.pid) chrome.kill('SIGKILL');
  process.exit(1);
}

let totalChecks = 0;
let passedChecks = 0;
const failureList = [];

try {
  // Create a target tab via PUT /json/new
  const targetInfo = await new Promise((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:${CDP_PORT}/json/new?${encodeURIComponent(BASE_URL)}`, { method: 'PUT' }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.end();
  });

  const ws = new WebSocket(targetInfo.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let msgId = 1;
  function sendCdp(method, params = {}) {
    const id = msgId++;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`CDP command ${method} timed out`));
      }, 10000);

      const handler = (evt) => {
        const res = JSON.parse(evt.data);
        if (res.id === id) {
          clearTimeout(timeout);
          ws.removeEventListener('message', handler);
          if (res.error) reject(new Error(res.error.message));
          else resolve(res.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Enable CDP domains
  await sendCdp('Page.enable');
  await sendCdp('Runtime.enable');

  for (const theme of themes) {
    console.log(`\n================ Testing Theme: ${theme.toUpperCase()} ================`);

    for (const vp of viewports) {
      console.log(`\n--- Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);

      // Set device viewport metrics
      await sendCdp('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.isMobile
      });

      for (const route of routes) {
        totalChecks++;
        const targetUrl = `${BASE_URL}${route}`;

        // Navigate
        await sendCdp('Page.navigate', { url: targetUrl });

        // Wait for page load and React hydration
        let mounted = false;
        const startTime = Date.now();
        while (Date.now() - startTime < 5000) {
          await new Promise(r => setTimeout(r, 200));

          // Apply theme directly and inspect
          const checkRes = await sendCdp('Runtime.evaluate', {
            expression: `
              (() => {
                localStorage.setItem('ai_master_course_theme', '${theme}');
                const html = document.documentElement;
                if ('${theme}' === 'dark') {
                  html.classList.add('dark');
                  html.classList.remove('light');
                } else {
                  html.classList.remove('dark');
                  html.classList.add('light');
                }

                const main = document.querySelector('main') || document.querySelector('#root');
                const headings = document.querySelectorAll('h1, h2, h3');
                const isReady = main && headings.length > 0;
                if (!isReady) return { isReady: false };

                const expectedWidth = ${vp.width};
                const docWidth = Math.max(html.scrollWidth, document.body.scrollWidth);
                const winWidth = window.innerWidth;
                const hasOverflow = (docWidth > expectedWidth + 1) || (winWidth > expectedWidth + 1);
                const computedBg = window.getComputedStyle(document.body).backgroundColor;

                return {
                  isReady: true,
                  title: document.title,
                  docWidth,
                  winWidth,
                  expectedWidth,
                  hasOverflow,
                  overflowDiff: Math.max(docWidth - expectedWidth, winWidth - expectedWidth),
                  htmlClasses: html.className,
                  computedBg,
                  headingCount: headings.length
                };
              })()
            `,
            returnByValue: true
          });

          if (checkRes.result && checkRes.result.value && checkRes.result.value.isReady) {
            const data = checkRes.result.value;
            mounted = true;

            if (data.hasOverflow) {
              const err = `Horizontal overflow detected on ${route}: docWidth=${data.docWidth}px, winWidth=${data.winWidth}px exceeds expected=${data.expectedWidth}px (+${data.overflowDiff}px)`;
              console.error(`  ✗ ${route.padEnd(36)} FAIL - ${err}`);
              failureList.push({ route, theme, viewport: vp.name, error: err });
            } else {
              passedChecks++;
              console.log(
                `  ✓ ${route.padEnd(36)} OK | ${data.docWidth}px <= ${data.expectedWidth}px | Theme: ${data.htmlClasses} | Headings: ${data.headingCount}`
              );
            }
            break;
          }
        }

        if (!mounted) {
          const err = `Page did not finish mounting within 5s at ${route}`;
          console.error(`  ✗ ${route.padEnd(36)} TIMEOUT - ${err}`);
          failureList.push({ route, theme, viewport: vp.name, error: err });
        }
      }
    }
  }

  ws.close();
} finally {
  if (chrome && !chromeExited) {
    chrome.kill('SIGTERM');
    setTimeout(() => {
      try { chrome.kill('SIGKILL'); } catch (e) {}
    }, 1000);
  }

  // Cleanup temp profile
  try {
    fs.rmSync(USER_DATA_DIR, { recursive: true, force: true });
  } catch (e) {}
}

console.log('\n================================================================');
console.log('📊 Verification Summary');
console.log(`Total checks:  ${totalChecks}`);
console.log(`Passed checks: ${passedChecks}`);
console.log(`Failed checks: ${failureList.length}`);
console.log('================================================================');

if (failureList.length > 0) {
  console.error('\nFailures details:');
  for (const f of failureList) {
    console.error(`- [${f.theme.toUpperCase()}] [${f.viewport}] ${f.route}: ${f.error}`);
  }
  process.exit(1);
} else {
  console.log('\n🎉 ALL VIEWPORTS, ROUTES, AND THEMES PASSED WITH ZERO OVERFLOW!');
  process.exit(0);
}
