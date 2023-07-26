<script>
	import github from '$lib/images/github.svg';
	import { promptForSignIn } from '$lib/utils/auth';
	import { onMount } from 'svelte';
	import Logo from '$lib/images/letsmeetat-logo2.svg';
	import MenuButton from '$lib/images/menu_button.png';
	import { authenticated } from '../../stores/auth';

	let menuOpen = false;

	onMount(() => {
		promptForSignIn('auth_button_2');
		promptForSignIn('auth_button_3');
	});
</script>

<header
	class=" rounded-full  flex flex-row p-2 px-10 justify-start space-x-4 items-center text-black "
>
	<div class="flex flex-col font-bold items-start p-2 text-2xl w-2/13 max-w-[500px]">
		<a class="flex flex-col space-y-2 hover:opacity-80" href="/">
			<img src={Logo} alt="" />
		</a>
	</div>

	<nav class="w-full text-md">
		<div class=" flex flex-row w-full font-satoshi-bold justify-end space-x-12 align-middle ">
			<a
				href="https://letsmeetat.canny.io"
				class=" hidden sm:block p-2 rounded-xl  text-center transition-all hover:ring-1  hover:ring-[#343e70]"
				>Request Features</a
			>

			{#if !$authenticated}
				<button
					id="auth_button_2"
					class="items-center hidden sm:block space-x-2 whitespace-nowrap w-4/6 sm:w-1/6 bg-[url('$lib/images/google_sign_in_button.png')] bg-contain bg-center bg-no-repeat hover:opacity-80 rounded-lg text-center ring-1 ring-transparent active:opacity-80 focus:opacity-80 transition-all text-white"
					style="visibility:hidden;"
				>
					<!-- <img src={GoogleLogo} class="w-8 h-8" alt="nuthin" /> -->
				</button>
			{/if}

			<button
				on:click={() => {
					menuOpen = !menuOpen;
				}}
				id="expand_menu"
				class="bg-transparent w-12 sm:hidden"
			>
				<img src={MenuButton} alt="MenuButton" class="h-8" />
			</button>
		</div>
	</nav>

	<div
		class={`absolute ${
			menuOpen ? '' : 'hidden'
		} transition-all top-0 w-40 right-0 text-white flex flex-col h-screen bg-[#343e70] `}
	>
		<div class="mt-4  space-y-6  flex flex-col items-center text-white h-80">
			<button
				on:click={() => {
					menuOpen = !menuOpen;
				}}
			>
				X
			</button>
			<a
				href="https://letsmeetat.canny.io"
				class="text-sm hover:underline  text-center transition-all">Request Features</a
			>

			{#if !$authenticated}
				<button
					id="auth_button_3"
					class="items-center  space-x-2 whitespace-nowrap w-4/6 p-3 sm:w-1/6 bg-[url('$lib/images/google_sign_in_button.png')] bg-contain bg-center bg-no-repeat hover:opacity-80 rounded-lg text-center ring-1 ring-transparent active:opacity-80 focus:opacity-80 transition-all text-white"
				>
					<!-- <img src={GoogleLogo} class="w-8 h-8" alt="nuthin" /> -->
				</button>
			{/if}
		</div>
	</div>
	<!-- <div class=" hover:opacity-70 w-12">
		<a href="https://github.com/sveltejs/kit">
			<img src={github} alt="GitHub" />
		</a>
	</div> -->
</header>
