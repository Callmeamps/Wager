import { json } from '@sveltejs/kit';
import { prisma } from '$lib/db';

export async function GET() {
	try {
		await prisma.$queryRaw`SELECT 1`;
		return json({ status: 'ok', db: 'connected', uptime: process.uptime(), timestamp: new Date().toISOString() });
	} catch {
		return json({ status: 'error', db: 'disconnected' }, { status: 503 });
	}
}