# Quick Start: Step-by-Step GitHub Pages Deployment Guide

Follow these exact steps to deploy your Employee Engagement Metrics application on GitHub Pages with Firebase backend.

---

## 📋 SECTION A: FIREBASE SETUP (5 minutes)

### Step A1: Create Firebase Project
1. Open https://console.firebase.google.com/
2. Click **"Add project"**
3. Enter name: `employee-engagement-metrics`
4. Click **Continue** → **Continue** → **Create project** (wait for creation to complete)

### Step A2: Create Realtime Database
1. In Firebase Console, click **Build** → **Realtime Database** (left sidebar)
2. Click **Create Database**
3. Choose region closest to you
4. Click **Start in test mode**
5. Click **Enable**
6. Copy the Database URL (looks like: `https://your-project.firebaseio.com`)

### Step A3: Get Firebase Configuration
1. Click the **⚙️ Settings icon** (top-left area) → **Project settings**
2. Scroll down to **Your apps** section
3. Click the **`</>`** icon to see Web app config
4. Copy these 8 values:
   - **apiKey**
   - **authDomain**
   - **projectId**
   - **storageBucket**
   - **messagingSenderId**
   - **appId**
   - **databaseURL** (from Step A2)

**Keep these values handy for Step C!**

---

## 📦 SECTION B: PREPARE YOUR LOCAL CODE (2 minutes)

### Step B1: Create .env File
1. In your project folder, create a new file named `.env`
2. Fill it with your Firebase and Gemini values:
```
GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=YOUR_API_KEY_FROM_STEP_A3
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN_FROM_STEP_A3
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID_FROM_STEP_A3
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET_FROM_STEP_A3
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID_FROM_STEP_A3
VITE_FIREBASE_APP_ID=YOUR_APP_ID_FROM_STEP_A3
VITE_FIREBASE_DATABASE_URL=YOUR_DATABASE_URL_FROM_STEP_A3
VITE_REPO_NAME=employee-engagement-metrics
```

### Step B2: Install Dependencies
```bash
cd "/Users/kedarr/Desktop/Employee Engagement Metrics"
npm install
```

### Step B3: Test Locally (Optional)
```bash
npm run dev
```
Visit http://localhost:3000 and submit a test entry. You should see it in Firebase Console → Realtime Database.

---

## 🚀 SECTION C: GITHUB SETUP (10 minutes)

### Step C1: Initialize Git Repository
```bash
cd "/Users/kedarr/Desktop/Employee Engagement Metrics"
git init
git add .
git commit -m "Initial commit: Employee Engagement Metrics"
```

### Step C2: Create GitHub Repository
1. Go to https://github.com/new
2. **Repository name:** `employee-engagement-metrics`
3. **Description:** Employee Engagement Survey with Firebase
4. Select **Public**
5. **Do NOT check** "Initialize this repository with:"
6. Click **Create repository**

### Step C3: Push to GitHub
Copy and run these commands (replace YOUR_USERNAME):
```bash
git remote add origin https://github.com/YOUR_USERNAME/employee-engagement-metrics.git
git branch -M main
git push -u origin main
```

---

## 🔐 SECTION D: ADD SECRETS TO GITHUB (3 minutes)

### Step D1: Open GitHub Secrets
1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**

### Step D2: Add Each Secret
Click **New repository secret** and add these 8 secrets (copy values from Step A3):

| Secret Name | Value |
|---|---|
| `GEMINI_API_KEY` | Your Gemini API key |
| `VITE_FIREBASE_API_KEY` | apiKey from Step A3 |
| `VITE_FIREBASE_AUTH_DOMAIN` | authDomain from Step A3 |
| `VITE_FIREBASE_PROJECT_ID` | projectId from Step A3 |
| `VITE_FIREBASE_STORAGE_BUCKET` | storageBucket from Step A3 |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | messagingSenderId from Step A3 |
| `VITE_FIREBASE_APP_ID` | appId from Step A3 |
| `VITE_FIREBASE_DATABASE_URL` | databaseURL from Step A3 |

---

## ⚙️ SECTION E: ENABLE GITHUB PAGES (2 minutes)

### Step E1: Configure Pages
1. In your repo → **Settings** → **Pages** (left sidebar)
2. Under **Source**, select **Deploy from a branch**
3. Under **Branch**, select **gh-pages** and **/root**
4. Click **Save**

### Step E2: Trigger Deployment
The deployment will trigger automatically. To verify:
1. Go to **Actions** tab in your repo
2. You should see a **Deploy to GitHub Pages** workflow running
3. Wait for it to complete (green checkmark)

---

## ✅ SECTION F: ACCESS YOUR APP (1 minute)

### Step F1: Get Your Live URL
Your app is now live at:
```
https://YOUR_USERNAME.github.io/employee-engagement-metrics/
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step F2: Test It
1. Open the URL in a browser
2. Go to **Entry** tab → Submit a test survey
3. Go to **Settings** → Enter PIN `3879` → View **Dashboard**
4. Your data should appear in the dashboard
5. Check Firebase Console to confirm data was saved

---

## 📝 SECTION G: FIREBASE SECURITY (Production)

### Step G1: Update Database Rules
1. In Firebase Console → **Realtime Database** → **Rules**
2. Replace the default rules with:
```json
{
  "rules": {
    "survey_entries": {
      ".read": true,
      ".write": true,
      ".indexOn": ["timestamp", "type"]
    }
  }
}
```
3. Click **Publish**

> ⚠️ These rules allow anyone to read/write. For production, add authentication.

---

## 🔄 SECTION H: FUTURE UPDATES (For next time)

To update your app:
```bash
cd "/Users/kedarr/Desktop/Employee Engagement Metrics"
# Make your code changes
git add .
git commit -m "Your update message"
git push
```

GitHub Actions automatically deploys. Check **Actions** tab to monitor.

---

## ❌ TROUBLESHOOTING

| Issue | Solution |
|---|---|
| Build fails in GitHub Actions | Check all 8 secrets are added correctly in Step D |
| "Cannot find Firebase config" | Ensure `.env` file exists and `npm install` was run in Step B2 |
| App shows blank page | Check browser console (F12 → Console tab) for errors |
| Data not saving | Verify Realtime Database is enabled in Firebase Console |
| "403 Forbidden" error | Check GitHub Pages source is set to `gh-pages` in Step E1 |

---

## 📞 NEED HELP?

1. Check GitHub Actions logs: **Actions** → **Deploy to GitHub Pages** → Click the failed run
2. Check Firebase Console for database errors
3. Open browser DevTools (F12) and check Console tab
4. Verify all environment variables match your Firebase project exactly

---

**Deployment Complete! 🎉**

Your app is now live on GitHub Pages with a Firebase backend. Anyone can submit surveys, and authorized users can view the dashboard.
