<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let wagers = $derived(data.wagers || []);

	function getStatusColor(status: string) {
		switch (status) {
			case 'PENDING':
				return 'bg-yellow-100 text-yellow-800';
			case 'SUBMITTED':
				return 'bg-blue-100 text-blue-800';
			case 'VOTING':
				return 'bg-indigo-100 text-indigo-800';
			case 'RESOLVED':
				return 'bg-green-100 text-green-800';
			case 'CANCELLED':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="max-w-6xl mx-auto">
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-3xl font-bold">Wagers</h1>
		<a
			href="/wagers/new"
			class="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
		>
			+ New Wager
		</a>
	</div>

	{#if wagers.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-600 mb-4">No wagers yet. Create one to get started!</p>
			<a href="/wagers/new" class="text-primary hover:underline"> Create your first wager </a>
		</div>
	{:else}
		<div class="grid gap-6">
			{#each wagers as wager (wager.id)}
				<div class="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg transition">
					<div class="flex justify-between items-start mb-3">
						<div class="flex-1">
							<h2 class="text-xl font-bold text-gray-900">{wager.title}</h2>
							<p class="text-gray-600 text-sm mt-1">
								by {wager.creator.name || wager.creator.email}
							</p>
						</div>
						<span class="px-3 py-1 rounded-full text-xs font-semibold {getStatusColor(wager.status)}">
							{wager.status}
						</span>
					</div>

					{#if wager.description}
						<p class="text-gray-700 mb-4">{wager.description}</p>
					{/if}

					<div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
						<div>
							👥 {wager.participants.length} participants
						</div>
						<div>
							📸 {wager.proofs.length} proofs
						</div>
						<div>
							✓ {wager.votes.length} votes
						</div>
						{#if wager.stakeAmount}
							<div>
								💰 {wager.stakeAmount} {wager.stakeCurrency}
							</div>
						{/if}
					</div>

					<a
						href="/wagers/{wager.id}"
						class="text-primary hover:underline font-medium inline-block"
					>
						View Details →
					</a>
				</div>
			{/each}
		</div>
	{/if}
</div>
