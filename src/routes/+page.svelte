<script lang="ts">
	import { onMount } from 'svelte';

	let wagerCount = $state(0);

	onMount(async () => {
		wagerCount = 0;
	});
</script>

<div class="text-center py-12">
	<h1 class="text-4xl font-bold text-heading dark:text-heading-dark mb-4">Welcome to Wager Tracker</h1>
	<p class="text-lg text-muted dark:text-muted-dark mb-8">Track dares, bets, and challenges with friends.</p>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-3xl mx-auto">
		<div class="p-6 bg-primary-container dark:bg-primary-container-dark rounded-md">
			<div class="text-3xl font-bold text-primary dark:text-primary-dark mb-2">{wagerCount}</div>
			<p class="text-text dark:text-text-dark">Active Wagers</p>
		</div>
		<div class="p-6 bg-success-container dark:bg-success-container-dark rounded-md">
			<div class="text-3xl font-bold text-success dark:text-success-dark mb-2">-</div>
			<p class="text-success-content dark:text-success-content-dark">You Won</p>
		</div>
		<div class="p-6 bg-danger-container dark:bg-danger-container-dark rounded-md">
			<div class="text-3xl font-bold text-danger dark:text-danger-dark mb-2">-</div>
			<p class="text-danger-content dark:text-danger-content-dark">You Lost</p>
		</div>
	</div>

	<div class="flex gap-4 justify-center">
		<a href="/wagers" class="btn-primary">View Wagers</a>
		<a href="/wagers/new" class="btn-secondary">Create Wager</a>
	</div>
</div>
