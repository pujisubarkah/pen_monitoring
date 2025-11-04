<script lang="ts">
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
</script>

<div class="flex min-h-screen bg-gray-50">
	<Sidebar />

	<main class="flex-1 p-8 overflow-y-auto">
		<slot />
	</main>
</div>