<script lang="ts">
  import { onMount } from 'svelte';
  type SatgasRegion = {
    provinsi: string;
    jumlah_koperasi: number;
    jumlah_sosialisasi: number;
  };
  type SatgasWilayah = {
    position: string;
    regions: SatgasRegion[];
  };
  let satgasSummary: SatgasWilayah[] = [];
  let loading = true;
  let error = '';
  let chartData: { wilayah: string; totalKoperasi: number; totalSosialisasi: number }[] = [];

  async function fetchSatgas() {
    loading = true;
    error = '';
    try {
      const res = await fetch('https://api.merahputih.kop.id/api/cooperative/statistic');
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data.satgas_summary)) {
        satgasSummary = json.data.satgas_summary;
        chartData = satgasSummary.map(wilayah => ({
          wilayah: wilayah.position,
          totalKoperasi: wilayah.regions.reduce((sum, r) => sum + r.jumlah_koperasi, 0),
          totalSosialisasi: wilayah.regions.reduce((sum, r) => sum + r.jumlah_sosialisasi, 0)
        }));
      } else {
        error = 'Data tidak ditemukan.';
      }
    } catch (e) {
      error = 'Gagal mengambil data.';
    }
    loading = false;
  }
  onMount(fetchSatgas);
</script>

<div class="ant-card ant-card-bordered mb-4 relative css-1asrvcy" style="width: 100%; box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;">
  <div class="ant-card-body px-0 max-w-[80vw]">
    <h2 class="text-xl font-bold mb-4 text-center">Data Statistik Koperasi Desa/Kelurahan Merah Putih Berbadan Hukum Berdasarkan Wilayah Satuan Tugas Nasional</h2>
    <div class="absolute top-4 right-4 z-10">
      <button title="Refresh Data" type="button" class="ant-btn css-1asrvcy ant-btn-text ant-btn-color-default ant-btn-variant-text ant-btn-icon-only" on:click={fetchSatgas}>
        <span class="ant-btn-icon">
          <span role="img" aria-label="reload" class="anticon anticon-reload">
            <svg viewBox="64 64 896 896" focusable="false" data-icon="reload" width="1em" height="1em" fill="currentColor" aria-hidden="true">
              <path d="M909.1 209.3l-56.4 44.1C775.8 155.1 656.2 92 521.9 92 290 92 102.3 279.5 102 511.5 101.7 743.7 289.8 932 521.9 932c181.3 0 335.8-115 394.6-276.1 1.5-4.2-.7-8.9-4.9-10.3l-56.7-19.5a8 8 0 00-10.1 4.8c-1.8 5-3.8 10-5.9 14.9-17.3 41-42.1 77.8-73.7 109.4A344.77 344.77 0 01655.9 829c-42.3 17.9-87.4 27-133.8 27-46.5 0-91.5-9.1-133.8-27A341.5 341.5 0 01279 755.2a342.16 342.16 0 01-73.7-109.4c-17.9-42.4-27-87.4-27-133.9s9.1-91.5 27-133.9c17.3-41 42.1-77.8 73.7-109.4 31.6-31.6 68.4-56.4 109.3-73.8 42.3-17.9 87.4-27 133.8-27 46.5 0 91.5-9.1 133.8 27a341.5 341.5 0 01109.3 73.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 003 14.1l175.6 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c-.1-6.6-7.8-10.3-13-6.2z"></path>
            </svg>
          </span>
        </span>
      </button>
    </div>
    <div class="overflow-x-auto">
      <div class="mx-auto" style="width: 700px; height: 500px;">
        {#if loading}
          <div class="p-8 text-center text-gray-500">Memuat data...</div>
        {:else if error}
          <div class="p-8 text-center text-red-500">{error}</div>
        {:else}
          <!-- Simple SVG bar chart: one bar per wilayah, koperasi & sosialisasi -->
          <svg width="700" height="500" viewBox="0 0 700 500" style="width: 100%; height: 100%;">
            <g>
              {#each chartData as data, idx}
                <!-- Bar for totalKoperasi -->
                <rect x={80 + idx * 120} y={400 - data.totalKoperasi / 30} width="30" height={data.totalKoperasi / 30} fill="#4CC9FE" />
                <!-- Bar for totalSosialisasi -->
                <rect x={80 + idx * 120 + 40} y={400 - data.totalSosialisasi / 30} width="30" height={data.totalSosialisasi / 30} fill="#82ca9d" />
                <!-- Wilayah label -->
                <text x={80 + idx * 120 + 35} y="450" font-size="12" font-weight="bold" text-anchor="middle" fill="#666" transform={`rotate(-15,${80 + idx * 120 + 35},450)`}>{data.wilayah}</text>
                <!-- Value labels -->
                <text x={80 + idx * 120 + 15} y={400 - data.totalKoperasi / 30 - 10} font-size="11" text-anchor="middle" fill="#4CC9FE">{data.totalKoperasi}</text>
                <text x={80 + idx * 120 + 55} y={400 - data.totalSosialisasi / 30 - 10} font-size="11" text-anchor="middle" fill="#82ca9d">{data.totalSosialisasi}</text>
              {/each}
            </g>
            <!-- Y axis labels -->
            <text x="72" y="400" font-size="12" text-anchor="end" fill="#666">0</text>
            <text x="72" y="262" font-size="12" text-anchor="end" fill="#666">8000</text>
            <text x="72" y="187" font-size="12" text-anchor="end" fill="#666">16000</text>
            <text x="72" y="40" font-size="12" text-anchor="end" fill="#666">31606</text>
          </svg>
          <div class="flex justify-center gap-6 mt-2">
            <span class="recharts-legend-item-text flex items-center gap-2">
              <span style="display:inline-block;width:16px;height:16px;background:rgb(76,201,254);border-radius:3px;"></span>
              <span style="color: rgb(76, 201, 254);">Total Koperasi</span>
            </span>
            <span class="recharts-legend-item-text flex items-center gap-2">
              <span style="display:inline-block;width:16px;height:16px;background:rgb(130,202,157);border-radius:3px;"></span>
              <span style="color: rgb(130, 202, 157);">Total Desa/Kelurahan Terbentuk Melalui Musyawarah Desa Khusus</span>
            </span>
          </div>
        {/if}
      </div>
    </div>
    <!-- Table below chart -->
    <div class="mt-8 overflow-x-auto">
      <table class="min-w-full table-auto border border-gray-300 bg-white rounded-xl shadow-lg">
        <thead class="bg-gray-100">
          <tr>
            <th>Satuan Tugas</th>
            <th>Provinsi</th>
            <th>Jumlah Koperasi</th>
            <th>Jumlah Sosialisasi</th>
          </tr>
        </thead>
        <tbody>
          {#if !loading && !error}
            {#each satgasSummary as wilayah}
              {#each wilayah.regions as region}
                <tr>
                  <td>{wilayah.position}</td>
                  <td>{region.provinsi}</td>
                  <td>{region.jumlah_koperasi}</td>
                  <td>{region.jumlah_sosialisasi}</td>
                </tr>
              {/each}
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>
