import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { createUser, findUserByEmail, createSession } from '$lib/server/auth';
import { insertUserSchema } from '$lib/server/schema';

const registerSchema = z.object({
	name: z.string().min(2, 'Nama minimal 2 karakter'),
	email: z.string().email('Format email tidak valid'),
	password: z.string().min(8, 'Password minimal 8 karakter'),
	confirmPassword: z.string(),
	terms: z.string().refine((val: string) => val === 'on', 'Anda harus menyetujui syarat dan ketentuan')
}).refine((data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword, {
	message: 'Konfirmasi password tidak cocok',
	path: ['confirmPassword']
});

export const load: PageServerLoad = async ({ cookies }) => {
	console.log('Register page load called');

	// Jika sudah login, redirect ke dashboard
	const userCookie = cookies.get('user');
	if (userCookie) {
		console.log('User already logged in, redirecting to dashboard');
		throw redirect(302, '/dashboard');
	}

	console.log('User not logged in, showing register page');
	return {};
};

export const actions: Actions = {
	register: async ({ request, cookies }) => {
		try {
			console.log('Register action called');

			const formData = await request.formData();
			const data = {
				name: formData.get('name')?.toString() || '',
				email: formData.get('email')?.toString() || '',
				password: formData.get('password')?.toString() || '',
				confirmPassword: formData.get('confirmPassword')?.toString() || '',
				terms: formData.get('terms')?.toString() || ''
			};

			console.log('Form data received:', { name: data.name, email: data.email });

			// Validasi input
			const result = registerSchema.safeParse(data);
			if (!result.success) {
				console.log('Validation failed:', result.error.issues[0].message);
				return fail(400, {
					error: result.error.issues[0].message,
					name: data.name,
					email: data.email
				});
			}

			// Cek apakah email sudah terdaftar
			const existingUser = await findUserByEmail(data.email);
			if (existingUser) {
				console.log('Email already exists:', data.email);
				return fail(400, {
					error: 'Email sudah terdaftar. Silakan gunakan email lain.',
					name: data.name,
					email: data.email
				});
			}

			console.log('Validation passed, creating user');

			// Buat user baru
			const newUser = await createUser({
				name: data.name,
				email: data.email,
				password: data.password,
				role: 'user'
			});

			console.log('User created successfully:', newUser.id);

			// Buat session untuk user yang baru terdaftar
			const sessionId = crypto.randomUUID();
			const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari

			await createSession({
				id: sessionId,
				userId: newUser.id,
				expiresAt
			});

			// Set cookie untuk session
			cookies.set('session', sessionId, {
				path: '/',
				httpOnly: true,
				secure: false, // Set ke true di production dengan HTTPS
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7 // 7 hari
			});

			// Set cookie untuk user info (untuk client-side)
			cookies.set('user', JSON.stringify({
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
				role: newUser.role
			}), {
				path: '/',
				httpOnly: false, // Client-side perlu akses
				secure: false,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7
			});

			console.log('Registration successful, redirecting to dashboard');

			// Redirect ke dashboard sesuai role
			if (newUser.role === 'admin') {
				throw redirect(302, '/admin');
			} else {
				throw redirect(302, '/user');
			}

		} catch (error) {
			console.error('Registration error:', error);

			if (error instanceof Response) {
				throw error; // redirect
			}

			return fail(500, {
				error: 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.'
			});
		}
	}
};