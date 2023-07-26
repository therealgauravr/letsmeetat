<script>
	import FbButton from './buttons/FBButton.svelte';
	import InstaButton from './buttons/InstaButton.svelte';
	import LinkedinButton from './buttons/LinkedinButton.svelte';
	import TwitterButton from './buttons/TwitterButton.svelte';
	import Logo from '$lib/images/letsmeetat-logo2.svg';
</script>

<footer
	class="text-black rounded-lg  mt-4 mx-5 mb-5 p-4 px-10 space-y-20 flex flex-col font-thin h-1/3 justify-end"
>
	<div class="flex flex-col space-y-4 items-center sm:items-start">
		<img src={Logo} alt="logo" />
		<h2 class="font-satoshi-bold mt-2">Make your meetings standout</h2>
	</div>

	<div class=" w-full flex  flex-col space-y-4 sm:space-y-0 sm:flex-row justify-between items-center">
		<div class="flex flex-col font-satoshi-regular w-full text-center sm:text-left sm:w-1/2">
			<p>
				Just for kicks from the folks at <a
					class=" hover:opacity-70 cursor-pointer hover:underline hover:text-[#6950ba] hover:decoration-[#6950ba]"
					href="https://neutron.money">Neutron⚛️</a
				>
			</p>
			<span>© 2023 OnTheProwl Technologies Pvt Ltd. All Rights Reserved.</span>
		</div>
		<div class="flex flex-col sm:flex-row space-x-6 items-center space-y-4 sm:space-y-0 justify-between sm:w-1/2">
			<div class="flex flex-row  space-x-4">
				<a href="/tos" class="hover:underline">Terms of Service</a>
				<a href="/privacy" class="hover:underline">Privacy Policy</a>
			</div>
			<div class="flex flex-row space-x-8">
				<InstaButton href={'https://instagram.com/neutrondotmoney'} />
				<LinkedinButton href={'https://linkedin.com/company/neutronmoney'} />
				<TwitterButton href={'https://twitter.com/neutrondotmoney'} />
			</div>

			
		</div>
	</div>
</footer>
