<!-- src/lib/components/Toast.svelte -->
<script lang="ts">
  import { toastStore } from '$lib/stores/toastStore';
  import { onMount } from 'svelte';

  let toasts: any[] = [];

  const unsubscribe = toastStore.subscribe(value => {
    toasts = value;
  });

  onMount(() => {
    return unsubscribe;
  });

  function getToastStyles(type: string) {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white border-green-600';
      case 'error':
        return 'bg-red-500 text-white border-red-600';
      case 'warning':
        return 'bg-yellow-500 text-white border-yellow-600';
      case 'info':
      default:
        return 'bg-blue-500 text-white border-blue-600';
    }
  }

  function getIcon(type: string) {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  }
</script>

{#if toasts.length > 0}
  <div class="fixed top-4 right-4 z-50 space-y-2">
    {#each toasts as toast (toast.id)}
      <div
        class="flex items-center p-4 rounded-lg shadow-lg border-l-4 {getToastStyles(toast.type)} transform transition-all duration-300 ease-in-out animate-slide-in"
        role="alert"
      >
        <div class="shrink-0 mr-3">
          <span class="text-lg font-bold">{getIcon(toast.type)}</span>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium">{toast.message}</p>
        </div>
        <button
          class="ml-4 shrink-0 text-white hover:text-gray-200 transition-colors"
          on:click={() => toastStore.remove(toast.id)}
          aria-label="Tutup notifikasi"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    {/each}
  </div>
{/if}

<style>
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
</style>