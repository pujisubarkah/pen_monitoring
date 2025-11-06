<script lang="ts">
	import { onMount } from 'svelte';
	import { actionPlans } from '$lib/stores/actionPlanStore';
	import ActionPlanTable from '$lib/components/ActionPlanTable.svelte';
	import AksiModal from '$lib/components/AksiModal.svelte';
	import { get } from 'svelte/store';

	type ActionPlanItem = {
		pilar: string;
		kegiatan: string;
		pic: string;
		output: string;
		indikator: string;
		jadwal?: any;
	};

	type ProcessedPlan = {
		pilar: string;
		kegiatan: string[];
		pic: string[];
		output: string;
		indikator: string;
		jadwal: {
			pendek: { okt: boolean; nov: boolean; des: boolean };
			menengah: { tw1: boolean; tw2: boolean; tw3: boolean; tw4: boolean };
			panjang: {
				jan: boolean; feb: boolean; mar: boolean; apr: boolean; may: boolean; jun: boolean;
				jul: boolean; aug: boolean; sep: boolean; oct: boolean; nov: boolean; dec: boolean;
			};
		};
	};

	let plans: ProcessedPlan[] = [];
	let isModalOpen = false;
	let newFormData = {
		pilar: '',
		kegiatan: '',
		pic: '',
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
				dec: false,
				'2027': false,
				'2028': false,
				'2029': false
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

	onMount(() => {
		plans = get(actionPlans).map((plan: ActionPlanItem) => ({
			...plan,
			kegiatan: plan.kegiatan ? plan.kegiatan.split(', ').filter(k => k.trim()) : [],
			pic: plan.pic ? plan.pic.split(', ').filter(p => p.trim()) : [],
			jadwal: (plan.jadwal && typeof plan.jadwal === 'object' && 'pendek' in plan.jadwal && 'menengah' in plan.jadwal && 'panjang' in plan.jadwal)
				? plan.jadwal
				: {
						pendek: {
							okt: (plan.jadwal as any)?.okt ?? false,
							nov: (plan.jadwal as any)?.nov ?? false,
							des: (plan.jadwal as any)?.des ?? false
						},
						menengah: {
							tw1: (plan.jadwal as any)?.tw1 ?? false,
							tw2: (plan.jadwal as any)?.tw2 ?? false,
							tw3: (plan.jadwal as any)?.tw3 ?? false,
							tw4: (plan.jadwal as any)?.tw4 ?? false
						},
						panjang: {
							jan: (plan.jadwal as any)?.jan ?? false,
							feb: (plan.jadwal as any)?.feb ?? false,
							mar: (plan.jadwal as any)?.mar ?? false,
							apr: (plan.jadwal as any)?.apr ?? false,
							may: (plan.jadwal as any)?.may ?? false,
							jun: (plan.jadwal as any)?.jun ?? false,
							jul: (plan.jadwal as any)?.jul ?? false,
							aug: (plan.jadwal as any)?.aug ?? false,
							sep: (plan.jadwal as any)?.sep ?? false,
							oct: (plan.jadwal as any)?.oct ?? false,
							nov: (plan.jadwal as any)?.nov ?? false,
							dec: (plan.jadwal as any)?.dec ?? false
						}
					}
		} as ProcessedPlan));
	});
	function handleAdd(event: Event) {
		event.preventDefault();
		// Transform form data to match store format
		const flatJadwal = {
			jan: newFormData.jadwal.panjang.jan ?? false,
			feb: newFormData.jadwal.panjang.feb ?? false,
			mar: newFormData.jadwal.panjang.mar ?? false,
			apr: newFormData.jadwal.panjang.apr ?? false,
			may: newFormData.jadwal.panjang.may ?? false,
			jun: newFormData.jadwal.panjang.jun ?? false,
			jul: newFormData.jadwal.panjang.jul ?? false,
			aug: newFormData.jadwal.panjang.aug ?? false,
			sep: newFormData.jadwal.panjang.sep ?? false,
			oct: newFormData.jadwal.panjang.oct ?? false,
			nov: newFormData.jadwal.panjang.nov ?? false,
			dec: newFormData.jadwal.panjang.dec ?? false,
			// Add any additional keys required by your ActionPlan type here
		};
		const storeData = {
			...newFormData,
			kegiatan: Array.isArray(newFormData.kegiatan) ? newFormData.kegiatan.join(', ') : newFormData.kegiatan,
			pic: Array.isArray(newFormData.pic) ? newFormData.pic.join(', ') : newFormData.pic,
			jadwal: flatJadwal
		};
		actionPlans.update(current => [...current, storeData]);
		plans = get(actionPlans).map((plan: ActionPlanItem) => ({
			...plan,
			kegiatan: plan.kegiatan ? plan.kegiatan.split(', ').filter(k => k.trim()) : [],
			pic: plan.pic ? plan.pic.split(', ').filter(p => p.trim()) : [],
			jadwal: plan.jadwal && ('pendek' in plan.jadwal && 'menengah' in plan.jadwal && 'panjang' in plan.jadwal)
				? plan.jadwal
				: {
						pendek: {
							okt: (plan.jadwal as any)?.okt ?? false,
							nov: (plan.jadwal as any)?.nov ?? false,
							des: (plan.jadwal as any)?.des ?? false
						},
						menengah: {
							tw1: (plan.jadwal as any)?.menengah?.tw1 ?? false,
							tw2: (plan.jadwal as any)?.menengah?.tw2 ?? false,
							tw3: (plan.jadwal as any)?.menengah?.tw3 ?? false,
							tw4: (plan.jadwal as any)?.menengah?.tw4 ?? false
						},
						panjang: {
							jan: (plan.jadwal as any)?.jan ?? false,
							feb: (plan.jadwal as any)?.feb ?? false,
							mar: (plan.jadwal as any)?.mar ?? false,
							apr: (plan.jadwal as any)?.apr ?? false,
							may: (plan.jadwal as any)?.may ?? false,
							jun: (plan.jadwal as any)?.jun ?? false,
							jul: (plan.jadwal as any)?.jul ?? false,
							aug: (plan.jadwal as any)?.aug ?? false,
							sep: (plan.jadwal as any)?.sep ?? false,
							oct: (plan.jadwal as any)?.oct ?? false,
							nov: (plan.jadwal as any)?.nov ?? false,
							dec: (plan.jadwal as any)?.dec ?? false
						}
					}
		} as ProcessedPlan));
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

		<AksiModal
			isOpen={isModalOpen}
			on:close={() => isModalOpen = false}
			formData={newFormData}
			on:submit={handleAdd}
		/>
</main>