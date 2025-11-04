<script lang="ts">
	let { data, title = "Performance Radar" } = $props<{ 
		data: Array<{label: string, value: number, maxValue?: number}>, 
		title?: string 
	}>();
	
	// Chart configuration
	const radius = $derived(() => 150);
	const centerX = $derived(() => radius() + 50);
	const centerY = $derived(() => radius() + 50);
	const levels = $derived(() => 5);
	
	// Process data
	const processedData = $derived(() => data.map((item: any, index: number) => {
		const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
		const maxVal = item.maxValue || 100;
		const normalizedValue = (item.value / maxVal) * radius();
		
		return {
			...item,
			angle,
			x: centerX() + Math.cos(angle) * normalizedValue,
			y: centerY() + Math.sin(angle) * normalizedValue,
			labelX: centerX() + Math.cos(angle) * (radius() + 30),
			labelY: centerY() + Math.sin(angle) * (radius() + 30)
		};
	}));
	
	// Create radar grid
	const gridLevels = $derived(() => Array.from({ length: levels() }, (_, i: number) => {
		const levelRadius = ((i + 1) / levels()) * radius();
		return {
			radius: levelRadius,
			points: data.map((_: any, index: number) => {
				const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
				return {
					x: centerX() + Math.cos(angle) * levelRadius,
					y: centerY() + Math.sin(angle) * levelRadius
				};
			})
		};
	}));
	
	// Create polygon path
	const polygonPath = $derived(() => processedData().map((point: any, index: number) => 
		`${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
	).join(' ') + ' Z');
	
	// Axis lines
	const axisLines = $derived(() => data.map((_: any, index: number) => {
		const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
		return {
			x1: centerX(),
			y1: centerY(),
			x2: centerX() + Math.cos(angle) * radius(),
			y2: centerY() + Math.sin(angle) * radius()
		};
	}));
</script>

<div class="bg-white rounded-lg shadow-md p-6">
	<h3 class="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
	
	<div class="flex justify-center">
		<svg width={radius() * 2 + 100} height={radius() * 2 + 100} class="border border-gray-200 rounded">
			<!-- Grid circles -->
			{#each gridLevels() as level, i}
				<polygon
					points={level.points.map((p: any) => `${p.x},${p.y}`).join(' ')}
					fill="none"
					stroke="#e5e7eb"
					stroke-width="1"
					opacity={0.5}
				/>
				
				<!-- Level labels -->
				<text
					x={centerX()}
					y={centerY() - level.radius - 5}
					text-anchor="middle"
					class="text-xs fill-gray-400"
				>
					{Math.round(((i + 1) / levels()) * 100)}%
				</text>
			{/each}
			
			<!-- Axis lines -->
			{#each axisLines() as line}
				<line
					x1={line.x1}
					y1={line.y1}
					x2={line.x2}
					y2={line.y2}
					stroke="#9ca3af"
					stroke-width="1"
				/>
			{/each}
			
			<!-- Data polygon -->
			<path
				d={polygonPath()}
				fill="rgba(59, 130, 246, 0.2)"
				stroke="#3b82f6"
				stroke-width="2"
				stroke-linejoin="round"
			/>
			
			<!-- Data points -->
			{#each processedData() as point}
				<circle
					cx={point.x}
					cy={point.y}
					r="5"
					fill="#3b82f6"
					stroke="white"
					stroke-width="2"
					class="hover:r-7 transition-all cursor-pointer"
				>
					<title>{point.label}: {point.value}%</title>
				</circle>
			{/each}
			
			<!-- Labels -->
			{#each processedData() as point}
				<text
					x={point.labelX}
					y={point.labelY}
					text-anchor="middle"
					dominant-baseline="central"
					class="text-sm font-medium fill-gray-700"
				>
					{point.label}
				</text>
			{/each}
		</svg>
	</div>
	
	<!-- Data summary -->
	<div class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
		{#each data as item}
			<div class="bg-gray-50 rounded-lg p-3 text-center">
				<div class="text-lg font-semibold text-blue-600">
					{item.value}%
				</div>
				<div class="text-xs text-gray-600">{item.label}</div>
			</div>
		{/each}
	</div>
	
	<!-- Performance indicators -->
	<div class="mt-4 flex justify-center space-x-6 text-sm">
		<div class="flex items-center space-x-2">
			<div class="w-3 h-3 bg-green-500 rounded-full"></div>
			<span class="text-gray-600">Baik (≥80%)</span>
		</div>
		<div class="flex items-center space-x-2">
			<div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
			<span class="text-gray-600">Cukup (60-79%)</span>
		</div>
		<div class="flex items-center space-x-2">
			<div class="w-3 h-3 bg-red-500 rounded-full"></div>
			<span class="text-gray-600">Kurang (&lt;60%)</span>
		</div>
	</div>
</div>