import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Check if user is authenticated
	if (!locals.user) {
		// Redirect to login page with return URL
		throw redirect(302, `/?redirect=${encodeURIComponent(url.pathname)}`);
	}

	return {
		user: locals.user
	};
};