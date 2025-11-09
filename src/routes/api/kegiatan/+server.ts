import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { kegiatan, pilar } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
	try {
		const kegiatanData = await db
			.select({
				id: kegiatan.id,
				pilarId: kegiatan.pilarId,
				nama_kegiatan: kegiatan.namaKegiatan,
				pilar: {
					nama_pilar: pilar.nama_pilar
				}
			})
			.from(kegiatan)
			.innerJoin(pilar, eq(kegiatan.pilarId, pilar.id))
			.orderBy(kegiatan.namaKegiatan);

		return json(kegiatanData);
	} catch (error) {
		console.error('Error fetching kegiatan:', error);
		return json({ error: 'Failed to fetch kegiatan data' }, { status: 500 });
	}
}