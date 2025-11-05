<script lang="ts">
	import ActionPlanModal from '$lib/components/ActionPlanModal.svelte';
	import ActionPlanTable from '$lib/components/ActionPlanTable.svelte';
	import { onMount } from 'svelte';

	type ActionPlan = {
		pilar: string;
		kegiatan: string;
		pic: string;
		output: string;
		indikator: string;
		jadwal: {
			jan: boolean;
			feb: boolean;
			mar: boolean;
			apr: boolean;
			may: boolean;
			jun: boolean;
			jul: boolean;
			aug: boolean;
			sep: boolean;
			oct: boolean;
			nov: boolean;
			dec: boolean;
		};
	};
	let actionPlans: ActionPlan[] = [];

	let showModal = false;

	async function loadActionPlans() {
		try {
			const response = await fetch('/api/action-plans');
			const result = await response.json();
			
			if (result.success) {
				actionPlans = result.data;
			} else {
				console.error('Failed to load action plans:', result.error);
			}
		} catch (error) {
			console.error('Error loading action plans:', error);
		}
	}

	function openModal() {
		showModal = true;
	}

	function handleModalSubmit(event: CustomEvent) {
		const newActionPlan = event.detail;
		actionPlans = [...actionPlans, newActionPlan];
		showModal = false;
		// Optionally reload data from API
		loadActionPlans();
	}

	function handleModalClose() {
		showModal = false;
	}

	onMount(() => {
		loadActionPlans();
	});
</script>

<svelte:head>
	<title>Rencana Aksi - PEN Monitor</title>
</svelte:head>

<div class="max-w-7xl mx-auto space-y-6">
	<div class="flex justify-between items-center">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Rencana Aksi</h1>
			<p class="text-gray-600 mt-2">Kelola rencana aksi Pilar Koperasi Merah Putih</p>
		</div>
		<button
			on:click={openModal}
			class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
			</svg>
			<span>Tambah Rencana Aksi</span>
		</button>
	</div>

	<div class="bg-white rounded-lg shadow-md p-6">
		<div class="mb-4">
			<h2 class="text-xl font-semibold text-gray-900">Daftar Rencana Aksi</h2>
			<p class="text-gray-600 text-sm mt-1">Total: {actionPlans.length} rencana aksi</p>
		</div>

		<ActionPlanTable items={actionPlans} />
	</div>
</div>

<ActionPlanModal
	isOpen={showModal}
	on:submit={handleModalSubmit}
	on:close={handleModalClose}
/>