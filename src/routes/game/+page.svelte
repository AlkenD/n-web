<script lang="ts">
	import { onMount } from 'svelte';
	import pb from '../../pb';
	import { page } from '$app/stores';

	let loading;
	let game;
	let team;

	let locations: any;

	const getTeamDetails = () => {
		pb.collection('teams')
			.getFullList({
				filter: `members ~ '${$page.data.user.id}'`,
				expand: 'members'
			})
			.then((res) => {
				console.log(res);
			});
	};

	const getQuestions = () => {
		pb.collection('locations')
			.getFullList()
			.then((res) => {
				locations = res;
			});
	};
	onMount(async () => {
		getTeamDetails();
		getQuestions();
	});
</script>

{#if locations}
	{#each locations as location}
		<p>{location.id}</p>
	{/each}
{/if}
