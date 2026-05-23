import { json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
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

export async function POST({ request }) {
	try {
		const body = await request.json();

		// Validate input
		const validated = createWagerSchema.parse(body);

		// For now, use a dummy userId. In real app, extract from session/auth
		const creatorId = 'user-1'; // TODO: Get from session

		// Create wager with participants
		const wager = await prisma.wager.create({
			data: {
				title: validated.title,
				description: validated.description,
				stakeAmount: validated.stakeAmount ? parseFloat(validated.stakeAmount) : null,
				stakeCurrency: validated.stakeCurrency,
				deadline: validated.deadline ? new Date(validated.deadline) : null,
				createdBy: creatorId,
				participants: {
					create: validated.participants.map((userId) => ({
						userId,
					})),
				},
			},
			include: {
				creator: true,
				participants: {
					include: {
						user: true,
					},
				},
			},
		});

		return json({ wager }, { status: 201 });
	} catch (error) {
		if (error instanceof Error && 'errors' in error) {
			// Zod validation error
			return json(
				{
					error: true,
					message: 'Validation error',
					details: error.errors,
				},
				{ status: 400 }
			);
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
