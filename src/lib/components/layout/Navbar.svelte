<script lang="ts">
	import { page } from '$app/stores';

	let { user } = $props<{ user?: any }>();

	// Determine if user is admin or regular user
	const isAdmin = $derived(user?.role === 'admin');
	const isUser = $derived(user?.role === 'user');
</script>

<nav class="bg-white shadow-lg border-b border-gray-200">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- Logo/Brand -->
			<div class="flex items-center">
				<h1 class="text-xl font-bold text-gray-900">PEN Monitoring</h1>
			</div>

			<!-- Navigation Links -->
			<div class="hidden md:block">
				<div class="ml-10 flex items-baseline space-x-4">
					{#if isAdmin}
						<a
							href="/admin"
							class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
							class:text-blue-600={$page.url.pathname === '/admin'}
						>
							Dashboard
						</a>
						<a
							href="/admin/users"
							class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
							class:text-blue-600={$page.url.pathname === '/admin/users'}
						>
							Users
						</a>
						<a
							href="/admin/evaluasi"
							class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
							class:text-blue-600={$page.url.pathname === '/admin/evaluasi'}
						>
							Evaluasi
						</a>
					{:else if isUser}
						<a
							href="/user"
							class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
							class:text-blue-600={$page.url.pathname === '/user'}
						>
							Dashboard
						</a>
						<a
							href="/user/aksi"
							class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
							class:text-blue-600={$page.url.pathname === '/user/aksi'}
						>
							Aksi
						</a>
						<a
							href="/user/progress"
							class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
							class:text-blue-600={$page.url.pathname === '/user/progress'}
						>
							Progress
						</a>
					{/if}
				</div>
			</div>

			<!-- User Menu -->
			<div class="flex items-center space-x-4">
				{#if user}
					<span class="text-sm text-gray-700">Hello, {user.name}</span>
					<form action="/api/auth/logout" method="POST" class="inline">
						<button type="submit" class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700">
							Logout
						</button>
					</form>
				{:else}
					<a href="/" class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
						Login
					</a>
				{/if}
			</div>
		</div>
	</div>
</nav>