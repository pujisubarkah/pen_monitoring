import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { findUserByEmail, verifyPassword, createSession, initDemoUsers } from '$lib/server/auth';

// Initialize demo users on startup
await initDemoUsers();

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { email, password } = await request.json();

		// Validate input
		if (!email || !password) {
			throw error(400, {
				message: 'Email dan password harus diisi'
			});
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw error(400, {
				message: 'Format email tidak valid'
			});
		}

		// Find user by email
		const user = await findUserByEmail(email);

		if (!user) {
			throw error(401, {
				message: 'Email atau password salah'
			});
		}

		// Verify password using bcrypt
		const isPasswordValid = await verifyPassword(password, user.password);

		if (!isPasswordValid) {
			throw error(401, {
				message: 'Email atau password salah'
			});
		}

		// Generate session token
		const sessionToken = crypto.randomUUID();

		// Create session in database
		await createSession({
			id: sessionToken,
			userId: user.id,
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari
		});

		// Set session cookie
		cookies.set('session', sessionToken, {
			path: '/',
			httpOnly: true,
			secure: false, // Set to true in production with HTTPS
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		// Set user cookie
		cookies.set('user', JSON.stringify({
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role
		}), {
			path: '/',
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		// Return success response
		return json({
			success: true,
			message: 'Login berhasil',
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role
			},
			redirect: user.role === 'admin' ? '/admin' : '/user'
		});

	} catch (err) {
		console.error('Login API error:', err);

		if (err instanceof Response) {
			throw err; // Re-throw SvelteKit error
		}

		throw error(500, {
			message: 'Terjadi kesalahan saat login'
		});
	}
};