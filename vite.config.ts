import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const hostNgrokServer = "6259-2001-ee0-520e-6be0-11a6-3bf9-2e2-1a21";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [`${hostNgrokServer}.ngrok-free.app`],
  },
})
