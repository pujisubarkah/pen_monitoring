import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Sample evaluations data
let evaluations = [
	{
		id: '1',
		action_id: '1',
		progress_percentage: 75,
		notes: 'Progress berjalan dengan baik',
		challenges: 'Kendala pada integrasi sistem',
		next_steps: 'Selesaikan integrasi dan testing',
		rating: 4,
		created_at: new Date().toISOString()
	}
];

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		
		const newEvaluation = {
			id: Date.now().toString(),
			action_id: formData.get('action_id') as string,
			progress_percentage: parseInt(formData.get('progress_percentage') as string),
			notes: formData.get('notes') as string,
			challenges: formData.get('challenges') as string,
			next_steps: formData.get('next_steps') as string,
			rating: parseInt(formData.get('rating') as string),
			created_at: new Date().toISOString()
		};

		evaluations.push(newEvaluation);

		return json({ 
			success: true, 
			data: newEvaluation,
			message: 'Evaluasi berhasil disimpan!' 
		});
	} catch (error) {
		return json({ 
			success: false, 
			error: 'Gagal menyimpan evaluasi' 
		}, { status: 500 });
	}
};

export const GET: RequestHandler = async ({ url }) => {
	const actionId = url.searchParams.get('action_id');
	
	let filteredEvaluations = evaluations;
	if (actionId) {
		filteredEvaluations = evaluations.filter(evaluation => evaluation.action_id === actionId);
	}
	
	return json({ 
		success: true, 
		data: filteredEvaluations 
	});
};