import { json } from '@sveltejs/kit';
import { ZodError } from 'zod';
import { prisma } from '$lib/db';
import {
	AUTH_COOKIE_NAME,
	createAuthToken,
	getAuthCookieOptions,
	hashPassword,
} from '$lib/server/auth';
import { registerSchema } from '$lib/validations';

export async function POST({ request, cookies }) {
	try {
		const body = await request.json();
		const validated = registerSchema.parse(body);

		const existing = await prisma.user.findUnique({
			where: { email: validated.email.toLowerCase() },
			select: { id: true },
		});
		if (existing) {
			return json(
				{ error: true, message: 'Email already exists' },
				{ status: 409 }
			);
		}

		const passwordHash = await hashPassword(validated.password);
		const user = await prisma.user.create({
			data: {
				email: validated.email.toLowerCase(),
				name: validated.name,
				passwordHash,
			},
			select: { id: true, email: true, name: true, avatar: true },
		});

		const token = createAuthToken(user);
		cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

		return json({ user }, { status: 201 });
	} catch (error) {
		if (error instanceof ZodError) {
			return json(
				{ error: true, message: 'Validation error', details: error.issues },
				{ status: 400 }
			);
		}

		console.error('Error registering user:', error);
		return json({ error: true, message: 'Failed to register user' }, { status: 500 });
	}
}
