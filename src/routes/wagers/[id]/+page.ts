import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const res = await fetch(`/api/v1/wagers/${params.id}`);

	if (res.status === 404) {
		throw error(404, 'Wager not found');
	}

	if (!res.ok) {
		throw error(res.status, 'Failed to load wager');
	}

	const { wager } = await res.json();
	return { wager };
};
