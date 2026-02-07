<script lang="ts">
	let { user } = $props<{ user?: any }>();

	let showChangePasswordModal = $state(false);
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let showCurrentPassword = $state(false);
	let showNewPassword = $state(false);
	let showConfirmPassword = $state(false);

	async function handleChangePassword(event: Event) {
		event.preventDefault();
		if (newPassword !== confirmPassword) {
			alert('Password baru tidak cocok');
			return;
		}

		try {
			const response = await fetch('/api/auth/change-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					current_password: currentPassword,
					new_password: newPassword,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				alert('Password berhasil diganti');
				showChangePasswordModal = false;
				currentPassword = '';
				newPassword = '';
				confirmPassword = '';
				showCurrentPassword = false;
				showNewPassword = false;
				showConfirmPassword = false;
			} else {
				alert(data.message || 'Gagal mengubah password');
			}
		} catch (err) {
			console.error('Change password error:', err);
			alert('Terjadi kesalahan saat mengubah password');
		}
	}
</script>

<nav class="bg-gray-800 shadow-lg border-b border-gray-700">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- Logo/Brand -->
			<div class="flex items-center">
				<h1 class="text-xl font-bold text-white">PEN Monitoring</h1>
			</div>

			<!-- User Menu -->
			<div class="flex items-center space-x-4">
				{#if $user}
					<button onclick={() => showChangePasswordModal = true} class="text-sm text-gray-300 hover:text-white cursor-pointer">
						Selamat datang, {$user.name}
					</button>
					<form action="/api/auth/logout" method="POST" class="inline">
						<button type="submit" class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700">
							Logout
						</button>
					</form>
				{:else}
					<a href="/" class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
						Login
					</a>
				{/if}
			</div>
		</div>
	</div>
</nav>

{#if showChangePasswordModal}
	<div class="fixed inset-0 bg-transparent flex items-center justify-center z-50">
		<div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
			<h2 class="text-lg font-bold mb-4">Ganti Password</h2>
			<form onsubmit={handleChangePassword}>
				<div class="mb-4 relative">
					<label for="currentPassword" class="block text-sm font-medium text-gray-700">Password Lama</label>
					<input id="currentPassword" type={showCurrentPassword ? 'text' : 'password'} bind:value={currentPassword} class="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
					<button type="button" onclick={() => showCurrentPassword = !showCurrentPassword} class="absolute inset-y-0 right-0 pr-3 pt-6 flex items-center text-gray-400">
						{showCurrentPassword ? '🙈' : '👁️'}
					</button>
				</div>
				<div class="mb-4 relative">
					<label for="newPassword" class="block text-sm font-medium text-gray-700">Password Baru</label>
					<input id="newPassword" type={showNewPassword ? 'text' : 'password'} bind:value={newPassword} class="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
					<button type="button" onclick={() => showNewPassword = !showNewPassword} class="absolute inset-y-0 right-0 pr-3 pt-6 flex items-center text-gray-400">
						{showNewPassword ? '🙈' : '👁️'}
					</button>
				</div>
				<div class="mb-4 relative">
					<label for="confirmPassword" class="block text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
					<input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} bind:value={confirmPassword} class="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
					<button type="button" onclick={() => showConfirmPassword = !showConfirmPassword} class="absolute inset-y-0 right-0 pr-3 pt-6 flex items-center text-gray-400">
						{showConfirmPassword ? '🙈' : '👁️'}
					</button>
				</div>
				<div class="flex justify-end space-x-2">
					<button type="button" onclick={() => showChangePasswordModal = false} class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Batal</button>
					<button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Ganti Password</button>
				</div>
			</form>
		</div>
	</div>
{/if}