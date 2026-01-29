/* Usage:
 *   node scripts/screenshot-section.js <url> <cssSelector> <outputPath>
 * Example:
 *   node scripts/screenshot-section.js http://localhost:7060/ "#what-is-unchained" screenshots/what_is_unchained.png
 */

const { chromium } = require('playwright');

(async () => {
  const [url, selector, outPath] = process.argv.slice(2);
  if (!url || !selector || !outPath) {
    console.error('Usage: node scripts/screenshot-section.js <url> <cssSelector> <outputPath>');
    process.exit(2);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(url, { waitUntil: 'networkidle' });
  const locator = page.locator(selector).first();
  await locator.waitFor({ state: 'visible', timeout: 30000 });
  await locator.scrollIntoViewIfNeeded();

  // Small extra wait for layout settling
  await page.waitForTimeout(250);

  await locator.screenshot({ path: outPath });
  await browser.close();
})();
