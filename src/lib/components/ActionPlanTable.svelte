<!-- src/lib/components/ActionPlanTable.svelte -->
<script>
  /** @type {Array<{pilar: string, kegiatan: string, pic: string, output: string, indikator: string, jadwal: {jan: boolean, feb: boolean, mar: boolean, apr: boolean, may: boolean, jun: boolean, jul: boolean, aug: boolean, sep: boolean, oct: boolean, nov: boolean, dec: boolean}}>} */
  export let items = [];

  function formatSchedule(/** @type {{jan: boolean, feb: boolean, mar: boolean, apr: boolean, may: boolean, jun: boolean, jul: boolean, aug: boolean, sep: boolean, oct: boolean, nov: boolean, dec: boolean}} */ jadwal) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const selectedMonths = months.filter((month, index) => {
      return jadwal[/** @type {keyof typeof jadwal} */ (monthKeys[index])];
    });
    return selectedMonths.join(', ') || '-';
  }
</script>

<div class="overflow-x-auto">
  <table class="min-w-full bg-white border border-gray-200 rounded-lg">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pilar</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kegiatan/Aksi</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIC</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Output</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indikator</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jadwal</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      {#each items as item}
        <tr class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.pilar}</td>
          <td class="px-6 py-4 text-sm text-gray-900">{item.kegiatan}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.pic}</td>
          <td class="px-6 py-4 text-sm text-gray-900">{item.output}</td>
          <td class="px-6 py-4 text-sm text-gray-900">{item.indikator}</td>
          <td class="px-6 py-4 text-sm text-gray-900">{formatSchedule(item.jadwal)}</td>
        </tr>
      {/each}
      {#if items.length === 0}
        <tr>
          <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
            Belum ada data rencana aksi
          </td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>