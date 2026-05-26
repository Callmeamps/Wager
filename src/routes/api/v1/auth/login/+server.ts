import { json } from '@sveltejs/kit';
import { ZodError } from 'zod';
import { prisma } from '$lib/db';
import {
	AUTH_COOKIE_NAME,
	createAuthToken,
	getAuthCookieOptions,
	verifyPassword,
} from '$lib/server/auth';
import { loginSchema } from '$lib/validations';

export async function POST({ request, cookies }) {
	try {
		const body = await request.json();
		const validated = loginSchema.parse(body);

		const user = await prisma.user.findUnique({
			where: { email: validated.email.toLowerCase() },
			select: { id: true, email: true, name: true, avatar: true, passwordHash: true },
		});

		if (!user?.passwordHash) {
			return json({ error: true, message: 'Invalid credentials' }, { status: 401 });
		}

		const ok = await verifyPassword(validated.password, user.passwordHash);
		if (!ok) {
			return json({ error: true, message: 'Invalid credentials' }, { status: 401 });
		}

		const safeUser = { id: user.id, email: user.email, name: user.name, avatar: user.avatar };
		const token = createAuthToken(safeUser);
		cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

		return json({ user: safeUser });
	} catch (error) {
		if (error instanceof ZodError) {
			return json(
				{ error: true, message: 'Validation error', details: error.issues },
				{ status: 400 }
			);
		}

		console.error('Error logging in:', error);
		return json({ error: true, message: 'Failed to login' }, { status: 500 });
	}
}
