<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let title = $state('');
	let description = $state('');
	let stakeAmount = $state('');
	let deadline = $state('');
	let participantEmails = $state('');
	let error = $state('');
	let loading = $state(false);

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		error = '';
		loading = true;

		try {
			const participants = participantEmails
				.split(',')
				.map((e) => e.trim())
				.filter(Boolean);

			const body: Record<string, unknown> = {
				title,
				participants,
			};
			if (description) body.description = description;
			if (stakeAmount) body.stakeAmount = stakeAmount;
			if (deadline) body.deadline = new Date(deadline).toISOString();

			const res = await fetch('/api/v1/wagers', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(body),
			});

			if (!res.ok) {
				const b = await res.json();
				error = b?.message || 'Failed to create wager';
				return;
			}

			const { wager } = await res.json();
			await goto(`/wagers/${wager.id}`);
		} catch {
			error = 'Failed to create wager';
		} finally {
			loading = false;
		}
	}
</script>

<div class="max-w-2xl mx-auto">
	<div class="mb-6">
		<a href="/wagers" class="text-primary dark:text-primary-dark hover:underline">← Back to wagers</a>
	</div>

	<div class="card">
		<h1 class="text-2xl font-bold text-heading dark:text-heading-dark mb-6">New Wager</h1>

		<form class="grid gap-4" onsubmit={submit}>
			<div>
				<label for="title" class="block text-sm font-medium text-text dark:text-text-dark mb-1">Title *</label>
				<input id="title" type="text" bind:value={title} class="input w-full" required minlength={3} placeholder="e.g. Run 5km under 25 minutes" />
			</div>

			<div>
				<label for="description" class="block text-sm font-medium text-text dark:text-text-dark mb-1">Description</label>
				<textarea id="description" bind:value={description} class="input w-full" rows={3} placeholder="What's the bet? Stake, rules, deadline..."></textarea>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="stake" class="block text-sm font-medium text-text dark:text-text-dark mb-1">Stake (optional)</label>
					<input id="stake" type="text" bind:value={stakeAmount} class="input w-full" placeholder="e.g. 50" />
				</div>
				<div>
					<label for="deadline" class="block text-sm font-medium text-text dark:text-text-dark mb-1">Deadline (optional)</label>
					<input id="deadline" type="datetime-local" bind:value={deadline} class="input w-full" />
				</div>
			</div>

			<div>
				<label for="participants" class="block text-sm font-medium text-text dark:text-text-dark mb-1">Participants (email or IDs)</label>
				<input id="participants" type="text" bind:value={participantEmails} class="input w-full" required placeholder="alice@example.com, bob@example.com" />
				<p class="text-xs text-muted dark:text-muted-dark mt-1">Comma-separated emails of everyone in the bet (including yourself)</p>
			</div>

			{#if error}
				<p class="text-sm text-danger dark:text-danger-dark">{error}</p>
			{/if}

			<div class="flex gap-3 pt-2">
				<button type="submit" class="btn-primary" disabled={loading}>
					{loading ? 'Creating...' : 'Create Wager'}
				</button>
				<a href="/wagers" class="btn-secondary">Cancel</a>
			</div>
		</form>
	</div>
</div>