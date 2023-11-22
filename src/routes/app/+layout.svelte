<script lang="ts">
	import { goto } from '$app/navigation';
	import { writable, type Writable } from 'svelte/store';
	import type { OfflineAminoSigner, OfflineDirectSigner } from '@keplr-wallet/types';
	import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
	import '../../app.css';
	import { onMount } from 'svelte';

	let chainId = 'cosmoshub-4';

	const offlineSigner: Writable<(OfflineAminoSigner & OfflineDirectSigner) | null> = writable(null);
	const rpcEndpoint = 'https://rpc-cosmoshub.blockapsis.com';
	let client: SigningCosmWasmClient;
	let address: string;
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
			client = await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, $offlineSigner!);
		}
	}

	$: {
		if ($offlineSigner) {
			$offlineSigner.getAccounts().then((accounts) => {
				address = accounts[0]?.address || '';
			});
		}
	}
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
			<button class="text-2xl m-2 p-2 rounded-xl bg-violet-900 text-white">LOADING</button>
		{:else if address !== null}
			<button class="text-2xl m-2 p-2 rounded-xl bg-violet-900 text-white"
				>{address.slice(0, 8)}...{address.slice(-4)}
			</button>
		{:else if typeof window !== 'undefined' && window?.keplr != null}
			<button
				on:click={() => connectToWallet()}
				class=" text-2xl m-2 p-2 rounded-xl bg-violet-900 text-white"
				>CONNECT
			</button>
		{:else}
			<button disabled class="text-2xl m-2 p-2 rounded-xl bg-violet-900 text-white"
				>No Keplr Wallet
			</button>
		{/if}
	</nav>

	<main class="relative top-16 p-5">
		<slot />
	</main>
</body>
