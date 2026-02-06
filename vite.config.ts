import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
    // Load environment variables from multiple sources
    const env = loadEnv(mode, '.', '');
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Try multiple environment variable sources
        'process.env.GEMINI_API_KEY': JSON.stringify(
          env.GEMINI_API_KEY || 
          process.env.GEMINI_API_KEY || 
          'your-api-key-here'
        )
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
