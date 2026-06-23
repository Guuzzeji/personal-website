import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ShaderMaterial } from 'three';

const vertexSrc = readFileSync(
	resolve(import.meta.dirname, '../shaders/vertex.glsl'),
	'utf-8',
);
const fragmentSrc = readFileSync(
	resolve(import.meta.dirname, '../shaders/fragment.glsl'),
	'utf-8',
);

const requiredVertexKeywords = [
	'a_initialPosition',
	'a_targetPosition',
	'a_uvOffset',
	'u_progress',
	'projectionMatrix',
	'modelViewMatrix',
	'mix',
	'gl_Position',
	'v_uv',
	'v_uvOffset',
];

const requiredFragmentKeywords = [
	'u_texture',
	'texture2D',
	'v_uv',
	'v_uvOffset',
	'discard',
	'gl_FragColor',
];

describe('vertex.glsl', () => {
	it('is non-empty', () => {
		expect(vertexSrc.length).toBeGreaterThan(0);
	});

	for (const keyword of requiredVertexKeywords) {
		it(`contains keyword: ${keyword}`, () => {
			expect(vertexSrc).toContain(keyword);
		});
	}
});

describe('fragment.glsl', () => {
	it('is non-empty', () => {
		expect(fragmentSrc.length).toBeGreaterThan(0);
	});

	for (const keyword of requiredFragmentKeywords) {
		it(`contains keyword: ${keyword}`, () => {
			expect(fragmentSrc).toContain(keyword);
		});
	}
});

describe('ShaderMaterial construction', () => {
	it('creates without errors using vertex and fragment sources', () => {
		const material = new ShaderMaterial({
			vertexShader: vertexSrc,
			fragmentShader: fragmentSrc,
			uniforms: {
				u_progress: { value: 0 },
				u_texture: { value: null },
			},
		});

		expect(material).toBeInstanceOf(ShaderMaterial);
		expect(material.vertexShader).toBe(vertexSrc);
		expect(material.fragmentShader).toBe(fragmentSrc);
		expect(material.uniforms.u_progress).toBeDefined();
		expect(material.uniforms.u_texture).toBeDefined();
	});
});
