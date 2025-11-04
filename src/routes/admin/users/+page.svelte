<svelte:head>
	<title>Manajemen User - PEN Monitor</title>
</svelte:head>

<div class="max-w-6xl space-y-6">
	<div>
		<h1 class="text-3xl font-bold text-gray-900">Manajemen User</h1>
		<p class="text-gray-600 mt-2">Kelola pengguna sistem monitoring</p>
	</div>

	<div class="bg-white rounded-lg shadow-md p-6">
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-xl font-semibold">Daftar User</h2>
			<button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
				Tambah User
			</button>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full table-auto">
				<thead>
					<tr class="bg-gray-50">
						<th class="px-4 py-2 text-left">Nama</th>
						<th class="px-4 py-2 text-left">Email</th>
						<th class="px-4 py-2 text-left">Role</th>
						<th class="px-4 py-2 text-left">Status</th>
						<th class="px-4 py-2 text-left">Aksi</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-t">
						<td class="px-4 py-2">Demo Admin</td>
						<td class="px-4 py-2">admin@demo.com</td>
						<td class="px-4 py-2">Admin</td>
						<td class="px-4 py-2">
							<span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Aktif</span>
						</td>
						<td class="px-4 py-2">
							<button class="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
							<button class="text-red-600 hover:text-red-800">Hapus</button>
						</td>
					</tr>
					<tr class="border-t">
						<td class="px-4 py-2">Demo User</td>
						<td class="px-4 py-2">user@demo.com</td>
						<td class="px-4 py-2">User</td>
						<td class="px-4 py-2">
							<span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Aktif</span>
						</td>
						<td class="px-4 py-2">
							<button class="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
							<button class="text-red-600 hover:text-red-800">Hapus</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>