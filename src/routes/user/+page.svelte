<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// Redirect to aksi page
	onMount(() => {
		goto('/user/aksi', { replaceState: true });
	});
</script>

<svelte:head>
	<title>User Dashboard - PEN Monitor</title>
</svelte:head>

<div class="flex items-center justify-center min-h-screen">
	<div class="text-center">
		<div class="text-6xl mb-4">⏳</div>
		<p class="text-xl text-gray-600">Redirecting to Input Aksi...</p>
	</div>
</div>