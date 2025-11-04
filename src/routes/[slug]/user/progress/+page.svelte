<script lang="ts">
	const progressData = [
		{
			id: 1,
			title: 'Sosialisasi KDMP ke 50 Desa',
			pilar: 'Pilar 1: Pembentukan Satgas Daerah',
			progress: 80,
			status: 'in_progress',
			targetDate: '2025-12-31',
			lastUpdate: '2025-11-01'
		},
		{
			id: 2,
			title: 'Pelatihan SDM Koperasi',
			pilar: 'Pilar 6: Pelatihan & Pendampingan SDM',
			progress: 45,
			status: 'in_progress',
			targetDate: '2025-11-30',
			lastUpdate: '2025-10-28'
		},
		{
			id: 3,
			title: 'Digitalisasi Database KDMP',
			pilar: 'Pilar 8: Digitalisasi Proses Bisnis',
			progress: 100,
			status: 'completed',
			targetDate: '2025-10-15',
			lastUpdate: '2025-10-15'
		}
	];

	const getStatusBadge = (status: string) => {
		const badges: Record<string, { label: string; class: string }> = {
			completed: { label: 'Selesai', class: 'bg-green-100 text-green-800' },
			in_progress: { label: 'Dalam Progress', class: 'bg-blue-100 text-blue-800' },
			pending: { label: 'Menunggu', class: 'bg-yellow-100 text-yellow-800' }
		};
		return badges[status] || badges.pending;
	};

	const getProgressColor = (progress: number) => {
		if (progress >= 80) return 'bg-green-500';
		if (progress >= 50) return 'bg-blue-500';
		if (progress >= 25) return 'bg-yellow-500';
		return 'bg-red-500';
	};
</script>

<svelte:head>
	<title>Progress Saya - PEN Monitor</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-3xl font-bold text-gray-900">Progress Saya</h1>
		<p class="text-gray-600 mt-2">Monitor semua aksi yang sedang berjalan</p>
	</div>

	<!-- Summary Stats -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
		<div class="bg-white rounded-lg shadow-md p-4">
			<p class="text-sm text-gray-600">Total Aksi</p>
			<p class="text-2xl font-bold text-blue-600">12</p>
		</div>
		<div class="bg-white rounded-lg shadow-md p-4">
			<p class="text-sm text-gray-600">Dalam Progress</p>
			<p class="text-2xl font-bold text-yellow-600">7</p>
		</div>
		<div class="bg-white rounded-lg shadow-md p-4">
			<p class="text-sm text-gray-600">Selesai</p>
			<p class="text-2xl font-bold text-green-600">5</p>
		</div>
		<div class="bg-white rounded-lg shadow-md p-4">
			<p class="text-sm text-gray-600">Rata-rata</p>
			<p class="text-2xl font-bold text-purple-600">68%</p>
		</div>
	</div>

	<!-- Progress List -->
	<div class="space-y-4">
		{#each progressData as item}
			<div class="bg-white rounded-lg shadow-md p-6">
				<div class="flex items-start justify-between mb-4">
					<div class="flex-1">
						<h3 class="text-lg font-bold text-gray-900">{item.title}</h3>
						<p class="text-sm text-gray-600 mt-1">{item.pilar}</p>
					</div>
					<span class="px-3 py-1 rounded-full text-xs font-medium {getStatusBadge(item.status).class}">
						{getStatusBadge(item.status).label}
					</span>
				</div>

				<!-- Progress Bar -->
				<div class="mb-4">
					<div class="flex justify-between text-sm text-gray-600 mb-2">
						<span>Progress</span>
						<span class="font-bold">{item.progress}%</span>
					</div>
					<div class="w-full bg-gray-200 rounded-full h-3">
						<div
							class="h-3 rounded-full transition-all duration-300 {getProgressColor(item.progress)}"
							style="width: {item.progress}%"
						></div>
					</div>
				</div>

				<!-- Metadata -->
				<div class="flex items-center justify-between text-sm text-gray-600">
					<div class="flex items-center gap-4">
						<span>📅 Target: {new Date(item.targetDate).toLocaleDateString('id-ID')}</span>
						<span>🔄 Update: {new Date(item.lastUpdate).toLocaleDateString('id-ID')}</span>
					</div>
					<div class="flex gap-2">
						<button class="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
						<button class="text-green-600 hover:text-green-800 font-medium">Update Progress</button>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Empty State -->
	{#if progressData.length === 0}
		<div class="bg-white rounded-lg shadow-md p-12 text-center">
			<div class="text-6xl mb-4">📋</div>
			<h3 class="text-xl font-bold text-gray-900 mb-2">Belum Ada Aksi</h3>
			<p class="text-gray-600 mb-6">Mulai tambahkan aksi untuk melihat progress Anda</p>
			<a
				href="/user/aksi"
				class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
			>
				+ Tambah Aksi Baru
			</a>
		</div>
	{/if}
</div>
