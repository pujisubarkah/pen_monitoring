import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
	// Clear the session cookies
	cookies.delete('session', { path: '/' });
	cookies.delete('user', { path: '/' });

	// Redirect to login page
	throw redirect(302, '/');
};

export const GET: RequestHandler = async ({ cookies }) => {
	// Clear the session cookies
	cookies.delete('session', { path: '/' });
	cookies.delete('user', { path: '/' });

	// Redirect to login page
	throw redirect(302, '/');
};