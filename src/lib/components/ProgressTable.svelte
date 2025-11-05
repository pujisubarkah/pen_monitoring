<!-- src/lib/components/ProgressTable.svelte -->
<script>
  import ProgressPie from './ProgressPie.svelte';
  /** @type {Array<{id: string, no: number, aksi: string, indikator: string, tanggalUpdate: string, persentase: number}>} */
  export let items = [];
</script>

<table class="w-full border-collapse">
  <thead class="bg-gray-50">
    <tr>
      <th class="text-left p-2">No</th>
      <th class="text-left p-2">Aksi</th>
      <th class="text-left p-2">Indikator Capaian</th>
      <th class="text-left p-2">Tanggal Update</th>
      <th class="text-center p-2">Progress</th>
    </tr>
  </thead>
  <tbody>
    {#each items as item (item.id)}
      <tr class="border-t hover:bg-gray-50">
        <td class="p-2">{item.no}</td>
        <td class="p-2 max-w-xs truncate">{item.aksi}</td>
        <td class="p-2 max-w-sm truncate">{item.indikator}</td>
        <td class="p-2">
          {item.tanggalUpdate
            ? new Date(item.tanggalUpdate).toLocaleDateString('id-ID')
            : '-'}
        </td>
        <td class="p-2">
          <ProgressPie percentage={item.persentase} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>