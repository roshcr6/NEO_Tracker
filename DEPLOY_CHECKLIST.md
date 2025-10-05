# 🚀 Quick Deploy Checklist

Use this checklist to deploy your app in under 10 minutes!

## ✅ Pre-Deployment

- [ ] Code pushed to GitHub
- [ ] Signed up for Vercel account
- [ ] Signed up for Render account

## 🔧 Backend (Render) - 5 minutes

- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend`
- [ ] Set build command: `./build.sh`
- [ ] Set start command: `gunicorn backend.wsgi:application`
- [ ] Add environment variables:
  - [ ] `SECRET_KEY` (generate new one)
  - [ ] `DEBUG=False`
  - [ ] `NASA_API_KEY=8Bzer5xzem5a4ZGqHrw4d9oR2KGdZ8f8gJeqscQC`
  - [ ] `PYTHON_VERSION=3.11.5`
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (~3-5 min)
- [ ] Copy backend URL

## ⚡ Frontend (Vercel) - 3 minutes

- [ ] Import project on Vercel
- [ ] Connect GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Set framework to "Create React App"
- [ ] Add environment variable:
  - [ ] `REACT_APP_API_URL=<your-render-backend-url>`
- [ ] Click "Deploy"
- [ ] Wait for deployment (~2-3 min)
- [ ] Copy frontend URL

## 🔄 Final Configuration - 2 minutes

- [ ] Go back to Render dashboard
- [ ] Add/update environment variables:
  - [ ] `FRONTEND_URL=<your-vercel-url>`
  - [ ] `ALLOWED_HOSTS=<your-render-domain>`
- [ ] Save and wait for auto-redeploy

## 🎉 Testing

- [ ] Visit your frontend URL
- [ ] Test asteroid data loading
- [ ] Test impact simulation
- [ ] Test 3D visualization
- [ ] Check browser console for errors

## 🌟 Optional Enhancements

- [ ] Set up custom domain (Vercel + Render)
- [ ] Configure uptime monitor (UptimeRobot)
- [ ] Enable Vercel Analytics
- [ ] Share your live URL!

---

**Total Time: ~10 minutes**
**Total Cost: $0 (FREE!)**

🎊 **Done! Your app is live!** 🎊
