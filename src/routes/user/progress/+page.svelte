<script lang="ts">
	import ProgressChart from '$lib/components/charts/ProgressChart.svelte';
	import MapProgress from '$lib/components/charts/MapProgress.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Sample progress data for chart
	const progressData = [
		{ date: '2024-01-01', value: 10, label: 'Januari' },
		{ date: '2024-02-01', value: 25, label: 'Februari' },
		{ date: '2024-03-01', value: 45, label: 'Maret' },
		{ date: '2024-04-01', value: 60, label: 'April' },
		{ date: '2024-05-01', value: 75, label: 'Mei' },
		{ date: '2024-06-01', value: 85, label: 'Juni' },
		{ date: '2024-07-01', value: 90, label: 'Juli' },
		{ date: '2024-08-01', value: 95, label: 'Agustus' },
	];

	// Sample actions data for map
	const actionsData = [
		{
			id: '1',
			name: 'Implementasi Sistem Monitoring',
			progress: 85,
			location: 'Jakarta Pusat',
			status: 'in_progress' as const
		},
		{
			id: '2',
			name: 'Pelatihan Staff IT',
			progress: 100,
			location: 'Jakarta Selatan',
			status: 'completed' as const
		},
		{
			id: '3',
			name: 'Upgrade Infrastruktur Jaringan',
			progress: 60,
			location: 'Jakarta Barat',
			status: 'in_progress' as const
		},
		{
			id: '4',
			name: 'Audit Keamanan Sistem',
			progress: 30,
			location: 'Jakarta Utara',
			status: 'pending' as const
		},
		{
			id: '5',
			name: 'Implementasi Backup Otomatis',
			progress: 0,
			location: 'Jakarta Timur',
			status: 'cancelled' as const
		}
	];
</script>

<svelte:head>
	<title>Progress - PEN Monitor</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-7xl mx-auto">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Progress Aksi</h1>
			<p class="text-gray-600">Pantau perkembangan dan status aksi yang sedang berjalan</p>
		</div>

		<!-- Progress Overview -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
			<div class="bg-white rounded-lg shadow-md p-6">
				<div class="flex items-center">
					<div class="p-3 bg-blue-100 rounded-full">
						<span class="text-2xl">📊</span>
					</div>
					<div class="ml-4">
						<h3 class="text-lg font-semibold text-gray-900">Total Aksi</h3>
						<p class="text-3xl font-bold text-blue-600">{actionsData.length}</p>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-md p-6">
				<div class="flex items-center">
					<div class="p-3 bg-green-100 rounded-full">
						<span class="text-2xl">✅</span>
					</div>
					<div class="ml-4">
						<h3 class="text-lg font-semibold text-gray-900">Selesai</h3>
						<p class="text-3xl font-bold text-green-600">
							{actionsData.filter(a => a.status === 'completed').length}
						</p>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-md p-6">
				<div class="flex items-center">
					<div class="p-3 bg-yellow-100 rounded-full">
						<span class="text-2xl">⚡</span>
					</div>
					<div class="ml-4">
						<h3 class="text-lg font-semibold text-gray-900">Sedang Berjalan</h3>
						<p class="text-3xl font-bold text-yellow-600">
							{actionsData.filter(a => a.status === 'in_progress').length}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Progress Chart -->
		<div class="mb-8">
			<ProgressChart data={progressData} title="Grafik Progress Bulanan" />
		</div>

		<!-- Actions Map -->
		<div class="mb-8">
			<MapProgress data={actionsData} title="Peta Progress Aksi" />
		</div>

		<!-- Recent Activities -->
		<div class="bg-white rounded-lg shadow-md p-6">
			<h2 class="text-xl font-bold text-gray-900 mb-6">Aktivitas Terbaru</h2>

			<div class="space-y-4">
				<div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
					<div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
						<span class="text-green-600">✅</span>
					</div>
					<div class="flex-1">
						<p class="text-sm font-medium text-gray-900">Pelatihan Staff IT selesai</p>
						<p class="text-xs text-gray-500">2 jam yang lalu</p>
					</div>
					<div class="text-sm font-semibold text-green-600">100%</div>
				</div>

				<div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
					<div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
						<span class="text-blue-600">🔄</span>
					</div>
					<div class="flex-1">
						<p class="text-sm font-medium text-gray-900">Progress upgrade infrastruktur meningkat</p>
						<p class="text-xs text-gray-500">5 jam yang lalu</p>
					</div>
					<div class="text-sm font-semibold text-blue-600">+15%</div>
				</div>

				<div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
					<div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
						<span class="text-yellow-600">⏳</span>
					</div>
					<div class="flex-1">
						<p class="text-sm font-medium text-gray-900">Audit keamanan sistem dimulai</p>
						<p class="text-xs text-gray-500">1 hari yang lalu</p>
					</div>
					<div class="text-sm font-semibold text-yellow-600">30%</div>
				</div>
			</div>

			<div class="mt-6 text-center">
				<button class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium">
					Lihat Semua Aktivitas
				</button>
			</div>
		</div>
	</div>
</div>