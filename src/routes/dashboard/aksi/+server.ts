import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Sample data - in real app, this would use a database
let actions = [
	{
		id: '1',
		title: 'Implementasi Sistem Monitoring',
		description: 'Membuat dashboard untuk monitoring real-time',
		target_date: '2024-12-31',
		priority: 'high',
		status: 'in_progress',
		assigned_to: 'John Doe',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	}
];

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		
		const newAction = {
			id: Date.now().toString(),
			title: formData.get('title') as string,
			description: formData.get('description') as string,
			target_date: formData.get('target_date') as string,
			priority: formData.get('priority') as string,
			status: formData.get('status') as string,
			assigned_to: formData.get('assigned_to') as string,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		};

		actions.push(newAction);

		return json({ 
			success: true, 
			data: newAction,
			message: 'Aksi berhasil disimpan!' 
		});
	} catch (error) {
		return json({ 
			success: false, 
			error: 'Gagal menyimpan aksi' 
		}, { status: 500 });
	}
};

export const GET: RequestHandler = async () => {
	return json({ 
		success: true, 
		data: actions 
	});
};