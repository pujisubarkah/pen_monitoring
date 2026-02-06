
<script lang="ts">
import { onMount } from 'svelte';

let loading = true;
let error: string | null = null;
let statusDate = '';

let summary: any = {};
let geraiAktif: Array<{ jenis: string; jumlah: number }> = [];
let asetKoperasi: Array<{ kepemilikan: string; jumlah: number }> = [];
let kemitraan: Array<{ jenis: string; jumlah: number }> = [];
let simkopdesProv: Array<any> = [];

onMount(async () => {
  try {
    const res = await fetch('https://api.merahputih.kop.id/api/statistics/national/phase-2');
    if (!res.ok) throw new Error('Gagal mengambil data statistik nasional');
    const json = await res.json();
    const data = json.data;
    // Summary cards
    summary = {
      simkopdes: data.national_totals.microsite_accounts,
      koperasiGerai: data.national_totals.cooperatives_with_active_outlets,
      totalGerai: data.national_totals.active_outlets,
      kemitraan: data.national_totals.partnerships_count,
      kemitraanKoperasi: data.national_totals.cooperatives_with_partnerships,
      pengurus: data.national_totals.total_managements,
      pengurusL: data.national_totals.total_managements_male,
      pengurusP: data.national_totals.total_managements_female,
      anggota: data.national_totals.total_members,
      anggotaL: data.national_totals.total_members_male,
      anggotaP: data.national_totals.total_members_female
    };

    // Statistik Gerai Koperasi Aktif
    geraiAktif = (data.cooperative_outlets || []).map((item: any) => ({
      jenis: item.type,
      jumlah: item.total
    }));

    // Status Aset Koperasi
    asetKoperasi = (data.national_totals.cooperative_assets_distribution || []).map((item: any) => ({
      kepemilikan: item.final_asset_status === 'Other' ? 'Belum Mengisi Kepemilikan' : item.final_asset_status,
      jumlah: item.total
    }));

    // Permohonan Kemitraan Desa/Kelurahan
    kemitraan = (data.national_totals.cooperative_partnership_distribution || []).map((item: any) => ({
      jenis: item.service_name,
      jumlah: item.total
    }));

    // Digitalisasi Simkopdes per Provinsi
		simkopdesProv = (data.province_distribution || []).map((prov: any) => ({
			provinsi: prov.province_name,
			simkopdes: prov.accounts_count,
			koperasiGerai: prov.cooperatives_with_active_outlets,
			totalGerai: prov.active_outlets,
			koperasiKemitraan: prov.cooperatives_with_partnerships,
			totalKemitraan: prov.partnerships_count,
			province_id: prov.province_id,
			kabupaten: 'Klik Disini'
		}));

    // Status date
    statusDate = new Date().toLocaleString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    loading = false;
  } catch (e: any) {
    error = e.message || 'Terjadi kesalahan saat mengambil data';
    loading = false;
  }
});
</script>


<div class="w-full px-2 sm:px-4 py-4 sm:py-6 mx-auto max-w-7xl overflow-x-hidden">
	<div class="text-lg sm:text-xl font-bold mb-2 text-[#065366]">Pengembangan Usaha Koperasi Desa/Kelurahan Merah Putih</div>
	<time class="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-500 block">Status Data: {statusDate}</time>

	{#if loading}
		<div class="text-center py-10 text-gray-500">Memuat data...</div>
	{:else if error}
		<div class="text-center py-10 text-red-500">{error}</div>
	{:else}
		<!-- Summary Cards -->
		<div class="mb-4">
			<div class="flex flex-col gap-3 sm:gap-4">
				<div class="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div class="rounded-lg shadow text-white p-3 sm:p-4 text-center flex flex-col justify-center" style="background-color:#a0ba3b">
						<div class="text-xs sm:text-sm font-medium">Jumlah Koperasi Berakun Simkopdes (Microsite)</div>
						<div class="text-xl sm:text-2xl font-bold mt-2">{summary.simkopdes?.toLocaleString?.() ?? '-'}</div>
					</div>
					<div class="rounded-lg shadow text-white p-3 sm:p-4 text-center flex flex-col justify-center" style="background-color:#DB783E">
						<div class="text-xs sm:text-sm font-medium">Koperasi Memiliki Gerai (Min. 1)</div>
						<div class="text-xl sm:text-2xl font-bold mt-2">{summary.koperasiGerai?.toLocaleString?.() ?? '-'}</div>
						<div class="text-xs sm:text-sm font-medium mt-2">Total Gerai Koperasi Aktif</div>
						<div class="text-xl sm:text-2xl font-bold mt-2">{summary.totalGerai?.toLocaleString?.() ?? '-'}</div>
					</div>
					<div class="rounded-lg shadow text-white p-3 sm:p-4 text-center flex flex-col justify-center" style="background-color:#065366">
						<div class="text-xs sm:text-sm font-medium">Jumlah Kemitraan</div>
						<div class="text-xl sm:text-2xl font-bold mt-2">{summary.kemitraan?.toLocaleString?.() ?? '-'}</div>
						<div class="text-xs sm:text-sm font-medium mt-2">Dari</div>
						<div class="text-xl sm:text-2xl font-bold mt-2">{summary.kemitraanKoperasi?.toLocaleString?.() ?? '-'}</div>
						<div class="text-xs sm:text-sm font-medium mt-2">Koperasi Desa/Kelurahan</div>
					</div>
				</div>
				<div class="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
					<div class="rounded-lg shadow text-white p-3 sm:p-4 text-center flex flex-col gap-2" style="background-color:#0BA6DF">
						<div class="text-xs sm:text-sm font-medium">Pengurus/Pengawas Koperasi</div>
						<p class="text-lg sm:text-xl font-bold">{summary.pengurus?.toLocaleString?.() ?? '-'}</p>
						<div class="flex flex-col justify-around gap-2 sm:gap-0">
							<div class="items-center">
								<p class="text-2xl sm:text-3xl">👨</p>
								<p class="text-lg sm:text-xl font-bold">{summary.pengurusL?.toLocaleString?.() ?? '-'}</p>
								<p class="text-xs sm:text-sm">Laki-Laki</p>
							</div>
							<span class="w-full h-0.5 rounded bg-white"></span>
							<div class="items-center">
								<p class="text-2xl sm:text-3xl">👩</p>
								<p class="text-lg sm:text-xl font-bold">{summary.pengurusP?.toLocaleString?.() ?? '-'}</p>
								<p class="text-xs sm:text-sm">Perempuan</p>
							</div>
						</div>
					</div>
					<div class="rounded-lg shadow text-white p-3 sm:p-4 text-center flex flex-col gap-2" style="background-color:#9112BC">
						<div class="text-xs sm:text-sm font-medium">Anggota Koperasi</div>
						<p class="text-lg sm:text-xl font-bold">{summary.anggota?.toLocaleString?.() ?? '-'}</p>
						<div class="flex flex-col justify-around gap-2 sm:gap-0">
							<div class="items-center">
								<p class="text-2xl sm:text-3xl">👨</p>
								<p class="text-lg sm:text-xl font-bold">{summary.anggotaL?.toLocaleString?.() ?? '-'}</p>
								<p class="text-xs sm:text-sm">Laki-Laki</p>
							</div>
							<span class="w-full h-0.5 rounded bg-white"></span>
							<div class="items-center">
								<p class="text-2xl sm:text-3xl">👩</p>
								<p class="text-lg sm:text-xl font-bold">{summary.anggotaP?.toLocaleString?.() ?? '-'}</p>
								<p class="text-xs sm:text-sm">Perempuan</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Statistik Gerai Koperasi Aktif -->
	<div class="p-3 sm:p-4 mt-6 sm:mt-10 bg-white rounded-lg shadow md:p-6">
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
			<h2 class="flex-1 text-sm sm:text-base font-semibold text-center md:text-lg text-gray-800">Statistik Gerai Koperasi Aktif</h2>
		</div>
		<div class="overflow-x-auto -mx-3 sm:mx-0">
			<div class="inline-block min-w-full align-middle">
				<table class="min-w-full table-auto border border-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-2 py-2 border">No</th>
							<th class="px-2 py-2 border">Jenis Gerai</th>
							<th class="px-2 py-2 border">Jumlah Gerai Koperasi yang Sudah Aktif</th>
						</tr>
					</thead>
					<tbody>
						{#each geraiAktif as row, i}
							<tr class="odd:bg-white even:bg-gray-50">
								<td class="px-2 py-2 border text-center">{i + 1}</td>
								<td class="px-2 py-2 border">{row.jenis}</td>
								<td class="px-2 py-2 border text-right">{row.jumlah.toLocaleString()}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- Status Aset Koperasi -->
	<div class="mt-8">
		<div class="overflow-x-auto -mx-3 sm:mx-0">
			<div class="inline-block min-w-full align-middle">
				<div class="bg-white rounded-lg shadow p-4">
					<h2 class="text-center font-bold mb-2">Status Aset Koperasi</h2>
					<table class="min-w-full table-auto border border-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-2 py-2 border">No</th>
								<th class="px-2 py-2 border">Kepemilikan Aset</th>
								<th class="px-2 py-2 border">Jumlah Aset</th>
							</tr>
						</thead>
						<tbody>
							{#each asetKoperasi as row, i}
								<tr class="odd:bg-white even:bg-gray-50">
									<td class="px-2 py-2 border text-center">{i + 1}</td>
									<td class="px-2 py-2 border">{row.kepemilikan}</td>
									<td class="px-2 py-2 border text-right">{row.jumlah.toLocaleString()}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>

	<!-- Permohonan Kemitraan Desa/Kelurahan -->
	<div class="p-3 sm:p-4 mt-6 sm:mt-10 bg-white rounded-lg shadow md:p-6">
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
			<h2 class="flex-1 text-sm sm:text-base font-semibold text-center md:text-lg text-gray-800">Permohonan Kemitraan Desa/Kelurahan</h2>
		</div>
		<div class="overflow-x-auto -mx-3 sm:mx-0">
			<div class="inline-block min-w-full align-middle">
				<table class="min-w-full table-auto border border-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-2 py-2 border">No</th>
							<th class="px-2 py-2 border">Jenis Kemitraan</th>
							<th class="px-2 py-2 border">Jumlah</th>
						</tr>
					</thead>
					<tbody>
						{#each kemitraan as row, i}
							<tr class="odd:bg-white even:bg-gray-50">
								<td class="px-2 py-2 border text-center">{i + 1}</td>
								<td class="px-2 py-2 border">{row.jenis}</td>
								<td class="px-2 py-2 border text-right">{row.jumlah.toLocaleString()}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- Digitalisasi Simkopdes per Provinsi -->
	<div class="p-3 sm:p-4 mt-6 sm:mt-10 bg-white rounded-lg shadow md:p-6">
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
			<h2 class="flex-1 text-sm sm:text-base font-semibold text-center md:text-lg text-gray-800">Digitalisasi Simkopdes per Provinsi</h2>
		</div>
		<div class="overflow-x-auto -mx-3 sm:mx-0">
			<div class="inline-block min-w-full align-middle">
				<table class="min-w-full table-auto border border-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-2 py-2 border">No</th>
							<th class="px-2 py-2 border">Provinsi</th>
							<th class="px-2 py-2 border">Jumlah Koperasi yang Sudah Memiliki Akun Simkopdes (Microsite)</th>
							<th class="px-2 py-2 border">Jumlah Koperasi yang Sudah Memiliki Gerai (Minimal 1 Gerai)</th>
							<th class="px-2 py-2 border">Jumlah Keseluruhan Gerai Koperasi yang Sudah Aktif</th>
							<th class="px-2 py-2 border">Jumlah Koperasi Melakukan Permohonan Kemitraan</th>
							<th class="px-2 py-2 border">Jumlah Permohonan Kemitraan</th>
							<th class="px-2 py-2 border">Kabupaten/Kota</th>
						</tr>
					</thead>
					<tbody>
						{#each simkopdesProv as row, i}
							<tr class="odd:bg-white even:bg-gray-50">
								<td class="px-2 py-2 border text-center">{i + 1}</td>
								<td class="px-2 py-2 border">{row.provinsi}</td>
								<td class="px-2 py-2 border text-right">{row.simkopdes.toLocaleString()}</td>
								<td class="px-2 py-2 border text-right">{row.koperasiGerai.toLocaleString()}</td>
								<td class="px-2 py-2 border text-right">{row.totalGerai.toLocaleString()}</td>
								<td class="px-2 py-2 border text-right">{row.koperasiKemitraan.toLocaleString()}</td>
								<td class="px-2 py-2 border text-right">{row.totalKemitraan.toLocaleString()}</td>
																<td class="px-2 py-2 border text-center">
																		<a
																			href={`/admin/usaha_koperasi/kabupaten/${row.province_id}`}
																			class="text-blue-600 underline hover:text-blue-800"
																		>{row.kabupaten}</a>
																</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
