<script lang="ts">
	let { 
		action,
		onEdit,
		onDelete,
		onEvaluate 
	} = $props<{ 
		action: {
			id: string,
			title: string,
			description?: string,
			target_date: string,
			priority: 'low' | 'medium' | 'high',
			status: 'pending' | 'in_progress' | 'completed' | 'cancelled',
			assigned_to?: string,
			progress?: number,
			created_at?: string
		},
		onEdit?: (id: string) => void,
		onDelete?: (id: string) => void,
		onEvaluate?: (id: string) => void
	}>();
	
	// Priority and status configurations
	const priorityConfig = {
		low: { color: 'bg-green-100 text-green-800', label: 'Rendah' },
		medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Sedang' },
		high: { color: 'bg-red-100 text-red-800', label: 'Tinggi' }
	};
	
	const statusConfig = {
		pending: { color: 'bg-gray-100 text-gray-800', label: 'Menunggu', icon: '⏳' },
		in_progress: { color: 'bg-blue-100 text-blue-800', label: 'Sedang Berjalan', icon: '🔄' },
		completed: { color: 'bg-green-100 text-green-800', label: 'Selesai', icon: '✅' },
		cancelled: { color: 'bg-red-100 text-red-800', label: 'Dibatalkan', icon: '❌' }
	};
	
	// Calculate days until target
	const derivedData = $derived(() => {
		const daysUntilTarget = Math.ceil((new Date(action.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
		const isOverdue = daysUntilTarget < 0;
		const isUrgent = daysUntilTarget <= 3 && daysUntilTarget >= 0;
		
		return { daysUntilTarget, isOverdue, isUrgent };
	});
	
	const daysUntilTarget = $derived(() => derivedData().daysUntilTarget);
	const isOverdue = $derived(() => derivedData().isOverdue);
	const isUrgent = $derived(() => derivedData().isUrgent);
</script>

<div class="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
	<!-- Header -->
	<div class="p-4 border-b border-gray-100">
		<div class="flex justify-between items-start mb-2">
			<h3 class="text-lg font-semibold text-gray-900 line-clamp-2">{action.title}</h3>
			<div class="flex space-x-1">
				<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {priorityConfig[action.priority as keyof typeof priorityConfig].color}">
					{priorityConfig[action.priority as keyof typeof priorityConfig].label}
				</span>
			</div>
		</div>
		
		<div class="flex items-center justify-between">
			<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {statusConfig[action.status as keyof typeof statusConfig].color}">
				<span class="mr-1">{statusConfig[action.status as keyof typeof statusConfig].icon}</span>
				{statusConfig[action.status as keyof typeof statusConfig].label}
			</span>
			
			<!-- Target date indicator -->
			<div class="text-xs" class:text-red-600={isOverdue()} class:text-orange-600={isUrgent()} class:text-gray-600={!isOverdue() && !isUrgent()}>
				{#if isOverdue()}
					📅 Terlambat {Math.abs(daysUntilTarget())} hari
				{:else if isUrgent()}
					📅 {daysUntilTarget()} hari lagi
				{:else}
					📅 {new Date(action.target_date).toLocaleDateString('id-ID')}
				{/if}
			</div>
		</div>
	</div>
	
	<!-- Content -->
	<div class="p-4">
		{#if action.description}
			<p class="text-gray-600 text-sm mb-3 line-clamp-3">{action.description}</p>
		{/if}
		
		{#if action.assigned_to}
			<div class="flex items-center text-sm text-gray-600 mb-3">
				<span class="mr-2">👤</span>
				<span>Ditugaskan ke: {action.assigned_to}</span>
			</div>
		{/if}
		
		<!-- Progress bar (if available) -->
		{#if action.progress !== undefined}
			<div class="mb-3">
				<div class="flex justify-between text-sm text-gray-600 mb-1">
					<span>Progress</span>
					<span>{action.progress}%</span>
				</div>
				<div class="w-full bg-gray-200 rounded-full h-2">
					<div 
						class="bg-blue-500 h-2 rounded-full transition-all duration-300" 
						style="width: {action.progress}%"
					></div>
				</div>
			</div>
		{/if}
		
		<!-- Timestamps -->
		{#if action.created_at}
			<p class="text-xs text-gray-400 mb-3">
				Dibuat: {new Date(action.created_at).toLocaleDateString('id-ID', { 
					day: 'numeric', 
					month: 'short', 
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})}
			</p>
		{/if}
	</div>
	
	<!-- Actions -->
	<div class="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
		<div class="flex space-x-2">
			{#if onEdit}
				<button 
					onclick={() => onEdit?.(action.id)}
					class="text-blue-600 hover:text-blue-800 text-sm font-medium"
				>
					Edit
				</button>
			{/if}
			
			{#if onEvaluate && action.status !== 'completed'}
				<button 
					onclick={() => onEvaluate?.(action.id)}
					class="text-green-600 hover:text-green-800 text-sm font-medium"
				>
					Evaluasi
				</button>
			{/if}
		</div>
		
		<div class="flex space-x-2">
			<button class="text-gray-400 hover:text-gray-600 text-sm">
				📋 Detail
			</button>
			
			{#if onDelete}
				<button 
					onclick={() => onDelete?.(action.id)}
					class="text-red-600 hover:text-red-800 text-sm"
				>
					🗑️
				</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>