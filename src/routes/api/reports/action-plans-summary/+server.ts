import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { actionPlans, actionPlanProgress, actionPlanPic, indikatorKeberhasilanDetail, kegiatan, instansi } from '$lib/server/schema';
import { eq, sql, and } from 'drizzle-orm';

export async function GET({ url }) {
  try {
    // Get pagination and filter parameters
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const picId = url.searchParams.get('picId');
    const offset = (page - 1) * limit;

    // Build WHERE conditions for PIC filter
    let picWhereCondition: any[] = [];
    if (picId) {
      picWhereCondition.push(eq(actionPlanPic.picId, parseInt(picId)));
    }

    // Get all action plan-PIC combinations with aggregated data
    // This expands each action plan into multiple rows (one per PIC)
    const allDataQuery = db
      .select({
        actionPlanId: actionPlans.id,
        actionPlanPicId: actionPlanPic.id,
        namaKegiatan: kegiatan.namaKegiatan,
        picId: actionPlanPic.picId,
        picName: instansi.namaInstansi,
        indikator: sql<string>`(SELECT ${indikatorKeberhasilanDetail.deskripsi} FROM ${indikatorKeberhasilanDetail} WHERE ${indikatorKeberhasilanDetail.actionPlansId} = ${actionPlans.id} LIMIT 1)`,
        averageProgress: sql<number>`COALESCE(
          (SELECT AVG(${actionPlanProgress.capaian}) 
           FROM ${actionPlanProgress} 
           INNER JOIN ${actionPlanPic} apic ON ${actionPlanProgress.actionPlanPicId} = apic.id
           WHERE apic.action_plans_id = ${actionPlans.id}
          ), 0
        )`,
        latestUpdate: sql<string>`COALESCE(
          (SELECT MAX(${actionPlanProgress.createdAt}) 
           FROM ${actionPlanProgress} 
           INNER JOIN ${actionPlanPic} apic ON ${actionPlanProgress.actionPlanPicId} = apic.id
           WHERE apic.action_plans_id = ${actionPlans.id}
          ), ${actionPlans.updatedAt}
        )`,
        createdAt: actionPlans.createdAt,
        updatedAt: actionPlans.updatedAt,
      })
      .from(actionPlans)
      .leftJoin(kegiatan, eq(actionPlans.kegiatanId, kegiatan.id))
      .innerJoin(actionPlanPic, eq(actionPlans.id, actionPlanPic.actionPlansId))
      .leftJoin(instansi, eq(actionPlanPic.picId, instansi.id))
      .where(picWhereCondition.length > 0 ? and(...picWhereCondition) : undefined)
      .orderBy(actionPlans.id, actionPlanPic.id);

    const allData = await allDataQuery;
    
    // Count total records after expansion
    const total = allData.length;
    const totalPages = Math.ceil(total / limit);

    // Apply pagination to expanded data
    const paginatedData = allData.slice(offset, offset + limit);

    // Transform data to match the expected format
    const transformedData = paginatedData.map((item, index) => ({
      id: `${item.actionPlanId}-${item.actionPlanPicId}`,
      actionPlanId: item.actionPlanId,
      no: offset + index + 1,
      aksi: item.namaKegiatan || 'Nama kegiatan tidak tersedia',
      pic: item.picName || 'Belum ditentukan',
      picId: item.picId,
      indikator: item.indikator || 'Indikator belum ditentukan',
      tanggalUpdate: item.latestUpdate || item.updatedAt || item.createdAt,
      persentase: Math.round(Number(item.averageProgress) || 0)
    }));

    // Calculate summary statistics from ALL expanded data
    const completed = allData.filter(item => Math.round(Number(item.averageProgress)) === 100).length;
    const inProgress = allData.filter(item => {
      const pct = Math.round(Number(item.averageProgress));
      return pct > 0 && pct < 100;
    }).length;
    const notStarted = allData.filter(item => Math.round(Number(item.averageProgress)) === 0).length;

    return json({
      success: true,
      data: transformedData,
      summary: {
        total,
        completed,
        inProgress,
        notStarted
      },
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching action plans summary:', error);
    return json(
      { success: false, error: 'Gagal memuat data laporan' },
      { status: 500 }
    );
  }
}
