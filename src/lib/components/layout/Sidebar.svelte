<script lang="ts">
	import { page } from '$app/stores';
	
	const menuAdmin = [
		{ name: 'Dashboard', path: `/admin`, icon: '📊' },
		{ name: 'Manajemen User', path: `/admin/users`, icon: '👥' },
		{ name: 'Evaluasi Nasional', path: `/admin/evaluasi`, icon: '📋' }
	];

	const menuUser = [
		{ name: 'Dashboard', path: `/user`, icon: '🏠' },
		{ name: 'Input Aksi', path: `/user/aksi`, icon: '📝' },
		{ name: 'Progress Saya', path: `/user/progress`, icon: '📈' }
	];

	const isAdminRoute = $derived($page.url.pathname.startsWith('/admin'));
	const menu = $derived(() => isAdminRoute ? menuAdmin : menuUser);
	const title = $derived(() => isAdminRoute ? 'Admin Panel' : 'User Portal');
	const userRole = $derived(() => isAdminRoute ? 'Administrator' : 'User');
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
	
		
		<a href="/" class="logout-btn">
			<span class="logout-icon">🏠</span>
			<span class="logout-text">Kembali ke Beranda</span>
		</a>
		
		<form action="/api/auth/logout" method="POST" class="logout-form">
			<button type="submit" class="logout-btn">
				<span class="logout-icon">🚪</span>
				<span class="logout-text">Logout</span>
			</button>
		</form>
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
</style>