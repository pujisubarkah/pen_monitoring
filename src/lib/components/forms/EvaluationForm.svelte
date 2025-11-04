<script lang="ts">
	import { enhance } from '$app/forms';
	
	let { actionId } = $props<{ actionId: string }>();
	
	let loading = $state(false);
	let formData = $state({
		progress_percentage: 0,
		notes: '',
		challenges: '',
		next_steps: '',
		rating: 3
	});
</script>

<div class="bg-white rounded-lg shadow-md p-6">
	<h2 class="text-2xl font-bold text-gray-900 mb-6">Evaluasi Progress Aksi</h2>

	<form 
		method="POST" 
		use:enhance={() => {
			loading = true;
			return async ({ result, update }) => {
				loading = false;
				if (result.type === 'success') {
					// Reset form after successful submission
					formData = {
						progress_percentage: 0,
						notes: '',
						challenges: '',
						next_steps: '',
						rating: 3
					};
				}
				update();
			};
		}}
		class="space-y-6"
	>
		<input type="hidden" name="action_id" value={actionId} />

		<!-- Progress Percentage -->
		<div>
			<label for="progress" class="block text-sm font-medium text-gray-700 mb-2">
				Persentase Progress: {formData.progress_percentage}%
			</label>
			<input
				type="range"
				id="progress"
				name="progress_percentage"
				min="0"
				max="100"
				step="5"
				bind:value={formData.progress_percentage}
				class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
			/>
			<div class="flex justify-between text-xs text-gray-500 mt-1">
				<span>0%</span>
				<span>25%</span>
				<span>50%</span>
				<span>75%</span>
				<span>100%</span>
			</div>
		</div>

		<!-- Rating -->
		<div>
			<label for="rating-input" class="block text-sm font-medium text-gray-700 mb-2">
				Rating Kualitas Pelaksanaan
			</label>
			<div class="flex space-x-2" role="radiogroup" aria-labelledby="rating-input">
				{#each [1, 2, 3, 4, 5] as star}
					<button
						type="button"
						onclick={() => formData.rating = star}
						class="text-2xl transition-colors"
						class:text-yellow-400={star <= formData.rating}
						class:text-gray-300={star > formData.rating}
						aria-label={`${star} star${star > 1 ? 's' : ''}`}
						role="radio"
						aria-checked={star === formData.rating}
					>
						★
					</button>
				{/each}
				<span class="ml-2 text-sm text-gray-600">({formData.rating}/5)</span>
			</div>
			<input type="hidden" id="rating-input" name="rating" value={formData.rating} />
		</div>

		<!-- Notes -->
		<div>
			<label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
				Catatan Progress
			</label>
			<textarea
				id="notes"
				name="notes"
				bind:value={formData.notes}
				rows="4"
				class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
				placeholder="Jelaskan progress yang telah dicapai..."
			></textarea>
		</div>

		<!-- Challenges -->
		<div>
			<label for="challenges" class="block text-sm font-medium text-gray-700 mb-2">
				Tantangan & Hambatan
			</label>
			<textarea
				id="challenges"
				name="challenges"
				bind:value={formData.challenges}
				rows="3"
				class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
				placeholder="Sebutkan tantangan atau hambatan yang dihadapi..."
			></textarea>
		</div>

		<!-- Next Steps -->
		<div>
			<label for="next_steps" class="block text-sm font-medium text-gray-700 mb-2">
				Langkah Selanjutnya
			</label>
			<textarea
				id="next_steps"
				name="next_steps"
				bind:value={formData.next_steps}
				rows="3"
				class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
				placeholder="Jelaskan rencana langkah selanjutnya..."
			></textarea>
		</div>

		<!-- Evidence Upload (Optional) -->
		<div>
			<label for="evidence" class="block text-sm font-medium text-gray-700 mb-2">
				Bukti/Evidence (Opsional)
			</label>
			<input
				type="file"
				id="evidence"
				name="evidence"
				multiple
				accept="image/*,.pdf,.doc,.docx"
				class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
			/>
			<p class="text-xs text-gray-500 mt-1">
				Upload foto, dokumen, atau file pendukung lainnya (max 5MB per file)
			</p>
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
				class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium disabled:opacity-50"
			>
				{loading ? 'Menyimpan...' : 'Simpan Evaluasi'}
			</button>
		</div>
	</form>
</div>

<style>
	.slider::-webkit-slider-thumb {
		appearance: none;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #3b82f6;
		cursor: pointer;
	}

	.slider::-moz-range-thumb {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #3b82f6;
		cursor: pointer;
		border: none;
	}
</style>