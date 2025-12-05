import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { instansi, insertInstansiSchema } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

// GET /api/instansi/[id] - get single instansi
export const GET: RequestHandler = async ({ params }) => {
  try {
    const id = parseInt(params.id || '0');
    if (!id) {
      return json({ success: false, message: 'ID instansi diperlukan' }, { status: 400 });
    }

    const result = await db.select().from(instansi).where(eq(instansi.id, id)).limit(1);

    if (result.length === 0) {
      return json({ success: false, message: 'Instansi tidak ditemukan' }, { status: 404 });
    }

    return json({ success: true, data: result[0] });
  } catch (err) {
    console.error('/api/instansi/[id] GET error', err);
    throw error(500, { message: 'Gagal mengambil data instansi' });
  }
};

// PUT /api/instansi/[id] - update instansi
export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const id = parseInt(params.id || '0');
    if (!id) {
      return json({ success: false, message: 'ID instansi diperlukan' }, { status: 400 });
    }

    const body = await request.json();

    // Validate using schema
    const parsed = insertInstansiSchema.partial().parse(body);

    // Check if instansi exists
    const existing = await db.select().from(instansi).where(eq(instansi.id, id)).limit(1);
    if (existing.length === 0) {
      return json({ success: false, message: 'Instansi tidak ditemukan' }, { status: 404 });
    }

    // Check for duplicate instansiId if it's being updated
    if (parsed.instansiId !== undefined) {
      const duplicate = await db
        .select()
        .from(instansi)
        .where(eq(instansi.instansiId, parsed.instansiId))
        .limit(1);
      if (duplicate.length > 0 && duplicate[0].id !== id) {
        return json({ success: false, message: 'Instansi ID sudah digunakan' }, { status: 409 });
      }
    }

    // Update instansi
    const result = await db.update(instansi).set(parsed).where(eq(instansi.id, id)).returning();
    const updated = result[0];

    return json({ success: true, data: updated });
  } catch (err: any) {
    console.error('/api/instansi/[id] PUT error', err);
    // Zod validation errors
    if (err?.name === 'ZodError' && err?.issues) {
      return json({ success: false, errors: err.issues }, { status: 400 });
    }
    if (err instanceof Response) throw err;
    throw error(500, { message: 'Gagal mengupdate instansi' });
  }
};

// DELETE /api/instansi/[id] - delete instansi
export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const id = parseInt(params.id || '0');
    if (!id) {
      return json({ success: false, message: 'ID instansi diperlukan' }, { status: 400 });
    }

    // Check if instansi exists
    const existing = await db.select().from(instansi).where(eq(instansi.id, id)).limit(1);
    if (existing.length === 0) {
      return json({ success: false, message: 'Instansi tidak ditemukan' }, { status: 404 });
    }

    // Delete instansi
    await db.delete(instansi).where(eq(instansi.id, id));

    return json({ success: true, message: 'Instansi berhasil dihapus' });
  } catch (err: any) {
    console.error('/api/instansi/[id] DELETE error', err);
    if (err instanceof Response) throw err;
    throw error(500, { message: 'Gagal menghapus instansi' });
  }
};