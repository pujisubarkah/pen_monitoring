import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { findUserByEmail, verifyPassword, createSession, initDemoUsers } from '$lib/server/auth';

// Initialize demo users
await initDemoUsers();

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
		const user = await findUserByEmail(email);

		if (!user) {
			return fail(401, {
				error: 'Email atau password salah',
				email
			});
		}

		// Verify password using bcrypt
		const isPasswordValid = await verifyPassword(password, user.password);

		if (!isPasswordValid) {
			return fail(401, {
				error: 'Email atau password salah',
				email
			});
		}

		// Generate simple token (in production, use JWT)
		const token = `demo-token-${Date.now()}`;

		// Create session in database
		await createSession({
			id: token,
			userId: user.id,
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari
		});

		// Set session cookie
		cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			secure: false, // Set to true in production with HTTPS
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		// Store user data in cookie (in production, store in database/session)
		cookies.set('user', JSON.stringify({
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role
		}), {
			path: '/',
			httpOnly: true,
			secure: false,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		// Redirect based on role
		const redirectPath = user.role === 'admin' ? '/admin' : '/user';
		throw redirect(302, redirectPath);
	}
};