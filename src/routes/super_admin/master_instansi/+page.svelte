<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { Edit, Trash2 } from 'lucide-svelte';

	interface Instansi {
		id: number;
		instansiId: number;
		namaInstansi: string;
	}

	let instansiList = writable<Instansi[]>([]);
	let loading = writable(false);
	let error = writable('');
	let showModal = writable(false);
	let modalMode = writable<'add' | 'edit'>('add');

	let currentInstansi = writable<Instansi | null>(null);

	// Form data
	let formData = writable({
		instansiId: '',
		namaInstansi: ''
	});

	// Load instansi data
	async function loadInstansi() {
		loading.set(true);
		error.set('');

		try {
			const response = await fetch('/api/instansi');
			const result = await response.json();

			if (result.success) {
				instansiList.set(result.data);
			} else {
				error.set(result.message || 'Gagal memuat data instansi');
			}
		} catch (err) {
			error.set('Terjadi kesalahan saat memuat data');
			console.error('Error loading instansi:', err);
		} finally {
			loading.set(false);
		}
	}

	// Open add modal
	function openAddModal() {
		modalMode.set('add');
		formData.set({
			instansiId: '',
			namaInstansi: ''
		});
		showModal.set(true);
	}

	// Open edit modal
	function openEditModal(instansi: Instansi) {
		modalMode.set('edit');
		currentInstansi.set(instansi);
		formData.set({
			instansiId: instansi.instansiId.toString(),
			namaInstansi: instansi.namaInstansi
		});
		showModal.set(true);
	}

	// Close modal
	function closeModal() {
		showModal.set(false);
		currentInstansi.set(null);
		formData.set({
			instansiId: '',
			namaInstansi: ''
		});
	}

	// Save instansi (add or edit)
	async function saveInstansi() {
		const data = $formData;
		const mode = $modalMode;

		if (!data.instansiId.trim() || !data.namaInstansi.trim()) {
			alert('Semua field harus diisi');
			return;
		}

		const payload = {
			instansiId: parseInt(data.instansiId),
			namaInstansi: data.namaInstansi.trim()
		};

		try {
			let response;
			if (mode === 'add') {
				response = await fetch('/api/instansi', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload)
				});
			} else {
				const instansi = $currentInstansi;
				if (!instansi) return;

				response = await fetch(`/api/instansi/${instansi.id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload)
				});
			}

			const result = await response.json();

			if (result.success) {
				closeModal();
				loadInstansi();
				alert(mode === 'add' ? 'Instansi berhasil ditambahkan' : 'Instansi berhasil diupdate');
			} else {
				alert(result.message || 'Terjadi kesalahan');
			}
		} catch (err) {
			console.error('Error saving instansi:', err);
			alert('Terjadi kesalahan saat menyimpan data');
		}
	}

	// Delete instansi
	async function deleteInstansi(instansi: Instansi) {
		if (!confirm(`Apakah Anda yakin ingin menghapus instansi "${instansi.namaInstansi}"?`)) {
			return;
		}

		try {
			const response = await fetch(`/api/instansi/${instansi.id}`, {
				method: 'DELETE'
			});

			const result = await response.json();

			if (result.success) {
				loadInstansi();
				alert('Instansi berhasil dihapus');
			} else {
				alert(result.message || 'Terjadi kesalahan');
			}
		} catch (err) {
			console.error('Error deleting instansi:', err);
			alert('Terjadi kesalahan saat menghapus data');
		}
	}

	onMount(() => {
		loadInstansi();
	});
</script>

<svelte:head>
	<title>Master Instansi - Admin Panel</title>
</svelte:head>

<div class="bg-white min-h-screen">
	<div class="container mx-auto px-4 py-8">
		<div class="max-w-7xl mx-auto">
			<!-- Header with enhanced design -->
			<div class="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
				<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
					<div class="flex items-center gap-4">
						<div class="p-3 bg-linear-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
							<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
							</svg>
						</div>
						<div>
							<h1 class="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">Master Instansi</h1>
							<p class="text-gray-600 text-lg">Kelola data master instansi dalam sistem PEN monitoring</p>
						</div>
					</div>
					<button
						on:click={openAddModal}
						class="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
						</svg>
						<span>Tambah Instansi</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Error Message with enhanced design -->
		{#if $error}
			<div class="bg-linear-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 mb-8 shadow-lg">
				<div class="flex items-center gap-4">
					<div class="p-3 bg-red-100 rounded-full">
						<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
						</svg>
					</div>
					<div class="flex-1">
						<h3 class="text-red-800 font-bold text-lg mb-1">Terjadi Kesalahan</h3>
						<p class="text-red-700 mb-4">{$error}</p>
						<button
							on:click={loadInstansi}
							class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
						>
							Coba Lagi
						</button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Loading State with enhanced design -->
		{#if $loading}
			<div class="bg-white rounded-2xl shadow-xl p-12 mb-8 border border-gray-100">
				<div class="flex flex-col items-center justify-center">
					<div class="relative">
						<div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
						<div class="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin animation-delay-75"></div>
					</div>
					<span class="mt-6 text-gray-600 font-medium text-lg">Memuat data instansi...</span>
					<div class="mt-4 flex space-x-1">
						<div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
						<div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-100"></div>
						<div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-200"></div>
					</div>
				</div>
			</div>
		{:else}
			<!-- Instansi Table with enhanced design -->
			<div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
				<div class="bg-linear-to-r from-blue-600 to-indigo-600 p-6">
					<h3 class="text-white text-xl font-bold flex items-center gap-3">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
						</svg>
						Daftar Instansi ({$instansiList.length})
					</h3>
				</div>
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
									<div class="flex items-center gap-2">
										<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
										</svg>
										ID Instansi
									</div>
								</th>
								<th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
									<div class="flex items-center gap-2">
										<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
										</svg>
										Nama Instansi
									</div>
								</th>
								<th class="px-8 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
									<div class="flex items-center justify-end gap-2">
										<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
										</svg>
										Aksi
									</div>
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-100">
							{#each $instansiList as instansi, index}
								<tr class="hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors duration-200">
									<td class="px-8 py-6 whitespace-nowrap">
										<div class="flex items-center">
											<div class="shrink-0 w-10 h-10 bg-linear-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
												<span class="text-white font-bold text-sm">{instansi.instansiId}</span>
											</div>
											<div class="ml-4">
												<div class="text-sm font-semibold text-gray-900">{instansi.instansiId}</div>
												<div class="text-sm text-gray-500">ID Instansi</div>
											</div>
										</div>
									</td>
									<td class="px-8 py-6 whitespace-nowrap">
										<div class="text-sm font-medium text-gray-900">{instansi.namaInstansi}</div>
										<div class="text-sm text-gray-500">Instansi #{index + 1}</div>
									</td>
									<td class="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
										<div class="flex justify-end gap-3">
											<button
												on:click={() => openEditModal(instansi)}
												class="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg hover:shadow-md transition-all duration-200 transform hover:scale-110"
												title="Edit Instansi"
											>
												<Edit size={18} />
											</button>
											<button
												on:click={() => deleteInstansi(instansi)}
												class="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg hover:shadow-md transition-all duration-200 transform hover:scale-110"
												title="Hapus Instansi"
											>
												<Trash2 size={18} />
											</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Empty State with enhanced design -->
				{#if $instansiList.length === 0}
					<div class="text-center py-16 px-8">
						<div class="relative mb-8">
							<div class="w-24 h-24 bg-linear-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
								</svg>
							</div>
							<div class="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
								<span class="text-white text-sm font-bold">+</span>
							</div>
						</div>
						<h3 class="text-2xl font-bold text-gray-900 mb-3">Belum ada data instansi</h3>
						<p class="text-gray-500 mb-8 text-lg max-w-md mx-auto">Tambahkan instansi pertama untuk memulai mengelola data master instansi dalam sistem</p>
						<button
							on:click={openAddModal}
							class="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center gap-3"
						>
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
							</svg>
							Tambah Instansi Pertama
						</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.animation-delay-75 {
		animation-delay: 0.075s;
	}
	.animation-delay-100 {
		animation-delay: 0.1s;
	}
	.animation-delay-200 {
		animation-delay: 0.2s;
	}
</style>

<!-- Enhanced Modal -->
{#if $showModal}
	<div
		class="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
		on:click={closeModal}
		on:keydown={(e) => { if (e.key === 'Escape') closeModal(); }}
		role="dialog"
		tabindex="0"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<div
			class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			tabindex="-1"
			on:click|stopPropagation
			on:keydown|stopPropagation
		>
			<!-- Modal Header -->
			<div class="bg-linear-to-r from-blue-600 to-indigo-600 p-6 rounded-t-3xl">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="p-2 bg-white bg-opacity-20 rounded-xl">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
							</svg>
						</div>
						<h3 id="modal-title" class="text-xl font-bold text-white">
							{$modalMode === 'add' ? 'Tambah Instansi Baru' : 'Edit Instansi'}
						</h3>
					</div>
					<button
						on:click={closeModal}
						class="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors duration-200"
						aria-label="Tutup modal"
					>
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>
			</div>

			<!-- Modal Body -->
			<div class="p-6">
				<form on:submit|preventDefault={saveInstansi} class="space-y-6">
					<div>
						<label for="instansiId" class="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
							<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
							</svg>
							ID Instansi <span class="text-red-500">*</span>
						</label>
						<input
							id="instansiId"
							type="number"
							bind:value={$formData.instansiId}
							class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
							placeholder="Masukkan ID instansi"
							required
						/>
					</div>

					<div>
						<label for="namaInstansi" class="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
							<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
							</svg>
							Nama Instansi <span class="text-red-500">*</span>
						</label>
						<input
							id="namaInstansi"
							type="text"
							bind:value={$formData.namaInstansi}
							class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
							placeholder="Masukkan nama instansi"
							required
						/>
					</div>

					<div class="flex justify-end gap-4 pt-4 border-t border-gray-100">
						<button
							type="button"
							on:click={closeModal}
							class="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 transition-all duration-200"
						>
							Batal
						</button>
						<button
							type="submit"
							class="px-6 py-3 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 border border-transparent rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
						>
							{$modalMode === 'add' ? 'Tambah Instansi' : 'Update Instansi'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
