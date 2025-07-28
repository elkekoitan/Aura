/**
 * Deployment Validation Script for Aura Fashion App
 * Comprehensive validation before production deployment
 */

const AuraWebTester = require('./automated-web-tests');
const PerformanceTester = require('./performance-test');
const BrowserCompatibilityTester = require('./browser-compatibility');
const fs = require('fs');
const path = require('path');

class DeploymentValidator {
  constructor(baseUrl = 'http://localhost:19006') {
    this.baseUrl = baseUrl;
    this.results = {
      timestamp: new Date().toISOString(),
      baseUrl,
      validation: {
        functional: null,
        performance: null,
        compatibility: null,
      },
      overallScore: 0,
      deploymentDecision: 'PENDING',
      criticalIssues: [],
      recommendations: [],
    };
  }

  async validateFunctionality() {
    console.log('🧪 Running Functional Tests...\n');
    
    try {
      const tester = new AuraWebTester(this.baseUrl);
      const functionalResults = await tester.runAllTests();
      
      this.results.validation.functional = {
        passRate: functionalResults.passRate,
        totalTests: functionalResults.summary.total,
        passedTests: functionalResults.summary.passed,
        failedTests: functionalResults.summary.failed,
        errors: functionalResults.errors,
        recommendation: functionalResults.recommendation,
      };
      
      return functionalResults;
    } catch (error) {
      console.error('❌ Functional testing failed:', error);
      this.results.criticalIssues.push({
        category: 'Functional',
        severity: 'Critical',
        issue: 'Functional tests failed to execute',
        details: error.message,
      });
      throw error;
    }
  }

  async validatePerformance() {
    console.log('⚡ Running Performance Tests...\n');
    
    try {
      const tester = new PerformanceTester(this.baseUrl);
      const performanceResults = await tester.runFullTest();
      
      this.results.validation.performance = {
        lighthouseScore: performanceResults.lighthouse.performance,
        coreWebVitals: performanceResults.summary.coreWebVitalsPass,
        loadTime: performanceResults.lighthouse.metrics.firstContentfulPaint,
        deploymentReady: performanceResults.deploymentReady,
        recommendations: performanceResults.recommendations,
      };
      
      return performanceResults;
    } catch (error) {
      console.error('❌ Performance testing failed:', error);
      this.results.criticalIssues.push({
        category: 'Performance',
        severity: 'Critical',
        issue: 'Performance tests failed to execute',
        details: error.message,
      });
      throw error;
    }
  }

  async validateCompatibility() {
    console.log('🌐 Running Browser Compatibility Tests...\n');
    
    try {
      const tester = new BrowserCompatibilityTester(this.baseUrl);
      const compatibilityResults = await tester.runAllTests();
      
      this.results.validation.compatibility = {
        compatibilityScore: compatibilityResults.summary.compatibilityScore,
        browsersSupported: compatibilityResults.summary.passedTests,
        browsersFailed: compatibilityResults.summary.failedTests,
        deploymentReady: compatibilityResults.deploymentReady,
        recommendations: compatibilityResults.recommendations,
      };
      
      return compatibilityResults;
    } catch (error) {
      console.error('❌ Compatibility testing failed:', error);
      this.results.criticalIssues.push({
        category: 'Compatibility',
        severity: 'Critical',
        issue: 'Browser compatibility tests failed to execute',
        details: error.message,
      });
      throw error;
    }
  }

  analyzeResults() {
    const { functional, performance, compatibility } = this.results.validation;
    
    // Calculate overall score
    let totalScore = 0;
    let scoreCount = 0;
    
    if (functional) {
      totalScore += functional.passRate;
      scoreCount++;
    }
    
    if (performance) {
      totalScore += performance.lighthouseScore;
      scoreCount++;
    }
    
    if (compatibility) {
      totalScore += compatibility.compatibilityScore;
      scoreCount++;
    }
    
    this.results.overallScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
    
    // Analyze critical issues
    this.analyzeCriticalIssues();
    
    // Generate deployment decision
    this.makeDeploymentDecision();
    
    // Compile recommendations
    this.compileRecommendations();
  }

  analyzeCriticalIssues() {
    const { functional, performance, compatibility } = this.results.validation;
    
    // Check functional issues
    if (functional && functional.passRate < 75) {
      this.results.criticalIssues.push({
        category: 'Functional',
        severity: 'Critical',
        issue: `Low functional test pass rate: ${functional.passRate}%`,
        details: 'Core functionality is not working properly',
      });
    }
    
    // Check performance issues
    if (performance && performance.lighthouseScore < 60) {
      this.results.criticalIssues.push({
        category: 'Performance',
        severity: 'Critical',
        issue: `Poor performance score: ${performance.lighthouseScore}/100`,
        details: 'Performance does not meet minimum standards',
      });
    }
    
    if (performance && performance.loadTime > 5000) {
      this.results.criticalIssues.push({
        category: 'Performance',
        severity: 'Critical',
        issue: `Slow loading time: ${performance.loadTime}ms`,
        details: 'Page load time exceeds acceptable threshold',
      });
    }
    
    // Check compatibility issues
    if (compatibility && compatibility.compatibilityScore < 70) {
      this.results.criticalIssues.push({
        category: 'Compatibility',
        severity: 'Critical',
        issue: `Low browser compatibility: ${compatibility.compatibilityScore}%`,
        details: 'App may not work properly across different browsers',
      });
    }
  }

  makeDeploymentDecision() {
    const criticalIssueCount = this.results.criticalIssues.length;
    const overallScore = this.results.overallScore;
    
    if (criticalIssueCount === 0 && overallScore >= 85) {
      this.results.deploymentDecision = 'APPROVED';
    } else if (criticalIssueCount === 0 && overallScore >= 70) {
      this.results.deploymentDecision = 'CONDITIONAL';
    } else {
      this.results.deploymentDecision = 'REJECTED';
    }
  }

  compileRecommendations() {
    const { functional, performance, compatibility } = this.results.validation;
    
    // Add performance recommendations
    if (performance && performance.recommendations) {
      this.results.recommendations.push(...performance.recommendations);
    }
    
    // Add compatibility recommendations
    if (compatibility && compatibility.recommendations) {
      this.results.recommendations.push(...compatibility.recommendations);
    }
    
    // Add general recommendations based on scores
    if (this.results.overallScore < 90) {
      this.results.recommendations.push({
        category: 'General',
        priority: 'Medium',
        issue: 'Overall score below 90%',
        solution: 'Address specific issues in functional, performance, and compatibility areas',
      });
    }
  }

  async runFullValidation() {
    console.log('🚀 Starting Full Deployment Validation for Aura Fashion App...\n');
    console.log(`Testing URL: ${this.baseUrl}\n`);
    
    try {
      // Run all validation tests
      await this.validateFunctionality();
      await this.validatePerformance();
      await this.validateCompatibility();
      
      // Analyze results and make decision
      this.analyzeResults();
      
      return this.generateReport();
    } catch (error) {
      console.error('❌ Deployment validation failed:', error);
      this.results.deploymentDecision = 'REJECTED';
      this.results.criticalIssues.push({
        category: 'System',
        severity: 'Critical',
        issue: 'Validation process failed',
        details: error.message,
      });
      
      return this.generateReport();
    }
  }

  generateReport() {
    const report = {
      ...this.results,
      summary: this.generateSummary(),
    };
    
    // Save comprehensive report
    const reportPath = path.join(__dirname, `deployment-validation-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Generate human-readable report
    this.printReport(report);
    
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
    return report;
  }

  generateSummary() {
    const { functional, performance, compatibility } = this.results.validation;
    
    return {
      overallScore: this.results.overallScore,
      deploymentDecision: this.results.deploymentDecision,
      criticalIssuesCount: this.results.criticalIssues.length,
      recommendationsCount: this.results.recommendations.length,
      testResults: {
        functional: functional ? `${functional.passRate}% (${functional.passedTests}/${functional.totalTests})` : 'Not tested',
        performance: performance ? `${performance.lighthouseScore}/100` : 'Not tested',
        compatibility: compatibility ? `${compatibility.compatibilityScore}%` : 'Not tested',
      },
    };
  }

  printReport(report) {
    console.log('\n' + '='.repeat(60));
    console.log('📋 AURA FASHION APP - DEPLOYMENT VALIDATION REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n🎯 OVERALL SCORE: ${report.overallScore}/100`);
    console.log(`📊 DEPLOYMENT DECISION: ${this.getDecisionEmoji()} ${report.deploymentDecision}`);
    
    console.log('\n📈 TEST RESULTS:');
    console.log(`   Functional Tests: ${report.summary.testResults.functional}`);
    console.log(`   Performance Score: ${report.summary.testResults.performance}`);
    console.log(`   Browser Compatibility: ${report.summary.testResults.compatibility}`);
    
    if (report.criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      report.criticalIssues.forEach((issue, index) => {
        console.log(`   ${index + 1}. [${issue.category}] ${issue.issue}`);
        console.log(`      ${issue.details}`);
      });
    }
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      report.recommendations.slice(0, 5).forEach((rec, index) => {
        console.log(`   ${index + 1}. [${rec.priority}] ${rec.issue || rec.solution}`);
      });
      
      if (report.recommendations.length > 5) {
        console.log(`   ... and ${report.recommendations.length - 5} more recommendations`);
      }
    }
    
    console.log('\n' + this.getDeploymentMessage());
    console.log('='.repeat(60));
  }

  getDecisionEmoji() {
    switch (this.results.deploymentDecision) {
      case 'APPROVED': return '✅';
      case 'CONDITIONAL': return '⚠️';
      case 'REJECTED': return '❌';
      default: return '⏳';
    }
  }

  getDeploymentMessage() {
    switch (this.results.deploymentDecision) {
      case 'APPROVED':
        return '🎉 DEPLOYMENT APPROVED: Ready for mobile app store submission!';
      case 'CONDITIONAL':
        return '⚠️  CONDITIONAL APPROVAL: Address recommendations before mobile submission.';
      case 'REJECTED':
        return '❌ DEPLOYMENT REJECTED: Critical issues must be resolved before deployment.';
      default:
        return '⏳ DEPLOYMENT PENDING: Validation in progress...';
    }
  }
}

// Run if called directly
if (require.main === module) {
  const baseUrl = process.argv[2] || 'http://localhost:19006';
  const validator = new DeploymentValidator(baseUrl);
  
  validator.runFullValidation()
    .then((report) => {
      const exitCode = report.deploymentDecision === 'APPROVED' ? 0 : 
                      report.deploymentDecision === 'CONDITIONAL' ? 1 : 2;
      process.exit(exitCode);
    })
    .catch((error) => {
      console.error('Deployment validation failed:', error);
      process.exit(2);
    });
}

module.exports = DeploymentValidator;
