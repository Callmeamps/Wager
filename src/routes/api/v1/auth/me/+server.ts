import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
	if (!locals.user) {
		return json({ error: true, message: 'Unauthorized' }, { status: 401 });
	}
	return json({ user: locals.user });
}
