<svelte:head>
	<title>Admin Dashboard - PEN Monitor</title>
</svelte:head>

<div class="dashboard">
	<!-- Header Section -->
	<div class="dashboard-header">
		<div class="header-content">
			<div class="header-text">
				<h1>Dashboard Admin</h1>
				<p>Monitoring dan manajemen sistem secara keseluruhan</p>
			</div>
			<div class="header-actions">
				<button class="btn-action">
					<span class="icon">📊</span>
					<span>Export Data</span>
				</button>
				<button class="btn-action primary">
					<span class="icon">➕</span>
					<span>Tambah User</span>
				</button>
			</div>
		</div>
	</div>

	<!-- Statistics Cards -->
	<div class="stats-grid">
		<div class="stat-card blue">
			<div class="stat-icon">👥</div>
			<div class="stat-content">
				<div class="stat-label">Total Users</div>
				<div class="stat-value">1,234</div>
				<div class="stat-change positive">
					<span class="arrow">↑</span>
					<span>12% dari bulan lalu</span>
				</div>
			</div>
		</div>

		<div class="stat-card green">
			<div class="stat-icon">📝</div>
			<div class="stat-content">
				<div class="stat-label">Total Aksi</div>
				<div class="stat-value">5,678</div>
				<div class="stat-change positive">
					<span class="arrow">↑</span>
					<span>8% dari bulan lalu</span>
				</div>
			</div>
		</div>

		<div class="stat-card purple">
			<div class="stat-icon">✅</div>
			<div class="stat-content">
				<div class="stat-label">Evaluasi Selesai</div>
				<div class="stat-value">890</div>
				<div class="stat-change positive">
					<span class="arrow">↑</span>
					<span>15% dari bulan lalu</span>
				</div>
			</div>
		</div>

		<div class="stat-card orange">
			<div class="stat-icon">📊</div>
			<div class="stat-content">
				<div class="stat-label">Progress Rata-rata</div>
				<div class="stat-value">78%</div>
				<div class="stat-change negative">
					<span class="arrow">↓</span>
					<span>3% dari bulan lalu</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content Grid -->
	<div class="content-grid">
		<!-- Recent Activity -->
		<div class="activity-card">
			<div class="card-header">
				<h2>Aktivitas Terbaru</h2>
				<button class="link-btn">Lihat Semua</button>
			</div>
			<div class="activity-list">
				<div class="activity-item">
					<div class="activity-icon new">📋</div>
					<div class="activity-content">
						<p class="activity-title">User123 menambahkan aksi baru</p>
						<p class="activity-time">5 menit yang lalu</p>
					</div>
					<div class="activity-badge new">Baru</div>
				</div>
				<div class="activity-item">
					<div class="activity-icon success">✅</div>
					<div class="activity-content">
						<p class="activity-title">Evaluasi pilar 3 diselesaikan</p>
						<p class="activity-time">15 menit yang lalu</p>
					</div>
				</div>
				<div class="activity-item">
					<div class="activity-icon info">👥</div>
					<div class="activity-content">
						<p class="activity-title">5 user baru terdaftar</p>
						<p class="activity-time">1 jam yang lalu</p>
					</div>
				</div>
				<div class="activity-item">
					<div class="activity-icon warning">⚠️</div>
					<div class="activity-content">
						<p class="activity-title">Aksi tertunda memerlukan perhatian</p>
						<p class="activity-time">2 jam yang lalu</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Quick Stats Chart -->
		<div class="chart-card">
			<div class="card-header">
				<h2>Progress Pilar</h2>
				<select class="select-filter">
					<option>Bulan Ini</option>
					<option>3 Bulan Terakhir</option>
					<option>Tahun Ini</option>
				</select>
			</div>
			<div class="chart-content">
				<div class="progress-item">
					<div class="progress-label">
						<span>Pilar 1: Pembentukan Satgas</span>
						<span class="progress-value">85%</span>
					</div>
					<div class="progress-bar">
						<div class="progress-fill" style="width: 85%; background: linear-gradient(90deg, #3b82f6, #2563eb);"></div>
					</div>
				</div>
				<div class="progress-item">
					<div class="progress-label">
						<span>Pilar 2: Operasionalisasi KDMP</span>
						<span class="progress-value">72%</span>
					</div>
					<div class="progress-bar">
						<div class="progress-fill" style="width: 72%; background: linear-gradient(90deg, #10b981, #059669);"></div>
					</div>
				</div>
				<div class="progress-item">
					<div class="progress-label">
						<span>Pilar 3: Model Bisnis</span>
						<span class="progress-value">90%</span>
					</div>
					<div class="progress-bar">
						<div class="progress-fill" style="width: 90%; background: linear-gradient(90deg, #8b5cf6, #7c3aed);"></div>
					</div>
				</div>
				<div class="progress-item">
					<div class="progress-label">
						<span>Pilar 4: Akses Pembiayaan</span>
						<span class="progress-value">65%</span>
					</div>
					<div class="progress-bar">
						<div class="progress-fill" style="width: 65%; background: linear-gradient(90deg, #f59e0b, #d97706);"></div>
					</div>
				</div>
				<div class="progress-item">
					<div class="progress-label">
						<span>Pilar 5: Skema Aset</span>
						<span class="progress-value">58%</span>
					</div>
					<div class="progress-bar">
						<div class="progress-fill" style="width: 58%; background: linear-gradient(90deg, #ef4444, #dc2626);"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.dashboard {
		background: #f8fafc;
		min-height: 100vh;
	}

	/* Header */
	.dashboard-header {
		background: linear-gradient(135deg, #1e40af, #3b82f6);
		border-radius: 16px;
		padding: 2rem;
		margin-bottom: 2rem;
		box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.header-text h1 {
		font-size: 2rem;
		font-weight: 700;
		color: white;
		margin-bottom: 0.5rem;
	}

	.header-text p {
		color: rgba(255, 255, 255, 0.9);
		font-size: 1rem;
	}

	.header-actions {
		display: flex;
		gap: 1rem;
	}

	.btn-action {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 10px;
		color: white;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s;
	}

	.btn-action:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
	}

	.btn-action.primary {
		background: white;
		color: #1e40af;
		border: none;
	}

	.btn-action.primary:hover {
		background: #f8fafc;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: white;
		border-radius: 16px;
		padding: 1.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		display: flex;
		gap: 1rem;
		transition: all 0.3s;
		border-left: 4px solid;
	}

	.stat-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
	}

	.stat-card.blue {
		border-color: #3b82f6;
	}

	.stat-card.green {
		border-color: #10b981;
	}

	.stat-card.purple {
		border-color: #8b5cf6;
	}

	.stat-card.orange {
		border-color: #f59e0b;
	}

	.stat-icon {
		font-size: 2.5rem;
	}

	.stat-content {
		flex: 1;
	}

	.stat-label {
		font-size: 0.875rem;
		color: #6b7280;
		margin-bottom: 0.5rem;
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 700;
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.stat-change {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.8125rem;
		font-weight: 500;
	}

	.stat-change.positive {
		color: #10b981;
	}

	.stat-change.negative {
		color: #ef4444;
	}

	.arrow {
		font-weight: 700;
	}

	/* Content Grid */
	.content-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	.activity-card,
	.chart-card {
		background: white;
		border-radius: 16px;
		padding: 1.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.card-header h2 {
		font-size: 1.25rem;
		font-weight: 700;
		color: #1f2937;
	}

	.link-btn {
		color: #3b82f6;
		font-weight: 600;
		font-size: 0.875rem;
		background: none;
		border: none;
		cursor: pointer;
		transition: color 0.3s;
	}

	.link-btn:hover {
		color: #2563eb;
		text-decoration: underline;
	}

	.select-filter {
		padding: 0.5rem 1rem;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		font-size: 0.875rem;
		cursor: pointer;
	}

	/* Activity List */
	.activity-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.activity-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: #f8fafc;
		border-radius: 12px;
		transition: all 0.3s;
	}

	.activity-item:hover {
		background: #f1f5f9;
		transform: translateX(4px);
	}

	.activity-icon {
		width: 3rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 12px;
		font-size: 1.5rem;
	}

	.activity-icon.new {
		background: #dbeafe;
	}

	.activity-icon.success {
		background: #d1fae5;
	}

	.activity-icon.info {
		background: #e0e7ff;
	}

	.activity-icon.warning {
		background: #fef3c7;
	}

	.activity-content {
		flex: 1;
	}

	.activity-title {
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 0.25rem;
	}

	.activity-time {
		font-size: 0.8125rem;
		color: #6b7280;
	}

	.activity-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.activity-badge.new {
		background: #dbeafe;
		color: #1e40af;
	}

	/* Progress Chart */
	.chart-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.progress-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.progress-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.875rem;
	}

	.progress-label span:first-child {
		color: #4b5563;
		font-weight: 500;
	}

	.progress-value {
		font-weight: 700;
		color: #1f2937;
	}

	.progress-bar {
		height: 8px;
		background: #e5e7eb;
		border-radius: 9999px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		border-radius: 9999px;
		transition: width 0.6s ease;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.content-grid {
			grid-template-columns: 1fr;
		}

		.header-content {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.header-actions {
			width: 100%;
			justify-content: stretch;
		}

		.btn-action {
			flex: 1;
		}
	}

	@media (max-width: 640px) {
		.header-text h1 {
			font-size: 1.5rem;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		.header-actions {
			flex-direction: column;
		}
	}
</style>