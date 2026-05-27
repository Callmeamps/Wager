import { json } from '@sveltejs/kit';
import { ZodError } from 'zod';
import { prisma } from '$lib/db';
import { requireAuth } from '$lib/server/require-auth';
import { updateWagerSchema } from '$lib/validations';

export async function GET({ params }) {
	try {
		const wager = await prisma.wager.findUnique({
			where: { id: params.id },
			include: {
				creator: {
					select: { id: true, email: true, name: true, avatar: true },
				},
				participants: {
					include: {
						user: {
							select: { id: true, email: true, name: true, avatar: true },
						},
					},
				},
				proofs: {
					include: {
						user: { select: { id: true, email: true, name: true } },
					},
					orderBy: { createdAt: 'desc' },
				},
				votes: {
					include: {
						voter: { select: { id: true, email: true, name: true } },
					},
					orderBy: { createdAt: 'desc' },
				},
				comments: {
					include: {
						user: { select: { id: true, email: true, name: true } },
					},
					orderBy: { createdAt: 'desc' },
				},
			},
		});

		if (!wager) {
			return json(
				{
					error: true,
					message: 'Wager not found',
				},
				{ status: 404 }
			);
		}

		return json({ wager });
	} catch (error) {
		console.error('Error fetching wager:', error);
		return json({ error: true, message: 'Failed to fetch wager' }, { status: 500 });
	}
}

export async function PATCH({ params, request, locals }) {
	try {
		const user = requireAuth(locals.user);
		const wager = await prisma.wager.findUnique({ where: { id: params.id }, select: { id: true, createdBy: true } });
		if (!wager) return json({ error: true, message: 'Wager not found' }, { status: 404 });
		if (wager.createdBy !== user.id) return json({ error: true, message: 'Only creator can edit' }, { status: 403 });

		const body = await request.json();
		const validated = updateWagerSchema.parse(body);

		const updated = await prisma.wager.update({
			where: { id: params.id },
			data: validated,
			include: { creator: { select: { id: true, email: true, name: true } } },
		});

		return json({ wager: updated });
	} catch (error) {
		if (error instanceof ZodError)
			return json({ error: true, message: 'Validation error', details: error.issues }, { status: 400 });
		if (error && typeof error === 'object' && 'status' in error && error.status === 401)
			return json({ error: true, message: 'Unauthorized' }, { status: 401 });
		console.error('Error updating wager:', error);
		return json({ error: true, message: 'Failed to update wager' }, { status: 500 });
	}
}

export async function DELETE({ params, locals }) {
	try {
		const user = requireAuth(locals.user);
		const wager = await prisma.wager.findUnique({ where: { id: params.id }, select: { id: true, createdBy: true, status: true } });
		if (!wager) return json({ error: true, message: 'Wager not found' }, { status: 404 });
		if (wager.createdBy !== user.id) return json({ error: true, message: 'Only creator can cancel' }, { status: 403 });

		await prisma.wager.update({ where: { id: params.id }, data: { status: 'CANCELLED' } });
		return new Response(null, { status: 204 });
	} catch (error) {
		if (error && typeof error === 'object' && 'status' in error && error.status === 401)
			return json({ error: true, message: 'Unauthorized' }, { status: 401 });
		console.error('Error cancelling wager:', error);
		return json({ error: true, message: 'Failed to cancel wager' }, { status: 500 });
	}
}
