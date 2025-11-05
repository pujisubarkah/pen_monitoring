import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { updateInstansi, deleteInstansi, findInstansiById } from '$lib/server/auth';
import { insertInstansiSchema } from '$lib/server/schema';

// GET /api/instansi/[id] - get instansi by id
export const GET: RequestHandler = async ({ params }) => {
  try {
    const id = params.id ? parseInt(params.id) : NaN;
    if (isNaN(id)) {
      throw error(400, { message: 'ID instansi tidak valid' });
    }

    const instansiData = await findInstansiById(id);
    if (!instansiData) {
      throw error(404, { message: 'Instansi tidak ditemukan' });
    }

    return json({ success: true, data: instansiData });
  } catch (err: any) {
    console.error('/api/instansi/[id] GET error', err);
    if (err instanceof Response) throw err;
    throw error(500, { message: 'Gagal mengambil data instansi' });
  }
};

// PUT /api/instansi/[id] - update instansi
export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const id = params.id ? parseInt(params.id) : NaN;
    if (isNaN(id)) {
      throw error(400, { message: 'ID instansi tidak valid' });
    }

    const body = await request.json();

    // Validate using schema (partial update)
    const parsed = insertInstansiSchema.partial().parse(body);

    const updated = await updateInstansi(id, parsed);
    if (!updated) {
      throw error(404, { message: 'Instansi tidak ditemukan' });
    }

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
    const id = params.id ? parseInt(params.id) : NaN;
    if (isNaN(id)) {
      throw error(400, { message: 'ID instansi tidak valid' });
    }

    const deleted = await deleteInstansi(id);
    if (!deleted) {
      throw error(404, { message: 'Instansi tidak ditemukan' });
    }

    return json({ success: true, message: 'Instansi berhasil dihapus' });
  } catch (err: any) {
    console.error('/api/instansi/[id] DELETE error', err);
    if (err instanceof Response) throw err;
    throw error(500, { message: 'Gagal menghapus instansi' });
  }
};