import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
  test: {
    environment: 'jsdom',
    setupFiles: 'src/setupTests.ts',
  },
});
