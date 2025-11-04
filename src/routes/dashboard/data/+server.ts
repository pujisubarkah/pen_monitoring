import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Sample summary data
const generateSummaryData = () => {
	return {
		totalActions: 24,
		completedActions: 16,
		inProgressActions: 5,
		pendingActions: 3,
		averageProgress: 78,
		completionRate: 67,
		onTimeCompletion: 88,
		
		// Monthly progress data
		monthlyProgress: [
			{ month: 'Jan', progress: 20, completed: 2 },
			{ month: 'Feb', progress: 35, completed: 5 },
			{ month: 'Mar', progress: 55, completed: 8 },
			{ month: 'Apr', progress: 68, completed: 12 },
			{ month: 'May', progress: 78, completed: 16 }
		],
		
		// Priority breakdown
		priorityBreakdown: {
			high: { total: 8, completed: 5, in_progress: 2, pending: 1 },
			medium: { total: 12, completed: 8, in_progress: 3, pending: 1 },
			low: { total: 4, completed: 3, in_progress: 0, pending: 1 }
		},
		
		// Performance metrics
		performanceMetrics: [
			{ label: 'Kualitas', value: 85 },
			{ label: 'Kecepatan', value: 72 },
			{ label: 'Efisiensi', value: 90 },
			{ label: 'Inovasi', value: 65 },
			{ label: 'Kolaborasi', value: 88 }
		],
		
		// Recent activities
		recentActivities: [
			{
				id: '1',
				type: 'action_created',
				message: 'Aksi "Implementasi Sistem" dibuat',
				timestamp: new Date().toISOString(),
				user: 'John Doe'
			},
			{
				id: '2',
				type: 'evaluation_updated',
				message: 'Evaluasi untuk aksi "Training Karyawan" diperbarui',
				timestamp: new Date(Date.now() - 3600000).toISOString(),
				user: 'Jane Smith'
			},
			{
				id: '3',
				type: 'action_completed',
				message: 'Aksi "Review Proses" diselesaikan',
				timestamp: new Date(Date.now() - 7200000).toISOString(),
				user: 'Bob Wilson'
			}
		]
	};
};

export const GET: RequestHandler = async ({ url }) => {
	try {
		const period = url.searchParams.get('period') || 'monthly';
		const summary = generateSummaryData();
		
		return json({
			success: true,
			data: summary,
			period
		});
	} catch (error) {
		return json({
			success: false,
			error: 'Gagal mengambil data summary'
		}, { status: 500 });
	}
};