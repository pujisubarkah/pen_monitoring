<script lang="ts">
	export let data: Array<{ id: number; instansiId: number; namaInstansi: string; children?: any[] }> = [];
</script>

<div class="org-chart">
	{#if data.length === 0}
		<p>Tidak ada data instansi.</p>
	{:else}
		<ul class="org-root">
			{#each data as node}
				<li>
					<div class="org-node">
						<span class="org-title">{node.namaInstansi}</span>
						<span class="org-id">ID: {node.instansiId}</span>
					</div>
					{#if node.children && node.children.length > 0}
						<ul class="org-children">
							{#each node.children as child}
								<li>
									<div class="org-node">
										<span class="org-title">{child.namaInstansi}</span>
										<span class="org-id">ID: {child.instansiId}</span>
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
.org-chart {
	padding: 2rem;
	background: #fff;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.org-root, .org-children {
	list-style: none;
	padding-left: 1.5rem;
}
.org-node {
	background: #e0f2fe;
	border: 1px solid #bae6fd;
	border-radius: 8px;
	padding: 0.5rem 1rem;
	margin-bottom: 0.5rem;
	box-shadow: 0 1px 4px rgba(0,0,0,0.03);
	font-size: 1rem;
	font-weight: 500;
	color: #0369a1;
	position: relative;
}
.org-title {
	font-weight: bold;
}
.org-id {
	font-size: 0.85em;
	color: #64748b;
	margin-left: 1rem;
}
</style>
