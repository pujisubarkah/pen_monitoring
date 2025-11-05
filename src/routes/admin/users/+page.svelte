<svelte:head>
	<title>Manajemen User - PEN Monitor</title>
</svelte:head>

<script>
	import { onMount } from 'svelte';

	/** @type {Array<{id: string, name: string, email: string, role: string, createdAt: string, updatedAt: string}>} */
	let users = [];
	let loading = true;
	let error = '';

	async function fetchUsers() {
		try {
			loading = true;
			error = '';

			const response = await fetch('/api/users');

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();

			if (result.success) {
				users = result.data;
			} else {
				throw new Error('Failed to fetch users');
			}
		} catch (err) {
			console.error('Error fetching users:', err);
			error = 'Gagal memuat data pengguna';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		fetchUsers();
	});
</script>

<div class="max-w-6xl space-y-6">
	<div>
		<h1 class="text-3xl font-bold text-gray-900">Manajemen User</h1>
		<p class="text-gray-600 mt-2">Kelola pengguna sistem monitoring</p>
	</div>

	<div class="bg-white rounded-lg shadow-md p-6">
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-xl font-semibold">Daftar User</h2>
			<button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
				Tambah User
			</button>
		</div>

		{#if loading}
			<div class="text-center py-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
				<p class="text-gray-600 mt-2">Memuat data...</p>
			</div>
		{:else if error}
			<div class="text-center py-8">
				<div class="text-red-600 mb-2">⚠️ {error}</div>
				<button
					on:click={fetchUsers}
					class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
				>
					Coba Lagi
				</button>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full table-auto">
					<thead>
						<tr class="bg-gray-50">
							<th class="px-4 py-2 text-left">Nama</th>
							<th class="px-4 py-2 text-left">Email</th>
							<th class="px-4 py-2 text-left">Role</th>
							<th class="px-4 py-2 text-left">Status</th>
							<th class="px-4 py-2 text-left">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each users as user (user.id)}
							<tr class="border-t hover:bg-gray-50">
								<td class="px-4 py-2">{user.name}</td>
								<td class="px-4 py-2">{user.email}</td>
								<td class="px-4 py-2 capitalize">{user.role}</td>
								<td class="px-4 py-2">
									<span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Aktif</span>
								</td>
								<td class="px-4 py-2">
									<button class="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
									<button class="text-red-600 hover:text-red-800">Hapus</button>
								</td>
							</tr>
						{/each}
						{#if users.length === 0}
							<tr>
								<td colspan="5" class="px-4 py-8 text-center text-gray-500">
									Tidak ada data pengguna
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>