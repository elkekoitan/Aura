# 🚀 Aura Fashion App - Geliştirme Kılavuzu

## 📋 İçerik
- [Proje Yapısı](#proje-yapısı)
- [Kurulum ve Çalıştırma](#kurulum-ve-çalıştırma)
- [Geliştirme Ortamı](#geliştirme-ortamı)
- [Test Sistemi](#test-sistemi)
- [Monitoring ve Analitik](#monitoring-ve-analitik)
- [Hata Ayıklama](#hata-ayıklama)
- [Performans Optimizasyonu](#performans-optimizasyonu)
- [Deployment](#deployment)
- [Güvenlik](#güvenlik)
- [İleri Düzey Özellikler](#ileri-düzey-özellikler)

## 🏗️ Proje Yapısı

```
Aura/
├── src/
│   ├── components/          # UI Bileşenleri
│   │   ├── ui/             # Temel UI Bileşenleri
│   │   ├── brand/          # Marka Bileşenleri
│   │   ├── product/        # Ürün Bileşenleri
│   │   ├── camera/         # Kamera Bileşenleri
│   │   └── admin/          # Yönetici Bileşenleri
│   ├── screens/            # Ekranlar
│   │   ├── auth/           # Kimlik Doğrulama Ekranları
│   │   ├── main/           # Ana Ekranlar
│   │   ├── profile/        # Profil Ekranları
│   │   ├── admin/          # Yönetici Ekranları
│   │   └── onboarding/     # Onboarding Ekranları
│   ├── store/              # Redux Store
│   │   ├── slices/         # State Slice'ları
│   │   └── types/          # TypeScript Type'ları
│   ├── navigation/         # Navigasyon
│   ├── services/           # Servisler
│   ├── utils/              # Yardımcı Fonksiyonlar
│   ├── constants/          # Sabitler
│   └── config/             # Yapılandırma
├── scripts/                # Geliştirme Script'leri
├── testing/                # Test Dosyaları
├── supabase/               # Supabase Backend
└── assets/                 # Statik Varlıklar
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Expo CLI
- Android Studio (Android için)
- Xcode (iOS için - macOS gerekli)

### Kurulum Adımları

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd Aura
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment variables ayarlayın**
```bash
cp .env.example .env
# .env dosyasını kendi bilgilerinizle güncelleyin
```

4. **Uygulamayı çalıştırın**
```bash
# Web için
npm run web

# iOS için (macOS gerekli)
npm run ios

# Android için
npm run android
```

### Environment Variables

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Analytics (Opsiyonel)
EXPO_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id
EXPO_PUBLIC_AMPLIFY_APP_ID=your_amplify_id

# App Settings
EXPO_PUBLIC_APP_NAME=Aura Fashion
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_APP_ENV=development
```

## 💻 Geliştirme Ortamı

### VS Code Ayarları

1. **Uzantıları kurun**
```bash
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-json
code --install-extension ms-vscode.vscode-eslint
```

2. **VS Code ayarları**
```json
{
  "typescript.preferences.preferTypeOnlyAutoImports": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}
```

### Prettier ve ESLint

```bash
# Prettier kurulumu
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier

# .prettierrc dosyası oluşturun
echo "{
  \"semi\": true,
  \"trailingComma\": \"es5\",
  \"singleQuote\": true,
  \"printWidth\": 100,
  \"tabWidth\": 2,
  \"useTabs\": false
}" > .prettierrc
```

### Git Hooks

```bash
# Husky kurulumu
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"

# package.json'a ekleyin
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## 🧪 Test Sistemi

### Test Çeşitleri

1. **Unit Testleri** - Bileşen ve fonksiyon testleri
2. **Integration Testleri** - API entegrasyon testleri
3. **E2E Testleri** - Uçtan uca testler
4. **Performance Testleri** - Performans testleri

### Test Çalıştırma

```bash
# Tüm testleri çalıştır
npm test

# Watch modunda test
npm run test:watch

# Test kapsamı
npm run test:coverage

# Belirli test grupları
npm run test:auth
npm run test:components
npm run test:store
npm run test:utils

# Hızlı test
npm run test:quick

# Detaylı test
npm run test:detailed
```

### Test Yapısı

```
src/
├── __tests__/              # Unit testler
│   ├── auth.test.ts
│   ├── components.test.ts
│   └── store.test.ts
├── __integration__/        # Integration testler
│   ├── api.test.ts
│   └── navigation.test.ts
└── __e2e__/               # E2E testler
    ├── login.test.ts
    └── checkout.test.ts
```

### Test Örnekleri

```typescript
// Unit Test Örneği
import { render, screen } from '@testing-library/react-native';
import { LoginScreen } from '../screens/auth/LoginScreen';

describe('LoginScreen', () => {
  it('should render email and password inputs', () => {
    render(<LoginScreen />);
    
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getByText('Login')).toBeTruthy();
  });
});

// Redux Test Örneği
import { store } from '../store';
import { authSlice } from '../store/slices/authSlice';

describe('Auth Slice', () => {
  it('should handle login', () => {
    const initialState = authSlice.getInitialState();
    
    store.dispatch(authSlice.actions.setSession({
      user: { id: '1', email: 'test@example.com' },
      session: { access_token: 'token' }
    }));
    
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('test@example.com');
  });
});
```

## 📊 Monitoring ve Analitik

### Monitoring Sistemi

Proje, gelişmiş bir monitoring sistemine sahiptir:

1. **Performance Monitor** - Performans takibi
2. **Error Tracker** - Hata takibi
3. **User Analytics** - Kullanıcı davranışları

### Kullanım

```typescript
import { performanceMonitor, errorTracker, userAnalytics } from '../utils/monitoring';

// Performans ölçümü
performanceMonitor.startTimer('functionName');
// ... fonksiyon kodu
const duration = performanceMonitor.endTimer('functionName');

// Hata takibi
try {
  // ... riskli kod
} catch (error) {
  errorTracker.trackError(error, 'ComponentName');
}

// Kullanıcı analitiği
userAnalytics.trackEvent('button_click', { button: 'login' });
userAnalytics.trackCount('page_view', 'user123');
```

### Monitoring Raporları

```bash
# Performans raporu
npm run report:performance

# Hata raporu
npm run report:errors

# Analitik raporu
npm run report:analytics
```

## 🐛 Hata Ayıklama

### Hata Türleri

1. **Runtime Hataları** - Çalışma zamanı hataları
2. **Build Hataları** - Derleme hataları
3. **Network Hataları** - Ağ hataları
4. **State Hataları** - State yönetimi hataları

### Hata Ayıklama Araçları

1. **React Native Debugger**
2. **Chrome DevTools**
3. **Expo DevTools**
4. **Redux DevTools**

### Hata Ayıklma Adımları

1. **Hata Tespiti**
   - Console log'larını kontrol et
   - Error Boundary kullan
   - Monitoring sistemini kullan

2. **Hata İzleme**
   - Stack trace'i incele
   - Hata zamanını ve koşullarını kaydet
   - Kullanıcı etkileşimlerini takip et

3. **Hata Çözme**
   - İlgili kodu incele
   - Test senaryoları oluştur
   - Çözümü uygula ve test et

### Hata Raporlama

```typescript
// Global error handler
const globalErrorHandler = (error: Error, errorInfo: React.ErrorInfo) => {
  console.error('Global Error:', error, errorInfo);
  
  // Hata takip sistemine bildir
  errorTracker.trackError(error, 'Global');
  
  // Kritik hatalarda bildirim gönder
  if (error.name === 'TypeError' || error.name === 'ReferenceError') {
    sendCriticalAlert(error);
  }
};
```

## ⚡ Performans Optimizasyonu

### Optimizasyon Teknikleri

1. **Code Splitting** - Kod bölme
2. **Lazy Loading** - Tembel yükleme
3. **Memoization** - Bellek optimizasyonu
4. **Virtualization** - Sanal liste

### Performans Testleri

```bash
# Performans testi
npm run test:performance

# Hız testi
npm run test:speed

# Bellek kullanımı testi
npm run test:memory
```

### Optimizasyon İpuçları

1. **Component Optimizasyonu**
   ```typescript
   import React, { memo, useMemo, useCallback } from 'react';
   
   const OptimizedComponent = memo(function OptimizedComponent({ data }) {
     const processedData = useMemo(() => {
       return data.map(item => ({ ...item, processed: true }));
     }, [data]);
     
     const handleClick = useCallback(() => {
       // click handler
     }, []);
     
     return <ChildComponent data={processedData} onClick={handleClick} />;
   });
   ```

2. **Image Optimizasyonu**
   ```typescript
   import { Image } from 'react-native';
   
   // WebP formatı kullan
   <Image 
     source={{ uri: 'image.webp' }}
     style={{ width: 100, height: 100 }}
     resizeMode="contain"
   />
   ```

3. **List Optimizasyonu**
   ```typescript
   import { FlatList } from 'react-native';
   
   <FlatList
     data={data}
     renderItem={renderItem}
     keyExtractor={item => item.id}
     initialNumToRender={10}
     maxToRenderPerBatch={5}
     windowSize={10}
     removeClippedSubviews={true}
     getItemLayout={(data, index) => ({
       length: 100,
       offset: 100 * index,
       index,
     })}
   />
   ```

## 🚀 Deployment

### Web Deployment

```bash
# Web build
npm run build:web

# Web preview
npm run preview:web

# Web deployment
npm run deploy
```

### Mobile Deployment

```bash
# Android build
npm run build:android

# iOS build
npm run build:ios

# EAS build
npm run build:android:production
npm run build:ios:production

# App Store deployment
npm run deploy:stores
```

### APK Testi

```bash
# APK testi
npm run apk:test

# Detaylı APK testi
npm run apk:test:detailed

# APK monitoring
npm run apk:monitor
```

## 🔒 Güvenlik

### Güvenlik Önlemleri

1. **Environment Variables**
   - Hassas verileri .env dosyasında sakla
   - .env dosyasını git'e ekleme

2. **Authentication**
   - JWT token kullan
   - Refresh token mekanizması
   - Session management

3. **Data Validation**
   - Input validation
   - Type checking
   - Sanitization

4. **API Security**
   - Rate limiting
   - CORS ayarları
   - SSL/TLS

### Güvenlik Testleri

```bash
# Güvenlik testi
npm run test:security

# Penetration test
npm run test:penetration

# Vulnerability scan
npm run test:vulnerability
```

## 🎯 İleri Düzey Özellikler

### 1. Advanced TypeScript

```typescript
// Generic Types
type ApiResponse<T> = {
  data: T;
  success: boolean;
  error?: string;
};

// Utility Types
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Conditional Types
type ExtractType<T> = T extends Promise<infer U> ? U : never;
```

### 2. Custom Hooks

```typescript
// Custom Hook Örneği
const useAuth = () => {
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  const login = async (email: string, password: string) => {
    return dispatch(signIn({ email, password }));
  };
  
  const logout = async () => {
    return dispatch(signOut());
  };
  
  return { user, isAuthenticated, login, logout };
};
```

### 3. Advanced Animations

```typescript
import { Animated, Easing } from 'react-native';

const useAnimation = () => {
  const scale = new Animated.Value(1);
  
  const animate = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  return { scale, animate };
};
```

### 4. State Management Patterns

```typescript
// Selector Pattern
const selectAuth = (state: RootState) => state.auth;
const selectUser = createSelector(
  [selectAuth],
  (auth) => auth.user
);

// Action Creators
const authActions = {
  login: (credentials: Credentials) => ({
    type: 'auth/login',
    payload: credentials,
  }),
  logout: () => ({
    type: 'auth/logout',
  }),
};
```

### 5. Performance Monitoring

```typescript
// Custom Performance Hook
const usePerformance = () => {
  const [metrics, setMetrics] = useState({});
  
  useEffect(() => {
    const interval = setInterval(() => {
      const currentMetrics = performanceMonitor.getMetrics();
      setMetrics(currentMetrics);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return metrics;
};
```

## 📚 Kaynaklar

### Dokümantasyon

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Supabase Documentation](https://supabase.com/docs)

### Araçlar

- [React Native Debugger](https://github.com/jondot/react-native-debugger)
- [Expo DevTools](https://docs.expo.dev/develop/debugging/introduction/)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

### Topluluk

- [React Native Forum](https://reactnative.dev/community)
- [Expo Discord](https://chat.expo.dev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 İletişim

Proje hakkında sorularınız için:
- GitHub Issues açın
- Discord sunucumuza katılın
- E-posta: support@aura-fashion.com

---

**Not:** Bu kılavuz sürekli güncellenmektedir. Yeni özellikler ve iyileştirmeler eklenecektir.