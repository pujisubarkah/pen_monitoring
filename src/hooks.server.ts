import type { Handle } from '@sveltejs/kit';
import { verifyJWT } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { sessions, users } from '$lib/server/schema';

export const handle: Handle = async ({ event, resolve }) => {
	// Get the session token from cookies
	const sessionToken = event.cookies.get('session');

	if (sessionToken) {
		// Verify JWT token
		const payload = verifyJWT(sessionToken);

		if (payload) {
			// Check if session exists in database and is not expired
			const session = await db
				.select()
				.from(sessions)
				.where(eq(sessions.id, sessionToken))
				.limit(1);

			if (session.length > 0 && session[0].expiresAt > new Date()) {
				// Get full user data from database
				const userData = await db
					.select({
						id: users.id,
						name: users.name,
						email: users.email,
						role: users.role,
						instansi_id: users.instansi_id
					})
					.from(users)
					.where(eq(users.id, payload.id))
					.limit(1);

				if (userData.length > 0) {
					// Set user data in locals for use in routes
					event.locals.user = userData[0];
				}
			} else {
				// Session expired or invalid, clear cookies
				event.cookies.delete('session', { path: '/' });
				event.cookies.delete('user', { path: '/' });
			}
		} else {
			// Invalid JWT, clear cookies
			event.cookies.delete('session', { path: '/' });
			event.cookies.delete('user', { path: '/' });
		}
	}

	// Resolve the request
	return resolve(event);
};