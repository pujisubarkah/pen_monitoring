<!-- src/lib/components/ActionPlanModal.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';

  export let isOpen = false;
  export let formData = {
    pilar: '',
    kegiatan: '',
    pic: '',
    output: '',
    indikator: '',
    jadwal: {} // bisa disesuaikan struktur jadwalnya
  };

  const dispatch = createEventDispatcher();

  function handleSubmit() {
    dispatch('submit', formData);
    dispatch('close');
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <form on:submit|preventDefault={handleSubmit} class="space-y-4 p-6">
        <h2 class="text-xl font-bold text-gray-900">Tambah Rencana Aksi</h2>

        <div>
          <label for="pilar" class="block text-sm font-medium text-gray-700 mb-1">Pilar</label>
          <input id="pilar" bind:value={formData.pilar} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label for="kegiatan" class="block text-sm font-medium text-gray-700 mb-1">Kegiatan/Aksi</label>
          <textarea id="kegiatan" bind:value={formData.kegiatan} rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <div>
          <label for="pic" class="block text-sm font-medium text-gray-700 mb-1">PIC</label>
          <input id="pic" bind:value={formData.pic} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label for="output" class="block text-sm font-medium text-gray-700 mb-1">Output</label>
          <input id="output" bind:value={formData.output} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label for="indikator" class="block text-sm font-medium text-gray-700 mb-1">Indikator Keberhasilan</label>
          <input id="indikator" bind:value={formData.indikator} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" on:click={() => dispatch('close')} class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
            Batal
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}