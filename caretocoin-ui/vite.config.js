import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Mode-driven: `vite --mode demoland` loads .env.demoland, etc.
export default defineConfig({
  plugins: [react()],
  server: { port: 5180 },
});
