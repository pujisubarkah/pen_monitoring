import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { actionPlanProgress, actionPlanPic, actionPlans, kegiatan, pilar, instansi } from '$lib/server/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { insertActionPlanProgressSchema } from '$lib/server/schemas/action-plan-schemas';

export async function GET({ params }) {
  try {
    const instansiId = parseInt(params.pic_id);
    if (isNaN(instansiId)) {
      return json(
        { success: false, error: 'ID instansi tidak valid' },
        { status: 400 }
      );
    }

    // Get action plans for specific instansi with progress data if available
    const data = await db
      .select({
        id: actionPlanProgress.id,
        actionPlanPicId: actionPlanProgress.actionPlanPicId,
        target: actionPlanProgress.target,
        capaian: actionPlanProgress.capaian,
        bukti: actionPlanProgress.bukti,
        penjelasan: actionPlanProgress.penjelasan,
        createdAt: actionPlanProgress.createdAt,
        // Related data
        actionPlanPic: {
          id: actionPlanPic.id,
          actionPlansId: actionPlanPic.actionPlansId,
          picId: actionPlanPic.picId,
        },
        actionPlan: {
          id: actionPlans.id,
          kegiatanId: actionPlans.kegiatanId,
          output: actionPlans.output,
          status: actionPlans.status,
        },
        kegiatan: {
          id: kegiatan.id,
          namaKegiatan: kegiatan.namaKegiatan,
          pilarId: kegiatan.pilarId,
        },
        pilar: {
          id: pilar.id,
          nama_pilar: pilar.nama_pilar,
        },
        instansi: {
          id: instansi.id,
          namaInstansi: instansi.namaInstansi,
        },
      })
      .from(actionPlanPic)
      .leftJoin(actionPlans, eq(actionPlanPic.actionPlansId, actionPlans.id))
      .leftJoin(kegiatan, eq(actionPlans.kegiatanId, kegiatan.id))
      .leftJoin(pilar, eq(kegiatan.pilarId, pilar.id))
      .leftJoin(instansi, eq(actionPlanPic.picId, instansi.id))
      .leftJoin(actionPlanProgress, eq(actionPlanPic.id, actionPlanProgress.actionPlanPicId))
      .where(eq(actionPlanPic.picId, instansiId))
      .orderBy(desc(actionPlans.createdAt));

    return json({
      success: true,
      data: data,
      total: data.length
    });
  } catch (error) {
    console.error('Error fetching action plan progress by instansi:', error);
    return json(
      { success: false, error: 'Gagal memuat data progress rencana aksi berdasarkan instansi' },
      { status: 500 }
    );
  }
}

export async function POST({ request, params }) {
  try {
    const instansiId = parseInt(params.pic_id);
    if (isNaN(instansiId)) {
      return json(
        { success: false, error: 'ID instansi tidak valid' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = insertActionPlanProgressSchema.parse(body);

    // Verify that the actionPlanPicId belongs to the correct instansi
    const picCheck = await db
      .select()
      .from(actionPlanPic)
      .where(eq(actionPlanPic.id, validatedData.actionPlanPicId))
      .limit(1);

    if (picCheck.length === 0 || picCheck[0].picId !== instansiId) {
      return json(
        { success: false, error: 'Action Plan PIC tidak valid untuk instansi ini' },
        { status: 400 }
      );
    }

    // Insert new action plan progress
    const [newProgress] = await db.insert(actionPlanProgress).values({
      id: validatedData.id,
      actionPlanPicId: validatedData.actionPlanPicId,
      target: validatedData.target,
      capaian: validatedData.capaian,
      bukti: validatedData.bukti,
      penjelasan: validatedData.penjelasan,
    }).returning();

    return json({
      success: true,
      data: newProgress,
      message: 'Progress rencana aksi berhasil dibuat'
    });
  } catch (error) {
    console.error('Error creating action plan progress:', error);
    if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'ZodError') {
      return json(
        { success: false, error: 'Data tidak valid', details: (error as any).errors },
        { status: 400 }
      );
    }
    return json(
      { success: false, error: 'Gagal membuat progress rencana aksi' },
      { status: 500 }
    );
  }
}

export async function PUT({ request, params, url }) {
  try {
    const instansiId = parseInt(params.pic_id);
    if (isNaN(instansiId)) {
      return json(
        { success: false, error: 'ID instansi tidak valid' },
        { status: 400 }
      );
    }

    const progressId = url.searchParams.get('id');
    if (!progressId) {
      return json(
        { success: false, error: 'ID progress diperlukan' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = insertActionPlanProgressSchema.parse(body);

    // Verify that the progress belongs to the correct instansi
    const progressCheck = await db
      .select()
      .from(actionPlanProgress)
      .leftJoin(actionPlanPic, eq(actionPlanProgress.actionPlanPicId, actionPlanPic.id))
      .where(eq(actionPlanProgress.id, parseInt(progressId)))
      .limit(1);

    if (progressCheck.length === 0 || progressCheck[0].action_plan_pic?.picId !== instansiId) {
      return json(
        { success: false, error: 'Progress tidak ditemukan atau tidak valid untuk instansi ini' },
        { status: 404 }
      );
    }

    // Update action plan progress
    const [updatedProgress] = await db
      .update(actionPlanProgress)
      .set({
        actionPlanPicId: validatedData.actionPlanPicId,
        target: validatedData.target,
        capaian: validatedData.capaian,
        bukti: validatedData.bukti,
        penjelasan: validatedData.penjelasan,
      })
      .where(eq(actionPlanProgress.id, parseInt(progressId)))
      .returning();

    return json({
      success: true,
      data: updatedProgress,
      message: 'Progress rencana aksi berhasil diperbarui'
    });
  } catch (error) {
    console.error('Error updating action plan progress:', error);
    if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'ZodError') {
      return json(
        { success: false, error: 'Data tidak valid', details: (error as any).errors },
        { status: 400 }
      );
    }
    return json(
      { success: false, error: 'Gagal memperbarui progress rencana aksi' },
      { status: 500 }
    );
  }
}

export async function DELETE({ params, url }) {
  try {
    const instansiId = parseInt(params.pic_id);
    if (isNaN(instansiId)) {
      return json(
        { success: false, error: 'ID instansi tidak valid' },
        { status: 400 }
      );
    }

    const progressId = url.searchParams.get('id');
    if (!progressId) {
      return json(
        { success: false, error: 'ID progress diperlukan' },
        { status: 400 }
      );
    }

    // Verify that the progress belongs to the correct instansi
    const progressCheck = await db
      .select()
      .from(actionPlanProgress)
      .leftJoin(actionPlanPic, eq(actionPlanProgress.actionPlanPicId, actionPlanPic.id))
      .where(eq(actionPlanProgress.id, parseInt(progressId)))
      .limit(1);

    if (progressCheck.length === 0 || progressCheck[0].action_plan_pic?.picId !== instansiId) {
      return json(
        { success: false, error: 'Progress tidak ditemukan atau tidak valid untuk instansi ini' },
        { status: 404 }
      );
    }

    const [deletedProgress] = await db
      .delete(actionPlanProgress)
      .where(eq(actionPlanProgress.id, parseInt(progressId)))
      .returning();

    return json({
      success: true,
      data: deletedProgress,
      message: 'Progress rencana aksi berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting action plan progress:', error);
    return json(
      { success: false, error: 'Gagal menghapus progress rencana aksi' },
      { status: 500 }
    );
  }
}