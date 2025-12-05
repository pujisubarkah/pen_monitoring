<script lang="ts">
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	// Store user data in localStorage when available
	onMount(() => {
		const userData = $page.data.user;
		if (userData) {
			localStorage.setItem('user', JSON.stringify(userData));
		}
	});
</script>

<div class="flex min-h-screen bg-gray-50">
	<Sidebar />

	<main class="flex-1 p-8 overflow-y-auto">
		<slot />
	</main>
</div>