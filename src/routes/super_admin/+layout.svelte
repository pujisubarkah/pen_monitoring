<script lang="ts">
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const user = writable(null);

	function updateUserFromLocalStorage() {
		if (typeof localStorage !== 'undefined') {
			const userData = localStorage.getItem('user');
			if (userData) {
				try {
					const parsed = JSON.parse(userData);
					user.set(parsed); // Set to the user object directly
				} catch (e) {
					user.set(null);
				}
			}
		}
	}

	onMount(() => {
		updateUserFromLocalStorage();
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