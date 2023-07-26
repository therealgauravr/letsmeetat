<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		createNewLinkEntryAndUpdateDb,
		retrieveGlobalLinksMapWithCallback
	} from '$lib/fauna/fauna-queries';
	import { getEmailAddress } from '$lib/google/people-queries';
	import { onMount } from 'svelte';
	import { blocking, desiredShortLink, newMeetCreated } from '../../stores/app';
	import { authenticated, userEmail } from '../../stores/auth';
	import { gapisInited, gisInited } from '../../stores/google';
	import ShareIcon from '$lib/images/share_button.svg';
	import CopyIcon from '$lib/images/copy_button.svg';

	let linksMap: [{ [x: string]: any }] = [];
	let shortLinkInput: string = '';
	let claimedLinks: { [x: string]: any } = {};
	let linkValid = true;
	$: linkValid = !Object.hasOwn(claimedLinks, shortLinkInput);

	onMount(() => {
		retrieveGlobalLinksMapWithCallback((ret) => {
			claimedLinks = ret.data;
		});
	});

	onMount(() => {
		newMeetCreated.set(false);
		/**
		 *  Sign out the user upon button click.
		 */
		async function handleSignoutClick() {
			blocking.set(true);
			window.localStorage.clear();
			authenticated.set(false);
			const token = gapi.client.getToken();
			if (token !== null) {
				google.accounts.oauth2.revoke(token.access_token);
				gapi.client.setToken('');
				document.getElementById('signout_button').style.visibility = 'hidden';
			}
			blocking.set(false);
			goto('/');
		}

		const signoutButton = document.getElementById('signout_button');
		if (signoutButton) {
			authenticated.subscribe((value) => {
				signoutButton.style.visibility = value ? 'visible' : 'hidden';
				signoutButton.innerText = 'Sign Out';
				signoutButton.onclick = handleSignoutClick;
			});
		}
	});

	onMount(async () => {
		blocking.set(true);
		gapisInited.subscribe(async (value) => {
			if ($gisInited && $authenticated) {
				userEmail.set(await getEmailAddress(gapi.client.getToken().access_token));
				const createEventButton = document.getElementById('eventCreationButton');
				if (createEventButton) {
					createEventButton.onclick = value
						? (e) => {
								createNewLinkEntryAndUpdateDb(shortLinkInput, $userEmail, linksMap);
						  }
						: () => {
								alert('Please sign in first');
						  };
					createEventButton.style.visibility = 'visible';
				}
				blocking.set(false);
			}
		});
	});

	onMount(() => {
		userEmail.subscribe((value) => {
			if (value != null) {
				// const script = document.createElement('script');
				// script.src="//cdn.jsdelivr.net/npm/faunadb@latest/dist/faunadb-min.js";
				// script.onload = {}

				const faunaDB = window.faunadb;
				var q = faunadb.query;
				var client = new faunadb.Client({
					secret: '<INSERT YOUR FAUNA DB API SECRET HERE>',
					// Adjust the endpoint if you are using Region Groups
					endpoint: 'https://db.fauna.com/'
				});

				client
					.query(
						q.Map(
							q.Paginate(q.Match(q.Index('test'), value)),
							q.Lambda('links', q.Get(q.Var('links')))
						)
					)
					.then((ret) => {
						if (ret.data[0] != undefined) {
							linksMap = ret.data[0].data.links;
						}
						if ($desiredShortLink != '') {
							createNewLinkEntryAndUpdateDb(
								$desiredShortLink.replace('letsmeet.at/', ''),
								$userEmail,
								linksMap
							);
							desiredShortLink.set('');
						}
					});
			}
		});
	});
</script>

<section class="w-full  bg-opacity-30 rounded-xl my-4">
	<div
		class="flex flex-row justify-between space-x-4 pt-2 mt-40 mb-40 sm:mx-12 sm:px-0 items-center"
	>
		<div class="whitespace-nowrap">
			<div class="flex flex-col text-[#343E70] w-full sm:w-1/2 font-satoshi-bold text-5xl">
				<h1 class="text-center sm:text-left">Create infinite <br /> rooms</h1>
				<p
					class="text-black text-center sm:text-left text-lg whitespace-normal sm:whitespace-nowrap  font-satoshi-medium mt-6"
				>
					Add unique names to all your different GMeet rooms. You can have one for friends, one for
					work, and one <br /> for the secret girlfriend.
				</p>
				<span class="text-center sm:text-left italic text-lg mt-2"> It’s really that simple.</span>
			</div>
		</div>
	</div>
	<div
		id="configured_links_table"
		class="flex flex-col  sm:items-center px-4 py-4 justify-between bg-white"
	>
		<h1 class="text-center text-4xl text-[#262626] mt-10 font-satoshi-bold">
			Here are all your rooms
		</h1>
		<div
			class="flex  flex-col space-y-4 sm:space-y-0 sm:flex-row m-4 mt-10  sm:w-4/12  space-x-0 justify-between"
		>
			<input
				class={`rounded-lg sm:rounded-l-lg sm:rounded-r-none p-2 border-t-2 border-l-2 border-b-2 border-r-2 sm:border-r-0 transition-all ${
					linkValid ? 'border-transparent' : 'border-[#f34c18]'
				} outline-none text-black bg-[#edeef5] sm:w-3/5`}
				on:input={(e) => {
					shortLinkInput = e.currentTarget.value.replace('letsmeet.at/', '').replaceAll(' ','').trim();
				}}
				value={'letsmeet.at/' + shortLinkInput}
			/>
			<button
				id="eventCreationButton"
				class={`sm:relative ${
					linkValid ? '' : 'hidden sm:block'
				} sm:right-1 py-4 sm:py-0 items-center space-x-2 sm:w-2/5 rounded-lg text-center hover:ring-[#343e70] ring-1 ring-transparent active:opacity-80 focus:opacity-80 transition-all bg-[#343e70] text-white`}
				style="visibility:hidden;"
			>
				<!-- <img src={GoogleLogo} class="w-8 h-8" alt="nuthin" /> -->
				Create New Link
			</button>
		</div>
		<h3
			class={`text-center sm:text-left py-6 sm:py-0 transition-all pl-4 ${
				linkValid ? ' hidden sm:block text-transparent' : 'text-[#f34c18]'
			}`}
		>
			This link has already been claimed
		</h3>
		<div class="mt-4  sm:w-5/12">
			<li
				class=" space-x-10 p-3 px-4 border-2 border-[#343e70] text-white flex rounded-t-lg bg-[#343e70] flex-row justify-between"
			>
				Your links
			</li>
			<ul
				class=" bg-white rounded-b-xl border-2 border-[#343e70] overflow-y-scroll h-96 w-full justify-between table-auto"
			>
				{#if linksMap != undefined}
					{#each linksMap as linkEntry, index}
						<li
							class="justify-between flex py-4 flex-row w-full border-2 border-transparent  rounded-lg transition-all hover:opacity-50 hover:bg-white cursor-pointer"
						>
							<div class="flex flex-col space-y-1 px-4">
								<a href={'https://letsmeet.at/' + linkEntry.short} class=""
									>{'letsmeet.at/' + linkEntry.short}</a
								>
								<td class="text-gray-400 ">{linkEntry.long}</td>
							</div>
							<div
								class="w-auto sm:40 flex flex-col sm:flex-row space-y-1 sm:space-x-2 sm:space-y-0 items-center justify-between sm:justify-evenly"
							>
								<button
									on:click={async () => {
										await navigator.share({
											url: 'https://letsmeet.at/' + linkEntry.short
										});
									}}
									class="hover:ring-[#343e70] transition-all p-2 active:opacity-75 focus:opacity-75  w-10 h-10 ring-1 rounded-full ring-transparent"
								>
									<img class="w-4 h-4 sm:w-8" alt="share" src={ShareIcon} />
								</button>
								<button
									on:click={async () => {
										await navigator.clipboard.writeText('https://letsmeet.at/' + linkEntry.short);
									}}
									class="hover:ring-[#343e70] transition-all p-3  w-10 h-10 ring-1 rounded-full ring-transparent"
								>
									<img class="w-4 h-4 sm:w-8" alt="copy" src={CopyIcon} />
								</button>
							</div>
						</li>
					{/each}
				{/if}
			</ul>
			<div class=" w-full flex flex-row justify-center mt-10 ">
				<button
					class="w-auto p-3 bg-[#343e70] text-white rounded-xl hover:brightness-90 transition-all flex flex-row border-2 border-transparent"
					id="signout_button"
				/>
			</div>
		</div>
	</div>
</section>
