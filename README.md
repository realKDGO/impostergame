# BLENDIN: Who's the Impostor?

Standard Vite + React + TypeScript version of the pass-the-phone social deduction game.

## Requirements

- Node.js 20.19 or newer
- npm

## Local development

```bash
npm install
npm run dev
```

For access from another device on the same network:

```bash
npm run dev -- --host 0.0.0.0
```

## Production build

```bash
npm run build
npm run preview
```

The production files are generated in `dist`.

## Vercel

Import the repository into Vercel. Choose Vite, use `npm run build`, and set the output directory to `dist`.
