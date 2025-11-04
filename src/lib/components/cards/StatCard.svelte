<script lang="ts">
	let { 
		title,
		value,
		subtitle,
		icon,
		trend,
		trendValue,
		color = 'blue',
		onClick
	} = $props<{ 
		title: string,
		value: string | number,
		subtitle?: string,
		icon?: string,
		trend?: 'up' | 'down' | 'neutral',
		trendValue?: string | number,
		color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray',
		onClick?: () => void
	}>();
	
	// Color configurations
	const colorConfig: Record<string, { bg: string; border: string; icon: string; value: string; trend: string; }> = {
		blue: {
			bg: 'bg-blue-50',
			border: 'border-blue-200',
			icon: 'text-blue-600',
			value: 'text-blue-700',
			trend: 'text-blue-600'
		},
		green: {
			bg: 'bg-green-50',
			border: 'border-green-200',
			icon: 'text-green-600',
			value: 'text-green-700',
			trend: 'text-green-600'
		},
		red: {
			bg: 'bg-red-50',
			border: 'border-red-200',
			icon: 'text-red-600',
			value: 'text-red-700',
			trend: 'text-red-600'
		},
		yellow: {
			bg: 'bg-yellow-50',
			border: 'border-yellow-200',
			icon: 'text-yellow-600',
			value: 'text-yellow-700',
			trend: 'text-yellow-600'
		},
		purple: {
			bg: 'bg-purple-50',
			border: 'border-purple-200',
			icon: 'text-purple-600',
			value: 'text-purple-700',
			trend: 'text-purple-600'
		},
		gray: {
			bg: 'bg-gray-50',
			border: 'border-gray-200',
			icon: 'text-gray-600',
			value: 'text-gray-700',
			trend: 'text-gray-600'
		}
	};
	
	// Trend icons
	const trendIcons: Record<string, string> = {
		up: '📈',
		down: '📉',
		neutral: '➡️'
	};
	
	const config = $derived(() => colorConfig[color]);
</script>

{#if onClick}
	<button
		class="bg-white rounded-lg shadow-md border {config().border} hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 w-full text-left"
		onclick={onClick}
	>
		<div class="p-6">
			<!-- Header with icon -->
			<div class="flex items-center justify-between mb-4">
				<div class="flex items-center space-x-3">
					{#if icon}
						<div class="p-2 {config().bg} rounded-lg">
							<span class="text-2xl {config().icon}">{icon}</span>
						</div>
					{/if}
					<div>
						<h3 class="text-sm font-medium text-gray-600">{title}</h3>
						{#if subtitle}
							<p class="text-xs text-gray-400 mt-1">{subtitle}</p>
						{/if}
					</div>
				</div>

				<!-- Trend indicator -->
				{#if trend && trendValue}
					<div class="flex items-center space-x-1 {config().trend}">
						<span class="text-sm">{trendIcons[trend]}</span>
						<span class="text-xs font-medium">{trendValue}</span>
					</div>
				{/if}
			</div>

			<!-- Main value -->
			<div class="mb-2">
				<div class="text-3xl font-bold {config().value}">{value}</div>
			</div>

			<!-- Additional info or progress -->
			<div class="flex items-center justify-between text-sm text-gray-500">
				<span>
					{#if trend === 'up'}
						Meningkat dari periode sebelumnya
					{:else if trend === 'down'}
						Menurun dari periode sebelumnya
					{:else if trend === 'neutral'}
						Tidak ada perubahan
					{:else}
						Data terkini
					{/if}
				</span>

				{#if onClick}
					<span class="text-xs text-blue-600 hover:text-blue-800">
						Lihat detail →
					</span>
				{/if}
			</div>
		</div>

		<!-- Footer with additional actions -->
		<div class="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
			<div class="flex items-center justify-between">
				<span class="text-xs text-gray-400">
					Update: {new Date().toLocaleDateString('id-ID', {
						day: 'numeric',
						month: 'short',
						hour: '2-digit',
						minute: '2-digit'
					})}
				</span>

				<div class="flex space-x-2">
					<div class="text-xs text-gray-500 hover:text-gray-700 cursor-pointer">
						📊 Grafik
					</div>
					<div class="text-xs text-gray-500 hover:text-gray-700 cursor-pointer">
						📥 Export
					</div>
				</div>
			</div>
		</div>
	</button>
{:else}
	<div
		class="bg-white rounded-lg shadow-md border {config().border} hover:shadow-lg transition-all duration-200"
	>
		<div class="p-6">
			<!-- Header with icon -->
			<div class="flex items-center justify-between mb-4">
				<div class="flex items-center space-x-3">
					{#if icon}
						<div class="p-2 {config().bg} rounded-lg">
							<span class="text-2xl {config().icon}">{icon}</span>
						</div>
					{/if}
					<div>
						<h3 class="text-sm font-medium text-gray-600">{title}</h3>
						{#if subtitle}
							<p class="text-xs text-gray-400 mt-1">{subtitle}</p>
						{/if}
					</div>
				</div>

				<!-- Trend indicator -->
				{#if trend && trendValue}
					<div class="flex items-center space-x-1 {config().trend}">
						<span class="text-sm">{trendIcons[trend]}</span>
						<span class="text-xs font-medium">{trendValue}</span>
					</div>
				{/if}
			</div>

			<!-- Main value -->
			<div class="mb-2">
				<div class="text-3xl font-bold {config().value}">{value}</div>
			</div>

			<!-- Additional info or progress -->
			<div class="flex items-center justify-between text-sm text-gray-500">
				<span>
					{#if trend === 'up'}
						Meningkat dari periode sebelumnya
					{:else if trend === 'down'}
						Menurun dari periode sebelumnya
					{:else if trend === 'neutral'}
						Tidak ada perubahan
					{:else}
						Data terkini
					{/if}
				</span>

				{#if onClick}
					<span class="text-xs text-blue-600 hover:text-blue-800">
						Lihat detail →
					</span>
				{/if}
			</div>
		</div>

		<!-- Footer with additional actions -->
		<div class="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
			<div class="flex items-center justify-between">
				<span class="text-xs text-gray-400">
					Update: {new Date().toLocaleDateString('id-ID', {
						day: 'numeric',
						month: 'short',
						hour: '2-digit',
						minute: '2-digit'
					})}
				</span>

				<div class="flex space-x-2">
					<button class="text-xs text-gray-500 hover:text-gray-700">
						📊 Grafik
					</button>
					<button class="text-xs text-gray-500 hover:text-gray-700">
						📥 Export
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Variants for different stat types -->
<!--
Usage examples:

<StatCard 
  title="Total Aksi" 
  value="24" 
  icon="📋" 
  color="blue"
  trend="up"
  trendValue="+12%"
/>

<StatCard 
  title="Progress Rata-rata" 
  value="78%" 
  subtitle="Dari 24 aksi aktif"
  icon="📈" 
  color="green"
  trend="up"
  trendValue="+5%"
/>

<StatCard 
  title="Target Tercapai" 
  value="16" 
  icon="✅" 
  color="green"
  onclick={() => console.log('clicked')}
/>
-->