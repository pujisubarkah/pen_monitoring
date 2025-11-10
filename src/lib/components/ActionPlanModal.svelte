<!-- src/lib/components/ActionPlanModal.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';

  export let isOpen = false;
  export let editMode = false;
  export const selectedItem: any = null;
  export let formData = {
    pilarId: '',
    kegiatanId: '',
    pic: [''],  
    output: '',
    jadwalId: '', // Add jadwalId for editing existing schedule
    indikatorKeberhasilan: [''], // Add indikator keberhasilan
    jadwal: {
      pendek: {
        okt: false,
        nov: false,
        des: false
      },
      menengah: {
        tw1: false,
        tw2: false,
        tw3: false,
        tw4: false
      },
      panjang: {
        '2027': false,
        '2028': false,
        '2029': false
      }
    }
  };  const dispatch = createEventDispatcher();

  let instansiList: { id: number; namaInstansi: string }[] = [];
  let loadingInstansi = true;
  let instansiError = '';

  // Kegiatan state
  let kegiatanList: { id: number; pilarId: number; nama_kegiatan: string; pilar: { nama_pilar: string } }[] = [];
  let loadingKegiatan = true;
  let kegiatanError = '';

  // Pilar state
  let pilarList: { id: number; nama_pilar: string }[] = [];
  let loadingPilar = true;
  let pilarError = '';

  async function fetchInstansi() {
    try {
      loadingInstansi = true;
      instansiError = '';

      const response = await fetch('/api/instansi');
      const result = await response.json();

      if (result.success) {
        instansiList = result.data;
      } else {
        throw new Error('Failed to fetch instansi data');
      }
    } catch (error) {
      console.error('Error fetching instansi:', error);
      instansiError = 'Gagal memuat data instansi';
    } finally {
      loadingInstansi = false;
    }
  }

  function addPIC() {
    formData.pic = [...formData.pic, ''];
  }

  function removePIC(index: number) {
    if (formData.pic.length > 1) {
      formData.pic = formData.pic.filter((_, i) => i !== index);
    }
  }

  function addIndikator() {
    formData.indikatorKeberhasilan = [...formData.indikatorKeberhasilan, ''];
  }

  function removeIndikator(index: number) {
    if (formData.indikatorKeberhasilan.length > 1) {
      formData.indikatorKeberhasilan = formData.indikatorKeberhasilan.filter((_, i) => i !== index);
    }
  }

  async function handleSubmit() {
    try {
      // Filter out empty PIC and indikator keberhasilan, prepare data
      const formDataToSend = {
        pilarId: formData.pilarId,
        kegiatanId: formData.kegiatanId,
        pics: formData.pic.filter(p => p.trim() !== ''),
        indikatorKeberhasilan: formData.indikatorKeberhasilan.filter(i => i.trim() !== ''),
        output: formData.output,
        jadwalId: formData.jadwalId, // Include jadwalId for updates
        jadwal: formData.jadwal
      };

      dispatch('submit', formDataToSend);
    } catch (error) {
      console.error('Error preparing form data:', error);
      alert('Terjadi kesalahan saat memproses data form');
    }
  }

  function handleBackdropClick() {
    dispatch('close');
  }

  function handleModalClick(event: MouseEvent | KeyboardEvent) {
    event.stopPropagation();
  }

  function resetForm() {
    formData = {
      pilarId: '',
      kegiatanId: '',
      pic: [''],
      indikatorKeberhasilan: [''], // Reset indikator keberhasilan
      output: '',
      jadwalId: '', // Reset jadwalId
      jadwal: {
        pendek: {
          okt: false,
          nov: false,
          des: false
        },
        menengah: {
          tw1: false,
          tw2: false,
          tw3: false,
          tw4: false
        },
        panjang: {
          '2027': false,
          '2028': false,
          '2029': false
        }
      }
    };
  }


  async function fetchKegiatan() {
    try {
      loadingKegiatan = true;
      kegiatanError = '';
      const response = await fetch('/api/kegiatan');
      const result = await response.json();
      if (Array.isArray(result)) {
        kegiatanList = result;
      } else if (result && Array.isArray(result.data)) {
        kegiatanList = result.data;
      } else {
        throw new Error('Format data kegiatan tidak valid');
      }
    } catch (error) {
      console.error('Error fetching kegiatan:', error);
      kegiatanError = 'Gagal memuat data kegiatan';
    } finally {
      loadingKegiatan = false;
    }
  }

  async function fetchPilar() {
    try {
      loadingPilar = true;
      pilarError = '';
      const response = await fetch('/api/pilar');
      const result = await response.json();
      if (Array.isArray(result)) {
        pilarList = result;
      } else {
        throw new Error('Format data pilar tidak valid');
      }
    } catch (error) {
      console.error('Error fetching pilar:', error);
      pilarError = 'Gagal memuat data pilar';
    } finally {
      loadingPilar = false;
    }
  }

  onMount(() => {
    fetchInstansi();
    fetchKegiatan();
    fetchPilar();
  });

  $: if (!isOpen) {
    resetForm();
  }

  $: filteredKegiatanList = (function () {
    if (!formData.pilarId) return kegiatanList;

    // prefer numeric pilarId comparison when available
    const pid = formData.pilarId.toString();

    return kegiatanList.filter(kegiatan => {
      // if kegiatan has pilarId property, use it
      if (kegiatan.pilarId !== undefined && kegiatan.pilarId !== null) {
        return kegiatan.pilarId.toString() === pid;
      }

      // fallback: compare by pilar name when only nested pilar object is present
      const selectedPilar = pilarList.find(p => p.id.toString() === pid);
      if (selectedPilar && kegiatan.pilar && kegiatan.pilar.nama_pilar) {
        return kegiatan.pilar.nama_pilar === selectedPilar.nama_pilar;
      }

      return false;
    });
  })();
</script>

{#if isOpen}
  <!-- Backdrop -->
  <div class="fixed inset-0 bg-transparant bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4" on:click={handleBackdropClick} on:keydown={(e) => { if (e.key === 'Escape') dispatch('close'); }} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
    <!-- Modal Content -->
    <div
      class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] flex flex-col"
      on:click={handleModalClick}
      on:keydown={(event) => { if (event.key === 'Enter' || event.key === ' ') handleModalClick(event); }}
      role="dialog"
      tabindex="0"
      aria-modal="true"
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 id="modal-title" class="text-xl font-bold text-gray-900">{editMode ? 'Edit Rencana Aksi' : 'Tambah Rencana Aksi'}</h2>
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
        <form on:submit|preventDefault={handleSubmit} class="space-y-6 p-6">
          <!-- Pilar -->
          <div>
            <label for="pilar" class="block text-sm font-medium text-gray-700 mb-2">Pilar</label>
            {#if loadingPilar}
              <div class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span class="text-gray-500 text-sm">Memuat data pilar...</span>
              </div>
            {:else if pilarError}
              <input
                id="pilar"
                bind:value={formData.pilarId}
                class="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50 focus:ring-red-500 focus:border-red-500"
                placeholder="Pilar"
                required
              />
              <p class="text-red-600 text-sm mt-1">{pilarError}</p>
            {:else}
              <select
                id="pilar"
                bind:value={formData.pilarId}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih Pilar</option>
                {#each pilarList as pilar}
                  <option value={pilar.id}>{pilar.nama_pilar}</option>
                {/each}
              </select>
            {/if}
          </div>

          <!-- Kegiatan -->
          <div>
            <label for="kegiatan" class="block text-sm font-medium text-gray-700 mb-2">Kegiatan</label>
            {#if loadingKegiatan}
              <div class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span class="text-gray-500 text-sm">Memuat data kegiatan...</span>
              </div>
            {:else if kegiatanError}
              <input
                id="kegiatan"
                bind:value={formData.kegiatanId}
                class="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50 focus:ring-red-500 focus:border-red-500"
                placeholder="Kegiatan"
                required
              />
              <p class="text-red-600 text-sm mt-1">{kegiatanError}</p>
            {:else}
              <select
                id="kegiatan"
                bind:value={formData.kegiatanId}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={!formData.pilarId}
              >
                <option value="">
                  {formData.pilarId ? 'Pilih Kegiatan' : 'Pilih Pilar terlebih dahulu'}
                </option>
                {#each filteredKegiatanList as kegiatan}
                  <option value={kegiatan.id}>{kegiatan.nama_kegiatan}</option>
                {/each}
              </select>
            {/if}
          </div>

          <!-- PIC (Multiple) -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="block text-sm font-medium text-gray-700">PIC</h3>
              <button 
                type="button" 
                on:click={addPIC}
                class="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
              >
                + Tambah PIC
              </button>
            </div>
            <div class="space-y-2">
              {#each formData.pic as pic, index}
                <div class="flex gap-2">
                  {#if loadingInstansi}
                    <div class="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
                      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      <span class="text-gray-500 text-sm">Memuat data instansi...</span>
                    </div>
                  {:else if instansiError}
                    <input 
                      bind:value={formData.pic[index]}
                      class="flex-1 px-3 py-2 border border-red-300 rounded-md bg-red-50 focus:ring-red-500 focus:border-red-500" 
                      placeholder={`PIC ${index + 1}`}
                    />
                  {:else}
                    <select
                      bind:value={formData.pic[index]}
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Pilih Instansi PIC</option>
                      {#each instansiList as instansi}
                        <option value={instansi.id.toString()}>{instansi.namaInstansi}</option>
                      {/each}
                    </select>
                  {/if}
                  {#if formData.pic.length > 1}
                    <button 
                      type="button" 
                      on:click={() => removePIC(index)}
                      class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                      aria-label="Hapus PIC"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  {/if}
                </div>
              {/each}
            </div>
            {#if instansiError}
              <p class="text-red-600 text-sm mt-1">{instansiError}</p>
            {/if}
          </div>

          <!-- Indikator Keberhasilan (Multiple) -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="block text-sm font-medium text-gray-700">Indikator Keberhasilan</h3>
              <button 
                type="button" 
                on:click={addIndikator}
                class="text-sm bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
              >
                + Tambah Indikator
              </button>
            </div>
            <div class="space-y-2">
              {#each formData.indikatorKeberhasilan as indikator, index}
                <div class="flex gap-2">
                  <input 
                    bind:value={formData.indikatorKeberhasilan[index]}
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" 
                    placeholder={`Indikator keberhasilan ${index + 1}`}
                  />
                  {#if formData.indikatorKeberhasilan.length > 1}
                    <button 
                      type="button" 
                      on:click={() => removeIndikator(index)}
                      class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                      aria-label="Hapus Indikator"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  {/if}
                </div>
              {/each}
            </div>
          </div>

          <!-- Output -->
          <div>
            <label for="output" class="block text-sm font-medium text-gray-700 mb-2">Output</label>
            <textarea 
              id="output" 
              bind:value={formData.output} 
              rows="3" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Deskripsi output yang diharapkan"
            ></textarea>
          </div>

          <!-- Jadwal Pelaksanaan -->
          <div class="border-t pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Jadwal Pelaksanaan</h3>
            
            <!-- Pendek -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-3 bg-blue-50 px-3 py-2 rounded-md">PENDEK</h4>
              <div class="grid grid-cols-3 gap-4">
                <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" bind:checked={formData.jadwal.pendek.okt} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm font-medium">Okt</span>
                </label>
                <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" bind:checked={formData.jadwal.pendek.nov} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm font-medium">Nov</span>
                </label>
                <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" bind:checked={formData.jadwal.pendek.des} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm font-medium">Des</span>
                </label>
              </div>
            </div>

            <!-- Menengah -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-3 bg-green-50 px-3 py-2 rounded-md">MENENGAH (1 TAHUN)</h4>
              <div class="grid grid-cols-2 gap-4">
                <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" bind:checked={formData.jadwal.menengah.tw1} class="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  <span class="text-sm font-medium">Triwulan 1</span>
                </label>
                <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" bind:checked={formData.jadwal.menengah.tw2} class="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  <span class="text-sm font-medium">Triwulan 2</span>
                </label>
                <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" bind:checked={formData.jadwal.menengah.tw3} class="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  <span class="text-sm font-medium">Triwulan 3</span>
                </label>
                <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" bind:checked={formData.jadwal.menengah.tw4} class="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  <span class="text-sm font-medium">Triwulan 4</span>
                </label>
              </div>
            </div>

            <!-- Panjang -->
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-3 bg-yellow-50 px-3 py-2 rounded-md">PANJANG (3 TAHUN)</h4>
              <div class="grid grid-cols-3 gap-4">
                <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" bind:checked={formData.jadwal.panjang['2027']} class="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" />
                  <span class="text-sm font-medium">2027</span>
                </label>
                <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" bind:checked={formData.jadwal.panjang['2028']} class="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" />
                  <span class="text-sm font-medium">2028</span>
                </label>
                <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" bind:checked={formData.jadwal.panjang['2029']} class="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" />
                  <span class="text-sm font-medium">2029</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button 
              type="button" 
              on:click={() => dispatch('close')} 
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {editMode ? 'Update Rencana Aksi' : 'Simpan Rencana Aksi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}