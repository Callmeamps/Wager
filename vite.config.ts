import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: ['wager-production-e982.up.railway.app', '.up.railway.app'],
	},
	preview: {
		allowedHosts: ['wager-production-e982.up.railway.app', '.up.railway.app'],
	},
	ssr: {
		external: ['@prisma/client', 'prisma']
	},
	optimizeDeps: {
		exclude: ['@prisma/client', 'prisma']
	}
});
