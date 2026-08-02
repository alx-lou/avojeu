import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: "/avojeu/",
    plugins: [react(), VitePWA({
        registerType: 'prompt',
        injectRegister: false,

        strategies: "generateSW",

        pwaAssets: {
            disabled: false,
            config: true,
        },

        manifest: {
            name: 'Avojeu',
            short_name: 'Avojeu',
            description: 'Board game utils app',
            display: "standalone",
            theme_color: '#FF9F1A',
            background_color: "#0F1217",
            start_url: "/avojeu/",
            scope: "/avojeu/",
            orientation: "portrait",
        },

        workbox: {
            globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
            cleanupOutdatedCaches: true,
            clientsClaim: true,
            skipWaiting: true,
        },

        devOptions: {
            enabled: false,
            navigateFallback: 'index.html',
            suppressWarnings: true,
            type: 'module',
        },
    })],
    server: {
        watch: {
            usePolling: true
        }
    }
})