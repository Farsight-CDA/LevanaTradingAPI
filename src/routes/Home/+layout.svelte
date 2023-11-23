<script lang="ts">
	import { goto } from '$app/navigation';
	import Navbar from '$lib/Navbar/Sidebar.svelte';
	import '../../app.css';
</script>

<body class="bg-slate-950">
	<nav
		class="fixed top-0 left-0 right-0 z-10 opacity-90 flex justify-between items-center bg-slate-950 pl-5 pr-5"
	>
		<Navbar />
		<button
			on:click={() => goto('Authorisation')}
			class="text-violet-900 text-4xl m-2 p-2 rounded-xl duration-500 hover:bg-violet-900 hover:text-white"
			>Authorise</button
		>
	</nav>
	<main class="relative top-16 p-5">
		<slot />
	</main>
</body>
