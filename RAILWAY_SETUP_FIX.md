# D010 Railway Backend 502 Error Fix

## Issue Identified
The `/api/upload-multiple` endpoint returns a 502 error due to **missing ANTHROPIC_API_KEY in Railway environment variables**.

## Root Cause Analysis

### What's Happening
1. Backend startup no longer fails (good - we fixed error handling)
2. When `/api/upload-multiple` endpoint receives requests, it tries to call Claude API
3. The `anthropic.Anthropic()` client is initialized with `api_key=None` because `os.getenv("ANTHROPIC_API_KEY")` returns nothing
4. When `claude.messages.create()` is called, it fails with auth error (401/403)
5. This bubbles up as a 502 error (Bad Gateway) from Railway's gateway

### Evidence
- **Local .env.local files:** All have `ANTHROPIC_API_KEY=your_api_key_here` (placeholder)
- **Railway environment:** ANTHROPIC_API_KEY not set
- **Code:** main.py line ~160 initializes Claude client without the key

## Files Modified

### 1. `/Users/docdex2/.openclaw/workspace/D010/backend/main.py`
**Change:** Added startup validation for ANTHROPIC_API_KEY

```python
# Initialize Claude client
api_key = os.getenv("ANTHROPIC_API_KEY")
if not api_key or api_key == "your_api_key_here" or api_key.strip() == "":
    print("WARNING: ANTHROPIC_API_KEY is not set or is a placeholder!")
    print("Set ANTHROPIC_API_KEY environment variable before deploying to production.")
    if os.getenv("ENVIRONMENT") == "production":
        raise ValueError("ANTHROPIC_API_KEY must be set in production environment")
    else:
        print("Running in development mode with missing API key. API calls will fail.")

claude = anthropic.Anthropic(api_key=api_key)
```

**Impact:** 
- Backend will now **FAIL TO START** in production if ANTHROPIC_API_KEY is missing
- Clear error message will be visible in Railway logs
- Better than silently failing when handling requests

## Required Manual Steps

### Step 1: Get Your ANTHROPIC_API_KEY
1. Go to https://console.anthropic.com/
2. Click on API keys (or account settings)
3. Create a new API key or copy existing one
4. The key format is: `sk-ant-xxxxx...` (long string)

### Step 2: Set ANTHROPIC_API_KEY in Railway
**Option A: Via Railway CLI (Recommended)**
```bash
cd /Users/docdex2/.openclaw/workspace/D010/backend
railway login  # (will open browser for auth)
railway variable set ANTHROPIC_API_KEY "sk-ant-your-api-key-here"
railway redeploy
```

**Option B: Via Railway Dashboard (Web UI)**
1. Go to https://railway.app
2. Click on your D010 project
3. Go to "Backend" service
4. Click on "Variables" tab
5. Click "New Variable"
6. Set Name: `ANTHROPIC_API_KEY`
7. Set Value: `sk-ant-your-api-key-here` (your actual key from step 1)
8. Click Save
9. Go to "Deployments" tab and click "Redeploy"

## Verification Steps

### Step 1: Confirm Startup
Check Railway logs for the message:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

NOT:
```
ERROR: ANTHROPIC_API_KEY must be set in production environment
```

### Step 2: Test /api/upload-multiple Endpoint
```bash
# Create a test PDF file or use an existing one
curl -X POST \
  -F "files=@/path/to/test.pdf" \
  https://d010-production.up.railway.app/api/upload-multiple
```

Expected response (if PDF is valid):
```json
{
  "success": true,
  "results": [
    {
      "fileName": "test.pdf",
      "success": true,
      "data": {
        "operator": "...",
        "entity": "...",
        "wells": [...]
      }
    }
  ],
  "summary": {...}
}
```

Error response (if test fails):
```json
{
  "detail": "Error processing multiple files: ..."
}
```

## Environment Variables Checklist

**Backend (Railway) should have:**
- ✅ `ENVIRONMENT=production` 
- ✅ `PORT=8000`
- ❌ `ANTHROPIC_API_KEY=sk-ant-...` **(MISSING - MUST ADD)**
- ✅ `ALLOWED_ORIGINS=https://d010.vercel.app,...`
- ✅ `FRONTEND_URL=https://d010.vercel.app`

**Frontend (Vercel) should have:**
- `NEXT_PUBLIC_BACKEND_URL=https://d010-production.up.railway.app`

## What This Fixes
1. ✅ Backend will fail to start if ANTHROPIC_API_KEY is missing (clear error)
2. ✅ `/api/upload-multiple` endpoint will work once API key is set
3. ✅ `/api/upload` endpoint will work
4. ✅ Any endpoint that calls Claude API will work
5. ✅ Clear error messages in Railway logs for debugging

## Post-Fix Tasks
1. [ ] Set ANTHROPIC_API_KEY in Railway
2. [ ] Redeploy backend
3. [ ] Check Railway logs for startup success
4. [ ] Test `/api/upload-multiple` with sample PDF
5. [ ] Test full flow from frontend (upload → process → view results)

## Related Files
- `.env.production.example` - Template for production environment variables
- `Dockerfile` - Production build configuration
- `railway.json` - Railway deployment configuration
- `main.py` - Backend application code
