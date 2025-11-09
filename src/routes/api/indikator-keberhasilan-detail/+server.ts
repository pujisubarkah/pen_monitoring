import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { indikatorKeberhasilanDetail } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';

export async function GET({ url }) {
  try {
    const actionPlansId = url.searchParams.get('actionPlansId');

    let whereCondition;
    if (actionPlansId) {
      whereCondition = eq(indikatorKeberhasilanDetail.actionPlansId, parseInt(actionPlansId));
    }

    const data = await db
      .select()
      .from(indikatorKeberhasilanDetail)
      .where(whereCondition)
      .orderBy(indikatorKeberhasilanDetail.urutan);

    return json({
      success: true,
      data
    });
  } catch (err: any) {
    console.error('Error fetching indikator keberhasilan detail:', err);
    return json(
      { success: false, error: 'Gagal memuat data indikator keberhasilan detail' },
      { status: 500 }
    );
  }
}

export async function POST({ request }) {
  try {
    const body = await request.json();

    const [result] = await db
      .insert(indikatorKeberhasilanDetail)
      .values(body)
      .returning();

    return json({
      success: true,
      data: result,
      message: 'Indikator keberhasilan detail berhasil dibuat'
    });
  } catch (err: any) {
    console.error('Error creating indikator keberhasilan detail:', err);
    return json(
      { success: false, error: 'Gagal membuat indikator keberhasilan detail' },
      { status: 500 }
    );
  }
}