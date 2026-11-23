# 🌍 Sismik — Kandilli & AFAD Canlı Deprem Radarı

<p align="center">
  <img src="public/logo.svg" alt="Sismik Logo" width="96" height="96" />
</p>

<p align="center">
  <b>Türkiye ve çevre bölgelerdeki sismik hareketliliği Kandilli Rasathanesi ve AFAD verileriyle eşzamanlı birleştiren, çift kurumsal teyitli, hiposantral hissedilme teşhisli ve yüksek çözünürlüklü uydu tabanlı gerçek zamanlı deprem gözlem radarı.</b>
</p>

<p align="center">
  <a href="https://github.com/Myht-07"><img src="https://img.shields.io/badge/Developer-Myht-rose?style=for-the-badge&logo=github" alt="Developer Myht" /></a>
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge" alt="MIT License" />
</p>

---

## 🌟 Neden Sismik?

Geleneksel deprem siteleri genellikle sadece tek bir kurumun verisini sunar veya iki kurumun verilerini alt alta mükerrer yazarak liste kirliliği yaratır. Ayrıca sayfayı her yenilediğinizde harita kararır ya da açtığınız pencere kapanır.

**Sismik**, jeofiziksel veri eşleştirme (data fusion) algoritmasıyla **Kandilli Rasathanesi (KRDAE)** ve **T.C. İçişleri Bakanlığı AFAD** ağlarını tek bir ekranda birleştirir:
* İki kurumun aynı sarsıntı için kaydettiği verileri zaman ($\le 120$s) ve merkez üssü mesafesi ($\le 40$km) kriterleriyle anında eşleştirir.
* Sarsıntıyı **Çift Kurumsal Teyit** olarak işaretler; Kandilli ve AFAD'ın ölçtüğü büyüklük ve odak derinliği farklarını yan yana kıyaslamalı olarak sunar.

---

## ✨ Temel Özellikler

### 1. 🛡️ Akıllı Çift Teyit & Çoklu Kurum Füzyonu
- **Eş Zamanlı Veri Çekimi:** Kandilli ve AFAD canlı akışlarını paralel olarak sorgular.
- **Mükerrerlik Önleme & Kıyaslama:** Eşleşen depremlerde her iki kurumun istasyon verilerini (büyüklük, derinlik, resmi kayıt bağlantısı) tek bir kart içinde karşılaştırmalı gösterir.
- **Kaynak Filtresi:** `Tümü`, `Çift Teyit`, `Kandilli` veya `AFAD` filtreleriyle istediğiniz veri akışını izleyin.

### 2. 📍 Haritadan Konum Seçimi & "Hissedilme" Analizi
- Harita üzerinde evinizi, köyünüzü veya bulunduğunuz herhangi bir koordinatı seçin (veya tek tıkla **GPS** ile anlık konumunuzu alın).
- **Hiposantral Modelleme:** Odak derinliği ve kuş uçuşu merkez üssü mesafesini (Haversine formülü) kullanarak seçtiğiniz noktaya özel teşhis koyar:
  - 🟢 **Bölgenizde Hissedilmemiştir**
  - 🟡 **Hafif Hissedilmiş Olabilir**
  - 🟠 **Hissedilmiş Olabilir**
  - 🔴 **Şiddetli Hissedilmiş Olabilir**
- **Mesafeye Göre Sıralama:** Canlı akışı bulunduğunuz noktaya en yakından en uzağa doğru tek tıkla sıralayın.

### 3. 🛰️ Yüksek Çözünürlüklü Uydu & Karanlık Harita
- **Varsayılan Uydu Modu:** Esri ArcGIS World Imagery uydu haritasıyla açılır; kırsal ve deniz alanlarında dahi kararma veya karo kaybolması yaşanmaz.
- **Alternatif Temalar:** Tek tıkla *Karanlık (Dark Canvas)* veya *Sokak (Street Map)* moduna geçilebilir; seçiminiz `localStorage` ile kalıcı olarak hatırlanır.
- **Kesintisiz Canlı Deneyim:** 30 saniyede bir gelen arka plan güncellemelerinde açık olan harita baloncukları asla kapanmaz, kamera odağı sıçramaz.

### 4. 🔊 Web Audio Sismik Uyarı & Bento İstatistikleri
- 4.0+ Mw büyüklüğünde bir sarsıntı algılandığında dahili Web Audio sentezleyicisi ile sismik uyarı tonu verir.
- Üst Bento Grid panelinde son 24 saatin en büyük depremi, toplam sarsıntı, teyitli deprem sayısı ve en yoğun kümelenme bölgesi anlık özetlenir.

---

## 🛠️ Teknoloji Yığını

* **Çatı (Framework):** React 18 (Vite + SWC)
* **Dil:** TypeScript (Tam Tip Güvenliği)
* **Tasarım:** Tailwind CSS, Bento Grid Mimarisi, Glassmorphism Efektleri
* **Harita Motoru:** Leaflet JS + Esri ArcGIS Tiles
* **İkonlar:** Lucide React
* **Ses Motoru:** HTML5 Web Audio API

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
* [Node.js](https://nodejs.org/) (v18 veya üzeri)

### Kurulum

```bash
# Depoyu klonlayın
git clone https://github.com/Myht-07/sismik.git

# Proje dizinine gidin
cd sismik

# Bağımlılıkları yükleyin
npm install

# Geliştirici sunucusunu başlatın
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresine giderek radarı kullanmaya başlayabilirsiniz.

> **Windows Kullanıcıları İçin:** Proje kök dizinindeki `calistir.bat` dosyasına çift tıklayarak tek adımda başlatabilirsiniz.

---

## 📁 Proje Mimarisi

```text
sismik/
├── public/
│   ├── logo.svg              # Sismik vektörel logosu
│   └── radio.svg             # Canlı yayın favicon ikonu
├── src/
│   ├── components/
│   │   ├── EarthquakeList.tsx       # Çift teyitli canlı deprem akışı & filtreler
│   │   ├── EarthquakeMap.tsx        # Leaflet ArcGIS uydu & sismik haritası
│   │   ├── LocationAnalysisCard.tsx # Seçilen konumun hissedilme analiz kartı
│   │   ├── Navbar.tsx               # Üst menü, ses ayarı ve acil rehber
│   │   ├── StatsBar.tsx             # Bento Grid özet istatistik paneli
│   │   └── EmergencyGuideModal.tsx  # Deprem acil durum & toplanma rehberi
│   ├── services/
│   │   └── earthquakeApi.ts         # Kandilli + AFAD paralel veri füzyonu
│   ├── utils/
│   │   ├── audioAlert.ts            # Web Audio API sismik uyarı motoru
│   │   └── geoUtils.ts              # Haversine & hiposantral hissedilme hesabı
│   ├── App.tsx                      # Ana uygulama orkestrasyonu
│   ├── types.ts                     # TypeScript veri arayüzleri
│   └── main.tsx                     # React kök başlatıcı
├── calistir.bat                     # Windows tek tıkla çalıştırma betiği
└── package.json
```

---

## 👤 Geliştirici & Lisans

Bu proje **[Myht](https://github.com/Myht-07)** tarafından *"Her Güne 1 Açık Kaynak Proje"* maratonu kapsamında geliştirilmiştir.

MIT Lisansı altında özgürce kullanılabilir, geliştirilebilir ve dağıtılabilir.
