# 📸 InstaCrop — Blurred Background Canvas Studio

> Modern, mobile-first Progressive Web App (PWA) that transforms photos with aesthetic blurred background padding and custom aspect ratios, supporting direct photo sharing from Android & Samsung Gallery.

![PWA Ready](https://img.shields.io/badge/PWA-Ready-success?style=flat-square)
![Web Share Target API](https://img.shields.io/badge/Web_Share_Target-v2-blue?style=flat-square)
![Vite 8 + React 19](https://img.shields.io/badge/Vite_8-React_19-61dafb?style=flat-square)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-black?style=flat-square)

---

## ✨ Features

- 📱 **Android Web Share Target Integration:**
  - Share photos directly from **Samsung Gallery** or **Google Photos** into InstaCrop via the native Android Share sheet.
  - The Service Worker intercepts the multipart POST request, temporarily caches the image blob, and loads it instantly upon launch.
- 📐 **Comprehensive Aspect Ratio Presets:**
  - **1:1 Square** (Instagram Feed, Profile)
  - **4:5 Portrait** (Max Instagram Feed height for optimal reach)
  - **9:16 Fullscreen** (Instagram Stories, Reels, TikTok, YouTube Shorts)
  - **16:9 Landscape** (YouTube, Twitter, Landscape Web)
  - **3:2 & 2:3 DSLR Standards** (35mm photography)
  - **4:3 & 3:4 Standards** (Tablets & standard cameras)
  - **Original** (Preserve source image aspect ratio)
  - **Custom Dimensions** (Dynamic Width & Height with aspect ratio locking)
- 🎨 **Advanced Canvas Processing Engine (HTML5 Canvas):**
  - **Blurred Background Cover:** Hardware-accelerated background copy scaled to cover the canvas, with customizable blur intensity (0–70px) and abstract zoom scale.
  - **Tint & Dimmer:** Adjustable darkener overlay (0–90%) with tint color presets (Pitch Black, Slate, Midnight Blue, Dark Violet, White).
  - **Foreground Precision:** Centers the source image without distortion, with live sliders for padding/margin (0–35%), corner radius rounding (0–120px with quick presets), drop shadow (blur, opacity, vertical elevation), and border styling.
  - **Transformations:** 90° clockwise rotation, horizontal flip, vertical flip, and fine coordinate alignment nudge.
- 🚀 **High-Resolution Export & Scaling:**
  - **1x Standard** (Crisp 1080p web export)
  - **2x High-Res** (Ultra Retina 2160p)
  - **4K Ultra HD** (3840px max dimension)
  - **Native** (Matches source image resolution)
  - Format choices: **PNG** (lossless), **JPEG** (custom quality slider), and **WebP**.
  - **Web Share API:** Share the generated photo directly back to Instagram, WhatsApp, or Telegram without leaving the browser.
  - One-click copy to clipboard.
- ⚡ **Offline & Private:**
  - 100% in-browser processing. Your photos never leave your device.
  - Service Worker caching enables offline operation anywhere.

---

## 📲 How to Use with Android / Samsung Gallery

1. **Install InstaCrop to Home Screen:**
   - Open the web app in **Chrome** or **Samsung Internet**.
   - Tap the browser menu (`⋮`) and select **"Add to Home Screen"** or **"Install App"** (or click the pulsing **"Install PWA"** button in the header).
2. **Share from Gallery:**
   - Open **Samsung Gallery** or **Google Photos**.
   - Select any photo and tap the **Share** button.
   - Choose **InstaCrop** from the app share sheet.
   - The photo loads automatically into the canvas with your blurred background preset ready!

---

## 🛠️ Project Structure

```
Insta_crop/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions workflow for GitHub Pages
├── public/
│   ├── icon.svg              # Scalable vector app icon
│   ├── icon-192.png          # PWA 192x192 icon
│   ├── icon-512.png          # PWA 512x512 icon
│   ├── icon-maskable-512.png # PWA maskable icon for Android adaptive icons
│   ├── manifest.json         # Web App Manifest with share_target configuration
│   ├── sw.js                 # Service worker handling offline cache & share_target POST
│   └── 404.html              # SPA redirect fallback for GitHub Pages
├── src/
│   ├── components/
│   │   ├── AndroidShareModal.jsx # Android Gallery guide modal
│   │   ├── CanvasPreview.jsx     # Live canvas preview & comparison view
│   │   ├── ControlSliders.jsx    # Blur, padding, radius, shadow & tint sliders
│   │   ├── EmptyState.jsx        # Drag & drop upload, camera, & sample photos
│   │   ├── ExportPanel.jsx       # Resolution scales, formats, download & share
│   │   ├── Header.jsx            # Navigation header & PWA installation triggers
│   │   └── PresetSelector.jsx    # Aspect ratio cards & custom resolution editor
│   ├── constants/
│   │   └── presets.js            # Aspect presets, scales, formats, sample images
│   ├── hooks/
│   │   └── useShareTarget.js     # Hook to detect PWA install prompt & shared images
│   ├── utils/
│   │   └── canvas.js             # Canvas drawing engine, export & Web Share helpers
│   ├── App.jsx                   # Main studio container & responsive layout
│   ├── index.css                 # Tailwind CSS v4 styling & dark theme defaults
│   └── main.jsx                  # React DOM mount & Service Worker registration
├── vite.config.js            # Vite config with base: './' for GitHub Pages
└── package.json
```

---

## 🚀 Local Development

1. **Clone & Install Dependencies:**
   ```bash
   git clone <repo-url>
   cd Insta_crop
   npm install
   ```

2. **Run Dev Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

4. **Preview Production Build:**
   ```bash
   npm run preview
   ```

---

## 🌐 Deploying to GitHub Pages

1. Push this repository to GitHub on the `main` or `master` branch.
2. In your repository settings on GitHub:
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, choose **GitHub Actions**.
3. Every commit pushed to `main` will automatically build and deploy the PWA to `https://<username>.github.io/<repo-name>/`.
