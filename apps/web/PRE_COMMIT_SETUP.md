# 🔒 Pre-commit Setup Documentation

## Overview

This project now includes a comprehensive pre-commit setup that automatically checks code quality before commits are made.

## What Gets Checked

### 🧹 **Linting & Formatting**
- **ESLint**: Checks and auto-fixes JavaScript/TypeScript code issues
- **Prettier**: Formats code consistently
- **Next.js**: Uses Next.js built-in linting rules

### 📝 **File Types Covered**
- **Code files**: `.js`, `.jsx`, `.ts`, `.tsx`
- **Config files**: `.json`
- **Styles**: `.css`
- **Documentation**: `.md`

## Tools Used

### 🐺 **Husky**
- Manages Git hooks
- Runs pre-commit checks automatically

### 🎭 **lint-staged**
- Only processes staged files (faster)
- Runs different commands for different file types

### 💅 **Prettier**
- Consistent code formatting
- Configured in `.prettierrc`

## Configuration

### 📦 **Package.json Scripts**
```json
{
  "scripts": {
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "pre-commit": "lint-staged"
  }
}
```

### 🎯 **lint-staged Rules**
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "next lint --fix --file",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

## How It Works

### 🔄 **Pre-commit Flow**
1. **Developer makes commit**: `git commit -m "message"`
2. **Husky intercepts**: Runs pre-commit hook
3. **lint-staged processes**: Only staged files
4. **Linting**: Fixes issues automatically where possible
5. **Formatting**: Applies consistent code style
6. **Success**: Commit proceeds if all checks pass
7. **Failure**: Commit is blocked, issues must be fixed

### ⚡ **Performance**
- Only processes staged files (not entire codebase)
- Parallel processing for different file types
- Fast execution with minimal overhead

## Manual Commands

### 🛠️ **Available Commands**
```bash
# Run linting manually
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Check TypeScript types
npm run type-check

# Run pre-commit checks manually
npm run pre-commit

# Format specific files with Prettier
npx prettier --write "src/**/*.{js,ts,tsx}"
```

## Troubleshooting

### 🚨 **Common Issues**

#### **Pre-commit Hook Not Running**
```bash
# Ensure Husky is properly installed
npm run prepare
```

#### **Linting Errors Block Commit**
```bash
# Fix automatically where possible
npm run lint:fix

# Or fix manually and re-commit
```

#### **Skip Pre-commit (Emergency Only)**
```bash
# Skip all hooks (use cautiously!)
git commit -m "message" --no-verify
```

### 🔧 **Configuration Files**
- `.husky/pre-commit` - Pre-commit hook script
- `.prettierrc` - Prettier configuration
- `.prettierignore` - Files to ignore for formatting
- `package.json` - lint-staged configuration

## Benefits

### ✅ **Code Quality**
- Consistent code style across the team
- Automatic fixing of common issues
- Prevents broken code from being committed

### 🚀 **Developer Experience**
- Fast feedback loop
- Automatic formatting saves time
- Clear error messages for issues

### 🛡️ **Project Health**
- Maintains high code quality standards
- Reduces review feedback on style issues
- Catches errors early in development

## Setup for New Developers

### 📋 **Getting Started**
1. **Clone repository**
2. **Install dependencies**: `npm install`
3. **Husky auto-setup**: Runs via `prepare` script
4. **Start coding**: Pre-commit hooks active automatically!

### 🎯 **No Additional Setup Required**
The pre-commit setup is automatically configured when running `npm install` thanks to the `prepare` script.

---

## 🎉 **Ready to Use!**

The pre-commit setup is now active and will automatically:
- ✅ Lint your code
- ✅ Format your files
- ✅ Ensure code quality
- ✅ Block commits with issues

Happy coding with confidence! 🚀