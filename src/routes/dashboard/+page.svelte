<script lang="ts">
	import StatCard from '$lib/components/cards/StatCard.svelte';
	import ProgressChart from '$lib/components/charts/ProgressChart.svelte';
	import RadarChart from '$lib/components/charts/RadarChart.svelte';
	import ActionCard from '$lib/components/cards/ActionCard.svelte';
	
	// Sample data - in real app, this would come from API
	const stats = [
		{
			title: 'Total Aksi',
			value: '24',
			icon: '📋',
			color: 'blue' as const,
			trend: 'up' as const,
			trendValue: '+3'
		},
		{
			title: 'Progress Rata-rata',
			value: '78%',
			icon: '📈',
			color: 'green' as const,
			trend: 'up' as const,
			trendValue: '+5%'
		},
		{
			title: 'Target Tercapai',
			value: '16',
			icon: '✅',
			color: 'green' as const,
			trend: 'up' as const,
			trendValue: '+2'
		},
		{
			title: 'Terlambat',
			value: '3',
			icon: '⚠️',
			color: 'red' as const,
			trend: 'down' as const,
			trendValue: '-1'
		}
	];
	
	const progressData = [
		{ date: '2024-01-01', value: 20, label: 'Jan' },
		{ date: '2024-02-01', value: 35, label: 'Feb' },
		{ date: '2024-03-01', value: 55, label: 'Mar' },
		{ date: '2024-04-01', value: 68, label: 'Apr' },
		{ date: '2024-05-01', value: 78, label: 'May' }
	];
	
	const radarData = [
		{ label: 'Kualitas', value: 85 },
		{ label: 'Kecepatan', value: 72 },
		{ label: 'Efisiensi', value: 90 },
		{ label: 'Inovasi', value: 65 },
		{ label: 'Kolaborasi', value: 88 }
	];
	
	const recentActions = [
		{
			id: '1',
			title: 'Implementasi Sistem Monitoring',
			description: 'Membuat dashboard untuk monitoring real-time',
			target_date: '2024-12-31',
			priority: 'high' as const,
			status: 'in_progress' as const,
			assigned_to: 'John Doe',
			progress: 75,
			created_at: '2024-11-01T08:00:00Z'
		},
		{
			id: '2',
			title: 'Training Karyawan',
			description: 'Pelatihan penggunaan sistem baru',
			target_date: '2024-11-15',
			priority: 'medium' as const,
			status: 'completed' as const,
			assigned_to: 'Jane Smith',
			progress: 100,
			created_at: '2024-10-15T10:30:00Z'
		},
		{
			id: '3',
			title: 'Review Proses Bisnis',
			description: 'Evaluasi dan optimisasi proses',
			target_date: '2024-11-30',
			priority: 'medium' as const,
			status: 'pending' as const,
			assigned_to: 'Bob Wilson',
			progress: 0,
			created_at: '2024-11-02T14:00:00Z'
		}
	];
</script>

<svelte:head>
	<title>Dashboard - Pen Monitoring</title>
</svelte:head>

<div class="space-y-8">
	<!-- Page Header -->
	<div class="flex justify-between items-center">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
			<p class="text-gray-600 mt-2">Ringkasan progress dan statistik monitoring</p>
		</div>
		<div class="flex space-x-4">
			<a 
				href="/dashboard/aksi" 
				class="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700"
			>
				+ Tambah Aksi
			</a>
		</div>
	</div>

	<!-- Statistics Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		{#each stats as stat}
			<StatCard {...stat} />
		{/each}
	</div>

	<!-- Charts Section -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<ProgressChart data={progressData} title="Trend Progress Bulanan" />
		<RadarChart data={radarData} title="Performance Radar" />
	</div>

	<!-- Recent Actions -->
	<div class="bg-white rounded-lg shadow-md p-6">
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-xl font-bold text-gray-900">Aksi Terbaru</h2>
			<a href="/dashboard/aksi" class="text-blue-600 hover:text-blue-800 font-medium">
				Lihat Semua →
			</a>
		</div>
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each recentActions as action}
				<ActionCard 
					{action}
					onEdit={(id) => console.log('Edit', id)}
					onDelete={(id) => console.log('Delete', id)}
					onEvaluate={(id) => console.log('Evaluate', id)}
				/>
			{/each}
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
		<h2 class="text-xl font-bold mb-4">Quick Actions</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<a 
				href="/dashboard/aksi" 
				class="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-all"
			>
				<div class="text-2xl mb-2">📝</div>
				<h3 class="font-semibold">Buat Aksi Baru</h3>
				<p class="text-sm opacity-90">Tambah aksi monitoring baru</p>
			</a>
			
			<a 
				href="/dashboard/evaluasi" 
				class="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-all"
			>
				<div class="text-2xl mb-2">📊</div>
				<h3 class="font-semibold">Evaluasi Progress</h3>
				<p class="text-sm opacity-90">Update progress dan evaluasi</p>
			</a>
			
			<a 
				href="/dashboard/data" 
				class="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-all"
			>
				<div class="text-2xl mb-2">📈</div>
				<h3 class="font-semibold">Lihat Data</h3>
				<p class="text-sm opacity-90">Analisis data dan laporan</p>
			</a>
		</div>
	</div>
</div>