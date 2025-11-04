<script lang="ts">
	import LoginForm from '$lib/components/forms/LoginForm.svelte';
	import type { ActionData } from './$types';

	interface Props {
		form?: ActionData;
	}

	let { form }: Props = $props();

	// Carousel functionality
	let currentSlide = $state(0);
	let carouselInterval: number | null = null;

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
				</div>

				<!-- Footer -->
				<div class="aside-footer">
					<div class="footer-text">
						© 2025 Kementerian Koperasi dan UKM Republik Indonesia
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
							<div class="stat-number">83.762</div>
							<div class="stat-label">Total Desa/Kelurahan</div>
						</div>
						<div class="stat-item">
							<div class="stat-number">83.750</div>
							<div class="stat-label">Tersosialisasi</div>
						</div>
						<div class="stat-item">
							<div class="stat-number">81.585</div>
							<div class="stat-label">Berbadan Hukum</div>
						</div>
					</div>
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
</style>
