<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { TrendingUp, Target, CheckCircle, BarChart3, Download, Building2 } from 'lucide-svelte';

	// =====================================
	// Types
	// =====================================
	type ProgressItem = {
		id: number;
		pilar: string;
		kegiatan: string;
		target_value: number;
		capaian_value: number;
		bukti: string | null;
		penjelasan: string | null;
		created_at: string | null;
		output: string | null;
	};

	type Statistics = {
		totalTarget: number;
		totalCapaian: number;
		percentage: number;
		onTrack: number;
		behind: number;
		completed: number;
	};

	// =====================================
	// State
	// =====================================
	let progressData: ProgressItem[] = [];
	let statistics: Statistics = {
		totalTarget: 0,
		totalCapaian: 0,
		percentage: 0,
		onTrack: 0,
		behind: 0,
		completed: 0
	};
	let loading = true;
	let error = '';
	let instansiName: string = '';

	// Get user data from parent layout
	$: userData = $page.data.user;
	$: instansiId = userData?.instansi_id;

	// =====================================
	// Fetch Data dari API
	// =====================================
	async function fetchProgress() {
		try {
			loading = true;
			error = '';

			if (!instansiId) {
				error = "Anda belum ditugaskan ke instansi manapun";
				loading = false;
				return;
			}

			// Fetch instansi name
			try {
				const instansiResponse = await fetch(`/api/instansi/${instansiId}`);
				const instansiResult = await instansiResponse.json();
				if (instansiResult.success && instansiResult.data) {
					instansiName = instansiResult.data.namaInstansi;
				}
			} catch (err) {
				console.error('Error loading instansi name:', err);
			}

			const res = await fetch(`/api/action-plans/instansi/${instansiId}`);
			const json = await res.json();

			if (!json.success) {
				error = "Gagal memuat data progress";
				return;
			}

			// Transform data from action-plans endpoint
			const transformedData: ProgressItem[] = [];
			
			json.data.forEach((actionPlan: any) => {
				// Each action plan might have multiple progresses
				if (actionPlan.actionPlanProgresses && actionPlan.actionPlanProgresses.length > 0) {
					actionPlan.actionPlanProgresses.forEach((progress: any) => {
						transformedData.push({
							id: progress.id,
							pilar: actionPlan.namaPilar || '-',
							kegiatan: actionPlan.namaKegiatan || '-',
							target_value: progress.target ?? 0,
							capaian_value: progress.capaian ?? 0,
							bukti: progress.bukti,
							penjelasan: progress.penjelasan,
							created_at: progress.createdAt,
							output: actionPlan.output
						});
					});
				}
			});

			progressData = transformedData;

			// Calculate statistics
			calculateStatistics();
		} catch (err) {
			console.error("Error fetching progress:", err);
			error = "Terjadi kesalahan saat memuat data";
		} finally {
			loading = false;
		}
	}

	// =====================================
	// Calculate Statistics
	// =====================================
	function calculateStatistics() {
		let totalTarget = 0;
		let totalCapaian = 0;
		let onTrack = 0;
		let behind = 0;
		let completed = 0;

		progressData.forEach(item => {
			totalTarget += item.target_value;
			totalCapaian += item.capaian_value;

			const percentage = item.target_value > 0 ? (item.capaian_value / item.target_value) * 100 : 0;
			
			if (percentage >= 100) {
				completed++;
			} else if (percentage >= 70) {
				onTrack++;
			} else {
				behind++;
			}
		});

		statistics = {
			totalTarget,
			totalCapaian,
			percentage: totalTarget > 0 ? Math.round((totalCapaian / totalTarget) * 100) : 0,
			onTrack,
			behind,
			completed
		};
	}

	onMount(() => {
		fetchProgress();
	});
</script>

<svelte:head>
	<title>Dashboard Instansi - {instansiName}</title>
</svelte:head>

<main class="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 p-6">
	<div class="max-w-7xl mx-auto space-y-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<div class="p-3 bg-blue-100 rounded-lg">
					<Building2 size={32} class="text-blue-600" />
				</div>
				<div>
					<h1 class="text-3xl font-bold text-gray-900">Dashboard Instansi</h1>
					<p class="text-gray-600 mt-1">{instansiName || 'Memuat...'}</p>
				</div>
			</div>
			<button
				on:click={() => window.print()}
				class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
			>
				<Download size={18} />
				<span>Export</span>
			</button>
		</div>

		{#if loading}
			<div class="flex items-center justify-center py-20">
				<div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
				<span class="ml-4 text-gray-600 text-lg">Memuat data dashboard...</span>
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
				<div class="text-red-500 text-5xl mb-4">⚠️</div>
				<h3 class="text-xl font-semibold text-red-800 mb-2">Terjadi Kesalahan</h3>
				<p class="text-red-600 mb-4">{error}</p>
				<button 
					class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
					on:click={fetchProgress}
				>
					Coba Lagi
				</button>
			</div>
		{:else}
			<!-- Statistics Cards -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<!-- Total Target -->
				<div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-gray-600 text-sm font-medium">Total Target</p>
							<p class="text-3xl font-bold text-blue-600 mt-2">{statistics.totalTarget}</p>
						</div>
						<div class="p-3 bg-blue-100 rounded-full">
							<Target size={24} class="text-blue-600" />
						</div>
					</div>
				</div>

				<!-- Total Capaian -->
				<div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-gray-600 text-sm font-medium">Total Capaian</p>
							<p class="text-3xl font-bold text-green-600 mt-2">{statistics.totalCapaian}</p>
						</div>
						<div class="p-3 bg-green-100 rounded-full">
							<TrendingUp size={24} class="text-green-600" />
						</div>
					</div>
				</div>

				<!-- Persentase -->
				<div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-gray-600 text-sm font-medium">Persentase Capaian</p>
							<p class="text-3xl font-bold text-purple-600 mt-2">{statistics.percentage}%</p>
						</div>
						<div class="p-3 bg-purple-100 rounded-full">
							<BarChart3 size={24} class="text-purple-600" />
						</div>
					</div>
				</div>

				<!-- Completed -->
				<div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-gray-600 text-sm font-medium">Selesai / Total</p>
							<p class="text-3xl font-bold text-emerald-600 mt-2">{statistics.completed}/{progressData.length}</p>
						</div>
						<div class="p-3 bg-emerald-100 rounded-full">
							<CheckCircle size={24} class="text-emerald-600" />
						</div>
					</div>
				</div>
			</div>

			<!-- Overall Progress Bar -->
			<div class="bg-white rounded-xl shadow-lg p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Progress Keseluruhan</h3>
				<div class="space-y-3">
					<div class="flex justify-between text-sm text-gray-600">
						<span>Target: {statistics.totalTarget}</span>
						<span>Capaian: {statistics.totalCapaian} ({statistics.percentage}%)</span>
					</div>
					<div class="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
						<div
							class="h-6 rounded-full bg-linear-to-r from-blue-500 to-green-500 transition-all duration-500 flex items-center justify-end pr-3"
							style="width: {statistics.percentage}%"
						>
							<span class="text-white text-xs font-bold">{statistics.percentage}%</span>
						</div>
					</div>
					<div class="flex gap-4 pt-2">
						<div class="flex items-center gap-2">
							<div class="w-3 h-3 rounded-full bg-emerald-500"></div>
							<span class="text-sm text-gray-600">Selesai: {statistics.completed}</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="w-3 h-3 rounded-full bg-blue-500"></div>
							<span class="text-sm text-gray-600">On Track: {statistics.onTrack}</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="w-3 h-3 rounded-full bg-orange-500"></div>
							<span class="text-sm text-gray-600">Tertunda: {statistics.behind}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Detail Progress per Item -->
			<div class="bg-white rounded-xl shadow-lg p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-6">Detail Progress per Kegiatan</h3>
				
				{#if progressData.length === 0}
					<div class="text-center py-12">
						<div class="text-gray-400 mb-4">
							<BarChart3 size={48} class="mx-auto" />
						</div>
						<p class="text-gray-500">Belum ada data progress untuk instansi ini</p>
					</div>
				{:else}
					<div class="space-y-6">
						{#each progressData as item, index}
							{@const percentage = item.target_value > 0 ? Math.round((item.capaian_value / item.target_value) * 100) : 0}
							{@const status = percentage >= 100 ? 'completed' : percentage >= 70 ? 'on-track' : 'behind'}
							
							<div class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
								<!-- Header -->
								<div class="flex items-start justify-between mb-4">
									<div class="flex-1">
										<div class="flex items-center gap-3 mb-2">
											<span class="text-2xl font-bold text-gray-300">#{index + 1}</span>
											<div>
												<h4 class="font-semibold text-gray-900">{item.kegiatan}</h4>
												<p class="text-sm text-gray-500">{item.pilar}</p>
											</div>
										</div>
										{#if item.output}
											<div class="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
												<p class="text-sm text-gray-700 font-medium mb-1">Output:</p>
												<p class="text-sm text-gray-600 whitespace-pre-line">{item.output}</p>
											</div>
										{/if}
										{#if item.penjelasan}
											<p class="text-sm text-gray-600 mt-2">{item.penjelasan}</p>
										{/if}
									</div>
								</div>

								<!-- Progress -->
								<div class="space-y-3">
									<div class="flex items-center justify-between text-sm">
										<span class="text-gray-600">Target: <span class="font-semibold text-blue-600">{item.target_value}</span></span>
										<span class="text-gray-600">Capaian: <span class="font-semibold text-green-600">{item.capaian_value}</span></span>
										<span class="font-semibold {
											status === 'completed' ? 'text-emerald-600' :
											status === 'on-track' ? 'text-blue-600' :
											'text-orange-600'
										}">{percentage}%</span>
									</div>
									
									<div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
										<div
											class="h-4 rounded-full transition-all duration-500 {
												status === 'completed' ? 'bg-emerald-500' :
												status === 'on-track' ? 'bg-blue-500' :
												'bg-orange-500'
											}"
											style="width: {Math.min(percentage, 100)}%"
										></div>
									</div>

									<!-- Status Badge -->
									<div class="flex items-center gap-3">
										<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium {
											status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
											status === 'on-track' ? 'bg-blue-100 text-blue-700' :
											'bg-orange-100 text-orange-700'
										}">
											{status === 'completed' ? '✓ Selesai' :
											status === 'on-track' ? '→ On Track' :
											'⚠ Tertunda'}
										</span>
										{#if item.created_at}
											<span class="text-xs text-gray-500">Update: {new Date(item.created_at).toLocaleDateString('id-ID')}</span>
										{/if}
									</div>

									<!-- Bukti -->
									{#if item.bukti}
										<div class="pt-2 border-t border-gray-100">
											<a
												href={item.bukti}
												target="_blank"
												class="text-sm text-blue-600 hover:text-blue-700 underline"
											>
												📎 Lihat Bukti/Dokumentasi
											</a>
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</main>

<style>
	@media print {
		button {
			display: none !important;
		}
	}
</style>
