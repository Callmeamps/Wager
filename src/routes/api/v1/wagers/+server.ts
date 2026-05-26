import { json } from '@sveltejs/kit';
import { ZodError } from 'zod';
import { prisma } from '$lib/db';
import { requireAuth } from '$lib/server/require-auth';
import { createWagerSchema } from '$lib/validations';

export async function GET() {
	try {
		const wagers = await prisma.wager.findMany({
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
				},
				votes: {
					include: {
						voter: { select: { id: true, email: true, name: true } },
					},
				},
				comments: {
					include: {
						user: { select: { id: true, email: true, name: true } },
					},
					take: 5,
					orderBy: { createdAt: 'desc' },
				},
			},
			orderBy: { createdAt: 'desc' },
			take: 20,
		});

		return json({ wagers, total: wagers.length });
	} catch (error) {
		console.error('Error fetching wagers:', error);
		return json(
			{
				error: true,
				message: 'Failed to fetch wagers',
			},
			{ status: 500 }
		);
	}
}

export async function POST({ request, locals }) {
	try {
		const user = requireAuth(locals.user);
		const body = await request.json();
		const validated = createWagerSchema.parse(body);

		const creatorId = user.id;
		const participantIds = Array.from(new Set([...validated.participants, creatorId]));
		const requiredUserIds = Array.from(new Set([creatorId, ...participantIds]));
		const users = await prisma.user.findMany({
			where: { id: { in: requiredUserIds } },
			select: { id: true },
		});

		const existingUserIds = new Set(users.map((user) => user.id));
		const missingUserIds = requiredUserIds.filter((userId) => !existingUserIds.has(userId));
		if (missingUserIds.length > 0) {
			return json(
				{
					error: true,
					message: 'Unknown users in participants',
					details: { missingUserIds },
				},
				{ status: 400 }
			);
		}

		const wager = await prisma.wager.create({
			data: {
				title: validated.title,
				description: validated.description,
				stakeAmount: validated.stakeAmount ? parseFloat(validated.stakeAmount) : null,
				stakeCurrency: validated.stakeCurrency,
				deadline: validated.deadline ? new Date(validated.deadline) : null,
				createdBy: creatorId,
				participants: {
					create: participantIds.map((userId) => ({ userId })),
				},
			},
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
			},
		});

		return json({ wager }, { status: 201 });
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

		console.error('Error creating wager:', error);
		return json(
			{
				error: true,
				message: 'Failed to create wager',
			},
			{ status: 500 }
		);
	}
}
