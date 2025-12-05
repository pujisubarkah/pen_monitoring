<!-- src/lib/components/UserActionPlanTable.svelte -->
<script lang="ts">
  import type { Instansi } from '$lib/server/schema';
  import { goto } from '$app/navigation';
  import { TrendingUp } from 'lucide-svelte';

  export let items: any[] = [];

  // Helper untuk menentukan warna bullet
  function getBulletColor(isActive: boolean) {
    return isActive ? 'bg-green-500' : 'bg-gray-200';
  }
</script>

<div class="overflow-auto text-xs" style="max-height: 60vh;">
  <table class="min-w-full bg-white border border-gray-200">
    <thead class="bg-gray-50">
      <!-- Header Utama -->
      <tr>
        <th rowspan="3" class="px-4 py-2 border text-center font-medium text-gray-700 align-middle">PILAR</th>
        <th rowspan="3" class="px-4 py-2 border text-center font-medium text-gray-700 align-middle">KEGIATAN/AKSI</th>
        <th rowspan="3" class="px-4 py-2 border text-center font-medium text-gray-700 align-middle">OUTPUT</th>
        <th rowspan="3" class="px-4 py-2 border text-center font-medium text-gray-700 align-middle">INDIKATOR KEBERHASILAN</th>
        <th colspan="10" class="px-4 py-2 border text-center font-medium text-gray-700 bg-blue-50">JADWAL PELAKSANAAN</th>
        <th rowspan="3" class="px-4 py-2 border text-center font-medium text-gray-700 align-middle">AKSI</th>
      </tr>
      
      <!-- Sub Header untuk Jadwal -->
      <tr>
        <th colspan="3" class="px-2 py-1 border text-center font-medium text-gray-600 bg-blue-100">PENDEK</th>
        <th colspan="4" class="px-2 py-1 border text-center font-medium text-gray-600 bg-green-100">MENENGAH (1 TAHUN)</th>
        <th colspan="3" class="px-2 py-1 border text-center font-medium text-gray-600 bg-yellow-100">PANJANG (3 TAHUN)</th>
      </tr>
      
      <!-- Header Bulan/Triwulan/Tahun -->
      <tr>
        <!-- Pendek -->
        <th class="px-1 py-1 border text-center font-normal text-gray-600 bg-blue-50">Okt</th>
        <th class="px-1 py-1 border text-center font-normal text-gray-600 bg-blue-50">Nov</th>
        <th class="px-1 py-1 border text-center font-normal text-gray-600 bg-blue-50">Des</th>
        
        <!-- Menengah -->
        <th class="px-1 py-1 border text-center font-normal text-gray-600 bg-green-50">TW 1</th>
        <th class="px-1 py-1 border text-center font-normal text-gray-600 bg-green-50">TW 2</th>
        <th class="px-1 py-1 border text-center font-normal text-gray-600 bg-green-50">TW 3</th>
        <th class="px-1 py-1 border text-center font-normal text-gray-600 bg-green-50">TW 4</th>
        
        <!-- Panjang -->
        <th class="px-1 py-1 border text-center font-normal text-gray-600 bg-yellow-50">2027</th>
        <th class="px-1 py-1 border text-center font-normal text-gray-600 bg-yellow-50">2028</th>
        <th class="px-1 py-1 border text-center font-normal text-gray-600 bg-yellow-50">2029</th>
      </tr>
    </thead>

    <tbody class="divide-y divide-gray-200">
      {#each items as item}
        {@const jadwalData = item.actionPlanSchedules && item.actionPlanSchedules.length > 0 ? {
          pendek: {
            okt: item.actionPlanSchedules[0].okt || false,
            nov: item.actionPlanSchedules[0].nov || false,
            des: item.actionPlanSchedules[0].des || false
          },
          menengah: {
            tw1: item.actionPlanSchedules[0].tw1 || false,
            tw2: item.actionPlanSchedules[0].tw2 || false,
            tw3: item.actionPlanSchedules[0].tw3 || false,
            tw4: item.actionPlanSchedules[0].tw4 || false
          },
          panjang: {
            '2027': item.actionPlanSchedules[0].tahun2027 || false,
            '2028': item.actionPlanSchedules[0].tahun2028 || false,
            '2029': item.actionPlanSchedules[0].tahun2029 || false
          }
        } : {}}
        {@const isFullDone = (
          (jadwalData.pendek?.okt && jadwalData.pendek?.nov && jadwalData.pendek?.des &&
           jadwalData.menengah?.tw1 && jadwalData.menengah?.tw2 && jadwalData.menengah?.tw3 && jadwalData.menengah?.tw4 &&
           jadwalData.panjang?.["2027"] && jadwalData.panjang?.["2028"] && jadwalData.panjang?.["2029"])
        )}
        <tr class="hover:bg-gray-50">
          <!-- Pilar -->
          <td class="px-4 py-3 border align-top font-medium bg-gray-50 whitespace-normal">
            {item.namaPilar || item.pilar || '-'}
          </td>
          <!-- Kegiatan/Aksi -->
          <td class="px-4 py-3 border align-top whitespace-normal">
            {item.namaKegiatan || item.kegiatan || '-'}
          </td>
          <!-- Output -->
          <td class="px-4 py-3 border align-top whitespace-normal text-gray-700">
            {item.output || '-'}
          </td>
          <!-- Indikator Keberhasilan -->
          <td class="px-4 py-3 border align-top whitespace-normal text-gray-700">
            {item.indikatorKeberhasilanDetails && item.indikatorKeberhasilanDetails.length > 0 ? item.indikatorKeberhasilanDetails.map((ind: any) => ind.deskripsi).join(', ') : '-'}
          </td>
          <!-- Jadwal Pelaksanaan -->
          {#if isFullDone}
            <td colspan="10" class="px-2 py-2 border text-center align-middle bg-green-500">
              <div class="w-full h-8 bg-green-500 rounded-lg transition-all"></div>
            </td>
          {:else}
            <!-- Pendek -->
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.pendek?.okt ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.pendek?.okt ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.pendek?.nov ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.pendek?.nov ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.pendek?.des ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.pendek?.des ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
            <!-- Menengah -->
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.menengah?.tw1 ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.menengah?.tw1 ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.menengah?.tw2 ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.menengah?.tw2 ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.menengah?.tw3 ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.menengah?.tw3 ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.menengah?.tw4 ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.menengah?.tw4 ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
            <!-- Panjang -->
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.panjang?.["2027"] ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.panjang?.["2027"] ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.panjang?.["2028"] ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.panjang?.["2028"] ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.panjang?.["2029"] ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.panjang?.["2029"] ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
          {/if}
          <!-- Aksi -->
          <td class="px-4 py-3 border align-top text-center">
            <div class="flex justify-center">
              <button
                class="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 hover:bg-green-200 rounded-md transition-colors border border-green-200"
                on:click={() => goto(`/user/progress?actionPlanId=${item.id}`)}
                title="Lihat Progress"
              >
                <TrendingUp size={16} />
              </button>
            </div>
          </td>
        </tr>
      {/each}
      
      {#if items.length === 0}
        <tr>
          <td colspan="15" class="px-6 py-8 text-center text-gray-500 border">
            Belum ada data rencana aksi
          </td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>

<style>
  table {
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #e2e8f0;
  }
</style>