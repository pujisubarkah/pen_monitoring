import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

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

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		// Validate credentials
		if (!email || !password) {
			return json({
				success: false,
				error: 'Email dan password harus diisi'
			}, { status: 400 });
		}

		// Check demo credentials
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

			// Redirect to dashboard
			throw redirect(302, '/dashboard');
		}

		return json({
			success: false,
			error: 'Email atau password salah'
		}, { status: 401 });

	} catch (error) {
		// Handle redirect
		if (error instanceof Response) {
			throw error;
		}
		
		return json({
			success: false,
			error: 'Terjadi kesalahan saat login'
		}, { status: 500 });
	}
};