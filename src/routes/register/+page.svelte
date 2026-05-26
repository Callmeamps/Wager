<script lang="ts">
	import { goto } from '$app/navigation';
	let name = $state(''); let email = $state(''); let password = $state(''); let error = $state(''); let loading = $state(false);
	async function submit(event: SubmitEvent) {
		event.preventDefault(); error = ''; loading = true;
		try {
			const res = await fetch('/api/v1/auth/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: name || undefined, email, password }) });
			if (!res.ok) { const body = await res.json(); error = body?.message || 'Register failed'; return; }
			await goto('/wagers');
		} catch { error = 'Register failed'; } finally { loading = false; }
	}
</script>
<div class="max-w-md mx-auto card">
	<h1 class="text-2xl font-bold text-heading dark:text-heading-dark mb-4">Register</h1>
	<form class="grid gap-3" onsubmit={submit}>
		<input type="text" bind:value={name} placeholder="Name (optional)" class="input" />
		<input type="email" bind:value={email} placeholder="Email" class="input" required />
		<input type="password" bind:value={password} placeholder="Password (min 8)" class="input" required />
		<button type="submit" class="btn-primary" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
	</form>
	{#if error}<p class="text-sm text-danger dark:text-danger-dark mt-3">{error}</p>{/if}
	<p class="text-sm mt-4 text-text dark:text-text-dark">Have account? <a href="/login" class="text-primary dark:text-primary-dark hover:underline">Login</a></p>
</div>
