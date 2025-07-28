# Aura - Digital Fashion App

**"Your Digital Fashion Aura"** - Modern moda deneme uygulaması

## 🎨 Özellikler

### ✨ Tasarım
- **Turquoise + Holographic** renk paleti
- **3D Glassmorphism** efektleri
- **Neomorphism** butonlar
- **Fluid animations** ve **micro-interactions**

### 🤖 AI-Powered Özellikler
- **AI Stil Danışmanı** - Kişisel stil önerileri
- **Akıllı Renk Analizi** - Ten tonuna göre renk önerileri
- **Trend Prediction** - Gelecek trendleri tahmin etme
- **Smart Wardrobe** - Gardırop optimizasyonu

### 🌟 Yenilikçi Özellikler
- **AR Try-On** - Gerçek zamanlı deneme
- **Virtual Closet** - 3D gardırop
- **Style DNA** - Kişisel stil profili
- **Mood-Based Styling** - Ruh haline göre kıyafet önerisi

## 🛠 Teknoloji Stack

### Frontend
- **React Native** + **Expo** - Cross-platform development
- **TypeScript** - Type safety
- **React Navigation** - Navigation
- **React Native Reanimated** - Animations
- **Expo Linear Gradient** - Gradients
- **Expo Blur** - Glassmorphism effects

### Backend
- **Supabase** - Database, Authentication, Storage
- **PostgreSQL** - Database
- **Row Level Security** - Data security

### State Management
- **Redux Toolkit** - Global state management
- **React Redux** - React bindings

### 3D & AR
- **Three.js** - 3D graphics
- **Expo GL** - WebGL support
- **Expo Three** - Three.js integration

## 📱 Ekranlar

### Onboarding (13 ekran)
- [x] Welcome Screen - Hoş geldin ekranı
- [ ] Feature Introduction - Özellik tanıtımı
- [ ] Permission Requests - İzin istekleri
- [ ] Style Preferences - Stil tercihleri

### Avatar Creation (12 ekran)
- [ ] Photo Capture - Fotoğraf çekme
- [ ] Face Detection - Yüz tanıma
- [ ] Body Measurements - Vücut ölçüleri
- [ ] Avatar Customization - Avatar özelleştirme

### Ana Özellikler
- [ ] Home Dashboard - Ana sayfa
- [ ] Brand Selection - Marka seçimi
- [ ] Look Detail - Görünüm detayı
- [ ] Virtual Try-On - Sanal deneme
- [ ] Shopping Cart - Alışveriş sepeti
- [ ] User Profile - Kullanıcı profili

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Expo CLI
- Supabase hesabı

### Adımlar

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
# .env dosyasını Supabase bilgilerinizle güncelleyin
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

## 🗄 Database Schema

### Users
- id, email, full_name, avatar_url
- created_at, updated_at

### User Profiles
- user_id, username, bio, style_preferences
- body_measurements, gender, birth_date

### Brands
- id, name, description, logo_url
- category, is_active

### Products
- id, brand_id, name, description
- category, price, images, colors, sizes

### Looks
- id, user_id, name, description
- products[], tags[], is_public

### Avatars
- id, user_id, model_url, texture_url
- body_measurements, face_features

## 📦 Deployment

### Web (Vercel)
```bash
npm run build:web
# Vercel'e deploy edin
```

### Mobile (Expo)
```bash
# iOS App Store
expo build:ios

# Google Play Store
expo build:android
```

## 🎯 Roadmap

- [x] Proje kurulumu ve temel yapı
- [x] Design system ve UI components
- [x] Supabase entegrasyonu
- [x] Redux store yapısı
- [x] Welcome screen
- [ ] Onboarding flow tamamlama
- [ ] Authentication sistem
- [ ] Avatar creation system
- [ ] 3D try-on functionality
- [ ] AI styling features
- [ ] E-commerce integration
- [ ] Social features
- [ ] Performance optimization
- [ ] Testing
- [ ] App Store deployment

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje hakkında sorularınız için issue açabilirsiniz.
