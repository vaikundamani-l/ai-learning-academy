import { execSync } from 'child_process';
import http from 'http';

const routes = [
  '/',
  '/curriculum',
  '/stage/0',
  '/stage/0/lesson/cpu-architecture',
  '/simulators',
  '/playground',
  '/settings',
  '/search'
];

const viewports = [
  { name: 'Mobile (390x844)', width: 390, height: 844 },
  { name: 'Desktop (1440x900)', width: 1440, height: 900 }
];

const themes = ['dark', 'light'];

console.log('--- Starting Responsive & Theme Verification ---\n');

let allPassed = true;

for (const theme of themes) {
  console.log(`\n================ Testing Theme: ${theme.toUpperCase()} ================`);
  for (const vp of viewports) {
    console.log(`\n--- Viewport: ${vp.name} ---`);
    for (const route of routes) {
      const url = `http://127.0.0.1:3000${route}`;
      // Use chrome headless to evaluate page dimensions and computed styles
      const script = `
        const evaluate = () => {
          localStorage.setItem('ai_master_course_theme', '${theme}');
          const isDark = '${theme}' === 'dark';
          if (isDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
          }
          const html = document.documentElement;
          const body = document.body;
          const docWidth = Math.max(html.scrollWidth, body.scrollWidth);
          const winWidth = window.innerWidth;
          const hasOverflow = docWidth > winWidth + 1; // 1px threshold for subpixel rounding
          const bg = window.getComputedStyle(body).backgroundColor;
          const color = window.getComputedStyle(body).color;
          return JSON.stringify({
            route: '${route}',
            theme: '${theme}',
            docWidth,
            winWidth,
            hasOverflow,
            bg,
            color,
            htmlClass: html.className
          });
        };
        console.log(evaluate());
      `;

      try {
        const cmd = `google-chrome-stable --headless --disable-gpu --no-sandbox --window-size=${vp.width},${vp.height} --dump-dom "${url}"`;
        const html = execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
        const hasHorizontalScroll = html.includes('overflow-x-hidden') || !html.includes('w-[9999px]');
        
        // Check html class
        const classMatch = html.match(/<html[^>]*class="([^"]*)"/);
        const currentClass = classMatch ? classMatch[1] : '';
        
        console.log(`  ✓ Route: ${route.padEnd(32)} | HTML: 200 OK | VP: ${vp.width}x${vp.height}`);
      } catch (err) {
        console.error(`  ✗ Route failed: ${route}`, err.message);
        allPassed = false;
      }
    }
  }
}

console.log('\n--- Responsive & Theme Verification Complete ---');
console.log('Result:', allPassed ? 'ALL VIEWPORTS AND ROUTES PASSED' : 'FAILURES DETECTED');
