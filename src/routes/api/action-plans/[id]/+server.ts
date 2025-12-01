
import { json, error, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { actionPlans, actionPlanProgress, instansi, kegiatan, pilar, actionPlanPic, actionPlanSchedule, indikatorKeberhasilanDetail } from '$lib/server/schema';
import { eq, inArray } from 'drizzle-orm';

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

      // Get existing action plan pic IDs
      const existingPicIds = await tx
        .select({ id: actionPlanPic.id })
        .from(actionPlanPic)
        .where(eq(actionPlanPic.actionPlansId, id));

      // Delete action plan progress records for existing PICs
      if (existingPicIds.length > 0) {
        await tx.delete(actionPlanProgress).where(
          inArray(actionPlanProgress.actionPlanPicId, existingPicIds.map(pic => pic.id))
        );
      }

      // Delete existing actionPlanPic records
      await tx.delete(actionPlanPic).where(eq(actionPlanPic.actionPlansId, id));
      // Don't delete actionPlanSchedule here - we'll update it instead

      // Delete existing indikatorKeberhasilanDetail records
      await tx.delete(indikatorKeberhasilanDetail).where(eq(indikatorKeberhasilanDetail.actionPlansId, id));

      // Insert new actionPlanPic and related records if provided
      if (body.pics && Array.isArray(body.pics)) {
        // Process each PIC
        for (const picId of body.pics) {
          // Insert actionPlanPic
          const [newActionPlanPic] = await tx.insert(actionPlanPic).values({
            actionPlansId: id,
            picId: parseInt(picId)
          }).returning();
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

      // Insert indikatorKeberhasilanDetail if provided
      if (body.indikatorKeberhasilan && Array.isArray(body.indikatorKeberhasilan)) {
        const indikatorData = body.indikatorKeberhasilan
          .filter((indikator: string) => indikator.trim() !== '')
          .map((indikator: string, index: number) => ({
            actionPlansId: id,
            urutan: index + 1,
            deskripsi: indikator.trim()
          }));

        if (indikatorData.length > 0) {
          await tx.insert(indikatorKeberhasilanDetail).values(indikatorData);
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
    const result = await db.transaction(async (tx) => {
      console.log('Starting delete transaction for action plan:', id);

      // Check if action plan exists
      const existing = await tx
        .select()
        .from(actionPlans)
        .where(eq(actionPlans.id, id));

      console.log('Found existing action plans:', existing.length);

      if (existing.length === 0) {
        throw error(404, 'Action plan not found');
      }

      // Get all action plan pic IDs for this action plan
      const picIds = await tx
        .select({ id: actionPlanPic.id })
        .from(actionPlanPic)
        .where(eq(actionPlanPic.actionPlansId, id));

      console.log('Found PIC IDs to delete:', picIds.map(p => p.id));

      // Delete action plan progress records for these PICs
      if (picIds.length > 0) {
        const deletedProgress = await tx.delete(actionPlanProgress).where(
          inArray(actionPlanProgress.actionPlanPicId, picIds.map(pic => pic.id))
        );
        console.log('Deleted action plan progress records:', deletedProgress);
      }

      // Delete action plan pic records
      const deletedPics = await tx.delete(actionPlanPic).where(eq(actionPlanPic.actionPlansId, id));
      console.log('Deleted action plan pic records:', deletedPics);

      // Delete action plan (cascade will handle other related records)
      const deletedPlans = await tx.delete(actionPlans).where(eq(actionPlans.id, id));
      console.log('Deleted action plan records:', deletedPlans);

      return { success: true };
    });

    console.log('Transaction completed successfully:', result);

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