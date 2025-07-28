/**
 * Automated Web Testing Script for Aura Fashion App
 * Tests critical functionality and performance metrics
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class AuraWebTester {
  constructor(baseUrl = 'http://localhost:19006') {
    this.baseUrl = baseUrl;
    this.browser = null;
    this.page = null;
    this.results = {
      timestamp: new Date().toISOString(),
      baseUrl,
      tests: [],
      performance: {},
      errors: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0,
      },
    };
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    this.page = await this.browser.newPage();
    
    // Set viewport for testing
    await this.page.setViewport({ width: 1280, height: 720 });
    
    // Enable request interception for performance monitoring
    await this.page.setRequestInterception(true);
    this.page.on('request', (request) => {
      request.continue();
    });
    
    // Listen for console errors
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        this.results.errors.push({
          type: 'console',
          message: msg.text(),
          timestamp: new Date().toISOString(),
        });
      }
    });
  }

  async runTest(name, testFunction) {
    console.log(`Running test: ${name}`);
    const startTime = Date.now();
    
    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      this.results.tests.push({
        name,
        status: 'passed',
        duration,
        result,
      });
      
      this.results.summary.passed++;
      console.log(`✅ ${name} - PASSED (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.results.tests.push({
        name,
        status: 'failed',
        duration,
        error: error.message,
      });
      
      this.results.summary.failed++;
      console.log(`❌ ${name} - FAILED (${duration}ms): ${error.message}`);
    }
    
    this.results.summary.total++;
  }

  async testPageLoad() {
    const startTime = Date.now();
    await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
    const loadTime = Date.now() - startTime;
    
    this.results.performance.pageLoad = loadTime;
    
    if (loadTime > 3000) {
      throw new Error(`Page load time ${loadTime}ms exceeds 3 second threshold`);
    }
    
    return { loadTime };
  }

  async testAuthentication() {
    // Test login form presence
    const loginButton = await this.page.$('[data-testid="login-button"], button:contains("Login"), button:contains("Sign In")');
    if (!loginButton) {
      throw new Error('Login button not found');
    }
    
    return { loginFormPresent: true };
  }

  async testProductCatalog() {
    // Navigate to products page
    await this.page.goto(`${this.baseUrl}/discover`);
    
    // Wait for products to load
    await this.page.waitForSelector('[data-testid="product-card"], .product-card', { timeout: 5000 });
    
    // Count products
    const productCards = await this.page.$$('[data-testid="product-card"], .product-card');
    
    if (productCards.length === 0) {
      throw new Error('No products found on catalog page');
    }
    
    return { productCount: productCards.length };
  }

  async testShoppingCart() {
    // Test cart icon presence
    const cartIcon = await this.page.$('[data-testid="cart-icon"], [data-testid="cart-button"]');
    if (!cartIcon) {
      throw new Error('Cart icon not found');
    }
    
    // Click cart icon
    await cartIcon.click();
    
    // Wait for cart to open
    await this.page.waitForTimeout(1000);
    
    return { cartAccessible: true };
  }

  async testResponsiveDesign() {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1280, height: 720, name: 'Desktop' },
    ];
    
    const results = {};
    
    for (const viewport of viewports) {
      await this.page.setViewport(viewport);
      await this.page.reload({ waitUntil: 'networkidle0' });
      
      // Check if page renders correctly
      const bodyHeight = await this.page.evaluate(() => document.body.scrollHeight);
      results[viewport.name] = {
        width: viewport.width,
        height: viewport.height,
        bodyHeight,
        rendered: bodyHeight > 0,
      };
    }
    
    return results;
  }

  async testGlassmorphismUI() {
    // Check for glass effect elements
    const glassElements = await this.page.$$eval(
      '[class*="glass"], [style*="backdrop-filter"], [style*="background: rgba"]',
      (elements) => elements.length
    );
    
    if (glassElements === 0) {
      throw new Error('No glassmorphism elements found');
    }
    
    return { glassElementsCount: glassElements };
  }

  async testPerformanceMetrics() {
    const metrics = await this.page.metrics();
    const performanceEntries = await this.page.evaluate(() => {
      return JSON.parse(JSON.stringify(performance.getEntriesByType('navigation')));
    });
    
    const navigation = performanceEntries[0];
    
    this.results.performance = {
      ...this.results.performance,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstPaint: navigation.loadEventEnd - navigation.loadEventStart,
      jsHeapUsedSize: metrics.JSHeapUsedSize,
      jsHeapTotalSize: metrics.JSHeapTotalSize,
    };
    
    return this.results.performance;
  }

  async testCrossBrowserCompatibility() {
    // This would require multiple browser instances
    // For now, just test current browser capabilities
    const capabilities = await this.page.evaluate(() => {
      return {
        webgl: !!window.WebGLRenderingContext,
        webrtc: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        serviceWorker: 'serviceWorker' in navigator,
        localStorage: typeof Storage !== 'undefined',
        webAssembly: typeof WebAssembly === 'object',
      };
    });
    
    return capabilities;
  }

  async runAllTests() {
    console.log('🚀 Starting Aura Fashion App Web Tests...\n');
    
    await this.init();
    
    // Core functionality tests
    await this.runTest('Page Load Performance', () => this.testPageLoad());
    await this.runTest('Authentication System', () => this.testAuthentication());
    await this.runTest('Product Catalog', () => this.testProductCatalog());
    await this.runTest('Shopping Cart', () => this.testShoppingCart());
    
    // UI/UX tests
    await this.runTest('Responsive Design', () => this.testResponsiveDesign());
    await this.runTest('Glassmorphism UI', () => this.testGlassmorphismUI());
    
    // Performance tests
    await this.runTest('Performance Metrics', () => this.testPerformanceMetrics());
    await this.runTest('Browser Compatibility', () => this.testCrossBrowserCompatibility());
    
    await this.cleanup();
    return this.generateReport();
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  generateReport() {
    const report = {
      ...this.results,
      passRate: (this.results.summary.passed / this.results.summary.total) * 100,
      recommendation: this.getRecommendation(),
    };
    
    // Save report to file
    const reportPath = path.join(__dirname, `test-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📊 Test Results Summary:');
    console.log(`Total Tests: ${report.summary.total}`);
    console.log(`Passed: ${report.summary.passed}`);
    console.log(`Failed: ${report.summary.failed}`);
    console.log(`Pass Rate: ${report.passRate.toFixed(1)}%`);
    console.log(`\n📄 Report saved to: ${reportPath}`);
    
    return report;
  }

  getRecommendation() {
    const { summary, performance } = this.results;
    const passRate = (summary.passed / summary.total) * 100;
    
    if (passRate >= 90 && performance.pageLoad < 3000) {
      return 'APPROVED: Ready for mobile app store submission';
    } else if (passRate >= 75) {
      return 'CONDITIONAL: Fix critical issues before mobile submission';
    } else {
      return 'REJECTED: Major issues must be resolved before deployment';
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const baseUrl = process.argv[2] || 'http://localhost:19006';
  const tester = new AuraWebTester(baseUrl);
  
  tester.runAllTests()
    .then((report) => {
      console.log(`\n🎯 Final Recommendation: ${report.recommendation}`);
      process.exit(report.passRate >= 75 ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = AuraWebTester;
