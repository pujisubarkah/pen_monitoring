
<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import StatCard from '$lib/components/cards/StatCard.svelte';
	import ProgressChart from '$lib/components/charts/ProgressChart.svelte';

	// Store for admin info
	export const adminInfo = writable({ adminName: '' });

	// Dummy data for dashboard stats
	let stats = $state([
		{
			title: 'Total Pengguna',
			value: 1250,
			subtitle: 'Pengguna terdaftar',
			icon: '👥',
			trend: 'up' as const,
			trendValue: '+12%',
			color: 'blue' as const
		},
		{
			title: 'Rencana Aksi',
			value: 89,
			subtitle: 'Aksi aktif',
			icon: '📋',
			trend: 'up' as const,
			trendValue: '+5%',
			color: 'green' as const
		},
		{
			title: 'Progress Rata-rata',
			value: '78%',
			subtitle: 'Pencapaian target',
			icon: '📈',
			trend: 'up' as const,
			trendValue: '+3%',
			color: 'purple' as const
		},
		{
			title: 'Instansi Terlibat',
			value: 45,
			subtitle: 'Instansi aktif',
			icon: '🏢',
			trend: 'neutral' as const,
			trendValue: '0%',
			color: 'yellow' as const
		}
	]);

	// Dummy data for progress chart
	let progressData = $state([
		{ date: 'Jan', value: 20, label: 'Januari' },
		{ date: 'Feb', value: 35, label: 'Februari' },
		{ date: 'Mar', value: 45, label: 'Maret' },
		{ date: 'Apr', value: 60, label: 'April' },
		{ date: 'May', value: 72, label: 'Mei' },
		{ date: 'Jun', value: 78, label: 'Juni' }
	]);

	function updateAdminFromLocalStorage() {
		if (typeof localStorage !== 'undefined') {
			const user = localStorage.getItem('user');
			if (user) {
				try {
					const parsed = JSON.parse(user);
					adminInfo.set({
						adminName: parsed.nama || parsed.name || 'Admin'
					});
				} catch (e) {
					adminInfo.set({ adminName: 'Admin' });
				}
			} else {
				adminInfo.set({ adminName: 'Admin' });
			}
		}
	}

	onMount(() => {
		updateAdminFromLocalStorage();
		window.addEventListener('storage', updateAdminFromLocalStorage);
	});

	// Quick action handlers
	function goToLaporan() {
		goto('/admin/laporan');
	}

	function goToRencanaAksi() {
		goto('/admin/rencana_aksi');
	}

	function goToUsers() {
		goto('/admin/users');
	}

	function goToPetaKinerja() {
		goto('/admin/peta_kinerja');
	}
</script>


<svelte:head>
	<title>Admin Dashboard - PEN Monitor</title>
</svelte:head>

<main class="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 p-6">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2 animate-fade-in">
				Selamat Datang, {$adminInfo.adminName}!
			</h1>
			<p class="text-lg text-gray-600">
				Dashboard Admin PEN Monitoring - Pantau dan kelola progress aksi PEN dengan mudah.
			</p>
		</div>

		<!-- Stats Cards Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			{#each stats as stat, index}
				<div class="animate-slide-up" style="animation-delay: {index * 0.1}s">
					<StatCard
						title={stat.title}
						value={stat.value}
						subtitle={stat.subtitle}
						icon={stat.icon}
						trend={stat.trend}
						trendValue={stat.trendValue}
						color={stat.color}
					/>
				</div>
			{/each}
		</div>

		<!-- Charts Section -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Progress Chart -->
			<div class="bg-white rounded-xl shadow-lg p-6 animate-fade-in" style="animation-delay: 0.4s">
				<h2 class="text-xl font-semibold text-gray-900 mb-4">Progress Bulanan</h2>
				<ProgressChart data={progressData} title="Progress Pencapaian Target" />
			</div>

			<!-- Quick Actions -->
			<div class="bg-white rounded-xl shadow-lg p-6 animate-fade-in" style="animation-delay: 0.5s">
				<h2 class="text-xl font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
				<div class="space-y-3">
					<button onclick={goToLaporan} class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
						📊 Lihat Laporan
					</button>
					<button onclick={goToRencanaAksi} class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
						➕ Tambah Rencana Aksi
					</button>
					<button onclick={goToUsers} class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
						👥 Kelola Pengguna
					</button>
					<button onclick={goToPetaKinerja} class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
						📍 Lihat Peta Kinerja
					</button>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes slide-up {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.6s ease-out forwards;
		opacity: 0;
	}

	.animate-slide-up {
		animation: slide-up 0.5s ease-out forwards;
		opacity: 0;
	}
</style>

