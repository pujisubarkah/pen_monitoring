export interface SummaryData {
	totalActions: number;
	completedActions: number;
	inProgressActions: number;
	pendingActions: number;
	averageProgress: number;
	completionRate: number;
	onTimeCompletion: number;
	monthlyProgress: Array<{
		month: string;
		progress: number;
		completed: number;
	}>;
	priorityBreakdown: {
		high: { total: number; completed: number; in_progress: number; pending: number };
		medium: { total: number; completed: number; in_progress: number; pending: number };
		low: { total: number; completed: number; in_progress: number; pending: number };
	};
	performanceMetrics: Array<{
		label: string;
		value: number;
	}>;
	recentActivities: Array<{
		id: string;
		type: string;
		message: string;
		timestamp: string;
		user: string;
	}>;
}

export interface ActionData {
	id: string;
	title: string;
	description?: string;
	target_date: string;
	priority: 'low' | 'medium' | 'high';
	status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
	assigned_to?: string;
	progress?: number;
	created_at: string;
	updated_at: string;
}

export interface EvaluationData {
	id: string;
	action_id: string;
	progress_percentage: number;
	notes: string;
	challenges: string;
	next_steps: string;
	rating: number;
	created_at: string;
}