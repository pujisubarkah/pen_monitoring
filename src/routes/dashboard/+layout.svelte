<script lang="ts">
	import { page } from '$app/stores';
	import { userStore } from '$lib/stores/userStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	
	let { children } = $props();
	
	// Check authentication
	onMount(() => {
		if (!$userStore.isAuthenticated) {
			goto('/');
		}
	});

	const menuItems = [
		{ href: '/dashboard', label: 'Dashboard', icon: '📊' },
		{ href: '/dashboard/aksi', label: 'Form Aksi', icon: '📝' },
		{ href: '/dashboard/evaluasi', label: 'Evaluasi', icon: '📋' },
		{ href: '/dashboard/data', label: 'Data Summary', icon: '📈' }
	];
</script>

<div class="min-h-screen bg-gray-50 flex flex-col">
	<!-- Navigation -->
	<Navbar user={$userStore.user} />
	
	<div class="flex flex-1">
		<!-- Sidebar -->
		<aside class="bg-gray-800 text-white w-64 min-h-full hidden lg:block">
			<div class="p-4">
				<h2 class="text-lg font-semibold mb-8 text-center">Menu Navigation</h2>
				
				<nav class="space-y-2">
					{#each menuItems as item}
						<a 
							href={item.href}
							class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-700"
							class:bg-blue-600={$page.url.pathname === item.href}
							class:hover:bg-blue-700={$page.url.pathname === item.href}
						>
							<span class="text-xl">{item.icon}</span>
							<span class="font-medium">{item.label}</span>
						</a>
					{/each}
				</nav>
				
				<!-- User Info Section -->
				<div class="mt-8 pt-8 border-t border-gray-700">
					<div class="flex items-center space-x-3 px-4">
						<div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
							<span class="text-sm font-bold">U</span>
						</div>
						<div>
							<p class="text-sm font-medium">User</p>
							<p class="text-xs text-gray-400">Administrator</p>
						</div>
					</div>
				</div>
			</div>
		</aside>
		
		<!-- Main Content -->
		<main class="flex-1 p-6 lg:p-8">
			<div class="max-w-7xl mx-auto">
				{@render children()}
			</div>
		</main>
	</div>
	
	<!-- Footer -->
	<Footer />
</div>