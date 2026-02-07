<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	const userInfo = writable({ userName: '', userInstansi: '' });

	let isOpen = true;
	function toggleSidebar() {
		isOpen = !isOpen;
	}

	const menuSuperAdmin = [
		{ name: 'Dashboard', path: `/super_admin`, icon: '🛡️' },
		{ name: 'Manajemen User', path: `/super_admin/users`, icon: '👥' },
		{ name: 'Master Instansi', path: `/super_admin/master_instansi`, icon: '🏢' },
		{ name: 'Master Pilar', path: `/super_admin/master_pilar`, icon: '🏗️' },
		{ name: 'Rencana Aksi', path: `/super_admin/rencana_aksi`, icon: '📋' },
		{ name: 'Penugasan Admin', path: `/super_admin/penugasan_admin`, icon: '🧑‍💼' },
		{ name: 'Laporan', path: `/super_admin/laporan`, icon: '📄' }
	];
    
	const menuAdmin = [
		{ name: 'Dashboard', path: `/admin`, icon: '📊' },
		{ name: 'Satuan Kerja', path: `/admin/satuan_kerja`, icon: '🏢' },
		{ name: 'Pengembangan Usaha Koperasi', path: `/admin/usaha_koperasi`, icon: '🏪' },
		{ name: 'Peta Kinerja', path: `/admin/peta_kinerja`, icon: '🗺️' },
		{ name: 'Laporan', path: `/admin/laporan`, icon: '📄' }
	];

	const menuUser = [
		{ name: 'Dashboard', path: `/user`, icon: '🏠' },
		{ name: 'Profile', path: `/user/profile`, icon: '👤' },
		{ name: 'Rencana Aksi', path: `/user/aksi`, icon: '📝' },
		{ name: 'Progress', path: `/user/progress`, icon: '📈' },
		{ name: 'Progress Pen', path: `/user/progress_pen`, icon: '📊' }
	];

	function getMenuByRoute() {
		if ($page.url.pathname.startsWith('/super_admin')) {
			return menuSuperAdmin;
		} else if ($page.url.pathname.startsWith('/admin')) {
			return menuAdmin;
		} else {
			return menuUser;
		}
	}

	function updateUserFromLocalStorage() {
		if (typeof localStorage !== 'undefined') {
			const user = localStorage.getItem('user');
			if (user) {
				try {
					const parsed = JSON.parse(user);
					userInfo.set({
						userName: parsed.nama || parsed.name || '',
						userInstansi: parsed.instansi || parsed.instansi_nama || parsed.instansiName || ''
					});
				} catch (e) {
					userInfo.set({ userName: '', userInstansi: '' });
				}
			} else {
				userInfo.set({ userName: '', userInstansi: '' });
			}
		}
	}
	onMount(() => {
		updateUserFromLocalStorage();
		window.addEventListener('storage', updateUserFromLocalStorage);
	});
</script>

<div class="sidebar-layout">
	<button
		class="sidebar-toggle absolute top-2 left-2 z-20 bg-gray-200 hover:bg-gray-300 rounded-full p-2 focus:outline-none"
		on:click={toggleSidebar}
		aria-label={isOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
		style="transition: left 0.2s;"
	>
		{#if isOpen}
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
		{:else}
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
		{/if}
	</button>
	<aside
		class="sidebar"
		style="background-color: #1f2937; color: white; width: 240px; min-width: 240px; transition: transform 0.2s; position: fixed; top: 0; left: 0; height: 100vh; z-index: 10;"
		class:hidden={!isOpen}
		class:sidebar-open={isOpen}
	>
		<div class="sidebar-header">
			<h2 class="sidebar-title">PEN Monitor</h2>
			{#if $userInfo.userName}
				<p class="sidebar-subtitle">{$userInfo.userName}</p>
			{/if}
			{#if $userInfo.userInstansi}
				<p class="sidebar-subtitle">{$userInfo.userInstansi}</p>
			{/if}
		</div>

		<nav class="sidebar-nav">
			{#each getMenuByRoute() as item}
				<a
					href={item.path}
					class="nav-item"
					class:nav-item-active={$page.url.pathname === item.path}
				>
					<span class="nav-icon">{item.icon}</span>
					<span class="nav-text">{item.name}</span>
				</a>
			{/each}
		</nav>

		<div class="sidebar-footer">
			<form action="/api/auth/logout" method="POST" class="logout-form">
				<button type="submit" class="logout-btn">
					<span class="logout-icon">🚪</span>
					<span class="logout-text">Logout</span>
				</button>
			</form>
		</div>
	</aside>
	<div class="sidebar-content" style="margin-left: {isOpen ? '240px' : '0'}; transition: margin-left 0.2s; min-height: 100vh;">
		<slot />
	</div>
</div>

<style>
	.sidebar-layout {
		position: relative;
		min-height: 100vh;
		display: flex;
	}
	.sidebar-content {
		flex: 1;
		min-width: 0;
		background: #f9fafb;
		padding: 0;
	}
	.sidebar-toggle {
		left: 250px;
		transition: left 0.2s;
	}
	.sidebar-open ~ .sidebar-content {
		margin-left: 240px;
	}
	.hidden {
		transform: translateX(-100%);
		pointer-events: none;
		opacity: 0;
	}
	.sidebar-open {
		transform: translateX(0);
		opacity: 1;
	}
	/* ...existing styles... */
	.sidebar-header {
		font-size: 1.25rem;
		font-weight: bold;
		color: #3b82f6;
		margin-bottom: 0.25rem;
	}

	.sidebar-subtitle {
		font-size: 0.875rem;
		color: #9ca3af;
	}

	.sidebar-nav {
		flex: 1;
		padding: 1rem 0;
	}

	.nav-item {
		display: flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
		color: #d1d5db;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.nav-item:hover {
		background-color: #374151;
		color: white;
	}

	.nav-item-active {
		background-color: #3b82f6;
		color: white;
		border-right: 3px solid #2563eb;
	}

	.nav-icon {
		font-size: 1.25rem;
		margin-right: 0.75rem;
	}

	.nav-text {
		transition: opacity 0.2s;
		opacity: 1;
	}

	.logout-btn {
		display: flex;
		align-items: center;
		padding: 0.75rem;
		color: #d1d5db;
		text-decoration: none;
		border-radius: 0.5rem;
		transition: all 0.2s ease;
		border: none;
		background: none;
		width: 100%;
		cursor: pointer;
		font-family: inherit;
		text-align: left;
	}

	.logout-btn:hover {
		background-color: #374151;
		color: white;
	}

	.logout-form {
		margin-top: 0.5rem;
	}

	.logout-icon {
		font-size: 1.125rem;
		margin-right: 0.75rem;
	}

	.logout-text {
		font-weight: 500;
	}

	.hidden {
		transform: translateX(-100%);
		pointer-events: none;
		opacity: 0;
	}
	.sidebar-open {
		transform: translateX(0);
		opacity: 1;
	}
</style>