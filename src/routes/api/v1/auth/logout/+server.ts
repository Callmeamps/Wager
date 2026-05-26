import { json } from '@sveltejs/kit';
import { AUTH_COOKIE_NAME, getAuthCookieOptions } from '$lib/server/auth';

export async function POST({ cookies }) {
	cookies.delete(AUTH_COOKIE_NAME, {
		...getAuthCookieOptions(),
		maxAge: 0,
	});

	return json({ ok: true });
}
