import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const AUTH_COOKIE_NAME = 'auth_token';
const AUTH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export interface SafeUser {
	id: string;
	email: string;
	name: string | null;
	avatar: string | null;
}

interface AuthPayload {
	sub: string;
	email: string;
	name: string | null;
	iat?: number;
	exp?: number;
}

function getJwtSecret(): string {
	const fromEnv = process.env.JWT_SECRET;
	if (fromEnv && fromEnv.length >= 16) return fromEnv;
	if (process.env.NODE_ENV !== 'production') return 'dev-only-insecure-jwt-secret-change-me';
	throw new Error('JWT_SECRET missing or too short');
}

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
	return bcrypt.compare(password, passwordHash);
}

export function createAuthToken(user: SafeUser): string {
	return jwt.sign(
		{ email: user.email, name: user.name },
		getJwtSecret(),
		{ subject: user.id, expiresIn: AUTH_TOKEN_MAX_AGE_SECONDS }
	);
}

export function verifyAuthToken(token: string): AuthPayload | null {
	try {
		const payload = jwt.verify(token, getJwtSecret());
		if (typeof payload === 'string') return null;
		if (typeof payload.sub !== 'string') return null;
		if (typeof payload.email !== 'string') return null;
		return {
			sub: payload.sub,
			email: payload.email,
			name: typeof payload.name === 'string' ? payload.name : null,
			iat: payload.iat,
			exp: payload.exp,
		};
	} catch {
		return null;
	}
}

export function getAuthCookieOptions() {
	return {
		httpOnly: true,
		sameSite: 'lax' as const,
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		maxAge: AUTH_TOKEN_MAX_AGE_SECONDS,
	};
}
