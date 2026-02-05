<script lang="ts">
// TODO: Integrasi API dan data user/admin
import { onMount } from 'svelte';

type User = {
	id: number;
	name: string;
	email: string;
	role: string;
	// tambahkan properti lain jika diperlukan
};

let users: User[] = [];
let admins: User[] = [];

type Assignment = {
	userId: number;
	adminId: number;
	adminName: string;
};

let assignments: Assignment[] = [];
let loading = true;
let error = '';

// Pagination state
let currentPage = 1;
const pageSize = 10;
let totalPages = 1;

onMount(async () => {
	loading = true;
	try {
		// Fetch users
		const resUsers = await fetch('/api/users');
		const dataUsers = await resUsers.json();
		if (dataUsers.success) users = dataUsers.data;

		// Fetch admins (role: admin)
		admins = users.filter((u: any) => u.role === 'admin');

		// Fetch assignments (dummy, ganti dengan API jika ada)
		assignments = [];

		// Set total pages
		totalPages = Math.ceil(users.filter(u => u.role !== 'admin' && u.role !== 'super_admin').length / pageSize) || 1;
	} catch (e) {
		error = 'Gagal memuat data';
	} finally {
		loading = false;
	}
});

function assignAdmin(userId: number, adminId: number) {
	// TODO: Panggil API untuk assign admin ke user
	alert(`Assign admin ${adminId} ke user ${userId}`);
}

function goToPage(page: number) {
	if (page < 1 || page > totalPages) return;
	currentPage = page;
}
</script>

<svelte:head>
	<title>Penugasan Admin - Super Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-7xl mx-auto">
		<div class="flex justify-between items-center mb-8">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Penugasan Admin ke User/PIC</h1>
				<p class="text-gray-600">Kelola penugasan admin ke user/pic dalam sistem PEN monitoring</p>
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
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User/PIC</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Saat Ini</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign Admin</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each users.filter(u => u.role !== 'admin' && u.role !== 'super_admin').slice((currentPage-1)*pageSize, currentPage*pageSize) as user}
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name} <span class="text-xs text-gray-400">({user.email})</span></td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignments.find(a => a.userId === user.id)?.adminName || '-'}</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm">
										<select on:change={e => {
											const target = e.target as HTMLSelectElement | null;
											if (target && target.value) assignAdmin(user.id, +target.value);
										}} class="border rounded p-1">
											<option value="">Pilih Admin</option>
											{#if admins && admins.length > 0}
												{#each admins as admin (admin.id)}
													{#if admin && admin.name}
														<option value={admin.id}>{admin.name}</option>
													{/if}
												{/each}
											{/if}
										</select>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				{#if users.filter(u => u.role !== 'admin' && u.role !== 'super_admin').length === 0}
					<div class="text-center py-12">
						<div class="text-gray-400 text-6xl mb-4">🧑‍💼</div>
						<h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada user/pic</h3>
						<p class="text-gray-500 mb-4">Tambah user/pic terlebih dahulu untuk melakukan penugasan admin</p>
					</div>
				{/if}
				<!-- Pagination -->
				{#if totalPages > 1}
					<div class="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
						<button on:click={() => goToPage(currentPage-1)} class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50" disabled={currentPage === 1}>&laquo; Prev</button>
						<div class="space-x-1">
							{#each Array(totalPages) as _, i}
								<button on:click={() => goToPage(i+1)} class="px-3 py-1 rounded {currentPage === i+1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}">{i+1}</button>
							{/each}
						</div>
						<button on:click={() => goToPage(currentPage+1)} class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50" disabled={currentPage === totalPages}>Next &raquo;</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
