<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import StatCard from '$lib/components/cards/StatCard.svelte';

    export const superAdminInfo = writable({ superAdminName: '' });

    type StatColor = "blue" | "green" | "yellow" | "red" | "purple" | "gray" | undefined;
    type Stat = {
        title: string;
        value: number;
        subtitle: string;
        icon: string;
        color: StatColor;
    };
    
    let stats: Stat[] = [
        {
            title: 'Manajemen User',
            value: 0,
            subtitle: 'Total User',
            icon: '👥',
            color: 'blue'
        },
        {
            title: 'Master Instansi',
            value: 0,
            subtitle: 'Total Instansi',
            icon: '🏢',
            color: 'green'
        },
        {
            title: 'Master Pilar',
            value: 0,
            subtitle: 'Total Pilar',
            icon: '🏗️',
            color: 'yellow'
        }
    ];

    function updateSuperAdminFromLocalStorage() {
        if (typeof localStorage !== 'undefined') {
            const user = localStorage.getItem('user');
            if (user) {
                try {
                    const parsed = JSON.parse(user);
                    superAdminInfo.set({
                        superAdminName: parsed.nama || parsed.name || 'Super Admin'
                    });
                } catch (e) {
                    superAdminInfo.set({ superAdminName: 'Super Admin' });
                }
            } else {
                superAdminInfo.set({ superAdminName: 'Super Admin' });
            }
        }
    }

    onMount(() => {
        updateSuperAdminFromLocalStorage();
    });
</script>

<svelte:head>
    <title>Dashboard Super Admin</title>
</svelte:head>

<div class="w-full md:w-1/2">
    <h2 class="text-2xl font-bold text-primary mb-4">Tentang Koperasi Desa/Kelurahan Merah Putih</h2>
    <p class="text-gray-600 text-justify">Undang-Undang 1945 Pasal 33 menegaskan bahwa perekonomian Indonesia disusun atas usaha bersama yang didasarkan pada asas kekeluargaan. Presiden Republik Indonesia sangat mendukung segala upaya untuk menggerakkan koperasi di seluruh Indonesia, mencerminkan komitmen pemerintah dalam memperkuat ekonomi kerakyatan.</p>
    <p class="text-gray-600 text-justify mt-4">Pembentukan Koperasi Desa/Kelurahan Merah Putih didorong oleh kebutuhan untuk meningkatkan kesejahteraan ekonomi masyarakat desa melalui pendekatan ekonomi kerakyatan yang berbasis pada prinsip gotong royong, kekeluargaan, dan saling membantu.</p>
    <p class="text-gray-600 text-justify mt-4">Dalam retreat kepala daerah di Akmil Magelang pada 21-28 Februari 2025, Presiden Prabowo menekankan pentingnya pembentukan Koperasi Desa sebagai upaya untuk meningkatkan ketahanan pangan.</p>
    <p class="text-gray-600 text-justify mt-4">Pada Rapat Terbatas di Istana Negara pada 3 Maret 2025, Presiden RI mengumumkan peluncuran 80.000 koperasi desa dengan nama Koperasi Desa/Kelurahan Merah Putih, dan akan dilakukan launching Koperasi Desa/Kelurahan Merah Putih bertepatan pada Hari Koperasi Nasional pada 12 Juli 2025. Inisiatif ini bertujuan untuk memperkuat ekonomi desa dan meningkatkan kesejahteraan masyarakat melalui koperasi.</p>
</div>

<style>
</style>

