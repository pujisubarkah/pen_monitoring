import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { actionPlans, planActivities, planPics, planSchedules, instansi } from '$lib/server/schema';
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
      whereConditions.push(like(actionPlans.pilar, `%${search}%`));
    }

    if (status && ['draft', 'active', 'completed'].includes(status)) {
      whereConditions.push(eq(actionPlans.status, status as 'draft' | 'active' | 'completed'));
    }

    // Get action plans with related data
    const data = await db
      .select({
        id: actionPlans.id,
        pilar: actionPlans.pilar,
        output: actionPlans.output,
        indikatorKeberhasilan: actionPlans.indikatorKeberhasilan,
        status: actionPlans.status,
        createdAt: actionPlans.createdAt,
        updatedAt: actionPlans.updatedAt,
        // Include related data
        activities: planActivities,
        pics: planPics,
        schedules: planSchedules,
      })
      .from(actionPlans)
      .leftJoin(planActivities, eq(actionPlans.id, planActivities.actionPlanId))
      .leftJoin(planPics, eq(actionPlans.id, planPics.actionPlanId))
      .leftJoin(planSchedules, eq(actionPlans.id, planSchedules.actionPlanId))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(actionPlans.createdAt))
      .limit(limit)
      .offset(offset);

    // Group the related data
    type GroupedActionPlan = {
      id: number;
      pilar: string;
      output: string;
      indikatorKeberhasilan: string;
      status: string;
      createdAt: Date;
      updatedAt: Date;
      activities: any[];
      pics: any[];
      schedules: any[];
    };

    const groupedData = data.reduce<GroupedActionPlan[]>((acc, row) => {
      const existing = acc.find(item => item.id === row.id);
      if (!existing) {
        acc.push({
          id: row.id,
          pilar: row.pilar,
          output: row.output,
          indikatorKeberhasilan: row.indikatorKeberhasilan,
          status: row.status,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          activities: row.activities ? [row.activities] : [],
          pics: row.pics ? [row.pics] : [],
          schedules: row.schedules ? [row.schedules] : [],
        });
      } else {
        if (row.activities) existing.activities.push(row.activities);
        if (row.pics) existing.pics.push(row.pics);
        if (row.schedules) existing.schedules.push(row.schedules);
      }
      return acc;
    }, []);

    // Get total count
    const totalResult = await db
      .select({ count: actionPlans.id })
      .from(actionPlans)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const total = totalResult[0]?.count || 0;

    return json({
      success: true,
      data: groupedData,
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
        pilar: body.pilar,
        output: body.output,
        indikatorKeberhasilan: body.indikatorKeberhasilan,
        status: body.status || 'draft'
      }).returning();

      // Insert activities
      if (body.activities && body.activities.length > 0) {
        await tx.insert(planActivities).values(
          body.activities.map((activity: string, index: number) => ({
            actionPlanId: newActionPlan.id,
            kegiatan: activity,
            urutan: index + 1
          }))
        );
      }

      // Insert PICs
      if (body.pics && body.pics.length > 0) {
        await tx.insert(planPics).values(
          body.pics.map((pic: string) => ({
            actionPlanId: newActionPlan.id,
            namaPic: pic
          }))
        );
      }

      // Insert schedules
      if (body.jadwal) {
        const schedules = [];

        if (body.jadwal.pendek) {
          schedules.push({
            actionPlanId: newActionPlan.id,
            periode: 'pendek',
            ...body.jadwal.pendek
          });
        }

        if (body.jadwal.menengah) {
          schedules.push({
            actionPlanId: newActionPlan.id,
            periode: 'menengah',
            ...body.jadwal.menengah
          });
        }

        if (body.jadwal.panjang) {
          schedules.push({
            actionPlanId: newActionPlan.id,
            periode: 'panjang',
            ...body.jadwal.panjang
          });
        }

        if (schedules.length > 0) {
          await tx.insert(planSchedules).values(schedules);
        }
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