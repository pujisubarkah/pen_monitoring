import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, url }) => {
	// User data is now provided by the server load function
	return {
		user: data.user,
		url: data.url
	};
};