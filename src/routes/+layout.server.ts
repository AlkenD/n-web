import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, route }) => {
	if (route.id !== '/login') {
		if (!locals.pb.authStore.isValid) {
			throw redirect(302, '/login');
		}
	}
	return {
		user: locals.pb.authStore.model
	};
};
