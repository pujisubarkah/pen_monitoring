<script lang="ts">
    import type { PageData } from './$types';
    import AksiModal from '$lib/components/AksiModal.svelte';

    // Types for progress data
    type ProgressItem = {
        id: number;
        pilar: string;
        kegiatan: string;
        target_value: number;
        target_desc: string;
        milestone: string;
        capaian_value: number;
        capaian_desc: string;
        bukti: string;
        penjelasan: string;
        created_at: string;
    };

    // Mock data for demonstration - in real app this would come from API
    let progressData: ProgressItem[] = [
        {
            id: 1,
            pilar: 'Pembentukan Satgas Daerah',
            kegiatan: 'Sosialisasi',
            target_value: 100,
            target_desc: 'Peserta sosialisasi',
            milestone: 'Oktober',
            capaian_value: 85,
            capaian_desc: '85 peserta hadir',
            bukti: 'https://drive.google.com/example1',
            penjelasan: 'Sosialisasi berjalan lancar dengan partisipasi yang baik',
            created_at: '2025-11-25'
        },
        {
            id: 2,
            pilar: 'Monitoring dan Evaluasi',
            kegiatan: 'Pelatihan',
            target_value: 50,
            target_desc: 'Peserta terlatih',
            milestone: 'November',
            capaian_value: 45,
            capaian_desc: '45 peserta menyelesaikan pelatihan',
            bukti: 'https://drive.google.com/example2',
            penjelasan: 'Pelatihan monitoring berhasil dilaksanakan',
            created_at: '2025-11-24'
        }
    ];

    // Modal form
    let isModalOpen = false;

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

    function handleAdd(event: Event) {
        event.preventDefault();
        console.log('Adding new progress:', newFormData);

        // Add to mock data
        const newItem: ProgressItem = {
            id: progressData.length + 1,
            pilar: newFormData.pilar,
            kegiatan: newFormData.kegiatan,
            target_value: parseInt(newFormData.target_value) || 0,
            target_desc: newFormData.target_desc,
            milestone: newFormData.milestone,
            capaian_value: parseInt(newFormData.capaian_value) || 0,
            capaian_desc: newFormData.capaian_desc,
            bukti: newFormData.bukti,
            penjelasan: newFormData.penjelasan,
            created_at: new Date().toISOString().split('T')[0]
        };

        progressData = [...progressData, newItem];
        isModalOpen = false;

        // Reset form
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
</script>

<main class="p-6 space-y-6">
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Progress PEN 2025</h1>
        <button
            on:click={() => (isModalOpen = true)}
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
            + Update Progress
        </button>
    </div>

    <!-- Progress Table -->
    <div class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pilar</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kegiatan/Aksi</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Milestone</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capaian</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bukti</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penjelasan</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                {#each progressData as item}
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.pilar}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.kegiatan}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500">
                            <div class="font-semibold text-blue-600">{item.target_value}</div>
                            <div class="text-xs text-gray-400">{item.target_desc}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                {item.milestone}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500">
                            <div class="font-semibold text-green-600">{item.capaian_value}</div>
                            <div class="text-xs text-gray-400">{item.capaian_desc}</div>
                            <div class="mt-1">
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        class="bg-green-600 h-2 rounded-full"
                                        style="width: {item.target_value > 0 ? (item.capaian_value / item.target_value * 100) : 0}%"
                                    ></div>
                                </div>
                                <div class="text-xs text-gray-400 mt-1">
                                    {item.target_value > 0 ? Math.round((item.capaian_value / item.target_value) * 100) : 0}% completed
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500">
                            {#if item.bukti}
                                <a
                                    href={item.bukti}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-blue-600 hover:text-blue-800 underline"
                                >
                                    Lihat Bukti
                                </a>
                            {:else}
                                <span class="text-gray-400">-</span>
                            {/if}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={item.penjelasan}>
                            {item.penjelasan || '-'}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>

        {#if progressData.length === 0}
            <div class="text-center py-12">
                <div class="text-gray-500 text-lg">Belum ada data progress</div>
                <div class="text-gray-400 text-sm mt-2">Klik tombol "Update Progress" untuk menambah data</div>
            </div>
        {/if}
    </div>

    <AksiModal
        isOpen={isModalOpen}
        on:close={() => (isModalOpen = false)}
        formData={newFormData}
        on:submit={handleAdd}
    />
</main>