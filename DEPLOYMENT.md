# Deployment Guide for IT Asset Management

This Vite React TypeScript application can be easily deployed to **Vercel** or **Render** for free in a few simple steps.

---

## 1. Prepare GitHub Repository

Before deploying to either platform, push your project to a GitHub repository:

```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit: IT Asset Management System"

# Push to GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/IT-ASSET-MANAGEMENT.git
git push -u origin main
```

---

## 2. Deploy to Vercel (Recommended - Fastest)

### Option A: Via Vercel Dashboard (No CLI required)
1. Go to [Vercel](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** ➔ **"Project"**.
3. Import your **`IT-ASSET-MANAGEMENT`** repository.
4. Vercel will automatically detect **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**. Your site will be live on a `.vercel.app` domain in ~30 seconds!

### Option B: Via Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy directly from your workspace directory
vercel
```

---

## 3. Deploy to Render

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **"New +"** ➔ **"Static Site"**.
3. Connect your GitHub repository.
4. Fill in the following settings:
   - **Name**: `it-asset-management`
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. Click **"Create Static Site"**.
6. Render will build the static asset bundle and provide a live `.onrender.com` URL.

---

## Configuration Settings Summary

| Setting | Value |
| :--- | :--- |
| **Framework** | Vite (React TS) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Node.js Version** | 18+ or 20+ |
