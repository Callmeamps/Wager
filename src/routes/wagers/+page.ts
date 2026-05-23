import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const res = await fetch('/api/v1/wagers');
		const { wagers } = await res.json();
		return { wagers };
	} catch (error) {
		console.error('Failed to load wagers:', error);
		return { wagers: [] };
	}
};
