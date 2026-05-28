import { writable, derived, get } from 'svelte/store';

interface AudioInstance {
	audio: HTMLAudioElement;
	soundId: string;
}

// Set of currently playing sound IDs
const playingIds = writable<Set<string>>(new Set());

// Map of sound ID → active audio instances (supports multiple for same sound)
const audioInstances = new Map<string, HTMLAudioElement[]>();

// Repeat/loop mode
export const repeatMode = writable<boolean>(false);

// Derived readable store of playing IDs for components
export const playing = derived(playingIds, ($ids) => $ids);

function removeInstance(soundId: string, audio: HTMLAudioElement) {
	const list = audioInstances.get(soundId);
	if (list) {
		const idx = list.indexOf(audio);
		if (idx !== -1) list.splice(idx, 1);
		if (list.length === 0) {
			audioInstances.delete(soundId);
			playingIds.update((ids) => {
				const next = new Set(ids);
				next.delete(soundId);
				return next;
			});
		}
	}
}

export function play(soundId: string, file: string) {
	const repeat = get(repeatMode);

	const audio = new Audio(file);
	audio.loop = repeat;

	// Track instance
	if (!audioInstances.has(soundId)) {
		audioInstances.set(soundId, []);
	}
	audioInstances.get(soundId)!.push(audio);

	playingIds.update((ids) => {
		const next = new Set(ids);
		next.add(soundId);
		return next;
	});

	audio.addEventListener('ended', () => {
		removeInstance(soundId, audio);
	});

	audio.addEventListener('error', () => {
		removeInstance(soundId, audio);
	});

	audio.play().catch(() => {
		removeInstance(soundId, audio);
	});
}

export function stop(soundId: string) {
	const list = audioInstances.get(soundId);
	if (list) {
		// copy to avoid mutation during iteration
		[...list].forEach((audio) => {
			audio.pause();
			audio.currentTime = 0;
			removeInstance(soundId, audio);
		});
	}
}

export function stopAll() {
	audioInstances.forEach((list, id) => {
		[...list].forEach((audio) => {
			audio.pause();
			audio.currentTime = 0;
		});
		audioInstances.delete(id);
	});
	playingIds.set(new Set());
}

export function isPlaying(soundId: string): boolean {
	return get(playingIds).has(soundId);
}

export function toggleRepeat() {
	repeatMode.update((v) => !v);
}

// When repeat mode changes, update all currently playing audio loops
repeatMode.subscribe((repeat) => {
	audioInstances.forEach((list) => {
		list.forEach((audio) => {
			audio.loop = repeat;
		});
	});
});
