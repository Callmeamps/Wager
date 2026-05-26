<script lang="ts">
	import type { Snippet } from 'svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import type { LayoutData } from './$types';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();
	let darkMode = $state(false);

	function toggleDark() {
		darkMode = !darkMode;
		document.documentElement.classList.toggle('dark', darkMode);
		try {
			localStorage.setItem('wager-theme', darkMode ? 'dark' : 'light');
		} catch {}
	}

	function initTheme() {
		let stored: string | null = null;
		try { stored = localStorage.getItem('wager-theme'); } catch {}
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const isDark = stored ? stored === 'dark' : prefersDark;
		darkMode = isDark;
		document.documentElement.classList.toggle('dark', isDark);
	}

	async function logout() {
		await fetch('/api/v1/auth/logout', { method: 'POST' });
		await invalidateAll();
		await goto('/');
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Wager Tracker</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<header class="bg-primary dark:bg-primary-dark text-white shadow">
		<nav class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
			<a href="/" class="text-2xl font-bold">⚖️ Wager</a>
			<ul class="flex gap-4 items-center">
				<li><a href="/wagers" class="hover:text-primary-muted transition-colors">Wagers</a></li>
				{#if data.user}
					<li><a href="/profile" class="hover:text-primary-muted transition-colors">{data.user.name || data.user.email}</a></li>
					<li>
						<button class="hover:text-primary-muted transition-colors" onclick={logout}>Logout</button>
					</li>
				{:else}
					<li><a href="/login" class="hover:text-primary-muted transition-colors">Login</a></li>
					<li><a href="/register" class="hover:text-primary-muted transition-colors">Register</a></li>
				{/if}
				<li>
					<button
						onclick={toggleDark}
						class="p-1.5 rounded-md hover:bg-white/10 transition-colors"
						aria-label="Toggle dark mode"
					>
						{#if darkMode}
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
						{/if}
					</button>
				</li>
			</ul>
		</nav>
	</header>

	<main class="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
		{@render children()}
	</main>

	<footer class="bg-footer-bg dark:bg-footer-bg-dark text-muted dark:text-muted-dark text-center py-4 mt-12 border-t border-border dark:border-border-dark">
		<p>&copy; 2025 Wager Tracker. All rights reserved.</p>
	</footer>
</div>

<svelte:window onload={initTheme} />
