<script>
	import { onMount } from 'svelte';
	import DefaultSpinner from './DefaultSpinner.svelte';

	onMount(() => {
		// Get the current page scroll position
		
		// if any scroll is attempted, set this to the previous value
		window.onscroll = function () {
            window.scrollTo(0,0)
		};

		return () => {
			window.onscroll = function () {};
		};
	});
</script>

<div class="absolute backdrop-brightness-50 z-50 w-full h-full">
	<div class="flex flex-row h-full justify-around">
		<div class="flex flex-col w-full h-full justify-center">
			<DefaultSpinner />
			<h2 class="text-center text-white text-xl font-satoshi-black mt-6">Please wait</h2>
		</div>
	</div>
</div>
