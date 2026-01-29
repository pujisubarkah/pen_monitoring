import fs from 'fs';
import path from 'path';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const filePath = path.resolve('src/lib/assets/Manual_Book_Sistem_PEN.pdf');
	try {
		if (!fs.existsSync(filePath)) {
			return new Response('Manual book not found on server', { status: 404 });
		}
		const data = await fs.promises.readFile(filePath);
		return new Response(data, {
			status: 200,
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'inline; filename="Manual_Book_Sistem_PEN.pdf"'
			}
		});
	} catch (err) {
		return new Response('Error reading manual book', { status: 500 });
	}
};
