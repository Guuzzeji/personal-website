import type { MorphDirection, MorphPhase } from './types';

export interface MorphStore {
	readonly state: {
		readonly phase: MorphPhase;
		readonly direction: MorphDirection;
		readonly progress: number;
		readonly charCount: number;
		readonly error: string | null;
	};
	readonly isAnimating: boolean;
	readonly isSphere: boolean;
	readonly isIdle: boolean;
	startForward(): void;
	startReverse(): void;
	setPhase(phase: MorphPhase): void;
	setProgress(p: number): void;
	reset(): void;
	setError(msg: string): void;
}

export function createMorphStore(): MorphStore {
	const state = $state<{
		phase: MorphPhase;
		direction: MorphDirection;
		progress: number;
		charCount: number;
		error: string | null;
	}>({
		phase: 'idle',
		direction: 'forward',
		progress: 0,
		charCount: 0,
		error: null
	});

	return {
		get state() {
			return state;
		},

		get isAnimating() {
			return (
				state.phase === 'extracting' ||
				state.phase === 'generating-atlas' ||
				state.phase === 'animating'
			);
		},

		get isSphere() {
			return state.phase === 'sphere';
		},

		get isIdle() {
			return state.phase === 'idle';
		},

		startForward() {
			state.direction = 'forward';
			state.phase = 'extracting';
			state.error = null;
		},

		startReverse() {
			state.direction = 'reverse';
			state.phase = 'reversing';
			state.error = null;
		},

		setPhase(phase: MorphPhase) {
			state.phase = phase;
		},

		setProgress(p: number) {
			state.progress = Math.max(0, Math.min(1, p));
		},

		reset() {
			state.phase = 'idle';
			state.direction = 'forward';
			state.progress = 0;
			state.charCount = 0;
			state.error = null;
		},

		setError(msg: string) {
			state.error = msg;
		}
	};
}
