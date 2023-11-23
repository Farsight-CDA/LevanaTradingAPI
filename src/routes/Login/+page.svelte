<script lang="ts">
	import Navbar from '$lib/Navbar/Sidebar.svelte';
	import { goto } from '$app/navigation';
	import '../../app.css';
	import { onMount } from 'svelte';
	import { fetchLogin } from '$lib/Backend';

	onMount(() => {});

	enum State {
		loading = 'loading',
		error = 'error',
		false = 'false',
		default = 'default'
	}

	let state: State = State.default;

	async function login() {
		if (formData.email != undefined && formData.password != undefined) {
			state = State.loading;

			const response = await fetchLogin(formData.email, formData.password);

			switch (response.response) {
				case undefined:
					state = State.error;
					break;
				case false:
					state = State.false;

					break;

				default:
					goto('Authorisation');
			}
			setTimeout(() => {
				state = State.default;
			}, 1000);

			console.log(state);
		}
	}

	$: isEmailValid =
		formData.email == undefined ? undefined : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

	let formData = {
		email: undefined as string | undefined,
		password: undefined as string | undefined
	};
</script>

<body class="bg-slate-950 text-white">
	<nav
		class="fixed top-0 left-0 right-0 z-10 opacity-90 flex justify-between items-center bg-slate-950 pl-5 pr-5"
	>
		<Navbar />
		<button
			class="text-2xl m-2 p-2 rounded-xl text-center w-52 bg-violet-900 text-white
				duration-500 hover:bg-violet-400 hover:text-violet-950"
			on:click={() => goto('Registration')}
		>
			Registaration
		</button>
	</nav>

	<main class="relative top-32 p-5">
		<div class=" h-96 w-full flex justify-center items-center">
			<div class="w-72 grid grid-cols-1 bg-violet-900 rounded-2xl p-4 gap-2">
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

				{#if state == 'loading'}
					<button
						class="bg-violet-950 p-2 w-full duration-500 rounded-lg"
						type="button"
						disabled={true}
					>
						Loading</button
					>
				{:else if state == 'false'}
					<button
						class="bg-violet-950 p-2 w-full duration-500 rounded-lg"
						type="button"
						disabled={true}
					>
						There must be a typo, I swear
					</button>
				{:else if state == 'error'}
					<button
						class="bg-violet-950 p-2 w-full duration-500 rounded-lg"
						type="button"
						disabled={true}
					>
						Ups somthing went wrong</button
					>
				{:else}
					<button
						class="bg-violet-950 p-2 w-full duration-500 rounded-lg
						disabled:hover:bg-red-500 disabled:text-white
						hover:bg-violet-400 hover:text-violet-950"
						type="button"
						disabled={formData.email == undefined ||
							formData.password == undefined ||
							formData.email.length == 0 ||
							formData.password.length == 0}
						on:click={login}
					>
						Login</button
					>
				{/if}
			</div>
		</div>
	</main>
</body>
