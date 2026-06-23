import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createViewportTracker } from '../viewport-tracker';

describe('createViewportTracker', () => {
	let intersectionCallback: IntersectionObserverCallback;
	let mockObserve: ReturnType<typeof vi.fn>;
	let mockDisconnect: ReturnType<typeof vi.fn>;
	let MockIO: ReturnType<typeof vi.fn>;
	let heroEl: HTMLElement;
	let aboutEl: HTMLElement;

	beforeEach(() => {
		heroEl = document.createElement('section');
		heroEl.id = 'hero';
		document.body.appendChild(heroEl);

		aboutEl = document.createElement('section');
		aboutEl.id = 'about';
		document.body.appendChild(aboutEl);

		mockObserve = vi.fn();
		mockDisconnect = vi.fn();

		MockIO = vi.fn(function (callback: IntersectionObserverCallback) {
			intersectionCallback = callback;
			return {
				observe: mockObserve,
				disconnect: mockDisconnect,
				unobserve: vi.fn(),
			};
		});

		vi.stubGlobal('IntersectionObserver', MockIO);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		document.body.innerHTML = '';
	});

	it('should detect visible sections', () => {
		const tracker = createViewportTracker(['hero', 'about']);
		tracker.observe();

		intersectionCallback(
			[{ target: heroEl, isIntersecting: true } as IntersectionObserverEntry],
			null as unknown as IntersectionObserver,
		);

		expect(tracker.visibleSections).toContain('hero');
		expect(tracker.visibleSections).not.toContain('about');
	});

	it('should track multiple visible sections', () => {
		const tracker = createViewportTracker(['hero', 'about']);
		tracker.observe();

		intersectionCallback(
			[{ target: heroEl, isIntersecting: true } as IntersectionObserverEntry],
			null as unknown as IntersectionObserver,
		);
		intersectionCallback(
			[{ target: aboutEl, isIntersecting: true } as IntersectionObserverEntry],
			null as unknown as IntersectionObserver,
		);

		expect(tracker.visibleSections).toContain('hero');
		expect(tracker.visibleSections).toContain('about');
	});

	it('should remove sections that exit viewport', () => {
		const tracker = createViewportTracker(['hero']);
		tracker.observe();

		intersectionCallback(
			[{ target: heroEl, isIntersecting: true } as IntersectionObserverEntry],
			null as unknown as IntersectionObserver,
		);
		expect(tracker.visibleSections).toContain('hero');

		intersectionCallback(
			[{ target: heroEl, isIntersecting: false } as IntersectionObserverEntry],
			null as unknown as IntersectionObserver,
		);
		expect(tracker.visibleSections).not.toContain('hero');
	});

	it('should not add duplicate entries', () => {
		const tracker = createViewportTracker(['hero']);
		tracker.observe();

		intersectionCallback(
			[{ target: heroEl, isIntersecting: true } as IntersectionObserverEntry],
			null as unknown as IntersectionObserver,
		);
		intersectionCallback(
			[{ target: heroEl, isIntersecting: true } as IntersectionObserverEntry],
			null as unknown as IntersectionObserver,
		);

		expect(tracker.visibleSections).toEqual(['hero']);
	});

	it('should call observe for each section element', () => {
		createViewportTracker(['hero', 'about']).observe();

		expect(mockObserve).toHaveBeenCalledWith(heroEl);
		expect(mockObserve).toHaveBeenCalledWith(aboutEl);
	});

	it('should handle missing elements gracefully', () => {
		const tracker = createViewportTracker(['nonexistent']);
		expect(() => tracker.observe()).not.toThrow();
		expect(mockObserve).not.toHaveBeenCalled();
	});

	it('should disconnect and stop observation', () => {
		const tracker = createViewportTracker(['hero']);
		tracker.observe();
		tracker.disconnect();

		expect(mockDisconnect).toHaveBeenCalled();
	});

	it('should use threshold [0, 0.1]', () => {
		createViewportTracker(['hero']).observe();

		expect(MockIO).toHaveBeenCalledWith(expect.any(Function), {
			threshold: [0, 0.1],
		});
	});
});
