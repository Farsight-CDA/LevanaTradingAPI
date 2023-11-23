<script lang="ts">
	import Navbar from '$lib/Navbar/Sidebar.svelte';
	import { goto } from '$app/navigation';
	import { writable, type Writable } from 'svelte/store';
	import type { OfflineAminoSigner, OfflineDirectSigner } from '@keplr-wallet/types';
	import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
	import '../../app.css';
	import { onMount } from 'svelte';
	import { postRegister } from '$lib/Backend';
	import { assets } from '__sveltekit/paths';
	import { ValueOp } from 'cosmjs-types/tendermint/crypto/proof';

	let chainId = 'cosmoshub-4';

	const offlineSigner: Writable<(OfflineAminoSigner & OfflineDirectSigner) | null> = writable(null);
	const client: Writable<SigningCosmWasmClient | null> = writable(null);
	const address: Writable<string | null> = writable(null);

	const rpcEndpoint = 'https://rpc-cosmoshub.blockapsis.com';
	let loading = true;

	onMount(() => {
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

	async function register() {
		if (formData.username != undefined && formData.password != undefined) {
			await postRegister(formData.username, formData.password);
			goto('Authorisation');
		}
	}

	let formData = {
		username: undefined as string | undefined,
		email: undefined as string | undefined,
		password: undefined as string | undefined,
		passwordRepeate: undefined as string | undefined
	};

	const passwordLength = 8;
	const userNameLength = 8;
	let hasPasswordLength = undefined as boolean | undefined;
	let hasUppercase = undefined as boolean | undefined;
	let hasLowercase = undefined as boolean | undefined;
	let hasNumber = undefined as boolean | undefined;
	let hasSpecialCharacter = undefined as boolean | undefined;

	$: hasPasswordLength =
		formData.password == undefined ? undefined : formData.password.length >= passwordLength;
	$: hasUppercase = formData.password == undefined ? undefined : /[A-Z]/.test(formData.password);
	$: hasLowercase = formData.password == undefined ? undefined : /[a-z]/.test(formData.password);
	$: hasNumber = formData.password == undefined ? undefined : /\d/.test(formData.password);
	$: hasSpecialCharacter =
		formData.password == undefined ? undefined : /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

	$: hasUsernameLength =
		formData.username == undefined ? undefined : formData.username.length > userNameLength;

	$: isPasswordEqual =
		formData.passwordRepeate == undefined
			? undefined
			: formData.password === formData.passwordRepeate;

	$: isEmailValid =
		formData.email == undefined ? undefined : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

	$: validInput =
		Object.values(formData).every((value) => value !== undefined && value.length > 0) &&
		isPasswordEqual &&
		hasUsernameLength &&
		hasSpecialCharacter &&
		hasNumber &&
		hasUppercase &&
		hasPasswordLength &&
		isEmailValid;
</script>

<body class="bg-slate-950 text-white">
	<nav
		class="fixed top-0 left-0 right-0 z-10 opacity-90 flex justify-between items-center bg-slate-950 pl-5 pr-5"
	>
		<Navbar />

		{#if loading == true}
			<button class="text-2xl m-2 p-2 rounded-xl text-center w-52 bg-violet-900 text-white">
				LOADING
			</button>
		{:else}
			<!-- svelte-ignore a11y-mouse-events-have-key-events -->
			<button
				class="text-2xl m-2 p-2 rounded-xl text-center w-52 bg-violet-900 text-white
				duration-500 hover:bg-violet-400 hover:text-violet-950"
				on:click={() => goto('Authorisation')}
				>Authorisation
			</button>
		{/if}
	</nav>

	<main class="relative top-32 p-5">
		<div class=" h-96 w-full flex justify-center items-center">
			<div class="w-72 grid grid-cols-1 bg-violet-900 rounded-2xl p-4 gap-2">
				<label for="username">Username:</label>
				<input
					class="w-full text-black p-2 rounded-lg"
					type="text"
					id="username"
					bind:value={formData.username}
					placeholder="Enter your username"
				/>
				{#if hasUsernameLength == false}
					<li class="flex items-center justify-between">
						<span>At least {userNameLength} long:</span>
						<span>❌</span>
					</li>
				{/if}
				<label for="e-mail">E-Mail:</label>
				<input
					class="w-full text-black p-2 rounded-lg"
					type="text"
					id="username"
					bind:value={formData.email}
					placeholder="Enter your e-mail"
				/>
				{#if isEmailValid == false}
					<li class="flex items-center justify-between">
						<span>Email is not valid:</span>
						<span>❌</span>
					</li>
				{/if}

				<label for="password">Password:</label>
				<input
					class="w-full text-black p-2 rounded-lg"
					type="password"
					id="password"
					bind:value={formData.password}
					placeholder="Enter your password"
				/>

				{#if !(hasPasswordLength && hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter)}<ul
						class="list-none"
					>
						<li class="flex items-center justify-between">
							<span>At least {passwordLength} long:</span>
							<span>{hasPasswordLength ? '✅' : '❌'}</span>
						</li>
						<li class="flex items-center justify-between">
							<span>At least one uppercase letter:</span>
							<span>{hasUppercase ? '✅' : '❌'}</span>
						</li>
						<li class="flex items-center justify-between">
							<span>At least one lowercase letter:</span>
							<span>{hasLowercase ? '✅' : '❌'}</span>
						</li>
						<li class="flex items-center justify-between">
							<span>At least one number:</span>
							<span>{hasNumber ? '✅' : '❌'}</span>
						</li>
						<li class="flex items-center justify-between">
							<span>At least one special character:</span>
							<span>{hasSpecialCharacter ? '✅' : '❌'}</span>
						</li>
					</ul>{/if}
				{#if hasPasswordLength && hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter}
					<label for="repassword">Repeate Password:</label>
					<input
						class="w-full text-black p-2 rounded-lg"
						type="password"
						id="repassword"
						bind:value={formData.passwordRepeate}
						placeholder="Enter your password"
					/>
					{#if isPasswordEqual == false}
						<p>not the same password ❌</p>
					{/if}
				{/if}

				{#if validInput == true}
					<button
						class="bg-violet-950 p-2 w-full rounded-lg"
						type="button"
						disabled={!validInput}
						on:click={register}
					>
						Register</button
					>
				{/if}
			</div>
		</div>
	</main>
</body>
