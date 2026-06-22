import type { AtlasGlyph } from './types';

function nextPow2(n: number): number {
	let v = 1;
	while (v < n) v <<= 1;
	return v;
}

export interface FontAtlasResult {
	canvas: HTMLCanvasElement;
	glyphs: Map<string, AtlasGlyph>;
}

/**
 * Generate a runtime canvas-based font sprite sheet atlas.
 *
 * Renders each character as white text on a transparent background,
 * packed into a computed row-major grid. Returns a Map of
 * char → AtlasGlyph with UV coordinates normalized to [0, 1].
 *
 * @param chars     Array of characters to include in the atlas
 * @param fontSize  Font size in pixels
 * @param fontFamily CSS font-family string (defaults to project display stack)
 */
export async function generateFontAtlas(
	chars: string[],
	fontSize: number,
	fontFamily: string = 'Inter Display, system-ui, sans-serif',
): Promise<FontAtlasResult> {
	if (typeof document === 'undefined') {
		throw new Error('generateFontAtlas requires a DOM environment');
	}

	if (document.fonts?.ready) {
		await document.fonts.ready;
	}

	const font = `${fontSize}px ${fontFamily}`;
	const measurer = document.createElement('canvas');
	const mCtx = measurer.getContext('2d')!;
	mCtx.font = font;

	const metrics: { char: string; width: number }[] = [];
	let maxW = 0;
	const fallbackChar = '□';

	for (const char of chars) {
		let renderChar = char;

		// detect unsupported glyphs via the FontFaceSet API when available
		if (document.fonts?.check && char !== ' ') {
			const supported = document.fonts.check(`16px "${fontFamily}"`, char);
			if (!supported) {
				renderChar = fallbackChar;
			}
		}

		const w = mCtx.measureText(renderChar).width;
		const usedW = w > 0 ? w : mCtx.measureText(fallbackChar).width;
		if (usedW > maxW) maxW = usedW;
		metrics.push({ char: renderChar, width: usedW });
	}

	const padH = Math.ceil(fontSize * 0.1);
	const padV = Math.ceil(fontSize * 0.1);
	const cellW = Math.ceil(maxW) + padH * 2;
	const cellH = Math.ceil(fontSize * 1.2) + padV * 2;

	const n = chars.length;
	if (n === 0) {
		// empty atlas (1×1 transparent pixel)
		const canvas = document.createElement('canvas');
		canvas.width = 1;
		canvas.height = 1;
		return { canvas, glyphs: new Map() };
	}

	const cols = Math.max(1, Math.ceil(Math.sqrt(n * (cellW / cellH))));
	const rows = Math.ceil(n / cols);

	const canvasW = nextPow2(cols * cellW);
	const canvasH = nextPow2(rows * cellH);

	const canvas = document.createElement('canvas');
	canvas.width = canvasW;
	canvas.height = canvasH;
	const ctx = canvas.getContext('2d')!;

	ctx.font = font;
	ctx.fillStyle = '#ffffff';
	ctx.textBaseline = 'top';

	const glyphs = new Map<string, AtlasGlyph>();

	for (let i = 0; i < n; i++) {
		const { char: drawChar } = metrics[i];
		const originalChar = chars[i];

		const col = i % cols;
		const row = Math.floor(i / cols);

		const cellX = col * cellW;
		const cellY = row * cellH;

		// only render visible glyphs (skip space, but still allocate UV slot)
		if (originalChar !== ' ') {
			const textX = cellX + padH;
			const textY = cellY + padV;
			ctx.fillText(drawChar, textX, textY);
		}

		glyphs.set(originalChar, {
			char: originalChar,
			u: cellX / canvasW,
			v: cellY / canvasH,
			width: cellW / canvasW,
			height: cellH / canvasH,
		});
	}

	return { canvas, glyphs };
}
