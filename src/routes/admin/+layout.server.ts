import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;

	// Redirect if not logged in
	if (!user) {
		throw redirect(302, '/');
	}

	// Only allow admin role
	if (user.role !== 'admin') {
		throw redirect(302, '/');
	}

	// Fetch full user data including instansi_id
	const [userData] = await db
		.select()
		.from(users)
		.where(eq(users.id, user.id))
		.limit(1);

	if (!userData) {
		throw redirect(302, '/');
	}

	return {
		user: {
			id: userData.id,
			name: userData.name,
			email: userData.email,
			role: userData.role,
			instansi_id: userData.instansi_id,
		}
	};
};
