<script lang="ts">
	import ActionForm from '$lib/components/forms/ActionForm.svelte';

	// Receive data from the page
	export let data: { url: string; actions?: any[] } = { url: '', actions: [] };

	let showModal = false;

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		// Reload the page to get updated actions
		window.location.reload();
	}
</script>

<svelte:head>
	<title>Daftar Aksi - PEN Monitor</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-6xl mx-auto">
		<div class="flex justify-between items-center mb-8">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Daftar Aksi</h1>
				<p class="text-gray-600">Kelola aksi yang telah dibuat</p>
			</div>
			<button
				onclick={openModal}
				class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
				</svg>
				Tambah Aksi Baru
			</button>
		</div>

		<!-- Actions Table -->
		{#if !data.actions || data.actions.length === 0}
			<div class="p-8 text-center text-gray-500">
				<div class="text-6xl mb-4">📋</div>
				<p class="text-lg">Belum ada aksi yang dibuat</p>
				<p class="text-sm">Klik tombol "Tambah Aksi Baru" untuk membuat aksi pertama</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioritas</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Tanggal</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ditugaskan Kepada</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each data.actions as action}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{action.title}
								</td>
								<td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
									{action.description || '-'}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
										action.priority === 'high' ? 'bg-red-100 text-red-800' :
										action.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
										'bg-green-100 text-green-800'
									}`}>
										{action.priority === 'high' ? 'Tinggi' : action.priority === 'medium' ? 'Sedang' : 'Rendah'}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
										action.status === 'completed' ? 'bg-green-100 text-green-800' :
										action.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
										action.status === 'cancelled' ? 'bg-red-100 text-red-800' :
										'bg-gray-100 text-gray-800'
									}`}>
										{action.status === 'completed' ? 'Selesai' :
										 action.status === 'in_progress' ? 'Dalam Proses' :
										 action.status === 'cancelled' ? 'Dibatalkan' :
										 'Pending'}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{action.targetDate ? new Date(action.targetDate).toLocaleDateString('id-ID') : '-'}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{action.assignedTo || '-'}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<!-- Modal for creating new action -->
{#if showModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
			<div class="p-6">
				<div class="flex justify-between items-center mb-6">
					<h2 class="text-2xl font-bold text-gray-900">Tambah Aksi Baru</h2>
					<button
						onclick={closeModal}
						class="text-gray-400 hover:text-gray-600"
						aria-label="Tutup modal"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>
				<ActionForm data={{}} onSuccess={closeModal} />
			</div>
		</div>
	</div>
{/if}