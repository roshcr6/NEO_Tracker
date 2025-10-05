# 🚀 Deployment Guide - Asteroid Impact Simulator

Complete guide to deploy your full-stack application for **FREE** with zero downtime!

---

## 📋 Prerequisites

1. ✅ GitHub account (you already have the repo!)
2. ✅ Vercel account (sign up at [vercel.com](https://vercel.com))
3. ✅ Render account (sign up at [render.com](https://render.com))

---

## 🎯 Deployment Strategy

- **Frontend (React)** → Vercel (Fast, free, unlimited bandwidth)
- **Backend (Django)** → Render (Free tier with database)

---

## 📦 STEP 1: Push Your Code to GitHub

```bash
cd nasafinalll
git add .
git commit -m "Add deployment configuration"
git push origin main
```

---

## 🌐 STEP 2: Deploy Backend on Render

### 2.1 Create Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select the **`nasafinalll`** repository
5. Configure the service:

   ```
   Name: asteroid-backend
   Region: Oregon (or closest to you)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: ./build.sh
   Start Command: gunicorn backend.wsgi:application
   ```

### 2.2 Set Environment Variables

Click **"Advanced"** and add these environment variables:

| Key | Value |
|-----|-------|
| `SECRET_KEY` | Generate a new secret key (see below) |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | Your render URL (e.g., `asteroid-backend.onrender.com`) |
| `NASA_API_KEY` | `8Bzer5xzem5a4ZGqHrw4d9oR2KGdZ8f8gJeqscQC` |
| `FRONTEND_URL` | (Leave empty for now, we'll add it after deploying frontend) |
| `PYTHON_VERSION` | `3.11.5` |

**Generate SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 2.3 Deploy

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Copy your backend URL (e.g., `https://asteroid-backend.onrender.com`)

---

## ⚡ STEP 3: Deploy Frontend on Vercel

### 3.1 Import Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import the **`nasafinalll`** repository
4. Configure the project:

   ```
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

### 3.2 Set Environment Variables

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `REACT_APP_API_URL` | Your Render backend URL (e.g., `https://asteroid-backend.onrender.com`) |

### 3.3 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Copy your frontend URL (e.g., `https://asteroid-impact.vercel.app`)

---

## 🔄 STEP 4: Update Backend CORS Settings

Now that you have your frontend URL, update the backend:

1. Go back to **Render Dashboard**
2. Select your **asteroid-backend** service
3. Go to **"Environment"** tab
4. Add/Update:
   - `FRONTEND_URL` = Your Vercel URL (e.g., `https://asteroid-impact.vercel.app`)
   - `ALLOWED_HOSTS` = `asteroid-backend.onrender.com,www.asteroid-backend.onrender.com`
5. Click **"Save Changes"**
6. Service will automatically redeploy

---

## ✅ STEP 5: Test Your Deployment

1. Visit your Vercel URL
2. Try fetching asteroid data
3. Test impact simulation
4. Check 3D visualizations

---

## 🎨 STEP 6: Custom Domain (Optional)

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Render:
1. Go to Service Settings → Custom Domain
2. Add your domain
3. Update DNS records

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** Backend won't start
- Check logs in Render dashboard
- Verify all environment variables are set
- Make sure `build.sh` has execution permissions

**Problem:** CORS errors
- Verify `FRONTEND_URL` is set correctly
- Check `ALLOWED_HOSTS` includes your Render domain
- Ensure frontend URL doesn't have trailing slash

**Problem:** Database errors
- Render's free tier uses SQLite (included)
- Migrations run automatically in `build.sh`

### Frontend Issues

**Problem:** API calls failing
- Check `REACT_APP_API_URL` in Vercel environment variables
- Verify backend is running (visit backend URL)
- Check browser console for CORS errors

**Problem:** Build fails
- Check Node version (should use latest LTS)
- Clear cache and redeploy
- Check for missing dependencies in `package.json`

### Cold Start (Render Free Tier)

⚠️ **Important:** Render free tier spins down after 15 minutes of inactivity

- First request after inactivity takes 30-60 seconds
- Solution: Use a free uptime monitor like [UptimeRobot](https://uptimerobot.com) to ping your backend every 14 minutes

---

## 🔄 Continuous Deployment

### Automatic Updates

Both Vercel and Render support automatic deployments:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Automatic Deployment:**
   - Vercel rebuilds frontend automatically
   - Render rebuilds backend automatically

### Environment-Specific Branches

- `main` → Production
- `develop` → Staging (create separate Vercel/Render projects)

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Free)
1. Go to your project in Vercel
2. Enable Analytics in project settings
3. View traffic, performance, and errors

### Render Metrics
1. View CPU, Memory usage in dashboard
2. Check deployment logs
3. Monitor response times

---

## 💰 Cost Breakdown

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| Vercel | Hobby | **FREE** | Unlimited bandwidth, 100GB build time/month |
| Render | Free | **FREE** | 750 hours/month, spins down after 15 min |

**Total Monthly Cost: $0** 🎉

---

## 🚀 Optional Upgrades

### If you need 24/7 uptime (no cold starts):

**Render Starter Plan: $7/month**
- No spin down
- 512MB RAM
- Custom domains

**Alternative:** Use Railway ($5 free credit/month)
- 500 hours free
- No cold starts with free credit

---

## 📞 Support

### Issues?
1. Check deployment logs in Render/Vercel
2. Verify environment variables
3. Test backend endpoint directly: `https://your-backend.onrender.com/api/asteroids/`
4. Check frontend console for errors

### Quick Tests:

**Backend Health:**
```bash
curl https://your-backend.onrender.com/api/asteroids/
```

**Frontend Build Locally:**
```bash
cd frontend
npm install
npm run build
```

---

## 🎉 You're Done!

Your Asteroid Impact Simulator is now live and accessible worldwide! 🌍

- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.onrender.com
- **Status:** Production-ready, scalable, and FREE!

---

## 📚 Next Steps

1. ✅ Add custom domain
2. ✅ Set up uptime monitoring
3. ✅ Enable Vercel Analytics
4. ✅ Share your project!
5. ✅ Add to your portfolio

**Pro Tip:** Pin your backend on Render using a free uptime monitor to avoid cold starts!

---

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/)
- [React Production Build](https://create-react-app.dev/docs/production-build/)

Happy Deploying! 🚀
