# ✅ STEP-BY-STEP DEPLOYMENT CHECKLIST

Copy this checklist and follow each step in order. **Estimated time: 20-25 minutes**

---

## SECTION A: Firebase Setup (5 minutes)

### A1: Create Firebase Project
- [ ] Open https://console.firebase.google.com/
- [ ] Click **"Add project"**
- [ ] Enter: `employee-engagement-metrics`
- [ ] Click **Continue** → **Continue** → **Create project**
- [ ] Wait for project to be created

### A2: Create Realtime Database
- [ ] Click **Build** → **Realtime Database**
- [ ] Click **Create Database**
- [ ] Select region closest to you
- [ ] Click **Start in test mode**
- [ ] Click **Enable**
- [ ] **✨ Copy the Database URL** (looks like `https://xxxx.firebaseio.com`)

### A3: Get Firebase Configuration
- [ ] Click the **⚙️ Settings** icon (top-left)
- [ ] Select **Project settings**
- [ ] Scroll to **Your apps** section
- [ ] Click **`</>`** icon for Web config
- [ ] **📝 Write down these 8 values:**
  - [ ] `apiKey`
  - [ ] `authDomain`
  - [ ] `projectId`
  - [ ] `storageBucket`
  - [ ] `messagingSenderId`
  - [ ] `appId`
  - [ ] `databaseURL` (from A2)
  - [ ] (You'll need your Gemini API Key too)

**✅ A Section Complete**

---

## SECTION B: Prepare Your Code (3 minutes)

### B1: Create .env File
```bash
# Run this command:
cp .env.example .env
```

### B2: Fill in .env File
- [ ] Open `.env` file in your editor
- [ ] Fill in all values from Section A:

```
GEMINI_API_KEY=<your gemini key>
VITE_FIREBASE_API_KEY=<from A3>
VITE_FIREBASE_AUTH_DOMAIN=<from A3>
VITE_FIREBASE_PROJECT_ID=<from A3>
VITE_FIREBASE_STORAGE_BUCKET=<from A3>
VITE_FIREBASE_MESSAGING_SENDER_ID=<from A3>
VITE_FIREBASE_APP_ID=<from A3>
VITE_FIREBASE_DATABASE_URL=<from A2>
VITE_REPO_NAME=employee-engagement-metrics
```

### B3: Install Dependencies
```bash
npm install
```
- [ ] Wait for installation to complete (1-2 minutes)

### B4: Test Locally (Optional)
```bash
npm run dev
```
- [ ] Open http://localhost:3000
- [ ] Try submitting a test survey
- [ ] Check Firebase Console - you should see the data
- [ ] Press Ctrl+C to stop the dev server

**✅ B Section Complete**

---

## SECTION C: GitHub Setup (5 minutes)

### C1: Initialize Git Repo
```bash
git init
git add .
git commit -m "Initial commit: Employee Engagement Metrics"
```
- [ ] Commands executed successfully

### C2: Create GitHub Repository
- [ ] Go to https://github.com/new
- [ ] **Repository name:** `employee-engagement-metrics`
- [ ] **Description:** "Employee Engagement Survey with Firebase"
- [ ] Select **Public**
- [ ] **DO NOT check** "Initialize this repository with:"
- [ ] Click **Create repository**

### C3: Push to GitHub
Copy the commands shown after creating the repo (they look like this):
```bash
git remote add origin https://github.com/YOUR_USERNAME/employee-engagement-metrics.git
git branch -M main
git push -u origin main
```
- [ ] Replace `YOUR_USERNAME` with your actual username
- [ ] Run all three commands
- [ ] Wait for push to complete

**✅ C Section Complete**

---

## SECTION D: Add GitHub Secrets (3 minutes)

### D1: Open GitHub Secrets
- [ ] Go to your repo: https://github.com/YOUR_USERNAME/employee-engagement-metrics
- [ ] Click **Settings** tab
- [ ] Click **Secrets and variables** → **Actions** (left sidebar)
- [ ] Click **New repository secret** button

### D2: Add 8 Secrets
Add each secret one at a time. Click **New repository secret** for each:

| Name | Value |
|---|---|
| GEMINI_API_KEY | Your Gemini API key |
| VITE_FIREBASE_API_KEY | From Firebase config |
| VITE_FIREBASE_AUTH_DOMAIN | From Firebase config |
| VITE_FIREBASE_PROJECT_ID | From Firebase config |
| VITE_FIREBASE_STORAGE_BUCKET | From Firebase config |
| VITE_FIREBASE_MESSAGING_SENDER_ID | From Firebase config |
| VITE_FIREBASE_APP_ID | From Firebase config |
| VITE_FIREBASE_DATABASE_URL | From Firebase config |

For each:
- [ ] Click **New repository secret**
- [ ] Paste **Name** from table
- [ ] Paste **Value** from your notes
- [ ] Click **Add secret**

**✅ D Section Complete** (8 secrets added)

---

## SECTION E: Enable GitHub Pages (2 minutes)

### E1: Configure Pages Settings
- [ ] Go to your repo **Settings**
- [ ] Click **Pages** (left sidebar)
- [ ] Under **Source**, select **Deploy from a branch**
- [ ] Under **Branch**, select **gh-pages** and **/root**
- [ ] Click **Save**

### E2: Check Deployment
- [ ] Go to **Actions** tab
- [ ] You should see **Deploy to GitHub Pages** workflow running
- [ ] Wait for it to complete (green checkmark ≈ 2-3 minutes)

**✅ E Section Complete**

---

## SECTION F: Test Your Live App (2 minutes)

### F1: Get Your Live URL
Your app is now live at:
```
https://YOUR_USERNAME.github.io/employee-engagement-metrics/
```

Example:
```
https://kedarr.github.io/employee-engagement-metrics/
```

### F2: Open and Test
- [ ] Open your live URL in a browser
- [ ] Go to **Entry** tab
- [ ] Fill out and submit a test survey
- [ ] Go to **Settings** tab → Enter PIN: `3879`
- [ ] View **Dashboard** - you should see your submission

### F3: Verify Data in Firebase
- [ ] Open Firebase Console
- [ ] Go to **Realtime Database**
- [ ] Expand **survey_entries**
- [ ] You should see your test submission

**✅ F Section Complete** ✨

---

## SECTION G: Secure Firebase (Optional but Recommended)

### G1: Update Database Rules
- [ ] Firebase Console → **Realtime Database** → **Rules**
- [ ] Replace all text with this:

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

- [ ] Click **Publish**

Note: These rules allow anyone to read/write. For production, add authentication.

**✅ G Section Complete**

---

## 🎉 DEPLOYMENT COMPLETE!

**What you've accomplished:**
- ✅ Created Firebase Realtime Database
- ✅ Configured GitHub Pages hosting
- ✅ Set up automatic CI/CD deployment
- ✅ Secured API keys with GitHub Secrets
- ✅ Deployed your app live
- ✅ Verified data persistence

**Your Live App:**
```
https://YOUR_USERNAME.github.io/employee-engagement-metrics/
```

**Key Features Now Working:**
- ✅ Users can submit surveys
- ✅ Data stored in Firebase (not lost on page refresh)
- ✅ All users see the same data
- ✅ Admin dashboard shows all submissions
- ✅ Automatic deployment when you push code

---

## 📝 For Future Updates

When you make code changes:
```bash
git add .
git commit -m "Your change description"
git push
```

GitHub automatically rebuilds and redeploys!

---

## ❌ If Something Goes Wrong

1. **Check GitHub Actions logs:**
   - Go to **Actions** tab
   - Click the failed workflow
   - Look for error messages

2. **Check Firebase Console:**
   - Verify Realtime Database is enabled
   - Check if data is being saved

3. **Check Browser Console:**
   - Open your live app
   - Press F12 (Developer Tools)
   - Go to **Console** tab
   - Look for red error messages

4. **Verify Environment Variables:**
   - GitHub Settings → Secrets
   - Make sure all 8 secrets are there
   - Double-check the values match exactly

---

## 📞 Need Help?

If you get stuck:
1. Read the **QUICK_START.md** section for your step
2. Check **DEPLOYMENT_GUIDE.md** troubleshooting
3. Verify your Firebase credentials are correct
4. Check all 8 GitHub Secrets are added
5. Review GitHub Actions and browser console logs

---

## ✨ Ready?

- [ ] All checkboxes above completed?
- [ ] App is loading at your GitHub Pages URL?
- [ ] Can you submit a survey and see it in the dashboard?
- [ ] Can you see data in Firebase Console?

**If all yes: 🎉 YOU'RE DONE!**

If not, check the troubleshooting section above.

---

**Time Elapsed:** _____ minutes
**Status:** ✅ **DEPLOYED**
