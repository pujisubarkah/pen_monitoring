import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, data }) => {
	// Get current user data from API
	let userData = data.user;
	if (data.user?.id) {
		try {
			const userRes = await fetch(`/api/users/${data.user.id}`);
			if (userRes.ok) {
				const userResult = await userRes.json();
				if (userResult.success) {
					userData = userResult.data;
				}
			}
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
	}

	// Get instansi_id from user data (this will be used as fallback)
	const instansi_id = userData?.instansi_id;

	// Note: The actual instansi_id will be fetched from localStorage on the client side
	// For now, we'll try to use the server-side data if available
	if (!instansi_id) {
		return {
			user: userData,
			plans: { success: false, data: [], pagination: null }
		};
	}

	try {
		const res = await fetch(`/api/action-plans/instansi/${instansi_id}`);

		if (!res.ok) {
			throw new Error('Failed to fetch action plans');
		}

		const plans = await res.json();

		return {
			user: userData,
			plans
		};
	} catch (error) {
		console.error('Error fetching action plans:', error);
		return {
			user: userData,
			plans: { success: false, data: [], pagination: null }
		};
	}
};