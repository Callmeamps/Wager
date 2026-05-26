import { json } from '@sveltejs/kit';
import { ZodError } from 'zod';
import { prisma } from '$lib/db';
import { requireAuth } from '$lib/server/require-auth';
import { submitProofSchema } from '$lib/validations';

export async function POST({ params, request, locals }) {
	try {
		const user = requireAuth(locals.user);
		const body = await request.json();
		const validated = submitProofSchema.parse(body);
		const userId = user.id;

		const wager = await prisma.wager.findUnique({
			where: { id: params.id },
			select: { id: true, status: true },
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

		const participant = await prisma.wagerParticipant.findUnique({
			where: {
				wagerId_userId: {
					wagerId: params.id,
					userId,
				},
			},
		});

		if (!participant) {
			return json(
				{
					error: true,
					message: 'Only participants can submit proof',
				},
				{ status: 403 }
			);
		}

		const proof = await prisma.proof.create({
			data: {
				wagerId: params.id,
				userId,
				link: validated.link,
				evidence: validated.evidence,
			},
			include: {
				user: {
					select: { id: true, email: true, name: true },
				},
			},
		});

		if (wager.status === 'PENDING') {
			await prisma.wager.update({
				where: { id: params.id },
				data: { status: 'SUBMITTED' },
			});
		}

		return json({ proof }, { status: 201 });
	} catch (error) {
		if (error instanceof ZodError) {
			return json(
				{
					error: true,
					message: 'Validation error',
					details: error.issues,
				},
				{ status: 400 }
			);
		}

		if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
			return json({ error: true, message: 'Unauthorized' }, { status: 401 });
		}

		console.error('Error submitting proof:', error);
		return json(
			{
				error: true,
				message: 'Failed to submit proof',
			},
			{ status: 500 }
		);
	}
}
