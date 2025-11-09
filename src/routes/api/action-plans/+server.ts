import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { actionPlans, actionPlanProgress, instansi, kegiatan, pilar, actionPlanPic, indikatorKeberhasilanDetail, actionPlanSchedule } from '$lib/server/schema';
import { eq, desc, like, and } from 'drizzle-orm';

export async function GET({ url }) {
  try {
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    let whereConditions = [];

    if (search) {
      whereConditions.push(like(kegiatan.namaKegiatan, `%${search}%`));
    }

    if (status && ['draft', 'active', 'completed'].includes(status)) {
      whereConditions.push(eq(actionPlans.status, status as 'draft' | 'active' | 'completed'));
    }

    // Get action plans with related data
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
    console.error('Error fetching action plans:', error);
    return json(
      { success: false, error: 'Gagal memuat data rencana aksi' },
      { status: 500 }
    );
  }
}

export async function POST({ request }) {
  try {
    const body = await request.json();

    // Start transaction
    const result = await db.transaction(async (tx) => {
      // Insert action plan
      const [newActionPlan] = await tx.insert(actionPlans).values({
        kegiatanId: body.kegiatanId,
        output: body.output,
        status: body.status || 'draft'
      }).returning();

      // Insert actionPlanPic and related records if provided
      if (body.pics && Array.isArray(body.pics)) {
        // Process each PIC
        for (const picId of body.pics) {
          // Insert actionPlanPic
          const [newActionPlanPic] = await tx.insert(actionPlanPic).values({
            actionPlansId: newActionPlan.id,
            picId: parseInt(picId)
          }).returning();

          // Insert actionPlanProgress for each periode with initial capaian 0
          const progressData: import('$lib/server/schemas/action-plan-schemas').NewActionPlanProgress[] = [];

          if (body.jadwal?.pendek) {
            if (body.jadwal.pendek.okt) progressData.push({ actionPlanPicId: newActionPlanPic.id, periode: 'okt', capaian: 0 });
            if (body.jadwal.pendek.nov) progressData.push({ actionPlanPicId: newActionPlanPic.id, periode: 'nov', capaian: 0 });
            if (body.jadwal.pendek.des) progressData.push({ actionPlanPicId: newActionPlanPic.id, periode: 'des', capaian: 0 });
          }

          if (body.jadwal?.menengah) {
            if (body.jadwal.menengah.tw1) progressData.push({ actionPlanPicId: newActionPlanPic.id, periode: 'tw1', capaian: 0 });
            if (body.jadwal.menengah.tw2) progressData.push({ actionPlanPicId: newActionPlanPic.id, periode: 'tw2', capaian: 0 });
            if (body.jadwal.menengah.tw3) progressData.push({ actionPlanPicId: newActionPlanPic.id, periode: 'tw3', capaian: 0 });
            if (body.jadwal.menengah.tw4) progressData.push({ actionPlanPicId: newActionPlanPic.id, periode: 'tw4', capaian: 0 });
          }

          if (body.jadwal?.panjang) {
            if (body.jadwal.panjang['2027']) progressData.push({ actionPlanPicId: newActionPlanPic.id, periode: '2027', capaian: 0 });
            if (body.jadwal.panjang['2028']) progressData.push({ actionPlanPicId: newActionPlanPic.id, periode: '2028', capaian: 0 });
            if (body.jadwal.panjang['2029']) progressData.push({ actionPlanPicId: newActionPlanPic.id, periode: '2029', capaian: 0 });
          }

          if (progressData.length > 0) {
            await tx.insert(actionPlanProgress).values(progressData);
          }
        }
      }

      // Insert actionPlanSchedule
      if (body.jadwal) {
        await tx.insert(actionPlanSchedule).values({
          actionPlansId: newActionPlan.id,
          okt: body.jadwal.pendek?.okt || false,
          nov: body.jadwal.pendek?.nov || false,
          des: body.jadwal.pendek?.des || false,
          tw1: body.jadwal.menengah?.tw1 || false,
          tw2: body.jadwal.menengah?.tw2 || false,
          tw3: body.jadwal.menengah?.tw3 || false,
          tw4: body.jadwal.menengah?.tw4 || false,
          tahun2027: body.jadwal.panjang?.['2027'] || false,
          tahun2028: body.jadwal.panjang?.['2028'] || false,
          tahun2029: body.jadwal.panjang?.['2029'] || false,
        });
      }

      return newActionPlan;
    });

    return json({
      success: true,
      data: result,
      message: 'Rencana aksi berhasil dibuat'
    });
  } catch (error) {
    console.error('Error creating action plan:', error);
    return json(
      { success: false, error: 'Gagal membuat rencana aksi' },
      { status: 500 }
    );
  }
}