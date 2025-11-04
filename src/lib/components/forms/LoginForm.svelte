<script lang="ts">
	import { enhance } from '$app/forms';

	interface Props {
		form?: any;
	}

	let { form }: Props = $props();
	let loading = $state(false);
	let showPassword = $state(false);
</script>

<div class="login-form">
	<div class="login-header">
		<div class="icon-wrapper">
			<div class="icon-bg"></div>
			<span class="icon">🔐</span>
		</div>
		<p class="login-subtitle">
			Masuk ke Dashboard Monitoring KDMP
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
		action="?/login"
		use:enhance={() => {
			loading = true;
			return async ({ result, update }) => {
				loading = false;
				update();
			};
		}}
	>
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
					autocomplete="current-password"
					required
					class="form-input"
					placeholder="••••••••"
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

		<!-- Remember Me & Forgot Password -->
		<div class="form-options">
			<label class="checkbox-label">
				<input
					id="remember-me"
					name="remember-me"
					type="checkbox"
					class="checkbox-input"
				/>
				<span class="checkbox-text">Ingat saya</span>
			</label>

			<button type="button" class="forgot-link">
				Lupa password?
			</button>
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
				<span>Memproses...</span>
			{:else}
				<span>Masuk ke Dashboard</span>
				<span class="btn-icon">→</span>
			{/if}
		</button>
	</form>
</div>

<style>
	.login-form {
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

	.login-header {
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
		background: linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb);
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
		filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3));
	}

	.login-subtitle {
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
		border-color: #3b82f6;
		box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
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

	.form-options {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.25rem;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.checkbox-input {
		width: 1rem;
		height: 1rem;
		border: 2px solid #d1d5db;
		border-radius: 4px;
		cursor: pointer;
		accent-color: #3b82f6;
	}

	.checkbox-text {
		font-size: 0.8125rem;
		color: #4b5563;
	}

	.forgot-link {
		font-size: 0.8125rem;
		font-weight: 600;
		color: #3b82f6;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		transition: all 0.2s;
	}

	.forgot-link:hover {
		color: #2563eb;
		text-decoration: underline;
	}

	.submit-btn {
		width: 100%;
		padding: 0.875rem 1.25rem;
		background: linear-gradient(135deg, #3b82f6, #2563eb);
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
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
		margin-bottom: 0;
	}

	.submit-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
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
</style>