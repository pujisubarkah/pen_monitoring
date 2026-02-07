import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import {
    verifyJWT,
    verifyPassword,
    hashPassword,
    findUserById,
    updateUserPassword
} from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { current_password, new_password } = await request.json();

		// Validate input
		if (!current_password || !new_password) {
			throw error(400, {
				message: 'Password lama dan password baru harus diisi'
			});
		}

		if (new_password.length < 6) {
			throw error(400, {
				message: 'Password baru minimal 6 karakter'
			});
		}

		// Get user from session
		const sessionCookie = cookies.get('session');
		if (!sessionCookie) {
			throw error(401, {
				message: 'Sesi tidak valid'
			});
		}

		// Verify JWT to get user ID
		const decoded = verifyJWT(sessionCookie);
		if (!decoded) {
			throw error(401, {
				message: 'Token tidak valid'
			});
		}

		const userId = decoded.id;

		const user = await findUserById(userId);
		if (!user) {
			throw error(404, {
				message: 'User tidak ditemukan'
			});
		}

		// Verify current password
		const isCurrentPasswordValid = await verifyPassword(current_password, user.password);
		if (!isCurrentPasswordValid) {
			throw error(400, {
				message: 'Password lama salah'
			});
		}

		// Hash new password
		const hashedNewPassword = await hashPassword(new_password);

		// Update password in database
		await updateUserPassword(userId, hashedNewPassword);

		return json({
			success: true,
			message: 'Password berhasil diubah'
		});

	} catch (err) {
		console.error('Change password API error:', err);

		if (err instanceof Response) {
			throw err; // Re-throw SvelteKit error
		}

		throw error(500, {
			message: 'Terjadi kesalahan saat mengubah password'
		});
	}
};