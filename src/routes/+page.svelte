<script lang="ts">
	import LoginForm from '$lib/components/forms/LoginForm.svelte';
	import type { ActionData, PageData as OriginalPageData } from './$types';

	// Extend PageData to allow optional 'name' property on user
	type PageData = Omit<OriginalPageData, 'user'> & {
		user?: OriginalPageData['user'] & { name?: string };
	};
	import { userStore } from '$lib/stores/userStore';
	import { onMount } from 'svelte';

	interface Props {
		data: PageData;
		form?: ActionData;
	}

	let { data, form }: Props = $props();

	// Stats data from API
	let statsData = $state({
		totalDesaKelurahan: 0,
		berbadanHukum: 0,
		desaBerbadanHukum: 0,
		kelurahanBerbadanHukum: 0,
		loading: true,
		lastUpdated: ''
	});

	// Fetch statistics from API
	async function fetchStatistics() {
		try {
			const response = await fetch('https://api.merahputih.kop.id/api/cooperative/statistic');
			const result = await response.json();
			if (result.data && result.data.state) {
				const legalStage3 = result.data.state.find((item: any) => item.legalStageId === 3);
				statsData = {
					totalDesaKelurahan: legalStage3?.target || 0,
					berbadanHukum: legalStage3?.count || 0,
					desaBerbadanHukum: legalStage3?.desa || 0,
					kelurahanBerbadanHukum: legalStage3?.kelurahan || 0,
					loading: false,
					lastUpdated: result.data.latest_ahu_updated || ''
				};
			}
		} catch (error) {
			console.error('Error fetching statistics:', error);
			// Use default values on error
			statsData = {
				totalDesaKelurahan: 83631,
				berbadanHukum: 83261,
				desaBerbadanHukum: 74659,
				kelurahanBerbadanHukum: 8602,
				loading: false,
				lastUpdated: ''
			};
		}
	}

	// Initialize user store with data from server
	onMount(() => {
		if (data.user) {
			// Convert server user data to client format
			const clientUser = {
				id: String(data.user.id),
				name: data.user.name, // Now available from server
				email: data.user.email,
				role: data.user.role as "user" | "admin" | "viewer",
				instansi_id: data.user.instansi_id,
				created_at: new Date().toISOString() // We don't have this from cookie, use current time
			};
			userStore.login(clientUser);
		}
		
		// Fetch statistics on mount
		fetchStatistics();
	});

	// Carousel functionality
	let currentSlide = $state(0);
	let carouselInterval: ReturnType<typeof setInterval> | null = null;

	const galleryImages = [
		'https://merahputih.kop.id/images/gallery/dok1.webp',
		'https://merahputih.kop.id/images/gallery/dok2.webp',
		'https://merahputih.kop.id/images/gallery/dok3.webp',
		'https://merahputih.kop.id/images/gallery/dok4.webp',
		'https://merahputih.kop.id/images/gallery/dok5.webp'
	];

	function nextSlide() {
		currentSlide = (currentSlide + 1) % galleryImages.length;
	}

	function prevSlide() {
		currentSlide = currentSlide === 0 ? galleryImages.length - 1 : currentSlide - 1;
	}

	function startCarousel() {
		carouselInterval = setInterval(() => {
			nextSlide();
		}, 5000);
	}

	function stopCarousel() {
		if (carouselInterval) {
			clearInterval(carouselInterval);
			carouselInterval = null;
		}
	}

	$effect(() => {
		startCarousel();
		return () => stopCarousel();
	});

	// Format number with thousand separators
	function formatNumber(num: number): string {
		return num.toLocaleString('id-ID');
	}
</script>

<svelte:head>
	<title>Login - Pen Monitoring KDMP</title>
</svelte:head>

<!-- Login Section -->
<section class="login-section">
	<div class="login-container">
		<!-- Left Side: Login Form -->
		<div class="login-aside">
			<div class="aside-container">
				<div class="aside-body">
					<!-- Logo -->
					<a href="/" class="logo-wrapper">
						<img src="https://merahputih.kop.id/images/logo.png" alt="Logo KDMP" class="logo" />
					</a>

				<!-- Login Form -->
				<div class="login-form-wrapper">
					<LoginForm {form} />
				</div>

				<!-- Manual Book Button -->
				<div class="manual-book-wrapper">
					<a href="https://drive.google.com/file/d/1xyyp9K5kvBFyH62Ng1iYpFreFO-_qEb4/view?usp=drivesdk" target="_blank" class="manual-book-btn">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
							<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
						</svg>
						<span>Buku Panduan</span>
					</a>
				</div>
			</div>

			<!-- Footer -->
			<div class="aside-footer">
					<div class="footer-text">
						 Hak Cipta @2025 Lembaga Administrasi Negara
					</div>
				</div>
			</div>
		</div>

		<!-- Right Side: Hero Content -->
		<div class="login-content">
			<div class="content-body">
				<div class="hero-copy">
					<h3 class="hero-title">Selamat Datang!</h3>
					<p class="hero-description">
						Sistem Informasi Manajemen Monitoring KDMP<br>
						Platform monitoring penguatan kapasitas 8 pilar Koperasi Desa/Kelurahan Merah Putih di seluruh Indonesia.
					</p>

					<!-- Stats Grid -->
					  <div class="stats-grid">
						<div class="stat-item">
							<div class="stat-number">
								{#if statsData.loading}
									<span class="loading-shimmer">--</span>
								{:else}
									{formatNumber(statsData.totalDesaKelurahan)}
								{/if}
							</div>
							<div class="stat-label">Target Desa/Kelurahan</div>
						</div>
						<div class="stat-item">
							<div class="stat-number">
								{#if statsData.loading}
									<span class="loading-shimmer">--</span>
								{:else}
									{formatNumber(statsData.berbadanHukum)}
								{/if}
							</div>
							<div class="stat-label">Total Berbadan Hukum</div>
						</div>
						<div class="stat-item">
							<div class="stat-number">
								{#if statsData.loading}
									<span class="loading-shimmer">--</span>
								{:else}
									{formatNumber(statsData.desaBerbadanHukum)}
								{/if}
							</div>
							<div class="stat-label">Desa Berbadan Hukum</div>
						</div>
						<div class="stat-item">
							<div class="stat-number">
								{#if statsData.loading}
									<span class="loading-shimmer">--</span>
								{:else}
									{formatNumber(statsData.kelurahanBerbadanHukum)}
								{/if}
							</div>
							<div class="stat-label">Kelurahan Berbadan Hukum</div>
						</div>
					</div>
					<div class="logo-gabungan-wrapper">
						<img src="https://simkopdes.go.id/images/logo-kementerian/gabungan2.png" alt="Logo Gabungan Kementerian" class="logo-gabungan" />
					</div>
					{#if statsData.lastUpdated}
						<div class="stat-label" style="margin-top:0.5rem;color:#fff;font-size:0.9rem;">
							Data terakhir diperbarui: {statsData.lastUpdated}
						</div>
					{/if}
				</div>
			</div>

			<!-- Background Carousel -->
			<div class="hero-carousel">
				{#each galleryImages as image, index}
					<div class="carousel-slide" class:active={index === currentSlide}>
						<img src={image} alt="KDMP Gallery {index + 1}" />
					</div>
				{/each}
			</div>

			<!-- Carousel Indicators -->
			<div class="carousel-indicators">
				{#each galleryImages as _, index}
					<button
						type="button"
						class="indicator"
						class:active={index === currentSlide}
						onclick={() => currentSlide = index}
						aria-label="Go to slide {index + 1}"
					></button>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.login-section {
		min-height: 100vh;
		display: flex;
	}

	.login-container {
		display: flex;
		flex-direction: row;
		width: 100%;
		min-height: 100vh;
	}

	/* Left Side: Login Form */
	.login-aside {
		order: 1;
		flex: 0 0 auto;
		width: 450px;
		background: white;
		display: flex;
		flex-direction: column;
		padding: 2.5rem;
	}

	.aside-container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
	}

	.aside-body {
		display: flex;
		flex-direction: column;
		flex: 1;
		justify-content: center;
	}

	.logo-wrapper {
		display: block;
		text-align: center;
		margin-bottom: 3.5rem;
	}

	.logo {
		max-height: 85px;
		width: auto;
	}

	.login-form-wrapper {
		width: 100%;
	}

	.manual-book-wrapper {
		margin-top: 1.5rem;
		text-align: center;
	}

	.manual-book-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
		color: white;
		text-decoration: none;
		border-radius: 8px;
		font-size: 0.9rem;
		font-weight: 600;
		transition: all 0.3s ease;
		box-shadow: 0 2px 8px rgba(15, 23, 42, 0.2);
	}

	.manual-book-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(15, 23, 42, 0.3);
		background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
	}

	.manual-book-btn svg {
		flex-shrink: 0;
	}

	.aside-footer {
		margin-top: 3rem;
		padding-top: 1.5rem;
	}

	.footer-text {
		font-size: 0.8125rem;
		color: #6b7280;
		text-align: center;
		font-weight: 500;
	}

	/* Right Side: Hero Content */
	.login-content {
		order: 2;
		flex: 1;
		position: relative;
		display: flex;
		flex-direction: column;
		background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e40af 100%);
		overflow: hidden;
	}

	.content-body {
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 3rem 4rem;
		flex: 1;
	}

	.hero-copy {
		max-width: 650px;
	}

	.hero-title {
		font-size: 3.5rem;
		font-weight: 700;
		color: white;
		margin-bottom: 1.75rem;
		line-height: 1.1;
		position: relative;
		display: inline-block;
	}

	.hero-title::after {
		content: '';
		position: absolute;
		bottom: -0.5rem;
		left: 0;
		width: 100px;
		height: 6px;
		background: linear-gradient(90deg, #fbbf24, #f59e0b);
		border-radius: 3px;
	}

	.hero-description {
		font-size: 1.125rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.9);
		line-height: 1.7;
		margin-bottom: 2.5rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.stat-item {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		padding: 1.5rem;
		border-radius: 12px;
		text-align: center;
	}

	.stat-number {
		font-size: 2rem;
		font-weight: 700;
		color: #fbbf24;
		margin-bottom: 0.5rem;
	}

	.stat-label {
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.8);
		font-weight: 500;
	}

	/* Loading shimmer effect */
	.loading-shimmer {
		display: inline-block;
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.1) 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
		border-radius: 4px;
		padding: 0 1rem;
	}

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}

	/* Background Carousel */
	.hero-carousel {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	.carousel-slide {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		transition: opacity 1.5s ease-in-out;
	}

	.carousel-slide.active {
		opacity: 0.25;
	}

	.carousel-slide img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.carousel-indicators {
		position: absolute;
		bottom: 2.5rem;
		left: 4rem;
		display: flex;
		gap: 0.75rem;
		z-index: 10;
	}

	.indicator {
		width: 35px;
		height: 3px;
		background: rgba(255, 255, 255, 0.3);
		border: none;
		border-radius: 2px;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.indicator.active {
		background: white;
		width: 50px;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.login-container {
			flex-direction: column;
		}

		.login-aside {
			order: 1;
			width: 100%;
		}

		.login-content {
			order: 2;
			min-height: 400px;
		}

		.hero-title {
			font-size: 2.5rem;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		.carousel-indicators {
			left: 2rem;
			bottom: 1.5rem;
		}
	}

	@media (max-width: 640px) {
		.login-aside {
			padding: 1.5rem;
		}

		.logo-wrapper {
			margin-bottom: 2rem;
		}

		.logo {
			max-height: 65px;
		}

		.content-body {
			padding: 2rem;
		}

		.hero-title {
			font-size: 2rem;
		}

		.hero-description {
			font-size: 1rem;
		}

		.stat-number {
			font-size: 1.5rem;
		}
	}
	.logo-gabungan-wrapper {
		margin: 2rem 0 0.5rem 0;
		text-align: center;
	}
	.logo-gabungan {
		max-width: 350px;
		width: 100%;
		height: auto;
		display: inline-block;
		filter: drop-shadow(0 2px 8px rgba(0,0,0,0.08));
	}
</style>
