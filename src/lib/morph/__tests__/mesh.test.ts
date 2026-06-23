import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import {
	createInstancedMesh,
	updateInstanceBuffers,
	updateBillboardMatrices,
} from '../mesh';
import type { AtlasGlyph } from '../types';

function atlasTexture(): THREE.Texture {
	const canvas = { width: 256, height: 256, getContext: () => null } as unknown as HTMLCanvasElement;
	return new THREE.CanvasTexture(canvas);
}

function shaderMaterial(): THREE.ShaderMaterial {
	return new THREE.ShaderMaterial({
		vertexShader: 'void main() { gl_Position = vec4(0.0); }',
		fragmentShader: 'void main() { gl_FragColor = vec4(1.0); }',
		uniforms: {
			u_progress: { value: 0 },
			u_texture: { value: null },
		},
	});
}

describe('createInstancedMesh', () => {
	it('returns an InstancedMesh with the correct count', () => {
		const mesh = createInstancedMesh(10, atlasTexture(), shaderMaterial());
		expect(mesh).toBeInstanceOf(THREE.InstancedMesh);
		expect(mesh.count).toBe(10);
	});

	it('uses PlaneGeometry(1,1)', () => {
		const mesh = createInstancedMesh(5, atlasTexture(), shaderMaterial());
		expect(mesh.geometry).toBeInstanceOf(THREE.PlaneGeometry);
		const posAttr = mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
		expect(posAttr.count).toBeGreaterThanOrEqual(4);
		const xs = new Set<number>();
		const ys = new Set<number>();
		for (let i = 0; i < posAttr.count; i++) {
			xs.add(posAttr.getX(i));
			ys.add(posAttr.getY(i));
		}
		expect(xs.has(0.5)).toBe(true);
		expect(xs.has(-0.5)).toBe(true);
		expect(ys.has(0.5)).toBe(true);
		expect(ys.has(-0.5)).toBe(true);
	});

	it('binds atlas texture to shader material u_texture uniform', () => {
		const tex = atlasTexture();
		const mat = shaderMaterial();
		const mesh = createInstancedMesh(3, tex, mat);
		expect(mat.uniforms.u_texture.value).toBe(tex);
	});

	it('sets DynamicDrawUsage on instanceMatrix', () => {
		const mesh = createInstancedMesh(3, atlasTexture(), shaderMaterial());
		expect(mesh.instanceMatrix.usage).toBe(THREE.DynamicDrawUsage);
	});

	it('handles zero count gracefully', () => {
		const mesh = createInstancedMesh(0, atlasTexture(), shaderMaterial());
		expect(mesh.count).toBe(0);
		expect(mesh).toBeInstanceOf(THREE.InstancedMesh);
	});
});

describe('updateInstanceBuffers', () => {
	const count = 4;

	function makeMesh(): THREE.InstancedMesh {
		return createInstancedMesh(count, atlasTexture(), shaderMaterial());
	}

	it('sets a_initialPosition with itemSize 3', () => {
		const mesh = makeMesh();
		const data = new Float32Array(count * 3);
		updateInstanceBuffers(mesh, data, new Float32Array(count * 3), new Float32Array(count * 2));

		const attr = mesh.geometry.getAttribute('a_initialPosition') as THREE.BufferAttribute;
		expect(attr).toBeInstanceOf(THREE.BufferAttribute);
		expect(attr.itemSize).toBe(3);
		expect(attr.count).toBe(count);
		expect(attr.array.length).toBe(count * 3);
	});

	it('sets a_targetPosition with itemSize 3', () => {
		const mesh = makeMesh();
		const data = new Float32Array(count * 3);
		updateInstanceBuffers(mesh, new Float32Array(count * 3), data, new Float32Array(count * 2));

		const attr = mesh.geometry.getAttribute('a_targetPosition') as THREE.BufferAttribute;
		expect(attr.itemSize).toBe(3);
		expect(attr.count).toBe(count);
		expect(attr.array.length).toBe(count * 3);
	});

	it('sets a_uvOffset with itemSize 2', () => {
		const mesh = makeMesh();
		const data = new Float32Array(count * 2);
		updateInstanceBuffers(mesh, new Float32Array(count * 3), new Float32Array(count * 3), data);

		const attr = mesh.geometry.getAttribute('a_uvOffset') as THREE.BufferAttribute;
		expect(attr.itemSize).toBe(2);
		expect(attr.count).toBe(count);
		expect(attr.array.length).toBe(count * 2);
	});

	it('preserves data integrity', () => {
		const mesh = makeMesh();
		const init = new Float32Array(count * 3);
		const targ = new Float32Array(count * 3);
		const uvs = new Float32Array(count * 2);

		for (let i = 0; i < count; i++) {
			init[i * 3] = i * 10;
			init[i * 3 + 1] = i * 10 + 1;
			init[i * 3 + 2] = i * 10 + 2;

			targ[i * 3] = i * 100;
			targ[i * 3 + 1] = i * 100 + 1;
			targ[i * 3 + 2] = i * 100 + 2;

			uvs[i * 2] = i * 0.1;
			uvs[i * 2 + 1] = i * 0.1 + 0.05;
		}

		updateInstanceBuffers(mesh, init, targ, uvs);

		const initAttr = mesh.geometry.getAttribute('a_initialPosition') as THREE.BufferAttribute;
		const targAttr = mesh.geometry.getAttribute('a_targetPosition') as THREE.BufferAttribute;
		const uvAttr = mesh.geometry.getAttribute('a_uvOffset') as THREE.BufferAttribute;

		expect(initAttr.getX(0)).toBe(0);
		expect(initAttr.getX(2)).toBe(20);
		expect(targAttr.getX(1)).toBe(100);
		expect(targAttr.getY(1)).toBe(101);
		expect(uvAttr.getX(3)).toBeCloseTo(0.3, 5);
		expect(uvAttr.getY(0)).toBeCloseTo(0.05, 5);
	});
});

describe('updateBillboardMatrices', () => {
	const count = 3;
	let mesh: THREE.InstancedMesh;
	let camera: THREE.Camera;
	let glyphMap: Map<string, AtlasGlyph>;
	let chars: string[];

	beforeEach(() => {
		mesh = createInstancedMesh(count, atlasTexture(), shaderMaterial());

		const init = new Float32Array(count * 3);
		const targ = new Float32Array(count * 3);
		const uvs = new Float32Array(count * 2);
		for (let i = 0; i < count; i++) {
			init[i * 3] = i * 2;
			init[i * 3 + 1] = i * 2 + 1;
			init[i * 3 + 2] = 0;
			targ[i * 3] = 0;
			targ[i * 3 + 1] = 0;
			targ[i * 3 + 2] = 0;
			uvs[i * 2] = 0;
			uvs[i * 2 + 1] = 0;
		}
		updateInstanceBuffers(mesh, init, targ, uvs);

		camera = new THREE.PerspectiveCamera();
		camera.position.set(5, 5, 5);
		camera.updateMatrixWorld();

		glyphMap = new Map<string, AtlasGlyph>();
		chars = ['A', 'B', 'C'];
		glyphMap.set('A', { char: 'A', u: 0, v: 0, width: 0.1, height: 0.15 });
		glyphMap.set('B', { char: 'B', u: 0.1, v: 0, width: 0.12, height: 0.15 });
		glyphMap.set('C', { char: 'C', u: 0.2, v: 0, width: 0.11, height: 0.15 });
	});

	it('triggers instanceMatrix update', () => {
		const initialVersion = mesh.instanceMatrix.version;
		updateBillboardMatrices(mesh, camera, glyphMap, chars);
		expect(mesh.instanceMatrix.version).toBeGreaterThan(initialVersion);
	});

	it('writes a matrix per instance', () => {
		updateBillboardMatrices(mesh, camera, glyphMap, chars);

		const m = new THREE.Matrix4();
		for (let i = 0; i < count; i++) {
			mesh.getMatrixAt(i, m);
			const isIdentity = m.equals(new THREE.Matrix4().identity());
			expect(isIdentity).toBe(false);
		}
	});

	it('translates instances to their initial positions', () => {
		updateBillboardMatrices(mesh, camera, glyphMap, chars);

		const m = new THREE.Matrix4();
		const pos = new THREE.Vector3();

		mesh.getMatrixAt(0, m);
		pos.setFromMatrixPosition(m);
		expect(pos.x).toBe(0);
		expect(pos.y).toBe(1);
		expect(pos.z).toBe(0);

		mesh.getMatrixAt(2, m);
		pos.setFromMatrixPosition(m);
		expect(pos.x).toBe(4);
		expect(pos.y).toBe(5);
		expect(pos.z).toBe(0);
	});

	it('scales instances by glyph aspect ratio and fontSize', () => {
		const fontSize = 64;
		updateBillboardMatrices(mesh, camera, glyphMap, chars, fontSize);

		const m = new THREE.Matrix4();
		const scale = new THREE.Vector3();

		mesh.getMatrixAt(0, m);
		scale.setFromMatrixScale(m);
		expect(scale.x).toBeCloseTo(glyphMap.get('A')!.width * fontSize);
		expect(scale.y).toBeCloseTo(glyphMap.get('A')!.height * fontSize);

		mesh.getMatrixAt(1, m);
		scale.setFromMatrixScale(m);
		expect(scale.x).toBeCloseTo(glyphMap.get('B')!.width * fontSize);
		expect(scale.y).toBeCloseTo(glyphMap.get('B')!.height * fontSize);
	});

	it('makes instances face the camera', () => {
		updateBillboardMatrices(mesh, camera, glyphMap, chars);

		const m = new THREE.Matrix4();
		const instanceQuat = new THREE.Quaternion();
		const camQuat = new THREE.Quaternion();
		camera.getWorldQuaternion(camQuat);

		for (let i = 0; i < count; i++) {
			mesh.getMatrixAt(i, m);
			m.decompose(new THREE.Vector3(), instanceQuat, new THREE.Vector3());
			expect(instanceQuat.x).toBeCloseTo(camQuat.x);
			expect(instanceQuat.y).toBeCloseTo(camQuat.y);
			expect(instanceQuat.z).toBeCloseTo(camQuat.z);
			expect(instanceQuat.w).toBeCloseTo(camQuat.w);
		}
	});

	it('handles missing glyph in glyphMap with default scale', () => {
		const partialMap = new Map<string, AtlasGlyph>();
		partialMap.set('A', { char: 'A', u: 0, v: 0, width: 0.1, height: 0.15 });
		updateBillboardMatrices(mesh, camera, partialMap, chars, 64);

		const m = new THREE.Matrix4();
		const scale = new THREE.Vector3();

		const expectedDefaultX = 64 * 0.5;
		const expectedDefaultY = 64;

		mesh.getMatrixAt(1, m);
		scale.setFromMatrixScale(m);
		expect(scale.x).toBe(expectedDefaultX);
		expect(scale.y).toBe(expectedDefaultY);
	});

	it('handles zero count without error', () => {
		const emptyMesh = createInstancedMesh(0, atlasTexture(), shaderMaterial());
		expect(() =>
			updateBillboardMatrices(emptyMesh, camera, glyphMap, chars),
		).not.toThrow();
	});
});
