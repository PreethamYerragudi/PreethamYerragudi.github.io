import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Change the `base` URL to match your repository name
export default defineConfig({
  plugins: [react()],
  base: '/PreethamYerragudi.github.io/', // Ensure this matches your repository name exactly
  build: {
    outDir: 'dist', // Ensure the build outputs to the 'dist' directory
    emptyOutDir: true, // Ensure the 'dist' directory is emptied before each build
  },
});