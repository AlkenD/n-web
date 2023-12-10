import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	locals.pb.authStore.clear();
	return json({ status: 'success' });
}
