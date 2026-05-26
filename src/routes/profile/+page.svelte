<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>
<div class="max-w-xl mx-auto card">
	<h1 class="text-2xl font-bold text-heading dark:text-heading-dark mb-4">Profile</h1>
	{#if !data.user}
		<p class="text-text dark:text-text-dark">Not logged in. <a href="/login" class="text-primary dark:text-primary-dark hover:underline">Login</a></p>
	{:else}
		<div class="space-y-2 text-text dark:text-text-dark">
			<div><strong>ID:</strong> {data.user.id}</div>
			<div><strong>Email:</strong> {data.user.email}</div>
			<div><strong>Name:</strong> {data.user.name || '-'}</div>
		</div>
	{/if}
</div>
