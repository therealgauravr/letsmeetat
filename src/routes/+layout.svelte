<script lang="ts">
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import { onMount } from 'svelte';
	import { blocking } from '../stores/app';
	import { authenticated, tokenClient } from '../stores/auth';
	import { gapisInited, gisInited } from '../stores/google';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import './styles.css';

	const CLIENT_ID = '<INSERT GOOGLE APIS CLIENT ID HERE>';
	const API_KEY = '<INSERT GOOGLE APIS API KEY HERE>';
	const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

	const SCOPES = 'openid email https://www.googleapis.com/auth/calendar.events';

	let gapiToken: string | null = null;
	let created: number;
	$: authenticated.set(
		gapiToken != null &&
			new Date().getTime() - created > JSON.parse(gapiToken).expires_in * 1000 * 1000
	);
	$: blockingValue = $blocking;

	onMount(() => {
		authenticated.subscribe((isAuthenticated) => {
			if (!isAuthenticated) window.localStorage.clear();
		});

		gapiToken = window.localStorage.getItem('access_token');

		created = Number(window.localStorage.getItem('created'));

		// Create script tags for both GAPIs and GIS
		const scriptGIS = document.createElement('script');
		const scriptGAPIS = document.createElement('script');

		// Initialize Google Scripts ( GIS and GAPIs )

		scriptGIS.src = 'https://accounts.google.com/gsi/client';
		scriptGAPIS.src = 'https://apis.google.com/js/api.js';
		scriptGIS.onload = initGIS;
		scriptGAPIS.onload = initGAPIS;

		function initGIS() {
			console.log('INITIALIZING GIS...');

			tokenClient.set(
				google.accounts.oauth2.initTokenClient({
					client_id: CLIENT_ID,
					scope: SCOPES
				})
			);

			gisInited.set(true);
		}

		function initGAPIS() {
			console.log('INITIALIZING GAPIS');
			gapi.load('client', async () => {
				await gapi.client.init({
					apiKey: API_KEY,
					// clientId: CLIENT_ID,
					discoveryDocs: [DISCOVERY_DOC]
				});
				if (gapiToken != null) {
					gapi.client.setToken(JSON.parse(gapiToken));
				}

				gapisInited.set(true);
			});
		}

		document.head.appendChild(scriptGIS);
		document.head.appendChild(scriptGAPIS);
	});
</script>

<svelte:head>
	<script src="//cdn.jsdelivr.net/npm/faunadb@latest/dist/faunadb-min.js" async></script>
	<title>Make your meetings stand out</title>
</svelte:head>

<div class="bg-[#fdfaf3] w-full  h-full py-3 font-satoshi-medium">
	{#if blockingValue === true}
		<LoadingIndicator />
	{/if}

	<main class="h-full flex flex-col justify-between">
		<div class="h-2/3 ">
			<Header />
			<slot />
		</div>

		<Footer />
	</main>
</div>

<style lang="postcss">
</style>
