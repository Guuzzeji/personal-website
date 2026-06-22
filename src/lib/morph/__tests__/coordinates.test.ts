import { describe, it, expect, vi, afterEach } from 'vitest';
import { domToWebGL, getViewportDimensions } from '../coordinates';

describe('domToWebGL', () => {
	it('should map viewport center to (0, 0) with dpr=1', () => {
		const result = domToWebGL(960, 540, 1920, 1080, 1);
		expect(result.x).toBeCloseTo(0, 10);
		expect(result.y).toBeCloseTo(0, 10);
		expect(result.z).toBe(0);
	});

	it('should map top-left corner to (-1, 1)', () => {
		const result = domToWebGL(0, 0, 1920, 1080, 1);
		expect(result.x).toBeCloseTo(-1, 10);
		expect(result.y).toBeCloseTo(1, 10);
	});

	it('should map bottom-right corner to (1, -1)', () => {
		const result = domToWebGL(1920, 1080, 1920, 1080, 1);
		expect(result.x).toBeCloseTo(1, 10);
		expect(result.y).toBeCloseTo(-1, 10);
	});

	it('should apply devicePixelRatio scaling', () => {
		const dpr1 = domToWebGL(960, 540, 1920, 1080, 1);
		expect(dpr1.x).toBeCloseTo(0, 10);

		const dpr2 = domToWebGL(960, 540, 1920, 1080, 2);
		expect(dpr2.x).toBeCloseTo(1, 10);
		expect(dpr2.y).toBeCloseTo(-1, 10);
	});

	it('should map (0, 0) to (-1, 1) regardless of dpr', () => {
		const r1 = domToWebGL(0, 0, 1920, 1080, 1);
		const r2 = domToWebGL(0, 0, 1920, 1080, 3);
		expect(r1.x).toBeCloseTo(-1, 10);
		expect(r1.y).toBeCloseTo(1, 10);
		expect(r2.x).toBeCloseTo(-1, 10);
		expect(r2.y).toBeCloseTo(1, 10);
	});

	it('should return values in [-1, 1] for coordinates within viewport', () => {
		const points = [
			[320, 180],
			[960, 540],
			[1600, 900],
			[0, 540],
			[1920, 540],
			[960, 0],
			[960, 1080],
		];
		for (const [x, y] of points) {
			const result = domToWebGL(x, y, 1920, 1080, 1);
			expect(Math.abs(result.x)).toBeLessThanOrEqual(1);
			expect(Math.abs(result.y)).toBeLessThanOrEqual(1);
		}
	});
});

describe('getViewportDimensions', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('should return window dimensions and devicePixelRatio', () => {
		vi.stubGlobal('window', {
			innerWidth: 1920,
			innerHeight: 1080,
			devicePixelRatio: 2,
		});

		const dims = getViewportDimensions();
		expect(dims).toEqual({ width: 1920, height: 1080, dpr: 2 });
	});

	it('should return zeros and dpr=1 when window is undefined (SSR)', () => {
		vi.stubGlobal('window', undefined);

		const dims = getViewportDimensions();
		expect(dims).toEqual({ width: 0, height: 0, dpr: 1 });
	});
});
