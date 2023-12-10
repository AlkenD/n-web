<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Block, BlockTitle, Button, List, ListInput, Preloader } from 'konsta/svelte';

	let loading = false;
</script>

<BlockTitle>Login</BlockTitle>

<form
	method="POST"
	use:enhance={() => {
		loading = true;
		return async ({ result }) => {
			loading = false;
			if (result.type === 'error') {
				alert(`Login Failed ${JSON.stringify(result)}`);
			} else if (result.type === 'success') {
				goto('/');
			}
		};
	}}
>
	<List strongIos insetIos>
		<ListInput
			name="username"
			label="Registered Mobile Number"
			type="text"
			placeholder="Your Mobile Number"
			required
		/>
		<ListInput
			name="password"
			label="Password"
			type="password"
			placeholder="Your Password"
			required
		/>
	</List>
	<Block class="space-y-4">
		<Button large>
			{#if loading}
				<Preloader size="w-4 h-4 text-white" />
			{:else}
				Login
			{/if}
		</Button>
	</Block>
</form>
