<script lang="ts">
	import type { PageData } from './$types';
	import AksiModal from '$lib/components/AksiModal.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Edit, Trash2 } from 'lucide-svelte';

	// =====================================
	// Types
	// =====================================
	type ProgressItem = {
		id: number;
		pilar: string;
		kegiatan: string;
		target_value: number;
		target_desc: string | null;
		milestone: string | null;
		capaian_value: number;
		capaian_desc: string | null;
		bukti: string | null;
		penjelasan: string | null;
		created_at: string | null;
	};

	// =====================================
	// State
	// =====================================
	let progressData: ProgressItem[] = [];
	let isModalOpen = false;
	let isEditMode = false;
	let editingItem: ProgressItem | null = null;

	let newFormData = {
		pilar: '',
		kegiatan: '',
		target_value: '',
		target_desc: '',
		capaian_value: '',
		capaian_desc: '',
		bukti: '',
		penjelasan: '',
		milestone: ''
	};

	// =====================================
	// GET actionPlanId dari URL parameter
	// =====================================
	let actionPlanId: string | null = null;
	let instansiId: string | null = null;
	
	onMount(() => {
		// Get actionPlanId from URL query parameter
		const urlParams = new URLSearchParams($page.url.search);
		actionPlanId = urlParams.get('actionPlanId');

		// Get instansiId from localStorage (as before)
		const userData = localStorage.getItem("user");
		if (userData) {
			try {
				const user = JSON.parse(userData);
				instansiId = user.instansi_id?.toString();
			} catch (error) {
				console.error("Error parsing user data:", error);
			}
		}

		if (actionPlanId && instansiId) {
			fetchProgress(instansiId);
		} else {
			console.error("Action Plan ID atau Instansi ID tidak ditemukan");
		}
	});

	// =====================================
	// Fetch Data dari API
	// =====================================
	// Fetch Data dari API
	// =====================================
	async function fetchProgress(id: string) {
		try {
			const res = await fetch(`/api/action_plan_progress/${id}`);
			const json = await res.json();

			if (!json.success) {
				console.error("Gagal load data progress");
				return;
			}

			// Filter data berdasarkan actionPlanId jika ada
			let filteredData = json.data;
			if (actionPlanId) {
				filteredData = json.data.filter((item: any) => 
					item.actionPlanPic?.actionPlansId?.toString() === actionPlanId
				);
			}

			progressData = filteredData.map((item: any) => ({
				id: item.id,
				pilar: item.pilar?.nama_pilar || '-',
				kegiatan: item.kegiatan?.namaKegiatan || '-',

				target_value: item.target ?? 0,
				target_desc: '',

				milestone: 'Belum Ada',
				capaian_value: item.capaian ?? 0,
				capaian_desc: '',
				bukti: item.bukti,
				penjelasan: item.penjelasan,
				created_at: item.createdAt
			}));
		} catch (err) {
			console.error("Error fetching progress:", err);
		}
	}

	// =====================================
	// Submit Add (sementara hanya local)
	// =====================================
	function handleAdd(event: Event) {
		event.preventDefault();

		const newItem: ProgressItem = {
			id: progressData.length + 1,
			pilar: newFormData.pilar,
			kegiatan: newFormData.kegiatan,
			target_value: parseInt(newFormData.target_value) || 0,
			target_desc: newFormData.target_desc,
			milestone: newFormData.milestone,
			capaian_value: parseInt(newFormData.capaian_value) || 0,
			capaian_desc: newFormData.capaian_desc,
			bukti: newFormData.bukti,
			penjelasan: newFormData.penjelasan,
			created_at: new Date().toISOString().split('T')[0]
		};

		progressData = [...progressData, newItem];
		isModalOpen = false;

		resetForm();
	}

	// =====================================
	// Edit Progress
	// =====================================
	function handleEdit(item: ProgressItem) {
		isEditMode = true;
		editingItem = item;
		
		newFormData = {
			pilar: item.pilar,
			kegiatan: item.kegiatan,
			target_value: item.target_value.toString(),
			target_desc: item.target_desc || '',
			capaian_value: item.capaian_value.toString(),
			capaian_desc: item.capaian_desc || '',
			bukti: item.bukti || '',
			penjelasan: item.penjelasan || '',
			milestone: item.milestone || ''
		};

		isModalOpen = true;
	}

	// =====================================
	// Update Progress
	// =====================================
	async function handleUpdate(event: Event) {
		event.preventDefault();
		
		if (!editingItem || !instansiId) return;

		try {
			const updateData = {
				id: editingItem.id,
				actionPlanPicId: editingItem.id, // This should be the actual actionPlanPicId
				target: parseInt(newFormData.target_value) || 0,
				capaian: parseInt(newFormData.capaian_value) || 0,
				bukti: newFormData.bukti,
				penjelasan: newFormData.penjelasan,
			};

			const res = await fetch(`/api/action_plan_progress/${instansiId}?id=${editingItem.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updateData),
			});

			const json = await res.json();

			if (json.success) {
				// Update local data
				progressData = progressData.map(item => 
					item.id === editingItem!.id 
						? { ...item, 
							target_value: parseInt(newFormData.target_value) || 0,
							capaian_value: parseInt(newFormData.capaian_value) || 0,
							bukti: newFormData.bukti,
							penjelasan: newFormData.penjelasan
						}
						: item
				);
				isModalOpen = false;
				resetForm();
			} else {
				console.error("Gagal update progress:", json.error);
			}
		} catch (error) {
			console.error("Error updating progress:", error);
		}
	}

	// =====================================
	// Delete Progress
	// =====================================
	async function handleDelete(item: ProgressItem) {
		if (!instansiId) return;
		
		if (!confirm('Apakah Anda yakin ingin menghapus progress ini?')) {
			return;
		}

		try {
			const res = await fetch(`/api/action_plan_progress/${instansiId}?id=${item.id}`, {
				method: 'DELETE',
			});

			const json = await res.json();

			if (json.success) {
				// Remove from local data
				progressData = progressData.filter(p => p.id !== item.id);
			} else {
				console.error("Gagal delete progress:", json.error);
			}
		} catch (error) {
			console.error("Error deleting progress:", error);
		}
	}

	// =====================================
	// Reset Form
	// =====================================
	function resetForm() {
		newFormData = {
			pilar: '',
			kegiatan: '',
			target_value: '',
			target_desc: '',
			capaian_value: '',
			capaian_desc: '',
			bukti: '',
			penjelasan: '',
			milestone: ''
		};
		isEditMode = false;
		editingItem = null;
	}
</script>

<main class="p-6 space-y-6">
	<div class="flex justify-between items-center">
		<h1 class="text-2xl font-bold">Progress PEN 2025</h1>
	</div>

	<!-- Progress Table -->
	<div class="overflow-x-auto bg-white rounded-lg shadow">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-6 py-3">Pilar</th>
					<th class="px-6 py-3">Kegiatan/Aksi</th>
					<th class="px-6 py-3">Target</th>
					<th class="px-6 py-3">Milestone</th>
					<th class="px-6 py-3">Capaian</th>
					<th class="px-6 py-3">Bukti</th>
					<th class="px-6 py-3">Penjelasan</th>
					<th class="px-6 py-3">Aksi</th>
				</tr>
			</thead>

			<tbody class="bg-white divide-y divide-gray-200">
				{#each progressData as item}
					<tr class="hover:bg-gray-50">
						<td class="px-6 py-4">{item.pilar}</td>
						<td class="px-6 py-4">{item.kegiatan}</td>

						<td class="px-6 py-4">
							<div class="font-semibold text-blue-600">{item.target_value}</div>
						</td>

						<td class="px-6 py-4">
							<span class="inline-flex px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
								{item.milestone}
							</span>
						</td>

						<td class="px-6 py-4">
							<div class="font-semibold text-green-600">{item.capaian_value}</div>

							<div class="w-full bg-gray-200 rounded-full h-2 mt-1">
								<div
									class="bg-green-600 h-2 rounded-full"
									style="width: {item.target_value > 0
										? (item.capaian_value / item.target_value) * 100
										: 0}%"
								></div>
							</div>
						</td>

						<td class="px-6 py-4">
							{#if item.bukti}
								<a class="text-blue-600 underline" href={item.bukti} target="_blank">Lihat</a>
							{:else}
								-
							{/if}
						</td>

						<td class="px-6 py-4 max-w-xs truncate" title={item.penjelasan}>
							{item.penjelasan || '-'}
						</td>

						<td class="px-6 py-4">
							<div class="flex space-x-2">
								<button
									on:click={() => handleEdit(item)}
									class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
									title="Edit"
								>
									<Edit size={16} />
								</button>
								<button
									on:click={() => handleDelete(item)}
									class="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
									title="Delete"
								>
									<Trash2 size={16} />
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		{#if progressData.length === 0}
			<div class="text-center py-12 text-gray-500">
				Belum ada data progress
			</div>
		{/if}
	</div>

	<AksiModal
		isOpen={isModalOpen}
		on:close={() => {
			isModalOpen = false;
			resetForm();
		}}
		formData={newFormData}
		on:submit={isEditMode ? handleUpdate : handleAdd}
		isEdit={isEditMode}
	/>
</main>
