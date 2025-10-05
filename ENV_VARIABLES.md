# 🔧 Environment Variables Reference

Complete guide to all environment variables needed for deployment.

---

## 🔴 Backend Environment Variables (Render)

### Required Variables

| Variable | Description | Example | How to Get |
|----------|-------------|---------|------------|
| `SECRET_KEY` | Django secret key for security | `django-insecure-abc123...` | Generate with Python command below |
| `DEBUG` | Debug mode (MUST be False in production) | `False` | Set manually |
| `ALLOWED_HOSTS` | Domains allowed to access backend | `asteroid-backend.onrender.com` | Your Render domain |
| `NASA_API_KEY` | NASA API key for asteroid data | `8Bzer5xzem5a4ZGqHrw4d9oR2KGdZ8f8gJeqscQC` | Already included (or get from NASA) |
| `PYTHON_VERSION` | Python version | `3.11.5` | Set manually |
| `FRONTEND_URL` | Your Vercel frontend URL | `https://asteroid-app.vercel.app` | Get after deploying frontend |

### Generate SECRET_KEY

Run this command in your terminal:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Or use this online: [Django Secret Key Generator](https://djecrety.ir/)

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | SQLite (included) |

---

## 🔵 Frontend Environment Variables (Vercel)

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API endpoint | `https://asteroid-backend.onrender.com` |

### Important Notes:

- ⚠️ All React environment variables MUST start with `REACT_APP_`
- ⚠️ Do NOT include trailing slash in URL
- ⚠️ Changes require rebuild to take effect

---

## 📝 Local Development

### Backend (.env file)

Create `backend/.env`:

```env
SECRET_KEY=your-local-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_URL=http://localhost:3000
NASA_API_KEY=8Bzer5xzem5a4ZGqHrw4d9oR2KGdZ8f8gJeqscQC
```

### Frontend (.env.local file)

Create `frontend/.env.local`:

```env
REACT_APP_API_URL=http://localhost:8000
```

---

## 🔐 Security Best Practices

### ✅ DO:
- Generate a NEW `SECRET_KEY` for production
- Keep `DEBUG=False` in production
- Use environment variables (never hardcode)
- Restrict `ALLOWED_HOSTS` to your domains
- Keep `.env` files in `.gitignore`

### ❌ DON'T:
- Commit `.env` files to Git
- Use development secret keys in production
- Enable `DEBUG=True` in production
- Use `ALLOWED_HOSTS=['*']` in production

---

## 🛠️ How to Set Environment Variables

### On Render:

1. Go to your service dashboard
2. Click "Environment" in left sidebar
3. Click "Add Environment Variable"
4. Enter key and value
5. Click "Save Changes"
6. Service auto-redeploys

### On Vercel:

1. Go to your project
2. Click "Settings" → "Environment Variables"
3. Add variable name and value
4. Select environment (Production/Preview/Development)
5. Click "Save"
6. Redeploy to apply changes

---

## 🧪 Testing Environment Variables

### Backend (Test locally):

```bash
cd backend
python manage.py shell
```

```python
from django.conf import settings
print(settings.SECRET_KEY)
print(settings.DEBUG)
print(settings.ALLOWED_HOSTS)
```

### Frontend (Check in browser console):

```javascript
console.log(process.env.REACT_APP_API_URL);
```

---

## 📋 Quick Copy-Paste Templates

### Render Environment Variables (Key-Value Format):

```
SECRET_KEY=<GENERATE_NEW_ONE>
DEBUG=False
ALLOWED_HOSTS=your-app.onrender.com
NASA_API_KEY=8Bzer5xzem5a4ZGqHrw4d9oR2KGdZ8f8gJeqscQC
PYTHON_VERSION=3.11.5
FRONTEND_URL=https://your-app.vercel.app
```

### Vercel Environment Variables:

```
REACT_APP_API_URL=https://your-backend.onrender.com
```

---

## 🆘 Troubleshooting

### Problem: Changes not reflecting

**Solution:** Redeploy after changing environment variables
- Render: Automatic redeploy
- Vercel: Go to Deployments → Redeploy

### Problem: CORS errors

**Solution:** Check these variables match:
- Backend `FRONTEND_URL` = Frontend actual URL
- Frontend `REACT_APP_API_URL` = Backend actual URL
- No trailing slashes!

### Problem: 500 Internal Server Error

**Solution:** Check backend logs in Render:
- Missing environment variables
- Wrong `SECRET_KEY` format
- `DEBUG=True` (should be False)

---

## 🔄 Updating Variables

### After deployment:

1. Update variable in dashboard
2. Wait for auto-redeploy
3. Test the changes
4. Clear browser cache if needed

### Multiple environments:

You can set different variables for:
- Production (main branch)
- Preview (PR deployments)
- Development (local)

---

Need help? Check the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for full instructions!
