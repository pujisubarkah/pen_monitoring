<script lang="ts">
// Komponen grafis organizational chart akan diimport di sini
</script>

<section class="peta-kinerja-section">
	<h1>Peta Kinerja Instansi</h1>
	<!-- Tempatkan komponen chart di bawah ini -->
	<div class="chart-container">
		<!-- OrganizationalChart.svelte akan diimport dan digunakan di sini -->
		<!-- <OrganizationalChart data={instansiData}/> -->
		<p>Grafik pohon kinerja instansi akan tampil di sini.</p>
	</div>
</section>

<style>
.peta-kinerja-section {
	padding: 2rem;
}
.chart-container {
	margin-top: 2rem;
	min-height: 400px;
	background: #f9fafb;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.04);
	padding: 2rem;
}
</style>
