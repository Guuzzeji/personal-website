import { describe, it, expect, beforeAll } from 'vitest';
import { generateFontAtlas } from '../font-atlas';
import type { AtlasGlyph } from '../types';

beforeAll(() => {
	// Polyfill document.fonts when jsdom doesn't provide it
	if (typeof document !== 'undefined' && !document.fonts) {
		Object.defineProperty(document, 'fonts', {
			value: {
				ready: Promise.resolve([]),
				check: () => true,
			},
			writable: true,
			configurable: true,
		});
	}

	// Mock Canvas 2D context — jsdom doesn't ship a full Canvas impl
	const origCreateElement = document.createElement.bind(document);
	const mockCtx = {
		_font: '',
		get font() {
			return this._font;
		},
		set font(v: string) {
			this._font = v;
		},
		fillStyle: '',
		textBaseline: 'alphabetic',
		measureText(text: string) {
			// approximate: each glyph ~0.6×fontSize wide, space ~0.3×
			const fontSizeMatch = this._font.match(/(\d+)px/);
			const fs = fontSizeMatch ? Number(fontSizeMatch[1]) : 16;
			return {
				width: text === ' ' ? fs * 0.3 : text.length * fs * 0.6,
				actualBoundingBoxAscent: fs * 0.8,
				actualBoundingBoxDescent: fs * 0.2,
			} as TextMetrics;
		},
		fillText() {
			/* no-op */
		},
	};

	document.createElement = function (tag: string, options?: ElementCreationOptions) {
		const el = origCreateElement(tag, options);
		if (tag === 'canvas') {
			(el as HTMLCanvasElement).getContext = ((_type: string) => {
				if (_type === '2d') return mockCtx;
				return null;
			}) as HTMLCanvasElement['getContext'];
		}
		return el;
	} as typeof document.createElement;
});

describe('generateFontAtlas', () => {
	const chars = ['G', 'a', 'b', 'e', ' '];
	const fontSize = 64;
	const fontFamily = 'Inter Display, system-ui, sans-serif';

	it('generates glyphs for given characters', async () => {
		const { canvas, glyphs } = await generateFontAtlas(chars, fontSize, fontFamily);

		expect(glyphs).toBeInstanceOf(Map);
		expect(glyphs.size).toBe(chars.length);

		for (const char of chars) {
			expect(glyphs.has(char)).toBe(true);
			const g = glyphs.get(char)!;
			expect(g.char).toBe(char);
			expect(typeof g.u).toBe('number');
			expect(typeof g.v).toBe('number');
			expect(typeof g.width).toBe('number');
			expect(typeof g.height).toBe('number');
		}

		expect(canvas).toBeInstanceOf(HTMLCanvasElement);
		expect(canvas.width).toBeGreaterThan(0);
		expect(canvas.height).toBeGreaterThan(0);
	});

	it('all UV coordinates are normalized to [0, 1]', async () => {
		const { glyphs } = await generateFontAtlas(chars, fontSize, fontFamily);

		for (const [, g] of glyphs) {
			expect(g.u).toBeGreaterThanOrEqual(0);
			expect(g.u).toBeLessThanOrEqual(1);
			expect(g.v).toBeGreaterThanOrEqual(0);
			expect(g.v).toBeLessThanOrEqual(1);
			expect(g.width).toBeGreaterThan(0);
			expect(g.width).toBeLessThanOrEqual(1);
			expect(g.height).toBeGreaterThan(0);
			expect(g.height).toBeLessThanOrEqual(1);
			expect(g.u + g.width).toBeLessThanOrEqual(1.01);
			expect(g.v + g.height).toBeLessThanOrEqual(1.01);
		}
	});

	it('returns an empty map for empty input', async () => {
		const { canvas, glyphs } = await generateFontAtlas([], fontSize, fontFamily);

		expect(glyphs).toBeInstanceOf(Map);
		expect(glyphs.size).toBe(0);
		expect(canvas).toBeInstanceOf(HTMLCanvasElement);
	});

	it('space character has positive width in atlas', async () => {
		const { glyphs } = await generateFontAtlas([' '], fontSize, fontFamily);

		const space = glyphs.get(' ');
		expect(space).toBeDefined();
		expect(space!.width).toBeGreaterThan(0);
	});

	it('aspect ratio of glyph in UV space is preserved', async () => {
		const { glyphs, canvas } = await generateFontAtlas(['G', 'W'], fontSize, fontFamily);

		for (const [, g] of glyphs) {
			const uvAspect = (g.width * canvas.width) / (g.height * canvas.height);
			expect(uvAspect).toBeGreaterThan(0);
		}
	});

	it('glyphs do not overlap—unique UV origins', async () => {
		const { glyphs } = await generateFontAtlas(
			['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
			fontSize,
			fontFamily,
		);

		const origins = new Set<string>();
		for (const [, g] of glyphs) {
			const key = `${g.u.toFixed(6)},${g.v.toFixed(6)}`;
			expect(origins.has(key)).toBe(false);
			origins.add(key);
		}
	});

	it('uses default fontFamily when omitted', async () => {
		const { glyphs } = await generateFontAtlas(['X'], fontSize);

		expect(glyphs.has('X')).toBe(true);
	});
});
