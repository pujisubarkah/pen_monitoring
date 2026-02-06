<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let provinceId: string | undefined = '';
  import { provinces as provinceMap } from '$lib/constants/provinces';
  let provinceName = '';
  let loading = true;
  let error: string | null = null;
  let provinceTotals: any = null;
  let cooperativeOutlets: any[] = [];
  let districtDistribution: any[] = [];

  $: if ($page?.params?.id) {
    provinceId = $page.params.id;
  }

  onMount(async () => {
    if (!provinceId) return;
    try {
      const res = await fetch(`https://api.merahputih.kop.id/api/cooperatives/statistics-by-province-id/${provinceId}`);
      if (!res.ok) throw new Error('Gagal mengambil data statistik provinsi');
      const json = await res.json();
      const data = json.data;
      // Ambil summary dari state legalStageId 1 atau 3 (berbadan hukum)
      const summary = data.state.find((s: any) => s.legalStageId === 1) || data.state.find((s: any) => s.legalStageId === 3) || {};
      provinceTotals = {
        desa_kelurahan: summary.target,
        desa: summary.desa,
        kelurahan: summary.kelurahan,
        total: summary.count
      };
      districtDistribution = (data.mapping || []).map((item: any) => ({
        district_name: item.district,
        desa: item.desa,
        kelurahan: item.kelurahan,
        total: item.stage3,
        percentage: item.percentage
      }));
      const provObj = provinceMap.find(p => String(p.id) === String($page.params.id));
      provinceName = provObj ? provObj.name : $page.params.id?.replace(/-/g, ' ').toUpperCase() || '';
      loading = false;
    } catch (e) {
      error = (e instanceof Error ? e.message : String(e)) || 'Terjadi kesalahan saat mengambil data';
      loading = false;
    }
  });
</script>

<div class="max-w-7xl mx-auto px-4 py-6">
  <a href="/admin" class="inline-flex items-center mb-4 px-3 py-1.5 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium shadow transition-colors">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
    Kembali
  </a>
  <div class="text-xl font-bold mb-2 text-[#065366] flex items-center">
    <!-- Logo provinsi dihapus sesuai permintaan -->
    <span>Dashboard Koperasi Desa/Kelurahan Merah Putih Provinsi {provinceName}</span>
  </div>
  <time class="text-sm text-gray-500 mb-6 block">Status Data: {new Date().toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</time>
  {#if loading}
    <div class="text-center py-10 text-gray-500">Memuat data...</div>
  {:else if error}
    <div class="text-center py-10 text-red-500">{error}</div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      <div class="rounded-lg shadow bg-[#DB783E] text-white p-4 text-center">
        <div class="text-sm font-medium">Jumlah Desa/Kelurahan</div>
        <div class="text-2xl font-bold">{provinceTotals?.desa_kelurahan?.toLocaleString() ?? '-'}</div>
      </div>
      <div class="rounded-lg shadow bg-[#065366] text-white p-4 text-center">
        <div class="text-sm font-medium">Kelurahan Berbadan Hukum</div>
        <div class="text-2xl font-bold">{provinceTotals?.kelurahan?.toLocaleString() ?? '-'}</div>
      </div>
      <div class="rounded-lg shadow bg-[#a0ba3b] text-white p-4 text-center">
        <div class="text-sm font-medium">Desa Berbadan Hukum</div>
        <div class="text-2xl font-bold">{provinceTotals?.desa?.toLocaleString() ?? '-'}</div>
      </div>
      <div class="rounded-lg shadow bg-[#e5a80e] text-white p-4 text-center">
        <div class="text-sm font-medium">Total Berbadan Hukum</div>
        <div class="text-2xl font-bold">{provinceTotals?.total?.toLocaleString() ?? '-'}</div>
      </div>
    </div>
    <div class="mt-10 bg-white rounded-lg shadow p-4 md:p-6">
      <div class="my-4 flex items-center">
        <span class="text-lg font-semibold text-gray-700">Data Statistik Koperasi Desa/Kelurahan Merah Putih Berbadan Hukum Berdasarkan Kabupaten/Kota di Provinsi {provinceName}</span>
      </div>
      <div class="mb-4">
        <div class="font-semibold mb-2">Persentase Jumlah Desa/Kelurahan Berbadan Hukum</div>
        <!-- Tempatkan chart di sini jika ada -->
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto border border-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-2 py-2 border">No</th>
              <th class="px-2 py-2 border">Kabupaten/Kota</th>
              <th class="px-2 py-2 border">Jumlah Koperasi Kelurahan Terbentuk (Berbadan Hukum)</th>
              <th class="px-2 py-2 border">Jumlah Koperasi Desa Terbentuk (Berbadan Hukum)</th>
              <th class="px-2 py-2 border">Jumlah Koperasi Terbentuk (Berbadan Hukum)</th>
            </tr>
          </thead>
          <tbody>
            {#each districtDistribution as row, i}
              <tr class="odd:bg-white even:bg-gray-50">
                <td class="px-2 py-2 border text-center">{i + 1}</td>
                <td class="px-2 py-2 border">{row.district_name}</td>
                <td class="px-2 py-2 border text-right">{row.kelurahan?.toLocaleString() ?? '-'}</td>
                <td class="px-2 py-2 border text-right">{row.desa?.toLocaleString() ?? '-'}</td>
                <td class="px-2 py-2 border text-right">{row.total?.toLocaleString() ?? '-'}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

