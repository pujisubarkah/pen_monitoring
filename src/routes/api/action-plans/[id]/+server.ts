
import { json, error, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { actionPlans, actionPlanProgress, instansi, kegiatan, pilar, actionPlanPic, actionPlanSchedule } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

/**
 * Get a single action plan with related data
 */
export async function GET({ params }: RequestEvent) {
  try {
    const id = parseInt(params.id ?? '');
    if (isNaN(id)) {
      throw error(400, 'Invalid action plan ID');
    }

    // Get action plan with related data
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
        // Include related data
        actionPlanProgresses: actionPlanProgress,
        actionPlanSchedules: actionPlanSchedule,
        actionPlanPics: actionPlanPic,
      })
      .from(actionPlans)
      .leftJoin(kegiatan, eq(actionPlans.kegiatanId, kegiatan.id))
      .leftJoin(pilar, eq(kegiatan.pilarId, pilar.id))
      .leftJoin(actionPlanPic, eq(actionPlans.id, actionPlanPic.actionPlansId))
      .leftJoin(actionPlanProgress, eq(actionPlanPic.id, actionPlanProgress.actionPlanPicId))
      .leftJoin(actionPlanSchedule, eq(actionPlans.id, actionPlanSchedule.actionPlansId))
      .where(eq(actionPlans.id, id));

    if (data.length === 0) {
      throw error(404, 'Action plan not found');
    }

    // Group the related data
    const actionPlan = {
      id: data[0].id,
      kegiatanId: data[0].kegiatanId,
      namaKegiatan: data[0].namaKegiatan || '',
      pilarId: data[0].pilarId || 0,
      namaPilar: data[0].namaPilar || '',
      output: data[0].output ?? '',
      status: data[0].status ?? '',
      createdAt: data[0].createdAt,
      updatedAt: data[0].updatedAt,
      actionPlanProgresses: data.filter(row => row.actionPlanProgresses).map(row => ({ ...row.actionPlanProgresses, picId: row.actionPlanPics?.picId })),
      actionPlanSchedules: data.filter(row => row.actionPlanSchedules).map(row => row.actionPlanSchedules),
      actionPlanPics: data.filter(row => row.actionPlanPics).map(row => row.actionPlanPics),
    };

    return json({
      success: true,
      data: actionPlan
    });
  } catch (err: any) {
    console.error('Error fetching action plan:', err);
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    return json(
      { success: false, error: 'Gagal memuat data rencana aksi' },
      { status: 500 }
    );
  }
}

/**
 * Update an action plan and its related PICs
 */
export async function PUT({ params, request }: RequestEvent) {
  try {
    const id = parseInt(params.id ?? '');
    if (isNaN(id)) {
      throw error(400, 'Invalid action plan ID');
    }

    const body = await request.json();

    // Start transaction
    const result = await db.transaction(async (tx) => {
      // Check if action plan exists
      const existing = await tx
        .select()
        .from(actionPlans)
        .where(eq(actionPlans.id, id));
      if (existing.length === 0) {
        throw error(404, 'Action plan not found');
      }

      // Update action plan
      const [updatedActionPlan] = await tx
        .update(actionPlans)
        .set({
          kegiatanId: body.kegiatanId,
          output: body.output,
          status: body.status || 'draft',
          updatedAt: new Date()
        })
        .where(eq(actionPlans.id, id))
        .returning();

      // Delete existing actionPlanPic records (related records will be deleted via cascade)
      await tx.delete(actionPlanPic).where(eq(actionPlanPic.actionPlansId, id));
      // Don't delete actionPlanSchedule here - we'll update it instead

      // Insert new actionPlanPic and related records if provided
      if (body.pics && Array.isArray(body.pics)) {
        // Process each PIC
        for (const picId of body.pics) {
          // Insert actionPlanPic
          const [newActionPlanPic] = await tx.insert(actionPlanPic).values({
            actionPlansId: id,
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

      // Update or insert actionPlanSchedule
      if (body.jadwal) {
        if (body.jadwalId) {
          // Update existing schedule
          await tx.update(actionPlanSchedule)
            .set({
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
            })
            .where(eq(actionPlanSchedule.id, parseInt(body.jadwalId)));
        } else {
          // Insert new schedule (fallback for new records)
          await tx.insert(actionPlanSchedule).values({
            actionPlansId: id,
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
      }
      return updatedActionPlan;
    });

    return json({
      success: true,
      data: result,
      message: 'Rencana aksi berhasil diperbarui'
    });
  } catch (err: any) {
    console.error('Error updating action plan:', err);
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    return json(
      { success: false, error: 'Gagal memperbarui rencana aksi' },
      { status: 500 }
    );
  }
}

/**
 * Delete an action plan and its related PICs
 */
export async function DELETE({ params }: RequestEvent) {
  try {
    const id = parseInt(params.id ?? '');
    if (isNaN(id)) {
      throw error(400, 'Invalid action plan ID');
    }

    // Start transaction
    await db.transaction(async (tx) => {
      // Check if action plan exists
      const existing = await tx
        .select()
        .from(actionPlans)
        .where(eq(actionPlans.id, id));
      if (existing.length === 0) {
        throw error(404, 'Action plan not found');
      }
      // Delete related actionPlanPic records first (related records will be deleted via cascade)
      await tx.delete(actionPlanPic).where(eq(actionPlanPic.actionPlansId, id));
      // Delete action plan
      await tx.delete(actionPlans).where(eq(actionPlans.id, id));
    });

    return json({
      success: true,
      message: 'Rencana aksi berhasil dihapus'
    });
  } catch (err: any) {
    console.error('Error deleting action plan:', err);
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    return json(
      { success: false, error: 'Gagal menghapus rencana aksi' },
      { status: 500 }
    );
  }
}