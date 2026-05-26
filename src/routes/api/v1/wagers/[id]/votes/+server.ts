import { Prisma } from '@prisma/client';
import { json } from '@sveltejs/kit';
import { ZodError } from 'zod';
import { prisma } from '$lib/db';
import { requireAuth } from '$lib/server/require-auth';
import { voteSchema } from '$lib/validations';

export async function POST({ params, request, locals }) {
	try {
		const user = requireAuth(locals.user);
		const body = await request.json();
		const validated = voteSchema.parse(body);
		const userId = user.id;

		const wager = await prisma.wager.findUnique({
			where: { id: params.id },
			select: { id: true },
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
					message: 'Only participants can vote',
				},
				{ status: 403 }
			);
		}

		const vote = await prisma.vote.create({
			data: {
				wagerId: params.id,
				voterId: userId,
				isValid: validated.isValid,
				comment: validated.comment,
			},
			include: {
				voter: {
					select: { id: true, email: true, name: true },
				},
			},
		});

		const [participantsCount, votesCount, validVotesCount] = await Promise.all([
			prisma.wagerParticipant.count({ where: { wagerId: params.id } }),
			prisma.vote.count({ where: { wagerId: params.id } }),
			prisma.vote.count({ where: { wagerId: params.id, isValid: true } }),
		]);

		if (participantsCount > 0 && votesCount >= participantsCount) {
			await prisma.wager.update({
				where: { id: params.id },
				data: { status: 'RESOLVED' },
			});
		}

		return json(
			{
				vote,
				tally: {
					totalVotes: votesCount,
					validVotes: validVotesCount,
					invalidVotes: votesCount - validVotesCount,
					participants: participantsCount,
				},
			},
			{ status: 201 }
		);
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

		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
			return json(
				{
					error: true,
					message: 'User already voted on this wager',
				},
				{ status: 409 }
			);
		}

		console.error('Error casting vote:', error);
		return json(
			{
				error: true,
				message: 'Failed to cast vote',
			},
			{ status: 500 }
		);
	}
}
