<!-- src/lib/components/ActionPlanTable.svelte -->
<script lang="ts">
  import type { PlanActivity, PlanPic, PlanSchedule, Instansi } from '$lib/types';

  export let items: any[] = [];

  // Helper untuk format kegiatan (array of objects)
  function formatKegiatan(activities: PlanActivity[]) {
    if (!activities || activities.length === 0) return '-';
    
    return activities.map(activity => activity.kegiatan).join(', ');
  }

  // Helper untuk format PIC (array of objects dengan instansi)
  function formatPIC(pics: (PlanPic & { instansi?: Instansi })[]) {
    if (!pics || pics.length === 0) return '-';
    
    return pics.map(pic => {
      return pic.instansi ? pic.instansi.namaInstansi : pic.namaPic;
    }).join(', ');
  }

  // Helper untuk mendapatkan jadwal berdasarkan periode
  function getJadwalByPeriode(schedules: PlanSchedule[], periode: string) {
    if (!schedules) return null;
    return schedules.find(s => s.periode === periode);
  }

  // Helper untuk menentukan warna bullet
  function getBulletColor(isActive: boolean) {
    return isActive ? 'bg-green-500' : 'bg-gray-200';
  }
</script>

<div class="overflow-x-auto text-xs">
  <table class="min-w-full bg-white border border-gray-200">
    <thead class="bg-gray-50">
      <!-- Header Utama -->
      <tr>
        <th rowspan="3" class="px-4 py-2 border text-center font-medium text-gray-700 align-middle">PILAR</th>
        <th rowspan="3" class="px-4 py-2 border text-center font-medium text-gray-700 align-middle">KEGIATAN/AKSI</th>
        <th rowspan="3" class="px-4 py-2 border text-center font-medium text-gray-700 align-middle">PIC</th>
        <th rowspan="3" class="px-4 py-2 border text-center font-medium text-gray-700 align-middle">OUTPUT</th>
        <th rowspan="3" class="px-4 py-2 border text-center font-medium text-gray-700 align-middle">INDIKATOR KEBERHASILAN</th>
        <th colspan="10" class="px-4 py-2 border text-center font-medium text-gray-700 bg-blue-50">JADWAL PELAKSANAAN</th>
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
        {@const jadwalPendek = getJadwalByPeriode(item.schedules, 'pendek')}
        {@const jadwalMenengah = getJadwalByPeriode(item.schedules, 'menengah')}
        {@const jadwalPanjang = getJadwalByPeriode(item.schedules, 'panjang')}
        
        <tr class="hover:bg-gray-50">
          <!-- Pilar -->
          <td class="px-4 py-3 border align-top font-medium bg-gray-50 whitespace-normal">
            {item.pilar}
          </td>
          
          <!-- Kegiatan/Aksi -->
          <td class="px-4 py-3 border align-top whitespace-normal">
            <div class="space-y-1">
              {#each item.activities || [] as activity}
                <div class="text-gray-800 text-xs">• {activity.kegiatan}</div>
              {:else}
                <div class="text-gray-500">-</div>
              {/each}
            </div>
          </td>
          
          <!-- PIC -->
          <td class="px-4 py-3 border align-top whitespace-normal">
            <div class="space-y-1">
              {#each item.pics || [] as pic}
                <div class="text-gray-700 text-xs">
                  {pic.instansi ? pic.instansi.namaInstansi : pic.namaPic}
                </div>
              {:else}
                <div class="text-gray-500">-</div>
              {/each}
            </div>
          </td>
          
          <!-- Output -->
          <td class="px-4 py-3 border align-top whitespace-normal text-gray-700">
            {item.output || '-'}
          </td>
          
          <!-- Indikator Keberhasilan -->
          <td class="px-4 py-3 border align-top whitespace-normal text-gray-700">
            {item.indikatorKeberhasilan || '-'}
          </td>
          
          <!-- Jadwal Pelaksanaan -->
          
          <!-- Pendek -->
          <td class="px-2 py-2 border text-center align-middle">
            <div class="w-3 h-3 {jadwalPendek?.okt ? 'bg-blue-500' : 'bg-gray-200'} rounded-full mx-auto"></div>
          </td>
          <td class="px-2 py-2 border text-center align-middle">
            <div class="w-3 h-3 {jadwalPendek?.nov ? 'bg-blue-500' : 'bg-gray-200'} rounded-full mx-auto"></div>
          </td>
          <td class="px-2 py-2 border text-center align-middle">
            <div class="w-3 h-3 {jadwalPendek?.des ? 'bg-blue-500' : 'bg-gray-200'} rounded-full mx-auto"></div>
          </td>
          
          <!-- Menengah -->
          <td class="px-2 py-2 border text-center align-middle">
            <div class="w-3 h-3 {jadwalMenengah?.tw1 ? 'bg-green-500' : 'bg-gray-200'} rounded-full mx-auto"></div>
          </td>
          <td class="px-2 py-2 border text-center align-middle">
            <div class="w-3 h-3 {jadwalMenengah?.tw2 ? 'bg-green-500' : 'bg-gray-200'} rounded-full mx-auto"></div>
          </td>
          <td class="px-2 py-2 border text-center align-middle">
            <div class="w-3 h-3 {jadwalMenengah?.tw3 ? 'bg-green-500' : 'bg-gray-200'} rounded-full mx-auto"></div>
          </td>
          <td class="px-2 py-2 border text-center align-middle">
            <div class="w-3 h-3 {jadwalMenengah?.tw4 ? 'bg-green-500' : 'bg-gray-200'} rounded-full mx-auto"></div>
          </td>
          
          <!-- Panjang -->
          <td class="px-2 py-2 border text-center align-middle">
            <div class="w-3 h-3 {jadwalPanjang?.tahun2027 ? 'bg-yellow-500' : 'bg-gray-200'} rounded-full mx-auto"></div>
          </td>
          <td class="px-2 py-2 border text-center align-middle">
            <div class="w-3 h-3 {jadwalPanjang?.tahun2028 ? 'bg-yellow-500' : 'bg-gray-200'} rounded-full mx-auto"></div>
          </td>
          <td class="px-2 py-2 border text-center align-middle">
            <div class="w-3 h-3 {jadwalPanjang?.tahun2029 ? 'bg-yellow-500' : 'bg-gray-200'} rounded-full mx-auto"></div>
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