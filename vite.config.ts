import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// Change the `base` URL to match your repository name
export default defineConfig({
  plugins: [react()],
  base: '/PreethamYerragudi.github.io/' // 🔹 Update with your GitHub repo name
})
