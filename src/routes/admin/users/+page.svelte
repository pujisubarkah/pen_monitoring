<svelte:head>
	<title>Manajemen User - PEN Monitor</title>
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';
	import { Edit, Trash2 } from 'lucide-svelte';

	type User = {
		id: string;
		name: string;
		email: string;
		role: string;
		createdAt: string;
		updatedAt: string;
	};

	let users: User[] = [];
	let loading = true;
	let error = '';

	// Edit modal state
	let showEditModal = false;
	let editingUser: User | null = null;
	let editForm = {
		name: '',
		email: '',
		role: 'user'
	};

	// Delete confirmation state
	let showDeleteConfirm = false;
	let deletingUser: User | null = null;

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

	function openEditModal(user: User) {
		editingUser = user;
		editForm = {
			name: user.name,
			email: user.email,
			role: user.role
		};
		showEditModal = true;
	}

	async function handleEdit() {
		if (!editingUser) return;

		try {
			const response = await fetch(`/api/users/${editingUser.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(editForm),
			});

			const result = await response.json();

			if (result.success) {
				// Update user in local state
				if (editingUser && editingUser.id) {
					users = editingUser
						? users.map(u => u.id === editingUser!.id ? { ...u, ...editForm } : u)
						: users;
				}
				showEditModal = false;
				editingUser = null;
			} else {
				alert(result.message || 'Gagal memperbarui pengguna');
			}
		} catch (err) {
			console.error('Error updating user:', err);
			alert('Terjadi kesalahan saat memperbarui pengguna');
		}
	}

	function openDeleteConfirm(user: User) {
		deletingUser = user;
		showDeleteConfirm = true;
	}

	async function handleDelete() {
		if (!deletingUser) return;

		try {
			const response = await fetch(`/api/users/${deletingUser.id}`, {
				method: 'DELETE',
			});

			const result = await response.json();

			if (result.success) {
				// Remove user from local state
				if (deletingUser) {
					users = users.filter(u => deletingUser && u.id !== deletingUser.id);
				}
				showDeleteConfirm = false;
				deletingUser = null;
			} else {
				alert(result.message || 'Gagal menghapus pengguna');
			}
		} catch (err) {
			console.error('Error deleting user:', err);
			alert('Terjadi kesalahan saat menghapus pengguna');
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
									<div class="flex space-x-2">
										<button
											on:click={() => openEditModal(user)}
											class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
											title="Edit"
										>
											<Edit size={16} />
										</button>
										<button
											on:click={() => openDeleteConfirm(user)}
											class="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
											title="Hapus"
										>
											<Trash2 size={16} />
										</button>
									</div>
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

<!-- Edit User Modal -->
{#if showEditModal}
	<div class="fixed inset-0 bg-transparent flex items-center justify-center z-50">
		<div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
			<div class="p-6">
				<h3 class="text-lg font-semibold mb-4">Edit Pengguna</h3>

				<form on:submit|preventDefault={handleEdit} class="space-y-4">
					<div>
						<label for="edit-name" class="block text-sm font-medium text-gray-700 mb-1">
							Nama
						</label>
						<input
							id="edit-name"
							type="text"
							bind:value={editForm.name}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							required
						/>
					</div>

					<div>
						<label for="edit-email" class="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>
						<input
							id="edit-email"
							type="email"
							bind:value={editForm.email}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							required
						/>
					</div>

					<div>
						<label for="edit-role" class="block text-sm font-medium text-gray-700 mb-1">
							Role
						</label>
						<select
							id="edit-role"
							bind:value={editForm.role}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="user">User</option>
							<option value="admin">Admin</option>
						</select>
					</div>

					<div class="flex justify-end space-x-3 pt-4">
						<button
							type="button"
							on:click={() => { showEditModal = false; editingUser = null; }}
							class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
						>
							Batal
						</button>
						<button
							type="submit"
							class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
						>
							Simpan
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
	<div class="fixed inset-0 bg-transparent flex items-center justify-center z-50">
		<div class="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
			<div class="p-6">
				<h3 class="text-lg font-semibold mb-2">Konfirmasi Hapus</h3>
				<p class="text-gray-600 mb-6">
					Apakah Anda yakin ingin menghapus pengguna <strong>{deletingUser ? deletingUser.name : ''}</strong>?
					Tindakan ini tidak dapat dibatalkan.
				</p>

				<div class="flex justify-end space-x-3">
					<button
						on:click={() => { showDeleteConfirm = false; deletingUser = null; }}
						class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
					>
						Batal
					</button>
					<button
						on:click={handleDelete}
						class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
					>
						Hapus
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}