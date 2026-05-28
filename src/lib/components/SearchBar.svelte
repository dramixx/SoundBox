<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value = '';

	const dispatch = createEventDispatcher<{ input: string }>();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;
		dispatch('input', value);
	}

	function clear() {
		value = '';
		dispatch('input', '');
	}
</script>

<div class="relative flex items-center">
	<span class="absolute left-3 text-white/30 pointer-events-none" aria-hidden="true">
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
			<circle cx="6.5" cy="6.5" r="4.5"/>
			<line x1="10" y1="10" x2="14" y2="14"/>
		</svg>
	</span>
	<input
		type="search"
		class="
			w-full bg-[#1a1a1a] border border-white/10 rounded-xl
			pl-9 pr-9 py-2.5
			text-sm text-white placeholder-white/30
			focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
			transition-colors
		"
		placeholder="Rechercher un son..."
		bind:value
		on:input={handleInput}
		aria-label="Rechercher un son"
	/>
	{#if value}
		<button
			class="absolute right-3 text-white/30 hover:text-white/70 transition-colors"
			on:click={clear}
			aria-label="Effacer la recherche"
		>
			<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
				<line x1="2" y1="2" x2="12" y2="12"/>
				<line x1="12" y1="2" x2="2" y2="12"/>
			</svg>
		</button>
	{/if}
</div>
