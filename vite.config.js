import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import os from 'node:os';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the build works under https://wlwzrd.github.io/excuseme/
  base: './',
  // Cache outside the project folder: sync tools (Dropbox, OneDrive) lock
  // node_modules/.vite while syncing and break dependency pre-bundling.
  cacheDir: path.join(os.tmpdir(), 'vite-cache-excuseme'),
});
