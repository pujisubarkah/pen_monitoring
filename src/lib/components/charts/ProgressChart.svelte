<script lang="ts">
	let { data, title = "Progress Chart" } = $props<{ 
		data: Array<{date: string, value: number, label?: string}>, 
		title?: string 
	}>();
	
	let chartContainer: HTMLDivElement;
	
	// Calculate dimensions and scales
	const width = $derived(() => 800);
	const height = $derived(() => 400);
	const margin = $derived(() => ({ top: 20, right: 30, bottom: 40, left: 50 }));
	const innerWidth = $derived(() => width() - margin().left - margin().right);
	const innerHeight = $derived(() => height() - margin().top - margin().bottom);
	
	// Data processing
	const processedData = $derived(() => data.map((d: any, i: number) => ({
		...d,
		x: (i / (data.length - 1)) * innerWidth(),
		y: innerHeight() - (d.value / 100) * innerHeight()
	})));
	
	// Create path string for line
	const pathData = $derived(() => processedData().map((d: any, i: number) => 
		`${i === 0 ? 'M' : 'L'} ${d.x} ${d.y}`
	).join(' '));
	
	// Y-axis ticks
	const yTicks = $derived(() => [0, 25, 50, 75, 100].map(tick => ({
		value: tick,
		y: innerHeight() - (tick / 100) * innerHeight()
	})));
</script>

<div class="bg-white rounded-lg shadow-md p-6">
	<h3 class="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
	
	<div class="w-full overflow-x-auto">
		<svg width={width()} height={height()} class="border border-gray-200 rounded">
			<g transform="translate({margin().left}, {margin().top})">
				<!-- Grid lines -->
				{#each yTicks() as tick}
					<line
						x1="0"
						y1={tick.y}
						x2={innerWidth()}
						y2={tick.y}
						stroke="#e5e7eb"
						stroke-width="1"
						stroke-dasharray="2,2"
					/>
				{/each}
				
				<!-- Y-axis -->
				<line
					x1="0"
					y1="0"
					x2="0"
					y2={innerHeight()}
					stroke="#374151"
					stroke-width="2"
				/>
				
				<!-- X-axis -->
				<line
					x1="0"
					y1={innerHeight()}
					x2={innerWidth()}
					y2={innerHeight()}
					stroke="#374151"
					stroke-width="2"
				/>
				
				<!-- Y-axis labels -->
				{#each yTicks() as tick}
					<text
						x="-10"
						y={tick.y + 5}
						text-anchor="end"
						class="text-xs fill-gray-600"
					>
						{tick.value}%
					</text>
				{/each}
				
				<!-- Progress line -->
				<path
					d={pathData()}
					fill="none"
					stroke="#3b82f6"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				
				<!-- Data points -->
				{#each processedData() as point, i}
					<g>
						<circle
							cx={point.x}
							cy={point.y}
							r="6"
							fill="#3b82f6"
							stroke="white"
							stroke-width="2"
							class="hover:r-8 transition-all cursor-pointer"
						/>
						
						<!-- X-axis labels -->
						<text
							x={point.x}
							y={innerHeight() + 20}
							text-anchor="middle"
							class="text-xs fill-gray-600"
						>
							{new Date(point.date).toLocaleDateString('id-ID', { 
								month: 'short', 
								day: 'numeric' 
							})}
						</text>
						
						<!-- Tooltip on hover -->
						<title>
							{point.label || point.date}: {point.value}%
						</title>
					</g>
				{/each}
			</g>
		</svg>
	</div>
	
	<!-- Legend -->
	<div class="mt-4 flex items-center justify-center space-x-4">
		<div class="flex items-center space-x-2">
			<div class="w-3 h-3 bg-blue-500 rounded-full"></div>
			<span class="text-sm text-gray-600">Progress Percentage</span>
		</div>
	</div>
	
	<!-- Summary Stats -->
	{#if data.length > 0}
		<div class="mt-4 grid grid-cols-3 gap-4 text-center">
			<div class="bg-gray-50 rounded-lg p-3">
				<div class="text-lg font-semibold text-blue-600">
					{Math.max(...data.map((d: any) => d.value))}%
				</div>
				<div class="text-xs text-gray-500">Tertinggi</div>
			</div>
			<div class="bg-gray-50 rounded-lg p-3">
				<div class="text-lg font-semibold text-green-600">
					{data[data.length - 1]?.value || 0}%
				</div>
				<div class="text-xs text-gray-500">Saat Ini</div>
			</div>
			<div class="bg-gray-50 rounded-lg p-3">
				<div class="text-lg font-semibold text-orange-600">
					{Math.round(data.reduce((sum: number, d: any) => sum + d.value, 0) / data.length)}%
				</div>
				<div class="text-xs text-gray-500">Rata-rata</div>
			</div>
		</div>
	{/if}
</div>