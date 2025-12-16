#!/bin/bash

# Pre-Deployment Checklist Script
# This script helps you verify everything is set up correctly before deploying

echo "================================================"
echo "Pre-Deployment Checklist for GitHub Pages"
echo "================================================"
echo ""

# Check 1: Node modules
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "  ✓ node_modules exists"
else
    echo "  ✗ node_modules NOT found. Run: npm install"
fi
echo ""

# Check 2: Environment file
echo "✓ Checking .env file..."
if [ -f ".env" ]; then
    echo "  ✓ .env file exists"
    # Count lines that have values
    env_count=$(grep -c "=" .env 2>/dev/null || echo "0")
    echo "  ℹ Found $env_count environment variables"
else
    echo "  ✗ .env file NOT found. Create from .env.example"
fi
echo ""

# Check 3: GitHub setup
echo "✓ Checking Git configuration..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "  ✓ Git repository initialized"
    remote=$(git config --get remote.origin.url 2>/dev/null || echo "not set")
    echo "  ℹ Remote URL: $remote"
else
    echo "  ✗ Git repository NOT initialized. Run: git init"
fi
echo ""

# Check 4: Build files
echo "✓ Checking build configuration..."
if [ -f "vite.config.ts" ]; then
    echo "  ✓ vite.config.ts found"
else
    echo "  ✗ vite.config.ts NOT found"
fi

if [ -f "tsconfig.json" ]; then
    echo "  ✓ tsconfig.json found"
else
    echo "  ✗ tsconfig.json NOT found"
fi
echo ""

# Check 5: Firebase service
echo "✓ Checking Firebase integration..."
if [ -f "services/firebaseService.ts" ]; then
    echo "  ✓ firebaseService.ts found"
else
    echo "  ✗ firebaseService.ts NOT found"
fi
echo ""

# Check 6: Deployment config
echo "✓ Checking GitHub Actions..."
if [ -f ".github/workflows/deploy.yml" ]; then
    echo "  ✓ deploy.yml workflow found"
else
    echo "  ✗ deploy.yml workflow NOT found"
fi
echo ""

# Check 7: Documentation
echo "✓ Checking documentation..."
docs=("DEPLOYMENT_GUIDE.md" "QUICK_START.md" ".env.example")
for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "  ✓ $doc found"
    else
        echo "  ✗ $doc NOT found"
    fi
done
echo ""

echo "================================================"
echo "Next Steps:"
echo "================================================"
echo "1. Run: npm install (if not done)"
echo "2. Create .env file from .env.example"
echo "3. Test locally: npm run dev"
echo "4. Initialize Git: git init && git add . && git commit -m 'initial'"
echo "5. Follow QUICK_START.md for GitHub Pages setup"
echo ""
