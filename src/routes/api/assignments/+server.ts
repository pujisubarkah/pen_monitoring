import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
// TODO: Ganti dengan akses DB sebenarnya
let assignments: { userId: number; adminId: number; adminName: string }[] = [];

// GET: List all assignments
export const GET: RequestHandler = async () => {
  return json({ success: true, data: assignments });
};

// POST: Assign admin to user
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { userId, adminId, adminName } = await request.json();
    if (!userId || !adminId || !adminName) {
      return json({ success: false, message: 'userId, adminId, dan adminName wajib diisi' }, { status: 400 });
    }
    // Hapus assignment lama user ini
    assignments = assignments.filter(a => a.userId !== userId);
    // Tambah assignment baru
    assignments.push({ userId, adminId, adminName });
    return json({ success: true, message: 'Penugasan berhasil', data: assignments });
  } catch (e) {
    return json({ success: false, message: 'Gagal menugaskan admin' }, { status: 500 });
  }
};
