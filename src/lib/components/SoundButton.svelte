<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { playing } from '$lib/stores/audio';
	import type { Sound } from '$lib/sounds';

	export let sound: Sound;

	const dispatch = createEventDispatcher<{
		longpress: { sound: Sound; x: number; y: number };
		play: Sound;
		stop: Sound;
	}>();

	let pressTimer: ReturnType<typeof setTimeout> | null = null;
	let longPressTriggered = false;
	let isPressed = false;

	$: isPlaying = $playing.has(sound.id);

	function startPress(e: PointerEvent) {
		isPressed = true;
		longPressTriggered = false;
		pressTimer = setTimeout(() => {
			longPressTriggered = true;
			isPressed = false;
			// Get position for context menu
			dispatch('longpress', {
				sound,
				x: e.clientX,
				y: e.clientY
			});
		}, 500);
	}

	function endPress() {
		isPressed = false;
		if (pressTimer) {
			clearTimeout(pressTimer);
			pressTimer = null;
		}
	}

	function handleClick() {
		if (longPressTriggered) {
			longPressTriggered = false;
			return;
		}
		if (isPlaying) {
			dispatch('stop', sound);
		} else {
			dispatch('play', sound);
		}
	}

	function handleContextMenu(e: MouseEvent) {
		e.preventDefault();
		dispatch('longpress', {
			sound,
			x: e.clientX,
			y: e.clientY
		});
	}
</script>

<button
	class="
		sound-btn
		relative flex flex-col items-center justify-center gap-2
		rounded-xl px-3 py-4 min-h-[64px]
		font-medium text-sm text-center leading-tight
		no-select transition-all duration-150
		bg-[#1a1a1a] hover:bg-[#2a2a2a] active:bg-[#333344]
		border border-white/5
		{isPlaying ? 'playing border-indigo-500/50 bg-[#1e1e33] animate-pulse-glow' : ''}
		{isPressed ? 'scale-95 brightness-110' : ''}
	"
	on:click={handleClick}
	on:pointerdown={startPress}
	on:pointerup={endPress}
	on:pointerleave={endPress}
	on:pointercancel={endPress}
	on:contextmenu={handleContextMenu}
	aria-label={sound.label}
	aria-pressed={isPlaying}
>
	{#if isPlaying}
		<!-- Playing indicator bars -->
		<div class="flex items-end gap-0.5 h-4 absolute top-2 right-2 opacity-70" aria-hidden="true">
			<span class="w-1 bg-indigo-400 rounded-sm animate-[equalize1_0.8s_ease-in-out_infinite]"></span>
			<span class="w-1 bg-indigo-400 rounded-sm animate-[equalize2_0.8s_ease-in-out_infinite_0.15s]"></span>
			<span class="w-1 bg-indigo-400 rounded-sm animate-[equalize3_0.8s_ease-in-out_infinite_0.3s]"></span>
		</div>
	{/if}

	<span class="text-xl" aria-hidden="true">
		{isPlaying ? '🔊' : '🔉'}
	</span>

	<span class="text-white/90 break-words w-full">
		{sound.label}
	</span>
</button>

<style>
	@keyframes equalize1 {
		0%, 100% { height: 4px; }
		50% { height: 14px; }
	}
	@keyframes equalize2 {
		0%, 100% { height: 10px; }
		50% { height: 6px; }
	}
	@keyframes equalize3 {
		0%, 100% { height: 6px; }
		50% { height: 12px; }
	}

	.sound-btn {
		touch-action: manipulation;
		cursor: pointer;
	}
</style>
