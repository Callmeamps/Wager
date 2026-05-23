<script lang="ts">
	import { onMount } from 'svelte';

	let wagerCount = $state(0);

	onMount(async () => {
		// Placeholder: will load wager count from API
		wagerCount = 0;
	});
</script>

<div class="text-center py-12">
	<h1 class="text-4xl font-bold mb-4">Welcome to Wager Tracker</h1>
	<p class="text-lg text-gray-600 mb-8">Track dares, bets, and challenges with friends.</p>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
		<div class="p-6 bg-blue-50 rounded-lg">
			<div class="text-3xl font-bold text-primary mb-2">{wagerCount}</div>
			<p class="text-gray-700">Active Wagers</p>
		</div>
		<div class="p-6 bg-green-50 rounded-lg">
			<div class="text-3xl font-bold text-success mb-2">-</div>
			<p class="text-gray-700">You Won</p>
		</div>
		<div class="p-6 bg-red-50 rounded-lg">
			<div class="text-3xl font-bold text-danger mb-2">-</div>
			<p class="text-gray-700">You Lost</p>
		</div>
	</div>

	<div class="flex gap-4 justify-center">
		<a href="/wagers" class="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90">
			View Wagers
		</a>
		<a href="/wagers/new" class="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary-50">
			Create Wager
		</a>
	</div>
</div>
