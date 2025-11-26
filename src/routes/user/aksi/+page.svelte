<script lang="ts">
	import type { PageData } from './$types';
	import ActionPlanTable from '$lib/components/ActionPlanTable.svelte';
	import AksiModal from '$lib/components/AksiModal.svelte';

	// Types
	type ActionPlanProgress = {
		id: number;
		actionPlanPicId: number;
		periode: string;
		capaian: number;
		createdAt: string;
	};

	type ActionPlanSchedule = {
		id: number;
		actionPlansId: number;
		okt: boolean;
		nov: boolean;
		des: boolean;
		tw1: boolean;
		tw2: boolean;
		tw3: boolean;
		tw4: boolean;
		tahun2027: boolean;
		tahun2028: boolean;
		tahun2029: boolean;
		createdAt: string;
	};

	type ActionPlanPic = {
		id: number;
		actionPlansId: number;
		picId: number;
		namaInstansi: string;
	};

	type IndikatorKeberhasilanDetail = {
		id: number;
		actionPlansId: number;
		urutan: number | null;
		deskripsi: string;
	};

	type ActionPlan = {
		id: number;
		kegiatanId: number;
		namaKegiatan: string;
		pilarId: number;
		namaPilar: string;
		output: string;
		status: string;
		createdAt: string;
		updatedAt: string;
		actionPlanProgresses: ActionPlanProgress[];
		actionPlanSchedules: ActionPlanSchedule[];
		actionPlanPics: ActionPlanPic[];
		indikatorKeberhasilanDetails: IndikatorKeberhasilanDetail[];
	};

	// Receive data
	export let data: PageData & { plans?: { success: boolean; data: ActionPlan[]; pagination: any } };

	// Map data ke tabel
	$: actionPlans = (data.plans?.data ?? []).map((plan: ActionPlan) => {
		const schedule = plan.actionPlanSchedules[0] || {};
		const indikators = plan.indikatorKeberhasilanDetails
			.map((i) => i.deskripsi)
			.join('; ');

		return {
			id: plan.id,
			pilar: plan.namaPilar,
			kegiatan: plan.namaKegiatan,
			output: plan.output,
			indikator: indikators,
			status: plan.status,
			jadwal: {
				pendek: {
					okt: schedule.okt || false,
					nov: schedule.nov || false,
					des: schedule.des || false
				},
				menengah: {
					tw1: schedule.tw1 || false,
					tw2: schedule.tw2 || false,
					tw3: schedule.tw3 || false,
					tw4: schedule.tw4 || false
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
					dec: false,
					"2027": schedule.tahun2027 || false,
					"2028": schedule.tahun2028 || false,
					"2029": schedule.tahun2029 || false
				}
			},
			progresses: plan.actionPlanProgresses
		};
	});

	// Modal form
	let isModalOpen = false;

	let newFormData = {
		pilar: '',
		kegiatan: '',
		output: '',
		indikator: '',
		jadwal: {
			pendek: { okt: false, nov: false, des: false },
			menengah: { tw1: false, tw2: false, tw3: false, tw4: false },
			panjang: {
				jan: false, feb: false, mar: false, apr: false, may: false, jun: false,
				jul: false, aug: false, sep: false, oct: false, nov: false, dec: false,
				"2027": false, "2028": false, "2029": false
			}
		},
		target_value: '',
		target_desc: '',
		capaian_value: '',
		capaian_desc: '',
		bukti: '',
		penjelasan: '',
		milestone: ''
	};

	function handleAdd(event: Event) {
		event.preventDefault();
		console.log('Adding new action plan:', newFormData);
		isModalOpen = false;
	}
</script>

<main class="p-6 space-y-6">
	<div class="flex justify-between items-center">
		<h1 class="text-2xl font-bold">Rencana Aksi PEN 2025</h1>
	</div>

	<ActionPlanTable items={actionPlans} />

	<AksiModal
		isOpen={isModalOpen}
		on:close={() => (isModalOpen = false)}
		formData={newFormData}
		on:submit={handleAdd}
	/>
</main>
