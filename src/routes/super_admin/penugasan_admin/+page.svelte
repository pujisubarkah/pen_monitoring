<script lang="ts">
import { onMount } from 'svelte';
import { toastStore } from '$lib/stores/toastStore';

type Admin = {
	id: number;
	name: string;
	email: string;
	role: string;
	instansi_id: number | null;
	nama_instansi: string | null;
	assignedInstansi?: { id: number; namaInstansi: string }[]; // Multiple instansi
};

type Instansi = {
	id: number;
	namaInstansi: string;
};

let admins: Admin[] = [];
let instansiList: Instansi[] = [];
let loading = true;
let error = '';

// Modal state
let showAssignModal = false;
let selectedAdmin: Admin | null = null;
let selectedInstansiId: number | string | null = null;
let adminAssignedInstansi: { id: number; namaInstansi: string }[] = [];

// Pagination state
let currentPage = 1;
const pageSize = 10;
let totalPages = 1;

	onMount(async () => {
	loading = true;
	try {
		// Fetch all users with role admin
		const resUsers = await fetch('/api/users');
		const dataUsers = await resUsers.json();
		const adminUsers = dataUsers.data.filter((u: any) => u.role === 'admin');
			
		// Fetch assigned instansi for each admin
		for (const admin of adminUsers) {
			const resInstansiAssignments = await fetch(`/api/users/${admin.id}/instansi`);
			const dataAssignments = await resInstansiAssignments.json();
			if (dataAssignments.success) {
				admin.assignedInstansi = dataAssignments.data;
			} else {
				admin.assignedInstansi = [];
			}
		}
		
		admins = adminUsers;
		console.log('Initial admins loaded:', admins);
		totalPages = Math.ceil(admins.length / pageSize) || 1;

		// Fetch instansi list
		const resInstansi = await fetch('/api/instansi');
		const dataInstansi = await resInstansi.json();
		if (dataInstansi.success) {
			instansiList = dataInstansi.data;
		}
	} catch (e) {
		error = 'Gagal memuat data';
		console.error('Error loading data:', e);
	} finally {
		loading = false;
	}
});

function openAssignModal(admin: Admin) {
	selectedAdmin = admin;
	adminAssignedInstansi = admin.assignedInstansi || [];
	selectedInstansiId = '';
	console.log('Opening modal for admin:', admin, 'Assigned instansi:', adminAssignedInstansi);
	showAssignModal = true;
}

async function handleAddInstansi() {
	if (!selectedAdmin || !selectedInstansiId) return;

	const instansiIdToAdd = Number(selectedInstansiId);
	console.log('Adding instansi:', { adminId: selectedAdmin.id, instansiId: instansiIdToAdd });

	try {
		const response = await fetch(`/api/users/${selectedAdmin.id}/instansi`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				instansi_id: instansiIdToAdd
			}),
		});

		const result = await response.json();

		if (result.success) {
			toastStore.success('Instansi berhasil ditambahkan');
			selectedInstansiId = '';
			
			// Reload assignments for this admin
			const resInstansiAssignments = await fetch(`/api/users/${selectedAdmin.id}/instansi`);
			const dataAssignments = await resInstansiAssignments.json();
			if (dataAssignments.success) {
				adminAssignedInstansi = dataAssignments.data;
				
				// Update in admins array
				const adminIndex = admins.findIndex(a => a.id === selectedAdmin?.id);
				if (adminIndex !== -1) {
					admins[adminIndex].assignedInstansi = dataAssignments.data;
				}
			}
		} else {
			toastStore.error(result.message || 'Gagal menambahkan instansi');
		}
	} catch (err) {
		console.error('Error adding instansi:', err);
		toastStore.error('Terjadi kesalahan saat menambahkan instansi');
	}
}

async function handleRemoveInstansi(instansiId: number) {
	if (!selectedAdmin) return;

	try {
		const response = await fetch(`/api/users/${selectedAdmin.id}/instansi?instansi_id=${instansiId}`, {
			method: 'DELETE',
		});

		const result = await response.json();

		if (result.success) {
			toastStore.success('Instansi berhasil dihapus');
			
			// Remove from local state
			adminAssignedInstansi = adminAssignedInstansi.filter(i => i.id !== instansiId);
			
			// Update in admins array
			const adminIndex = admins.findIndex(a => a.id === selectedAdmin?.id);
			if (adminIndex !== -1) {
				admins[adminIndex].assignedInstansi = adminAssignedInstansi;
			}
		} else {
			toastStore.error(result.message || 'Gagal menghapus instansi');
		}
	} catch (err) {
		console.error('Error removing instansi:', err);
		toastStore.error('Terjadi kesalahan saat menghapus instansi');
	}
}

async function handleAssignSubmit() {
	if (!selectedAdmin) return;

	const instansiIdToSend = selectedInstansiId === '' || selectedInstansiId === null ? null : Number(selectedInstansiId);
	console.log('Submitting assignment:', { adminId: selectedAdmin.id, instansiId: instansiIdToSend });

	try {
		const response = await fetch(`/api/users/${selectedAdmin.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				instansi_id: instansiIdToSend
			}),
		});

		const result = await response.json();

		if (result.success) {
			toastStore.success('Penugasan admin berhasil diperbarui');
			showAssignModal = false;
			selectedAdmin = null;
			selectedInstansiId = '';
			
			// Reload data
			const resUsers = await fetch('/api/users');
			const dataUsers = await resUsers.json();
			if (dataUsers.success) {
				admins = dataUsers.data.filter((u: any) => u.role === 'admin');
				console.log('Reloaded admins:', admins);
			}
		} else {
			toastStore.error(result.message || 'Gagal memperbarui penugasan');
		}
	} catch (err) {
		console.error('Error assigning admin:', err);
		toastStore.error('Terjadi kesalahan saat memperbarui penugasan');
	}
}

function closeModal() {
	showAssignModal = false;
	selectedAdmin = null;
	selectedInstansiId = '';
}

function goToPage(page: number) {
	if (page < 1 || page > totalPages) return;
	currentPage = page;
}

$: paginatedAdmins = admins.slice((currentPage - 1) * pageSize, currentPage * pageSize);
</script>

<svelte:head>
	<title>Penugasan Admin - Super Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-7xl mx-auto">
		<div class="flex justify-between items-center mb-8">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Penugasan Admin ke Instansi</h1>
				<p class="text-gray-600">Kelola penugasan admin ke instansi tertentu dalam sistem PEN monitoring</p>
			</div>
		</div>
		{#if loading}
			<div class="flex items-center justify-center py-12">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				<span class="ml-3 text-gray-600">Memuat data penugasan...</span>
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
				<div class="flex items-center">
					<div class="text-red-500 text-xl mr-3">⚠️</div>
					<div>
						<h3 class="text-red-800 font-semibold">Terjadi Kesalahan</h3>
						<p class="text-red-600">{error}</p>
						<button on:click={() => location.reload()} class="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Coba Lagi</button>
					</div>
				</div>
			</div>
		{:else}
			<div class="bg-white rounded-lg shadow-md overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Admin</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instansi Ditugaskan</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each paginatedAdmins as admin, index}
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{(currentPage - 1) * pageSize + index + 1}
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm font-medium text-gray-900">{admin.name}</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm text-gray-500">{admin.email}</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										{#if admin.nama_instansi}
											<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
												{admin.nama_instansi}
											</span>
										{:else}
											<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
												Belum Ditugaskan
											</span>
										{/if}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button
											on:click={() => openAssignModal(admin)}
											class="text-blue-600 hover:text-blue-900"
										>
											{admin.instansi_id ? 'Ubah Penugasan' : 'Tugaskan'}
										</button>
									</td>
								</tr>
							{/each}
							{#if paginatedAdmins.length === 0}
								<tr>
									<td colspan="5" class="px-6 py-4 text-center text-gray-500">
										Tidak ada admin yang tersedia
									</td>
								</tr>
							{/if}
						</tbody>
					</table>
				</div>

				<!-- Pagination -->
				{#if totalPages > 1}
					<div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
						<div class="flex-1 flex justify-between sm:hidden">
							<button
								on:click={() => goToPage(currentPage - 1)}
								disabled={currentPage === 1}
								class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
							>
								Previous
							</button>
							<button
								on:click={() => goToPage(currentPage + 1)}
								disabled={currentPage === totalPages}
								class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
							>
								Next
							</button>
						</div>
						<div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
							<div>
								<p class="text-sm text-gray-700">
									Showing <span class="font-medium">{(currentPage - 1) * pageSize + 1}</span> to 
									<span class="font-medium">{Math.min(currentPage * pageSize, admins.length)}</span> of 
									<span class="font-medium">{admins.length}</span> results
								</p>
							</div>
							<div>
								<nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
									<button
										on:click={() => goToPage(currentPage - 1)}
										disabled={currentPage === 1}
										class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
									>
										Previous
									</button>
									{#each Array(totalPages) as _, i}
										<button
											on:click={() => goToPage(i + 1)}
											class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium {currentPage === i + 1 ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}"
										>
											{i + 1}
										</button>
									{/each}
									<button
										on:click={() => goToPage(currentPage + 1)}
										disabled={currentPage === totalPages}
										class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
									>
										Next
									</button>
								</nav>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<!-- Assignment Modal -->
{#if showAssignModal && selectedAdmin}
	<div 
		class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-20" 
		on:click={closeModal}
		on:keydown={(e) => e.key === 'Escape' && closeModal()}
		role="button"
		tabindex="0"
	>
		<div class="w-full max-w-2xl shadow-xl rounded-lg bg-white" 
			on:click|stopPropagation
			on:keydown|stopPropagation={(e) => e.key === 'Escape' && closeModal()}
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<div>
				<h3 id="modal-title" class="text-lg font-semibold leading-6 text-gray-900 mb-4">
					Kelola Penugasan Admin ke Instansi
				</h3>
				<div class="mb-6">
					<p class="text-sm text-gray-600 mb-1">Admin: <span class="font-semibold">{selectedAdmin.name}</span></p>
					<p class="text-sm text-gray-600 mb-4">Email: <span class="font-semibold">{selectedAdmin.email}</span></p>
					
					<!-- Current Assignments -->
					<fieldset class="mb-4">
						<legend class="block text-sm font-medium text-gray-700 mb-2">Instansi yang Ditugaskan:</legend>
						{#if adminAssignedInstansi.length > 0}
							<div class="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
								{#each adminAssignedInstansi as inst}
									<div class="flex items-center justify-between bg-green-50 rounded-lg p-2">
										<span class="text-sm font-medium text-green-800">{inst.namaInstansi}</span>
										<button
											on:click={() => handleRemoveInstansi(inst.id)}
											class="text-red-600 hover:text-red-800 text-xs font-medium"
										>
											Hapus
										</button>
									</div>
								{/each}
							</div>
						{:else}
							<p class="text-sm text-gray-500 italic bg-gray-50 rounded-lg p-3">Belum ada instansi yang ditugaskan</p>
						{/if}
					</fieldset>

					<!-- Add New Assignment -->
					<div class="border-t border-gray-200 pt-4">
						<label for="instansi-select" class="block text-sm font-medium text-gray-700 mb-2">Tambah Instansi Baru:</label>
						<div class="flex gap-2">
							<select
								id="instansi-select"
								bind:value={selectedInstansiId}
								class="flex-1 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white"
							>
								<option value="">-- Pilih Instansi --</option>
								{#each instansiList.filter(inst => !adminAssignedInstansi.some(ai => ai.id === inst.id)) as instansi}
									<option value={instansi.id}>{instansi.namaInstansi}</option>
								{/each}
							</select>
							<button
								type="button"
								on:click|stopPropagation={handleAddInstansi}
								disabled={!selectedInstansiId}
								class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Tambah
							</button>
						</div>
					</div>
				</div>
				<div class="flex justify-end gap-3 border-t border-gray-200 pt-4">
					<button
						type="button"
						on:click|stopPropagation={closeModal}
						class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
					>
						Tutup
					</button>
					<button
						type="button"
						on:click|stopPropagation={handleAssignSubmit}
						class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						Simpan
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
