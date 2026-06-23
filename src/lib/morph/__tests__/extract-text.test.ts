import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { extractTextCoordinates } from '../extract-text';
import type { CharacterData } from '../types';

function createContainer(html: string): HTMLElement {
	document.body.innerHTML = html;
	const container = document.createElement('div');
	container.id = 'test-container';
	container.innerHTML = html;
	document.body.appendChild(container);
	return container;
}

function cleanupContainer() {
	const el = document.getElementById('test-container');
	if (el) el.remove();
}

beforeEach(() => {
	vi.stubGlobal('window', {
		innerWidth: 1920,
		innerHeight: 1080,
		devicePixelRatio: 1,
	});
});

afterEach(() => {
	cleanupContainer();
	vi.unstubAllGlobals();
});

describe('extractTextCoordinates', () => {
	it('extracts characters from simple text', () => {
		const container = createContainer('<p>Hi</p>');
		const results = extractTextCoordinates(container, { maxChars: 10 });

		expect(results.length).toBe(2);
		expect(results[0].char).toBe('H');
		expect(results[1].char).toBe('i');
	});

	it('extracts characters from nested HTML', () => {
		const container = createContainer(
			'<div><p>Hello <strong>World</strong></p></div>',
		);
		const results = extractTextCoordinates(container, { maxChars: 20 });

		const chars = results.map((c) => c.char).join('');
		expect(chars).toBe('HelloWorld');
		expect(results.length).toBe(10);
	});

	it('respects maxChars option', () => {
		const container = createContainer('<p>abcdefghij</p>');
		const results = extractTextCoordinates(container, { maxChars: 5 });

		expect(results.length).toBeLessThanOrEqual(5);
		expect(results.map((c) => c.char).join('')).toBe('abcde');
	});

	it('uses default maxChars of 200', () => {
		const container = createContainer(
			`<p>${'x'.repeat(300)}</p>`,
		);
		const results = extractTextCoordinates(container);

		expect(results.length).toBeLessThanOrEqual(200);
	});

	it('returns coordinates in WebGL [-1, 1] range', () => {
		const container = createContainer('<p>A</p>');
		const results = extractTextCoordinates(container);

		expect(results.length).toBeGreaterThan(0);
		for (const c of results) {
			expect(c.x).toBeGreaterThanOrEqual(-1);
			expect(c.x).toBeLessThanOrEqual(1);
			expect(c.y).toBeGreaterThanOrEqual(-1);
			expect(c.y).toBeLessThanOrEqual(1);
			expect(c.width).toBeGreaterThanOrEqual(0);
			expect(c.height).toBeGreaterThanOrEqual(0);
		}
	});

	it('leaves no .measure-char spans in the DOM', () => {
		const container = createContainer('<p>Hello World</p>');
		extractTextCoordinates(container);

		const spans = container.querySelectorAll('.measure-char');
		expect(spans.length).toBe(0);
	});

	it('handles whitespace correctly (does not measure it)', () => {
		const container = createContainer('<p>A B C</p>');
		const results = extractTextCoordinates(container, { maxChars: 10 });

		const chars = results.map((c) => c.char);
		expect(chars).not.toContain(' ');
		expect(chars).toEqual(['A', 'B', 'C']);
	});

	it('handles newlines and tabs as whitespace', () => {
		const container = createContainer('<pre>A\tB\nC</pre>');
		const results = extractTextCoordinates(container, { maxChars: 10 });

		expect(results.map((c) => c.char)).toEqual(['A', 'B', 'C']);
	});

	it('skips text inside script and style elements', () => {
		const container = createContainer(
			'<p>Hi</p><script>var x = 1;</script><style>body{}</style>',
		);
		const results = extractTextCoordinates(container);

		const chars = results.map((c) => c.char).join('');
		expect(chars).not.toContain('var');
		expect(chars).not.toContain('body');
		expect(chars).toContain('Hi');
	});

	it('skips elements with aria-hidden="true"', () => {
		const container = createContainer(
			'<p>Visible</p><p aria-hidden="true">Hidden</p>',
		);
		const results = extractTextCoordinates(container);

		const chars = results.map((c) => c.char).join('');
		expect(chars).toContain('Visible');
		expect(chars).not.toContain('Hidden');
	});

	it('skips elements with hidden attribute', () => {
		const container = createContainer(
			'<p>Visible</p><p hidden>Hidden</p>',
		);
		const results = extractTextCoordinates(container);

		const chars = results.map((c) => c.char).join('');
		expect(chars).toContain('Visible');
		expect(chars).not.toContain('Hidden');
	});

	it('returns CharacterData with correct shape', () => {
		const container = createContainer('<p>X</p>');
		const results = extractTextCoordinates(container);

		expect(results.length).toBe(1);
		const cd: CharacterData = results[0];
		expect(cd.char).toBe('X');
		expect(typeof cd.x).toBe('number');
		expect(typeof cd.y).toBe('number');
		expect(typeof cd.width).toBe('number');
		expect(typeof cd.height).toBe('number');
	});

	it('returns empty array for empty container', () => {
		const container = createContainer('<div></div>');
		const results = extractTextCoordinates(container);
		expect(results).toEqual([]);
	});

	it('returns empty array for whitespace-only container', () => {
		const container = createContainer('<div>   \n\t  </div>');
		const results = extractTextCoordinates(container);
		expect(results).toEqual([]);
	});

	it('preserves DOM text content after extraction', () => {
		const container = createContainer('<p>Hello World</p>');
		extractTextCoordinates(container);

		const p = container.querySelector('p');
		expect(p?.textContent).toBe('Hello World');
	});

	it('preserves nested structure after extraction', () => {
		const container = createContainer(
			'<div><h1>Title</h1><p>Body <em>text</em></p></div>',
		);
		extractTextCoordinates(container);

		expect(container.querySelector('h1')?.textContent).toBe('Title');
		expect(container.querySelector('em')?.textContent).toBe('text');
		expect(container.querySelector('p')?.textContent).toBe('Body text');
	});

	it('handles headings priority strategy', () => {
		const container = createContainer(
			'<div><p>body text first</p><h1>heading text</h1></div>',
		);
		const results = extractTextCoordinates(container, {
			maxChars: 7,
			priority: 'headings',
		});

		const chars = results.map((c) => c.char).join('');
		expect(chars).toBe('heading');
	});

	it('handles Chinese characters', () => {
		const container = createContainer('<p>你好世界</p>');
		const results = extractTextCoordinates(container, { maxChars: 10 });

		expect(results.length).toBe(4);
		expect(results.map((c) => c.char)).toEqual(['你', '好', '世', '界']);
	});

	it('handles emoji characters', () => {
		const container = createContainer('<p>👋🌍</p>');
		const results = extractTextCoordinates(container, { maxChars: 10 });

		expect(results.length).toBe(2);
	});

	it('handles mixed whitespace in text node', () => {
		const container = createContainer('<p>  Hello   World  </p>');
		const results = extractTextCoordinates(container, { maxChars: 20 });

		expect(results.map((c) => c.char).join('')).toBe('HelloWorld');
	});

	it('SSR-safe: returns empty array when viewport is zero', () => {
		vi.stubGlobal('window', {
			innerWidth: 0,
			innerHeight: 0,
			devicePixelRatio: 1,
		});

		const container = createContainer('<p>Should not extract</p>');
		const results = extractTextCoordinates(container);
		expect(results).toEqual([]);
	});
});
