<script lang="ts">
	import { onMount } from 'svelte';
	import pb from '../../pb';
	import { page } from '$app/stores';
	import { Block, Preloader } from 'konsta/svelte';

	let loading = false;
	let winner: any;
	let currentWinner = false;

	const getTeamDetails = async () => {
		loading = true;
		await pb
			.collection('teams')
			.getFullList({
				filter: `members ~ '${$page.data.user.id}'`,
				expand: 'members'
			})
			.then(async (teamRes) => {
				await pb
					.collection('games')
					.getOne('ufjlzc9c6zj8q40', {
						expand: 'winner'
					})
					.then((gameRes) => {
						winner = gameRes.expand?.winner;
						if (teamRes[0].id === winner.id) {
							currentWinner = true;
						}
						loading = false;
					});
			})
			.catch((err) => {
				console.log(err);
				loading = false;
			});
	};

	onMount(async () => {
		getTeamDetails();
	});
</script>

{#if !loading && winner}
	<div class="p-4 space-y-4">
		<h1 class="text-2xl font-bold text-yellow-500 text-center">Winner - {winner.name}</h1>
		<p class="text-center">Please return to the Quadrangle</p>
	</div>

	{#if currentWinner}
		<div class="text-center font-bold text-yellow-500 text-4xl pb-10">Congratulations!!!</div>
		<img src="https://media.tenor.com/6LIOLW2bf4MAAAAC/winner.gif" alt="" />
	{:else}
		<img class="w-full h-auto" src="https://media.makeameme.org/created/maybe-next.jpg" alt="" />
	{/if}
{:else if !loading && winner}
	<div class="text-center font-bold text-yellow-500 text-4xl py-10">Match is still on</div>
{:else}
	<Block class="items-center flex flex-col">
		<Preloader />
	</Block>
{/if}
