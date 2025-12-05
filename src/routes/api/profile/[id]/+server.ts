import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '../../../../lib/server/db';
import { userProfile } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

/**
 * Get a single user profile by ID
 */
export const GET: RequestHandler = async ({ params }) => {
  try {
    console.log('GET /api/profile/[id] called with params:', params);
    const id = parseInt(params.id ?? '');
    console.log('Parsed id:', id, 'isNaN:', isNaN(id));
    
    if (isNaN(id)) {
      throw error(400, { message: 'ID profil tidak valid' });
    }

    console.log('Querying userProfile table for id:', id);
    const rows = await db.select().from(userProfile).where(eq(userProfile.id, id));
    console.log('Query result - rows found:', rows.length);

    if (rows.length === 0) {
      console.log('No profile found with id:', id);
      throw error(404, { message: 'Profil tidak ditemukan' });
    }

    console.log('Profile found:', rows[0]);
    return json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    console.error('/api/profile/[id] GET error', err);
    if (err instanceof Response) throw err;
    throw error(500, { message: 'Gagal mengambil data profil' });
  }
};

/**
 * Update a user profile by ID
 */
export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const id = parseInt(params.id ?? '');
    if (isNaN(id)) {
      throw error(400, { message: 'ID profil tidak valid' });
    }

    const body = await request.json();

    // Check if profile exists
    const existing = await db.select().from(userProfile).where(eq(userProfile.id, id));
    if (existing.length === 0) {
      throw error(404, { message: 'Profil tidak ditemukan' });
    }

    // Only allow updating certain fields
    const updateData: any = {};
    if (body.nama !== undefined) updateData.nama = body.nama;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.no_hp !== undefined) updateData.no_hp = body.no_hp;
    if (body.jabatan !== undefined) updateData.jabatan = body.jabatan;
    if (body.unit_kerja !== undefined) updateData.unit_kerja = body.unit_kerja;
    if (body.alamat_kantor !== undefined) updateData.alamat_kantor = body.alamat_kantor;
    if (body.user_id !== undefined) updateData.user_id = body.user_id;

    updateData.updated_at = new Date();

    const updated = await db.update(userProfile)
      .set(updateData)
      .where(eq(userProfile.id, id))
      .returning();

    return json({
      success: true,
      data: updated[0],
      message: 'Profil berhasil diperbarui'
    });
  } catch (err) {
    console.error('/api/profile/[id] PUT error', err);
    if (err instanceof Response) throw err;
    throw error(500, { message: 'Gagal memperbarui profil' });
  }
};

/**
 * Delete a user profile by ID
 */
export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const id = parseInt(params.id ?? '');
    if (isNaN(id)) {
      throw error(400, { message: 'ID profil tidak valid' });
    }

    // Check if profile exists
    const existing = await db.select().from(userProfile).where(eq(userProfile.id, id));
    if (existing.length === 0) {
      throw error(404, { message: 'Profil tidak ditemukan' });
    }

    // Delete the profile
    await db.delete(userProfile).where(eq(userProfile.id, id));

    return json({
      success: true,
      message: 'Profil berhasil dihapus'
    });
  } catch (err) {
    console.error('/api/profile/[id] DELETE error', err);
    if (err instanceof Response) throw err;
    throw error(500, { message: 'Gagal menghapus profil' });
  }
};