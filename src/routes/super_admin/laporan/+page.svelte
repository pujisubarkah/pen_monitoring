<!-- src/routes/admin/laporan/+page.svelte -->
<script lang="ts">
import ProgressTable from '$lib/components/ProgressTable.svelte';
import { onMount } from 'svelte';

// Fungsi export PDF
async function exportToPDF() {
    // Dynamic import for SSR compatibility
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
    ]);
    const table = document.querySelector('.progress-table-export') as HTMLElement;
    if (!table) return;
    const canvas = await html2canvas(table, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = { width: canvas.width, height: canvas.height };
    const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
    const imgWidth = imgProps.width * ratio;
    const imgHeight = imgProps.height * ratio;
    pdf.addImage(imgData, 'PNG', (pageWidth - imgWidth) / 2, 40, imgWidth, imgHeight);
    pdf.save('laporan-progress.pdf');
}

	type ProgressItem = {
		id: string;
		actionPlanId?: number;
		no: number;
		aksi: string;
		pic: string;
		picId?: number;
		indikator: string;
		tanggalUpdate: string;
		persentase: number;
	};

	type PICItem = {
		id: number;
		namaInstansi: string;
	};

	let progressData: ProgressItem[] = [];
	let loading = false;
	let error = '';
	let summary = {
		total: 0,
		completed: 0,
		inProgress: 0,
		notStarted: 0
	};
	let pagination = {
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 0
	};
	let picList: PICItem[] = [];
	let selectedPIC = '';

	async function loadPICList() {
		try {
			const response = await fetch('/api/instansi');
			const result = await response.json();
			if (result.success) {
				picList = result.data;
			}
		} catch (err) {
			console.error('Error loading PIC list:', err);
		}
	}

	async function loadProgressData() {
		try {
			loading = true;
			error = '';

			const params = new URLSearchParams({
				page: pagination.page.toString(),
				limit: pagination.limit.toString()
			});

			if (selectedPIC) {
				params.append('picId', selectedPIC);
			}

			const response = await fetch(`/api/reports/action-plans-summary?${params}`);
			const result = await response.json();

			if (result.success) {
				// Data already pre-calculated from server
				progressData = result.data;
				summary = result.summary;
				pagination = result.pagination;
			} else {
				error = result.error || 'Failed to load progress data';
				console.error('Failed to load progress data:', result.error);
			}
		} catch (err) {
			error = 'Error loading data';
			console.error('Error loading progress data:', err);
		} finally {
			loading = false;
		}
	}

	function handlePageChange(newPage: number) {
		pagination.page = newPage;
		loadProgressData();
	}

	function handlePICFilterChange() {
		pagination.page = 1; // Reset to first page when filter changes
		loadProgressData();
	}

	onMount(() => {
		loadPICList();
		loadProgressData();
	});

	// Sample progress data (fallback)
	const sampleData = [
		{
			id: '1',
			no: 1,
			aksi: 'Implementasi Sistem Monitoring Terintegrasi',
			pic: 'Kemenkominfo, Kemendagri',
			indikator: 'Sistem monitoring dapat menampilkan data real-time dari semua provinsi',
			tanggalUpdate: '2024-11-01',
			persentase: 85
		},
		{
			id: '2',
			no: 2,
			aksi: 'Pelatihan Staff IT di 34 Provinsi',
			pic: 'Kemenkominfo, Bappenas',
			indikator: 'Minimal 80% staff IT di setiap provinsi telah mengikuti pelatihan',
			tanggalUpdate: '2024-10-28',
			persentase: 92
		},
		{
			id: '3',
			no: 3,
			aksi: 'Upgrade Infrastruktur Jaringan Nasional',
			pic: 'Kemenkominfo',
			indikator: 'Kapasitas bandwidth meningkat 200% dari baseline',
			tanggalUpdate: '2024-10-25',
			persentase: 78
		},
		{
			id: '4',
			no: 4,
			aksi: 'Audit Keamanan Sistem di Seluruh Indonesia',
			pic: 'Kemenkominfo, BSSN',
			indikator: '100% sistem lolos audit keamanan dengan skor minimal 85%',
			tanggalUpdate: '2024-10-20',
			persentase: 45
		},
		{
			id: '5',
			no: 5,
			aksi: 'Implementasi Backup Otomatis Terpusat',
			pic: 'Kemenkominfo',
			indikator: 'Sistem backup otomatis aktif di 100% lokasi',
			tanggalUpdate: '2024-10-15',
			persentase: 67
		},
		{
			id: '6',
			no: 6,
			aksi: 'Digitalisasi Dokumen dan Arsip',
			pic: 'Kemenkominfo, Kemendagri',
			indikator: '95% dokumen penting telah didigitalisasi',
			tanggalUpdate: '2024-10-10',
			persentase: 89
		},
		{
			id: '7',
			no: 7,
			aksi: 'Pengembangan Dashboard Monitoring Real-time',
			pic: 'Kemenkominfo',
			indikator: 'Dashboard dapat diakses oleh semua stakeholder dengan update real-time',
			tanggalUpdate: '2024-10-05',
			persentase: 73
		},
		{
			id: '8',
			no: 8,
			aksi: 'Koordinasi Lintas Sektor dengan K/L',
			pic: 'Bappenas, Kemenkominfo',
			indikator: 'Minimal 15 K/L terintegrasi dalam sistem monitoring',
			tanggalUpdate: '2024-09-30',
			persentase: 56
		}
	];
</script>

<svelte:head>
	<title>Laporan Progress - Admin Panel</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-7xl mx-auto">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Laporan Progress Aksi</h1>
			<p class="text-gray-600">Pantau progress implementasi aksi PEN di seluruh Indonesia</p>
		</div>

		{#if loading}
			<div class="flex items-center justify-center py-12">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				<span class="ml-3 text-gray-600">Memuat data progress...</span>
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
				<div class="flex items-center">
					<div class="text-red-500 text-xl mr-3">⚠️</div>
					<div>
						<h3 class="text-red-800 font-semibold">Terjadi Kesalahan</h3>
						<p class="text-red-600">{error}</p>
						<button 
							class="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
							on:click={loadProgressData}
						>
							Coba Lagi
						</button>
					</div>
				</div>
			</div>
		{:else}
			<!-- Summary Cards -->
			<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				<div class="bg-white rounded-lg shadow-md p-6">
					<div class="flex items-center">
						<div class="p-3 bg-blue-100 rounded-full">
							<span class="text-2xl">📊</span>
						</div>
						<div class="ml-4">
							<h3 class="text-lg font-semibold text-gray-900">Total Aksi</h3>
							<p class="text-3xl font-bold text-blue-600">{progressData.length > 0 ? summary.total : sampleData.length}</p>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow-md p-6">
					<div class="flex items-center">
						<div class="p-3 bg-green-100 rounded-full">
							<span class="text-2xl">✅</span>
						</div>
						<div class="ml-4">
							<h3 class="text-lg font-semibold text-gray-900">Selesai</h3>
							<p class="text-3xl font-bold text-green-600">
								{progressData.length > 0 ? summary.completed : sampleData.filter(item => item.persentase === 100).length}
							</p>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow-md p-6">
					<div class="flex items-center">
						<div class="p-3 bg-yellow-100 rounded-full">
							<span class="text-2xl">⚡</span>
						</div>
						<div class="ml-4">
							<h3 class="text-lg font-semibold text-gray-900">Sedang Berjalan</h3>
							<p class="text-3xl font-bold text-yellow-600">
								{progressData.length > 0 ? summary.inProgress : sampleData.filter(item => item.persentase > 0 && item.persentase < 100).length}
							</p>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow-md p-6">
					<div class="flex items-center">
						<div class="p-3 bg-red-100 rounded-full">
							<span class="text-2xl">⏳</span>
						</div>
						<div class="ml-4">
							<h3 class="text-lg font-semibold text-gray-900">Belum Dimulai</h3>
							<p class="text-3xl font-bold text-red-600">
								{progressData.length > 0 ? summary.notStarted : sampleData.filter(item => item.persentase === 0).length}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Progress Table -->
			<div class="bg-white rounded-lg shadow-md p-6">
				<div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div>
						<h2 class="text-xl font-bold text-gray-900 mb-2">Detail Progress Aksi</h2>
						<p class="text-gray-600">Data progress terakhir dari seluruh implementasi aksi PEN</p>
					</div>
					
					<!-- Filters -->
					<div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
						<div class="flex items-center gap-2">
							<label for="limitSelect" class="text-sm font-medium text-gray-700 whitespace-nowrap">Per halaman:</label>
							<select 
								id="limitSelect"
								bind:value={pagination.limit}
								on:change={() => { pagination.page = 1; loadProgressData(); }}
								class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value={10}>10</option>
								<option value={25}>25</option>
								<option value={50}>50</option>
								<option value={100}>100</option>
							</select>
						</div>
						<div class="flex items-center gap-2">
							<label for="picFilter" class="text-sm font-medium text-gray-700 whitespace-nowrap">Filter PIC:</label>
							<select 
								id="picFilter"
								bind:value={selectedPIC}
								on:change={handlePICFilterChange}
								class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
							>
								<option value="">Semua PIC</option>
								{#each picList as pic}
									<option value={pic.id}>{pic.namaInstansi}</option>
								{/each}
							</select>
						</div>
					</div>
				</div>

				<div class="overflow-x-auto">
					<div class="progress-table-export">
						<ProgressTable items={progressData.length > 0 ? progressData : sampleData} />
					</div>
				</div>

				<!-- Pagination Controls -->
				{#if progressData.length > 0 && pagination.totalPages > 1}
					<div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
						<div class="text-sm text-gray-600">
							Menampilkan {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} data
						</div>
						
						<div class="flex items-center gap-2">
							<button
								on:click={() => handlePageChange(1)}
								disabled={pagination.page === 1}
								class="px-3 py-2 border rounded-lg {pagination.page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}"
							>
								«
							</button>
							<button
								on:click={() => handlePageChange(pagination.page - 1)}
								disabled={pagination.page === 1}
								class="px-3 py-2 border rounded-lg {pagination.page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}"
							>
								‹
							</button>
							
							{#each Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
								const start = Math.max(1, Math.min(pagination.page - 2, pagination.totalPages - 4));
								return start + i;
							}) as pageNum}
								<button
									on:click={() => handlePageChange(pageNum)}
									class="px-4 py-2 border rounded-lg {pagination.page === pageNum ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}"
								>
									{pageNum}
								</button>
							{/each}
							
							<button
								on:click={() => handlePageChange(pagination.page + 1)}
								disabled={pagination.page === pagination.totalPages}
								class="px-3 py-2 border rounded-lg {pagination.page === pagination.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}"
							>
								›
							</button>
							<button
								on:click={() => handlePageChange(pagination.totalPages)}
								disabled={pagination.page === pagination.totalPages}
								class="px-3 py-2 border rounded-lg {pagination.page === pagination.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}"
							>
								»
							</button>
						</div>
					</div>
				{/if}
			</div>

			<!-- Export Button -->
			<div class="mt-6 text-center">
				<button type="button" on:click={exportToPDF} class="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium inline-flex items-center gap-2">
					<span>📊</span>
					<span>Export Laporan</span>
				</button>
			</div>
		{/if}
	</div>
</div>