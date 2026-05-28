<script lang="ts">
	import { categories, allSounds } from '$lib/sounds';
	import { play, stop, stopAll, repeatMode, toggleRepeat, playing } from '$lib/stores/audio';
	import SoundCategory from '$lib/components/SoundCategory.svelte';
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import type { Sound } from '$lib/sounds';

	let searchQuery = '';
	let contextMenuVisible = false;
	let contextMenuX = 0;
	let contextMenuY = 0;
	let contextMenuSound: Sound | null = null;
	let isMobile = false;

	// Detect mobile on client
	if (typeof window !== 'undefined') {
		isMobile = window.innerWidth < 640;
		window.addEventListener('resize', () => {
			isMobile = window.innerWidth < 640;
		});
	}

	$: filteredSoundIds =
		searchQuery.trim() === ''
			? null
			: new Set(
					allSounds
						.filter((s) => s.label.toLowerCase().includes(searchQuery.trim().toLowerCase()))
						.map((s) => s.id)
			  );

	$: hasAnyResults =
		filteredSoundIds === null ||
		categories.some((cat) => cat.sounds.some((s) => filteredSoundIds!.has(s.id)));



	function handlePlay(e: CustomEvent<Sound>) {
		play(e.detail.id, e.detail.file);
	}

	function handleStop(e: CustomEvent<Sound>) {
		stop(e.detail.id);
	}

	function handleLongpress(e: CustomEvent<{ sound: Sound; x: number; y: number }>) {
		contextMenuSound = e.detail.sound;
		contextMenuX = e.detail.x;
		contextMenuY = e.detail.y;

		// Clamp desktop popup to viewport
		if (!isMobile) {
			const menuWidth = 200;
			const menuHeight = 120;
			if (contextMenuX + menuWidth > window.innerWidth) {
				contextMenuX = window.innerWidth - menuWidth - 8;
			}
			if (contextMenuY + menuHeight > window.innerHeight) {
				contextMenuY = window.innerHeight - menuHeight - 8;
			}
		}

		contextMenuVisible = true;
	}

	function handleContextStop() {
		if (contextMenuSound) {
			stop(contextMenuSound.id);
		}
	}

	function handleContextClose() {
		contextMenuVisible = false;
		contextMenuSound = null;
	}

	function handleSearch(e: CustomEvent<string>) {
		searchQuery = e.detail;
	}
</script>

<svelte:head>
	<title>SoundBox</title>
</svelte:head>

<div class="min-h-dvh bg-[#0f0f0f] flex flex-col">
	<!-- Header -->
	<header class="sticky top-0 z-30 bg-[#0f0f0f]/90 backdrop-blur border-b border-white/5">
		<div class="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
			<!-- Logo / Title -->
			<div class="flex items-center gap-2 flex-shrink-0">
				<span class="text-xl" aria-hidden="true">🔊</span>
				<h1 class="text-base font-bold text-white tracking-tight">SoundBox</h1>
			</div>

			<!-- Search Bar -->
			<div class="flex-1">
				<SearchBar value={searchQuery} on:input={handleSearch} />
			</div>

			<!-- Repeat Toggle -->
			<button
				class="
					flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
					transition-all duration-150
					{$repeatMode
						? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
						: 'bg-[#1a1a1a] text-white/50 hover:text-white hover:bg-[#2a2a2a] border border-white/5'}
				"
				on:click={toggleRepeat}
				aria-label="Répétition {$repeatMode ? 'activée' : 'désactivée'}"
				title="Répétition"
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
					<path d="M2 5h10M9 2l3 3-3 3"/>
					<path d="M14 11H4M7 8l-3 3 3 3"/>
				</svg>
				<span class="hidden sm:inline">Repeat</span>
			</button>
		</div>
	</header>

	<!-- Main content -->
	<main class="flex-1 max-w-4xl mx-auto w-full px-4 py-4">
		<!-- Sound Categories -->
		{#if hasAnyResults}
			{#each categories as category (category.id)}
				<SoundCategory
					{category}
					{filteredSoundIds}
					on:play={handlePlay}
					on:stop={handleStop}
					on:longpress={handleLongpress}
				/>
			{/each}
		{:else}
			<div class="flex flex-col items-center justify-center py-20 text-center">
				<span class="text-4xl mb-3" aria-hidden="true">🔍</span>
				<p class="text-white/40 text-sm">Aucun son trouvé pour "{searchQuery}"</p>
			</div>
		{/if}
	</main>

	<!-- Footer -->
	<footer class="border-t border-white/5 py-3 px-4">
		<p class="text-center text-xs text-white/20">
			SoundBox • {allSounds.length} sons
		</p>
	</footer>
</div>

<!-- Context Menu -->
<ContextMenu
	visible={contextMenuVisible}
	x={contextMenuX}
	y={contextMenuY}
	{isMobile}
	soundLabel={contextMenuSound?.label ?? ''}
	soundFile={contextMenuSound?.file ?? ''}
	on:stop={handleContextStop}
	on:close={handleContextClose}
/>
