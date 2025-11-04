<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	interface Props {
		form?: ActionData & {
			name?: string;
			email?: string;
		};
	}

	let { form }: Props = $props();
	let loading = $state(false);
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let formData = $state({
		name: '',
		email: '',
		password: '',
		confirmPassword: ''
	});
</script>

<svelte:head>
	<title>Register - Pen Monitoring KDMP</title>
</svelte:head>

<!-- Register Section -->
<section class="register-section">
	<div class="register-container">
		<!-- Register Form -->
		<div class="register-aside">
			<div class="aside-container">
				<div class="aside-body">
					<!-- Logo -->
					<a href="/" class="logo-wrapper">
						<img src="https://merahputih.kop.id/images/logo.png" alt="Logo KDMP" class="logo" />
					</a>

					<!-- Register Form -->
					<div class="register-form-wrapper">
						<div class="register-form">
							<div class="register-header">
								<div class="icon-wrapper">
									<div class="icon-bg"></div>
									<span class="icon">📝</span>
								</div>
								<h2 class="register-title">
									Daftar Akun Baru
								</h2>
								<p class="register-subtitle">
									Buat akun untuk mengakses Dashboard Monitoring KDMP
								</p>
							</div>

							<!-- Error Message -->
							{#if form?.error}
								<div class="error-alert">
									<span class="error-icon">⚠️</span>
									<span class="error-text">{form.error}</span>
								</div>
							{/if}

							<form
								method="POST"
								action="?/register"
								use:enhance={() => {
									loading = true;
									return async ({ result, update }) => {
										loading = false;
										update();
									};
								}}
							>
								<!-- Name -->
								<div class="input-group">
									<label for="name" class="input-label">
										<span class="label-icon">👤</span>
										Nama Lengkap
									</label>
									<div class="input-wrapper">
										<input
											id="name"
											name="name"
											type="text"
											autocomplete="name"
											required
											value={form?.name ?? ''}
											class="form-input"
											placeholder="Nama lengkap Anda"
										/>
									</div>
								</div>

								<!-- Email -->
								<div class="input-group">
									<label for="email" class="input-label">
										<span class="label-icon">📧</span>
										Email Address
									</label>
									<div class="input-wrapper">
										<input
											id="email"
											name="email"
											type="email"
											autocomplete="email"
											required
											value={form?.email ?? ''}
											class="form-input"
											placeholder="nama@email.com"
										/>
									</div>
								</div>

								<!-- Password -->
								<div class="input-group">
									<label for="password" class="input-label">
										<span class="label-icon">🔒</span>
										Password
									</label>
									<div class="input-wrapper password-wrapper">
										<input
											id="password"
											name="password"
											type={showPassword ? 'text' : 'password'}
											autocomplete="new-password"
											required
											class="form-input"
											placeholder="Minimal 8 karakter"
										/>
										<button
											type="button"
											class="password-toggle"
											onclick={() => showPassword = !showPassword}
										>
											<span class="toggle-icon">
												{showPassword ? '🙈' : '👁️'}
											</span>
										</button>
									</div>
								</div>

								<!-- Confirm Password -->
								<div class="input-group">
									<label for="confirmPassword" class="input-label">
										<span class="label-icon">🔐</span>
										Konfirmasi Password
									</label>
									<div class="input-wrapper password-wrapper">
										<input
											id="confirmPassword"
											name="confirmPassword"
											type={showConfirmPassword ? 'text' : 'password'}
											autocomplete="new-password"
											required
											class="form-input"
											placeholder="Ulangi password"
										/>
										<button
											type="button"
											class="password-toggle"
											onclick={() => showConfirmPassword = !showConfirmPassword}
										>
											<span class="toggle-icon">
												{showConfirmPassword ? '🙈' : '👁️'}
											</span>
										</button>
									</div>
								</div>

								<!-- Terms & Conditions -->
								<div class="terms-group">
									<label class="checkbox-label">
										<input
											id="terms"
											name="terms"
											type="checkbox"
											required
											class="checkbox-input"
										/>
										<span class="checkbox-text">
											Saya setuju dengan
											<a href="/terms" class="terms-link">Syarat & Ketentuan</a>
											dan
											<a href="/privacy" class="terms-link">Kebijakan Privasi</a>
										</span>
									</label>
								</div>

								<!-- Submit Button -->
								<button
									type="submit"
									disabled={loading}
									class="submit-btn"
									class:loading={loading}
								>
									{#if loading}
										<span class="spinner"></span>
										<span>Mendaftarkan...</span>
									{:else}
										<span>Daftar Akun</span>
										<span class="btn-icon">→</span>
									{/if}
								</button>
							</form>

							<!-- Login Link -->
							<div class="login-section">
								<p class="login-text">
									Sudah punya akun?
									<a href="/" class="login-link">Masuk di sini</a>
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Footer -->
				<div class="aside-footer">
					<div class="footer-text">
						@2025 Lembaga Administrasi Negara
					</div>
				</div>
			</div>
		</div>

		<!-- Right Side: Hero Content -->
		<div class="register-content">
			<div class="content-body">
				<div class="hero-copy">
					<h3 class="hero-title">Bergabunglah!</h3>
					<p class="hero-description">
						Jadilah bagian dari Sistem Informasi Manajemen Monitoring KDMP<br>
						Bersama-sama kita wujudkan penguatan kapasitas 8 pilar Koperasi Desa/Kelurahan Merah Putih.
					</p>

					<!-- Benefits -->
					<div class="benefits-grid">
						<div class="benefit-item">
							<div class="benefit-icon">📊</div>
							<div class="benefit-text">Akses Dashboard Lengkap</div>
						</div>
						<div class="benefit-item">
							<div class="benefit-icon">📈</div>
							<div class="benefit-text">Monitoring Progress Real-time</div>
						</div>
						<div class="benefit-item">
							<div class="benefit-icon">📋</div>
							<div class="benefit-text">Manajemen Evaluasi</div>
						</div>
						<div class="benefit-item">
							<div class="benefit-icon">👥</div>
							<div class="benefit-text">Kolaborasi Tim</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Background Pattern -->
			<div class="hero-pattern">
				<div class="pattern-item pattern-1"></div>
				<div class="pattern-item pattern-2"></div>
				<div class="pattern-item pattern-3"></div>
				<div class="pattern-item pattern-4"></div>
			</div>
		</div>
	</div>
</section>

<style>
	.register-section {
		min-height: 100vh;
		display: flex;
	}

	.register-container {
		display: flex;
		flex-direction: row;
		width: 100%;
		min-height: 100vh;
	}

	/* Left Side: Register Form */
	.register-aside {
		order: 1;
		flex: 0 0 auto;
		width: 480px;
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

	.register-form-wrapper {
		width: 100%;
	}

	.register-form {
		width: 100%;
		animation: fadeIn 0.5s ease-in;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.register-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.icon-wrapper {
		position: relative;
		display: inline-block;
		margin-bottom: 1rem;
	}

	.icon-bg {
		position: absolute;
		inset: -8px;
		background: linear-gradient(135deg, #10b981, #059669, #047857);
		border-radius: 50%;
		opacity: 0.15;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% {
			transform: scale(1);
			opacity: 0.15;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.25;
		}
	}

	.icon {
		position: relative;
		font-size: 2.5rem;
		display: block;
		filter: drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3));
	}

	.register-title {
		font-size: 1.5rem;
		font-weight: 800;
		background: linear-gradient(135deg, #047857, #10b981);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 0.375rem;
	}

	.register-subtitle {
		color: #6b7280;
		font-size: 0.875rem;
	}

	.error-alert {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.875rem 1rem;
		background: linear-gradient(135deg, #fef2f2, #fee2e2);
		border: 1px solid #fca5a5;
		border-radius: 10px;
		margin-bottom: 1.5rem;
		animation: shake 0.5s ease-in-out;
	}

	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		25% { transform: translateX(-4px); }
		75% { transform: translateX(4px); }
	}

	.error-icon {
		font-size: 1.125rem;
		flex-shrink: 0;
	}

	.error-text {
		color: #dc2626;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.input-group {
		margin-bottom: 1.25rem;
	}

	.input-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8125rem;
		font-weight: 600;
		color: #374151;
		margin-bottom: 0.4rem;
	}

	.label-icon {
		font-size: 1rem;
	}

	.input-wrapper {
		position: relative;
	}

	.form-input {
		width: 100%;
		padding: 0.75rem 0.875rem;
		border: 2px solid #e5e7eb;
		border-radius: 10px;
		font-size: 0.875rem;
		transition: all 0.3s ease;
		background: white;
	}

	.form-input:focus {
		outline: none;
		border-color: #10b981;
		box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
		transform: translateY(-2px);
	}

	.form-input::placeholder {
		color: #9ca3af;
	}

	.password-wrapper {
		position: relative;
	}

	.password-toggle {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 8px;
		transition: all 0.2s;
	}

	.password-toggle:hover {
		background: #f3f4f6;
	}

	.toggle-icon {
		font-size: 1.25rem;
		display: block;
	}

	.terms-group {
		margin-bottom: 1.25rem;
	}

	.checkbox-label {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		cursor: pointer;
		line-height: 1.4;
	}

	.checkbox-input {
		width: 1rem;
		height: 1rem;
		border: 2px solid #d1d5db;
		border-radius: 4px;
		cursor: pointer;
		accent-color: #10b981;
		margin-top: 0.125rem;
		flex-shrink: 0;
	}

	.checkbox-text {
		font-size: 0.8125rem;
		color: #4b5563;
	}

	.terms-link {
		color: #10b981;
		text-decoration: none;
		font-weight: 600;
	}

	.terms-link:hover {
		text-decoration: underline;
	}

	.submit-btn {
		width: 100%;
		padding: 0.875rem 1.25rem;
		background: linear-gradient(135deg, #10b981, #059669);
		color: white;
		border: none;
		border-radius: 10px;
		font-size: 0.9375rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
		margin-bottom: 0;
	}

	.submit-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
	}

	.submit-btn:active:not(:disabled) {
		transform: translateY(0);
	}

	.submit-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.btn-icon {
		font-size: 1.25rem;
		transition: transform 0.3s ease;
	}

	.submit-btn:hover:not(:disabled) .btn-icon {
		transform: translateX(4px);
	}

	.spinner {
		width: 1.125rem;
		height: 1.125rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.login-section {
		text-align: center;
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid #e5e7eb;
	}

	.login-text {
		color: #6b7280;
		font-size: 0.875rem;
		margin: 0;
	}

	.login-link {
		color: #10b981;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.login-link:hover {
		color: #047857;
		text-decoration: underline;
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
	.register-content {
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
		background: linear-gradient(90deg, #34d399, #10b981);
		border-radius: 3px;
	}

	.hero-description {
		font-size: 1.125rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.9);
		line-height: 1.7;
		margin-bottom: 2.5rem;
	}

	.benefits-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.benefit-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		transition: all 0.3s ease;
	}

	.benefit-item:hover {
		background: rgba(255, 255, 255, 0.15);
		transform: translateX(4px);
	}

	.benefit-icon {
		font-size: 1.5rem;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 10px;
	}

	.benefit-text {
		color: white;
		font-size: 0.875rem;
		font-weight: 500;
	}

	/* Background Pattern */
	.hero-pattern {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		pointer-events: none;
	}

	.pattern-item {
		position: absolute;
		border-radius: 50%;
		background: linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
		animation: float 20s infinite ease-in-out;
	}

	.pattern-1 {
		width: 300px;
		height: 300px;
		top: 10%;
		left: -5%;
		animation-delay: 0s;
	}

	.pattern-2 {
		width: 200px;
		height: 200px;
		top: 60%;
		right: -5%;
		animation-delay: -7s;
	}

	.pattern-3 {
		width: 150px;
		height: 150px;
		bottom: 20%;
		left: 20%;
		animation-delay: -14s;
	}

	.pattern-4 {
		width: 100px;
		height: 100px;
		top: 30%;
		right: 30%;
		animation-delay: -21s;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0px) rotate(0deg); }
		33% { transform: translateY(-30px) rotate(120deg); }
		66% { transform: translateY(-15px) rotate(240deg); }
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.register-container {
			flex-direction: column;
		}

		.register-aside {
			order: 1;
			width: 100%;
		}

		.register-content {
			order: 2;
			min-height: 400px;
		}

		.hero-title {
			font-size: 2.5rem;
		}

		.benefits-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.register-aside {
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

		.benefit-item {
			padding: 0.75rem;
		}

		.benefit-icon {
			width: 32px;
			height: 32px;
			font-size: 1.25rem;
		}
	}
</style>