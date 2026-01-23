import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'robots.txt', 'img/**/*.png', 'img/**/*.webp'],
            manifest: {
                name: 'Pizzería La Foccacia',
                short_name: 'La Foccacia',
                description: 'Auténtica Pizza Artesanal y Cocina Italiana',
                theme_color: '#BE1E2D',
                background_color: '#FAFAFA',
                display: 'standalone',
                orientation: 'portrait',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ],
    base: './', // Permite que los archivos se carguen con rutas relativas (útil para file:// o subcarpetas)
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                menu: resolve(__dirname, 'menu.html'),
                contacto: resolve(__dirname, 'contacto.html'),
            },
        },
    },
});
