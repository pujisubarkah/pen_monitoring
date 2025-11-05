<!-- src/lib/components/ActionPlanTable.svelte -->
<script>
  /** @type {Array<{pilar: string, kegiatan: string, pic: string, output: string, indikator: string}>} */
  export let items = [];
</script>

<div class="overflow-x-auto">
  <table class="min-w-full bg-white border border-gray-200 rounded-lg">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pilar</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kegiatan/Aksi</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIC</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Output</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indikator Keberhasilan</th>
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
        </tr>
      {/each}
      {#if items.length === 0}
        <tr>
          <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
            Belum ada data rencana aksi
          </td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>