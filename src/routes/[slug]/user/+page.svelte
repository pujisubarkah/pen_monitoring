<svelte:head>
	<title>User Dashboard - PEN Monitor</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-3xl font-bold text-gray-900">Dashboard User</h1>
		<p class="text-gray-600 mt-2">Selamat datang di sistem monitoring KDMP</p>
	</div>

	<!-- Quick Stats -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-blue-100 text-sm">Aksi Saya</p>
					<p class="text-4xl font-bold mt-2">12</p>
					<p class="text-blue-100 text-sm mt-2">Total aksi yang dibuat</p>
				</div>
				<div class="text-5xl opacity-20">📝</div>
			</div>
		</div>

		<div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-green-100 text-sm">Progress Rata-rata</p>
					<p class="text-4xl font-bold mt-2">68%</p>
					<p class="text-green-100 text-sm mt-2">Dari semua aksi</p>
				</div>
				<div class="text-5xl opacity-20">📊</div>
			</div>
		</div>

		<div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-purple-100 text-sm">Selesai</p>
					<p class="text-4xl font-bold mt-2">5</p>
					<p class="text-purple-100 text-sm mt-2">Aksi yang sudah tuntas</p>
				</div>
				<div class="text-5xl opacity-20">✅</div>
			</div>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<a href="/user/aksi" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">📝</div>
				<div>
					<h3 class="text-lg font-bold text-gray-900">Input Aksi Baru</h3>
					<p class="text-sm text-gray-600">Tambahkan aksi monitoring baru</p>
				</div>
			</div>
		</a>

		<a href="/user/progress" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">📈</div>
				<div>
					<h3 class="text-lg font-bold text-gray-900">Lihat Progress</h3>
					<p class="text-sm text-gray-600">Monitor progress aksi Anda</p>
				</div>
			</div>
		</a>
	</div>

	<!-- Recent Activities -->
	<div class="bg-white rounded-lg shadow-md">
		<div class="p-6 border-b border-gray-200">
			<h2 class="text-xl font-bold text-gray-900">Aktivitas Terbaru</h2>
		</div>
		<div class="divide-y divide-gray-200">
			<div class="p-6 flex items-center gap-4">
				<div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">📝</div>
				<div class="flex-1">
					<p class="font-medium text-gray-900">Aksi "Sosialisasi KDMP" ditambahkan</p>
					<p class="text-sm text-gray-600">2 jam yang lalu</p>
				</div>
			</div>
			<div class="p-6 flex items-center gap-4">
				<div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">✅</div>
				<div class="flex-1">
					<p class="font-medium text-gray-900">Progress aksi "Pelatihan SDM" diupdate ke 75%</p>
					<p class="text-sm text-gray-600">5 jam yang lalu</p>
				</div>
			</div>
			<div class="p-6 flex items-center gap-4">
				<div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">📋</div>
				<div class="flex-1">
					<p class="font-medium text-gray-900">Evaluasi pilar 2 diselesaikan</p>
					<p class="text-sm text-gray-600">1 hari yang lalu</p>
				</div>
			</div>
		</div>
	</div>
</div>
