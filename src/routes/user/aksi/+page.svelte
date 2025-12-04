<script lang="ts">
	import type { PageData } from './$types';
	import UserActionPlanTable from '$lib/components/UserActionPlanTable.svelte';
	import UserAksiModal from '$lib/components/UserAksiModal.svelte';
	import { onMount } from 'svelte';

	// Types - simplified since we use data directly from API
	// type ActionPlan = { ... } // Removed as we use API data directly

	// Receive data
	export let data: PageData & { plans?: { success: boolean; data: any[]; pagination: any } };

	// Map data ke tabel - langsung gunakan data dari API tanpa mapping ulang
	$: actionPlans = data.plans?.data ?? [];

	// Get instansi_id from localStorage
	let instansiId: string | null = null;

	onMount(() => {
		// Get user data from localStorage
		const userData = localStorage.getItem("user");
		if (!userData) {
			console.error("User data tidak ditemukan di localStorage");
			return;
		}

		try {
			const user = JSON.parse(userData);
			instansiId = user.instansi_id?.toString();

			if (!instansiId) {
				console.error("Instansi ID tidak ditemukan dalam data user");
				return;
			}

			// Fetch action plans using instansi_id from localStorage
			fetchActionPlans(instansiId);
		} catch (error) {
			console.error("Error parsing user data:", error);
		}
	});

	// Fetch action plans from API
	async function fetchActionPlans(instansiId: string) {
		try {
			const response = await fetch(`/api/action-plans/instansi/${instansiId}`);
			const result = await response.json();

			if (result.success) {
				actionPlans = result.data;
			} else {
				console.error("Failed to fetch action plans:", result.error);
			}
		} catch (error) {
			console.error("Error fetching action plans:", error);
		}
	}

	// Handle edit action
	function handleEdit(updatedItem: any) {
		// Update the item in the list
		actionPlans = actionPlans.map((item: any) => 
			item.id === updatedItem.id ? updatedItem : item
		);
	}

	// Handle delete action
	function handleDelete(deletedItem: any) {
		// Remove the item from the list
		actionPlans = actionPlans.filter((item: any) => item.id !== deletedItem.id);
	}

	// Refresh data after edit/delete operations
	function handleDataChange() {
		if (instansiId) {
			fetchActionPlans(instansiId);
		}
	}

	// Modal form
	let isModalOpen = false;

	let newFormData = {
		pilar: '',
		kegiatan: '',
		output: '',
		indikator: '',
		jadwal: {
			pendek: { okt: false, nov: false, des: false },
			menengah: { tw1: false, tw2: false, tw3: false, tw4: false },
			panjang: {
				jan: false, feb: false, mar: false, apr: false, may: false, jun: false,
				jul: false, aug: false, sep: false, oct: false, nov: false, dec: false,
				"2027": false, "2028": false, "2029": false
			}
		},
		target_value: '',
		target_desc: '',
		capaian_value: '',
		capaian_desc: '',
		bukti: '',
		penjelasan: '',
		milestone: ''
	};

	function handleAdd(event: Event) {
		event.preventDefault();
		console.log('Adding new action plan:', newFormData);
		isModalOpen = false;
	}
</script>

<main class="p-6 space-y-6">
	<div class="flex justify-between items-center">
		<h1 class="text-2xl font-bold">Rencana Aksi PEN 2025</h1>
	</div>

	<UserActionPlanTable items={actionPlans} onEdit={handleDataChange} onDelete={handleDataChange} />

	<UserAksiModal
		isOpen={isModalOpen}
		on:close={() => (isModalOpen = false)}
		formData={newFormData}
		on:submit={handleAdd}
	/>
</main>
