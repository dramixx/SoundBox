<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import SoundButton from './SoundButton.svelte';
	import type { Category, Sound } from '$lib/sounds';

	export let category: Category;
	export let filteredSoundIds: Set<string> | null = null; // null = show all

	const dispatch = createEventDispatcher<{
		longpress: { sound: Sound; x: number; y: number };
		play: Sound;
		stop: Sound;
	}>();

	let collapsed = false;

	$: visibleSounds =
		filteredSoundIds === null
			? category.sounds
			: category.sounds.filter((s) => filteredSoundIds!.has(s.id));

	$: hasVisible = visibleSounds.length > 0;

	function toggleCollapse() {
		collapsed = !collapsed;
	}
</script>

{#if hasVisible}
	<section class="mb-6">
		<!-- Category Header -->
		<button
			class="
				flex items-center justify-between w-full
				px-1 py-2 mb-3
				border-l-4 border-indigo-500 pl-3
				text-left group
			"
			on:click={toggleCollapse}
			aria-expanded={!collapsed}
		>
			<h2 class="text-base font-semibold text-white/80 group-hover:text-white transition-colors">
				{category.label}
				<span class="ml-2 text-xs text-white/40 font-normal">
					({visibleSounds.length})
				</span>
			</h2>
			<span
				class="text-white/40 group-hover:text-white/60 transition-all duration-200 {collapsed ? 'rotate-180' : ''}"
				aria-hidden="true"
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
					<path d="M8 5L14 11H2L8 5Z"/>
				</svg>
			</span>
		</button>

		{#if !collapsed}
			<div
				class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2"
				transition:slide={{ duration: 200 }}
			>
				{#each visibleSounds as sound (sound.id)}
					<SoundButton
						{sound}
						on:longpress
						on:play
						on:stop
					/>
				{/each}
			</div>
		{/if}
	</section>
{/if}
