import type { LayoutLoad } from './$types';
import { userStore } from '$lib/stores/userStore';
import { browser } from '$app/environment';

export const load: LayoutLoad = async ({ url, fetch }) => {
	// Get user data from server
	let user = null;
	try {
		const res = await fetch('/api/auth/user');
		if (res.ok) {
			const userData = await res.json();
			user = userData.user;
		}
	} catch (error) {
		console.error('Failed to fetch user data:', error);
	}

	// Initialize user store with server data
	if (browser && user) {
		userStore.login(user);
	} else {
		userStore.initialize();
	}
	
	return {
		url: url.pathname,
		user
	};
};