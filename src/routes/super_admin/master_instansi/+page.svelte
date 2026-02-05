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

<div class="container mx-auto px-4 py-8">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="flex justify-between items-center mb-8">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Master Instansi</h1>
				<p class="text-gray-600">Kelola data master instansi dalam sistem PEN monitoring</p>
			</div>
			<button
				on:click={openAddModal}
				class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2"
			>
				<span>+</span>
				<span>Tambah Instansi</span>
			</button>
		</div>

		<!-- Error Message -->
		{#if $error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
				<div class="flex items-center">
					<div class="text-red-500 text-xl mr-3">⚠️</div>
					<div>
						<h3 class="text-red-800 font-semibold">Terjadi Kesalahan</h3>
						<p class="text-red-600">{$error}</p>
						<button
							on:click={loadInstansi}
							class="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
						>
							Coba Lagi
						</button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Loading State -->
		{#if $loading}
			<div class="flex items-center justify-center py-12">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				<span class="ml-3 text-gray-600">Memuat data instansi...</span>
			</div>
		{:else}
			<!-- Instansi Table -->
			<div class="bg-white rounded-lg shadow-md overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									ID
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Nama Instansi
								</th>
								<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									Aksi
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each $instansiList as instansi}
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{instansi.instansiId}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{instansi.namaInstansi}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<div class="flex justify-end gap-2">
											<button
												on:click={() => openEditModal(instansi)}
												class="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
												title="Edit Instansi"
											>
												<Edit size={16} />
											</button>
											<button
												on:click={() => deleteInstansi(instansi)}
												class="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
												title="Hapus Instansi"
											>
												<Trash2 size={16} />
											</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Empty State -->
				{#if $instansiList.length === 0}
					<div class="text-center py-12">
						<div class="text-gray-400 text-6xl mb-4">🏢</div>
						<h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada data instansi</h3>
						<p class="text-gray-500 mb-4">Tambahkan instansi pertama untuk memulai</p>
						<button
							on:click={openAddModal}
							class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
						>
							Tambah Instansi Pertama
						</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<!-- Modal -->
{#if $showModal}
	<div
		class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
		on:click={closeModal}
		on:keydown={(e) => { if (e.key === 'Escape') closeModal(); }}
		role="dialog"
		tabindex="0"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<div
			class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			tabindex="-1"
			on:click|stopPropagation
			on:keydown|stopPropagation
		>
			<div class="mt-3">
				<h3 id="modal-title" class="text-lg font-medium text-gray-900 mb-4">
					{$modalMode === 'add' ? 'Tambah Instansi' : 'Edit Instansi'}
				</h3>

				<form on:submit|preventDefault={saveInstansi} class="space-y-4">
					<div>
						<label for="instansiId" class="block text-sm font-medium text-gray-700 mb-1">
							ID Instansi
						</label>
						<input
							id="instansiId"
							type="number"
							bind:value={$formData.instansiId}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Masukkan ID instansi"
							required
						/>
					</div>

					<div>
						<label for="namaInstansi" class="block text-sm font-medium text-gray-700 mb-1">
							Nama Instansi
						</label>
						<input
							id="namaInstansi"
							type="text"
							bind:value={$formData.namaInstansi}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Masukkan nama instansi"
							required
						/>
					</div>

					<div class="flex justify-end gap-3 mt-6">
						<button
							type="button"
							on:click={closeModal}
							class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
						>
							Batal
						</button>
						<button
							type="submit"
							class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
						>
							{$modalMode === 'add' ? 'Tambah' : 'Update'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
