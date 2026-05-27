import { json } from '@sveltejs/kit';
import { ZodError } from 'zod';
import { prisma } from '$lib/db';
import { requireAuth } from '$lib/server/require-auth';
import { commentSchema } from '$lib/validations';

export async function POST({ params, request, locals }) {
	try {
		const user = requireAuth(locals.user);
		const body = await request.json();
		const validated = commentSchema.parse(body);

		const wager = await prisma.wager.findUnique({ where: { id: params.id }, select: { id: true } });
		if (!wager) return json({ error: true, message: 'Wager not found' }, { status: 404 });

		const comment = await prisma.comment.create({
			data: { wagerId: params.id, userId: user.id, content: validated.content },
			include: { user: { select: { id: true, email: true, name: true } } },
		});

		return json({ comment }, { status: 201 });
	} catch (error) {
		if (error instanceof ZodError)
			return json({ error: true, message: 'Validation error', details: error.issues }, { status: 400 });
		if (error && typeof error === 'object' && 'status' in error && error.status === 401)
			return json({ error: true, message: 'Unauthorized' }, { status: 401 });
		console.error('Error creating comment:', error);
		return json({ error: true, message: 'Failed to create comment' }, { status: 500 });
	}
}