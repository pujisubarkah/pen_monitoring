import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { instansi, pilar, kegiatan, actionPlans, actionPlanPic } from '$lib/server/schema';
import { eq, or } from 'drizzle-orm';

// GET /api/instansi/with-pilar - list all instansi grouped by pilar
export const GET: RequestHandler = async () => {
  try {
    // Get all instansi with their associated pilar through action plans
    const result = await db
      .select({
        id: instansi.id,
        instansiId: instansi.instansiId,
        namaInstansi: instansi.namaInstansi,
        pilarId: pilar.id,
        nama_pilar: pilar.nama_pilar,
      })
      .from(instansi)
      .leftJoin(actionPlanPic, eq(instansi.id, actionPlanPic.picId))
      .leftJoin(actionPlans, eq(actionPlanPic.actionPlansId, actionPlans.id))
      .leftJoin(kegiatan, eq(actionPlans.kegiatanId, kegiatan.id))
      .leftJoin(pilar, eq(kegiatan.pilarId, pilar.id))
      .orderBy(instansi.namaInstansi);

    // Group instansi by pilar - an instansi can appear in multiple pilar groups
    const groupedByPilar: Record<string, any[]> = {};

    result.forEach(row => {
      const pilarName = row.nama_pilar || 'Belum Ditentukan';
      const pilarId = row.pilarId || 'no-pilar';

      if (!groupedByPilar[pilarName]) {
        groupedByPilar[pilarName] = [];
      }

      // Check if this instansi is already in this pilar group
      const existingInstansi = groupedByPilar[pilarName].find(inst => inst.id === row.id);

      if (!existingInstansi) {
        groupedByPilar[pilarName].push({
          id: row.id,
          instansiId: row.instansiId,
          namaInstansi: row.namaInstansi,
          pilar: row.pilarId ? {
            id: row.pilarId,
            nama_pilar: row.nama_pilar
          } : null
        });
      }
    });

    // Convert to array format for easier consumption
    const finalResult = Object.entries(groupedByPilar).map(([pilarName, instansiList]) => ({
      pilarName,
      instansi: instansiList
    }));

    return json({ success: true, data: finalResult });
  } catch (err) {
    console.error('/api/instansi/with-pilar GET error', err);
    throw error(500, { message: 'Gagal mengambil daftar instansi dengan pilar' });
  }
};