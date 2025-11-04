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
</script>

<svelte:head>
	<title>Evaluasi - Pen Monitoring</title>
</svelte:head>

<div class="space-y-8">
	<!-- Page Header -->
	<div class="flex justify-between items-center">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Evaluasi Progress</h1>
			<p class="text-gray-600 mt-2">Evaluasi dan update progress aksi</p>
		</div>
		<a 
			href="/dashboard" 
			class="bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700"
		>
			← Kembali ke Dashboard
		</a>
	</div>

	<!-- Progress Overview -->
	<MapProgress data={actionsData} title="Overview Progress Aksi" />

	<!-- Action Selector -->
	<div class="bg-white rounded-lg shadow-md p-6">
		<h2 class="text-xl font-bold text-gray-900 mb-4">Pilih Aksi untuk Evaluasi</h2>
		<select 
			bind:value={selectedActionId}
			class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
		>
			{#each actionsData.filter(action => action.status !== 'completed') as action}
				<option value={action.id}>{action.name} - {action.progress}%</option>
			{/each}
		</select>
	</div>

	<!-- Evaluation Form -->
	<EvaluationForm actionId={selectedActionId} />
</div>