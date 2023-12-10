<script lang="ts">
	import { onMount } from 'svelte';
	import { Html5Qrcode } from 'html5-qrcode';
	import pb from '../../pb';

	let scanner: Html5Qrcode;
	let location: any;

	const handleScanQr = (id: string) => {
		pb.collection('locations')
			.getOne(id)
			.then((res) => {
				location = res;
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
	});
</script>

{#if location}
	<div class="text-lg font-bold text-blue-500 pb-8">Location: {location.location}</div>
{/if}

<div id="reader" class="w-full bg-white"></div>
