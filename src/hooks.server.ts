import { redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import localEnv from './env';

export const handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(localEnv.PUBLIC_SERVER);

	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	if (!event.locals.pb.authStore.isValid) {
		if (event.route.id !== '/login') {
			throw redirect(302, '/login');
		}
	}

	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		event.locals.pb.authStore.isValid && (await event.locals.pb.collection('users').authRefresh());
	} catch (err) {
		// clear the auth store on failed refresh
		event.locals.pb.authStore.clear();
	}

	const response = await resolve(event);

	// send back the default 'pb_auth' cookie to the client with the latest store state
	response.headers.append(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({ sameSite: true, httpOnly: true, secure: false })
	);

	return response;
};
