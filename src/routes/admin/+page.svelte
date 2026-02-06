
<script lang="ts">
import { onMount } from 'svelte';
import { provinces as provinceMap } from '$lib/constants/provinces';
type ProvinceData = {
	province: string;
	desa: number;
	kelurahan: number;
	stage3: number;
	percentage: string;
};

let provinces: ProvinceData[] = [];
let loading = true;
let error = '';

async function fetchData() {
	loading = true;
	error = '';
	try {
		const res = await fetch('https://api.merahputih.kop.id/api/cooperative/statistic');
		const json = await res.json();
		if (json && json.data && Array.isArray(json.data.mapping)) {
			provinces = json.data.mapping.map((item: any) => ({
				province: item.province,
				desa: item.desa,
				kelurahan: item.kelurahan,
				stage3: item.stage3,
				percentage: item.percentage
			}));
		} else {
			error = 'Data tidak ditemukan.';
		}
	} catch (e) {
		error = 'Gagal mengambil data.';
	}
	loading = false;
}

onMount(fetchData);
</script>


<svelte:head>
	<title>Admin Dashboard - PEN Monitor</title>
</svelte:head>

<main class="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 p-6">
	<div class="max-w-7xl mx-auto">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Tabel Koperasi Terbentuk per Provinsi</h1>
			<p class="text-lg text-gray-600">Data jumlah koperasi kelurahan/desa yang telah berbadan hukum per provinsi.</p>
		</div>
		<div class="overflow-x-auto">
			{#if loading}
				<div class="p-8 text-center text-gray-500">Memuat data...</div>
			{:else if error}
				<div class="p-8 text-center text-red-500">{error}</div>
			{:else}
				<table class="min-w-full table-auto border border-gray-300 bg-white rounded-xl shadow-lg">
					<colgroup>
						<col style="width: 50px;">
						<col style="width: 230px;">
						<col style="width: 230px;">
						<col style="width: 230px;">
						<col style="width: 230px;">
						<col style="width: 100px;">
					</colgroup>
					<thead class="bg-gray-100">
						<tr>
							<th>No</th>
							<th>Provinsi</th>
							<th>Jumlah Koperasi Kelurahan Terbentuk (Berbadan Hukum)</th>
							<th>Jumlah Koperasi Desa Terbentuk (Berbadan Hukum)</th>
							<th>Jumlah Koperasi Terbentuk (Berbadan Hukum)</th>
							<th>Detail Kabupaten/Kota</th>
						</tr>
					</thead>
					<tbody>
						{#each provinces as prov, i}
							<tr>
								<td>{i + 1}</td>
								<td>{prov.province}</td>
								<td>{prov.kelurahan}</td>
								<td>{prov.desa}</td>
								<td><span class="font-bold">{prov.stage3} ({prov.percentage}%)</span></td>
								<td>
									{#if provinceMap.find(p => p.name.toUpperCase() === prov.province.toUpperCase())}
										{@const foundProvince = provinceMap.find(p => p.name.toUpperCase() === prov.province.toUpperCase())}
										<a
											class="text-blue-600 underline hover:text-blue-800"
											href={`/admin/kabupaten/${foundProvince?.id}`}
										>
											Lihat Kabupaten/Kota
										</a>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</div>
</main>

<style>
	table {
		border-collapse: collapse;
		width: 100%;
	}
	th, td {
		border: 1px solid #e5e7eb;
		padding: 8px;
		text-align: left;
	}
	th {
		background-color: #f3f4f6;
		font-weight: 600;
	}
	.font-bold {
		font-weight: bold;
	}
</style>

