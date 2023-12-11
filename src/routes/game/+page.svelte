<script lang="ts">
	import { onMount } from 'svelte';
	import pb from '../../pb';
	import { page } from '$app/stores';
	import { Block, BlockTitle, Button, Card, Preloader } from 'konsta/svelte';
	import InputBox from '$lib/InputBox.svelte';
	import Scanner from '$lib/Scanner.svelte';

	function getRandom(int: number) {
		return Math.floor(Math.random() * int);
	}

	function checkPoints(int: number, limit: number) {
		return int !== 0 && int % limit === 0;
	}

	let loading = false;
	let loadingSubmit = false;
	let game: any;
	let team: any;
	let user: any;
	let question: any;
	let answer: string;

	const getUserDetails = async () => {
		await pb
			.collection('users')
			.getOne($page.data.user.id)
			.then(async (res) => {
				user = res;
				await pb.collection('users').subscribe(res.id, ({ record }) => {
					user = record;
				});
			});
	};

	const getGameDetails = async () => {
		await pb
			.collection('games')
			.getOne('ufjlzc9c6zj8q40')
			.then((res) => {
				game = res;
			});
	};

	const getTeamDetails = async () => {
		await pb
			.collection('teams')
			.getFullList({
				filter: `members ~ '${$page.data.user.id}'`,
				expand: 'members'
			})
			.then(async (res) => {
				team = res[0];
				await pb.collection('teams').subscribe(res[0].id, ({ record }) => {
					team = record;
				});
				if (checkPoints(team.points, team.members.length)) {
					await pb.collection('teams').update(team.id, {
						locked: true
					});
				} else {
					await pb.collection('users').update($page.data.user.id, {
						waiting: true
					});
				}
			});
	};

	const getQuestion = async () => {
		await pb
			.collection('questions')
			.getFullList({ filter: `users ~ '${$page.data.user.id}'` })
			.then(async (res) => {
				if (res.length !== 0) {
					question = res[0];
				} else if (res.length === 0) {
					await pb
						.collection('questions')
						.getFullList()
						.then(async (res) => {
							const randomQuestion = res[getRandom(res.length)];
							await pb
								.collection('questions')
								.update(randomQuestion.id, {
									users: $page.data.user.id
								})
								.then((res) => {
									question = res;
								});
						});
				}
			});
	};

	const handleSubmit = async () => {
		if (question.answer === answer) {
			loadingSubmit = true;
			await pb
				.collection('questions')
				.update(question.id, {
					'users-': $page.data.user.id
				})
				.then(async (res) => {
					await pb.collection('teams').update(team.id, {
						points: team.points + 1,
						solvedRecently: false
					});
					console.log({
						points: team.points,
						members: team.members.length,
						status: checkPoints(team.points, team.members.length)
					});
					if (checkPoints(team.points, team.members.length) && !team.solvedRecently) {
						await pb.collection('teams').update(team.id, {
							locked: true
						});
					} else {
						await pb.collection('users').update($page.data.user.id, {
							waiting: true
						});
					}
					loadingSubmit = false;
				});
		}
	};

	onMount(async () => {
		getGameDetails();
		getTeamDetails();
		getUserDetails();
		getQuestion();

		pb.collection('games').subscribe('ufjlzc9c6zj8q40', ({ record }) => {
			game = record;
		});
	});
</script>

{#if !loading && game && question}
	{#if !game.started}
		<Card class="items-center flex flex-col" header="Waiting for the host to start...">
			<Preloader />
		</Card>
	{:else}
		<BlockTitle>Team Solved Questions {team ? team.points : 0} / 30</BlockTitle>
		<Block></Block>
		{#if team && team.locked}
			<Card header="Guess the location, find the QR and scan to proceed.">
				<Scanner teamId={team.id} />
			</Card>
		{:else if team && user && !team.locked && user.waiting}
			<Card class="flex justify-center"
				><div class="flex justify-center items-center space-x-4">
					<div>Waiting for other members to solve...</div>
					<div class="w-fit h-fit flex"><Preloader size="w-8 h-8" /></div>
				</div></Card
			>
		{:else if team && user && !team.locked && !user.waiting}
			<Card>{question.question} ?</Card>
			{#if answer && answer !== null && answer !== undefined}
				<Block>
					<p class="text-center uppercase text-xl text-blue-500 font-bold">{answer}</p>
				</Block>
			{/if}
			<Block>
				<InputBox bind:values={answer} numberOfInputs={question.answer.length} />
			</Block>
			<Block>
				<Button large onClick={handleSubmit}>
					{#if loadingSubmit}
						<Preloader size="w-4 h-4 text-white" />
					{:else}
						Confirm
					{/if}</Button
				>
			</Block>
		{/if}
	{/if}
{:else}
	<Preloader />
{/if}
