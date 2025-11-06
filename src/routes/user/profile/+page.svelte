<script lang="ts">

  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { User, Mail, Phone, Briefcase, Building2, MapPin } from 'lucide-svelte';

  let formData = {
    nama: '',
    email: '',
    no_hp: '',
    jabatan: '',
    unit_kerja: '',
    alamat_kantor: ''
  };

  let loading = false;
  let error = '';
  let success = false;
  let showModal = false;

  // TODO: fetch user profile from API if available
  onMount(async () => {
    // Example: fetch('/api/user/profile')
    //   .then(res => res.json())
    //   .then(data => { formData = { ...formData, ...data }; });
  });

  async function handleSubmit() {
    loading = true;
    error = '';
    success = false;
    try {
      // Ambil user_id dari localStorage (misal: user disimpan di localStorage.user)
      let user_id = undefined;
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userObj = JSON.parse(userStr);
          user_id = userObj.id;
        }
      } catch {}
      if (!user_id) {
        error = 'User ID tidak ditemukan. Silakan login ulang.';
        loading = false;
        return;
      }
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, user_id })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        error = data.message || 'Gagal menyimpan profil.';
      } else {
        success = true;
        showModal = true;
      }
    } catch (e) {
      error = 'Gagal menyimpan profil.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-2xl mx-auto p-8 bg-blue-50 rounded-2xl shadow-lg border border-blue-200 mt-8">
  <h1 class="text-3xl font-extrabold mb-10 flex items-center gap-3 text-blue-800">
    <User class="w-8 h-8 text-blue-800" /> Profil Saya
  </h1>
  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <div class="flex items-center gap-6">
      <label for="nama" class="flex items-center gap-2 w-56 text-blue-800 font-semibold">
        <User class="w-5 h-5" /> Nama
      </label>
      <input id="nama" class="flex-1 border-2 border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 bg-white" bind:value={formData.nama} required />
    </div>
    <div class="flex items-center gap-6">
      <label for="email" class="flex items-center gap-2 w-56 text-blue-800 font-semibold">
        <Mail class="w-5 h-5" /> Email
      </label>
      <input id="email" class="flex-1 border-2 border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 bg-white" type="email" bind:value={formData.email} required />
    </div>
    <div class="flex items-center gap-6">
      <label for="no_hp" class="flex items-center gap-2 w-56 text-blue-800 font-semibold">
        <Phone class="w-5 h-5" /> No HP
      </label>
      <input id="no_hp" class="flex-1 border-2 border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 bg-white" bind:value={formData.no_hp} required />
    </div>
    <div class="flex items-center gap-6">
      <label for="jabatan" class="flex items-center gap-2 w-56 text-blue-800 font-semibold">
        <Briefcase class="w-5 h-5" /> Jabatan
      </label>
      <input id="jabatan" class="flex-1 border-2 border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 bg-white" bind:value={formData.jabatan} required />
    </div>
    <div class="flex items-center gap-6">
      <label for="unit_kerja" class="flex items-center gap-2 w-56 text-blue-800 font-semibold">
        <Building2 class="w-5 h-5" /> Unit Kerja Instansi
      </label>
      <input id="unit_kerja" class="flex-1 border-2 border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 bg-white" bind:value={formData.unit_kerja} required />
    </div>
    <div class="flex items-center gap-6">
      <label for="alamat_kantor" class="flex items-center gap-2 w-56 text-blue-800 font-semibold">
        <MapPin class="w-5 h-5" /> Alamat Kantor
      </label>
      <textarea id="alamat_kantor" class="flex-1 border-2 border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 bg-white" bind:value={formData.alamat_kantor} rows="2" required></textarea>
    </div>
    {#if error}
      <div class="text-red-600 text-sm mt-2">{error}</div>
    {/if}
    {#if success}
      <div class="text-green-600 text-sm mt-2">Profil berhasil disimpan!</div>
    {/if}
    <button type="submit" class="bg-blue-800 text-white px-10 py-2 rounded-lg font-semibold shadow hover:bg-blue-900 transition-all mt-6 w-full" disabled={loading}>
      {loading ? 'Menyimpan...' : 'Simpan Profil'}
    </button>
  </form>

  {#if showModal}
    <div class="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50" style="backdrop-filter: blur(1px);">
      <div class="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-pop-up">
        <button class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold" aria-label="Tutup" on:click={() => showModal = false}>&times;</button>
        <h2 class="text-xl font-bold mb-4 text-blue-800">Profil berhasil disimpan!</h2>
        <p class="mb-6">Apakah Anda ingin lanjut mengisi aksi sekarang?</p>
        <div class="flex justify-center gap-4">
          <button class="bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-900 shadow" on:click={() => goto('/user/aksi')}>
            Lanjut Isi Aksi
          </button>
          <button class="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 shadow" on:click={() => showModal = false}>
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
    <style>
      @keyframes pop-up {
        0% { opacity: 0; transform: scale(0.7) translateY(40px); }
        80% { opacity: 1; transform: scale(1.05) translateY(-8px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
      .animate-pop-up {
        animation: pop-up 0.4s cubic-bezier(.22,1,.36,1) both;
      }
    </style>
  {/if}
</div>
