<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	let lucideScript = null;
	let user = $state(null);

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

	<title>Dashboard Admin - Pen Monitoring KDMP</title>		document.body.appendChild(lucideScript);

</svelte:head>

		};

<div class="min-h-screen bg-gray-50">

	<!-- Header -->		// Get user data from cookies

	<div class="bg-white shadow-sm border-b">

		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">		const userCookie = document.cookie	onMount(() => {		document.body.appendChild(lucideScript);

			<div class="flex justify-between items-center py-6">

				<div>			.split('; ')

					<h1 class="text-3xl font-bold text-gray-900">

						Selamat Datang, {#if user}{user.name}{/if}!			.find(row => row.startsWith('user='));		// Load Lucide icons	});

					</h1>

					<p class="text-gray-600 mt-1">		if (userCookie) {

						Dashboard Admin Sistem Monitoring KDMP

					</p>			try {		lucideScript = document.createElement('script');</script>

				</div>

				<div class="flex items-center space-x-4">				user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));

					<div class="text-right">

						<p class="text-sm text-gray-500">Role</p>			} catch (e) {		lucideScript.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.js';

						<p class="font-semibold text-gray-900">{#if user}{user.role}{/if}</p>

					</div>				console.error('Failed to parse user cookie:', e);

					<div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">

						<i data-lucide="user" class="w-6 h-6 text-white"></i>			}		lucideScript.onload = () => {<div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">

					</div>

				</div>		}

			</div>

		</div>	});			if ((window as any).lucide) (window as any).lucide.createIcons();	<!-- Hero Section -->

	</div>

</script>

	<!-- Main Content -->

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">		};	<section class="relative text-center max-w-3xl mb-20">

		<!-- Quick Stats -->

		<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"><svelte:head>

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">

				<div class="flex items-center">	<title>Dashboard Admin - Pen Monitoring KDMP</title>		document.body.appendChild(lucideScript);		<div class="absolute inset-0 flex items-center justify-center opacity-30 blur-3xl">

					<div class="p-2 bg-blue-100 rounded-lg">

						<i data-lucide="users" class="w-6 h-6 text-blue-600"></i></svelte:head>

					</div>

					<div class="ml-4">			<div class="w-72 h-72 bg-indigo-600/40 rounded-full animate-pulse"></div>

						<p class="text-sm font-medium text-gray-600">Total Users</p>

						<p class="text-2xl font-bold text-gray-900">24</p><div class="min-h-screen bg-gray-50">

					</div>

				</div>	<!-- Header -->		// Get user data from cookies			<div class="w-60 h-60 bg-pink-500/40 rounded-full animate-ping absolute top-12 right-12"></div>

			</div>

	<div class="bg-white shadow-sm border-b">

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">

				<div class="flex items-center">		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">		const userCookie = document.cookie		</div>

					<div class="p-2 bg-green-100 rounded-lg">

						<i data-lucide="check-circle" class="w-6 h-6 text-green-600"></i>			<div class="flex justify-between items-center py-6">

					</div>

					<div class="ml-4">				<div>			.split('; ')

						<p class="text-sm font-medium text-gray-600">Evaluasi Selesai</p>

						<p class="text-2xl font-bold text-gray-900">18</p>					<h1 class="text-3xl font-bold text-gray-900">

					</div>

				</div>						Selamat Datang, {#if user}{user.name}{/if}!			.find(row => row.startsWith('user='));		<h1 class="text-5xl md:text-6xl font-extrabold mb-6 relative z-10">

			</div>

					</h1>

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">

				<div class="flex items-center">					<p class="text-gray-600 mt-1">		if (userCookie) {			Level Up Your <span class="text-indigo-400">Digital Experience</span>

					<div class="p-2 bg-yellow-100 rounded-lg">

						<i data-lucide="clock" class="w-6 h-6 text-yellow-600"></i>						Dashboard Admin Sistem Monitoring KDMP

					</div>

					<div class="ml-4">					</p>			try {		</h1>

						<p class="text-sm font-medium text-gray-600">Dalam Proses</p>

						<p class="text-2xl font-bold text-gray-900">6</p>				</div>

					</div>

				</div>				<div class="flex items-center space-x-4">				user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));		<p class="text-gray-300 text-lg md:text-xl mb-8 relative z-10">

			</div>

					<div class="text-right">

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">

				<div class="flex items-center">						<p class="text-sm text-gray-500">Role</p>			} catch (e) {			A beautifully modern Svelte + Tailwind app to showcase your next big thing.

					<div class="p-2 bg-purple-100 rounded-lg">

						<i data-lucide="target" class="w-6 h-6 text-purple-600"></i>						<p class="font-semibold text-gray-900">{#if user}{user.role}{/if}</p>

					</div>

					<div class="ml-4">					</div>				console.error('Failed to parse user cookie:', e);		</p>

						<p class="text-sm font-medium text-gray-600">Progress Rata-rata</p>

						<p class="text-2xl font-bold text-gray-900">75%</p>					<div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">

					</div>

				</div>						<i data-lucide="user" class="w-6 h-6 text-white"></i>			}

			</div>

		</div>					</div>



		<!-- Quick Actions -->				</div>		}		<div class="flex justify-center space-x-4 relative z-10">

		<div class="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">

			<h2 class="text-xl font-semibold text-gray-900 mb-4">Aksi Cepat</h2>			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">

				<a href="/admin/users" class="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">		</div>	});			<button class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-semibold transition-all duration-300">

					<i data-lucide="users" class="w-8 h-8 text-blue-600 mr-3"></i>

					<div>	</div>

						<h3 class="font-semibold text-gray-900">Kelola Users</h3>

						<p class="text-sm text-gray-600">Tambah, edit, atau hapus pengguna</p></script>				Get Started

					</div>

				</a>	<!-- Main Content -->



				<a href="/admin/evaluasi" class="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">			</button>

					<i data-lucide="clipboard-check" class="w-8 h-8 text-green-600 mr-3"></i>

					<div>		<!-- Quick Stats -->

						<h3 class="font-semibold text-gray-900">Evaluasi</h3>

						<p class="text-sm text-gray-600">Pantau progress evaluasi</p>		<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"><svelte:head>			<button class="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-2xl border border-white/20 font-semibold transition-all duration-300">

					</div>

				</a>			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">



				<a href="/dashboard" class="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">				<div class="flex items-center">	<title>Dashboard Admin - Pen Monitoring KDMP</title>				Learn More

					<i data-lucide="bar-chart-3" class="w-8 h-8 text-purple-600 mr-3"></i>

					<div>					<div class="p-2 bg-blue-100 rounded-lg">

						<h3 class="font-semibold text-gray-900">Laporan</h3>

						<p class="text-sm text-gray-600">Lihat laporan dan statistik</p>						<i data-lucide="users" class="w-6 h-6 text-blue-600"></i></svelte:head>			</button>

					</div>

				</a>					</div>

			</div>

		</div>					<div class="ml-4">		</div>



		<!-- Recent Activity -->						<p class="text-sm font-medium text-gray-600">Total Users</p>

		<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">

			<h2 class="text-xl font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>						<p class="text-2xl font-bold text-gray-900">24</p><div class="min-h-screen bg-gray-50">	</section>

			<div class="space-y-4">

				<div class="flex items-center space-x-3">					</div>

					<div class="w-2 h-2 bg-green-500 rounded-full"></div>

					<div class="flex-1">				</div>	<!-- Header -->

						<p class="text-sm text-gray-900">User <span class="font-semibold">Sinta Rahmawati</span> menyelesaikan evaluasi</p>

						<p class="text-xs text-gray-500">2 jam yang lalu</p>			</div>

					</div>

				</div>	<div class="bg-white shadow-sm border-b">	<!-- Features Section -->



				<div class="flex items-center space-x-3">			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">

					<div class="w-2 h-2 bg-blue-500 rounded-full"></div>

					<div class="flex-1">				<div class="flex items-center">		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">	<section class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">

						<p class="text-sm text-gray-900">User baru <span class="font-semibold">Bima Saputra</span> terdaftar</p>

						<p class="text-xs text-gray-500">4 jam yang lalu</p>					<div class="p-2 bg-green-100 rounded-lg">

					</div>

				</div>						<i data-lucide="check-circle" class="w-6 h-6 text-green-600"></i>			<div class="flex justify-between items-center py-6">		<div class="p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl hover:scale-105 transition-transform">



				<div class="flex items-center space-x-3">					</div>

					<div class="w-2 h-2 bg-yellow-500 rounded-full"></div>

					<div class="flex-1">					<div class="ml-4">				<div>			<div class="flex justify-center items-center w-12 h-12 bg-indigo-600/20 rounded-xl mb-4">

						<p class="text-sm text-gray-900">Evaluasi <span class="font-semibold">Koperasi Maju Jaya</span> diperbarui</p>

						<p class="text-xs text-gray-500">6 jam yang lalu</p>						<p class="text-sm font-medium text-gray-600">Evaluasi Selesai</p>

					</div>

				</div>						<p class="text-2xl font-bold text-gray-900">18</p>					<h1 class="text-3xl font-bold text-gray-900">				<i data-lucide="cpu" class="w-6 h-6 text-indigo-400"></i>

			</div>

		</div>					</div>

	</div>

</div>				</div>						Selamat Datang, {#if user}{user.name}{/if}!			</div>

			</div>

					</h1>			<h3 class="text-xl font-semibold mb-2">Lightning Fast</h3>

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">

				<div class="flex items-center">					<p class="text-gray-600 mt-1">			<p class="text-gray-400">Experience blazing speed with modern architecture.</p>

					<div class="p-2 bg-yellow-100 rounded-lg">

						<i data-lucide="clock" class="w-6 h-6 text-yellow-600"></i>						Dashboard Admin Sistem Monitoring KDMP		</div>

					</div>

					<div class="ml-4">					</p>

						<p class="text-sm font-medium text-gray-600">Dalam Proses</p>

						<p class="text-2xl font-bold text-gray-900">6</p>				</div>		<div class="p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl hover:scale-105 transition-transform">

					</div>

				</div>				<div class="flex items-center space-x-4">			<div class="flex justify-center items-center w-12 h-12 bg-pink-600/20 rounded-xl mb-4">

			</div>

					<div class="text-right">				<i data-lucide="palette" class="w-6 h-6 text-pink-400"></i>

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">

				<div class="flex items-center">						<p class="text-sm text-gray-500">Role</p>			</div>

					<div class="p-2 bg-purple-100 rounded-lg">

						<i data-lucide="target" class="w-6 h-6 text-purple-600"></i>						<p class="font-semibold text-gray-900">{#if user}{user.role}{/if}</p>			<h3 class="text-xl font-semibold mb-2">Sleek Design</h3>

					</div>

					<div class="ml-4">					</div>			<p class="text-gray-400">Crafted with elegance using Tailwind’s modern utilities.</p>

						<p class="text-sm font-medium text-gray-600">Progress Rata-rata</p>

						<p class="text-2xl font-bold text-gray-900">75%</p>					<div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">		</div>

					</div>

				</div>						<i data-lucide="user" class="w-6 h-6 text-white"></i>

			</div>

		</div>					</div>		<div class="p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl hover:scale-105 transition-transform">



		<!-- Quick Actions -->				</div>			<div class="flex justify-center items-center w-12 h-12 bg-emerald-600/20 rounded-xl mb-4">

		<div class="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">

			<h2 class="text-xl font-semibold text-gray-900 mb-4">Aksi Cepat</h2>			</div>				<i data-lucide="sparkles" class="w-6 h-6 text-emerald-400"></i>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">

				<a href="/admin/users" class="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">		</div>			</div>

					<i data-lucide="users" class="w-8 h-8 text-blue-600 mr-3"></i>

					<div>	</div>			<h3 class="text-xl font-semibold mb-2">Smooth Animations</h3>

						<h3 class="font-semibold text-gray-900">Kelola Users</h3>

						<p class="text-sm text-gray-600">Tambah, edit, atau hapus pengguna</p>			<p class="text-gray-400">Enjoy built-in Tailwind transitions and pulse effects.</p>

					</div>

				</a>	<!-- Main Content -->		</div>



				<a href="/admin/evaluasi" class="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">	</section>

					<i data-lucide="clipboard-check" class="w-8 h-8 text-green-600 mr-3"></i>

					<div>		<!-- Quick Stats -->

						<h3 class="font-semibold text-gray-900">Evaluasi</h3>

						<p class="text-sm text-gray-600">Pantau progress evaluasi</p>		<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">	<!-- CTA Section -->

					</div>

				</a>			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">	<section class="mt-24 text-center max-w-3xl">



				<a href="/dashboard" class="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">				<div class="flex items-center">		<h2 class="text-4xl font-bold mb-4">

					<i data-lucide="bar-chart-3" class="w-8 h-8 text-purple-600 mr-3"></i>

					<div>					<div class="p-2 bg-blue-100 rounded-lg">			Ready to build something <span class="text-indigo-400">amazing</span>?

						<h3 class="font-semibold text-gray-900">Laporan</h3>

						<p class="text-sm text-gray-600">Lihat laporan dan statistik</p>						<i data-lucide="users" class="w-6 h-6 text-blue-600"></i>		</h2>

					</div>

				</a>					</div>		<p class="text-gray-400 mb-6">

			</div>

		</div>					<div class="ml-4">			Everything you need to design, develop, and deploy — all in one sleek setup.



		<!-- Recent Activity -->						<p class="text-sm font-medium text-gray-600">Total Users</p>		</p>

		<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">

			<h2 class="text-xl font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>						<p class="text-2xl font-bold text-gray-900">24</p>		<button class="px-8 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 hover:opacity-90 text-white font-semibold rounded-2xl transition-all duration-300">

			<div class="space-y-4">

				<div class="flex items-center space-x-3">					</div>			Start Now

					<div class="w-2 h-2 bg-green-500 rounded-full"></div>

					<div class="flex-1">				</div>		</button>

						<p class="text-sm text-gray-900">User <span class="font-semibold">Sinta Rahmawati</span> menyelesaikan evaluasi</p>

						<p class="text-xs text-gray-500">2 jam yang lalu</p>			</div>	</section>

					</div>

				</div></div>



				<div class="flex items-center space-x-3">			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">

					<div class="w-2 h-2 bg-blue-500 rounded-full"></div>				<div class="flex items-center">

					<div class="flex-1">					<div class="p-2 bg-green-100 rounded-lg">

						<p class="text-sm text-gray-900">User baru <span class="font-semibold">Bima Saputra</span> terdaftar</p>						<i data-lucide="check-circle" class="w-6 h-6 text-green-600"></i>

						<p class="text-xs text-gray-500">4 jam yang lalu</p>					</div>

					</div>					<div class="ml-4">

				</div>						<p class="text-sm font-medium text-gray-600">Evaluasi Selesai</p>

						<p class="text-2xl font-bold text-gray-900">18</p>

				<div class="flex items-center space-x-3">					</div>

					<div class="w-2 h-2 bg-yellow-500 rounded-full"></div>				</div>

					<div class="flex-1">			</div>

						<p class="text-sm text-gray-900">Evaluasi <span class="font-semibold">Koperasi Maju Jaya</span> diperbarui</p>

						<p class="text-xs text-gray-500">6 jam yang lalu</p>			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">

					</div>				<div class="flex items-center">

				</div>					<div class="p-2 bg-yellow-100 rounded-lg">

			</div>						<i data-lucide="clock" class="w-6 h-6 text-yellow-600"></i>

		</div>					</div>

	</div>					<div class="ml-4">

</div>						<p class="text-sm font-medium text-gray-600">Dalam Proses</p>
						<p class="text-2xl font-bold text-gray-900">6</p>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center">
					<div class="p-2 bg-purple-100 rounded-lg">
						<i data-lucide="target" class="w-6 h-6 text-purple-600"></i>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Progress Rata-rata</p>
						<p class="text-2xl font-bold text-gray-900">75%</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
			<h2 class="text-xl font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<a href="/admin/users" class="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
					<i data-lucide="users" class="w-8 h-8 text-blue-600 mr-3"></i>
					<div>
						<h3 class="font-semibold text-gray-900">Kelola Users</h3>
						<p class="text-sm text-gray-600">Tambah, edit, atau hapus pengguna</p>
					</div>
				</a>

				<a href="/admin/evaluasi" class="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
					<i data-lucide="clipboard-check" class="w-8 h-8 text-green-600 mr-3"></i>
					<div>
						<h3 class="font-semibold text-gray-900">Evaluasi</h3>
						<p class="text-sm text-gray-600">Pantau progress evaluasi</p>
					</div>
				</a>

				<a href="/dashboard" class="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
					<i data-lucide="bar-chart-3" class="w-8 h-8 text-purple-600 mr-3"></i>
					<div>
						<h3 class="font-semibold text-gray-900">Laporan</h3>
						<p class="text-sm text-gray-600">Lihat laporan dan statistik</p>
					</div>
				</a>
			</div>
		</div>

		<!-- Recent Activity -->
		<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
			<h2 class="text-xl font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
			<div class="space-y-4">
				<div class="flex items-center space-x-3">
					<div class="w-2 h-2 bg-green-500 rounded-full"></div>
					<div class="flex-1">
						<p class="text-sm text-gray-900">User <span class="font-semibold">Sinta Rahmawati</span> menyelesaikan evaluasi</p>
						<p class="text-xs text-gray-500">2 jam yang lalu</p>
					</div>
				</div>

				<div class="flex items-center space-x-3">
					<div class="w-2 h-2 bg-blue-500 rounded-full"></div>
					<div class="flex-1">
						<p class="text-sm text-gray-900">User baru <span class="font-semibold">Bima Saputra</span> terdaftar</p>
						<p class="text-xs text-gray-500">4 jam yang lalu</p>
					</div>
				</div>

				<div class="flex items-center space-x-3">
					<div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
					<div class="flex-1">
						<p class="text-sm text-gray-900">Evaluasi <span class="font-semibold">Koperasi Maju Jaya</span> diperbarui</p>
						<p class="text-xs text-gray-500">6 jam yang lalu</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>