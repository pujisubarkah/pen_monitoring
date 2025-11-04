<script lang="ts">
	import { enhance } from '$app/forms';
	
	let { data = {} } = $props<{ data?: any }>();
	
	let loading = $state(false);
	let formData = $state({
		title: data.title || '',
		description: data.description || '',
		target_date: data.target_date || '',
		priority: data.priority || 'medium',
		status: data.status || 'pending',
		assigned_to: data.assigned_to || ''
	});
</script>

<div class="bg-white rounded-lg shadow-md p-6">
	<h2 class="text-2xl font-bold text-gray-900 mb-6">
		{data.id ? 'Edit Aksi' : 'Tambah Aksi Baru'}
	</h2>

	<form 
		method="POST" 
		use:enhance={() => {
			loading = true;
			return async ({ result, update }) => {
				loading = false;
				if (result.type === 'success') {
					// Reset form if creating new action
					if (!data.id) {
						formData = {
							title: '',
							description: '',
							target_date: '',
							priority: 'medium',
							status: 'pending',
							assigned_to: ''
						};
					}
				}
				update();
			};
		}}
		class="space-y-6"
	>
		<!-- Title -->
		<div>
			<label for="title" class="block text-sm font-medium text-gray-700 mb-2">
				Judul Aksi *
			</label>
			<input
				type="text"
				id="title"
				name="title"
				bind:value={formData.title}
				required
				class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
				placeholder="Masukkan judul aksi"
			/>
		</div>

		<!-- Description -->
		<div>
			<label for="description" class="block text-sm font-medium text-gray-700 mb-2">
				Deskripsi
			</label>
			<textarea
				id="description"
				name="description"
				bind:value={formData.description}
				rows="4"
				class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
				placeholder="Deskripsi detail aksi"
			></textarea>
		</div>

		<!-- Target Date -->
		<div>
			<label for="target_date" class="block text-sm font-medium text-gray-700 mb-2">
				Target Tanggal *
			</label>
			<input
				type="date"
				id="target_date"
				name="target_date"
				bind:value={formData.target_date}
				required
				class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
			/>
		</div>

		<!-- Priority and Status -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
					Prioritas
				</label>
				<select
					id="priority"
					name="priority"
					bind:value={formData.priority}
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
				>
					<option value="low">Rendah</option>
					<option value="medium">Sedang</option>
					<option value="high">Tinggi</option>
				</select>
			</div>

			<div>
				<label for="status" class="block text-sm font-medium text-gray-700 mb-2">
					Status
				</label>
				<select
					id="status"
					name="status"
					bind:value={formData.status}
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
				>
					<option value="pending">Pending</option>
					<option value="in_progress">In Progress</option>
					<option value="completed">Completed</option>
					<option value="cancelled">Cancelled</option>
				</select>
			</div>
		</div>

		<!-- Assigned To -->
		<div>
			<label for="assigned_to" class="block text-sm font-medium text-gray-700 mb-2">
				Ditugaskan Kepada
			</label>
			<input
				type="text"
				id="assigned_to"
				name="assigned_to"
				bind:value={formData.assigned_to}
				class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
				placeholder="Nama penanggung jawab"
			/>
		</div>

		<!-- Submit Button -->
		<div class="flex justify-end space-x-4">
			<button
				type="button"
				onclick={() => history.back()}
				class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
			>
				Batal
			</button>
			<button
				type="submit"
				disabled={loading}
				class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
			>
				{loading ? 'Menyimpan...' : (data.id ? 'Update Aksi' : 'Simpan Aksi')}
			</button>
		</div>
	</form>
</div>