import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { instansi, insertInstansiSchema } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { createInstansi, updateInstansi, deleteInstansi } from '$lib/server/auth';

// GET /api/instansi - list all instansi
export const GET: RequestHandler = async () => {
  try {
    const rows = await db.select().from(instansi).orderBy(instansi.namaInstansi);

    return json({ success: true, data: rows });
  } catch (err) {
    console.error('/api/instansi GET error', err);
    throw error(500, { message: 'Gagal mengambil daftar instansi' });
  }
};

// POST /api/instansi - create new instansi
export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();

    // Validate using schema
    const parsed = insertInstansiSchema.parse(body);

    // Check for existing instansiId
    const existing = await db.select().from(instansi).where(eq(instansi.instansiId, parsed.instansiId)).limit(1);
    if (existing.length > 0) {
      return json({ success: false, message: 'Instansi ID sudah terdaftar' }, { status: 409 });
    }

    // Create instansi
    const created = await createInstansi(parsed);

    return json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    console.error('/api/instansi POST error', err);
    // Zod validation errors
    if (err?.name === 'ZodError' && err?.issues) {
      return json({ success: false, errors: err.issues }, { status: 400 });
    }
    if (err instanceof Response) throw err;
    throw error(500, { message: 'Gagal membuat instansi' });
  }
};