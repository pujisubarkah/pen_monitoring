<!-- src/lib/components/ActionPlanTable.svelte -->
<script lang="ts">
  import type { Instansi } from '$lib/server/schema';
  import { Edit, Trash2 } from 'lucide-svelte';
  import ActionPlanModal from './ActionPlanModal.svelte';
  import { toastStore } from '$lib/stores/toastStore';

  export let items: any[] = [];
  export let onEdit: (item: any) => void = () => {};
  export let onDelete: (item: any) => void = () => {};

  // Modal state
  let isModalOpen = false;
  let isEditMode = false;
  let selectedItem: any = null;

  // Initialize modal form data reactively
  $: modalFormData = isEditMode && selectedItem ? {
    pilarId: selectedItem.pilarId?.toString() || '',
    kegiatanId: selectedItem.kegiatanId?.toString() || '',
    pic: selectedItem.actionPlanPics?.map((pic: any) => pic.picId?.toString() || '') || [''],
    output: selectedItem.output || '',
    jadwalId: selectedItem.actionPlanSchedules?.[0]?.id?.toString() || '',
    indikatorKeberhasilan: selectedItem.indikatorKeberhasilanDetails?.map((ind: any) => ind.deskripsi || '') || [],
    jadwal: {
      pendek: {
        okt: selectedItem.actionPlanSchedules?.[0]?.okt || false,
        nov: selectedItem.actionPlanSchedules?.[0]?.nov || false,
        des: selectedItem.actionPlanSchedules?.[0]?.des || false
      },
      menengah: {
        tw1: selectedItem.actionPlanSchedules?.[0]?.tw1 || false,
        tw2: selectedItem.actionPlanSchedules?.[0]?.tw2 || false,
        tw3: selectedItem.actionPlanSchedules?.[0]?.tw3 || false,
        tw4: selectedItem.actionPlanSchedules?.[0]?.tw4 || false
      },
      panjang: {
        '2027': selectedItem.actionPlanSchedules?.[0]?.tahun2027 || false,
        '2028': selectedItem.actionPlanSchedules?.[0]?.tahun2028 || false,
        '2029': selectedItem.actionPlanSchedules?.[0]?.tahun2029 || false
      }
    }
  } : {
    pilarId: '',
    kegiatanId: '',
    pic: [''],  
    output: '',
    jadwalId: '',
    indikatorKeberhasilan: [],
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

  // Helper untuk format PIC dari actionPlanPics dengan namaInstansi
  function formatPIC(actionPlanPics: any[]) {
    if (!actionPlanPics || actionPlanPics.length === 0) return '-';

    // Get unique PIC names
    const picNames = actionPlanPics
      .map(pic => pic.namaInstansi)
      .filter(name => name) // Remove null/undefined
      .filter((name, index, arr) => arr.indexOf(name) === index); // Remove duplicates

    // Format with numbering
    return picNames.map((name, index) => `${index + 1}. ${name}`).join(', ') || '-';
  }

  // Helper untuk mendapatkan jadwal berdasarkan actionPlanSchedules
  function getJadwalByPeriode(actionPlanSchedules: any[]) {
    if (!actionPlanSchedules || actionPlanSchedules.length === 0) return null;
    return actionPlanSchedules[0]; // Assuming one schedule per action plan
  }

  // Helper untuk menentukan warna bullet
  function getBulletColor(isActive: boolean) {
    return isActive ? 'bg-green-500' : 'bg-gray-200';
  }

  // Handle edit action
  async function handleEdit(item: any) {
    isEditMode = true;
    selectedItem = item;
    isModalOpen = true;
  }

  // Handle delete action
  async function handleDelete(item: any) {
    if (!confirm('Apakah Anda yakin ingin menghapus rencana aksi ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/action-plans/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        // Call the parent's onDelete function to update the list
        onDelete(item);
        toastStore.success('Rencana aksi berhasil dihapus');
      } else {
        throw new Error(result.error || 'Gagal menghapus rencana aksi');
      }
    } catch (error) {
      console.error('Error deleting action plan:', error);
      toastStore.error('Terjadi kesalahan saat menghapus rencana aksi');
    }
  }

  // Handle modal submit
  async function handleModalSubmit(event: any) {
    try {
      const formData = event.detail;
      
      // Prepare data for API
      const apiData = {
        kegiatanId: parseInt(formData.kegiatanId),
        pics: formData.pics,
        indikatorKeberhasilan: formData.indikatorKeberhasilan,
        output: formData.output,
        jadwalId: isEditMode ? formData.jadwalId : undefined, // Include jadwalId for updates
        jadwal: formData.jadwal
      };

      const url = isEditMode ? `/api/action-plans/${selectedItem?.id}` : '/api/action-plans';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      });

      const result = await response.json();

      if (result.success) {
        // Call the parent's callback to update the list
        if (isEditMode && selectedItem) {
          onEdit({ ...selectedItem, ...result.data });
        } else {
          // For new items, we might need to refresh the list
          // For now, just call onEdit with the new data
          onEdit(result.data);
        }
        
        toastStore.success(isEditMode ? 'Rencana aksi berhasil diperbarui' : 'Rencana aksi berhasil dibuat');
      } else {
        throw new Error(result.error || `Gagal ${isEditMode ? 'mengupdate' : 'menyimpan'} rencana aksi`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'submitting'} action plan:`, error);
      toastStore.error(`Terjadi kesalahan saat ${isEditMode ? 'mengupdate' : 'menyimpan'} rencana aksi`);
    }
    
    isModalOpen = false;
    isEditMode = false;
    selectedItem = null;
  }

  // Handle modal close
  function handleModalClose() {
    isModalOpen = false;
    isEditMode = false;
    selectedItem = null;
  }
</script><div class="overflow-x-auto text-xs">
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
        {@const jadwalData = getJadwalByPeriode(item.actionPlanSchedules)}
        {@const isFullDone = (
          (jadwalData && jadwalData.okt && jadwalData.nov && jadwalData.des &&
           jadwalData.tw1 && jadwalData.tw2 && jadwalData.tw3 && jadwalData.tw4 &&
           jadwalData.tahun2027 && jadwalData.tahun2028 && jadwalData.tahun2029)
        )}
        <tr class="hover:bg-gray-50">
          <!-- Pilar -->
          <td class="px-4 py-3 border align-top font-medium bg-gray-50 whitespace-normal">
            {item.namaPilar || '-'}
          </td>
          <!-- Kegiatan/Aksi -->
          <td class="px-4 py-3 border align-top whitespace-normal">
            {item.namaKegiatan || '-'}
          </td>
          <!-- PIC -->
          <td class="px-4 py-3 border align-top whitespace-normal">
            {formatPIC(item.actionPlanPics)}
          </td>
          <!-- Output -->
          <td class="px-4 py-3 border align-top whitespace-normal text-gray-700">
            {item.output || '-'}
          </td>
          <!-- Indikator Keberhasilan -->
          <td class="px-4 py-3 border align-top whitespace-normal text-gray-700">
            {#if item.indikatorKeberhasilanDetails && item.indikatorKeberhasilanDetails.length > 0}
              <ol class="list-decimal list-inside space-y-1 text-sm leading-relaxed">
                {#each item.indikatorKeberhasilanDetails as indicator, index}
                  <li class="text-gray-800 font-normal">
                    <span class="font-medium text-gray-900">{index + 1}.</span> {indicator.deskripsi}
                  </li>
                {/each}
              </ol>
            {:else}
              <span class="text-gray-400 italic">-</span>
            {/if}
          </td>
          <!-- Jadwal Pelaksanaan -->
          {#if isFullDone}
            <td colspan="10" class="px-2 py-2 border text-center align-middle bg-green-500">
              <div class="w-full h-8 bg-green-500 rounded-lg transition-all"></div>
            </td>
          {:else}
            <!-- Pendek -->
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.okt ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.okt ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.nov ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.nov ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.des ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.des ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
            <!-- Menengah -->
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.tw1 ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.tw1 ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.tw2 ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.tw2 ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.tw3 ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.tw3 ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.tw4 ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.tw4 ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
            <!-- Panjang -->
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.tahun2027 ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.tahun2027 ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.tahun2028 ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.tahun2028 ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
            <td class="px-2 py-2 border text-center align-middle {jadwalData?.tahun2029 ? 'bg-green-500' : ''}">
              <div class="w-full h-8 {jadwalData?.tahun2029 ? 'bg-green-500' : 'bg-gray-200'} rounded-lg transition-all"></div>
            </td>
          {/if}
          <!-- Aksi -->
          <td class="px-4 py-3 border align-top text-center">
            <div class="flex justify-center space-x-2">
              <button
                class="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                on:click={() => handleEdit(item)}
                title="Edit"
              >
                <Edit size={16} />
              </button>
              <button
                class="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                on:click={() => handleDelete(item)}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </td>
        </tr>
      {/each}
      
      {#if items.length === 0}
        <tr>
          <td colspan="16" class="px-6 py-8 text-center text-gray-500 border">
            Belum ada data rencana aksi
          </td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>

<!-- Edit Modal -->
<ActionPlanModal
  bind:isOpen={isModalOpen}
  editMode={isEditMode}
  {selectedItem}
  bind:formData={modalFormData}
  on:submit={handleModalSubmit}
  on:close={handleModalClose}
/>

<style>
  table {
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #e2e8f0;
  }
</style>