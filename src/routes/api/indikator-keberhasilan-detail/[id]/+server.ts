import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { indikatorKeberhasilanDetail } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export async function GET({ params }) {
  try {
    const id = parseInt(params.id ?? '');
    if (isNaN(id)) {
      throw error(400, 'Invalid indikator keberhasilan detail ID');
    }

    const [result] = await db
      .select()
      .from(indikatorKeberhasilanDetail)
      .where(eq(indikatorKeberhasilanDetail.id, id));

    if (!result) {
      throw error(404, 'Indikator keberhasilan detail not found');
    }

    return json({
      success: true,
      data: result
    });
  } catch (err: any) {
    console.error('Error fetching indikator keberhasilan detail:', err);
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    return json(
      { success: false, error: 'Gagal memuat data indikator keberhasilan detail' },
      { status: 500 }
    );
  }
}

export async function PUT({ params, request }) {
  try {
    const id = parseInt(params.id ?? '');
    if (isNaN(id)) {
      throw error(400, 'Invalid indikator keberhasilan detail ID');
    }

    const body = await request.json();

    const [result] = await db
      .update(indikatorKeberhasilanDetail)
      .set(body)
      .where(eq(indikatorKeberhasilanDetail.id, id))
      .returning();

    if (!result) {
      throw error(404, 'Indikator keberhasilan detail not found');
    }

    return json({
      success: true,
      data: result,
      message: 'Indikator keberhasilan detail berhasil diperbarui'
    });
  } catch (err: any) {
    console.error('Error updating indikator keberhasilan detail:', err);
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    return json(
      { success: false, error: 'Gagal memperbarui indikator keberhasilan detail' },
      { status: 500 }
    );
  }
}

export async function DELETE({ params }) {
  try {
    const id = parseInt(params.id ?? '');
    if (isNaN(id)) {
      throw error(400, 'Invalid indikator keberhasilan detail ID');
    }

    const [result] = await db
      .delete(indikatorKeberhasilanDetail)
      .where(eq(indikatorKeberhasilanDetail.id, id))
      .returning();

    if (!result) {
      throw error(404, 'Indikator keberhasilan detail not found');
    }

    return json({
      success: true,
      message: 'Indikator keberhasilan detail berhasil dihapus'
    });
  } catch (err: any) {
    console.error('Error deleting indikator keberhasilan detail:', err);
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    return json(
      { success: false, error: 'Gagal menghapus indikator keberhasilan detail' },
      { status: 500 }
    );
  }
}