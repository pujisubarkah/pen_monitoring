<script lang="ts">
	import type { PageData } from './$types';
	
	let { data } = $props<{ data: PageData }>();
	
	// Redirect based on slug
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	onMount(() => {
		if (data.slug === 'admin') {
			goto('/admin/users', { replaceState: true });
		} else if (data.slug === 'user') {
			goto('/user/aksi', { replaceState: true });
		}
	});
</script>

<svelte:head>
	<title>Dashboard - PEN Monitor</title>
</svelte:head>

<div class="flex items-center justify-center min-h-screen">
	<div class="text-center">
		<div class="text-6xl mb-4">⏳</div>
		<p class="text-xl text-gray-600">Loading...</p>
	</div>
</div>
