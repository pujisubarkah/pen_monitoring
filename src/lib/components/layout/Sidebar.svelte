<script lang="ts">
	import { page } from '$app/stores';
	
	let { slug } = $props<{ slug: string }>();
	
	const menuAdmin = [
		{ name: 'Dashboard', path: '/admin', icon: '📊' },
		{ name: 'Manajemen User', path: '/admin/users', icon: '👥' },
		{ name: 'Evaluasi Nasional', path: '/admin/evaluasi', icon: '📋' }
	];

	const menuUser = [
		{ name: 'Dashboard', path: '/user', icon: '🏠' },
		{ name: 'Input Aksi', path: '/user/aksi', icon: '📝' },
		{ name: 'Progress Saya', path: '/user/progress', icon: '📈' }
	];

	const menu = $derived(() => slug === 'admin' ? menuAdmin : menuUser);
	const title = $derived(() => slug === 'admin' ? 'Admin Panel' : 'User Portal');
	const userRole = $derived(() => slug === 'admin' ? 'Administrator' : 'User');
</script>

<aside class="sidebar">
	<div class="sidebar-header">
		<h2 class="sidebar-title">PEN Monitor</h2>
		<p class="sidebar-subtitle">{title()}</p>
	</div>

	<nav class="sidebar-nav">
		{#each menu() as item}
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
		<div class="user-info">
			<div class="user-avatar">
				<span class="user-initial">{slug === 'admin' ? 'A' : 'U'}</span>
			</div>
			<div class="user-details">
				<p class="user-name">Demo {userRole()}</p>
				<p class="user-role">{userRole()}</p>
			</div>
		</div>
		
		<a href="/" class="logout-btn">
			<span class="logout-icon">🚪</span>
			<span class="logout-text">Kembali ke Beranda</span>
		</a>
	</div>
</aside>

<style>
	.sidebar {
		width: 250px;
		min-height: 100vh;
		background-color: #1f2937;
		color: white;
		display: flex;
		flex-direction: column;
		border-right: 1px solid #374151;
	}

	.sidebar-header {
		padding: 1.5rem;
		border-bottom: 1px solid #374151;
		background-color: #111827;
	}

	.sidebar-title {
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
		font-weight: 500;
	}

	.sidebar-footer {
		padding: 1rem;
		border-top: 1px solid #374151;
		background-color: #111827;
	}

	.user-info {
		display: flex;
		align-items: center;
		padding: 0.75rem;
		margin-bottom: 1rem;
		background-color: #374151;
		border-radius: 0.5rem;
	}

	.user-avatar {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background-color: #3b82f6;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 0.75rem;
		font-weight: bold;
		font-size: 1.125rem;
	}

	.user-details {
		flex: 1;
	}

	.user-name {
		font-size: 0.875rem;
		font-weight: 600;
		margin-bottom: 0.125rem;
	}

	.user-role {
		font-size: 0.75rem;
		color: #9ca3af;
	}

	.logout-btn {
		display: flex;
		align-items: center;
		padding: 0.75rem;
		color: #d1d5db;
		text-decoration: none;
		border-radius: 0.5rem;
		transition: all 0.2s ease;
	}

	.logout-btn:hover {
		background-color: #374151;
		color: white;
	}

	.logout-icon {
		font-size: 1.125rem;
		margin-right: 0.75rem;
	}

	.logout-text {
		font-weight: 500;
	}
</style>