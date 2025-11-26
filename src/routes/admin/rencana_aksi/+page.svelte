<script lang="ts">
	import ActionPlanModal from '$lib/components/ActionPlanModal.svelte';
	import ActionPlanTable from '$lib/components/ActionPlanTable.svelte';
	import { onMount } from 'svelte';
	import { toastStore } from '$lib/stores/toastStore';

	type ActionPlan = {
		id: number;
		kegiatanId: number;
		namaKegiatan: string;
		pilarId: number;
		namaPilar: string;
		output: string;
		status: string;
		createdAt: string | null;
		updatedAt: string | null;
		actionPlanProgresses: any[];
		actionPlanSchedules: any[];
		actionPlanPics: any[];
		indikatorKeberhasilanDetails: any[];
	};
	let actionPlans: ActionPlan[] = [];

	let showModal = false;

	async function loadActionPlans() {
		try {
			const response = await fetch('/api/action-plans');
			const result = await response.json();
			
			if (result.success) {
				// Transform data to match table expectations
				actionPlans = result.data.map((item: any) => ({
					...item,
					pilar: item.namaPilar,
					kegiatan: item.namaKegiatan,
					indikator: item.indikatorKeberhasilanDetails.map((ind: any) => ind.deskripsi).join('; ') || '-',
					jadwal: item.actionPlanSchedules.length > 0 ? {
						pendek: {
							okt: item.actionPlanSchedules[0].okt || false,
							nov: item.actionPlanSchedules[0].nov || false,
							des: item.actionPlanSchedules[0].des || false
						},
						menengah: {
							tw1: item.actionPlanSchedules[0].tw1 || false,
							tw2: item.actionPlanSchedules[0].tw2 || false,
							tw3: item.actionPlanSchedules[0].tw3 || false,
							tw4: item.actionPlanSchedules[0].tw4 || false
						},
						panjang: {
							'2027': item.actionPlanSchedules[0].tahun2027 || false,
							'2028': item.actionPlanSchedules[0].tahun2028 || false,
							'2029': item.actionPlanSchedules[0].tahun2029 || false
						}
					} : {
						pendek: { okt: false, nov: false, des: false },
						menengah: { tw1: false, tw2: false, tw3: false, tw4: false },
						panjang: { '2027': false, '2028': false, '2029': false }
					}
				}));
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

	async function handleModalSubmit(event: CustomEvent) {
		try {
			const formData = event.detail;
			
			// Prepare data for API
			const apiData = {
				kegiatanId: parseInt(formData.kegiatanId),
				pics: formData.pics,
				indikatorKeberhasilan: formData.indikatorKeberhasilan,
				output: formData.output,
				jadwal: formData.jadwal
			};

			const response = await fetch('/api/action-plans', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(apiData)
			});

			const result = await response.json();

			if (result.success) {
				toastStore.success('Rencana aksi berhasil dibuat');
				showModal = false;
				// Reload data from API
				loadActionPlans();
			} else {
				throw new Error(result.error || 'Gagal menyimpan rencana aksi');
			}
		} catch (error) {
			console.error('Error creating action plan:', error);
			toastStore.error('Terjadi kesalahan saat menyimpan rencana aksi');
		}
	}

	function handleModalClose() {
		showModal = false;
	}

	function handleTableEdit(updatedItem: any) {
		// Update the item in the local array
		actionPlans = actionPlans.map(item => 
			item.id === updatedItem.id ? { ...item, ...updatedItem } : item
		);
		// Optionally reload data from API
		loadActionPlans();
	}

	function handleTableDelete(deletedItem: any) {
		// Remove the item from the local array
		actionPlans = actionPlans.filter(item => item.id !== deletedItem.id);
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

		<ActionPlanTable 
			items={actionPlans} 
			onEdit={handleTableEdit}
			onDelete={handleTableDelete}
		/>
	</div>
</div>

<ActionPlanModal
	isOpen={showModal}
	on:submit={handleModalSubmit}
	on:close={handleModalClose}
/>