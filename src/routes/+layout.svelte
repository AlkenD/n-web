<script lang="ts">
	import type { LayoutData } from './$types';
	import {
		Actions,
		ActionsButton,
		ActionsGroup,
		ActionsLabel,
		App,
		Button,
		Navbar,
		Page
	} from 'konsta/svelte';
	import '../app.css';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let actionsOpened = false;

	export let data: LayoutData;

	const handleLogout = async () => {
		await axios.post('/logout').then((res) => {
			actionsOpened = false;
			goto('/login');
		});
	};

	onMount(() => {
		if (data.user === null) {
			goto('/login');
		}
	});
</script>

<App theme="ios" class="dark !min-h-full">
	<Page class="!static">
		<Navbar title="Brand Hunt 2.0">
			<Button clear slot="left"></Button>
			<Button clear slot="right" onClick={() => (actionsOpened = true)}
				>{data.user === null ? '' : 'USER'}</Button
			>
		</Navbar>
		<slot />
		<Actions opened={actionsOpened} onBackdropClick={() => (actionsOpened = false)}>
			<ActionsGroup>
				<ActionsLabel
					>User - {data.user?.name !== '' ? data.user?.name : data.user?.username}</ActionsLabel
				>
				<ActionsButton colors={{ textIos: 'text-red-500' }} onClick={handleLogout} bold
					>Logout</ActionsButton
				>
			</ActionsGroup>
			<ActionsGroup>
				<ActionsButton onClick={() => (actionsOpened = false)}>Cancel</ActionsButton>
			</ActionsGroup>
		</Actions>
	</Page>
</App>
