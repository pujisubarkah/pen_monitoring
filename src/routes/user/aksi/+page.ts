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

	const instansi_id = userData?.instansi_id;

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