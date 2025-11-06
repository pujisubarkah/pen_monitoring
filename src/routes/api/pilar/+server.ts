import { db } from '$lib/server/db';
import { pilar, insertPilarSchema } from '$lib/server/schema';
import { z } from 'zod';
import { json } from '@sveltejs/kit';

export async function GET() {
  const data = await db.select().from(pilar);
  return json(data);
}

export async function POST({ request }) {
  const body = await request.json();
  const result = insertPilarSchema.safeParse(body);
  if (!result.success) {
    return json({ error: result.error.issues[0].message }, { status: 400 });
  }
  const [created] = await db.insert(pilar).values({ nama_pilar: result.data.nama_pilar }).returning();
  return json(created);
}
