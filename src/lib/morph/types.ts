export interface CharacterData {
	char: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface AtlasGlyph {
	char: string;
	u: number;
	v: number;
	width: number;
	height: number;
}

export type MorphDirection = 'forward' | 'reverse';

export type MorphPhase =
	| 'idle'
	| 'extracting'
	| 'generating-atlas'
	| 'ready'
	| 'animating'
	| 'sphere'
	| 'reversing';

export interface MorphState {
	direction: MorphDirection;
	phase: MorphPhase;
	progress: number;
	charCount: number;
}

export interface ViewportSection {
	id: string;
	visible: boolean;
}

export interface ExtractionOptions {
	maxChars?: number;
	priority?: 'hero' | 'headings' | 'body';
}
