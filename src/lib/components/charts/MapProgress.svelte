<script lang="ts">
	let { data, title = "Progress Map" } = $props<{ 
		data: Array<{
			id: string,
			name: string, 
			progress: number,
			location?: string,
			status: 'completed' | 'in_progress' | 'pending' | 'cancelled'
		}>, 
		title?: string 
	}>();
	
	// Group data by status
	const groupedData = $derived(() => ({
		completed: data.filter((item: any) => item.status === 'completed'),
		in_progress: data.filter((item: any) => item.status === 'in_progress'),
		pending: data.filter((item: any) => item.status === 'pending'),
		cancelled: data.filter((item: any) => item.status === 'cancelled')
	}));
	
	// Status configuration
	const statusConfig = {
		completed: { color: 'bg-green-500', textColor: 'text-green-700', label: 'Selesai' },
		in_progress: { color: 'bg-blue-500', textColor: 'text-blue-700', label: 'Sedang Berjalan' },
		pending: { color: 'bg-yellow-500', textColor: 'text-yellow-700', label: 'Menunggu' },
		cancelled: { color: 'bg-red-500', textColor: 'text-red-700', label: 'Dibatalkan' }
	};
	
	// Calculate overall statistics
	const totalItems = $derived(() => data.length);
	const avgProgress = $derived(() => data.length > 0 ? Math.round(data.reduce((sum: number, item: any) => sum + item.progress, 0) / data.length) : 0);
	const completionRate = $derived(() => data.length > 0 ? Math.round((groupedData().completed.length / data.length) * 100) : 0);
</script>

<div class="map-progress-container">
	{#if title}
		<h3 class="main-title">{title}</h3>
	{/if}
	
	<!-- Summary Statistics -->
	<div class="stats-grid">
		<div class="stat-card total">
			<div class="stat-icon">📊</div>
			<div class="stat-content">
				<div class="stat-number">{totalItems}</div>
				<div class="stat-label">Total Items</div>
			</div>
		</div>
		<div class="stat-card average">
			<div class="stat-icon">📈</div>
			<div class="stat-content">
				<div class="stat-number">{avgProgress()}%</div>
				<div class="stat-label">Rata-rata Progress</div>
			</div>
		</div>
		<div class="stat-card completion">
			<div class="stat-icon">✅</div>
			<div class="stat-content">
				<div class="stat-number">{completionRate()}%</div>
				<div class="stat-label">Tingkat Penyelesaian</div>
			</div>
		</div>
		<div class="stat-card active">
			<div class="stat-icon">⚡</div>
			<div class="stat-content">
				<div class="stat-number">{groupedData().in_progress.length}</div>
				<div class="stat-label">Sedang Aktif</div>
			</div>
		</div>
	</div>
	
	<!-- Progress Map Grid -->
	<div class="space-y-8">
		{#each Object.entries(statusConfig) as [status, config]}
			{@const items = groupedData()[status as keyof typeof statusConfig]}
			{#if items.length > 0}
				<div class="status-section">
					<div class="section-header">
						<div class="status-indicator {status}">
							<div class="indicator-dot"></div>
							<div class="indicator-pulse"></div>
						</div>
						<div class="section-title">
							<h4 class="section-heading">{config.label}</h4>
							<span class="section-count">{items.length} Aksi</span>
						</div>
						<div class="section-actions">
							<button class="view-all-btn">Lihat Semua</button>
						</div>
					</div>
					
					<div class="cards-grid">
						{#each items as item}
							<div class="progress-card {status}">
								<div class="card-header">
									<div class="card-status-badge {status}">
										{#if status === 'completed'}
											✅
										{:else if status === 'in_progress'}
											⚡
										{:else if status === 'pending'}
											⏳
										{:else}
											❌
										{/if}
									</div>
									<div class="card-progress-badge">
										{item.progress}%
									</div>
								</div>
								
								<div class="card-content">
									<h5 class="card-title">{item.name}</h5>
									{#if item.location}
										<p class="card-location">📍 {item.location}</p>
									{/if}
								</div>
								
								<!-- Enhanced Progress bar -->
								<div class="progress-container">
									<div class="progress-bar">
										<div class="progress-fill {status}" style="width: {item.progress}%">
											<div class="progress-shimmer"></div>
										</div>
									</div>
									<div class="progress-label">{item.progress}% Complete</div>
								</div>
								
								<!-- Enhanced Action buttons -->
								<div class="card-actions">
									<button class="action-btn detail">
										<span class="btn-icon">👁️</span>
										<span>Detail</span>
									</button>
									<button class="action-btn edit">
										<span class="btn-icon">✏️</span>
										<span>Edit</span>
									</button>
									{#if status !== 'completed'}
										<button class="action-btn update">
											<span class="btn-icon">🔄</span>
											<span>Update</span>
										</button>
									{/if}
								</div>
								
								<div class="card-overlay"></div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>
	
	<!-- Empty state -->
	{#if totalItems() === 0}
		<div class="text-center py-12">
			<div class="text-gray-400 text-6xl mb-4">📊</div>
			<h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada data</h3>
			<p class="text-gray-500">Tambahkan aksi pertama untuk melihat progress map</p>
			<button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
				Tambah Aksi
			</button>
		</div>
	{/if}
	
	<!-- Legend -->
	<div class="legend-section">
		<h4 class="legend-title">Status Legend:</h4>
		<div class="legend-items">
			{#each Object.entries(statusConfig) as [status, config]}
				<div class="legend-item {status}">
					<div class="legend-dot {status}"></div>
					<span class="legend-text">{config.label}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.map-progress-container {
		background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
		border-radius: 20px;
		padding: 2rem;
		box-shadow: 
			0 4px 20px rgba(0, 0, 0, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		border: 1px solid rgba(255, 255, 255, 0.8);
	}

	.main-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1f2937;
		margin-bottom: 2rem;
		text-align: center;
	}

	/* Enhanced Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2.5rem;
	}

	.stat-card {
		background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
		border-radius: 16px;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.8);
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.stat-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		transition: opacity 0.3s ease;
		opacity: 0;
	}

	.stat-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	}

	.stat-card:hover::before {
		opacity: 1;
	}

	.stat-card.total::before { background: linear-gradient(90deg, #6b7280, #9ca3af); }
	.stat-card.average::before { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
	.stat-card.completion::before { background: linear-gradient(90deg, #10b981, #34d399); }
	.stat-card.active::before { background: linear-gradient(90deg, #8b5cf6, #a78bfa); }

	.stat-icon {
		font-size: 2rem;
		padding: 0.75rem;
		border-radius: 12px;
		background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
		border: 1px solid rgba(255, 255, 255, 0.8);
	}

	.stat-content {
		flex: 1;
	}

	.stat-number {
		font-size: 1.75rem;
		font-weight: 700;
		color: #1f2937;
		margin-bottom: 0.25rem;
	}

	.stat-label {
		font-size: 0.875rem;
		color: #6b7280;
		font-weight: 500;
	}

	/* Status Sections */
	.status-section {
		margin-bottom: 2.5rem;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
		padding: 1rem 1.5rem;
		background: linear-gradient(135deg, #f8fafc, #f1f5f9);
		border-radius: 16px;
		border: 1px solid rgba(226, 232, 240, 0.8);
	}

	.status-indicator {
		position: relative;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.status-indicator.completed {
		background: linear-gradient(135deg, #10b981, #34d399);
	}

	.status-indicator.in_progress {
		background: linear-gradient(135deg, #3b82f6, #60a5fa);
	}

	.status-indicator.pending {
		background: linear-gradient(135deg, #f59e0b, #fbbf24);
	}

	.status-indicator.cancelled {
		background: linear-gradient(135deg, #ef4444, #f87171);
	}

	.indicator-dot {
		width: 1rem;
		height: 1rem;
		background: white;
		border-radius: 50%;
	}

	.indicator-pulse {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { transform: scale(1); opacity: 0.7; }
		50% { transform: scale(1.1); opacity: 0.3; }
	}

	.section-title {
		flex: 1;
	}

	.section-heading {
		font-size: 1.25rem;
		font-weight: 700;
		color: #1f2937;
		margin-bottom: 0.25rem;
	}

	.section-count {
		font-size: 0.875rem;
		color: #6b7280;
		font-weight: 500;
	}

	.view-all-btn {
		padding: 0.5rem 1rem;
		background: linear-gradient(135deg, #3b82f6, #2563eb);
		color: white;
		border: none;
		border-radius: 8px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		font-size: 0.875rem;
	}

	.view-all-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
	}

	/* Enhanced Progress Cards */
	.cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
	}

	.progress-card {
		background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
		border-radius: 20px;
		padding: 1.5rem;
		box-shadow: 
			0 4px 16px rgba(0, 0, 0, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		border: 1px solid rgba(255, 255, 255, 0.8);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
	}

	.progress-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		transition: all 0.3s ease;
		opacity: 0;
	}

	.progress-card.completed::before {
		background: linear-gradient(90deg, #10b981, #34d399);
	}

	.progress-card.in_progress::before {
		background: linear-gradient(90deg, #3b82f6, #60a5fa);
	}

	.progress-card.pending::before {
		background: linear-gradient(90deg, #f59e0b, #fbbf24);
	}

	.progress-card.cancelled::before {
		background: linear-gradient(90deg, #ef4444, #f87171);
	}

	.progress-card:hover {
		transform: translateY(-4px) scale(1.02);
		box-shadow: 
			0 12px 32px rgba(0, 0, 0, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	.progress-card:hover::before {
		opacity: 1;
		height: 6px;
	}

	.card-overlay {
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
		transition: left 0.6s ease;
	}

	.progress-card:hover .card-overlay {
		left: 100%;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.card-status-badge {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.8);
	}

	.card-status-badge.completed {
		background: linear-gradient(135deg, #d1fae5, #a7f3d0);
	}

	.card-status-badge.in_progress {
		background: linear-gradient(135deg, #dbeafe, #bfdbfe);
	}

	.card-status-badge.pending {
		background: linear-gradient(135deg, #fef3c7, #fed7aa);
	}

	.card-status-badge.cancelled {
		background: linear-gradient(135deg, #fee2e2, #fecaca);
	}

	.card-progress-badge {
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-size: 0.875rem;
		font-weight: 700;
		background: linear-gradient(135deg, #1f2937, #374151);
		color: white;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	.card-content {
		margin-bottom: 1.5rem;
	}

	.card-title {
		font-size: 1.1rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 0.5rem;
		line-height: 1.4;
	}

	.card-location {
		font-size: 0.875rem;
		color: #6b7280;
		margin: 0;
	}

	/* Enhanced Progress Bar */
	.progress-container {
		margin-bottom: 1.5rem;
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: linear-gradient(90deg, #e5e7eb, #f3f4f6);
		border-radius: 6px;
		overflow: hidden;
		margin-bottom: 0.5rem;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.progress-fill {
		height: 100%;
		border-radius: 6px;
		position: relative;
		transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
	}

	.progress-fill.completed {
		background: linear-gradient(90deg, #10b981, #34d399);
	}

	.progress-fill.in_progress {
		background: linear-gradient(90deg, #3b82f6, #60a5fa);
	}

	.progress-fill.pending {
		background: linear-gradient(90deg, #f59e0b, #fbbf24);
	}

	.progress-fill.cancelled {
		background: linear-gradient(90deg, #ef4444, #f87171);
	}

	.progress-shimmer {
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
		animation: shimmer 2s ease-in-out infinite;
	}

	@keyframes shimmer {
		to { left: 100%; }
	}

	.progress-label {
		font-size: 0.75rem;
		color: #6b7280;
		font-weight: 500;
	}

	/* Enhanced Action Buttons */
	.card-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 10px;
		font-size: 0.8125rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.action-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
		transition: left 0.5s ease;
	}

	.action-btn:hover::before {
		left: 100%;
	}

	.action-btn.detail {
		background: linear-gradient(135deg, #dbeafe, #bfdbfe);
		color: #1e40af;
		border: 1px solid rgba(59, 130, 246, 0.3);
	}

	.action-btn.detail:hover {
		background: linear-gradient(135deg, #bfdbfe, #93c5fd);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
	}

	.action-btn.edit {
		background: linear-gradient(135deg, #d1fae5, #a7f3d0);
		color: #065f46;
		border: 1px solid rgba(16, 185, 129, 0.3);
	}

	.action-btn.edit:hover {
		background: linear-gradient(135deg, #a7f3d0, #6ee7b7);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
	}

	.action-btn.update {
		background: linear-gradient(135deg, #ede9fe, #ddd6fe);
		color: #5b21b6;
		border: 1px solid rgba(139, 92, 246, 0.3);
	}

	.action-btn.update:hover {
		background: linear-gradient(135deg, #ddd6fe, #c4b5fd);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
	}

	.btn-icon {
		font-size: 1rem;
	}

	/* Legend */
	.legend-section {
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 2px solid rgba(226, 232, 240, 0.8);
	}

	.legend-title {
		font-size: 1rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.legend-items {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: linear-gradient(135deg, #f8fafc, #f1f5f9);
		border-radius: 12px;
		border: 1px solid rgba(226, 232, 240, 0.8);
	}

	.legend-dot {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.legend-dot.completed {
		background: linear-gradient(135deg, #10b981, #34d399);
	}

	.legend-dot.in_progress {
		background: linear-gradient(135deg, #3b82f6, #60a5fa);
	}

	.legend-dot.pending {
		background: linear-gradient(135deg, #f59e0b, #fbbf24);
	}

	.legend-dot.cancelled {
		background: linear-gradient(135deg, #ef4444, #f87171);
	}

	.legend-text {
		font-size: 0.875rem;
		color: #374151;
		font-weight: 500;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.map-progress-container {
			padding: 1.5rem;
		}

		.stats-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.cards-grid {
			grid-template-columns: 1fr;
		}

		.section-header {
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
		}

		.legend-items {
			flex-direction: column;
			gap: 0.75rem;
		}
	}
</style>