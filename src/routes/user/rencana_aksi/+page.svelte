<!-- src/routes/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { actionPlans } from '$lib/stores/actionPlanStore';
  import ActionPlanTable from '$lib/components/ActionPlanTable.svelte';
  import ActionPlanModal from '$lib/components/ActionPlanModal.svelte';

  /** @type {Array<{pilar: string, kegiatan: string[], pic: string[], output: string, indikator: string, jadwal: {pendek: {okt: boolean, nov: boolean, des: boolean}, menengah: {tw1: boolean, tw2: boolean, tw3: boolean, tw4: boolean}, panjang: {jan: boolean, feb: boolean, mar: boolean, apr: boolean, may: boolean, jun: boolean, jul: boolean, aug: boolean, sep: boolean, oct: boolean, nov: boolean, dec: boolean}}}>} */
  import { get } from 'svelte/store';
  let plans = [];
  let isModalOpen = false;
  let newFormData = {
    pilar: '',
    kegiatan: [],
    pic: [],
    output: '',
    indikator: '',
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
    }
  };

  onMount(() => {
    plans = get(actionPlans);
  });

  function handleAdd(event) {
    event.preventDefault();
    actionPlans.update(current => [...current, newFormData]);
    plans = get(actionPlans);
    isModalOpen = false;
    // Optionally reset newFormData here
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