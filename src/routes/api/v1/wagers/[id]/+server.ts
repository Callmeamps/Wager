import { json } from '@sveltejs/kit';
import { prisma } from '$lib/db';

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
		return json(
			{
				error: true,
				message: 'Failed to fetch wager',
			},
			{ status: 500 }
		);
	}
}
