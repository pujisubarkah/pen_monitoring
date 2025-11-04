import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

// Demo credentials - in production, use proper authentication
const DEMO_CREDENTIALS = {
	email: 'admin@demo.com',
	password: 'demo123'
};

const DEMO_USER = {
	id: 'demo-user-1',
	name: 'Admin Demo',
	email: 'admin@demo.com',
	role: 'admin' as const,
	created_at: new Date().toISOString(),
	last_login: new Date().toISOString()
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		// Validate input
		if (!email) {
			return fail(400, { 
				error: 'Email harus diisi',
				email 
			});
		}

		if (!password) {
			return fail(400, { 
				error: 'Password harus diisi',
				email 
			});
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, { 
				error: 'Format email tidak valid',
				email 
			});
		}

		// Check credentials
		if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
			// Generate simple token (in production, use JWT)
			const token = `demo-token-${Date.now()}`;
			
			// Set session cookie
			cookies.set('session', token, {
				path: '/',
				httpOnly: true,
				secure: false, // Set to true in production with HTTPS
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			// Store user data in cookie (in production, store in database/session)
			cookies.set('user', JSON.stringify(DEMO_USER), {
				path: '/',
				httpOnly: true,
				secure: false,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			// Redirect to admin dashboard
			throw redirect(302, '/admin');
		}

		// Invalid credentials
		return fail(401, { 
			error: 'Email atau password salah',
			email 
		});
	}
};