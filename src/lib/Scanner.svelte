<script lang="ts">
	import { Html5Qrcode } from 'html5-qrcode';
	import { onMount } from 'svelte';
	import pb from '../pb';
	import { page } from '$app/stores';

	function getRandom(int: number) {
		return Math.floor(Math.random() * int);
	}

	function checkPoints(int: number, limit: number) {
		return int !== 0 && int % limit === 0;
	}

	export let teamId: string;

	let scanner: Html5Qrcode;
	let location: any;

	const handleScanQr = async (value: string) => {
		await pb
			.collection('locations')
			.getOne(value)
			.then((res) => {
				alert('Success');
			})
			.catch((err) => {
				alert('Failed');
			})
			.finally(() => {
				scanner.stop();
			});
	};

	const getCurrentLocation = async () => {
		await pb
			.collection('locations')
			.getFullList({
				filter: `teams ~ '${teamId}'`
			})
			.then(async (res) => {
				if (res.length !== 0) {
					location = res[0];
				} else if (res.length === 0 && $page.data.user.leader) {
					await pb
						.collection('locations')
						.getFullList()
						.then(async (res) => {
							const randomQuestion = res[getRandom(res.length)];
							await pb
								.collection('locations')
								.update(randomQuestion.id, {
									teams: teamId
								})
								.then((res) => {
									location = res;
								});
						});
				}
			});
	};

	onMount(() => {
		scanner = new Html5Qrcode('reader');
		scanner
			.start(
				{ facingMode: 'environment' },
				{
					fps: 10,
					qrbox: { width: 250, height: 250 }
				},
				(decodedText, decodedResult) => {
					handleScanQr(decodedText);
				},
				(errorMessage) => {}
			)
			.catch((err) => {});

		getCurrentLocation();
	});
</script>

{#if location}
	<div class="text-lg font-bold text-blue-500 pb-8">Location: {location.riddle}</div>
{/if}

<div id="reader" class="w-full bg-white"></div>
