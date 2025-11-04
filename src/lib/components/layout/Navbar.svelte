<script lang="ts">
	import { page } from '$app/stores';
	
	let { user } = $props<{ user?: any }>();
</script>

<nav class="bg-white shadow-lg border-b border-gray-200">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- Logo/Brand -->
			<div class="flex items-center">
				<h1 class="text-xl font-bold text-gray-900">Pen Monitoring</h1>
			</div>

			<!-- Navigation Links -->
			<div class="hidden md:block">
				<div class="ml-10 flex items-baseline space-x-4">
					<a 
						href="/dashboard" 
						class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
						class:text-blue-600={$page.url.pathname === '/dashboard'}
					>
						Dashboard
					</a>
					<a 
						href="/dashboard/aksi" 
						class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
						class:text-blue-600={$page.url.pathname.includes('/aksi')}
					>
						Aksi
					</a>
					<a 
						href="/dashboard/evaluasi" 
						class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
						class:text-blue-600={$page.url.pathname.includes('/evaluasi')}
					>
						Evaluasi
					</a>
				</div>
			</div>

			<!-- User Menu -->
			<div class="flex items-center space-x-4">
				{#if user}
					<span class="text-sm text-gray-700">Hello, {user.name}</span>
					<a href="/api/auth/logout" class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700">
						Logout
					</a>
				{:else}
					<a href="/" class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
						Login
					</a>
				{/if}
			</div>
		</div>
	</div>
</nav>