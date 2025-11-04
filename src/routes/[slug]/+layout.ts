import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutLoad = ({ params }) => {
	const { slug } = params;
	
	// Only allow 'admin' or 'user' as valid slugs
	if (slug !== 'admin' && slug !== 'user') {
		throw error(404, 'Page not found');
	}
	
	return {
		slug
	};
};
