import { error } from '@sveltejs/kit';
import type { SafeUser } from './auth';

export function requireAuth(user: SafeUser | null | undefined): SafeUser {
	if (!user) {
		throw error(401, 'Unauthorized');
	}
	return user;
}
