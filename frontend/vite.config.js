import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: 'src', // points Vite to src folder
  build: {
    outDir: path.resolve(__dirname, '../dist'), // output to frontend/dist
  },
})
