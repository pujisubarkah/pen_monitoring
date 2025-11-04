<svelte:head>
	<title>Manajemen User - PEN Monitor</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Manajemen User</h1>
			<p class="text-gray-600 mt-2">Kelola pengguna sistem monitoring</p>
		</div>
		<button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
			+ Tambah User
		</button>
	</div>

	<!-- User Table -->
	<div class="bg-white rounded-lg shadow-md overflow-hidden">
		<table class="w-full">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				<tr>
					<td class="px-6 py-4 whitespace-nowrap">
						<div class="flex items-center">
							<div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">JD</div>
							<div class="ml-4">
								<div class="text-sm font-medium text-gray-900">John Doe</div>
							</div>
						</div>
					</td>
					<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">john@example.com</td>
					<td class="px-6 py-4 whitespace-nowrap">
						<span class="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Admin</span>
					</td>
					<td class="px-6 py-4 whitespace-nowrap">
						<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Aktif</span>
					</td>
					<td class="px-6 py-4 whitespace-nowrap text-sm">
						<button class="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
						<button class="text-red-600 hover:text-red-800">Hapus</button>
					</td>
				</tr>
				<tr>
					<td class="px-6 py-4 whitespace-nowrap">
						<div class="flex items-center">
							<div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">JS</div>
							<div class="ml-4">
								<div class="text-sm font-medium text-gray-900">Jane Smith</div>
							</div>
						</div>
					</td>
					<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">jane@example.com</td>
					<td class="px-6 py-4 whitespace-nowrap">
						<span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">User</span>
					</td>
					<td class="px-6 py-4 whitespace-nowrap">
						<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Aktif</span>
					</td>
					<td class="px-6 py-4 whitespace-nowrap text-sm">
						<button class="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
						<button class="text-red-600 hover:text-red-800">Hapus</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
