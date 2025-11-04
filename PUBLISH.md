# Publishing Guide for @mmdalipour/particle-morph

## Prerequisites

1. Make sure you have an npm account: https://www.npmjs.com/signup
2. Login to npm from terminal (if not already logged in):

```bash
npm login
```

## Publishing Steps

### 1. Navigate to the package directory

```bash
cd src
```

### 2. Clean and build the package

```bash
npm run build
```

This will:
- Clean the `dist` folder
- Compile TypeScript to JavaScript (CJS and ESM)
- Generate type definitions
- Bundle the GLSL shaders

### 3. Test the build locally (optional but recommended)

```bash
# In the src directory, create a local package link
npm link

# In another project directory
npm link @mmdalipour/particle-morph

# Test your package
# Then unlink when done:
npm unlink @mmdalipour/particle-morph
```

### 4. Publish to npm

```bash
# Dry run first (see what will be published)
npm publish --dry-run

# If everything looks good, publish for real
npm publish
```

Since your package is scoped (@mmdalipour/particle-morph) and has `"access": "public"` in publishConfig, it will be published as a public package.

## Quick Publish (All in One)

```bash
cd src && npm run build && npm publish
```

## Version Updates for Future Releases

When you need to publish a new version:

```bash
cd src

# For bug fixes (1.3.0 -> 1.3.1)
npm version patch

# For new features (1.3.0 -> 1.4.0)
npm version minor

# For breaking changes (1.3.0 -> 2.0.0)
npm version major

# Then publish
npm publish
```

## Verify Publication

After publishing, verify your package at:
- https://www.npmjs.com/package/@mmdalipour/particle-morph
- Try installing it: `npm install @mmdalipour/particle-morph`

## Troubleshooting

### "You must be logged in to publish packages"
```bash
npm login
```

### "You do not have permission to publish"
Make sure you're logged in with the correct npm account (@mmdalipour)

### "Package name already exists"
The package name is already yours, so this shouldn't happen unless someone else published it

### Build errors
Make sure all dependencies are installed:
```bash
npm install
```

## Current Version

**v1.3.0** - Ready to publish! 🎉

### What's New in 1.3.0
- ✨ Added `particleColor` prop for default particle color
- 🎨 Removed `segments` parameter (breaking change)
- 💥 Improved explosion physics with realistic motion
- ⚡ Major performance optimizations
- 🌐 Fixed sphere particle distribution with Fibonacci algorithm
- 🔧 Better scroll handling with requestAnimationFrame

## Post-Publish Checklist

- [ ] Verify package on npmjs.com
- [ ] Test installation in a fresh project
- [ ] Update main README.md if needed
- [ ] Create GitHub release with changelog
- [ ] Tweet/share the update (optional)

