<!-- src/routes/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { actionPlans } from '$lib/stores/actionPlanStore';
  import ActionPlanTable from '$lib/components/ActionPlanTable.svelte';
  import ActionPlanModal from '$lib/components/ActionPlanModal.svelte';

  /** @type {Array<{pilar: string, kegiatan: string, pic: string, output: string, indikator: string, jadwal: {jan: boolean, feb: boolean, mar: boolean, apr: boolean, may: boolean, jun: boolean, jul: boolean, aug: boolean, sep: boolean, oct: boolean, nov: boolean, dec: boolean}}>} */
  let plans = [];
  let isModalOpen = false;
  let newFormData = {
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

  // Sinkronisasi store → local
  onMount(() => {
    const unsubscribe = actionPlans.subscribe(value => {
      plans = value;
    });
    return unsubscribe;
  });

  function handleAdd() {
    actionPlans.update(arr => [...arr, newFormData]);
    newFormData = {
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