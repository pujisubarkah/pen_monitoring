<!-- src/lib/components/AksiModal.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';

  export let isOpen = false;
  export let formData = {
    pilar: '',
    kegiatan: '',
    target_value: '',
    target_desc: '',
    capaian_value: '',
    capaian_desc: '',
    bukti: '',
    penjelasan: '',
    milestone: '',
  };

  const dispatch = createEventDispatcher();

  let instansiList: { namaInstansi: string }[] = [];
  let loadingInstansi = true;
  let instansiError = '';

  // Pilar state
  let pilarList: { id: number; nama_pilar: string }[] = [];
  let loadingPilar = true;
  let pilarError = '';

  // Kegiatan state (dropdown)
  let kegiatanList: string[] = [
    'Sosialisasi',
    'Pelatihan',
    'Penyusunan Dokumen',
    'Monitoring',
    'Evaluasi',
    'Lainnya'
  ];

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

  async function fetchPilar() {
    try {
      loadingPilar = true;
      pilarError = '';
      const response = await fetch('/api/pilar');
      const result = await response.json();
      if (Array.isArray(result)) {
        pilarList = result;
      } else if (result && Array.isArray(result.data)) {
        pilarList = result.data;
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

  // PIC logic removed

  async function handleSubmit() {
    try {
      const filteredData = {
        pilar: formData.pilar,
        kegiatan: formData.kegiatan,
        target_value: formData.target_value,
        target_desc: formData.target_desc,
        capaian_value: formData.capaian_value,
        capaian_desc: formData.capaian_desc,
        bukti: formData.bukti,
        penjelasan: formData.penjelasan,
        milestone: formData.milestone,
      };
      dispatch('submit', filteredData);
      dispatch('close');
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan aksi');
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
      pilar: '',
      kegiatan: '',
      target_value: '',
      target_desc: '',
      capaian_value: '',
      capaian_desc: '',
      bukti: '',
      penjelasan: '',
      milestone: '',
    };
  }

  onMount(() => {
    fetchInstansi();
    fetchPilar();
  });

  $: if (!isOpen) {
    resetForm();
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fadein" on:click={handleBackdropClick} on:keydown={(e) => { if (e.key === 'Escape') dispatch('close'); }} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
    <div
      class="bg-white border-2 border-blue-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] flex flex-col animate-modalpop transition-all duration-300"
      on:click={handleModalClick}
      on:keydown={(event) => { if (event.key === 'Enter' || event.key === ' ') handleModalClick(event); }}
      role="dialog"
      tabindex="0"
      aria-modal="true"
    >
  <div class="flex items-center justify-between px-8 py-6 rounded-t-2xl bg-linear-to-r from-blue-50 via-white to-blue-50 border-b-2 border-blue-100 shadow-sm">
        <h2 id="modal-title" class="text-2xl font-extrabold text-blue-700 tracking-tight">Tambah Aksi</h2>
        <button
          on:click={() => dispatch('close')}
          class="text-blue-400 hover:text-blue-700 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Tutup modal"
        >
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <form class="flex-1 flex flex-col gap-3 px-8 py-6 overflow-y-auto" on:submit|preventDefault={handleSubmit}>
        <!-- Pilar -->
        <div class="flex items-center gap-6 mb-3">
          <label for="pilar" class="w-48 text-blue-900 font-bold">Pilar</label>
          <div class="flex-1">
            {#if loadingPilar}
              <div class="flex items-center text-sm text-gray-500 py-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Memuat data pilar...
              </div>
            {:else if pilarError}
              <div class="text-red-600 text-sm py-2">{pilarError}</div>
            {:else}
              <select
                id="pilar"
                bind:value={formData.pilar}
                class="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                required
              >
                <option value="">Pilih Pilar</option>
                {#each pilarList as pilar (pilar.id)}
                  <option value={pilar.nama_pilar}>{pilar.nama_pilar}</option>
                {/each}
              </select>
            {/if}
          </div>
        </div>
        <!-- Kegiatan -->
        <div class="flex items-center gap-6 mb-3">
          <label for="kegiatan" class="w-48 text-blue-900 font-bold">Kegiatan/Aksi</label>
          <select
            id="kegiatan"
            bind:value={formData.kegiatan}
            class="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            required
          >
            <option value="">Pilih Kegiatan/Aksi</option>
            {#each kegiatanList as kegiatan}
              <option value={kegiatan}>{kegiatan}</option>
            {/each}
          </select>
        </div>
        <!-- Target (2 columns) -->
        <div class="flex items-center gap-6 mb-3">
          <label for="target_value" class="w-48 text-blue-900 font-bold">Target</label>
          <div class="flex flex-1 gap-2">
            <input
              id="target_value"
              type="number"
              min="0"
              bind:value={formData.target_value}
              class="w-32 px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              placeholder="Nilai"
              required
            />
            <input
              id="target_desc"
              type="text"
              bind:value={formData.target_desc}
              class="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              placeholder="Deskripsi Target"
              required
            />
          </div>
        </div>
        <!-- Milestone -->
        <div class="flex items-center gap-6 mb-3">
          <label for="milestone" class="w-48 text-blue-900 font-bold">Milestone</label>
          <select
            id="milestone"
            bind:value={formData.milestone}
            class="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            required
          >
            <option value="">Pilih Milestone</option>
            <optgroup label="Jangka Pendek">
              <option value="Oktober">Oktober</option>
              <option value="November">November</option>
              <option value="Desember">Desember</option>
            </optgroup>
            <optgroup label="Jangka Menengah">
              <option value="Triwulan 1">Triwulan 1</option>
              <option value="Triwulan 2">Triwulan 2</option>
              <option value="Triwulan 3">Triwulan 3</option>
              <option value="Triwulan 4">Triwulan 4</option>
            </optgroup>
            <optgroup label="Jangka Panjang">
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
            </optgroup>
          </select>
        </div>
        <!-- Capaian (2 columns) -->
        <div class="flex items-center gap-6 mb-3">
          <label for="capaian_value" class="w-48 text-blue-900 font-bold">Capaian</label>
          <div class="flex flex-1 gap-2">
            <input
              id="capaian_value"
              type="number"
              min="0"
              bind:value={formData.capaian_value}
              class="w-32 px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              placeholder="Nilai"
              required
            />
            <input
              id="capaian_desc"
              type="text"
              bind:value={formData.capaian_desc}
              class="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              placeholder="Deskripsi Capaian"
              required
            />
          </div>
        </div>
        <!-- Bukti Dukung (URL Google Drive) -->
        <div class="flex items-center gap-6 mb-3">
          <label for="bukti" class="w-48 text-blue-900 font-bold">Bukti Dukung (URL Google Drive)</label>
          <input
            id="bukti"
            type="url"
            bind:value={formData.bukti}
            class="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            placeholder="https://drive.google.com/..."
            required
          />
        </div>
        <!-- Penjelasan -->
        <div class="flex items-center gap-6 mb-3">
          <label for="penjelasan" class="w-48 text-blue-900 font-bold">Penjelasan</label>
          <textarea
            id="penjelasan"
            bind:value={formData.penjelasan}
            rows="3"
            class="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            placeholder="Penjelasan tambahan (opsional)"
          ></textarea>
        </div>
        <!-- PIC removed -->
        <div class="flex justify-end space-x-3 pt-6 border-t-2 border-blue-100 mt-2">
          <button 
            type="button" 
            on:click={() => dispatch('close')} 
            class="px-7 py-2 border-2 border-blue-300 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Batal
          </button>
          <button 
            type="submit" 
            class="px-7 py-2 bg-linear-to-r from-blue-500 to-blue-700 text-white font-bold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Simpan Aksi
          </button>
        </div>
      </form>
    </div>
    <style>
      .animate-fadein {
        animation: fadein 0.25s cubic-bezier(.4,0,.2,1);
      }
      @keyframes fadein {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .animate-modalpop {
        animation: modalpop 0.3s cubic-bezier(.4,0,.2,1);
      }
      @keyframes modalpop {
        0% { opacity: 0; transform: scale(0.95) translateY(20px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
    </style>
  </div>
{/if}
