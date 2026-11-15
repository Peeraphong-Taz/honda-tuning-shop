import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true, // ปลดล็อกให้เข้าผ่าน ngrok ทุกโดเมนได้ทันที
  }
});
