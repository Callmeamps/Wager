<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let wagers = $derived(data.wagers || []);

	function statusClass(status: string) {
		switch (status) {
			case 'PENDING': return 'badge badge-pending';
			case 'SUBMITTED': return 'badge badge-submitted';
			case 'VOTING': return 'badge badge-voting';
			case 'RESOLVED': return 'badge badge-resolved';
			case 'CANCELLED': return 'badge badge-cancelled';
			default: return 'badge bg-surface dark:bg-surface-dark text-muted dark:text-muted-dark';
		}
	}
</script>

<div class="max-w-6xl mx-auto">
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-3xl font-bold text-heading dark:text-heading-dark">Wagers</h1>
		<a href="/wagers/new" class="btn-primary">+ New Wager</a>
	</div>

	{#if wagers.length === 0}
		<div class="text-center py-12 card">
			<p class="text-muted dark:text-muted-dark mb-4">No wagers yet. Create one to get started!</p>
			<a href="/wagers/new" class="text-primary dark:text-primary-dark hover:underline font-medium">Create your first wager</a>
		</div>
	{:else}
		<div class="grid gap-6">
			{#each wagers as wager (wager.id)}
				<div class="card hover:shadow-md transition-shadow">
					<div class="flex justify-between items-start mb-3">
						<div class="flex-1">
							<h2 class="text-xl font-bold text-heading dark:text-heading-dark">{wager.title}</h2>
							<p class="text-sm text-muted dark:text-muted-dark mt-1">
								by {wager.creator.name || wager.creator.email}
							</p>
						</div>
						<span class={statusClass(wager.status)}>{wager.status}</span>
					</div>

					{#if wager.description}
						<p class="text-text dark:text-text-dark mb-4">{wager.description}</p>
					{/if}

					<div class="flex flex-wrap gap-4 text-sm text-muted dark:text-muted-dark mb-4">
						<div>👥 {wager.participants.length} participants</div>
						<div>📸 {wager.proofs.length} proofs</div>
						<div>✓ {wager.votes.length} votes</div>
						{#if wager.stakeAmount}
							<div>💰 {wager.stakeAmount} {wager.stakeCurrency}</div>
						{/if}
					</div>

					<a
						href="/wagers/{wager.id}"
						class="text-primary dark:text-primary-dark hover:underline font-medium inline-block"
					>
						View Details →
					</a>
				</div>
			{/each}
		</div>
	{/if}
</div>
