import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userProfile, insertUserProfileSchema } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

// GET /api/profile?user_id=xx - get profile by user_id
export const GET: RequestHandler = async ({ url }) => {
  try {
    const user_id = url.searchParams.get('user_id');
    if (!user_id) {
      throw error(400, { message: 'user_id diperlukan' });
    }
    const rows = await db.select().from(userProfile).where(eq(userProfile.user_id, Number(user_id)));
    if (rows.length === 0) {
      return json({ success: false, message: 'Profile tidak ditemukan' }, { status: 404 });
    }
    return json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('/api/profile GET error', err);
    throw error(500, { message: 'Gagal mengambil profile' });
  }
};

// POST /api/profile - create new profile
export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const parsed = insertUserProfileSchema.parse(body);
    const created = await db.insert(userProfile).values(parsed).returning();
    return json({ success: true, data: created[0] }, { status: 201 });
  } catch (err: any) {
    console.error('/api/profile POST error', err);
    if (err?.name === 'ZodError' && err?.issues) {
      return json({ success: false, errors: err.issues }, { status: 400 });
    }
    if (err instanceof Response) throw err;
    throw error(500, { message: 'Gagal membuat profile' });
  }
};

// PUT /api/profile/[id] - update profile by id
export const PUT: RequestHandler = async ({ request, url }) => {
  try {
    const id = url.searchParams.get('id');
    if (!id) {
      throw error(400, { message: 'id diperlukan' });
    }
    const body = await request.json();
    // Only allow updating certain fields
    const updateData: any = {};
    if (body.nama) updateData.nama = body.nama;
    if (body.email) updateData.email = body.email;
    if (body.no_hp) updateData.no_hp = body.no_hp;
    if (body.jabatan) updateData.jabatan = body.jabatan;
    if (body.unit_kerja) updateData.unit_kerja = body.unit_kerja;
    if (body.alamat_kantor) updateData.alamat_kantor = body.alamat_kantor;
    updateData.updated_at = new Date();
    const updated = await db.update(userProfile).set(updateData).where(eq(userProfile.id, Number(id))).returning();
    if (updated.length === 0) {
      return json({ success: false, message: 'Profile tidak ditemukan' }, { status: 404 });
    }
    return json({ success: true, data: updated[0] });
  } catch (err) {
    console.error('/api/profile PUT error', err);
    throw error(500, { message: 'Gagal memperbarui profile' });
  }
};
