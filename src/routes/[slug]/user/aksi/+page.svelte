<script lang="ts">
	let formData = $state({
		title: '',
		description: '',
		pilar: '',
		targetDate: '',
		priority: 'medium'
	});

	const pilars = [
		'Pilar 1: Pembentukan Satgas Daerah',
		'Pilar 2: Operasionalisasi KDMP/KKMP',
		'Pilar 3: Model Bisnis & Petunjuk Teknis',
		'Pilar 4: Akses Pembiayaan',
		'Pilar 5: Skema Aset',
		'Pilar 6: Pelatihan & Pendampingan SDM',
		'Pilar 7: Relaksasi Peraturan',
		'Pilar 8: Digitalisasi Proses Bisnis'
	];

	function handleSubmit() {
		console.log('Form submitted:', formData);
		alert('Aksi berhasil ditambahkan!');
	}
</script>

<svelte:head>
	<title>Input Aksi - PEN Monitor</title>
</svelte:head>

<div class="max-w-3xl space-y-6">
	<div>
		<h1 class="text-3xl font-bold text-gray-900">Input Aksi Baru</h1>
		<p class="text-gray-600 mt-2">Tambahkan aksi monitoring untuk pilar KDMP</p>
	</div>

	<div class="bg-white rounded-lg shadow-md p-6">
		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
			<!-- Title -->
			<div>
				<label for="title" class="block text-sm font-medium text-gray-700 mb-2">
					Judul Aksi <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="title"
					bind:value={formData.title}
					required
					class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					placeholder="Contoh: Sosialisasi KDMP ke Desa"
				/>
			</div>

			<!-- Pilar Selection -->
			<div>
				<label for="pilar" class="block text-sm font-medium text-gray-700 mb-2">
					Pilih Pilar <span class="text-red-500">*</span>
				</label>
				<select
					id="pilar"
					bind:value={formData.pilar}
					required
					class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				>
					<option value="">-- Pilih Pilar --</option>
					{#each pilars as pilar}
						<option value={pilar}>{pilar}</option>
					{/each}
				</select>
			</div>

			<!-- Description -->
			<div>
				<label for="description" class="block text-sm font-medium text-gray-700 mb-2">
					Deskripsi <span class="text-red-500">*</span>
				</label>
				<textarea
					id="description"
					bind:value={formData.description}
					required
					rows="4"
					class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					placeholder="Jelaskan detail aksi yang akan dilakukan..."
				></textarea>
			</div>

			<!-- Target Date -->
			<div>
				<label for="targetDate" class="block text-sm font-medium text-gray-700 mb-2">
					Target Tanggal <span class="text-red-500">*</span>
				</label>
				<input
					type="date"
					id="targetDate"
					bind:value={formData.targetDate}
					required
					class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>

			<!-- Priority -->
			<div>
				<fieldset>
					<legend class="block text-sm font-medium text-gray-700 mb-2">
						Prioritas <span class="text-red-500">*</span>
					</legend>
					<div class="flex gap-4">
						<label class="flex items-center">
							<input
								type="radio"
								bind:group={formData.priority}
								value="low"
								class="mr-2"
							/>
							<span class="text-sm">Rendah</span>
						</label>
						<label class="flex items-center">
							<input
								type="radio"
								bind:group={formData.priority}
								value="medium"
								class="mr-2"
							/>
							<span class="text-sm">Sedang</span>
						</label>
						<label class="flex items-center">
							<input
								type="radio"
								bind:group={formData.priority}
								value="high"
								class="mr-2"
							/>
							<span class="text-sm">Tinggi</span>
						</label>
					</div>
				</fieldset>
			</div>

			<!-- Submit Buttons -->
			<div class="flex gap-4 pt-4">
				<button
					type="submit"
					class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
				>
					Simpan Aksi
				</button>
				<a
					href="/user"
					class="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium text-center"
				>
					Batal
				</a>
			</div>
		</form>
	</div>
</div>
