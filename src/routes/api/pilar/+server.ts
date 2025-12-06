import { db } from '$lib/server/db';
import { pilar, insertPilarSchema } from '$lib/server/schema';
import { z } from 'zod';
import { json, error } from '@sveltejs/kit';

export async function GET() {
	try {
		const data = await db.select().from(pilar).orderBy(pilar.id);
		return json({ success: true, data });
	} catch (err) {
		console.error('/api/pilar GET error', err);
		throw error(500, { message: 'Gagal mengambil daftar pilar' });
	}
}

export async function POST({ request }) {
	try {
		const body = await request.json();
		const result = insertPilarSchema.safeParse(body);
		if (!result.success) {
			return json({ success: false, error: result.error.issues[0].message }, { status: 400 });
		}
		const [created] = await db.insert(pilar).values({ nama_pilar: result.data.nama_pilar }).returning();
		return json({ success: true, data: created }, { status: 201 });
	} catch (err) {
		console.error('/api/pilar POST error', err);
		throw error(500, { message: 'Gagal membuat pilar' });
	}
}
