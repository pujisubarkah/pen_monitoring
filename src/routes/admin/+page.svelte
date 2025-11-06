
<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	// Store for admin info (optional, can be extended)
	export const adminInfo = writable({ adminName: '' });

	function updateAdminFromLocalStorage() {
		if (typeof localStorage !== 'undefined') {
			const user = localStorage.getItem('user');
			if (user) {
				try {
					const parsed = JSON.parse(user);
					adminInfo.set({
						adminName: parsed.nama || parsed.name || 'Admin'
					});
				} catch (e) {
					adminInfo.set({ adminName: 'Admin' });
				}
			} else {
				adminInfo.set({ adminName: 'Admin' });
			}
		}
	}

	onMount(() => {
		updateAdminFromLocalStorage();
		window.addEventListener('storage', updateAdminFromLocalStorage);
	});
</script>


<svelte:head>
	<title>Admin Dashboard - PEN Monitor</title>
</svelte:head>

<main class="flex flex-col items-center justify-center min-h-[60vh] p-8">
	<div class="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
		<h1 class="text-2xl font-bold text-blue-700 mb-2">Selamat Datang, {$adminInfo.adminName}!</h1>
		<p class="text-lg mb-6">Ini adalah dashboard Admin PEN Monitoring. Silakan gunakan menu di samping untuk mengelola data dan monitoring aksi PEN.</p>
	</div>
</main>

<style>
	main {
		background: linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%);
	}
</style>

