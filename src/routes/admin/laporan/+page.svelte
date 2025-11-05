<!-- src/routes/admin/laporan/+page.svelte -->
<script lang="ts">
	import ProgressTable from '$lib/components/ProgressTable.svelte';

	// Sample progress data
	const progressData = [
		{
			id: '1',
			no: 1,
			aksi: 'Implementasi Sistem Monitoring Terintegrasi',
			indikator: 'Sistem monitoring dapat menampilkan data real-time dari semua provinsi',
			tanggalUpdate: '2024-11-01',
			persentase: 85
		},
		{
			id: '2',
			no: 2,
			aksi: 'Pelatihan Staff IT di 34 Provinsi',
			indikator: 'Minimal 80% staff IT di setiap provinsi telah mengikuti pelatihan',
			tanggalUpdate: '2024-10-28',
			persentase: 92
		},
		{
			id: '3',
			no: 3,
			aksi: 'Upgrade Infrastruktur Jaringan Nasional',
			indikator: 'Kapasitas bandwidth meningkat 200% dari baseline',
			tanggalUpdate: '2024-10-25',
			persentase: 78
		},
		{
			id: '4',
			no: 4,
			aksi: 'Audit Keamanan Sistem di Seluruh Indonesia',
			indikator: '100% sistem lolos audit keamanan dengan skor minimal 85%',
			tanggalUpdate: '2024-10-20',
			persentase: 45
		},
		{
			id: '5',
			no: 5,
			aksi: 'Implementasi Backup Otomatis Terpusat',
			indikator: 'Sistem backup otomatis aktif di 100% lokasi',
			tanggalUpdate: '2024-10-15',
			persentase: 67
		},
		{
			id: '6',
			no: 6,
			aksi: 'Digitalisasi Dokumen dan Arsip',
			indikator: '95% dokumen penting telah didigitalisasi',
			tanggalUpdate: '2024-10-10',
			persentase: 89
		},
		{
			id: '7',
			no: 7,
			aksi: 'Pengembangan Dashboard Monitoring Real-time',
			indikator: 'Dashboard dapat diakses oleh semua stakeholder dengan update real-time',
			tanggalUpdate: '2024-10-05',
			persentase: 73
		},
		{
			id: '8',
			no: 8,
			aksi: 'Koordinasi Lintas Sektor dengan K/L',
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

		<!-- Summary Cards -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
			<div class="bg-white rounded-lg shadow-md p-6">
				<div class="flex items-center">
					<div class="p-3 bg-blue-100 rounded-full">
						<span class="text-2xl">📊</span>
					</div>
					<div class="ml-4">
						<h3 class="text-lg font-semibold text-gray-900">Total Aksi</h3>
						<p class="text-3xl font-bold text-blue-600">{progressData.length}</p>
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
							{progressData.filter(item => item.persentase === 100).length}
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
							{progressData.filter(item => item.persentase > 0 && item.persentase < 100).length}
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
							{progressData.filter(item => item.persentase === 0).length}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Progress Table -->
		<div class="bg-white rounded-lg shadow-md p-6">
			<div class="mb-6">
				<h2 class="text-xl font-bold text-gray-900 mb-2">Detail Progress Aksi</h2>
				<p class="text-gray-600">Data progress terakhir dari seluruh implementasi aksi PEN</p>
			</div>

			<div class="overflow-x-auto">
				<ProgressTable items={progressData} />
			</div>
		</div>

		<!-- Export Button -->
		<div class="mt-6 text-center">
			<button class="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium inline-flex items-center gap-2">
				<span>📊</span>
				<span>Export Laporan</span>
			</button>
		</div>
	</div>
</div>