import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
    },
    server: {
        port: 8080
    },
    define: {
        'import.meta.env.PEER_URL': JSON.stringify(process.env.PEER_URL || 'localhost'),
        'import.meta.env.PEER_PORT': JSON.stringify(process.env.PEER_PORT || '9000'),
    }
});
