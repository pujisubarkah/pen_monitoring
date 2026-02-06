<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let provinceId: string | undefined = '';
  let provinceName = '';
  let loading = true;
  let error: string | null = null;
  let provinceTotals: any = null;
  let cooperativeOutlets: any[] = [];
  let districtDistribution: any[] = [];

  $: provinceId = $page.params.id;

  onMount(async () => {
    try {
      const res = await fetch(`https://api.merahputih.kop.id/api/statistics/province/phase-2/${provinceId}`);
      if (!res.ok) throw new Error('Gagal mengambil data statistik provinsi');
      const json = await res.json();
      const data = json.data;
      provinceTotals = data.province_totals;
      cooperativeOutlets = data.cooperative_outlets || [];
      districtDistribution = data.district_distribution || [];
      provinceName = json.message?.replace('Statistik distrik berhasil diambil untuk provinsi ', '') || '';
      loading = false;
    } catch (e: any) {
      error = e.message || 'Terjadi kesalahan saat mengambil data';
      loading = false;
    }
  });
</script>

<div class="w-full px-2 sm:px-4 py-4 sm:py-6 mx-auto max-w-7xl overflow-x-hidden">
  <div class="text-lg sm:text-xl font-bold mb-2 text-[#065366]">Detail Kabupaten/Kota - {provinceName}</div>
  {#if loading}
    <div class="text-center py-10 text-gray-500">Memuat data...</div>
  {:else if error}
    <div class="text-center py-10 text-red-500">{error}</div>
  {:else}
    <div class="mb-4">
      <div class="font-semibold mb-2">Statistik Provinsi:</div>
      <ul class="list-disc ml-6">
        <li>Akun Simkopdes: {provinceTotals?.microsite_accounts?.toLocaleString() ?? '-'}</li>
        <li>Koperasi Memiliki Gerai: {provinceTotals?.cooperatives_with_active_outlets?.toLocaleString() ?? '-'}</li>
        <li>Total Gerai Aktif: {provinceTotals?.active_outlets?.toLocaleString() ?? '-'}</li>
        <li>Koperasi Melakukan Kemitraan: {provinceTotals?.cooperatives_partnership_applications?.toLocaleString() ?? '-'}</li>
        <li>Total Kemitraan: {provinceTotals?.partnership_applications?.toLocaleString() ?? '-'}</li>
        <li>Pengajuan Pinjaman: {provinceTotals?.loan_applications?.toLocaleString() ?? '-'}</li>
        <li>Koperasi Pengajuan Pinjaman: {provinceTotals?.cooperatives_loan_applications?.toLocaleString() ?? '-'}</li>
      </ul>
    </div>
    <div class="mb-4">
      <div class="font-semibold mb-2">Distribusi Gerai Koperasi:</div>
      <table class="min-w-full table-auto border border-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-2 py-2 border">No</th>
            <th class="px-2 py-2 border">Jenis Gerai</th>
            <th class="px-2 py-2 border">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {#each cooperativeOutlets as row, i}
            <tr class="odd:bg-white even:bg-gray-50">
              <td class="px-2 py-2 border text-center">{i + 1}</td>
              <td class="px-2 py-2 border">{row.type}</td>
              <td class="px-2 py-2 border text-right">{row.total?.toLocaleString() ?? '-'}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div class="mb-4">
      <div class="font-semibold mb-2">Statistik Kabupaten/Kota:</div>
      <table class="min-w-full table-auto border border-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-2 py-2 border">No</th>
            <th class="px-2 py-2 border">Kabupaten/Kota</th>
            <th class="px-2 py-2 border">Akun Simkopdes</th>
            <th class="px-2 py-2 border">Koperasi Memiliki Gerai</th>
            <th class="px-2 py-2 border">Total Gerai Aktif</th>
            <th class="px-2 py-2 border">Koperasi Melakukan Kemitraan</th>
            <th class="px-2 py-2 border">Total Kemitraan</th>
            <th class="px-2 py-2 border">Pengajuan Pinjaman</th>
            <th class="px-2 py-2 border">Koperasi Pengajuan Pinjaman</th>
          </tr>
        </thead>
        <tbody>
          {#each districtDistribution as row, i}
            <tr class="odd:bg-white even:bg-gray-50">
              <td class="px-2 py-2 border text-center">{i + 1}</td>
              <td class="px-2 py-2 border">{row.district_name}</td>
              <td class="px-2 py-2 border text-right">{row.accounts_count?.toLocaleString() ?? '-'}</td>
              <td class="px-2 py-2 border text-right">{row.cooperatives_with_active_outlets?.toLocaleString() ?? '-'}</td>
              <td class="px-2 py-2 border text-right">{row.active_outlets?.toLocaleString() ?? '-'}</td>
              <td class="px-2 py-2 border text-right">{row.cooperatives_partnership_applications?.toLocaleString() ?? '-'}</td>
              <td class="px-2 py-2 border text-right">{row.partnerships_count?.toLocaleString() ?? '-'}</td>
              <td class="px-2 py-2 border text-right">{row.loans_count?.toLocaleString() ?? '-'}</td>
              <td class="px-2 py-2 border text-right">{row.cooperatives_loan_applications?.toLocaleString() ?? '-'}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
