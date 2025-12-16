# GitHub Pages & Firebase Deployment Guide

This guide walks you through deploying the Employee Engagement Metrics application on GitHub Pages with a Firebase backend for data persistence.

## Prerequisites

- GitHub account
- Firebase account (free tier works)
- Node.js and npm installed on your machine
- Git installed

---

## STEP 1: Set Up Firebase Database

### 1.1 Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `employee-engagement-metrics`
4. Click **Continue** through the setup steps
5. Disable Google Analytics (optional) and click **Create project**

### 1.2 Enable Realtime Database
1. In Firebase Console, click on **Build** → **Realtime Database**
2. Click **Create Database**
3. Select region closest to you
4. Start in **Test mode** (for development; secure rules for production)
5. Click **Enable**

### 1.3 Get Firebase Configuration
1. Go to **Project Settings** (gear icon) → **Project Settings**
2. Scroll down to "Your apps" section
3. Click on `</>` (Web) app icon, or create a new Web app if needed
4. Copy the Firebase config object with these keys:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
   - `databaseURL` (from Realtime Database section)

---

## STEP 2: Set Up GitHub Repository

### 2.1 Initialize Git Repository Locally
```bash
cd "/Users/kedarr/Desktop/Employee Engagement Metrics"
git init
git add .
git commit -m "Initial commit: Employee Engagement Metrics application"
```

### 2.2 Create Repository on GitHub
1. Go to [GitHub](https://github.com/new)
2. **Repository name:** `employee-engagement-metrics`
3. **Description:** "Employee Engagement Survey Application with Firebase Backend"
4. Choose **Public** (for GitHub Pages)
5. **Do NOT** initialize with README, .gitignore, or license
6. Click **Create repository**

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/employee-engagement-metrics.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## STEP 3: Configure Environment Variables in GitHub

### 3.1 Add Secrets to GitHub
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add the following:

| Secret Name | Value |
|---|---|
| `GEMINI_API_KEY` | Your Gemini API key |
| `VITE_FIREBASE_API_KEY` | Firebase apiKey |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase authDomain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase projectId |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storageBucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messagingSenderId |
| `VITE_FIREBASE_APP_ID` | Firebase appId |
| `VITE_FIREBASE_DATABASE_URL` | Firebase databaseURL |

### 3.2 Configure GitHub Pages Settings
1. Go to **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Under **Branch**, select **gh-pages** and **/root**
4. Click **Save**

> Note: The GitHub Actions workflow will automatically create and push to the `gh-pages` branch.

---

## STEP 4: Local Development (Optional)

### 4.1 Create .env File
```bash
cp .env.example .env
```

Edit `.env` and fill in your Firebase configuration:
```
GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_DATABASE_URL=https://your_firebase_project.firebaseio.com
VITE_REPO_NAME=employee-engagement-metrics
```

### 4.2 Install Dependencies
```bash
npm install
```

### 4.3 Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4.4 Build for Production
```bash
npm run build
```

---

## STEP 5: Configure Firebase Security Rules

> **Important:** Move from Test Mode to Production for security!

### 5.1 Update Database Rules
1. In Firebase Console, go to **Realtime Database** → **Rules**
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

> ⚠️ **For production**, consider restricting write access with authentication or rate limiting.

3. Click **Publish**

---

## STEP 6: Automatic Deployment

### 6.1 Trigger Deployment
Every time you push to the `main` branch, GitHub Actions automatically:
1. Builds the application
2. Deploys to GitHub Pages

Monitor the build status:
1. Go to your GitHub repository
2. Click **Actions**
3. Watch the workflow run

### 6.2 Access Your Application
Once the deployment completes:
```
https://YOUR_USERNAME.github.io/employee-engagement-metrics/
```

---

## TROUBLESHOOTING

### Build Fails with Environment Variables Not Found
- Ensure all secrets are added to GitHub Settings → Secrets
- Verify environment variable names match exactly in the workflow file

### Firebase Connection Errors
- Check Firebase configuration in GitHub secrets
- Ensure Realtime Database is enabled in Firebase Console
- Verify database URL format: `https://project-name.firebaseio.com`

### Application Shows Blank Page
- Check browser console for errors (F12)
- Verify build completed successfully in GitHub Actions
- Clear browser cache and reload

### Data Not Persisting
- Verify Firebase Realtime Database is enabled
- Check Firebase rules allow read/write access
- Monitor Firebase Console for errors in Realtime Database

---

## Advanced: Custom Domain (Optional)

To use a custom domain instead of `github.io`:

1. Update `base` in `vite.config.ts` to `/` instead of `/repo-name/`
2. Add CNAME file to `public/` folder with your domain
3. Configure DNS records at your domain registrar to point to GitHub Pages
4. Enable custom domain in GitHub Pages settings

---

## Monitoring & Updates

### Check Data in Firebase
1. Open Firebase Console
2. Go to **Realtime Database**
3. View submitted survey entries in the `survey_entries` tree
4. Use the filter/search to analyze data

### Update Application Code
1. Make changes locally
2. Test with `npm run dev`
3. Commit and push:
   ```bash
   git add .
   git commit -m "Your message"
   git push
   ```
4. GitHub Actions automatically redeploys

---

## Security Checklist

- ✅ Never commit `.env` file to git
- ✅ Keep API keys in GitHub Secrets, not in code
- ✅ Use HTTPS for Firebase connection
- ✅ Enable Firebase authentication rules in production
- ✅ Monitor Firebase quota usage to prevent unexpected bills

---

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Firebase Realtime Database Docs](https://firebase.google.com/docs/database)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

---

## Support

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/YOUR_USERNAME/employee-engagement-metrics/issues)
2. Review Firebase Console logs
3. Check GitHub Actions workflow logs
4. Search Stack Overflow with the error message

---

**Last Updated:** December 2025
