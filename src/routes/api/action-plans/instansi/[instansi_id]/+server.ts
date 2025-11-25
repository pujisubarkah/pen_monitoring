import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { actionPlans, actionPlanProgress, instansi, kegiatan, pilar, actionPlanPic, indikatorKeberhasilanDetail, actionPlanSchedule } from '$lib/server/schema';
import { eq, desc, like, and } from 'drizzle-orm';

export async function GET({ params, url }) {
  try {
    const instansiId = parseInt(params.instansi_id ?? '');
    if (isNaN(instansiId)) {
      return json(
        { success: false, error: 'ID instansi tidak valid' },
        { status: 400 }
      );
    }

    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    let whereConditions = [
      eq(actionPlanPic.picId, instansiId) // Filter by instansi_id
    ];

    if (search) {
      whereConditions.push(like(kegiatan.namaKegiatan, `%${search}%`));
    }

    if (status && ['draft', 'active', 'completed'].includes(status)) {
      whereConditions.push(eq(actionPlans.status, status as 'draft' | 'active' | 'completed'));
    }

    // Get action plans with related data filtered by instansi_id
    const data = await db
      .select({
        id: actionPlans.id,
        kegiatanId: actionPlans.kegiatanId,
        namaKegiatan: kegiatan.namaKegiatan,
        pilarId: kegiatan.pilarId,
        namaPilar: pilar.nama_pilar,
        output: actionPlans.output,
        status: actionPlans.status,
        createdAt: actionPlans.createdAt,
        updatedAt: actionPlans.updatedAt,
        // Include related data with explicit field selection
        actionPlanProgresses: actionPlanProgress,
        actionPlanSchedules: {
          id: actionPlanSchedule.id,
          actionPlansId: actionPlanSchedule.actionPlansId,
          okt: actionPlanSchedule.okt,
          nov: actionPlanSchedule.nov,
          des: actionPlanSchedule.des,
          tw1: actionPlanSchedule.tw1,
          tw2: actionPlanSchedule.tw2,
          tw3: actionPlanSchedule.tw3,
          tw4: actionPlanSchedule.tw4,
          tahun2027: actionPlanSchedule.tahun2027,
          tahun2028: actionPlanSchedule.tahun2028,
          tahun2029: actionPlanSchedule.tahun2029,
          createdAt: actionPlanSchedule.createdAt,
        },
        actionPlanPics: actionPlanPic,
        namaInstansi: instansi.namaInstansi,
        indikatorKeberhasilanDetails: indikatorKeberhasilanDetail,
      })
      .from(actionPlans)
      .leftJoin(kegiatan, eq(actionPlans.kegiatanId, kegiatan.id))
      .leftJoin(pilar, eq(kegiatan.pilarId, pilar.id))
      .leftJoin(actionPlanPic, eq(actionPlans.id, actionPlanPic.actionPlansId))
      .leftJoin(actionPlanProgress, eq(actionPlanPic.id, actionPlanProgress.actionPlanPicId))
      .leftJoin(actionPlanSchedule, eq(actionPlans.id, actionPlanSchedule.actionPlansId))
      .leftJoin(instansi, eq(actionPlanPic.picId, instansi.id))
      .leftJoin(indikatorKeberhasilanDetail, eq(actionPlans.id, indikatorKeberhasilanDetail.actionPlansId))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(actionPlans.id)
      .limit(limit)
      .offset(offset);

    // Group the related data
    type GroupedActionPlan = {
      id: number;
      kegiatanId: number;
      namaKegiatan: string | null;
      pilarId: number | null;
      namaPilar: string | null;
      output: string | null;
      status: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
      actionPlanProgresses: any[];
      actionPlanSchedules: any[];
      actionPlanPics: any[];
      indikatorKeberhasilanDetails: any[];
    };

    const groupedData = data.reduce((acc: Record<number, GroupedActionPlan>, row) => {
      const actionPlanId = row.id;
      if (!acc[actionPlanId]) {
        acc[actionPlanId] = {
          id: row.id,
          kegiatanId: row.kegiatanId,
          namaKegiatan: row.namaKegiatan,
          pilarId: row.pilarId,
          namaPilar: row.namaPilar,
          output: row.output,
          status: row.status,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          actionPlanProgresses: [],
          actionPlanSchedules: [],
          actionPlanPics: [],
          indikatorKeberhasilanDetails: [],
        };
      }

      // Add actionPlanProgress if not already added
      if (row.actionPlanProgresses && !acc[actionPlanId].actionPlanProgresses.some((progress: any) => progress.id === row.actionPlanProgresses!.id)) {
        acc[actionPlanId].actionPlanProgresses.push(row.actionPlanProgresses);
      }

      // Add actionPlanSchedule if not already added
      if (row.actionPlanSchedules && !acc[actionPlanId].actionPlanSchedules.some((schedule: any) => schedule.id === row.actionPlanSchedules!.id)) {
        acc[actionPlanId].actionPlanSchedules.push(row.actionPlanSchedules);
      }

      // Add actionPlanPic if not already added
      if (row.actionPlanPics && !acc[actionPlanId].actionPlanPics.some((pic: any) => pic.id === row.actionPlanPics!.id)) {
        acc[actionPlanId].actionPlanPics.push({
          ...row.actionPlanPics,
          namaInstansi: row.namaInstansi
        });
      }

      // Add indikatorKeberhasilanDetail if not already added
      if (row.indikatorKeberhasilanDetails && !acc[actionPlanId].indikatorKeberhasilanDetails.some((detail: any) => detail.id === row.indikatorKeberhasilanDetails!.id)) {
        acc[actionPlanId].indikatorKeberhasilanDetails.push(row.indikatorKeberhasilanDetails);
      }

      return acc;
    }, {});

    // Convert to array
    const result = Object.values(groupedData);

    const totalResult = await db
      .select({ count: actionPlans.id })
      .from(actionPlans)
      .leftJoin(actionPlanPic, eq(actionPlans.id, actionPlanPic.actionPlansId))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const total = totalResult[0]?.count || 0;

    return json({
      success: true,
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching action plans by instansi:', error);
    return json(
      { success: false, error: 'Gagal memuat data rencana aksi berdasarkan instansi' },
      { status: 500 }
    );
  }
}