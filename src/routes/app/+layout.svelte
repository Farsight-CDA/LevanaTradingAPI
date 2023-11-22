<script lang="ts">
	import { goto } from '$app/navigation';
	import { writable, type Writable } from 'svelte/store';
	import type { OfflineAminoSigner, OfflineDirectSigner } from '@keplr-wallet/types';
	import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
	import '../../app.css';
	import { onMount } from 'svelte';

	let chainId = 'cosmoshub-4';

	const offlineSigner: Writable<(OfflineAminoSigner & OfflineDirectSigner) | null> = writable(null);
	const client: Writable<SigningCosmWasmClient | null> = writable(null);
	const address: Writable<string | null> = writable(null);

	const rpcEndpoint = 'https://rpc-cosmoshub.blockapsis.com';
	let address2: string;
	let loading = true;

	onMount(() => {
		connectToWallet();

		setTimeout(() => {
			loading = false;
		}, 100);
	});

	async function connectToWallet() {
		if (!window.keplr) {
			throw new Error(`No Keblr Wallet injected`);
		} else {
			await window.keplr.enable(chainId);
			offlineSigner.set(window.keplr.getOfflineSigner(chainId));
			client.set(await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, $offlineSigner!));
		}
	}

	async function disconect() {
		if (!window.keplr) {
			throw new Error(`No Keblr Wallet injected`);
		} else {
			//await window.keplr.disable(chainId);
			offlineSigner.set(null);
			client.set(null);
			address.set(null);
		}
	}

	$: {
		if ($offlineSigner) {
			$offlineSigner.getAccounts().then((accounts) => {
				address.set(accounts[0]?.address || '');
			});
		}
	}
	let hover = false;
</script>

<body class="bg-slate-950 text-white">
	<nav
		class="fixed top-0 left-0 right-0 z-10 opacity-90 flex justify-between items-center bg-slate-950 pl-5 pr-5"
	>
		<div class="pt-7 pb-7">
			<button class="navbar-burger flex items-center text-3xl text-gray-400">
				<svg
					class="block h-4 w-4 fill-current"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Mobile menu</title>
					<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
				</svg>
			</button>
		</div>

		{#if loading == true}
			<button class="text-2xl m-2 p-2 rounded-xl text-center w-52 bg-violet-900 text-white">
				LOADING
			</button>
		{:else if $address !== null && $address !== undefined}
			<!-- svelte-ignore a11y-mouse-events-have-key-events -->
			<button
				class="text-2xl m-2 p-2 rounded-xl text-center w-52 bg-violet-900 text-white
				duration-500 hover:bg-violet-400 hover:text-violet-950"
				on:click={disconect}
				on:mouseover={() => (hover = true)}
				on:mouseout={() => (hover = false)}
				>{#if hover}
					Disconnect
				{:else}
					{$address ? $address.slice(0, 8) + '...' + $address.slice(-4) : ''}
				{/if}
			</button>
		{:else if typeof window !== 'undefined' && window?.keplr != null}
			<button
				class="text-2xl m-2 p-2 rounded-xl text-center w-52 bg-violet-900 text-white
				duration-500 hover:bg-violet-400 hover:text-violet-950"
				on:click={() => connectToWallet()}
				>CONNECT
			</button>
		{:else}
			<button class="text-2xl m-2 p-2 rounded-xl text-center w-52 bg-violet-900 text-white"
				>No Keplr Wallet
			</button>
		{/if}
	</nav>

	<main class="relative top-16 p-5">
		<slot />
	</main>
</body>
