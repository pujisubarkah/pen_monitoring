<script lang="ts">
	import OrganizationalChart from '$lib/components/OrganizationalChart.svelte';
	import { onMount } from 'svelte';

	// Sample organizational structure data for Pilar Koperasi Merah Putih
	let instansiData = [
		{
			id: 1,
			instansiId: 1,
			namaInstansi: 'Kementerian Koperasi & UKM',
			children: [
				{
					id: 2,
					instansiId: 2,
					namaInstansi: 'Pilar Pembiayaan',
					children: [
						{
							id: 3,
							instansiId: 3,
							namaInstansi: 'Lembaga Keuangan Mikro',
							children: []
						},
						{
							id: 4,
							instansiId: 4,
							namaInstansi: 'Koperasi Simpan Pinjam',
							children: []
						},
						{
							id: 5,
							instansiId: 5,
							namaInstansi: 'Bank Koperasi',
							children: []
						}
					]
				},
				{
					id: 6,
					instansiId: 6,
					namaInstansi: 'Pilar Pengembangan SDM',
					children: [
						{
							id: 7,
							instansiId: 7,
							namaInstansi: 'Pelatihan & Sertifikasi',
							children: []
						},
						{
							id: 8,
							instansiId: 8,
							namaInstansi: 'Pendidikan Koperasi',
							children: []
						},
						{
							id: 9,
							instansiId: 9,
							namaInstansi: 'Pengembangan Kompetensi',
							children: []
						}
					]
				},
				{
					id: 10,
					instansiId: 10,
					namaInstansi: 'Pilar Pengembangan Usaha',
					children: [
						{
							id: 11,
							instansiId: 11,
							namaInstansi: 'Inkubasi Bisnis',
							children: []
						},
						{
							id: 12,
							instansiId: 12,
							namaInstansi: 'Pengembangan UMKM',
							children: []
						},
						{
							id: 13,
							instansiId: 13,
							namaInstansi: 'Kemitraan Strategis',
							children: []
						}
					]
				},
				{
					id: 14,
					instansiId: 14,
					namaInstansi: 'Pilar Pengembangan Produk',
					children: [
						{
							id: 15,
							instansiId: 15,
							namaInstansi: 'Standarisasi Produk',
							children: []
						},
						{
							id: 16,
							instansiId: 16,
							namaInstansi: 'Inovasi Produk',
							children: []
						},
						{
							id: 17,
							instansiId: 17,
							namaInstansi: 'Sertifikasi Halal',
							children: []
						}
					]
				},
				{
					id: 18,
					instansiId: 18,
					namaInstansi: 'Pilar Pemasaran',
					children: [
						{
							id: 19,
							instansiId: 19,
							namaInstansi: 'Marketplace Koperasi',
							children: []
						},
						{
							id: 20,
							instansiId: 20,
							namaInstansi: 'Ekspor Produk',
							children: []
						},
						{
							id: 21,
							instansiId: 21,
							namaInstansi: 'Promosi & Branding',
							children: []
						}
					]
				},
				{
					id: 22,
					instansiId: 22,
					namaInstansi: 'Pilar Digitalisasi',
					children: [
						{
							id: 23,
							instansiId: 23,
							namaInstansi: 'Sistem Informasi',
							children: []
						},
						{
							id: 24,
							instansiId: 24,
							namaInstansi: 'E-commerce Platform',
							children: []
						},
						{
							id: 25,
							instansiId: 25,
							namaInstansi: 'Digital Marketing',
							children: []
						}
					]
				},
				{
					id: 26,
					instansiId: 26,
					namaInstansi: 'Pilar Jejaring Koperasi',
					children: [
						{
							id: 27,
							instansiId: 27,
							namaInstansi: 'Koperasi Primer',
							children: []
						},
						{
							id: 28,
							instansiId: 28,
							namaInstansi: 'Koperasi Sekunder',
							children: []
						},
						{
							id: 29,
							instansiId: 29,
							namaInstansi: 'Koperasi Nasional',
							children: []
						}
					]
				}
			]
		}
	];

	let loading = false;
	let error = '';

	// Note: In a real application, this would fetch hierarchical data from an API
	// For now, we're using static sample data to demonstrate the organizational chart
	onMount(() => {
		// Could fetch hierarchical data here in the future
		// fetchInstansiHierarchy();
	});
</script>

<section class="peta-kinerja-section">
	<div class="section-header">
		<h1 class="section-title">Peta Kinerja Pilar Koperasi Merah Putih</h1>
		<p class="section-subtitle">Struktur organisasi dan hierarki program koperasi nasional</p>
	</div>

	<div class="chart-container">
		<div class="chart-info">
			<div class="info-icon">�</div>
			<div class="info-content">
				<h4 class="info-title">Pilar Koperasi Merah Putih</h4>
				<p class="info-description">
					Peta hierarki 7 pilar strategis pengembangan koperasi nasional yang mencakup pembiayaan, SDM, usaha, produk, pemasaran, digitalisasi, dan jejaring koperasi.
				</p>
			</div>
		</div>

		<OrganizationalChart data={instansiData} />
	</div>
</section>

<style>
	.peta-kinerja-section {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.section-header {
		margin-bottom: 2rem;
		text-align: center;
	}

	.section-title {
		font-size: 2.5rem;
		font-weight: bold;
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.section-subtitle {
		font-size: 1.125rem;
		color: #6b7280;
	}

	.chart-container {
		background: #ffffff;
		border-radius: 12px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		padding: 2rem;
		min-height: 400px;
	}

	.chart-info {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.info-icon {
		font-size: 2rem;
		flex-shrink: 0;
	}

	.info-content {
		flex: 1;
	}

	.info-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1e293b;
		margin-bottom: 0.5rem;
	}

	.info-description {
		color: #64748b;
		font-size: 0.875rem;
		line-height: 1.5;
		margin: 0;
	}
</style>
