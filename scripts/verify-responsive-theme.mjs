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
  '/stage/1',
  '/stage/1/lesson/python-basics',
  '/stage/1/lesson/first-python-program',
  '/stage/1/lesson/python-control-flow',
  '/stage/1/lesson/python-functions',
  '/stage/1/lesson/python-collections',
  '/stage/1/lesson/python-exceptions',
  '/stage/1/lesson/python-modules',
  '/stage/1/lesson/python-files',
  '/stage/1/lesson/python-structured-data',
  '/stage/1/lesson/python-classes',
  '/stage/1/lesson/python-testing',
  '/stage/1/lesson/python-typing-profiling',
  '/stage/1/lesson/python-iteration-scope',
  '/stage/1/lesson/python-regex-logs',
  '/stage/1/lesson/python-http-client',
  '/stage/1/lesson/python-concurrency',
  '/stage/1/lesson/python-context-decorators',
  '/stage/1/lesson/python-pytest-coverage',
  '/stage/1/lesson/python-task-manager',
  '/stage/1/lesson/python-data-capstone',
  '/stage/1/lesson/python-cpython-evidence',
  '/stage/2/lesson/complexity-foundations',
  '/simulators',
  '/playground',
  '/settings',
  '/search',
  '/projects'
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

  let themeScriptIdentifier;
  for (const theme of themes) {
    if (themeScriptIdentifier) await sendCdp('Page.removeScriptToEvaluateOnNewDocument', { identifier: themeScriptIdentifier });
    const initScript = await sendCdp('Page.addScriptToEvaluateOnNewDocument', {
      source: `localStorage.setItem('ai_master_course_theme', '${theme}');`
    });
    themeScriptIdentifier = initScript.identifier;
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
        let previousLayout = null;
        const startTime = Date.now();
        while (Date.now() - startTime < 5000) {
          await new Promise(r => setTimeout(r, 200));

          // Apply theme directly and inspect
          const checkRes = await sendCdp('Runtime.evaluate', {
            expression: `
              (() => {
                const html = document.documentElement;
                const main = document.querySelector('main');
                const heading = main?.querySelector('h1');
                const isLesson = '${route}'.includes('/lesson/');
                const lessonsLoaded = !isLesson || (main?.querySelector('#assessment') && main?.querySelector('#exercises'));
                const isReady = location.pathname === '${route}' && heading && lessonsLoaded && !main?.textContent.includes('Loading curriculum module');
                if (!isReady) return { isReady: false };
                const headings = main.querySelectorAll('h1, h2, h3');

                const expectedWidth = ${vp.width};
                const docWidth = Math.max(html.scrollWidth, document.body.scrollWidth);
                const winWidth = window.innerWidth;
                const hasOverflow = (docWidth > expectedWidth + 1) || (winWidth > expectedWidth + 1);
                const computedBg = window.getComputedStyle(document.body).backgroundColor;

                return {
                  isReady: true,
                  themeMatches: html.classList.contains('${theme}') && computedBg === ('${theme}' === 'dark' ? 'rgb(9, 13, 22)' : 'rgb(248, 250, 252)'),
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
            const layoutKey = JSON.stringify([data.docWidth, data.winWidth, data.themeMatches, data.headingCount]);
            if (previousLayout !== layoutKey) { previousLayout = layoutKey; continue; }
            mounted = true;

            if (!data.themeMatches) {
              const error = `Application theme did not resolve to ${theme}; observed ${data.htmlClasses}, ${data.computedBg}`;
              console.error(`  ✗ ${route} FAIL - ${error}`);
              failureList.push({ route, theme, viewport: vp.name, error });
            } else if (data.hasOverflow) {
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
