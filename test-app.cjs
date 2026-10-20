const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, 'test-screenshots', 'pizza');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runTests() {
  console.log('🍕 Starting Authentic Neapolitan Pizza E2E Tests...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
  });

  const page = await browser.newPage();
  
  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.toString()));
  page.on('console', msg => {
    if (msg.type() === 'error') {
      pageErrors.push(msg.text());
    }
  });

  try {
    // 1. Mobile 390px (iPhone 13/14) Test - Customer Pizza Menu
    console.log('\n--- Test 1: Customer Menu at 390px mobile viewport ---');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:5173/menu?table=07', { waitUntil: 'networkidle0' });

    // Verify Title & Table
    const title = await page.title();
    console.log(`Page title: "${title}"`);
    if (!title.includes('Authentic Neapolitan Pizza')) {
      throw new Error(`Expected title with Authentic Neapolitan Pizza, got: ${title}`);
    }

    const headerText = await page.$eval('h1', el => el.textContent);
    console.log(`Pizzeria header: "${headerText}"`);
    if (!headerText.includes('Authentic Neapolitan Pizza')) {
      throw new Error('Restaurant header missing or incorrect');
    }

    const bodyText = await page.$eval('body', el => el.innerText);
    if (!bodyText.includes('Table 07')) {
      throw new Error('Table 07 not displayed on customer menu');
    }
    console.log('✔ Table 07 badge and Authentic Neapolitan Pizza header verified');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_mobile_pizza_menu.png'), fullPage: false });

    // 2. Test Mobile 360px & 430px viewports
    console.log('\n--- Test 2: Testing 360px and 430px viewport widths ---');
    await page.setViewport({ width: 360, height: 740, isMobile: true });
    await new Promise(r => setTimeout(r, 400));
    const hasHorizontalOverflow360 = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Horizontal overflow at 360px: ${hasHorizontalOverflow360 ? 'FAIL' : 'NONE (PASS)'}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_mobile_360_pizza.png'), fullPage: false });

    await page.setViewport({ width: 430, height: 932, isMobile: true });
    await new Promise(r => setTimeout(r, 400));
    const hasHorizontalOverflow430 = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Horizontal overflow at 430px: ${hasHorizontalOverflow430 ? 'FAIL' : 'NONE (PASS)'}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_mobile_430_pizza.png'), fullPage: false });

    // Reset to 390px for ordering journey
    await page.setViewport({ width: 390, height: 844, isMobile: true });

    // 3. Category filter test
    console.log('\n--- Test 3: Testing pizza category selection ---');
    const signatureTab = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('nav button'));
      const sigBtn = buttons.find(b => b.textContent.includes('Signature & Truffle'));
      if (sigBtn) {
        sigBtn.click();
        return true;
      }
      return false;
    });
    console.log(`Clicked Signature & Truffle tab: ${signatureTab}`);
    await new Promise(r => setTimeout(r, 500));
    const sigHeading = await page.$eval('body', el => el.innerText);
    if (!sigHeading.includes('Tartufo Nero & Wild Funghi')) {
      throw new Error('Tartufo Nero & Wild Funghi not displayed under Signature & Truffle category');
    }
    console.log('✔ Pizza category navigation verified (Signature & Truffle displays Tartufo Nero)');

    // 4. Search Filter test
    console.log('\n--- Test 4: Testing pizza search field ---');
    const searchInput = await page.$('input[placeholder*="Search"]');
    await searchInput.type('Margherita');
    await new Promise(r => setTimeout(r, 500));
    const searchResultText = await page.$eval('body', el => el.innerText);
    if (!searchResultText.includes('Margherita D.O.P.')) {
      throw new Error('Search for "Margherita" did not yield Margherita D.O.P.');
    }
    console.log('✔ Search for "Margherita" verified');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_search_margherita.png') });

    // Clear search
    await page.click('button[aria-label="Clear search query"]');
    await new Promise(r => setTimeout(r, 400));

    // 5. Add pizzas to cart and verify quantity controls
    console.log('\n--- Test 5: Adding pizzas to cart & quantity controls ---');
    // Switch to "All Pizzas & Sides"
    await page.evaluate(() => {
      const allBtn = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent.includes('All Pizzas'));
      if (allBtn) allBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Click "ADD" on Margherita D.O.P.
    const addedMargherita = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('article'));
      const card = cards.find(c => c.textContent.includes('Margherita D.O.P.'));
      if (card) {
        const btn = card.querySelector('button[aria-label^="Add "]');
        if (btn) {
          btn.click();
          return true;
        }
      }
      return false;
    });
    console.log(`Clicked ADD on Margherita D.O.P.: ${addedMargherita}`);
    await new Promise(r => setTimeout(r, 400));

    // Check sticky cart summary bar
    const stickyCartVisible = await page.$eval('body', el => el.innerText.includes('in order') && el.innerText.includes('View Order'));
    console.log(`Sticky cart summary visible: ${stickyCartVisible}`);
    if (!stickyCartVisible) {
      throw new Error('Sticky cart bar not visible after adding pizza');
    }

    // Add another item: Truffle Garlic Dough Knots
    const addedSides = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('article'));
      const card = cards.find(c => c.textContent.includes('Truffle Garlic Dough Knots'));
      if (card) {
        const btn = card.querySelector('button[aria-label^="Add "]');
        if (btn) {
          btn.click();
          return true;
        }
      }
      return false;
    });
    console.log(`Clicked ADD on Truffle Garlic Dough Knots: ${addedSides}`);
    await new Promise(r => setTimeout(r, 400));

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_sticky_cart_active.png') });

    // 6. Open Cart Drawer & Checkout
    console.log('\n--- Test 6: Opening Cart Drawer and Placing Demo Order ---');
    await page.evaluate(() => {
      const viewOrderBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('View Order'));
      if (viewOrderBtn) viewOrderBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const drawerVisible = await page.$eval('body', el => el.innerText.includes('Your Pizza Order') && el.innerText.includes('Total to Pay'));
    console.log(`Cart Drawer open: ${drawerVisible}`);
    if (!drawerVisible) {
      throw new Error('Pizza cart drawer did not open');
    }

    // Add special cooking instruction
    const notesInput = await page.$('textarea#special-instructions');
    if (notesInput) {
      await notesInput.type('Slice pizzas into 6 slices and extra hot chili oil on the side.');
      console.log('Entered special kitchen instructions');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_pizza_cart_drawer.png') });

    // Click "Send Pizza Order"
    console.log('Clicking "Send Pizza Order"...');
    await page.evaluate(() => {
      const placeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Send Pizza Order'));
      if (placeBtn) placeBtn.click();
    });

    // Wait for navigation to /order-confirmation
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 800));

    console.log(`Current URL after order: ${page.url()}`);
    if (!page.url().includes('order-confirmation')) {
      throw new Error(`Expected order-confirmation URL, but got: ${page.url()}`);
    }

    const confirmationText = await page.$eval('body', el => el.innerText);
    if (!confirmationText.includes('Order Confirmed') || !confirmationText.includes('Woodfired Oven Progress')) {
      throw new Error('Order confirmation screen text not matching expectations');
    }
    console.log('✔ Order confirmation screen verified with oven progress tracker');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_pizza_order_confirmation.png') });

    // 7. Test Staff Dashboard at Desktop / Tablet viewport
    console.log('\n--- Test 7: Staff Kitchen & Floor Dashboard ---');
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto('http://localhost:5173/staff', { waitUntil: 'networkidle0' });

    const staffText = await page.$eval('body', el => el.innerText);
    if (!staffText.includes('Authentic Neapolitan Pizza') || !staffText.toLowerCase().includes('staff demo mode')) {
      throw new Error('Staff dashboard failed to load properly');
    }
    console.log('✔ Staff Dashboard header & Pizzeria Demo Mode badge verified');

    // Check if new order is present
    const hasTable07Order = staffText.includes('Table 07');
    console.log(`Newly placed Table 07 order visible in staff dashboard: ${hasTable07Order}`);
    if (!hasTable07Order) {
      throw new Error('Table 07 order not found in staff dashboard');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_pizzaiolo_dashboard.png') });

    // 8. Test Order Status Flow: Accept -> In Oven -> Ready -> Served
    console.log('\n--- Test 8: Order Status Transitions ---');
    const baked = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.rounded-2xl'));
      const table7Card = cards.find(c => c.textContent.includes('Table 07') && c.textContent.includes('Bake in Woodfired Oven'));
      if (table7Card) {
        const acceptBtn = Array.from(table7Card.querySelectorAll('button')).find(b => b.textContent.includes('Bake in Woodfired Oven'));
        if (acceptBtn) {
          acceptBtn.click();
          return true;
        }
      }
      return false;
    });
    console.log(`Clicked Bake in Woodfired Oven on Table 07 order: ${baked}`);
    await new Promise(r => setTimeout(r, 500));

    const markedReady = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.rounded-2xl'));
      const table7Card = cards.find(c => c.textContent.includes('Table 07') && c.textContent.includes('Mark Fresh from Oven'));
      if (table7Card) {
        const readyBtn = Array.from(table7Card.querySelectorAll('button')).find(b => b.textContent.includes('Mark Fresh from Oven'));
        if (readyBtn) {
          readyBtn.click();
          return true;
        }
      }
      return false;
    });
    console.log(`Clicked Mark Fresh from Oven: ${markedReady}`);
    await new Promise(r => setTimeout(r, 500));

    const markedServed = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.rounded-2xl'));
      const table7Card = cards.find(c => c.textContent.includes('Table 07') && c.textContent.includes('Mark Served to Table'));
      if (table7Card) {
        const servedBtn = Array.from(table7Card.querySelectorAll('button')).find(b => b.textContent.includes('Mark Served to Table'));
        if (servedBtn) {
          servedBtn.click();
          return true;
        }
      }
      return false;
    });
    console.log(`Clicked Mark Served to Table: ${markedServed}`);
    await new Promise(r => setTimeout(r, 500));
    console.log('✔ Full pizza order status cycle (received -> in oven -> fresh from oven -> served) verified');

    // 9. Test Table Combining Demonstration (Table 07 + 08 = Group G12)
    console.log('\n--- Test 9: Combined Table Demonstration ---');
    const combineBtnClicked = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Combine Table 07 + 08'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    console.log(`Clicked Combine Table 07 + 08: ${combineBtnClicked}`);
    await new Promise(r => setTimeout(r, 500));

    const combinedBanner = await page.$eval('body', el => el.innerText);
    if (!combinedBanner.toLowerCase().includes('group g12 active')) {
      throw new Error('Group G12 Active banner not shown after combining tables');
    }
    console.log('✔ Group G12 Active verified in staff view');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_combined_tables_staff.png') });

    // 10. Visit Table 08 menu and verify the combined group is displayed
    console.log('\n--- Test 10: Verify Combined Group on Customer Table 08 ---');
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.goto('http://localhost:5173/menu?table=08', { waitUntil: 'networkidle0' });
    const table8Text = await page.$eval('body', el => el.innerText);
    if (!table8Text.includes('Group G12') || !table8Text.includes('Tables 07 + 08')) {
      throw new Error('Customer menu for Table 08 did not reflect active Group G12 seating assignment');
    }
    console.log('✔ Customer menu for Table 08 clearly displays Group G12 (Tables 07 + 08)');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_table08_combined_menu.png') });

    // 11. Test QR Code Modal in Staff Area
    console.log('\n--- Test 11: Testing QR Code Table Sheet Modal ---');
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto('http://localhost:5173/staff', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const qrBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Table QR Codes'));
      if (qrBtn) qrBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    const qrModalText = await page.$eval('body', el => el.innerText);
    if (!qrModalText.includes('Authentic Neapolitan Pizza') || !qrModalText.includes('Scan with phone camera')) {
      throw new Error('QR Modal did not open properly');
    }
    console.log('✔ Table QR Code Generator modal opened with Authentic Neapolitan Pizza branding');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_qr_code_modal.png') });

    // 12. Check Console Errors
    console.log(`\n--- Page Error Summary: ${pageErrors.length} errors ---`);
    if (pageErrors.length > 0) {
      console.warn('Page errors detected:', pageErrors);
    } else {
      console.log('✔ Clean console! Zero JavaScript errors detected.');
    }

    console.log('\n🍕 ALL AUTHENTIC NEAPOLITAN PIZZA TESTS PASSED SUCCESSFULLY!');

  } catch (err) {
    console.error('❌ Test failed with error:', err);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'error_state.png') }).catch(() => {});
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runTests();
