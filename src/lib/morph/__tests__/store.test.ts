import { describe, it, expect } from 'vitest';
import { createMorphStore } from '../store.svelte';

describe('createMorphStore', () => {
	it('should have correct initial state', () => {
		const store = createMorphStore();
		expect(store.state.phase).toBe('idle');
		expect(store.state.direction).toBe('forward');
		expect(store.state.progress).toBe(0);
		expect(store.state.charCount).toBe(0);
		expect(store.state.error).toBeNull();
	});

	it('should report isIdle initially', () => {
		const store = createMorphStore();
		expect(store.isIdle).toBe(true);
		expect(store.isAnimating).toBe(false);
		expect(store.isSphere).toBe(false);
	});

	it('should transition correctly on startForward', () => {
		const store = createMorphStore();
		store.startForward();
		expect(store.state.direction).toBe('forward');
		expect(store.state.phase).toBe('extracting');
		expect(store.state.error).toBeNull();
		expect(store.isIdle).toBe(false);
		expect(store.isAnimating).toBe(true);
	});

	it('should transition correctly on startReverse from sphere', () => {
		const store = createMorphStore();
		// simulate being in sphere phase
		store.startForward();
		store.setPhase('sphere');
		expect(store.isSphere).toBe(true);

		store.startReverse();
		expect(store.state.direction).toBe('reverse');
		expect(store.state.phase).toBe('reversing');
		expect(store.state.error).toBeNull();
		expect(store.isSphere).toBe(false);
	});

	it('should set phase correctly', () => {
		const store = createMorphStore();
		store.setPhase('generating-atlas');
		expect(store.state.phase).toBe('generating-atlas');
		store.setPhase('ready');
		expect(store.state.phase).toBe('ready');
	});

	it('should clamp progress to [0, 1]', () => {
		const store = createMorphStore();
		store.setProgress(0.5);
		expect(store.state.progress).toBe(0.5);

		store.setProgress(1.5);
		expect(store.state.progress).toBe(1);

		store.setProgress(-0.1);
		expect(store.state.progress).toBe(0);
	});

	it('should reset to initial state', () => {
		const store = createMorphStore();
		store.startForward();
		store.setProgress(0.75);
		store.setPhase('sphere');
		store.setError('something went wrong');

		store.reset();
		expect(store.state.phase).toBe('idle');
		expect(store.state.direction).toBe('forward');
		expect(store.state.progress).toBe(0);
		expect(store.state.charCount).toBe(0);
		expect(store.state.error).toBeNull();
	});

	it('should set and clear error', () => {
		const store = createMorphStore();
		store.setError('an error occurred');
		expect(store.state.error).toBe('an error occurred');

		store.reset();
		expect(store.state.error).toBeNull();
	});
});
