import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { pilar, insertPilarSchema } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

// GET /api/pilar/[id] - get single pilar
export const GET: RequestHandler = async ({ params }) => {
  try {
    const id = parseInt(params.id || '0');
    if (!id) {
      return json({ success: false, message: 'ID pilar diperlukan' }, { status: 400 });
    }

    const result = await db.select().from(pilar).where(eq(pilar.id, id)).limit(1);

    if (result.length === 0) {
      return json({ success: false, message: 'Pilar tidak ditemukan' }, { status: 404 });
    }

    return json({ success: true, data: result[0] });
  } catch (err) {
    console.error('/api/pilar/[id] GET error', err);
    throw error(500, { message: 'Gagal mengambil data pilar' });
  }
};

// PUT /api/pilar/[id] - update pilar
export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const id = parseInt(params.id || '0');
    if (!id) {
      return json({ success: false, message: 'ID pilar diperlukan' }, { status: 400 });
    }

    const body = await request.json();

    // Validate using schema
    const parsed = insertPilarSchema.partial().parse(body);

    // Check if pilar exists
    const existing = await db.select().from(pilar).where(eq(pilar.id, id)).limit(1);
    if (existing.length === 0) {
      return json({ success: false, message: 'Pilar tidak ditemukan' }, { status: 404 });
    }

    // Update pilar
    const result = await db.update(pilar).set(parsed).where(eq(pilar.id, id)).returning();
    const updated = result[0];

    return json({ success: true, data: updated });
  } catch (err: any) {
    console.error('/api/pilar/[id] PUT error', err);
    // Zod validation errors
    if (err?.name === 'ZodError' && err?.issues) {
      return json({ success: false, errors: err.issues }, { status: 400 });
    }
    if (err instanceof Response) throw err;
    throw error(500, { message: 'Gagal mengupdate pilar' });
  }
};

// DELETE /api/pilar/[id] - delete pilar
export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const id = parseInt(params.id || '0');
    if (!id) {
      return json({ success: false, message: 'ID pilar diperlukan' }, { status: 400 });
    }

    // Check if pilar exists
    const existing = await db.select().from(pilar).where(eq(pilar.id, id)).limit(1);
    if (existing.length === 0) {
      return json({ success: false, message: 'Pilar tidak ditemukan' }, { status: 404 });
    }

    // Delete pilar
    await db.delete(pilar).where(eq(pilar.id, id));

    return json({ success: true, message: 'Pilar berhasil dihapus' });
  } catch (err: any) {
    console.error('/api/pilar/[id] DELETE error', err);
    if (err instanceof Response) throw err;
    throw error(500, { message: 'Gagal menghapus pilar' });
  }
};