import type { PageLoad } from './$types';

export const load: PageLoad = (event) => {
	const data = event.data as unknown as { user?: unknown };
	return {
		user: data?.user
	};
};