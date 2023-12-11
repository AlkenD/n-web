<script lang="ts">
	export let values;
	export let numberOfInputs = 6;

	let otpValues = Array(numberOfInputs).fill('');

	$: values = otpValues.join('').toLocaleUpperCase();

	let inputs: any[] = [];
	let activeIndex = 0;

	function handleInput(event: any, index: number) {
		const inputValue = event.target.value.toLocaleUpperCase();

		otpValues[index] = inputValue;

		if (index < otpValues.length - 1) {
			activeIndex = index + 1;
			inputs[activeIndex].focus();
		}
	}

	function handleBackspace(event: any, index: number) {
		if ((event.key === 'Backspace' || event.key === 'Delete') && index > 0) {
			activeIndex = index - 1;
			inputs[activeIndex].focus();
		}
	}

	function clearInput(index: number) {
		otpValues[index] = '';
		activeIndex = index;
		inputs[activeIndex].focus();
	}
</script>

<div class="grid grid-cols-6 gap-4 w-fit">
	{#each Array(otpValues.length) as _, index}
		<input
			bind:this={inputs[index]}
			type="text"
			bind:value={otpValues[index]}
			on:input={(e) => handleInput(e, index)}
			on:keydown={(e) => handleBackspace(e, index)}
			on:click={() => clearInput(index)}
			maxlength="1"
		/>
	{/each}
</div>

<style>
	input {
		@apply h-12 w-10 rounded-lg text-center text-lg outline-none ring ring-blue-500/20 bg-black text-white;
	}
	input:focus {
		@apply ring-blue-500;
	}
</style>
