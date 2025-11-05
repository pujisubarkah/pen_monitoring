<!-- src/routes/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { actionPlans } from '$lib/stores/actionPlanStore';
  import ActionPlanTable from '$lib/components/ActionPlanTable.svelte';
  import ActionPlanModal from '$lib/components/ActionPlanModal.svelte';

  /** @type {Array<{pilar: string, kegiatan: string, pic: string, output: string, indikator: string, jadwal: Object}>} */
  let plans = [];
  let isModalOpen = false;
  let newFormData = {
    pilar: '',
    kegiatan: '',
    pic: '',
    output: '',
    indikator: '',
    jadwal: {}
  };

  // Sinkronisasi store → local
  onMount(() => {
    const unsubscribe = actionPlans.subscribe(value => {
      plans = value;
    });
    return unsubscribe;
  });

  function handleAdd() {
    actionPlans.update(arr => [...arr, newFormData]);
    newFormData = { pilar: '', kegiatan: '', pic: '', output: '', indikator: '', jadwal: {} };
    isModalOpen = false;
  }
</script>

<main class="p-6 space-y-6">
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-bold">Rencana Aksi PEN 2025</h1>
    <button
      on:click={() => isModalOpen = true}
      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
    >
      + Tambah Aksi
    </button>
  </div>

  <ActionPlanTable items={plans} />

  <ActionPlanModal
    bind:isOpen={isModalOpen}
    bind:formData={newFormData}
    on:submit={handleAdd}
  />
</main>