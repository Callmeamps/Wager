<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let wager = $derived(data.wager);

	let proofLink = $state('');
	let proofEvidence = $state('');
	let proofError = $state('');
	let proofSuccess = $state('');
	let submittingProof = $state(false);

	let voteIsValid = $state(true);
	let voteComment = $state('');
	let voteError = $state('');
	let voteSuccess = $state('');
	let submittingVote = $state(false);

	let validVotes = $derived(wager.votes.filter((vote: { isValid: boolean }) => vote.isValid).length);
	let invalidVotes = $derived(wager.votes.length - validVotes);

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

	async function submitProof(event: SubmitEvent) {
		event.preventDefault();
		proofError = '';
		proofSuccess = '';
		submittingProof = true;
		try {
			const res = await fetch(`/api/v1/wagers/${wager.id}/proofs`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ link: proofLink, evidence: proofEvidence || undefined }),
			});
			if (!res.ok) { const body = await res.json(); proofError = body?.message || 'Failed'; return; }
			proofSuccess = 'Proof submitted!';
			proofLink = '';
			proofEvidence = '';
			await invalidateAll();
		} catch {
			proofError = 'Failed to submit proof';
		} finally { submittingProof = false; }
	}

	async function submitVote(event: SubmitEvent) {
		event.preventDefault();
		voteError = '';
		voteSuccess = '';
		submittingVote = true;
		try {
			const res = await fetch(`/api/v1/wagers/${wager.id}/votes`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ isValid: voteIsValid, comment: voteComment || undefined }),
			});
			if (!res.ok) { const body = await res.json(); voteError = body?.message || 'Failed'; return; }
			voteSuccess = 'Vote recorded!';
			voteComment = '';
			await invalidateAll();
		} catch {
			voteError = 'Failed to cast vote';
		} finally { submittingVote = false; }
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<a href="/wagers" class="text-primary dark:text-primary-dark hover:underline">← Back to wagers</a>
	</div>

	<div class="card mb-6">
		<div class="flex items-start justify-between gap-4 mb-4">
			<div>
				<h1 class="text-3xl font-bold text-heading dark:text-heading-dark">{wager.title}</h1>
				<p class="text-muted dark:text-muted-dark mt-1">by {wager.creator.name || wager.creator.email}</p>
			</div>
			<span class={statusClass(wager.status)}>{wager.status}</span>
		</div>
		{#if wager.description}
			<p class="text-text dark:text-text-dark mb-4">{wager.description}</p>
		{/if}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-text dark:text-text-dark">
			<div><strong>Participants:</strong> {wager.participants?.length || 0}</div>
			<div><strong>Proofs:</strong> {wager.proofs?.length || 0}</div>
			<div><strong>Votes:</strong> {wager.votes?.length || 0}</div>
			{#if wager.stakeAmount}
				<div><strong>Stake:</strong> {wager.stakeAmount} {wager.stakeCurrency}</div>
			{/if}
		</div>
	</div>

	<div class="grid md:grid-cols-2 gap-6">
		<section class="card">
			<h2 class="text-xl font-semibold text-heading dark:text-heading-dark mb-4">Participants</h2>
			<ul class="space-y-2">
				{#each wager.participants || [] as participant (participant.userId)}
					<li class="text-text dark:text-text-dark">{participant.user.name || participant.user.email}</li>
				{/each}
			</ul>
		</section>

		<section class="card">
			<h2 class="text-xl font-semibold text-heading dark:text-heading-dark mb-4">Votes</h2>
			<form class="grid gap-3 mb-6" onsubmit={submitVote}>
				<label class="text-sm text-text dark:text-text-dark">
					<input type="checkbox" bind:checked={voteIsValid} class="mr-2 accent-primary dark:accent-primary-dark" />
					Vote is valid
				</label>
				<textarea placeholder="Optional comment" bind:value={voteComment} class="input"></textarea>
				<button type="submit" class="btn-primary" disabled={submittingVote}>
					{submittingVote ? 'Submitting...' : 'Cast Vote'}
				</button>
			</form>
			{#if voteError}<p class="text-sm text-danger dark:text-danger-dark mb-3">{voteError}</p>{/if}
			{#if voteSuccess}<p class="text-sm text-success dark:text-success-dark mb-3">{voteSuccess}</p>{/if}
			<div class="text-sm text-text dark:text-text-dark mb-3">
				<strong>Tally:</strong> {validVotes} valid, {invalidVotes} invalid ({wager.votes?.length || 0} total)
			</div>
			{#if (wager.votes || []).length === 0}
				<p class="text-muted dark:text-muted-dark">No votes yet.</p>
			{:else}
				<ul class="space-y-3">
					{#each wager.votes as vote (vote.id)}
						<li class="text-sm text-text dark:text-text-dark">
							<strong>{vote.voter.name || vote.voter.email}</strong>: {vote.isValid ? '✅ Valid' : '❌ Invalid'}
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	</div>

	<section class="card mt-6">
		<h2 class="text-xl font-semibold text-heading dark:text-heading-dark mb-4">Proofs</h2>
		<form class="grid gap-3 mb-6" onsubmit={submitProof}>
			<input type="url" placeholder="Proof URL" bind:value={proofLink} class="input" required />
			<textarea placeholder="Optional evidence notes" bind:value={proofEvidence} class="input"></textarea>
			<button type="submit" class="btn-primary" disabled={submittingProof}>
				{submittingProof ? 'Submitting...' : 'Submit Proof'}
			</button>
		</form>
		{#if proofError}<p class="text-sm text-danger dark:text-danger-dark mb-3">{proofError}</p>{/if}
		{#if proofSuccess}<p class="text-sm text-success dark:text-success-dark mb-3">{proofSuccess}</p>{/if}
		{#if (wager.proofs || []).length === 0}
			<p class="text-muted dark:text-muted-dark">No proofs yet.</p>
		{:else}
			<ul class="space-y-3">
				{#each wager.proofs as proof (proof.id)}
					<li class="text-sm text-text dark:text-text-dark">
						<strong>{proof.user.name || proof.user.email}</strong>
						<a href={proof.link} target="_blank" rel="noopener noreferrer" class="text-primary dark:text-primary-dark hover:underline ml-2">View proof ↗</a>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section class="card mt-6">
		<h2 class="text-xl font-semibold text-heading dark:text-heading-dark mb-4">Comments</h2>
		{#if (wager.comments || []).length === 0}
			<p class="text-muted dark:text-muted-dark">No comments yet.</p>
		{:else}
			<ul class="space-y-3">
				{#each wager.comments as comment (comment.id)}
					<li class="text-sm text-text dark:text-text-dark">
						<div class="font-medium">{comment.user.name || comment.user.email}</div>
						<div>{comment.content}</div>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</div>
