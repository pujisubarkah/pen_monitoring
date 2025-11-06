
<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';

	// Store for user info (should match Sidebar.svelte)
	export const userInfo = writable({ userName: '', userInstansi: '' });

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

	let hasProfile = false;

	onMount(() => {
		updateUserFromLocalStorage();
		window.addEventListener('storage', updateUserFromLocalStorage);
		// Cek profile user, misal dari localStorage atau API
		if (typeof localStorage !== 'undefined') {
			const user = localStorage.getItem('user');
			if (user) {
				try {
					const parsed = JSON.parse(user);
					hasProfile = !!(parsed.nama && parsed.email && parsed.instansi);
				} catch (e) {
					hasProfile = false;
				}
			}
		}
	});

	function goToProfile() {
		goto('/user/profile');
	}
</script>

<svelte:head>
	<title>User Dashboard - PEN Monitor</title>
</svelte:head>

<main class="flex flex-col items-center justify-center min-h-[60vh] p-8">
	<div class="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
		<h1 class="text-2xl font-bold text-blue-700 mb-2">Selamat Datang, {$userInfo.userName || 'User'}!</h1>
		{#if $userInfo.userInstansi}
			<p class="text-gray-600 mb-4">Instansi: {$userInfo.userInstansi}</p>
		{/if}
		<p class="text-lg mb-6">Selamat datang di dashboard PEN Monitoring. Silakan mengisi profile anda untuk melanjutkan.</p>
		{#if !hasProfile}
			<button on:click={goToProfile} class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">Isi Profile Sekarang</button>
		{:else}
			<p class="text-green-600 font-semibold">Profile anda sudah lengkap. Silakan lanjutkan ke menu lainnya.</p>
		{/if}
	</div>
</main>

<style>
	main {
		background: linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%);
	}
</style>