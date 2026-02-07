<script lang="ts">
	import AksiModal from '$lib/components/AksiModal.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Edit, Trash2, Plus } from 'lucide-svelte';

	// =====================================
	// Types
	// =====================================
	type ProgressItem = {
		id: number;
		pilar: string;
		kegiatan: string;
		target_value: number;
		target_desc: string | null;
		milestone: string | null;
		capaian_value: number;
		capaian_desc: string | null;
		bukti: string | null;
		penjelasan: string | null;
		created_at: string | null;
		instansi: string;
		actionPlanPicId: number;
		user?: {
			id: string;
			name: string;
			email: string;
		};
		userProfile?: {
			id: number;
			nama: string;
			jabatan: string;
			unit_kerja: string;
			no_hp: string;
			alamat_kantor: string;
		};
	};

	// =====================================
	// State
	// =====================================
	let progressData: ProgressItem[] = [];
	let isModalOpen = false;
	let isEditMode = false;
	let editingItem: ProgressItem | null = null;
	let loading = true;
	let error = '';
	let showProfileModal = false;
	let selectedUserProfile: ProgressItem['userProfile'] & { userName?: string; userEmail?: string } | null = null;

	let newFormData = {
		pilar: '',
		kegiatan: '',
		target_value: '',
		target_desc: '',
		capaian_value: '',
		capaian_desc: '',
		bukti: '',
		penjelasan: '',
		milestone: ''
	};

	// =====================================
	// Get instansiId from user data
	// =====================================
	let instansiId: string | null = null;
	let instansiName: string = '';

	onMount(() => {
		// Get instansiId from localStorage
		const userData = localStorage.getItem("user");
		if (userData) {
			try {
				const user = JSON.parse(userData);
				instansiId = user.instansi_id?.toString();
				instansiName = user.instansi_name || 'PEN Monitor';
			} catch (error) {
				console.error("Error parsing user data:", error);
			}
		}

		if (instansiId) {
			fetchProgress(instansiId);
		} else {
			error = "Instansi ID tidak ditemukan";
			loading = false;
		}
	});

	// =====================================
	// Fetch Data dari API
	// =====================================
	async function fetchProgress(id: string) {
		try {
			loading = true;
			error = '';
			const res = await fetch(`/api/action_plan_progress?instansi_id=${id}`);
			const json = await res.json();

			if (!json.success) {
				error = "Gagal memuat data progress";
				return;
			}

			progressData = json.data.map((item: any) => ({
				id: item.id,
				pilar: item.pilar?.nama_pilar || '-',
				kegiatan: item.kegiatan?.namaKegiatan || '-',
				target_value: item.target ?? 0,
				target_desc: '',
				milestone: 'Belum Ada',
				capaian_value: item.capaian ?? 0,
				capaian_desc: '',
				bukti: item.bukti,
				penjelasan: item.penjelasan,
				created_at: item.createdAt,
				instansi: item.instansi?.namaInstansi || '-',
				actionPlanPicId: item.actionPlanPicId,
				user: item.user ? {
					id: item.user.id,
					name: item.user.name,
					email: item.user.email
				} : undefined,
				userProfile: item.userProfile ? {
					id: item.userProfile.id,
					nama: item.userProfile.nama,
					jabatan: item.userProfile.jabatan,
					unit_kerja: item.userProfile.unit_kerja,
					no_hp: item.userProfile.no_hp,
					alamat_kantor: item.userProfile.alamat_kantor
				} : undefined
			}));
		} catch (err) {
			console.error("Error fetching progress:", err);
			error = "Terjadi kesalahan saat memuat data";
		} finally {
			loading = false;
		}
	}

	// =====================================
	// Submit Add
	// =====================================
	async function handleAdd(event: Event) {
		event.preventDefault();
		if (!instansiId) return;
		try {
			const payload = {
				pilar: newFormData.pilar,
				kegiatan: newFormData.kegiatan,
				target_value: parseInt(newFormData.target_value) || 0,
				target_desc: newFormData.target_desc,
				milestone: newFormData.milestone,
				capaian_value: parseInt(newFormData.capaian_value) || 0,
				capaian_desc: newFormData.capaian_desc,
				bukti: newFormData.bukti,
				penjelasan: newFormData.penjelasan,
				instansi_id: parseInt(instansiId)
			};
			const res = await fetch('/api/action_plan_progress', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			const json = await res.json();
			if (json.success) {
				await fetchProgress(instansiId);
				isModalOpen = false;
				resetForm();
			} else {
				alert(json.message || 'Gagal menambah progress');
			}
		} catch (err) {
			alert('Terjadi kesalahan saat menambah progress');
		}
	}

	// =====================================
	// Edit Progress
	// =====================================
	function handleEdit(item: ProgressItem) {
		isEditMode = true;
		editingItem = item;

		newFormData = {
			pilar: item.pilar,
			kegiatan: item.kegiatan,
			target_value: item.target_value.toString(),
			target_desc: item.target_desc || '',
			capaian_value: item.capaian_value.toString(),
			capaian_desc: item.capaian_desc || '',
			bukti: item.bukti || '',
			penjelasan: item.penjelasan || '',
			milestone: item.milestone || ''
		};

		isModalOpen = true;
	}

	// =====================================
	// Submit Edit
	// =====================================
	async function handleEditSubmit(event: Event) {
		event.preventDefault();
		if (!editingItem) return;
		try {
			const payload = {
				id: editingItem.id,
				actionPlanPicId: editingItem.actionPlanPicId,
				target: parseInt(newFormData.target_value) || 0,
				capaian: parseInt(newFormData.capaian_value) || 0,
				bukti: newFormData.bukti,
				penjelasan: newFormData.penjelasan
			};
			const res = await fetch(`/api/action_plan_progress?id=${editingItem.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			const json = await res.json();
			if (json.success) {
				if (instansiId) await fetchProgress(instansiId);
				isModalOpen = false;
				isEditMode = false;
				editingItem = null;
				resetForm();
			} else {
				alert(json.message || 'Gagal mengedit progress');
			}
		} catch (err) {
			alert('Terjadi kesalahan saat mengedit progress');
		}
	}

	// =====================================
	// Delete Progress
	// =====================================
	async function handleDelete(item: ProgressItem) {
		if (confirm('Apakah Anda yakin ingin menghapus progress ini?')) {
			try {
				const res = await fetch(`/api/action_plan_progress?id=${item.id}`, {
					method: 'DELETE'
				});
				const json = await res.json();
				if (json.success && instansiId) {
					await fetchProgress(instansiId);
				} else {
					alert(json.message || 'Gagal menghapus progress');
				}
			} catch (err) {
				alert('Terjadi kesalahan saat menghapus progress');
		}
	}
	}

	// =====================================
	// Show Profile Modal
	// =====================================
	async function showUserProfile(item: ProgressItem) {
		try {
			// Fetch profile data from API
			const response = await fetch(`/api/profile/by-user-id/${item.actionPlanPicId}`);
			const data = await response.json();

			if (data.success && data.data) {
				selectedUserProfile = {
					id: data.data.id,
					nama: data.data.nama || '',
					jabatan: data.data.jabatan || '',
					unit_kerja: data.data.unit_kerja || '',
					no_hp: data.data.no_hp || '',
					alamat_kantor: data.data.alamat_kantor || '',
					userName: item.user?.name,
					userEmail: data.data.email || item.user?.email
				};
				showProfileModal = true;
			} else {
				console.error('Failed to fetch profile:', data.message);
				// Fallback to pre-loaded data if API fails
				const profile = item.userProfile ?? {
					id: 0,
					nama: '',
					jabatan: '',
					unit_kerja: '',
					no_hp: '',
					alamat_kantor: ''
				};
				selectedUserProfile = {
					id: profile.id ?? 0,
					nama: profile.nama ?? '',
					jabatan: profile.jabatan ?? '',
					unit_kerja: profile.unit_kerja ?? '',
					no_hp: profile.no_hp ?? '',
					alamat_kantor: profile.alamat_kantor ?? '',
					userName: item.user?.name,
					userEmail: item.user?.email
				};
				showProfileModal = true;
			}
		} catch (error) {
			console.error('Error fetching profile:', error);
			// Fallback to pre-loaded data if API fails
			const profile = item.userProfile ?? {
				id: 0,
				nama: '',
				jabatan: '',
				unit_kerja: '',
				no_hp: '',
				alamat_kantor: ''
			};
			selectedUserProfile = {
				id: profile.id ?? 0,
				nama: profile.nama ?? '',
				jabatan: profile.jabatan ?? '',
				unit_kerja: profile.unit_kerja ?? '',
				no_hp: profile.no_hp ?? '',
				alamat_kantor: profile.alamat_kantor ?? '',
				userName: item.user?.name,
				userEmail: item.user?.email
			};
			showProfileModal = true;
		}
	}

	// =====================================
	// Reset Form
	// =====================================
	function resetForm() {
		newFormData = {
			pilar: '',
			kegiatan: '',
			target_value: '',
			target_desc: '',
			capaian_value: '',
			capaian_desc: '',
			bukti: '',
			penjelasan: '',
			milestone: ''
		};
	}

	// =====================================
	// Calculate Progress Percentage
	// =====================================
	function calculateProgress(target: number, capaian: number): number {
		if (target === 0) return 0;
		return Math.min((capaian / target) * 100, 100);
	}

	// =====================================
	// Get Progress Color
	// =====================================
	function getProgressColor(percentage: number): string {
		if (percentage >= 80) return 'bg-green-500';
		if (percentage >= 50) return 'bg-yellow-500';
		return 'bg-red-500';
	}
</script>

<svelte:head>
	<title>Progress Pen - {instansiName}</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 p-6">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Progress Pen</h1>
			<p class="text-gray-600">Pantau semua progress rencana aksi dari instansi Anda</p>
		</div>

		<!-- Add Button -->
		<div class="mb-6">
			<button
				on:click={() => { isModalOpen = true; isEditMode = false; }}
				class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
			>
				<Plus class="w-4 h-4" />
				Tambah Progress
			</button>
		</div>

		<!-- Loading State -->
		{#if loading}
			<div class="flex justify-center items-center py-12">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<span class="ml-2 text-gray-600">Memuat data...</span>
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4">
				<p class="text-red-700">{error}</p>
			</div>
		{:else}
			<!-- Progress Table -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>

								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pilar</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kegiatan</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capaian</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each progressData as item}
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.pilar}</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.kegiatan}</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.target_value}</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.capaian_value}</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="flex items-center">
											<div class="flex-1 bg-gray-200 rounded-full h-2 mr-2">
												<div
													class="h-2 rounded-full {getProgressColor(calculateProgress(item.target_value, item.capaian_value))}"
													style="width: {calculateProgress(item.target_value, item.capaian_value)}%"
												></div>
											</div>
											<span class="text-sm text-gray-500">{calculateProgress(item.target_value, item.capaian_value).toFixed(0)}%</span>
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<div class="flex space-x-2">
											<button
												on:click={() => handleEdit(item)}
												class="text-blue-600 hover:text-blue-900 p-1"
												title="Edit"
											>
												<Edit class="w-4 h-4" />
											</button>
											<button
												on:click={() => handleDelete(item)}
												class="text-red-600 hover:text-red-900 p-1"
												title="Hapus"
											>
												<Trash2 class="w-4 h-4" />
											</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				{#if progressData.length === 0}
					<div class="text-center py-12">
						<p class="text-gray-500">Belum ada data progress</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<!-- Modal -->
<AksiModal
	bind:isOpen={isModalOpen}
	isEdit={isEditMode}
	bind:formData={newFormData}
	on:submit={isEditMode ? handleEditSubmit : handleAdd}
	on:close={() => { isModalOpen = false; isEditMode = false; editingItem = null; resetForm(); }}
/>

<!-- Profile Modal -->
{#if showProfileModal && selectedUserProfile}
	<div 
		class="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fadein" 
		on:click={() => showProfileModal = false}
		on:keydown={(e) => { if (e.key === 'Escape') showProfileModal = false; }}
		role="dialog"
		aria-modal="true"
		aria-labelledby="profile-modal-title"
		tabindex="-1"
	>
		<div
			class="bg-white border-2 border-blue-200 rounded-2xl shadow-2xl max-w-md w-full max-h-[95vh] flex flex-col animate-modalpop transition-all duration-300"
			on:click|stopPropagation
			on:keydown={(e) => { if (e.key === 'Escape') showProfileModal = false; }}
			role="dialog"
			aria-modal="true"
			aria-labelledby="profile-modal-title"
			tabindex="0"
		>
			<div class="flex items-center justify-between px-8 py-6 rounded-t-2xl bg-linear-to-r from-blue-50 via-white to-blue-50 border-b-2 border-blue-100 shadow-sm">
				<h2 id="profile-modal-title" class="text-2xl font-extrabold text-blue-700 tracking-tight">Profil PIC</h2>
				<button
					on:click={() => showProfileModal = false}
					class="text-blue-400 hover:text-blue-700 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
					aria-label="Tutup modal"
				>
					✕
				</button>
			</div>

			<div class="p-8 space-y-6">
				{#if selectedUserProfile.nama}
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
							<span class="text-blue-600 font-bold text-lg">{selectedUserProfile.nama.charAt(0).toUpperCase()}</span>
						</div>
						<div>
							<h3 class="text-xl font-bold text-gray-900">{selectedUserProfile.nama}</h3>
							{#if selectedUserProfile.jabatan}
								<p class="text-gray-600">{selectedUserProfile.jabatan}</p>
							{/if}
						</div>
					</div>
				{:else if selectedUserProfile.userName}
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
							<span class="text-blue-600 font-bold text-lg">{selectedUserProfile.userName.charAt(0).toUpperCase()}</span>
						</div>
						<div>
							<h3 class="text-xl font-bold text-gray-900">{selectedUserProfile.userName}</h3>
							<p class="text-gray-600">User</p>
						</div>
					</div>
				{/if}

				<div class="space-y-4">
					{#if selectedUserProfile.userEmail}
						<div class="flex items-center gap-3">
							<div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
								<span class="text-gray-600 text-sm">📧</span>
							</div>
							<div>
								<p class="text-sm text-gray-500">Email</p>
								<p class="font-medium">{selectedUserProfile.userEmail}</p>
							</div>
						</div>
					{/if}

					{#if selectedUserProfile.no_hp}
						<div class="flex items-center gap-3">
							<div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
								<span class="text-gray-600 text-sm">📱</span>
							</div>
							<div>
								<p class="text-sm text-gray-500">No. HP</p>
								<p class="font-medium">{selectedUserProfile.no_hp}</p>
							</div>
						</div>
					{/if}

					{#if selectedUserProfile.unit_kerja}
						<div class="flex items-center gap-3">
							<div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
								<span class="text-gray-600 text-sm">🏢</span>
							</div>
							<div>
								<p class="text-sm text-gray-500">Unit Kerja</p>
								<p class="font-medium">{selectedUserProfile.unit_kerja}</p>
							</div>
						</div>
					{/if}

					{#if selectedUserProfile.alamat_kantor}
						<div class="flex items-center gap-3">
							<div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
								<span class="text-gray-600 text-sm">📍</span>
							</div>
							<div>
								<p class="text-sm text-gray-500">Alamat Kantor</p>
								<p class="font-medium">{selectedUserProfile.alamat_kantor}</p>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
