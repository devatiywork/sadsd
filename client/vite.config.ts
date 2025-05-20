// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig(() => {
	return {
		plugins: [react(), tailwindcss()],
		resolve: {
			alias: {
				'@components': path.resolve(__dirname, 'src/components'),
				'@pages': path.resolve(__dirname, 'src/pages'),
				'@styles': path.resolve(__dirname, 'src/styles'),
				'@': path.resolve(__dirname, 'src'),
			},
		},
		build: {
			cssCodeSplit: true,
			rollupOptions: {
				output: {
					entryFileNames: 'main.js',
				},
			},
		},
	}
})
