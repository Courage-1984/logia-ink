# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies

```bash
npm install
```

This installs:
- **Vite** - Build tool for bundling and development
- **Sharp** - Image optimization library

### 2. Start Development Server

```bash
npm run dev
```

Your site will open at `http://localhost:3000` with hot module replacement (changes auto-reload).

### 3. Build for Production

```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

---

## 📝 Common Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Image Optimization
npm run optimize-images        # Optimize all images
npm run responsive-images      # Generate responsive image sizes
```

---

## 🖼️ Image Optimization

### Quick Image Optimization

```bash
npm run optimize-images
```

This will:
- Compress all WebP images
- Create optimized versions with `-optimized` suffix
- Show size savings

### Generate Responsive Images

```bash
npm run responsive-images
```

This creates multiple sizes for responsive `srcset` usage.

---

## 🚢 Deploy

### Option 1: Netlify (Easiest)

1. Push to GitHub
2. Connect repository in Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy!

### Option 2: Vercel

1. Push to GitHub
2. Connect repository in Vercel
3. Vercel auto-detects Vite
4. Deploy!

### Option 3: Manual

```bash
npm run build
# Upload dist/ folder to your web server
```

---

## 📚 More Information

- **Detailed Build Guide:** See `docs/BUILD_AND_DEPLOY.md`
- **Project Structure:** See `README.md`
- **Project Rules:** See `.cursor/rules/cursorrules.mdc` (MUST READ FIRST)

---

**Need Help?** Check the troubleshooting section in `BUILD_AND_DEPLOY.md`

