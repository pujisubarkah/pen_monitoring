<script lang="ts">
	// Removed invalid import and type usage

	// let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Evaluasi Nasional - PEN Monitor</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-7xl mx-auto">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Evaluasi Nasional</h1>
			<p class="text-gray-600">Pantau dan evaluasi progress PEN secara nasional</p>
		</div>

		<!-- Evaluation Overview -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
			<div class="bg-white rounded-lg shadow-md p-6">
				<div class="flex items-center">
					<div class="p-3 bg-blue-100 rounded-full">
						<span class="text-2xl">📊</span>
					</div>
					<div class="ml-4">
						<h3 class="text-lg font-semibold text-gray-900">Total Provinsi</h3>
						<p class="text-3xl font-bold text-blue-600">34</p>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-md p-6">
				<div class="flex items-center">
					<div class="p-3 bg-green-100 rounded-full">
						<span class="text-2xl">✅</span>
					</div>
					<div class="ml-4">
						<h3 class="text-lg font-semibold text-gray-900">Selesai</h3>
						<p class="text-3xl font-bold text-green-600">12</p>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-md p-6">
				<div class="flex items-center">
					<div class="p-3 bg-yellow-100 rounded-full">
						<span class="text-2xl">🔄</span>
					</div>
					<div class="ml-4">
						<h3 class="text-lg font-semibold text-gray-900">Dalam Proses</h3>
						<p class="text-3xl font-bold text-yellow-600">18</p>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-md p-6">
				<div class="flex items-center">
					<div class="p-3 bg-red-100 rounded-full">
						<span class="text-2xl">⚠️</span>
					</div>
					<div class="ml-4">
						<h3 class="text-lg font-semibold text-gray-900">Perlu Perhatian</h3>
						<p class="text-3xl font-bold text-red-600">4</p>
					</div>
				</div>
			</div>
		</div>

		<!-- National Progress Chart -->
		<div class="bg-white rounded-lg shadow-md p-6 mb-8">
			<h2 class="text-xl font-bold text-gray-900 mb-6">Progress Nasional</h2>
			<div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
				<p class="text-gray-500">Grafik progress nasional akan ditampilkan di sini</p>
			</div>
		</div>

		<!-- Province Evaluation Table -->
		<div class="bg-white rounded-lg shadow-md overflow-hidden">
			<div class="px-6 py-4 border-b border-gray-200">
				<h2 class="text-xl font-bold text-gray-900">Evaluasi per Provinsi</h2>
			</div>

			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Provinsi
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Progress
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Target Tanggal
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Aksi
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
								DKI Jakarta
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									<div class="flex-1 bg-gray-200 rounded-full h-2 mr-2">
										<div class="bg-green-600 h-2 rounded-full" style="width: 95%"></div>
									</div>
									<span class="text-sm font-medium text-gray-900">95%</span>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
									Selesai
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								15 Desember 2024
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								<button class="text-blue-600 hover:text-blue-900">Detail</button>
							</td>
						</tr>

						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
								Jawa Barat
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									<div class="flex-1 bg-gray-200 rounded-full h-2 mr-2">
										<div class="bg-blue-600 h-2 rounded-full" style="width: 75%"></div>
									</div>
									<span class="text-sm font-medium text-gray-900">75%</span>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
									Dalam Proses
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								20 Januari 2025
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								<button class="text-blue-600 hover:text-blue-900">Detail</button>
							</td>
						</tr>

						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
								Jawa Timur
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									<div class="flex-1 bg-gray-200 rounded-full h-2 mr-2">
										<div class="bg-yellow-600 h-2 rounded-full" style="width: 45%"></div>
									</div>
									<span class="text-sm font-medium text-gray-900">45%</span>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
									Perlu Perhatian
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								10 Februari 2025
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								<button class="text-blue-600 hover:text-blue-900">Detail</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>