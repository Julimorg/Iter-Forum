import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['b3d0-2001-ee0-520a-f550-7547-2897-59ec-ef54.ngrok-free.app'],
  },
})
