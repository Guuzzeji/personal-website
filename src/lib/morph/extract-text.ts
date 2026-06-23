import type { CharacterData, ExtractionOptions } from './types';
import { domToWebGL, getViewportDimensions } from './coordinates';

const DEFAULT_MAX_CHARS = 200;

const SKIP_TAGS = new Set(['script', 'style', 'svg', 'noscript', 'template']);

/**
 * Check whether a text node is inside a visible, non-skippable element.
 * Walks ancestor chain and rejects nodes inside hidden/script/style/svg elements.
 */
function isTextNodeVisible(node: Text): boolean {
	let el: Node | null = node.parentElement;
	while (el) {
		if (el.nodeType !== Node.ELEMENT_NODE) {
			el = el.parentNode;
			continue;
		}
		const elem = el as Element;
		const tag = elem.tagName.toLowerCase();

		if (SKIP_TAGS.has(tag)) return false;
		if (elem.getAttribute('aria-hidden') === 'true') return false;
		if (elem.hasAttribute('hidden')) return false;

		try {
			const style = window.getComputedStyle(elem);
			if (style.display === 'none' || style.visibility === 'hidden') return false;
		} catch {
			// jsdom may not support getComputedStyle; allow through
		}

		el = el.parentNode;
	}
	return true;
}

/**
 * Assign a priority score to a text node based on the extraction strategy.
 * Higher scores are extracted first.
 */
function getNodePriority(
	node: Text,
	strategy: ExtractionOptions['priority'],
): number {
	let score = 0;
	let el: Node | null = node.parentElement;

	while (el && el.nodeType === Node.ELEMENT_NODE) {
		const elem = el as Element;
		const tag = elem.tagName.toLowerCase();

		if (strategy === 'headings' || strategy === 'hero') {
			if (tag === 'h1') score += 100;
			else if (tag === 'h2') score += 80;
			else if (tag === 'h3') score += 60;
			else if (tag === 'h4') score += 40;
			else if (tag === 'h5') score += 20;
			else if (tag === 'h6') score += 10;
		}

		if (strategy === 'hero') {
			if (
				tag === 'header' ||
				tag === 'main' ||
				elem.id === 'hero' ||
				elem.classList.contains('hero')
			) {
				score += 50;
			}
		}

		el = el.parentNode;
	}

	return score;
}

/**
 * Extract up to `maxChars` character measurements from a single text node.
 * Temporarily wraps non-whitespace chars in <span class="measure-char">,
 * measures their bounding rects, converts to WebGL coords, then cleans up.
 */
function extractFromTextNode(
	textNode: Text,
	maxChars: number,
	vw: number,
	vh: number,
	dpr: number,
): CharacterData[] {
	const raw = textNode.textContent ?? '';
	const parent = textNode.parentNode;
	if (!parent || maxChars <= 0) return [];

	const codepoints = [...raw];
	const fragment = document.createDocumentFragment();
	let measured = 0;

	for (let i = 0; i < codepoints.length; i++) {
		const ch = codepoints[i];
		if (/\s/.test(ch)) {
			fragment.appendChild(document.createTextNode(ch));
		} else if (measured < maxChars) {
			const span = document.createElement('span');
			span.className = 'measure-char';
			span.textContent = ch;
			fragment.appendChild(span);
			measured++;
		} else {
			fragment.appendChild(document.createTextNode(codepoints.slice(i).join('')));
			break;
		}
	}

	parent.replaceChild(fragment, textNode);

	const chars: CharacterData[] = [];
	const spans = parent.querySelectorAll<HTMLSpanElement>('.measure-char');

	for (const span of spans) {
		const rect = span.getBoundingClientRect();
		const webgl = domToWebGL(rect.left, rect.top, vw, vh, dpr);
		chars.push({
			char: span.textContent ?? '',
			x: webgl.x,
			y: webgl.y,
			width: ((rect.width * dpr) / vw) * 2,
			height: ((rect.height * dpr) / vh) * 2,
		});
	}

	const cleanupSpans = parent.querySelectorAll<HTMLSpanElement>('.measure-char');
	for (const span of cleanupSpans) {
		const replacement = document.createTextNode(span.textContent ?? '');
		span.parentNode?.replaceChild(replacement, span);
	}

	return chars;
}

/**
 * Extract visible text character coordinates from a DOM container for WebGL rendering.
 *
 * Traverses all visible text nodes in the container, temporarily wraps each
 * non-whitespace character in a measurement span, captures its bounding rect,
 * converts to WebGL clip-space coordinates, and then cleans up all measurement
 * spans — leaving the DOM unchanged.
 *
 * @param container  The root DOM element to extract text from.
 * @param options    maxChars (default 200) and priority strategy.
 * @returns          Array of character data with WebGL coordinates.
 */
export function extractTextCoordinates(
	container: HTMLElement,
	options?: ExtractionOptions,
): CharacterData[] {
	const maxChars = options?.maxChars ?? DEFAULT_MAX_CHARS;
	const strategy = options?.priority ?? 'body';

	const { width: vw, height: vh, dpr } = getViewportDimensions();
	if (vw === 0 || vh === 0) return [];

	const candidates: Array<{ node: Text; priority: number }> = [];
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);

	while (walker.nextNode()) {
		const node = walker.currentNode as Text;
		const text = node.textContent;
		if (!text || !text.trim()) continue;
		if (!isTextNodeVisible(node)) continue;

		candidates.push({ node, priority: getNodePriority(node, strategy) });
	}

	candidates.sort((a, b) => b.priority - a.priority);

	const results: CharacterData[] = [];

	for (const { node } of candidates) {
		if (results.length >= maxChars) break;
		const remaining = maxChars - results.length;
		const chars = extractFromTextNode(node, remaining, vw, vh, dpr);
		results.push(...chars);
	}

	return results;
}
