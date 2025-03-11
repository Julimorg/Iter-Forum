import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const hostNgrokServer = "549a-2001-ee0-51d3-b570-f0df-4e45-e38e-52a7";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [`${hostNgrokServer}.ngrok-free.app`],
  },
})
