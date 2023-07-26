<script lang="ts">
	import { onMount } from 'svelte';
	import { authenticated } from '../stores/auth';
	import { goto } from '$app/navigation';
	import { gapisInited, gisInited } from '../stores/google';
	import { blocking, desiredShortLink } from '../stores/app';
	import { promptForSignIn } from '$lib/utils/auth';
	import HeroPic from '$lib/images/letsmeetat-hero.png';
	import GoogleButton from '$lib/images/google_sign_in_button.png';
	import { retrieveGlobalLinksMapWithCallback } from '$lib/fauna/fauna-queries';

	$: gapisInitedValue = $gapisInited;
	$: gisInitedValue = $gisInited;
	$: authenticatedValue = $authenticated;

	$: if (gapisInitedValue && gisInitedValue && authenticatedValue) {
		blocking.set(false);
		goto('/dashboard');
	}

	let claimedLinks: { [x: string]: any } = {};
	let linkValid = true;

	onMount(() => {
		promptForSignIn('auth_button_1');
	});

	onMount(() => {
		retrieveGlobalLinksMapWithCallback((ret) => {
			claimedLinks = ret.data;
			desiredShortLink.subscribe((tobeClaimed) => {
				if (claimedLinks[tobeClaimed]) {
					linkValid = false;
				} else {
					linkValid = true;
				}
			});
		});
	});

	onMount(() => {
		(function (w, d, i, s) {
			function l() {
				if (!d.getElementById(i)) {
					var f = d.getElementsByTagName(s)[0],
						e = d.createElement(s);
					(e.type = 'text/javascript'),
						(e.async = !0),
						(e.src = 'https://canny.io/sdk.js'),
						f.parentNode.insertBefore(e, f);
				}
			}
			if ('function' != typeof w.Canny) {
				var c = function () {
					c.q.push(arguments);
				};
				(c.q = []),
					(w.Canny = c),
					'complete' === d.readyState
						? l()
						: w.attachEvent
						? w.attachEvent('onload', l)
						: w.addEventListener('load', l, !1);
			}
		})(window, document, 'canny-jssdk', 'script');

		Canny('render', {
			boardToken: '<INSERT CANNY BOARD TOKEN HERE>',
			basePath: '/', // See step 2
			ssoToken: null // See step 3
		});
	});
</script>

<section class="w-full text-white pt-10 ">
	<div
		class=" rounded-lg w-full px-5 sm:space-x-4 h-auto flex flex-col-reverse sm:flex-row text-center bg-transparent text-gray-200 font-satoshi-regular py-2  "
	>
		<div class=" flex flex-col mt-4 w-full sm:w-2/5 h-auto sm:pt-24 justify-end  space-y-4">
			<h1
				class="font-satoshi-bold hidden sm:block text-[#343e70] text-center sm:text-left px-4 text-4xl sm:text-5xl"
			>
				Make your<br /> meetings standout
			</h1>
			<h1
				class="font-satoshi-bold sm:hidden text-[#343e70] text-center sm:text-left text-4xl sm:text-5xl"
			>
				Make your meetings <br />standout
			</h1>
			<span class=" font-satoshi-medium hidden sm:block text-center sm:pl-4 sm:text-left text-black"
				>Quit generating multiple links for every meeting. Now, generate,<br /> share, and connect
				with your own personalized <br />
				<span class="text-[#343e70] font-satoshi-bold">Google Meet</span> links</span
			>
			<span class=" font-satoshi-medium sm:hidden text-center sm:text-left text-black"
				>Quit generating multiple links for every meeting. Now, generate, share, and connect
				with <br />  your own personalized 
				<span class="text-[#343e70] font-satoshi-bold">Google Meet</span> links</span
			>
			<div class="flex flex-col h-auto sm:flex-row m-3  space-y-4 sm:space-y-0 justify-between">
				<input
					class={`transition-all rounded-lg p-2 pr-0 w-5/5 sm:w-3/5 outline-none text-black border-2  ${
						linkValid ? 'border-transparent' : 'border-[#f34c18]'
					} bg-[#edeef5] w-full`}
					on:input={(e) => {
						desiredShortLink.set(e.currentTarget.value.replace('letsmeet.at/', '').replaceAll(' ','').trim());
					}}
					value={'letsmeet.at/' + $desiredShortLink}
				/>

				<button
					id="auth_button_1"
					class={`items-center ${
						linkValid ? 'visible' : 'hidden'
					} space-x-2 p-5 sm:p-0 sm:w-2/5  bg-[url('$lib/images/google_sign_in_button.png')] bg-center bg-contain bg-no-repeat only:rounded-lg hover:opacity-60 text-center active:opacity-80 focus:opacity-80 transition-all text-white`}
					style="visibility:hidden;"
				>
					<!-- <img src={GoogleButton} class="w-auto h-auto" alt="nuthin" />  -->
					<!-- Claim Link -->
				</button>
			</div>
			<h3
				class={`text-center sm:text-left transition-all pl-4  ${linkValid ? 'hidden sm:block text-transparent' : 'text-[#f34c18]'}`}
			>
				This link has already been claimed
			</h3>
			<h1 class=" text-center sm:text-left text-black pl-4 font-satoshi-bold italic sm:not-italic sm:font-satoshi-regular sm:pb-20">Its free, and takes less than a minute.</h1>
		</div>
		<div class="sm:w-2/3">
			<div
				class="bg-[url('$lib/images/hero-blob.svg')] w-full bg-no-repeat bg-contain p-2  sm:p-16 bg-center"
			>
				<img src={HeroPic} class="m-8 mx-1" alt="blob" />
			</div>
		</div>
	</div>

	<div class=" w-full flex flex-row justify-center mt-4 h-auto rounded-lg bg-white text-black py-2">
		<div
			class="bg-[url('$lib/images/confetti-bg.svg')] bg-no-repeat bg-auto bg-center flex flex-col space-y-4 px-4 mx-4 w-full mb-10"
		>
			<h1 class="text-4xl text-[#343e70] mt-10  text-center font-satoshi-bold">
				Connect Like <span class="bg-[#fcc410] p-1">You Own The Room,</span> <br /> Quite Literally
			</h1>
			<h2 class="text-xl text-center">
				No more wasting time opening GMeet, creating a room,<br /> and sharing random links
			</h2>
			<h4 class="mt-10 font-satoshi-black text-center text-[#343e70]">
				If you liked this, pay us in kind by dropping your votes on features you'd like to see!
			</h4>
			<div class="flex flex-col sm:flex-row mt-4 sm:space-x-10 justify-center">
				<div data-canny class="bg-white border-2 w-full border-[#343e70] sm:w-2/6 rounded-xl p-4" />

				<!-- <div class="flex flex-col w-1/3 h-auto  bg-gray-400" />
				<div class="flex flex-col w-1/3 h-auto  bg-gray-400" />
				<div class="flex flex-col w-1/3 h-80  bg-gray-400" /> -->
			</div>
		</div>
	</div>
</section>
