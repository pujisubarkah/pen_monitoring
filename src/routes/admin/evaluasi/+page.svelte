<script lang="ts">
	import EvaluationForm from '$lib/components/forms/EvaluationForm.svelte';
	import MapProgress from '$lib/components/charts/MapProgress.svelte';
	
	// Sample data for actions available for evaluation
	const actionsData = [
		{
			id: '1',
			name: 'Implementasi Sistem Monitoring',
			progress: 75,
			location: 'IT Department',
			status: 'in_progress' as const
		},
		{
			id: '2',
			name: 'Training Karyawan',
			progress: 100,
			location: 'HR Department',
			status: 'completed' as const
		},
		{
			id: '3',
			name: 'Review Proses Bisnis',
			progress: 25,
			location: 'Operations',
			status: 'in_progress' as const
		}
	];
	
	let selectedActionId = $state('1');
	
	// Calculate statistics
	const totalActions = actionsData.length;
	const inProgressActions = actionsData.filter(a => a.status === 'in_progress').length;
	const averageProgress = Math.round(actionsData.reduce((sum, action) => sum + action.progress, 0) / totalActions);
</script>

<svelte:head>
	<title>Evaluasi Nasional - PEN Monitor</title>
</svelte:head>

<div class="evaluation-page">
	<!-- Header Section -->
	<header class="page-header">
		<div class="header-content">
			<div class="header-left">
				<div class="header-icon">
					<div class="icon-wrapper">📋</div>
				</div>
				<div class="header-text">
					<h1 class="header-title">Evaluasi Nasional</h1>
					<p class="header-subtitle">Monitoring dan evaluasi progress aksi strategis</p>
					<div class="header-stats">
						<div class="stat-item">
							<span class="stat-number">{totalActions}</span>
							<span class="stat-label">Total Aksi</span>
						</div>
						<div class="stat-divider"></div>
						<div class="stat-item">
							<span class="stat-number">{inProgressActions}</span>
							<span class="stat-label">Dalam Progress</span>
						</div>
						<div class="stat-divider"></div>
						<div class="stat-item">
							<span class="stat-number">{averageProgress}%</span>
							<span class="stat-label">Rata-rata Progress</span>
						</div>
					</div>
				</div>
			</div>
			<div class="header-actions">
				<button class="action-btn secondary">
					<span class="btn-icon">📊</span>
					<span>Export Report</span>
				</button>
				<button class="action-btn primary">
					<span class="btn-icon">🔄</span>
					<span>Refresh Data</span>
				</button>
			</div>
		</div>
		<div class="header-decoration"></div>
	</header>

	<!-- Main Content -->
	<div class="main-content">
		<!-- Progress Overview Card -->
		<div class="content-card overview-card">
			<div class="card-header">
				<div class="card-title">
					<span class="title-icon">📈</span>
					<h2>Overview Progress Aksi</h2>
				</div>
				<div class="card-actions">
					<button class="card-btn">Detail View</button>
				</div>
			</div>
			<div class="card-content">
				<div class="overview-description">
					<p class="description-text">
						<strong>Overview ini menampilkan</strong> gambaran menyeluruh semua aksi PEN yang sedang berjalan. 
						Anda dapat melihat status setiap aksi, progress penyelesaian, dan statistik keseluruhan untuk 
						memudahkan monitoring dan evaluasi nasional.
					</p>
				</div>
				<MapProgress data={actionsData} title="" />
			</div>
		</div>

		<!-- Action Selection & Evaluation -->
		<div class="content-grid">
			<!-- Action Selector Card -->
			<div class="content-card selector-card">
				<div class="card-header">
					<div class="card-title">
						<span class="title-icon">🎯</span>
						<h3>Pilih Aksi untuk Evaluasi</h3>
					</div>
				</div>
				<div class="card-content">
					<div class="selector-wrapper">
						<label class="selector-label">Aksi yang Tersedia:</label>
						<div class="custom-select">
							<select 
								bind:value={selectedActionId}
								class="select-input"
							>
								{#each actionsData.filter(action => action.status !== 'completed') as action}
									<option value={action.id}>{action.name} - {action.progress}%</option>
								{/each}
							</select>
							<div class="select-arrow">⌄</div>
						</div>
					</div>

					<!-- Selected Action Preview -->
					{#if actionsData.find(a => a.id === selectedActionId)}
						{@const selectedAction = actionsData.find(a => a.id === selectedActionId)}
						<div class="action-preview">
							<div class="preview-header">
								<div class="preview-title">{selectedAction.name}</div>
								<div class="preview-status {selectedAction.status}">
									{selectedAction.status === 'in_progress' ? 'Dalam Progress' : 'Selesai'}
								</div>
							</div>
							<div class="preview-details">
								<div class="detail-item">
									<span class="detail-label">📍 Lokasi:</span>
									<span class="detail-value">{selectedAction.location}</span>
								</div>
								<div class="detail-item">
									<span class="detail-label">📊 Progress:</span>
									<span class="detail-value">{selectedAction.progress}%</span>
								</div>
							</div>
							<div class="progress-bar-container">
								<div class="progress-bar">
									<div class="progress-fill" style="width: {selectedAction.progress}%"></div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Evaluation Form Card -->
			<div class="content-card form-card">
				<div class="card-header">
					<div class="card-title">
						<span class="title-icon">📝</span>
						<h3>Form Evaluasi</h3>
					</div>
				</div>
				<div class="card-content">
					<EvaluationForm actionId={selectedActionId} />
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.evaluation-page {
		min-height: 100vh;
		background: 
			radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
			radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.03) 0%, transparent 50%),
			linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
		position: relative;
	}

	.evaluation-page::before {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: 
			linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%),
			linear-gradient(-45deg, transparent 40%, rgba(255, 255, 255, 0.05) 50%, transparent 60%);
		pointer-events: none;
		z-index: 1;
	}

	/* Header Styles */
	.page-header {
		background: 
			linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%),
			radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
			radial-gradient(circle at 70% 60%, rgba(139, 92, 246, 0.3) 0%, transparent 50%);
		color: white;
		position: relative;
		overflow: hidden;
		z-index: 2;
	}

	.page-header::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: 
			linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%);
		animation: shimmer 4s ease-in-out infinite;
	}

	@keyframes shimmer {
		0%, 100% { transform: translateX(-100%); }
		50% { transform: translateX(100%); }
	}

	.header-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 2rem;
		position: relative;
		z-index: 10;
	}

	.header-left {
		display: flex;
		gap: 1.5rem;
		align-items: flex-start;
		flex: 1;
	}

	.header-icon {
		background: 
			linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%),
			radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.3), transparent 70%);
		backdrop-filter: blur(20px);
		border: 2px solid rgba(255, 255, 255, 0.4);
		border-radius: 24px;
		padding: 1.5rem;
		box-shadow: 
			0 12px 40px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.3),
			0 0 0 1px rgba(255, 255, 255, 0.1);
		position: relative;
		overflow: hidden;
	}

	.header-icon::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: conic-gradient(from 0deg, transparent 270deg, rgba(255, 255, 255, 0.1) 360deg);
		animation: icon-spin 8s linear infinite;
	}

	@keyframes icon-spin {
		to { transform: rotate(360deg); }
	}

	.icon-wrapper {
		font-size: 3rem;
		filter: 
			drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))
			drop-shadow(0 0 40px rgba(59, 130, 246, 0.5));
		position: relative;
		z-index: 1;
		animation: icon-pulse 2s ease-in-out infinite;
	}

	@keyframes icon-pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}

	.header-text {
		flex: 1;
	}

	.header-title {
		font-size: 2.5rem;
		font-weight: 800;
		margin-bottom: 0.5rem;
		background: linear-gradient(45deg, #ffffff, #e0e7ff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.header-subtitle {
		font-size: 1.125rem;
		color: rgba(255, 255, 255, 0.9);
		margin-bottom: 1.5rem;
	}

	.header-stats {
		display: flex;
		gap: 1.5rem;
		align-items: center;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.stat-number {
		font-size: 1.5rem;
		font-weight: 700;
		color: #fbbf24;
	}

	.stat-label {
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.8);
	}

	.stat-divider {
		width: 1px;
		height: 2rem;
		background: rgba(255, 255, 255, 0.3);
	}

	.header-actions {
		display: flex;
		gap: 1rem;
		flex-shrink: 0;
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 2rem;
		border-radius: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		border: none;
		font-size: 0.95rem;
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
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left 0.6s ease;
	}

	.action-btn:hover::before {
		left: 100%;
	}

	.action-btn.secondary {
		background: 
			linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
		color: white;
		border: 2px solid rgba(255, 255, 255, 0.3);
		backdrop-filter: blur(10px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}

	.action-btn.secondary:hover {
		background: 
			linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%);
		transform: translateY(-4px) scale(1.05);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
		border-color: rgba(255, 255, 255, 0.5);
	}

	.action-btn.primary {
		background: 
			linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
		color: #1e40af;
		border: 2px solid rgba(59, 130, 246, 0.2);
		box-shadow: 
			0 4px 16px rgba(59, 130, 246, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	.action-btn.primary:hover {
		background: 
			linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
		transform: translateY(-4px) scale(1.05);
		box-shadow: 
			0 12px 40px rgba(59, 130, 246, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		border-color: rgba(59, 130, 246, 0.4);
	}

	.btn-icon {
		font-size: 1.125rem;
	}

	.header-decoration {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
	}

	/* Main Content */
	.main-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
		position: relative;
		z-index: 2;
	}

	.content-card {
		background: 
			linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%),
			radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.03) 0%, transparent 50%);
		border-radius: 24px;
		box-shadow: 
			0 8px 32px rgba(0, 0, 0, 0.12),
			0 2px 8px rgba(0, 0, 0, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		border: 1px solid rgba(255, 255, 255, 0.9);
		overflow: hidden;
		transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		z-index: 2;
	}

	.content-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%);
		opacity: 0;
		transition: all 0.4s ease;
	}

	.content-card::after {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
		transition: left 0.6s ease;
	}

	.content-card:hover {
		transform: translateY(-8px) scale(1.02);
		box-shadow: 
			0 20px 60px rgba(0, 0, 0, 0.2),
			0 8px 24px rgba(0, 0, 0, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	.content-card:hover::before {
		opacity: 1;
		height: 6px;
	}

	.content-card:hover::after {
		left: 100%;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2rem 2.5rem;
		border-bottom: 1px solid rgba(226, 232, 240, 0.6);
		background: 
			linear-gradient(135deg, #f8fafc 0%, #f1f5f9 30%, #e2e8f0 70%, #cbd5e1 100%),
			radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
		position: relative;
		overflow: hidden;
	}

	.card-header::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%);
		opacity: 0.7;
	}

	.card-header::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: 
			linear-gradient(90deg, transparent 0%, #3b82f6 20%, #8b5cf6 50%, #06b6d4 80%, transparent 100%);
		opacity: 0.8;
	}

	.card-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.title-icon {
		font-size: 1.5rem;
	}

	.card-title h2 {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1f2937;
		margin: 0;
	}

	.card-title h3 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0;
	}

	.card-actions {
		display: flex;
		gap: 0.75rem;
	}

	.card-btn {
		padding: 0.5rem 1rem;
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 8px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.875rem;
	}

	.card-btn:hover {
		background: #2563eb;
		transform: translateY(-1px);
	}

	.card-content {
		padding: 2rem;
	}

	/* Overview Description */
	.overview-description {
		margin-bottom: 2rem;
		padding: 1.5rem 2rem;
		background: 
			linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%),
			radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
		border: 2px solid rgba(59, 130, 246, 0.3);
		border-radius: 20px;
		border-left: 6px solid #3b82f6;
		position: relative;
		overflow: hidden;
		box-shadow: 
			0 4px 16px rgba(59, 130, 246, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
	}

	.overview-description::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
		border-radius: 20px 20px 0 0;
	}

	.overview-description::after {
		content: '💡';
		position: absolute;
		top: 1rem;
		right: 1.5rem;
		font-size: 1.5rem;
		opacity: 0.7;
		animation: info-pulse 2s ease-in-out infinite;
	}

	@keyframes info-pulse {
		0%, 100% { transform: scale(1); opacity: 0.7; }
		50% { transform: scale(1.1); opacity: 1; }
	}

	.description-text {
		margin: 0;
		color: #374151;
		font-size: 1rem;
		line-height: 1.7;
		position: relative;
		z-index: 1;
	}

	.description-text strong {
		color: #1e40af;
		font-weight: 700;
		text-shadow: 0 1px 2px rgba(30, 64, 175, 0.1);
	}

	/* Content Grid */
	.content-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	/* Selector Card */
	.selector-wrapper {
		margin-bottom: 1.5rem;
	}

	.selector-label {
		display: block;
		font-weight: 600;
		color: #374151;
		margin-bottom: 0.75rem;
		font-size: 0.95rem;
	}

	.custom-select {
		position: relative;
	}

	.select-input {
		width: 100%;
		padding: 1rem 3rem 1rem 1rem;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
		background: white;
		font-size: 0.95rem;
		color: #374151;
		cursor: pointer;
		transition: all 0.3s ease;
		appearance: none;
	}

	.select-input:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.select-arrow {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		font-size: 1.25rem;
		color: #9ca3af;
		pointer-events: none;
	}

	/* Action Preview */
	.action-preview {
		background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
		border: 1px solid rgba(226, 232, 240, 0.8);
		border-radius: 16px;
		padding: 1.5rem;
		position: relative;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		transition: all 0.3s ease;
	}

	.action-preview::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, #3b82f6, #8b5cf6);
		border-radius: 16px 16px 0 0;
	}

	.action-preview:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
	}

	.preview-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	.preview-title {
		font-weight: 600;
		color: #1f2937;
		font-size: 1.1rem;
		flex: 1;
	}

	.preview-status {
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		font-size: 0.8125rem;
		font-weight: 500;
	}

	.preview-status.in_progress {
		background: #dbeafe;
		color: #1e40af;
	}

	.preview-status.completed {
		background: #d1fae5;
		color: #065f46;
	}

	.preview-details {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.detail-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.detail-label {
		font-size: 0.875rem;
		color: #6b7280;
		min-width: 80px;
	}

	.detail-value {
		font-weight: 500;
		color: #374151;
		font-size: 0.875rem;
	}

	.progress-bar-container {
		margin-top: 1rem;
	}

	.progress-bar {
		height: 8px;
		background: #e5e7eb;
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #3b82f6, #8b5cf6);
		border-radius: 4px;
		transition: width 0.6s ease;
	}

	/* Responsive Design */
	@media (max-width: 1024px) {
		.content-grid {
			grid-template-columns: 1fr;
		}

		.header-content {
			flex-direction: column;
			align-items: stretch;
			gap: 1.5rem;
		}

		.header-actions {
			justify-content: center;
		}

		.header-stats {
			justify-content: center;
		}
	}

	@media (max-width: 768px) {
		.header-left {
			flex-direction: column;
			gap: 1rem;
		}

		.header-title {
			font-size: 2rem;
		}

		.header-stats {
			flex-wrap: wrap;
			gap: 1rem;
		}

		.action-btn {
			flex: 1;
		}

		.card-header {
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
		}

		.main-content {
			padding: 1rem;
		}
	}
</style>
