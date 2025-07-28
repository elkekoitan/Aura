/**
 * Performance Testing Script for Aura Fashion App
 * Measures Core Web Vitals and performance metrics
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

class PerformanceTester {
  constructor(url = 'http://localhost:19006') {
    this.url = url;
    this.results = {
      timestamp: new Date().toISOString(),
      url,
      lighthouse: null,
      customMetrics: {},
      recommendations: [],
    };
  }

  async runLighthouseAudit() {
    console.log('🔍 Running Lighthouse audit...');
    
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
    };

    try {
      const runnerResult = await lighthouse(this.url, options);
      await chrome.kill();

      const { lhr } = runnerResult;
      
      this.results.lighthouse = {
        performance: lhr.categories.performance.score * 100,
        accessibility: lhr.categories.accessibility.score * 100,
        bestPractices: lhr.categories['best-practices'].score * 100,
        seo: lhr.categories.seo.score * 100,
        metrics: {
          firstContentfulPaint: lhr.audits['first-contentful-paint'].numericValue,
          largestContentfulPaint: lhr.audits['largest-contentful-paint'].numericValue,
          firstInputDelay: lhr.audits['max-potential-fid'].numericValue,
          cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].numericValue,
          speedIndex: lhr.audits['speed-index'].numericValue,
          totalBlockingTime: lhr.audits['total-blocking-time'].numericValue,
        },
        opportunities: lhr.audits['opportunities'] || [],
      };

      return this.results.lighthouse;
    } catch (error) {
      console.error('Lighthouse audit failed:', error);
      throw error;
    }
  }

  async measureCustomMetrics() {
    console.log('📊 Measuring custom performance metrics...');
    
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const puppeteer = require('puppeteer');
    
    try {
      const browser = await puppeteer.connect({
        browserURL: `http://localhost:${chrome.port}`,
      });
      
      const page = await browser.newPage();
      
      // Measure page load metrics
      const loadMetrics = await this.measurePageLoad(page);
      
      // Measure JavaScript bundle size
      const bundleMetrics = await this.measureBundleSize(page);
      
      // Measure image optimization
      const imageMetrics = await this.measureImageOptimization(page);
      
      // Measure animation performance
      const animationMetrics = await this.measureAnimationPerformance(page);
      
      this.results.customMetrics = {
        ...loadMetrics,
        ...bundleMetrics,
        ...imageMetrics,
        ...animationMetrics,
      };
      
      await browser.close();
      await chrome.kill();
      
      return this.results.customMetrics;
    } catch (error) {
      await chrome.kill();
      throw error;
    }
  }

  async measurePageLoad(page) {
    const startTime = Date.now();
    
    await page.goto(this.url, { waitUntil: 'networkidle0' });
    
    const loadTime = Date.now() - startTime;
    
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        totalLoadTime: loadTime,
      };
    });
    
    return { pageLoad: performanceMetrics };
  }

  async measureBundleSize(page) {
    await page.goto(this.url);
    
    const resourceSizes = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      let totalJSSize = 0;
      let totalCSSSize = 0;
      let totalImageSize = 0;
      
      resources.forEach(resource => {
        if (resource.name.includes('.js')) {
          totalJSSize += resource.transferSize || 0;
        } else if (resource.name.includes('.css')) {
          totalCSSSize += resource.transferSize || 0;
        } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
          totalImageSize += resource.transferSize || 0;
        }
      });
      
      return {
        totalJSSize: Math.round(totalJSSize / 1024), // KB
        totalCSSSize: Math.round(totalCSSSize / 1024), // KB
        totalImageSize: Math.round(totalImageSize / 1024), // KB
        resourceCount: resources.length,
      };
    });
    
    return { bundleSize: resourceSizes };
  }

  async measureImageOptimization(page) {
    await page.goto(this.url);
    
    const imageMetrics = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      let totalImages = images.length;
      let optimizedImages = 0;
      let lazyLoadedImages = 0;
      
      images.forEach(img => {
        // Check for modern formats
        if (img.src.includes('.webp') || img.src.includes('.avif')) {
          optimizedImages++;
        }
        
        // Check for lazy loading
        if (img.loading === 'lazy' || img.getAttribute('data-src')) {
          lazyLoadedImages++;
        }
      });
      
      return {
        totalImages,
        optimizedImages,
        lazyLoadedImages,
        optimizationRate: totalImages > 0 ? (optimizedImages / totalImages) * 100 : 0,
        lazyLoadRate: totalImages > 0 ? (lazyLoadedImages / totalImages) * 100 : 0,
      };
    });
    
    return { imageOptimization: imageMetrics };
  }

  async measureAnimationPerformance(page) {
    await page.goto(this.url);
    
    // Measure frame rate during animations
    const animationMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frameCount = 0;
        let startTime = performance.now();
        
        function countFrames() {
          frameCount++;
          if (performance.now() - startTime < 1000) {
            requestAnimationFrame(countFrames);
          } else {
            resolve({
              fps: frameCount,
              smoothAnimations: frameCount >= 55, // Close to 60fps
            });
          }
        }
        
        requestAnimationFrame(countFrames);
      });
    });
    
    return { animationPerformance: animationMetrics };
  }

  generateRecommendations() {
    const { lighthouse, customMetrics } = this.results;
    const recommendations = [];
    
    // Performance recommendations
    if (lighthouse.performance < 90) {
      recommendations.push({
        category: 'Performance',
        priority: 'High',
        issue: `Performance score is ${lighthouse.performance}/100`,
        solution: 'Optimize images, reduce JavaScript bundle size, implement code splitting',
      });
    }
    
    if (lighthouse.metrics.firstContentfulPaint > 2000) {
      recommendations.push({
        category: 'Performance',
        priority: 'High',
        issue: 'First Contentful Paint is slow',
        solution: 'Optimize critical rendering path, reduce server response time',
      });
    }
    
    if (lighthouse.metrics.largestContentfulPaint > 2500) {
      recommendations.push({
        category: 'Performance',
        priority: 'High',
        issue: 'Largest Contentful Paint is slow',
        solution: 'Optimize largest content elements, implement lazy loading',
      });
    }
    
    if (customMetrics.bundleSize?.totalJSSize > 500) {
      recommendations.push({
        category: 'Bundle Size',
        priority: 'Medium',
        issue: `JavaScript bundle is ${customMetrics.bundleSize.totalJSSize}KB`,
        solution: 'Implement code splitting, remove unused dependencies',
      });
    }
    
    if (customMetrics.imageOptimization?.optimizationRate < 50) {
      recommendations.push({
        category: 'Images',
        priority: 'Medium',
        issue: 'Low image optimization rate',
        solution: 'Convert images to WebP/AVIF format, implement responsive images',
      });
    }
    
    if (customMetrics.animationPerformance?.fps < 55) {
      recommendations.push({
        category: 'Animations',
        priority: 'Low',
        issue: 'Animation frame rate below 60fps',
        solution: 'Optimize animations, use CSS transforms, reduce animation complexity',
      });
    }
    
    this.results.recommendations = recommendations;
    return recommendations;
  }

  async runFullTest() {
    console.log('🚀 Starting Performance Testing for Aura Fashion App...\n');
    
    try {
      await this.runLighthouseAudit();
      await this.measureCustomMetrics();
      this.generateRecommendations();
      
      return this.generateReport();
    } catch (error) {
      console.error('❌ Performance testing failed:', error);
      throw error;
    }
  }

  generateReport() {
    const report = {
      ...this.results,
      summary: this.generateSummary(),
      deploymentReady: this.isDeploymentReady(),
    };
    
    // Save report
    const reportPath = path.join(__dirname, `performance-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📊 Performance Test Results:');
    console.log(`Performance Score: ${report.lighthouse.performance}/100`);
    console.log(`Accessibility Score: ${report.lighthouse.accessibility}/100`);
    console.log(`Best Practices Score: ${report.lighthouse.bestPractices}/100`);
    console.log(`SEO Score: ${report.lighthouse.seo}/100`);
    console.log(`\nFirst Contentful Paint: ${report.lighthouse.metrics.firstContentfulPaint}ms`);
    console.log(`Largest Contentful Paint: ${report.lighthouse.metrics.largestContentfulPaint}ms`);
    console.log(`Cumulative Layout Shift: ${report.lighthouse.metrics.cumulativeLayoutShift}`);
    
    if (report.recommendations.length > 0) {
      console.log('\n⚠️  Recommendations:');
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. [${rec.priority}] ${rec.issue}`);
        console.log(`   Solution: ${rec.solution}\n`);
      });
    }
    
    console.log(`\n📄 Report saved to: ${reportPath}`);
    console.log(`\n🎯 Deployment Ready: ${report.deploymentReady ? 'YES' : 'NO'}`);
    
    return report;
  }

  generateSummary() {
    const { lighthouse } = this.results;
    
    return {
      overallScore: Math.round((
        lighthouse.performance +
        lighthouse.accessibility +
        lighthouse.bestPractices +
        lighthouse.seo
      ) / 4),
      coreWebVitalsPass: 
        lighthouse.metrics.firstContentfulPaint < 2000 &&
        lighthouse.metrics.largestContentfulPaint < 2500 &&
        lighthouse.metrics.cumulativeLayoutShift < 0.1,
      performanceGrade: this.getPerformanceGrade(lighthouse.performance),
    };
  }

  getPerformanceGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  isDeploymentReady() {
    const { lighthouse, customMetrics } = this.results;
    
    return (
      lighthouse.performance >= 75 &&
      lighthouse.metrics.firstContentfulPaint < 3000 &&
      lighthouse.metrics.largestContentfulPaint < 4000 &&
      customMetrics.pageLoad?.totalLoadTime < 5000
    );
  }
}

// Run if called directly
if (require.main === module) {
  const url = process.argv[2] || 'http://localhost:19006';
  const tester = new PerformanceTester(url);
  
  tester.runFullTest()
    .then((report) => {
      process.exit(report.deploymentReady ? 0 : 1);
    })
    .catch((error) => {
      console.error('Performance testing failed:', error);
      process.exit(1);
    });
}

module.exports = PerformanceTester;
