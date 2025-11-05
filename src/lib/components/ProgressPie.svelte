<!-- src/lib/components/ProgressPie.svelte -->
<script>
  export let percentage = 0; // 0–100
  const size = 40;
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
</script>

<div class="flex justify-center">
  <svg width={size} height={size} class="transform -rotate-90">
    <!-- Background circle -->
    <circle
      cx="20"
      cy="20"
      r={radius}
      fill="none"
      stroke="#e5e7eb"
      stroke-width="4"
    />
    <!-- Progress arc -->
    <circle
      cx="20"
      cy="20"
      r={radius}
      fill="none"
      stroke="#3b82f6"
      stroke-width="4"
      stroke-dasharray={circumference}
      stroke-dashoffset={strokeDashoffset}
    />
  </svg>
</div>

<div class="text-center text-xs mt-1 text-gray-600">
  {Math.round(percentage)}%
</div>