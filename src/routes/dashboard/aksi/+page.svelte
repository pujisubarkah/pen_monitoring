<script lang="ts">
	import ActionForm from '$lib/components/forms/ActionForm.svelte';
</script>

<svelte:head>
	<title>Form Aksi - Pen Monitoring</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex justify-between items-center">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Form Aksi</h1>
			<p class="text-gray-600 mt-2">Buat atau edit aksi monitoring</p>
		</div>
		<a 
			href="/dashboard" 
			class="bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700"
		>
			← Kembali ke Dashboard
		</a>
	</div>

	<!-- Action Form -->
	<ActionForm />
</div>