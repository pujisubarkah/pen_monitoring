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
    jadwal: {
      jan: false,
      feb: false,
      mar: false,
      apr: false,
      may: false,
      jun: false,
      jul: false,
      aug: false,
      sep: false,
      oct: false,
      nov: false,
      dec: false
    }
  };

  const dispatch = createEventDispatcher();

  function handleSubmit() {
    dispatch('submit', formData);
    dispatch('close');
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-900">Tambah Rencana Aksi</h2>
        <button
          on:click={() => dispatch('close')}
          class="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Tutup modal"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Content - Scrollable -->
      <div class="flex-1 overflow-y-auto">
        <form on:submit|preventDefault={handleSubmit} class="space-y-4 p-6">
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

          <div>
            <label for="jadwal-section" class="block text-sm font-medium text-gray-700 mb-2">Jadwal Pelaksanaan</label>
            <div id="jadwal-section" class="grid grid-cols-3 gap-2">
              <label class="flex items-center space-x-2">
                <input type="checkbox" bind:checked={formData.jadwal.jan} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm">Jan</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" bind:checked={formData.jadwal.feb} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm">Feb</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" bind:checked={formData.jadwal.mar} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm">Mar</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" bind:checked={formData.jadwal.apr} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm">Apr</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" bind:checked={formData.jadwal.may} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm">May</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" bind:checked={formData.jadwal.jun} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm">Jun</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" bind:checked={formData.jadwal.jul} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm">Jul</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" bind:checked={formData.jadwal.aug} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm">Aug</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" bind:checked={formData.jadwal.sep} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm">Sep</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" bind:checked={formData.jadwal.oct} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm">Oct</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" bind:checked={formData.jadwal.nov} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm">Nov</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" bind:checked={formData.jadwal.dec} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm">Dec</span>
              </label>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
  </div>
{/if}