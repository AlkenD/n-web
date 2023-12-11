import type { Actions } from './$types';

export const actions = {
	default: async ({ locals, request }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');
		await locals.pb
			.collection('users')
			.authWithPassword(username, password)
			.then((res) => {
			})
			.catch((err) => {
				console.log(err);
			});
	}
} satisfies Actions;
