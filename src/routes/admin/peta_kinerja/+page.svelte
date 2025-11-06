<script lang="ts">
import OrganizationalChart from '$lib/components/OrganizationalChart.svelte';
import { onMount } from 'svelte';
import { actionPlans } from '$lib/stores/actionPlanStore';
import { get } from 'svelte/store';

let orgData: Array<{ id: number; instansiId: number; namaInstansi: string; children?: any[] }> = [];
let loading = false;
let error = '';

function buildOrgDataFromPlans(plans: Array<Record<string, any>>) {
	// Root node (misal: Kementerian Koperasi & UKM)
	type OrgNode = {
		id: number;
		instansiId: number;
		namaInstansi: string;
		children: OrgNode[];
		milestone?: string;
		pic?: string;
	};

	let pilarId = 2;
	let aksiId = 100;

	// Root node
	const root: OrgNode = {
		id: 1,
		instansiId: 1,
		namaInstansi: 'Kementerian Koperasi & UKM',
		children: []
	};

	// Group by pilar
	const pilarMap = new Map<string, OrgNode>();
	for (const plan of plans) {
		if (!pilarMap.has(plan.pilar)) {
			pilarMap.set(plan.pilar, {
				id: pilarId,
				instansiId: pilarId,
				namaInstansi: plan.pilar,
				children: []
			});
			pilarId++;
		}
		// Kegiatan/aksi sebagai child dari pilar, tambahkan milestone dan PIC
		const aksiNode: OrgNode = {
			id: aksiId,
			instansiId: aksiId,
			namaInstansi: Array.isArray(plan.kegiatan) ? plan.kegiatan.join(', ') : plan.kegiatan,
			children: [],
			milestone: plan.milestone || plan.jadwal?.milestone || '',
			pic: Array.isArray(plan.pic) ? plan.pic.join(', ') : plan.pic || ''
		};
		aksiId++;
		pilarMap.get(plan.pilar)!.children.push(aksiNode);
	}
	root.children = Array.from(pilarMap.values());
	return [root];
}


$: orgData = buildOrgDataFromPlans($actionPlans);
</script>

<section class="peta-kinerja-section">
	<div class="section-header">
		<h1 class="section-title">Peta Kinerja Pilar Koperasi Merah Putih</h1>
		<p class="section-subtitle">Struktur organisasi dan hierarki program koperasi nasional</p>
	</div>

	<div class="chart-container">
		<div class="chart-info">
			<div class="info-icon">🗺️</div>
			<div class="info-content">
				<h4 class="info-title">Peta Pilar & Aksi</h4>
				<p class="info-description">
					Peta hierarki pilar dan aksi yang diinputkan pada rencana aksi. Setiap pilar akan menampilkan daftar aksi/kegiatan yang sudah diinput.
				</p>
			</div>
		</div>

		<OrganizationalChart data={orgData} />
	</div>
</section>

<style>
	.peta-kinerja-section {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.section-header {
		margin-bottom: 2rem;
		text-align: center;
	}

	.section-title {
		font-size: 2.5rem;
		font-weight: bold;
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.section-subtitle {
		font-size: 1.125rem;
		color: #6b7280;
	}

	.chart-container {
		background: #ffffff;
		border-radius: 12px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		padding: 2rem;
		min-height: 400px;
	}

	.chart-info {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.info-icon {
		font-size: 2rem;
		flex-shrink: 0;
	}

	.info-content {
		flex: 1;
	}

	.info-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1e293b;
		margin-bottom: 0.5rem;
	}

	.info-description {
		color: #64748b;
		font-size: 0.875rem;
		line-height: 1.5;
		margin: 0;
	}
</style>
