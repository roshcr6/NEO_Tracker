# 🚀 Secure Deployment Guide

## Pre-Deployment Security Checklist

### Critical Security Tasks
- [x] Remove all hardcoded API keys from codebase
- [x] Remove debug console.log statements
- [x] Add input validation to all API endpoints
- [x] Configure security headers (CSP, HSTS, etc.)
- [x] Set up environment variable templates
- [x] Enable CORS with strict origin whitelist
- [x] Configure HTTPS enforcement
- [x] Add rate limiting middleware
- [ ] Set environment variables in hosting platforms
- [ ] Test security headers with securityheaders.com
- [ ] Verify API key rotation policy

---

## Backend Deployment (Render.com)

### 1. Environment Variables Setup

Go to Render Dashboard → Your Service → Environment

**Required Variables:**
```bash
SECRET_KEY=<generate-strong-random-key>
DEBUG=False
ALLOWED_HOSTS=your-app-name.onrender.com
FRONTEND_URL=https://your-frontend.vercel.app
NASA_API_KEY=<your-nasa-api-key>
```

**Generate SECRET_KEY:**
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Optional (Performance):**
```bash
REDIS_URL=<your-redis-connection-string>
RATELIMIT_ENABLE=True
```

### 2. Security Verification

After deployment, test your backend:

```bash
# Test HTTPS redirect
curl -I http://your-app.onrender.com
# Should return 301 redirect to https://

# Test CORS headers
curl -I https://your-app.onrender.com/api/asteroids \
  -H "Origin: https://your-frontend.vercel.app"
# Should include Access-Control-Allow-Origin header

# Test security headers
curl -I https://your-app.onrender.com
# Should include:
# - Strict-Transport-Security
# - X-Content-Type-Options
# - X-Frame-Options
# - Content-Security-Policy
```

### 3. Database Migration

Render will automatically run migrations on deployment. Verify:

```bash
# Check Render logs
# Should see:
# "Running migrations..."
# "Operations to perform: ..."
```

---

## Frontend Deployment (Vercel)

### 1. Environment Variables Setup

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Required Variables:**
```bash
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_GEMINI_API_KEY=<your-gemini-api-key>
```

**Get Gemini API Key:**
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key (starts with AIzaSy...)

**Optional:**
```bash
REACT_APP_ENABLE_CHATBOT=true
REACT_APP_ENABLE_ANALYTICS=false
```

### 2. Build Configuration

Vercel auto-detects React apps. Verify settings:

- **Framework Preset:** Create React App
- **Build Command:** `cd frontend && npm run build`
- **Output Directory:** `frontend/build`
- **Install Command:** `cd frontend && npm install`

### 3. Redeploy After Setting Variables

Environment variables require rebuild:
1. Go to Deployments tab
2. Click ⋮ on latest deployment
3. Click "Redeploy"
4. Wait for build to complete

---

## Post-Deployment Testing

### 1. Security Headers Check

Visit https://securityheaders.com and test your backend URL.

**Expected Grade:** A or A+

**Required Headers:**
- ✅ Strict-Transport-Security
- ✅ Content-Security-Policy
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ Referrer-Policy

### 2. SSL/TLS Configuration

Test at https://www.ssllabs.com/ssltest/

**Expected Grade:** A or A+

### 3. CORS Verification

Open browser DevTools (F12) → Network tab:

1. Visit your frontend
2. Click "Simulate Impact"
3. Check API request to backend
4. Response Headers should include:
   ```
   Access-Control-Allow-Origin: https://your-frontend.vercel.app
   Access-Control-Allow-Credentials: true
   ```

### 4. Functional Testing

- [ ] Homepage loads without errors
- [ ] Asteroid search returns results
- [ ] Impact simulation calculates correctly
- [ ] 3D Orrery renders without WebGL errors
- [ ] Chatbot responds (requires GEMINI_API_KEY)
- [ ] Map selection works
- [ ] No console errors in browser

### 5. Performance Testing

Use Lighthouse in Chrome DevTools:

**Target Scores:**
- Performance: 80+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

---

## Monitoring Setup (Recommended)

### Backend Monitoring

**Option 1: Sentry (Free tier available)**
```bash
pip install sentry-sdk
```

Add to `settings.py`:
```python
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn=config('SENTRY_DSN'),
    integrations=[DjangoIntegration()],
    traces_sample_rate=0.1,
)
```

**Option 2: Render Logs**
- Monitor in Render Dashboard → Logs
- Set up log alerts for errors

### Frontend Monitoring

**Option 1: Vercel Analytics**
- Enable in Vercel Dashboard → Analytics
- Free for hobby projects

**Option 2: Google Analytics**
```bash
npm install react-ga4
```

---

## Security Maintenance

### Weekly Tasks
- [ ] Review Render logs for unusual activity
- [ ] Check Vercel analytics for traffic spikes
- [ ] Monitor NASA API usage quota

### Monthly Tasks
- [ ] Run `npm audit` and review vulnerabilities
- [ ] Update dependencies: `npm update`
- [ ] Rotate API keys (NASA, Gemini)
- [ ] Review CORS allowed origins
- [ ] Check SSL certificate expiration

### Quarterly Tasks
- [ ] Review and update security headers
- [ ] Audit user permissions
- [ ] Test disaster recovery procedures
- [ ] Review and update documentation

---

## Troubleshooting

### Issue: Chatbot not responding

**Cause:** Missing GEMINI_API_KEY

**Fix:**
1. Get key from https://makersuite.google.com/app/apikey
2. Add to Vercel environment variables
3. Redeploy frontend

### Issue: CORS errors

**Cause:** Frontend URL not in CORS_ALLOWED_ORIGINS

**Fix:**
1. Check FRONTEND_URL in Render environment variables
2. Ensure it matches your Vercel domain exactly
3. Redeploy backend

### Issue: 500 Internal Server Error

**Cause:** Missing SECRET_KEY or other environment variable

**Fix:**
1. Check Render logs for specific error
2. Verify all required environment variables are set
3. Ensure no trailing slashes in URLs

### Issue: Static files not loading

**Cause:** Whitenoise configuration issue

**Fix:**
1. Run `python manage.py collectstatic` locally
2. Verify `STATIC_ROOT` is set correctly
3. Check Render build logs

---

## Emergency Procedures

### If API Keys Are Compromised

1. **Immediately** rotate all affected keys
2. Update environment variables on hosting platforms
3. Redeploy both frontend and backend
4. Monitor for unusual activity
5. Review access logs

### If Site Is Down

1. Check Render and Vercel status pages
2. Review recent deployments (rollback if needed)
3. Check logs for errors
4. Verify environment variables unchanged
5. Test backend health endpoint

### If Under DDoS Attack

1. Enable Cloudflare (free tier)
2. Contact Render/Vercel support
3. Implement rate limiting (enable RATELIMIT_ENABLE)
4. Consider adding CAPTCHA to forms

---

## Performance Optimization Tips

### Backend
1. Enable Redis caching (10x performance boost)
2. Use PostgreSQL instead of SQLite for production
3. Enable gzip compression in Render
4. Optimize database queries (use select_related)
5. Implement API response pagination

### Frontend
1. Enable Vercel Edge Functions for caching
2. Lazy load components with React.lazy()
3. Optimize images (use WebP format)
4. Implement service workers for offline support
5. Use React.memo for expensive components

---

## Compliance & Legal

### Data Privacy
- No user data is collected (privacy-friendly)
- NASA API usage complies with their terms
- Google Gemini usage complies with their terms

### API Usage Limits
- **NASA API:** 1,000 requests/hour (demo key)
- **NASA API:** 50,000 requests/day (registered key)
- **Google Gemini:** 60 requests/minute (free tier)

### Rate Limiting Recommendations
- Enable rate limiting on backend
- Implement client-side request throttling
- Cache API responses when possible

---

## Success Criteria

Deployment is successful when:
- ✅ All security headers return A grade
- ✅ SSL certificate is valid
- ✅ CORS requests work from frontend
- ✅ All functional tests pass
- ✅ No console errors in browser
- ✅ Lighthouse performance > 80
- ✅ API response time < 500ms
- ✅ No exposed secrets in logs

---

## Support Resources

### Documentation
- Django Security: https://docs.djangoproject.com/en/4.2/topics/security/
- React Best Practices: https://react.dev/learn
- OWASP Top 10: https://owasp.org/www-project-top-ten/

### Community
- Django Forum: https://forum.djangoproject.com/
- React Discord: https://discord.gg/react
- Stack Overflow: Tag questions with [django] [react] [security]

### Hosting Support
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs

---

## Changelog

**v1.0.0 - November 13, 2025**
- Initial secure deployment configuration
- Removed all hardcoded API keys
- Added comprehensive security headers
- Implemented input validation
- Configured CORS properly
- Added rate limiting middleware
- Optimized performance (removed console.logs)
