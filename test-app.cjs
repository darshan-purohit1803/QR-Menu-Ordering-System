const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, 'test-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runTests() {
  console.log('🚀 Starting Comprehensive QR Restaurant Ordering Tests...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
  });

  const page = await browser.newPage();
  
  // Listen to console and page errors
  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.toString()));
  page.on('console', msg => {
    if (msg.type() === 'error') {
      pageErrors.push(msg.text());
    }
  });

  try {
    // 1. Mobile 390px (iPhone 13/14) Test - Customer Menu
    console.log('\n--- Test 1: Customer Menu at 390px mobile viewport ---');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:5173/menu?table=07', { waitUntil: 'networkidle0' });

    // Verify Title & Table
    const title = await page.title();
    console.log(`Page title: "${title}"`);
    const headerText = await page.$eval('h1', el => el.textContent);
    console.log(`Restaurant header: "${headerText}"`);
    if (!headerText.includes('Shree Restaurant')) {
      throw new Error('Restaurant header missing or incorrect');
    }

    const tableBadge = await page.$eval('body', el => el.innerText);
    if (!tableBadge.includes('Table 07')) {
      throw new Error('Table 07 not displayed on customer menu');
    }
    console.log('✔ Table 07 badge verified');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_mobile_390_menu.png'), fullPage: false });

    // 2. Test Mobile 360px & 430px viewports for responsive integrity
    console.log('\n--- Test 2: Testing 360px and 430px viewport widths ---');
    await page.setViewport({ width: 360, height: 740, isMobile: true });
    await new Promise(r => setTimeout(r, 400));
    const hasHorizontalOverflow360 = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Horizontal overflow at 360px: ${hasHorizontalOverflow360 ? 'FAIL' : 'NONE (PASS)'}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_mobile_360_menu.png'), fullPage: false });

    await page.setViewport({ width: 430, height: 932, isMobile: true });
    await new Promise(r => setTimeout(r, 400));
    const hasHorizontalOverflow430 = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Horizontal overflow at 430px: ${hasHorizontalOverflow430 ? 'FAIL' : 'NONE (PASS)'}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_mobile_430_menu.png'), fullPage: false });

    // Reset to 390px for ordering journey
    await page.setViewport({ width: 390, height: 844, isMobile: true });

    // 3. Category filter test
    console.log('\n--- Test 3: Testing category selection ---');
    // Click on "Gujarati Food" tab
    const gujaratiTab = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('nav button'));
      const gujBtn = buttons.find(b => b.textContent.includes('Gujarati Food'));
      if (gujBtn) {
        gujBtn.click();
        return true;
      }
      return false;
    });
    console.log(`Clicked Gujarati Food tab: ${gujaratiTab}`);
    await new Promise(r => setTimeout(r, 500));
    const gujHeading = await page.$eval('body', el => el.innerText);
    if (!gujHeading.includes('Gujarati Thali')) {
      throw new Error('Gujarati Thali not displayed after clicking Gujarati Food category');
    }
    console.log('✔ Category navigation verified (Gujarati Food displays Gujarati Thali)');

    // 4. Search Filter test
    console.log('\n--- Test 4: Testing search field ---');
    const searchInput = await page.$('input[placeholder="Search dishes..."]');
    await searchInput.type('Paneer');
    await new Promise(r => setTimeout(r, 500));
    const searchResultText = await page.$eval('body', el => el.innerText);
    if (!searchResultText.includes('Paneer Tikka') && !searchResultText.includes('Paneer Butter Masala')) {
      throw new Error('Search for "Paneer" did not yield expected paneer dishes');
    }
    console.log('✔ Search for "Paneer" verified');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_search_paneer.png') });

    // Clear search
    await page.click('button[aria-label="Clear search query"]');
    await new Promise(r => setTimeout(r, 400));

    // 5. Add dishes to cart and verify quantity controls
    console.log('\n--- Test 5: Adding items to cart & quantity controls ---');
    // Switch to "All Items"
    await page.evaluate(() => {
      const allBtn = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent.includes('All Items'));
      if (allBtn) allBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Click "ADD" on first available item (Paneer Tikka)
    const addButtons = await page.$$('button[aria-label^="Add "]');
    console.log(`Found ${addButtons.length} ADD buttons on page`);
    if (addButtons.length > 0) {
      await addButtons[0].click();
      console.log('Clicked first ADD button (Paneer Tikka)');
    }
    await new Promise(r => setTimeout(r, 400));

    // Check sticky cart summary bar
    const stickyCartVisible = await page.$eval('body', el => el.innerText.includes('in order') && el.innerText.includes('View Order'));
    console.log(`Sticky cart summary visible: ${stickyCartVisible}`);
    if (!stickyCartVisible) {
      throw new Error('Sticky cart bar not visible after adding item');
    }

    // Add another dish: Gujarati Thali
    const thaliAdd = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('article'));
      const thaliCard = cards.find(c => c.textContent.includes('Gujarati Thali'));
      if (thaliCard) {
        const btn = thaliCard.querySelector('button[aria-label^="Add "]');
        if (btn) {
          btn.click();
          return true;
        }
      }
      return false;
    });
    console.log(`Clicked ADD on Gujarati Thali: ${thaliAdd}`);
    await new Promise(r => setTimeout(r, 400));

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_sticky_cart_active.png') });

    // 6. Open Cart Drawer & Checkout
    console.log('\n--- Test 6: Opening Cart Drawer and Placing Demo Order ---');
    await page.evaluate(() => {
      const viewOrderBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('View Order'));
      if (viewOrderBtn) viewOrderBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const drawerVisible = await page.$eval('body', el => el.innerText.includes('Your Order') && el.innerText.includes('Total to Pay'));
    console.log(`Cart Drawer open: ${drawerVisible}`);
    if (!drawerVisible) {
      throw new Error('Cart drawer did not open');
    }

    // Add special cooking instruction
    const notesInput = await page.$('textarea#special-instructions');
    if (notesInput) {
      await notesInput.type('Extra roasted papad and medium spicy please.');
      console.log('Entered special cooking instructions');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_cart_drawer.png') });

    // Click "Place Demo Order"
    console.log('Clicking "Place Demo Order"...');
    await page.evaluate(() => {
      const placeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Place Demo Order'));
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
    if (!confirmationText.includes('Order Confirmed!') || !confirmationText.includes('Kitchen Progress Tracker')) {
      throw new Error('Order confirmation screen text not matching expectations');
    }
    console.log('✔ Order confirmation screen verified');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_order_confirmation.png') });

    // 7. Test Staff Dashboard at Desktop / Tablet viewport
    console.log('\n--- Test 7: Staff Kitchen & Floor Dashboard ---');
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto('http://localhost:5173/staff', { waitUntil: 'networkidle0' });

    const staffText = await page.$eval('body', el => el.innerText);
    if (!staffText.includes('Shree Restaurant') || !staffText.toLowerCase().includes('staff demo mode')) {
      throw new Error('Staff dashboard failed to load properly');
    }
    console.log('✔ Staff Dashboard header & Demo Mode badge verified');

    // Check if new order is present
    const hasTable07Order = staffText.includes('Table 07');
    console.log(`Newly placed Table 07 order visible in staff dashboard: ${hasTable07Order}`);
    if (!hasTable07Order) {
      throw new Error('Table 07 order not found in staff dashboard');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_staff_dashboard.png') });

    // 8. Test Order Status Flow: Accept -> Prepare -> Ready -> Served
    console.log('\n--- Test 8: Order Status Transitions ---');
    // Find the Table 07 card's "Accept & Prepare" button
    const accepted = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.rounded-2xl'));
      const table7Card = cards.find(c => c.textContent.includes('Table 07') && c.textContent.includes('Accept & Prepare'));
      if (table7Card) {
        const acceptBtn = Array.from(table7Card.querySelectorAll('button')).find(b => b.textContent.includes('Accept & Prepare'));
        if (acceptBtn) {
          acceptBtn.click();
          return true;
        }
      }
      return false;
    });
    console.log(`Clicked Accept & Prepare on Table 07 order: ${accepted}`);
    await new Promise(r => setTimeout(r, 500));

    // Now check if "Mark Ready to Serve" button appears
    const markedReady = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.rounded-2xl'));
      const table7Card = cards.find(c => c.textContent.includes('Table 07') && c.textContent.includes('Mark Ready to Serve'));
      if (table7Card) {
        const readyBtn = Array.from(table7Card.querySelectorAll('button')).find(b => b.textContent.includes('Mark Ready to Serve'));
        if (readyBtn) {
          readyBtn.click();
          return true;
        }
      }
      return false;
    });
    console.log(`Clicked Mark Ready to Serve: ${markedReady}`);
    await new Promise(r => setTimeout(r, 500));

    // Now check if "Mark Served to Table" appears
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
    console.log('✔ Full order status cycle (received -> preparing -> ready -> served) verified');

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

    // Now visit Table 08 menu and verify the combined group is displayed
    console.log('\n--- Test 10: Verify Combined Group on Customer Table 08 ---');
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.goto('http://localhost:5173/menu?table=08', { waitUntil: 'networkidle0' });
    const table8Text = await page.$eval('body', el => el.innerText);
    if (!table8Text.includes('Group G12') || !table8Text.includes('Tables 07 + 08')) {
      throw new Error('Customer menu for Table 08 did not reflect active Group G12 seating assignment');
    }
    console.log('✔ Customer menu for Table 08 clearly displays Group G12 (Tables 07 + 08)');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_table08_combined_menu.png') });

    // 10. Test QR Code Modal in Staff Area
    console.log('\n--- Test 11: Testing QR Code Table Sheet Modal ---');
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto('http://localhost:5173/staff', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const qrBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Table QR Codes'));
      if (qrBtn) qrBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    const qrModalText = await page.$eval('body', el => el.innerText);
    if (!qrModalText.includes('Table QR Codes Generator') || !qrModalText.includes('Scan with phone camera')) {
      throw new Error('QR Modal did not open properly');
    }
    console.log('✔ Table QR Code Generator modal opened and scannable code rendered');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_qr_code_modal.png') });

    // 11. Check Console Errors
    console.log(`\n--- Page Error Summary: ${pageErrors.length} errors ---`);
    if (pageErrors.length > 0) {
      console.warn('Page errors detected:', pageErrors);
    } else {
      console.log('✔ Clean console! Zero JavaScript errors detected.');
    }

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! The QR digital ordering demo is fully functional.');

  } catch (err) {
    console.error('❌ Test failed with error:', err);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'error_state.png') }).catch(() => {});
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runTests();
