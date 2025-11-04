import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { createUser, findUserByEmail, createSession, hashPassword, initDemoUsers } from '$lib/server/auth';

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
	// Initialize demo users on first load
	await initDemoUsers();

	// Jika sudah login, redirect ke dashboard
	const userCookie = cookies.get('user');
	if (userCookie) {
		throw redirect(302, '/dashboard');
	}
};

export const actions: Actions = {
	register: async ({ request, cookies }) => {
		try {
			const formData = await request.formData();
			const data = {
				name: formData.get('name')?.toString() || '',
				email: formData.get('email')?.toString() || '',
				password: formData.get('password')?.toString() || '',
				confirmPassword: formData.get('confirmPassword')?.toString() || '',
				terms: formData.get('terms')?.toString() || ''
			};

			// Validasi input
			const result = registerSchema.safeParse(data);
			if (!result.success) {
				return fail(400, {
					error: result.error.issues[0].message,
					name: data.name,
					email: data.email
				});
			}

			// Simulasi pendaftaran user (dalam implementasi nyata, ini akan menyimpan ke database)
			// Untuk demo, kita menggunakan in-memory Map
			// Dalam production, gunakan database seperti PostgreSQL, MySQL, dll.

			const { name, email, password } = result.data;

			// Cek apakah email sudah terdaftar
			const existingUser = await findUserByEmail(email);

			if (existingUser) {
				return fail(400, {
					error: 'Email sudah terdaftar',
					name,
					email
				});
			}

			// Create new user
			const newUser = await createUser({
				name,
				email,
				password,
				role: 'user' // New users are always 'user' role
			});

			// Buat session token
			const sessionToken = crypto.randomUUID();

			// Create session in database
			await createSession({
				id: sessionToken,
				userId: newUser.id,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari
			});

			// Set cookie session
			cookies.set('session', sessionToken, {
				path: '/',
				httpOnly: true,
				secure: false, // set ke true di production dengan HTTPS
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7 // 7 hari
			});

			// Set user cookie
			cookies.set('user', JSON.stringify({
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
				role: newUser.role
			}), {
				path: '/',
				httpOnly: true,
				secure: false,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7 // 7 hari
			});

			// Redirect based on role (new users are 'user' by default)
			const redirectPath = newUser.role === 'admin' ? '/admin' : '/user';
			throw redirect(302, redirectPath);

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