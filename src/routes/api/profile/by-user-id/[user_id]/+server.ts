import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userProfile } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

/**
 * Get a user profile by user_id
 */
export const GET: RequestHandler = async ({ params }) => {
  try {
    console.log('GET /api/profile/by-user-id/[user_id] called with params:', params);
    const userId = parseInt(params.user_id ?? '');
    console.log('Parsed user_id:', userId, 'isNaN:', isNaN(userId));

    if (isNaN(userId)) {
      throw error(400, { message: 'User ID tidak valid' });
    }

    console.log('Querying userProfile table for user_id:', userId);
    const rows = await db.select().from(userProfile).where(eq(userProfile.user_id, userId));
    console.log('Query result - rows found:', rows.length);

    if (rows.length === 0) {
      console.log('No profile found with user_id:', userId);
      throw error(404, { message: 'Profil tidak ditemukan' });
    }

    console.log('Profile found:', rows[0]);
    return json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    console.error('/api/profile/by-user-id/[user_id] GET error', err);
    if (err instanceof Response) throw err;
    throw error(500, { message: 'Gagal mengambil data profil' });
  }
};