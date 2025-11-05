<script lang="ts">
	export let data: Array<{ id: number; instansiId: number; namaInstansi: string; children?: any[] }> = [];
</script>

<div class="org-chart">
	{#if data.length === 0}
		<div class="empty-state">
			<div class="empty-icon">🚀</div>
			<h3 class="empty-title">Pilar Koperasi Merah Putih</h3>
			<p class="empty-description">Struktur hierarki 7 pilar strategis pengembangan koperasi nasional akan ditampilkan di sini.</p>
		</div>
	{:else}
		<div class="org-header">
			<h3 class="org-title">Struktur Organisasi Instansi</h3>
			<p class="org-subtitle">Hierarki dan struktur instansi pemerintah</p>
		</div>

		<div class="org-content">
			<ul class="org-root">
				{#each data as node}
					<li class="org-item">
						<div class="org-node org-node-root">
							<div class="org-node-content">
								<span class="org-title">{node.namaInstansi}</span>
								<span class="org-id">ID: {node.instansiId}</span>
							</div>
							<div class="org-node-icon">🏛️</div>
						</div>
						{#if node.children && node.children.length > 0}
							<ul class="org-children">
								{#each node.children as child}
									<li class="org-child-item">
										<div class="org-node org-node-child">
											<div class="org-node-content">
												<span class="org-title">{child.namaInstansi}</span>
												<span class="org-id">ID: {child.instansiId}</span>
											</div>
											<div class="org-node-icon">
												{#if child.namaInstansi.includes('Pembiayaan')}
													💰
												{:else if child.namaInstansi.includes('SDM')}
													👥
												{:else if child.namaInstansi.includes('Usaha')}
													�
												{:else if child.namaInstansi.includes('Produk')}
													📦
												{:else if child.namaInstansi.includes('Pemasaran')}
													🛒
												{:else if child.namaInstansi.includes('Digitalisasi')}
													💻
												{:else if child.namaInstansi.includes('Jejaring')}
													🤝
												{:else}
													�🏢
												{/if}
											</div>
										</div>
										{#if child.children && child.children.length > 0}
											<ul class="org-grandchildren">
												{#each child.children as grandchild}
													<li class="org-grandchild-item">
														<div class="org-node org-node-grandchild">
															<div class="org-node-content">
																<span class="org-title">{grandchild.namaInstansi}</span>
																<span class="org-id">ID: {grandchild.instansiId}</span>
															</div>
															<div class="org-node-icon">
																{#if grandchild.namaInstansi.includes('Keuangan') || grandchild.namaInstansi.includes('Bank')}
																	🏦
																{:else if grandchild.namaInstansi.includes('Pelatihan') || grandchild.namaInstansi.includes('Sertifikasi')}
																	�
																{:else if grandchild.namaInstansi.includes('Bisnis') || grandchild.namaInstansi.includes('UMKM')}
																	💼
																{:else if grandchild.namaInstansi.includes('Produk') || grandchild.namaInstansi.includes('Standarisasi')}
																	🔧
																{:else if grandchild.namaInstansi.includes('Marketplace') || grandchild.namaInstansi.includes('Ekspor')}
																	🌐
																{:else if grandchild.namaInstansi.includes('Digital') || grandchild.namaInstansi.includes('Sistem')}
																	📱
																{:else if grandchild.namaInstansi.includes('Koperasi')}
																	🤝
																{:else}
																	�🏬
																{/if}
															</div>
														</div>
													</li>
												{/each}
											</ul>
										{/if}
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.org-chart {
		padding: 2rem;
		background: #fff;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.04);
		min-height: 300px;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 3rem 2rem;
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		opacity: 0.6;
	}

	.empty-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #dc2626;
		margin-bottom: 0.5rem;
	}

	.empty-description {
		color: #6b7280;
		font-size: 1rem;
		max-width: 400px;
	}

	.org-header {
		margin-bottom: 2rem;
		text-align: center;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.org-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #111827;
		margin-bottom: 0.25rem;
	}

	.org-subtitle {
		color: #6b7280;
		font-size: 0.875rem;
	}

	.org-content {
		position: relative;
	}

	.org-root, .org-children, .org-grandchildren {
		list-style: none;
		padding-left: 0;
		margin: 0;
	}

	.org-item {
		position: relative;
		margin-bottom: 3rem;
	}

	.org-child-item {
		position: relative;
		margin-bottom: 2rem;
		margin-left: 4rem;
	}

	.org-grandchild-item {
		position: relative;
		margin-bottom: 1.5rem;
		margin-left: 6rem;
	}

	.org-child-item::before {
		content: '';
		position: absolute;
		left: -2rem;
		top: 50%;
		width: 2rem;
		height: 2px;
		background: #dc2626;
		transform: translateY(-50%);
	}

	.org-child-item::after {
		content: '';
		position: absolute;
		left: -2rem;
		top: 0;
		width: 2px;
		height: 50%;
		background: #dc2626;
	}

	.org-grandchild-item::before {
		content: '';
		position: absolute;
		left: -2rem;
		top: 50%;
		width: 2rem;
		height: 2px;
		background: #991b1b;
		transform: translateY(-50%);
	}

	.org-grandchild-item::after {
		content: '';
		position: absolute;
		left: -2rem;
		top: 0;
		width: 2px;
		height: 50%;
		background: #991b1b;
	}

	.org-node {
		background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
		border: 2px solid #0ea5e9;
		border-radius: 12px;
		padding: 1rem 1.5rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 60px;
	}

	.org-node:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	.org-node-root {
		background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
		border-color: #991b1b;
		font-size: 1.1em;
		min-height: 70px;
		color: white;
	}

	.org-node-root .org-title,
	.org-node-root .org-id {
		color: white;
	}

	.org-node-child {
		background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
		border-color: #dc2626;
		transform: scale(0.95);
		box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.1);
	}

	.org-node-grandchild {
		background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
		border-color: #9ca3af;
		transform: scale(0.9);
		font-size: 0.9em;
		min-height: 50px;
		box-shadow: 0 2px 4px -1px rgba(156, 163, 175, 0.1);
	}

	.org-node-content {
		flex: 1;
	}

	.org-title {
		display: block;
		font-weight: 700;
		font-size: 1.125rem;
		color: #0f172a;
		margin-bottom: 0.25rem;
		line-height: 1.2;
	}

	.org-id {
		font-size: 0.875rem;
		color: #64748b;
		font-weight: 500;
	}

	.org-node-icon {
		font-size: 2rem;
		opacity: 0.8;
		margin-left: 1rem;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.org-chart {
			padding: 1rem;
		}

		.org-node {
			padding: 0.75rem 1rem;
			min-height: 50px;
		}

		.org-node-root {
			min-height: 60px;
		}

		.org-child-item {
			margin-left: 2rem;
		}

		.org-grandchild-item {
			margin-left: 4rem;
		}

		.org-child-item::before,
		.org-grandchild-item::before {
			width: 1.5rem;
			left: -1.5rem;
		}

		.org-child-item::after,
		.org-grandchild-item::after {
			left: -1.5rem;
		}

		.org-node-grandchild {
			font-size: 0.8em;
			min-height: 45px;
		}
	}
</style>
