<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	export let visible = false;
	export let x = 0;
	export let y = 0;
	export let isMobile = false;
	export let soundLabel = '';
	export let soundFile = '';

	const dispatch = createEventDispatcher<{
		stop: void;
		close: void;
	}>();

	function handleStop() {
		dispatch('stop');
		dispatch('close');
	}

	async function handleCopy() {
		const url = window.location.origin + soundFile;
		try {
			await navigator.clipboard.writeText(url);
		} catch {
			// fallback
			const ta = document.createElement('textarea');
			ta.value = url;
			document.body.appendChild(ta);
			ta.select();
			document.execCommand('copy');
			document.body.removeChild(ta);
		}
		dispatch('close');
	}

	function handleBackdrop() {
		dispatch('close');
	}
</script>

{#if visible}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-40"
		on:click={handleBackdrop}
		on:contextmenu|preventDefault={handleBackdrop}
	></div>

	{#if isMobile}
		<!-- Mobile: slide up from bottom -->
		<div
			class="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] border-t border-white/10 rounded-t-2xl p-4 pb-8 shadow-2xl"
			transition:fly={{ y: 200, duration: 250 }}
		>
			<div class="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4"></div>
			<p class="text-sm text-white/50 mb-3 px-1 truncate">{soundLabel}</p>
			<div class="flex flex-col gap-2">
				<button
					class="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-left transition-colors"
					on:click={handleStop}
				>
					<span class="text-lg">⏹</span>
					<span class="font-medium">Arrêter le son</span>
				</button>
				<button
					class="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-left transition-colors"
					on:click={handleCopy}
				>
					<span class="text-lg">🔗</span>
					<span class="font-medium">Copier le lien MP3</span>
				</button>
			</div>
		</div>
	{:else}
		<!-- Desktop: absolute popup -->
		<div
			class="fixed z-50 bg-[#2a2a2a] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[180px]"
			style="left: {x}px; top: {y}px;"
			transition:fly={{ y: -6, duration: 150 }}
		>
			<div class="px-3 py-2 border-b border-white/10">
				<p class="text-xs text-white/40 truncate max-w-[180px]">{soundLabel}</p>
			</div>
			<button
				class="flex items-center gap-2 w-full px-3 py-2.5 hover:bg-white/10 active:bg-white/15 text-left text-sm transition-colors"
				on:click={handleStop}
			>
				<span>⏹</span>
				<span>Arrêter le son</span>
			</button>
			<button
				class="flex items-center gap-2 w-full px-3 py-2.5 hover:bg-white/10 active:bg-white/15 text-left text-sm transition-colors"
				on:click={handleCopy}
			>
				<span>🔗</span>
				<span>Copier le lien MP3</span>
			</button>
		</div>
	{/if}
{/if}
