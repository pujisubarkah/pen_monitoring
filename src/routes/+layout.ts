import type { LayoutLoad } from './$types';
import { userStore } from '$lib/stores/userStore';

export const load: LayoutLoad = async ({ url }) => {
	// Initialize user store
	userStore.initialize();
	
	return {
		url: url.pathname
	};
};