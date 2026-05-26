import type { RequestEvent } from '@sveltejs/kit';

interface LimitRule {
	id: string;
	limit: number;
	windowMs: number;
	match: (event: RequestEvent) => boolean;
}

const LIMIT_RULES: LimitRule[] = [
	{
		id: 'wager-create',
		limit: 5,
		windowMs: 60 * 60 * 1000,
		match: ({ request, url }) => request.method === 'POST' && url.pathname === '/api/v1/wagers',
	},
	{
		id: 'vote-create',
		limit: 20,
		windowMs: 60 * 60 * 1000,
		match: ({ request, url }) =>
			request.method === 'POST' && /\/api\/v1\/wagers\/[^/]+\/votes$/.test(url.pathname),
	},
	{
		id: 'proof-create',
		limit: 10,
		windowMs: 60 * 60 * 1000,
		match: ({ request, url }) =>
			request.method === 'POST' && /\/api\/v1\/wagers\/[^/]+\/proofs$/.test(url.pathname),
	},
	{
		id: 'api-general',
		limit: 100,
		windowMs: 60 * 1000,
		match: ({ url }) => url.pathname.startsWith('/api/'),
	},
];

const hitStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(event: RequestEvent): string {
	const fromHeader = event.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
	if (fromHeader) return fromHeader;
	try {
		return event.getClientAddress();
	} catch {
		return 'unknown';
	}
}

function selectRule(event: RequestEvent): LimitRule | null {
	for (const rule of LIMIT_RULES) {
		if (rule.match(event)) return rule;
	}
	return null;
}

export function checkRateLimit(event: RequestEvent): {
	allowed: boolean;
	limit: number;
	remaining: number;
	retryAfterSeconds: number;
} {
	const rule = selectRule(event);
	if (!rule) {
		return { allowed: true, limit: 0, remaining: 0, retryAfterSeconds: 0 };
	}

	const key = `${rule.id}:${getClientIp(event)}`;
	const now = Date.now();
	const existing = hitStore.get(key);
	const bucket = !existing || now >= existing.resetAt
		? { count: 0, resetAt: now + rule.windowMs }
		: existing;

	bucket.count += 1;
	hitStore.set(key, bucket);

	const remaining = Math.max(rule.limit - bucket.count, 0);
	const allowed = bucket.count <= rule.limit;
	const retryAfterSeconds = Math.max(Math.ceil((bucket.resetAt - now) / 1000), 1);

	return {
		allowed,
		limit: rule.limit,
		remaining,
		retryAfterSeconds,
	};
}
