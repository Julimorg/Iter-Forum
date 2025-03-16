import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const hostNgrokServer = "5c60-2001-ee0-51d3-b570-246c-42c7-81c-41af";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [`${hostNgrokServer}.ngrok-free.app`],
  },
})
