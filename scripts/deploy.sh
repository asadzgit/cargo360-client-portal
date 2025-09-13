#!/bin/bash

# Deployment script for different environments
# Usage: ./scripts/deploy.sh [environment]
# Example: ./scripts/deploy.sh production

ENVIRONMENT=${1:-development}

echo "Building for environment: $ENVIRONMENT"

# Build with specific environment
if [ "$ENVIRONMENT" = "production" ]; then
    npm run build -- --mode production
elif [ "$ENVIRONMENT" = "staging" ]; then
    npm run build -- --mode staging
else
    npm run build
fi

echo "Build completed for $ENVIRONMENT environment"
echo ""
echo "To change API URL after deployment, modify /config.js in your build folder:"
echo "window.APP_CONFIG = { API_BASE_URL: 'your-api-url-here' };"
