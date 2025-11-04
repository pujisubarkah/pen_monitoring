<script lang="ts">
  export let slug: string;

  const menuAdmin = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Manajemen User', path: '/admin/users' },
    { name: 'Evaluasi Nasional', path: '/admin/evaluasi' }
  ];

  const menuUser = [
    { name: 'Dashboard', path: '/user' },
    { name: 'Input Aksi', path: '/user/aksi' },
    { name: 'Progress Saya', path: '/user/progress' }
  ];

  // choose menu based on slug
  const menu = slug === 'admin' ? menuAdmin : menuUser;
</script>

<aside class="w-60 bg-white shadow-md h-screen p-4">
  <h2 class="text-xl font-bold mb-6 text-blue-700">PEN Monitor</h2>

  <nav class="space-y-2">
    {#each menu as item}
      <a
        href={item.path}
        class="block p-2 rounded-md hover:bg-blue-100 text-gray-700 transition"
      >
        {item.name}
      </a>
    {/each}
  </nav>
</aside>


