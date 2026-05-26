import type { Handle } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { AUTH_COOKIE_NAME, verifyAuthToken } from '$lib/server/auth';
import { checkRateLimit } from '$lib/server/rate-limit';

function getAllowedOrigins(): string[] {
	const raw = process.env.ALLOWED_ORIGINS;
	if (!raw) return ['http://localhost:4317', 'http://localhost:5173'];
	return raw
		.split(',')
		.map((origin) => origin.trim())
		.filter(Boolean);
}

function getCorsOrigin(origin: string | null): string | null {
	if (!origin) return null;
	const allowed = getAllowedOrigins();
	return allowed.includes(origin) ? origin : null;
}

export const handle: Handle = async ({ event, resolve }) => {
	const isApi = event.url.pathname.startsWith('/api/');
	const origin = event.request.headers.get('origin');
	const allowedOrigin = getCorsOrigin(origin);

	if (isApi && event.request.method === 'OPTIONS') {
		if (origin && !allowedOrigin) {
			return new Response('CORS forbidden', { status: 403 });
		}
		return new Response(null, {
			status: 204,
			headers: {
				...(allowedOrigin ? { 'Access-Control-Allow-Origin': allowedOrigin } : {}),
				'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
		});
	}

	if (isApi && origin && !allowedOrigin) {
		return new Response('CORS forbidden', { status: 403 });
	}

	if (isApi) {
		const rate = checkRateLimit(event);
		if (!rate.allowed) {
			return new Response(JSON.stringify({ error: true, message: 'Too many requests' }), {
				status: 429,
				headers: {
					'content-type': 'application/json',
					'retry-after': String(rate.retryAfterSeconds),
					'x-ratelimit-limit': String(rate.limit),
					'x-ratelimit-remaining': String(rate.remaining),
				},
			});
		}
	}

	const authHeader = event.request.headers.get('authorization');
	const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
	const cookieToken = event.cookies.get(AUTH_COOKIE_NAME);
	const token = bearerToken ?? cookieToken;

	event.locals.user = null;
	if (token) {
		const payload = verifyAuthToken(token);
		if (payload?.sub) {
			const user = await prisma.user.findUnique({
				where: { id: payload.sub },
				select: { id: true, email: true, name: true, avatar: true },
			});
			if (user) {
				event.locals.user = user;
			}
		}
	}

	const response = await resolve(event);

	if (isApi && allowedOrigin) {
		response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
		response.headers.set('Access-Control-Allow-Credentials', 'true');
		response.headers.set('Vary', 'Origin');
	}

	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self';");

	return response;
};
