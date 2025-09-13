# Deployment Guide

This project supports multiple deployment strategies to handle different environments without rebuilding.

## Build-time Environment Variables

For traditional build-time configuration:

```bash
# Development build
npm run build

# Staging build  
npm run build -- --mode staging

# Production build
npm run build -- --mode production
```

## Runtime Configuration (Recommended)

For post-deployment configuration changes without rebuilding:

### 1. Build once for any environment:
```bash
npm run build
```

### 2. After deployment, modify `/config.js` in your build folder:

**For Production:**
```javascript
window.APP_CONFIG = {
  API_BASE_URL: 'https://api.cargo360.com',
  NODE_ENV: 'production'
};
```

**For Staging:**
```javascript
window.APP_CONFIG = {
  API_BASE_URL: 'https://staging-api.cargo360.com', 
  NODE_ENV: 'staging'
};
```

### 3. Restart your web server

## Environment Files

- `.env` - Development defaults
- `.env.staging` - Staging environment
- `.env.production` - Production environment
- `.env.example` - Template for new environments

## Deployment Script

Use the provided deployment script:

```bash
# Deploy for production
./scripts/deploy.sh production

# Deploy for staging  
./scripts/deploy.sh staging

# Deploy for development
./scripts/deploy.sh
```

## Benefits

✅ **Single build** can be deployed to multiple environments  
✅ **No rebuild required** to change API endpoints  
✅ **Runtime configuration** takes precedence over build-time vars  
✅ **Fallback support** if runtime config is missing
