<script lang="ts">
	import { onMount } from 'svelte';
	let lucideScript = null;

	onMount(() => {
		lucideScript = document.createElement('script');
		lucideScript.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.js';
		lucideScript.onload = () => {
			if ((window as any).lucide) (window as any).lucide.createIcons();
		};
		document.body.appendChild(lucideScript);
	});
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
	<!-- Hero Section -->
	<section class="relative text-center max-w-3xl mb-20">
		<div class="absolute inset-0 flex items-center justify-center opacity-30 blur-3xl">
			<div class="w-72 h-72 bg-indigo-600/40 rounded-full animate-pulse"></div>
			<div class="w-60 h-60 bg-pink-500/40 rounded-full animate-ping absolute top-12 right-12"></div>
		</div>

		<h1 class="text-5xl md:text-6xl font-extrabold mb-6 relative z-10">
			Level Up Your <span class="text-indigo-400">Digital Experience</span>
		</h1>
		<p class="text-gray-300 text-lg md:text-xl mb-8 relative z-10">
			A beautifully modern Svelte + Tailwind app to showcase your next big thing.
		</p>

		<div class="flex justify-center space-x-4 relative z-10">
			<button class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-semibold transition-all duration-300">
				Get Started
			</button>
			<button class="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-2xl border border-white/20 font-semibold transition-all duration-300">
				Learn More
			</button>
		</div>
	</section>

	<!-- Features Section -->
	<section class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
		<div class="p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl hover:scale-105 transition-transform">
			<div class="flex justify-center items-center w-12 h-12 bg-indigo-600/20 rounded-xl mb-4">
				<i data-lucide="cpu" class="w-6 h-6 text-indigo-400"></i>
			</div>
			<h3 class="text-xl font-semibold mb-2">Lightning Fast</h3>
			<p class="text-gray-400">Experience blazing speed with modern architecture.</p>
		</div>

		<div class="p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl hover:scale-105 transition-transform">
			<div class="flex justify-center items-center w-12 h-12 bg-pink-600/20 rounded-xl mb-4">
				<i data-lucide="palette" class="w-6 h-6 text-pink-400"></i>
			</div>
			<h3 class="text-xl font-semibold mb-2">Sleek Design</h3>
			<p class="text-gray-400">Crafted with elegance using Tailwind’s modern utilities.</p>
		</div>

		<div class="p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl hover:scale-105 transition-transform">
			<div class="flex justify-center items-center w-12 h-12 bg-emerald-600/20 rounded-xl mb-4">
				<i data-lucide="sparkles" class="w-6 h-6 text-emerald-400"></i>
			</div>
			<h3 class="text-xl font-semibold mb-2">Smooth Animations</h3>
			<p class="text-gray-400">Enjoy built-in Tailwind transitions and pulse effects.</p>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="mt-24 text-center max-w-3xl">
		<h2 class="text-4xl font-bold mb-4">
			Ready to build something <span class="text-indigo-400">amazing</span>?
		</h2>
		<p class="text-gray-400 mb-6">
			Everything you need to design, develop, and deploy — all in one sleek setup.
		</p>
		<button class="px-8 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 hover:opacity-90 text-white font-semibold rounded-2xl transition-all duration-300">
			Start Now
		</button>
	</section>
</div>
