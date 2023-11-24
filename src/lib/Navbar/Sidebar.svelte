<script lang="ts">
	import { goto } from '$app/navigation';
	import { afterUpdate, onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let isNavOpen = false;
	let timeout: NodeJS.Timeout;

	const navItems = [
		{ id: 1, label: 'Home', link: 'Home' },
		{ id: 2, label: 'Login', link: 'Login' },
		{ id: 3, label: 'Registration', link: 'Registration' },
		{ id: 4, label: 'Authorisation', link: 'Authorisation' }
	];

	function toggleNav() {
		isNavOpen = !isNavOpen;
	}

	function closeNav() {
		isNavOpen = false;
	}

	function extend() {
		clearTimeout(timeout);
	}
	function leave() {
		timeout = setTimeout(closeNav, 600);
	}
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<nav on:mouseleave={leave} on:mouseover={extend}>
	<button
		on:click={toggleNav}
		class="navbar-burger flex items-center text-3xl text-white p-4 rounded-xl duration-500 hover:bg-violet-400 hover:text-violet-900"
	>
		<svg class="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
			<title>Mobile menu</title>
			<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
		</svg>
	</button>

	<div class="absolute left-0 top-20 grid grid-cols-1">
		{#each navItems as item, index (item.id)}
			{#if isNavOpen}
				<button
					class="text-white bg-black p-6
                        {index == 0 && 'rounded-tr-xl'} {index == 3 && 'rounded-br-xl'}"
					transition:fly={{ x: -300, duration: 500 * (index + 1) }}
					on:click={() => goto(item.link)}
				>
					{item.label}
				</button>
			{/if}
		{/each}
	</div>
</nav>
