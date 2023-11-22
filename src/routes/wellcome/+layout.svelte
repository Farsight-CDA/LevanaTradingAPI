<script lang="ts">
	import { goto } from '$app/navigation';
	import '../../app.css';
</script>

<body class="bg-slate-950">
	<nav
		class="fixed top-0 left-0 right-0 z-10 opacity-90 flex justify-between items-center bg-slate-950 pl-5 pr-5"
	>
		<div class="pt-7 pb-7">
			<button class="navbar-burger flex items-center text-3xl text-indigo-500">
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
		<button
			on:click={() => goto('app')}
			class="text-violet-900 text-4xl m-2 p-2 rounded-xl duration-500 hover:bg-violet-900 hover:text-white"
			>elias strinkt</button
		>
	</nav>
	<main class="relative top-16 p-5">
		<slot />
	</main>
</body>
