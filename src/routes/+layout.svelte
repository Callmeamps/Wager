<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Wager Tracker</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<header class="bg-primary text-white shadow">
		<nav class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
			<a href="/" class="text-2xl font-bold">⚖️ Wager</a>
			<ul class="flex gap-6">
				<li><a href="/wagers" class="hover:text-primary-100">Wagers</a></li>
				<li><a href="/profile" class="hover:text-primary-100">Profile</a></li>
			</ul>
		</nav>
	</header>

	<main class="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
		{@render children()}
	</main>

	<footer class="bg-gray-100 text-gray-600 text-center py-4 mt-12">
		<p>&copy; 2025 Wager Tracker. All rights reserved.</p>
	</footer>
</div>
