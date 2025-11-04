<script lang="ts">
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	// Dashboard admin menggunakan header tambahan
	const isDashboard = $derived($page.url.pathname === '/admin');
</script>

<div class="flex min-h-screen bg-gray-50">
	<Sidebar slug={'admin'} />

	<main class="flex-1 overflow-y-auto">
		{#if isDashboard}
			<!-- Header khusus untuk Dashboard Admin -->
			<header class="bg-white shadow-sm border-b">
				<div class="max-w-7xl mx-auto px-8 py-6">
					<div class="flex justify-between items-center">
						<div class="flex items-center">
							<h1 class="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
						</div>
						<div class="flex items-center space-x-4">
							<span class="text-sm text-gray-600">Administrator</span>
							<a href="/" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
								Kembali ke Beranda
							</a>
						</div>
					</div>
				</div>
			</header>
		{/if}

		<div class="p-8">
			{@render children()}
		</div>
	</main>
</div>