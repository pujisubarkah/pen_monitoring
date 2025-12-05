<svelte:head>
	<title>Manajemen User - PEN Monitor</title>
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';
	import { Edit, Trash2, Search, Plus, Users, Shield, UserCheck } from 'lucide-svelte';
	import { toastStore } from '$lib/stores/toastStore';
	import StatCard from '$lib/components/cards/StatCard.svelte';

	type User = {
		id: number;
		name: string;
		email: string;
		role: string;
		is_active: boolean;
		is_verified: boolean;
		nama_instansi?: string | null;
		created_at: string;
		updated_at: string;
	};

	type Stat = {
		title: string;
		value: number;
		subtitle: string;
		icon: string;
		color: 'blue' | 'red' | 'green' | 'yellow';
	};

	let users = $state<User[]>([]);
	let loading = $state(true);
	let error = $state('');
	let searchQuery = $state('');

	// Computed stats
	let stats = $state<Stat[]>([]);

	// Filtered users based on search
	let filteredUsers = $state<User[]>([]);

	$effect(() => {
		stats = [
			{
				title: 'Total Pengguna',
				value: users.length,
				subtitle: 'Pengguna terdaftar',
				icon: '👥',
				color: 'blue'
			},
			{
				title: 'Administrator',
				value: users.filter(u => u.role === 'admin').length,
				subtitle: 'Pengguna admin',
				icon: '🛡️',
				color: 'red'
			},
			{
				title: 'Terverifikasi',
				value: users.filter(u => u.is_verified).length,
				subtitle: 'Akun terverifikasi',
				icon: '✅',
				color: 'green'
			},
			{
				title: 'Belum Verifikasi',
				value: users.length - users.filter(u => u.is_verified).length,
				subtitle: 'Menunggu verifikasi',
				icon: '⏳',
				color: 'yellow'
			}
		];
	});

	$effect(() => {
		if (!searchQuery) {
			filteredUsers = users;
		} else {
			const query = searchQuery.toLowerCase();
			filteredUsers = users.filter((user: User) =>
				user.name.toLowerCase().includes(query) ||
				user.email.toLowerCase().includes(query) ||
				user.role.toLowerCase().includes(query) ||
				(user.nama_instansi && user.nama_instansi.toLowerCase().includes(query))
			);
		}
	});

	// Edit modal state
	let showEditModal = $state(false);
	let editingUser = $state<User | null>(null);
	let editForm = $state({
		name: '',
		email: '',
		role: 'user'
	});

	// Delete modal state
	let showDeleteConfirm = $state(false);
	let deletingUser = $state<User | null>(null);

	// Profile modal state
	let showProfileModal = $state(false);
	let selectedUser = $state<User | null>(null);
	let userProfile = $state<any>(null);
	let profileLoading = $state(false);

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

	async function verifyUser(user: User) {
		// Show confirmation dialog
		const isCurrentlyVerified = user.is_verified;
		const action = isCurrentlyVerified ? 'membatalkan verifikasi' : 'memverifikasi';
		const confirmMessage = `Apakah Anda yakin akan ${action} akun ${user.name}?`;

		if (!confirm(confirmMessage)) {
			return;
		}

		try {
			const response = await fetch(`/api/users/${user.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ is_verified: !user.is_verified }),
			});
			const result = await response.json();
			if (result.success) {
				// Update local state
				users = users.map(u => u.id === user.id ? { ...u, is_verified: !u.is_verified } : u);
				toastStore.success(`Akun ${user.name} berhasil ${isCurrentlyVerified ? 'dibatalkan verifikasinya' : 'diverifikasi'}`);
			} else {
				toastStore.error(result.message || 'Gagal memverifikasi pengguna');
			}
		} catch (err) {
			console.error('Error verifying user:', err);
			toastStore.error('Terjadi kesalahan saat memverifikasi pengguna');
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

	async function handleEdit(event: Event) {
		event.preventDefault();
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

	async function showUserProfile(user: User) {
		selectedUser = user;
		showProfileModal = true;
		profileLoading = true;

		try {
			// Fetch user profile data
			const response = await fetch(`/api/profile/by-user-id/${user.id}`);
			const data = await response.json();

			if (data.success) {
				userProfile = data.data;
			} else {
				userProfile = null;
			}
		} catch (error) {
			console.error('Error fetching user profile:', error);
			userProfile = null;
		} finally {
			profileLoading = false;
		}
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

<div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 p-6">
	<div class="max-w-7xl mx-auto space-y-6">
		<!-- Header -->
		<div class="animate-fade-in">
			<h1 class="text-3xl font-bold text-gray-900">Manajemen User</h1>
			<p class="text-gray-600 mt-2">Kelola pengguna sistem monitoring dengan mudah dan efisien.</p>
		</div>

		<!-- Stats Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up" style="animation-delay: 0.1s">
			{#each stats as stat, index}
				<div style="animation-delay: {index * 0.1}s">
					<StatCard
						title={stat.title}
						value={stat.value}
						subtitle={stat.subtitle}
						icon={stat.icon}
						color={stat.color}
					/>
				</div>
			{/each}
		</div>

		<!-- Users Table Card -->
		<div class="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in" style="animation-delay: 0.3s">
			<div class="p-6 border-b border-gray-200">
				<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<h2 class="text-xl font-semibold text-gray-900">Daftar Pengguna</h2>
					<div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
						<!-- Search Input -->
						<div class="relative">
							<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
							<input
								type="text"
								placeholder="Cari pengguna..."
								bind:value={searchQuery}
								class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
							/>
						</div>
						<button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 font-medium">
							<Plus size={20} />
							Tambah User
						</button>
						</div>
				</div>
			</div>

			<div class="p-6">
				{#if loading}
					<div class="text-center py-12">
						<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p class="text-gray-600 text-lg">Memuat data pengguna...</p>
					</div>
				{:else if error}
					<div class="text-center py-12">
						<div class="text-red-500 mb-4 text-6xl">⚠️</div>
						<p class="text-red-600 text-lg mb-4">{error}</p>
						<button
							onclick={fetchUsers}
							class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
						>
							Coba Lagi
						</button>
					</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pengguna</th>
							<th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
							<th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
							<th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Instansi</th>
							<th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
							<th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each filteredUsers as user, i (user.id)}
							<tr class="hover:bg-gray-50 transition-colors duration-150">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center">
										<div class="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
											{user.name.charAt(0).toUpperCase()}
										</div>
										<div>
											<button
												onclick={() => showUserProfile(user)}
												class="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 text-left"
											>
												{user.name}
											</button>
											<div class="text-sm text-gray-500">ID: {user.id}</div>
										</div>
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize
										{user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}">
										{user.role}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.nama_instansi ?? '-'}</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<button
										onclick={() => verifyUser(user)}
										class="inline-flex px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 focus:outline-none
											{user.is_verified ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}"
										title={user.is_verified ? 'Batalkan verifikasi' : 'Verifikasi user'}
									>
										{user.is_verified ? '✅ Terverifikasi' : '⏳ Belum'}
									</button>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
									<div class="flex space-x-2">
										<button
											onclick={() => openEditModal(user)}
											class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
											title="Edit"
										>
											<Edit size={18} />
										</button>
										<button
											onclick={() => openDeleteConfirm(user)}
											class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
											title="Hapus"
										>
											<Trash2 size={18} />
										</button>
									</div>
								</td>
							</tr>
						{/each}
						{#if filteredUsers.length === 0}
							<tr>
								<td colspan="6" class="px-6 py-12 text-center">
									<div class="text-gray-400 mb-2 text-4xl">👥</div>
									<p class="text-gray-500 text-lg">
										{searchQuery ? 'Tidak ada pengguna yang cocok dengan pencarian' : 'Belum ada pengguna terdaftar'}
									</p>
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
</div>
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes slide-up {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.6s ease-out forwards;
		opacity: 0;
	}

	.animate-slide-up {
		animation: slide-up 0.5s ease-out forwards;
		opacity: 0;
	}
</style>

<!-- Edit User Modal -->
{#if showEditModal}
	<div class="fixed inset-0 bg-transparent flex items-center justify-center z-50">
		<div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
			<div class="p-6">
				<h3 class="text-lg font-semibold mb-4">Edit Pengguna</h3>

				<form onsubmit={handleEdit} class="space-y-4">
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
							onclick={() => { showEditModal = false; editingUser = null; }}
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
						onclick={() => { showDeleteConfirm = false; deletingUser = null; }}
						class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
					>
						Batal
					</button>
					<button
						onclick={handleDelete}
						class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
					>
						Hapus
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- User Profile Modal -->
{#if showProfileModal && selectedUser}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fade-in">
			<!-- Modal Header -->
			<div class="bg-linear-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xl">
							{selectedUser.name.charAt(0).toUpperCase()}
						</div>
						<div>
							<h2 class="text-xl font-bold">{selectedUser.name}</h2>
							<p class="text-blue-100">ID: {selectedUser.id}</p>
						</div>
					</div>
					<button
						onclick={() => { showProfileModal = false; selectedUser = null; userProfile = null; }}
						class="text-white/70 hover:text-white transition-colors duration-200"
					>
						✕
					</button>
				</div>
			</div>

			<!-- Modal Body -->
			<div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
				{#if profileLoading}
					<div class="text-center py-8">
						<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p class="text-gray-600">Memuat profil...</p>
					</div>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<!-- User Info -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Informasi Akun</h3>

							<div class="space-y-3">
								<div>
									<div class="block text-sm font-medium text-gray-600">Nama Lengkap</div>
									<p class="text-gray-900">{selectedUser.name}</p>
								</div>

								<div>
									<div class="block text-sm font-medium text-gray-600">Email</div>
									<p class="text-gray-900">{selectedUser.email}</p>
								</div>

								<div>
									<div class="block text-sm font-medium text-gray-600">Role</div>
									<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize
										{selectedUser.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}">
										{selectedUser.role}
									</span>
								</div>

								<div>
									<div class="block text-sm font-medium text-gray-600">Status Verifikasi</div>
									<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full
										{selectedUser.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
										{selectedUser.is_verified ? '✅ Terverifikasi' : '⏳ Belum Verifikasi'}
									</span>
								</div>

								<div>
									<div class="block text-sm font-medium text-gray-600">Status Akun</div>
									<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full
										{selectedUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
										{selectedUser.is_active ? 'Aktif' : 'Tidak Aktif'}
									</span>
								</div>

								<div>
									<span class="block text-sm font-medium text-gray-600">Bergabung Sejak</span>
									<p class="text-gray-900">{new Date(selectedUser.created_at).toLocaleDateString('id-ID')}</p>
								</div>
							</div>
						</div>

						<!-- Profile Info -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Informasi Profil</h3>

							{#if userProfile}
								<div class="space-y-3">
									<div>
										<div class="block text-sm font-medium text-gray-600">Nama Lengkap</div>
										<p class="text-gray-900">{userProfile.nama || '-'}</p>
									</div>

									<div>
										<div class="block text-sm font-medium text-gray-600">Jabatan</div>
										<p class="text-gray-900">{userProfile.jabatan || '-'}</p>
									</div>

									<div>
										<div class="block text-sm font-medium text-gray-600">Unit Kerja</div>
										<p class="text-gray-900">{userProfile.unit_kerja || '-'}</p>
									</div>

									<div>
										<div class="block text-sm font-medium text-gray-600">No. HP</div>
										<p class="text-gray-900">{userProfile.no_hp || '-'}</p>
									</div>

									<div>
										<div class="block text-sm font-medium text-gray-600">Alamat Kantor</div>
										<p class="text-gray-900">{userProfile.alamat_kantor || '-'}</p>
									</div>
								</div>
							{:else}
								<div class="text-center py-8 text-gray-500">
									<div class="text-4xl mb-2">📝</div>
									<p>Profil belum diisi</p>
									<p class="text-sm mt-1">User belum melengkapi informasi profilnya</p>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>

			<!-- Modal Footer -->
			<div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
				<div class="flex justify-end gap-3">
					<button
						onclick={() => { showProfileModal = false; selectedUser = null; userProfile = null; }}
						class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
					>
						Tutup
					</button>
					{#if selectedUser}
						<button
							onclick={() => { if (selectedUser) openEditModal(selectedUser); showProfileModal = false; }}
							class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
						>
							Edit User
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}