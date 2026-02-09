<script lang="ts">
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';

	const user = writable(null);

	function updateUserFromLocalStorage() {
		if (browser) {
			const userData = localStorage.getItem('user');
			if (userData) {
				try {
					const parsed = JSON.parse(userData);
					user.set(parsed);
				} catch (e) {
					user.set(null);
				}
			}
		}
	}

	// Store user data in localStorage when available
	onMount(() => {
		if (browser) {
			const userData = $page.data.user;
			if (userData) {
				localStorage.setItem('user', JSON.stringify(userData));
			}
			updateUserFromLocalStorage();
		}
	});
</script>

<div class="flex min-h-screen bg-gray-50">
	<Sidebar />

	<div class="flex-1 flex flex-col">
		<Navbar {user} />

		<main class="flex-1 p-8 overflow-y-auto">
			<slot />
		</main>
	</div>
</div>