import type { RequestHandler } from '@sveltejs/kit';
import { findUserByEmail, verifyPassword, generateJWT, createSession } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { sessions } from '$lib/server/schema';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return new Response(JSON.stringify({ user: null }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	return new Response(JSON.stringify({ user: locals.user }), {
		headers: { 'Content-Type': 'application/json' }
	});
};

// Demo login endpoint for testing
export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { email, password } = await request.json();

		// Use demo credentials if not provided
		const loginEmail = email || 'admin@demo.com';
		const loginPassword = password || 'demo123';

		// Check credentials
		const user = await findUserByEmail(loginEmail);
		if (!user) {
			return new Response(JSON.stringify({ error: 'User not found' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Verify password
		const isPasswordValid = await verifyPassword(loginPassword, user.password);
		if (!isPasswordValid) {
			return new Response(JSON.stringify({ error: 'Invalid password' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Generate JWT token
		const token = generateJWT({
			id: user.id,
			email: user.email,
			role: user.role,
			instansi_id: user.instansi_id
		});

		// Create session in database
		await createSession({
			id: token,
			userId: user.id,
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		});

		// Set JWT token in cookie
		cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			secure: false,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7
		});

		// Set user data in cookie
		cookies.set('user', JSON.stringify({
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			instansi_id: user.instansi_id
		}), {
			path: '/',
			httpOnly: true,
			secure: false,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7
		});

		return new Response(JSON.stringify({
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				instansi_id: user.instansi_id
			}
		}), {
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Demo login error:', error);
		return new Response(JSON.stringify({ error: 'Login failed' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};