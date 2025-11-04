<script lang="ts">
	import { onMount } from 'svelte';
	
	// Lucide icons
	let lucideScript: HTMLScriptElement | null = null;
	
	onMount(() => {
		// Load Lucide icons
		lucideScript = document.createElement('script');
		lucideScript.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.js';
		lucideScript.onload = () => {
			if (window.lucide) {
				window.lucide.createIcons();
			}
		};
		document.head.appendChild(lucideScript);
		
		return () => {
			if (lucideScript) {
				document.head.removeChild(lucideScript);
			}
		};
	});

	// Sample data
	let users = [
		{
			id: 1,
			name: 'John Doe',
			email: 'john@example.com',
			role: 'Admin',
			status: 'Aktif',
			avatar: 'JD',
			avatarColor: '#3b82f6',
			lastLogin: '2 jam yang lalu',
			department: 'IT'
		},
		{
			id: 2,
			name: 'Jane Smith',
			email: 'jane@example.com',
			role: 'User',
			status: 'Aktif',
			avatar: 'JS',
			avatarColor: '#10b981',
			lastLogin: '1 hari yang lalu',
			department: 'PEN'
		},
		{
			id: 3,
			name: 'Mike Johnson',
			email: 'mike@example.com',
			role: 'Moderator',
			status: 'Nonaktif',
			avatar: 'MJ',
			avatarColor: '#f59e0b',
			lastLogin: '3 hari yang lalu',
			department: 'Finance'
		},
		{
			id: 4,
			name: 'Sarah Wilson',
			email: 'sarah@example.com',
			role: 'User',
			status: 'Aktif',
			avatar: 'SW',
			avatarColor: '#8b5cf6',
			lastLogin: '30 menit yang lalu',
			department: 'Operations'
		}
	];

	let searchTerm = '';
	let selectedRole = 'all';
	let selectedStatus = 'all';
	
	$: filteredUsers = users.filter(user => {
		const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
							 user.email.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesRole = selectedRole === 'all' || user.role === selectedRole;
		const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
		
		return matchesSearch && matchesRole && matchesStatus;
	});

	function handleEdit(user: typeof users[0]) {
		console.log('Edit user:', user);
	}

	function handleDelete(user: typeof users[0]) {
		console.log('Delete user:', user);
	}
</script>

<script lang="ts" context="module">
	// Lucide icons type declaration
	declare global {
		interface Window {
			lucide: {
				createIcons: () => void;
			};
		}
	}
</script>

<svelte:head>
	<title>Manajemen User - PEN Monitor</title>
</svelte:head>

<!-- Animated Background -->
<div class="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
	<div class="absolute w-80 h-80 -top-20 -left-20 bg-gradient-to-br from-blue-400/8 to-emerald-400/8 rounded-full animate-pulse"></div>
	<div class="absolute w-64 h-64 top-2/3 -right-20 bg-gradient-to-br from-emerald-400/8 to-green-400/8 rounded-full animate-bounce" style="animation-delay: -2s;"></div>
	<div class="absolute w-48 h-48 -bottom-10 left-1/4 bg-gradient-to-br from-amber-400/8 to-orange-400/8 rounded-full animate-ping" style="animation-delay: -4s;"></div>
</div>

<div class="relative bg-gradient-to-br from-teal-700 via-emerald-600 to-green-600 p-6 md:p-12 mb-8 overflow-hidden">
	<!-- Header Glow Effect -->
	<div class="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent opacity-60 pointer-events-none"></div>
	
	<div class="relative z-10 max-w-7xl mx-auto">
		<div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
			<!-- Left Content -->
			<div class="flex-1 space-y-6">
				<!-- Breadcrumb -->
				<nav class="flex items-center gap-2 text-sm text-emerald-100 font-medium">
					<span>Admin</span>
					<i data-lucide="chevron-right" class="w-4 h-4 opacity-60"></i>
					<span class="text-white font-semibold">Users</span>
				</nav>
				
				<!-- Title -->
				<div class="flex items-center gap-4">
					<div class="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
						<i data-lucide="users" class="w-8 h-8 text-white"></i>
					</div>
					<h1 class="text-4xl md:text-5xl font-bold text-white drop-shadow-sm">Manajemen User</h1>
				</div>
				
				<!-- Description -->
				<p class="text-lg text-emerald-100 leading-relaxed max-w-2xl">
					Kelola pengguna sistem monitoring PEN dengan mudah dan efisien
				</p>
				
				<!-- Mini Stats -->
				<div class="flex items-center gap-6 pt-4">
					<div class="text-center">
						<div class="text-3xl font-bold text-white">{users.length}</div>
						<div class="text-sm text-emerald-200 font-medium">Total Users</div>
					</div>
					<div class="w-px h-12 bg-white/30"></div>
					<div class="text-center">
						<div class="text-3xl font-bold text-white">{users.filter(u => u.status === 'Aktif').length}</div>
						<div class="text-sm text-emerald-200 font-medium">Aktif</div>
					</div>
				</div>
			</div>
			
			<!-- Right Content -->
			<div class="flex flex-col sm:flex-row lg:flex-col gap-4">
				<!-- Admin Info -->
				<div class="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
					<div class="p-2 bg-white/20 rounded-xl">
						<i data-lucide="shield-check" class="w-6 h-6 text-white"></i>
					</div>
					<div>
						<div class="text-white font-semibold text-sm">Administrator</div>
						<div class="text-emerald-200 text-xs">Full Access</div>
					</div>
				</div>
				
				<!-- Back Button -->
				<a href="/" class="group flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold transition-all duration-300 hover:bg-white/30 hover:scale-105 border border-white/30">
					<i data-lucide="home" class="w-5 h-5"></i>
					<span>Beranda</span>
				</a>
			</div>
		</div>
	</div>
</div>

<!-- Main Content -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
	<!-- Content Header -->
	<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
		<div class="space-y-2">
			<h2 class="text-3xl font-bold text-gray-900">Daftar Pengguna</h2>
			<p class="text-lg text-gray-600">Kelola dan pantau semua pengguna sistem secara real-time</p>
		</div>
		<button class="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105">
			<div class="flex items-center gap-3 relative z-10">
				<i data-lucide="user-plus" class="w-5 h-5"></i>
				<span>Tambah User Baru</span>
			</div>
			<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
		</button>
	</div>

	<!-- Filters and Search -->
	<div class="flex flex-col lg:flex-row gap-6 mb-8">
		<!-- Search -->
		<div class="flex-1 max-w-md">
			<div class="relative">
				<i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></i>
				<input 
					type="text" 
					placeholder="Cari berdasarkan nama atau email..."
					class="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-sm"
					bind:value={searchTerm}
				>
				{#if searchTerm}
					<button 
						class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
						on:click={() => searchTerm = ''}
						aria-label="Clear search"
						title="Clear search"
					>
						<i data-lucide="x" class="w-5 h-5"></i>
					</button>
				{/if}
			</div>
		</div>
		
		<!-- Filters -->
		<div class="flex items-end gap-4">
			<div class="space-y-2">
				<label for="role-filter" class="flex items-center gap-2 text-sm font-semibold text-gray-700">
					<i data-lucide="user-check" class="w-4 h-4"></i>
					Role
				</label>
				<select 
					id="role-filter"
					class="px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors min-w-[140px]"
					bind:value={selectedRole}
				>
					<option value="all">Semua Role</option>
					<option value="Admin">Admin</option>
					<option value="User">User</option>
					<option value="Moderator">Moderator</option>
				</select>
			</div>
			
			<div class="space-y-2">
				<label for="status-filter" class="flex items-center gap-2 text-sm font-semibold text-gray-700">
					<i data-lucide="activity" class="w-4 h-4"></i>
					Status
				</label>
				<select 
					id="status-filter"
					class="px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors min-w-[140px]"
					bind:value={selectedStatus}
				>
					<option value="all">Semua Status</option>
					<option value="Aktif">Aktif</option>
					<option value="Nonaktif">Nonaktif</option>
				</select>
			</div>
			
			<button 
				class="p-3 border border-gray-200 rounded-xl bg-white text-gray-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-300 hover:rotate-180"
				title="Refresh Data"
			>
				<i data-lucide="refresh-cw" class="w-5 h-5"></i>
			</button>
		</div>
	</div>

	<!-- Modern Table -->
	<div class="bg-white rounded-3xl shadow-xl shadow-gray-500/10 border border-gray-100 overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full border-collapse">
				<thead>
					<tr class="bg-gradient-to-r from-gray-50 to-gray-100">
						<th class="px-6 py-4 text-left border-b-2 border-gray-200">
							<div class="flex items-center gap-3 text-sm font-bold text-gray-700">
								<i data-lucide="user" class="w-4 h-4 text-gray-500"></i>
								<span>Pengguna</span>
							</div>
						</th>
						<th class="px-6 py-4 text-left border-b-2 border-gray-200">
							<div class="flex items-center gap-3 text-sm font-bold text-gray-700">
								<i data-lucide="mail" class="w-4 h-4 text-gray-500"></i>
								<span>Kontak & Role</span>
							</div>
						</th>
						<th class="px-6 py-4 text-left border-b-2 border-gray-200">
							<div class="flex items-center gap-3 text-sm font-bold text-gray-700">
								<i data-lucide="building" class="w-4 h-4 text-gray-500"></i>
								<span>Departemen</span>
							</div>
						</th>
						<th class="px-6 py-4 text-left border-b-2 border-gray-200">
							<div class="flex items-center gap-3 text-sm font-bold text-gray-700">
								<i data-lucide="activity" class="w-4 h-4 text-gray-500"></i>
								<span>Status</span>
							</div>
						</th>
						<th class="px-6 py-4 text-left border-b-2 border-gray-200">
							<div class="flex items-center gap-3 text-sm font-bold text-gray-700">
								<i data-lucide="clock" class="w-4 h-4 text-gray-500"></i>
								<span>Login Terakhir</span>
							</div>
						</th>
						<th class="px-6 py-4 text-left border-b-2 border-gray-200">
							<div class="flex items-center gap-3 text-sm font-bold text-gray-700">
								<i data-lucide="settings" class="w-4 h-4 text-gray-500"></i>
								<span>Aksi</span>
							</div>
						</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredUsers as user, index}
						<tr class="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 transition-all duration-300 group animate-fade-in-up" style="animation-delay: {index * 0.1}s">
							<!-- User Info -->
							<td class="px-6 py-5">
								<div class="flex items-center gap-4">
									<div 
										class="relative w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform duration-300"
										style="background: {user.avatarColor}"
									>
										{user.avatar}
										<div class="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
									</div>
									<div>
										<div class="font-semibold text-gray-900 text-base">{user.name}</div>
										<div class="text-xs text-gray-500 font-medium">ID: #{user.id}</div>
									</div>
								</div>
							</td>
							
							<!-- Contact & Role -->
							<td class="px-6 py-5">
								<div class="space-y-2">
									<div class="flex items-center gap-2 text-sm text-gray-600">
										<i data-lucide="mail" class="w-4 h-4 text-gray-400"></i>
										<span>{user.email}</span>
									</div>
									<div class="inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-semibold {user.role === 'Admin' ? 'bg-amber-100 text-amber-800 border border-amber-200' : user.role === 'User' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-purple-100 text-purple-800 border border-purple-200'}">
										<i data-lucide="shield" class="w-3 h-3"></i>
										<span>{user.role}</span>
									</div>
								</div>
							</td>
							
							<!-- Department -->
							<td class="px-6 py-5">
								<div class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 border border-gray-200">
									<i data-lucide="building-2" class="w-4 h-4"></i>
									<span>{user.department}</span>
								</div>
							</td>
							
							<!-- Status -->
							<td class="px-6 py-5">
								<div class="flex items-center gap-3">
									<div class="w-2 h-2 rounded-full {user.status === 'Aktif' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}"></div>
									<span class="text-sm font-semibold {user.status === 'Aktif' ? 'text-emerald-700' : 'text-red-700'}">{user.status}</span>
									<i data-lucide="{user.status === 'Aktif' ? 'check-circle' : 'x-circle'}" class="w-4 h-4 {user.status === 'Aktif' ? 'text-emerald-500' : 'text-red-500'}"></i>
								</div>
							</td>
							
							<!-- Last Login -->
							<td class="px-6 py-5">
								<div class="flex items-center gap-2 text-sm text-gray-600">
									<i data-lucide="clock" class="w-4 h-4 text-gray-400"></i>
									<span>{user.lastLogin}</span>
								</div>
							</td>
							
							<!-- Actions -->
							<td class="px-6 py-5">
								<div class="flex gap-2">
									<button 
										class="group relative p-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1"
										on:click={() => handleEdit(user)}
										title="Edit User"
									>
										<i data-lucide="edit" class="w-4 h-4"></i>
										<div class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
											Edit
										</div>
									</button>
									<button 
										class="group relative p-2 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1"
										title="View Details"
									>
										<i data-lucide="eye" class="w-4 h-4"></i>
										<div class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
											View
										</div>
									</button>
									<button 
										class="group relative p-2 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-1"
										on:click={() => handleDelete(user)}
										title="Delete User"
									>
										<i data-lucide="trash-2" class="w-4 h-4"></i>
										<div class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
											Delete
										</div>
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			
			{#if filteredUsers.length === 0}
				<div class="text-center py-16 px-8 text-gray-500">
					<div class="w-20 h-20 mx-auto mb-6 text-gray-300">
						<i data-lucide="users-x" class="w-full h-full"></i>
					</div>
					<h3 class="text-xl font-semibold text-gray-700 mb-2">Tidak ada pengguna ditemukan</h3>
					<p class="text-gray-500 mb-8 leading-relaxed">Coba ubah filter atau kata kunci pencarian Anda</p>
					<button 
						class="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
						on:click={() => { searchTerm = ''; selectedRole = 'all'; selectedStatus = 'all'; }}
					>
						<i data-lucide="refresh-ccw" class="w-4 h-4"></i>
						Reset Filter
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

