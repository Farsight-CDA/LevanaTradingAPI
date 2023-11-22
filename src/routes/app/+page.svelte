<script lang="ts">
	import { onMount } from 'svelte';

	import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
	import type { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
	import type { OfflineAminoSigner, OfflineDirectSigner } from '@keplr-wallet/types';
	import { grantContractAuthorization, grantGenericAuthorization } from '$lib/grands';
	import { GasPrice, SigningStargateClient } from '@cosmjs/stargate';
	import { getContracts, keys } from '$lib/contractUtils';
	import type { Contract } from '$lib/contractUtils';

	let extentionInstalled: boolean = false;
	let offlineSigner: OfflineAminoSigner & OfflineDirectSigner;
	let chainId = 'osmosis-1';
	const rpcEndpoint = 'https://rpc.osmosis.zone';
	let client: SigningCosmWasmClient;
	let address: string;
	let contracts: Contract[];

	onMount(async () => {
		if (!window.keplr) {
			return;
		} else {
			extentionInstalled = true;
			await window.keplr.enable(chainId);
			offlineSigner = window.keplr.getOfflineSigner(chainId);
			address = (await offlineSigner.getAccounts())[0].address;

			const clientOptions: SigningCosmWasmClientOptions = {
				gasPrice: GasPrice.fromString('700uosmo')
			};
			client = await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, offlineSigner);

			contracts = await getContracts();
		}
	});

	let formData = {
		contractAddress: undefined as string | undefined,
		date: undefined as unknown as string | undefined,
		volume: undefined as unknown as number | undefined
	};
	$: allValuesSet = Object.values(formData).every((value) => value !== undefined);
	let isDateDisabled = false;

	function disableDate() {
		isDateDisabled = !isDateDisabled;
		if (formData.date == '') {
			formData.date = undefined;
		} else {
			formData.date = '';
		}
	}
	function getCurrentDate(): string {
		const today = new Date();
		const year = today.getFullYear();
		let month: number | string = today.getMonth() + 1;
		let day: number | string = today.getDate() + 1;

		if (month < 10) {
			month = `0${month}`;
		}
		if (day < 10) {
			day = `0${day}`;
		}

		return `${year}-${month}-${day}`;
	}

	async function handleSubmit() {
		console.log(new Date(Date.parse(formData.date ?? '0')));
		grantContractAuthorization(
			client,
			address,
			'osmo1gewl3hfvf8tu4lncmh0rgj564suyqk3cyl8j7f',
			isDateDisabled ? null : new Date(Date.parse(formData.date ?? '0')),
			formData.contractAddress!,
			keys,
			formData.volume!
		);
	}
</script>

{#if contracts == null}
	<div>loading</div>
{:else}
	<div class="h-96 w-full flex justify-center items-center">
		<div class="bg-violet-900 rounded-2xl p-4">
			<label for="contract">Select Levana Contract:</label><br />
			<select class="text-black p-2 rounded-lg" bind:value={formData.contractAddress}>
				<option value={undefined} selected disabled hidden>Select your option</option>
				{#each contracts as contract}
					<option value={contract.address}>{contract.name}</option>
				{/each}
			</select>
			<br />

			<label for="time">Select Expiration Date:</label>
			<div class="flex flex-row justify-between items-center" style="margin-left: 1px;">
				<input
					class="text-black p-1 rounded-lg"
					type="date"
					id="datepicker"
					name="datepicker"
					bind:value={formData.date}
					disabled={isDateDisabled}
					min={getCurrentDate()}
				/>
				<div class="flex gap-2 items-center">
					<label for="time">Infinite</label>
					<input class="h-4 w-4" type="checkbox" id="disableDate" on:change={disableDate} />
				</div>
			</div>

			<label for="contract">Select amount:</label><br />
			<select class="w-full text-black p-2 rounded-lg" bind:value={formData.volume}>
				<option value={undefined} selected disabled hidden>Select max volume</option>

				<option value={500}>Starter 500</option>
				<option value={500000}>Trader 50K</option>
				<option value={Number.MAX_SAFE_INTEGER}>Whale Unlimited</option>
			</select>

			<div class="h-14 flex flex-col justify-center mt-3">
				{#if allValuesSet === true}
					<button
						class="bg-violet-950 p-2 w-full rounded-lg"
						type="button"
						disabled={!allValuesSet}
						on:click={handleSubmit}>Submit</button
					>
				{/if}

				{#if formData.contractAddress === undefined}
					<p class="text-sm text-center">no Contract Selected</p>
				{/if}
				{#if !(formData.date !== undefined || isDateDisabled == true)}
					<p class="text-sm text-center">no Date Selected</p>
				{/if}
				{#if formData.volume === undefined}
					<p class="text-sm text-center">no Volume Selected</p>
				{/if}
			</div>
		</div>
	</div>
{/if}
