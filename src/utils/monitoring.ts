/**
 * Monitoring System
 * 
 * NEDER BU SİSTEME İHTİYACIMIZ VAR?
 * - Uygulama performansını izlemek için
 * - Kullanıcı davranışlarını analiz etmek için
 * - Hata takibi ve bildirimleri için
 * - Geri bildirim toplamak için
 * 
 * NASIL ÇALIŞIR?
 * - Performance API kullanılır
 * - Hata yakalama ve loglama
 * - Kullanıcı etkileşimleri takip edilir
 * - Analytics verileri toplanır
 */

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private timers: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Zamanlayıcı başlat
   * 
   * NEDER GEREKLİ?
   * - Fonksiyonların çalışma süresini ölçmek için
   * - Performans darboğazlarını tespit etmek için
   * - Optimizasyon ihtiyaçlarını belirlemek için
   * 
   * NASIL ÇALIŞIR?
   * - Performance API kullanılır
   * - Başlangıç zamanı kaydedilir
   * - Sonrasında süre ölçülür
   */
  startTimer(name: string): void {
    this.timers.set(name, performance.now());
  }

  /**
   * Zamanlayıcı durdur ve süreyi kaydet
   * 
   * NEDER GEREKLİ?
   * - Ölçülen süreyi kaydetmek için
   * - Performans raporları oluşturmak için
   * - Anormal yavaşlamaları tespit etmek için
   * 
   * NASIL ÇALIŞIR?
   * - Bitiş zamanı alınır
   * - Fark hesaplanır
   * - Metriklere kaydedilir
   */
  endTimer(name: string): number {
    const startTime = this.timers.get(name);
    if (!startTime) {
      console.warn(`Timer ${name} not found`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(name);
    
    // Metriği kaydet
    this.setMetric(name, duration);
    
    // Süreyi logla
    console.log(`⏱️  ${name}: ${duration.toFixed(2)}ms`);
    
    // Eğer süre çok uzunsa uyarı göster
    if (duration > 1000) { // 1 saniyeden uzunsa
      console.warn(`⚠️  ${name} çok yavaş çalışıyor: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  /**
   * Metrik kaydet
   * 
   * NEDER GEREKLİ?
   * - Performans verilerini saklamak için
   * - Trend analizi yapmak için
   * - Ortalama değerleri hesaplamak için
   * 
   * NASIL ÇALIŞIR?
   * - Metrikler Map içinde saklanır
   * - Aynı metriğin birden fazla değeri olabilir
   * - İstatistiksel analiz yapılabilir
   */
  setMetric(name: string, value: number): void {
    const existing = this.metrics.get(name);
    if (existing) {
      // Ortalama hesapla
      const average = (existing + value) / 2;
      this.metrics.set(name, average);
    } else {
      this.metrics.set(name, value);
    }
  }

  /**
   * Metrikleri al
   * 
   * NEDER GEREKLİ?
   * - Performans raporları oluşturmak için
   * - Verileri dışa aktarmak için
   * - Analiz yapmak için
   * 
   * NASIL ÇALIŞIR?
   * - Tüm metrikler döndürülür
   * - JSON formatında verilir
   * - Raporlama sistemleriyle entegre edilebilir
   */
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  /**
   * Performans raporu oluştur
   * 
   * NEDER GEREKLİ?
   * - Performans durumunu özetlemek için
   * - Yavaş fonksiyonları belirlemek için
   * - Optimizasyon önerileri sunmak için
   * 
   * NASIL ÇALIŞIR?
   * - Metrikler analiz edilir
   * - En yavaş fonksiyonlar belirlenir
   * - Özet rapor oluşturulur
   */
  generateReport(): string {
    const metrics = this.getMetrics();
    const sortedMetrics = Object.entries(metrics)
      .sort(([,a], [,b]) => b - a);

    let report = '📊 Performans Raporu\n';
    report += '===================\n\n';

    sortedMetrics.forEach(([name, value]) => {
      report += `${name}: ${value.toFixed(2)}ms\n`;
    });

    // En yavaş 3 fonksiyonu vurgula
    const slowest = sortedMetrics.slice(0, 3);
    if (slowest.length > 0) {
      report += '\n🐌 En Yavaş Fonksiyonlar:\n';
      slowest.forEach(([name, value]) => {
        report += `   - ${name}: ${value.toFixed(2)}ms\n`;
      });
    }

    return report;
  }
}

// Error tracking
export class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: Array<{
    timestamp: Date;
    message: string;
    stack?: string;
    component?: string;
    userAgent?: string;
  }> = [];

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  /**
   * Hata kaydet
   * 
   * NEDER GEREKLİ?
   * - Hataları takip etmek için
   * - Hata trendlerini analiz etmek için
   * - Çözüm önerileri sunmak için
   * 
   * NASIL ÇALIŞIR?
   * - Hata detayları saklanır
   * - Zaman damgası eklenir
   * - Kullanıcı bilgileri kaydedilir
   */
  trackError(error: Error, component?: string): void {
    const errorData = {
      timestamp: new Date(),
      message: error.message,
      stack: error.stack,
      component,
      userAgent: navigator.userAgent,
    };

    this.errors.push(errorData);

    // Hata konsola logla
    console.error('🚨 Hata Takip Edildi:', errorData);

    // Hata sayısını kontrol et
    const recentErrors = this.errors.filter(e => 
      Date.now() - e.timestamp.getTime() < 60000 // Son 1 dakika
    );

    if (recentErrors.length > 5) {
      console.warn('🚨 Çok sayıda hata tespit edildi! Hata sayısı:', recentErrors.length);
    }

    // Burada hata takip servisi entegre edilebilir
    // Örnek: Sentry, LogRocket, Datadog vb.
    this.sendToErrorTrackingService(errorData);
  }

  /**
   * Hataları al
   * 
   * NEDER GEREKLİ?
   * - Hata analizleri yapmak için
   * - Raporlar oluşturmak için
   * - Çözüm önerileri sunmak için
   * 
   * NASIL ÇALIŞIR?
   * - Tüm hatalar döndürülür
   * - Filtreleme seçenekleri sunulur
   * - Analiz için kullanılabilir
   */
  getErrors(filter?: {
    since?: Date;
    component?: string;
    message?: string;
  }): typeof this.errors {
    let filtered = [...this.errors];

    if (filter?.since) {
      filtered = filtered.filter(e => e.timestamp >= filter.since!);
    }

    if (filter?.component) {
      filtered = filtered.filter(e => e.component === filter.component);
    }

    if (filter?.message) {
      filtered = filtered.filter(e => e.message.includes(filter!.message!));
    }

    return filtered;
  }

  /**
   * Hata raporu oluştur
   * 
   * NEDER GEREKLİ?
   * - Hata durumunu özetlemek için
   * - Tekrarlayan hataları belirlemek için
   * Çözüm önerileri sunmak için
   * 
   * NASIL ÇALIŞIR?
   * - Hatalar analiz edilir
   * - En sık hatalar belirlenir
   * - Özet rapor oluşturulur
   */
  generateErrorReport(): string {
    const errors = this.getErrors();
    const errorCounts = new Map<string, number>();
    const componentCounts = new Map<string, number>();

    errors.forEach(error => {
      // Hata mesaj sayısı
      const count = errorCounts.get(error.message) || 0;
      errorCounts.set(error.message, count + 1);

      // Bileşen sayısı
      if (error.component) {
        const compCount = componentCounts.get(error.component) || 0;
        componentCounts.set(error.component, compCount + 1);
      }
    });

    let report = '🚨 Hata Raporu\n';
    report += '===============\n\n';
    report += `Toplam Hata: ${errors.length}\n`;
    report += `Son Hata: ${errors[errors.length - 1]?.timestamp.toLocaleString()}\n\n`;

    // En sık hatalar
    const sortedErrors = Array.from(errorCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    if (sortedErrors.length > 0) {
      report += '🔥 En Sık Hatalar:\n';
      sortedErrors.forEach(([message, count]) => {
        report += `   - ${count}x: ${message}\n`;
      });
      report += '\n';
    }

    // Bileşen bazlı hatalar
    const sortedComponents = Array.from(componentCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    if (sortedComponents.length > 0) {
      report += '🔧 Bileşen Bazlı Hatalar:\n';
      sortedComponents.forEach(([component, count]) => {
        report += `   - ${component}: ${count} hata\n`;
      });
    }

    return report;
  }

  /**
   * Hata takip servisine gönder
   * 
   * NEDER GEREKLİ?
   * - Hataları merkezi bir sistemde toplamak için
   * - Gerçek zamanlı bildirimler almak için
   * - Çözüm sürecini hızlandırmak için
   * 
   * NASIL ÇALIŞIR?
   * - Hata verisi API ile gönderilir
   * - Servis tarafında işlenir
   * - Bildirimler oluşturulur
   */
  private async sendToErrorTrackingService(errorData: any): Promise<void> {
    // Burada hata takip servisi çağrılabilir
    // Örnek: Sentry, LogRocket, Datadog vb.
    
    // Şimdilik sadece konsola logla
    console.log('📤 Hata takip servisine gönderildi:', errorData);
  }
}

// User analytics
export class UserAnalytics {
  private static instance: UserAnalytics;
  private events: Array<{
    timestamp: Date;
    type: string;
    data: any;
    userId?: string;
  }> = [];

  static getInstance(): UserAnalytics {
    if (!UserAnalytics.instance) {
      UserAnalytics.instance = new UserAnalytics();
    }
    return UserAnalytics.instance;
  }

  /**
   * Olay kaydet
   * 
   * NEDER GEREKLİ?
   * - Kullanıcı davranışlarını takip etmek için
   * - Kullanıcı deneyimini iyileştirmek için
   * - İş metriklerini ölçmek için
   * 
   * NASIL ÇALIŞIR?
   * - Kullanıcı etkileşimleri kaydedilir
   * - Zaman damgası eklenir
   * - Analiz için kullanılır
   */
  trackEvent(type: string, data: any, userId?: string): void {
    const event = {
      timestamp: new Date(),
      type,
      data,
      userId,
    };

    this.events.push(event);

    // Olay konsola logla
    console.log('📊 Olay Takip Edildi:', event);

    // Burada analytics servisi entegre edilebilir
    // Örnek: Google Analytics, Mixpanel, Amplitude vb.
    this.sendToAnalyticsService(event);
  }

  /**
   * Sayım olayı kaydet
   * 
   * NEDER GEREKLİ?
   * - Buton tıklamalarını saymak için
   * - Sayfa görüntülemelerini takip etmek için
   * - Popüler özellikleri belirlemek için
   * 
   * NASIL ÇALIŞIR?
   * - Olay sayımı yapılır
   * - Toplam değer saklanır
   * - Trend analizi yapılabilir
   */
  trackCount(type: string, userId?: string): void {
    this.trackEvent(type, { count: 1 }, userId);
  }

  /**
   * Süre olayı kaydet
   * 
   * NEDER GEREKLİ?
   * - Ekran sürelerini ölçmek için
   * - Kullanıcı oturumlarını analiz etmek için
   * - İlgilenilen özellikleri belirlemek için
   * 
   * NASIL ÇALIŞIR?
   * - Süre ölçülür
   * - Olay olarak kaydedilir
   * - Ortalama süreler hesaplanır
   */
  trackDuration(type: string, duration: number, userId?: string): void {
    this.trackEvent(type, { duration }, userId);
  }

  /**
   * Olayları al
   * 
   * NEDER GEREKLİ?
   * - Analiz yapmak için
   * - Raporlar oluşturmak için
   * - Trendleri belirlemek için
   * 
   * NASIL ÇALIŞIR?
   * - Olaylar filtrelenir
   * - İstenen aralıkta veriler döndürülür
   * - Analiz için kullanılır
   */
  getEvents(filter?: {
    since?: Date;
    type?: string;
    userId?: string;
  }): typeof this.events {
    let filtered = [...this.events];

    if (filter?.since) {
      filtered = filtered.filter(e => e.timestamp >= filter.since!);
    }

    if (filter?.type) {
      filtered = filtered.filter(e => e.type === filter.type);
    }

    if (filter?.userId) {
      filtered = filtered.filter(e => e.userId === filter.userId);
    }

    return filtered;
  }

  /**
   * Analitik raporu oluştur
   * 
   * NEDER GEREKLİ?
   * - Kullanıcı davranışlarını özetlemek için
   * - Popüler özellikleri belirlemek için
   *   İş metriklerini ölçmek için
   * 
   * NASIL ÇALIŞIR?
   * - Olaylar analiz edilir
   * - İstatistikler hesaplanır
   * - Özet rapor oluşturulur
   */
  generateAnalyticsReport(): string {
    const events = this.getEvents();
    const eventCounts = new Map<string, number>();
    const userCounts = new Map<string, number>();

    events.forEach(event => {
      // Olay sayısı
      const count = eventCounts.get(event.type) || 0;
      eventCounts.set(event.type, count + 1);

      // Kullanıcı sayısı
      if (event.userId) {
        const userCount = userCounts.get(event.userId) || 0;
        userCounts.set(event.userId, userCount + 1);
      }
    });

    let report = '📈 Analitik Raporu\n';
    report += '=================\n\n';
    report += `Toplam Olay: ${events.length}\n`;
    report += `Etkili Kullanıcı: ${userCounts.size}\n`;
    report += `Son Olay: ${events[events.length - 1]?.timestamp.toLocaleString()}\n\n`;

    // En sık olaylar
    const sortedEvents = Array.from(eventCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    if (sortedEvents.length > 0) {
      report += '🔥 En Sık Olaylar:\n';
      sortedEvents.forEach(([type, count]) => {
        report += `   - ${count}x: ${type}\n`;
      });
      report += '\n';
    }

    // En aktif kullanıcılar
    const sortedUsers = Array.from(userCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    if (sortedUsers.length > 0) {
      report += '👥 En Aktif Kullanıcılar:\n';
      sortedUsers.forEach(([userId, count]) => {
        report += `   - ${userId}: ${count} olay\n`;
      });
    }

    return report;
  }

  /**
   * Analitik servisine gönder
   * 
   * NEDER GEREKLİ?
   * - Analitik verilerini merkezi bir sistemde toplamak için
   *   Gerçek zamanlı raporlar almak için
   *   İş kararlarını desteklemek için
   * 
   * NASIL ÇALIŞIR?
   * - Analitik verisi API ile gönderilir
   * - Servis tarafında işlenir
   *   Raporlar oluşturulur
   */
  private async sendToAnalyticsService(event: any): Promise<void> {
    // Burada analytics servisi çağrılabilir
    // Örnek: Google Analytics, Mixpanel, Amplitude vb.
    
    // Şimdilik sadece konsola logla
    console.log('📤 Analitik servisine gönderildi:', event);
  }
}

// Global monitoring instance
export const performanceMonitor = PerformanceMonitor.getInstance();
export const errorTracker = ErrorTracker.getInstance();
export const userAnalytics = UserAnalytics.getInstance();

// Hook for easy usage
export function useMonitoring() {
  return {
    performanceMonitor,
    errorTracker,
    userAnalytics,
    trackError: (error: Error, component?: string) => errorTracker.trackError(error, component),
    trackEvent: (type: string, data: any, userId?: string) => userAnalytics.trackEvent(type, data, userId),
    startTimer: (name: string) => performanceMonitor.startTimer(name),
    endTimer: (name: string) => performanceMonitor.endTimer(name),
  };
}