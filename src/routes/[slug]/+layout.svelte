<script lang="ts">
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import type { LayoutData } from './$types';
	
	let { data, children } = $props<{ data: LayoutData; children: any }>();
</script>

<div class="flex min-h-screen bg-gray-50">
	<Sidebar slug={data.slug} />

	<main class="flex-1 p-8 overflow-y-auto">
		{@render children()}
	</main>
</div>
