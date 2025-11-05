<script lang="ts">
	import { onMount } from 'svelte';

	let lucideScript = null;
	let user = $state<{ name: string; role: string } | null>(null);

	onMount(() => {
		// Load Lucide icons
		lucideScript = document.createElement('script');
		lucideScript.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.js';
		lucideScript.onload = () => {
			if ((window as any).lucide) (window as any).lucide.createIcons();
		};
		document.body.appendChild(lucideScript);

		// Get user data from cookies
		const userCookie = document.cookie
			.split('; ')
			.find(row => row.startsWith('user='));

		if (userCookie) {
			try {
				user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
			} catch (e) {
				console.error('Failed to parse user cookie:', e);
			}
		}
	});
</script>

<svelte:head>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
	<style>
		.glass-effect {
			background: rgba(255, 255, 255, 0.95);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(255, 255, 255, 0.2);
		}

		.animate-float {
			animation: float 6s ease-in-out infinite;
		}

		@keyframes float {
			0%, 100% { transform: translateY(0px); }
			50% { transform: translateY(-10px); }
		}

		.animate-pulse-slow {
			animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		}

		.gradient-text {
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
		}
	</style>
</svelte:head>

<!-- Header -->
<header class="glass-effect shadow-xl border-b border-white/20 animate-float">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center py-6">
			<div class="space-y-3">
				<div class="flex items-center space-x-4">
					<div class="w-4 h-12 bg-linear-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse-slow"></div>
					<div>
						<h1 class="text-4xl font-black gradient-text animate-pulse-slow">
							Selamat Datang, {#if user}<span class="text-gray-900">{user.name}</span>{:else}<span class="text-gray-900">Admin</span>{/if}!
						</h1>
						<p class="text-gray-600 text-lg font-medium mt-2">
							Dashboard Admin Sistem Monitoring KDMP
						</p>
					</div>
					<div class="animate-bounce text-3xl">🚀</div>
				</div>
			</div>
			<div class="flex items-center space-x-6">
				<div class="glass-effect p-4 rounded-2xl border border-white/30 shadow-lg">
					<p class="text-sm text-gray-500 font-semibold">Role</p>
					<p class="font-bold text-gray-900 text-lg">{#if user}{user.role}{:else}Administrator{/if}</p>
				</div>
				<div class="relative group">
					<div class="w-16 h-16 bg-linear-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all duration-300 animate-pulse-slow">
						<i data-lucide="user" class="w-8 h-8 text-white"></i>
					</div>
					<div class="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white shadow-lg animate-ping"></div>
					<div class="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white shadow-lg"></div>
				</div>
			</div>
		</div>
	</div>
</header>