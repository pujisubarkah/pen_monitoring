import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { actionPlanProgress, actionPlanPic, actionPlans, kegiatan, pilar, instansi } from '$lib/server/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { insertActionPlanProgressSchema } from '$lib/server/schemas/action-plan-schemas';

export async function GET({ url }) {
  try {
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const actionPlanPicId = url.searchParams.get('action_plan_pic_id');

    const offset = (page - 1) * limit;

    let whereConditions = [];

    if (actionPlanPicId) {
      whereConditions.push(eq(actionPlanProgress.actionPlanPicId, parseInt(actionPlanPicId)));
    }

    // Get action plan progress with related data
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
      .from(actionPlanProgress)
      .leftJoin(actionPlanPic, eq(actionPlanProgress.actionPlanPicId, actionPlanPic.id))
      .leftJoin(actionPlans, eq(actionPlanPic.actionPlansId, actionPlans.id))
      .leftJoin(kegiatan, eq(actionPlans.kegiatanId, kegiatan.id))
      .leftJoin(pilar, eq(kegiatan.pilarId, pilar.id))
      .leftJoin(instansi, eq(actionPlanPic.picId, instansi.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(actionPlanProgress.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(actionPlanProgress)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const total = totalResult[0]?.count || 0;

    return json({
      success: true,
      data: data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching action plan progress:', error);
    return json(
      { success: false, error: 'Gagal memuat data progress rencana aksi' },
      { status: 500 }
    );
  }
}

export async function POST({ request }) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = insertActionPlanProgressSchema.parse(body);

    // Insert new action plan progress
    const [newProgress] = await db.insert(actionPlanProgress).values({
      id: validatedData.id, // Note: id is provided by user as per schema
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
    if (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      (error as any).name === 'ZodError'
    ) {
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

export async function PUT({ request, url }) {
  try {
    const id = url.searchParams.get('id');
    if (!id) {
      return json(
        { success: false, error: 'ID progress diperlukan' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = insertActionPlanProgressSchema.parse(body);

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
      .where(eq(actionPlanProgress.id, parseInt(id)))
      .returning();

    if (!updatedProgress) {
      return json(
        { success: false, error: 'Progress rencana aksi tidak ditemukan' },
        { status: 404 }
      );
    }

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

export async function DELETE({ url }) {
  try {
    const id = url.searchParams.get('id');
    if (!id) {
      return json(
        { success: false, error: 'ID progress diperlukan' },
        { status: 400 }
      );
    }

    const [deletedProgress] = await db
      .delete(actionPlanProgress)
      .where(eq(actionPlanProgress.id, parseInt(id)))
      .returning();

    if (!deletedProgress) {
      return json(
        { success: false, error: 'Progress rencana aksi tidak ditemukan' },
        { status: 404 }
      );
    }

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