import * as THREE from 'three';
import type { AtlasGlyph } from './types';

export function createInstancedMesh(
	count: number,
	atlasTexture: THREE.Texture,
	shaderMaterial: THREE.ShaderMaterial,
): THREE.InstancedMesh {
	const geometry = new THREE.PlaneGeometry(1, 1);
	const mesh = new THREE.InstancedMesh(geometry, shaderMaterial, count);
	mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
	shaderMaterial.uniforms.u_texture.value = atlasTexture;
	return mesh;
}

export function updateInstanceBuffers(
	mesh: THREE.InstancedMesh,
	initialPositions: Float32Array,
	targetPositions: Float32Array,
	uvOffsets: Float32Array,
): void {
	mesh.geometry.setAttribute(
		'a_initialPosition',
		new THREE.InstancedBufferAttribute(initialPositions, 3),
	);

	mesh.geometry.setAttribute(
		'a_targetPosition',
		new THREE.InstancedBufferAttribute(targetPositions, 3),
	);

	mesh.geometry.setAttribute(
		'a_uvOffset',
		new THREE.InstancedBufferAttribute(uvOffsets, 2),
	);
}

export function updateBillboardMatrices(
	mesh: THREE.InstancedMesh,
	camera: THREE.Camera,
	glyphMap: Map<string, AtlasGlyph>,
	chars: string[] = [],
	fontSize = 64,
): void {
	const count = mesh.count;
	const pos = new THREE.Vector3();
	const quat = new THREE.Quaternion();
	const scale = new THREE.Vector3();
	const matrix = new THREE.Matrix4();

	camera.getWorldQuaternion(quat);

	const initialAttr = mesh.geometry.getAttribute('a_initialPosition') as
		| THREE.BufferAttribute
		| undefined;

	for (let i = 0; i < count; i++) {
		if (initialAttr !== undefined && initialAttr.count > i) {
			pos.set(initialAttr.getX(i), initialAttr.getY(i), initialAttr.getZ(i));
		} else {
			pos.set(0, 0, 0);
		}

		const char = chars[i] ?? '';
		const glyph = glyphMap.get(char);
		if (glyph) {
			scale.set(glyph.width * fontSize, glyph.height * fontSize, 1);
		} else {
			scale.set(fontSize * 0.5, fontSize, 1);
		}

		matrix.compose(pos, quat, scale);
		mesh.setMatrixAt(i, matrix);
	}

	mesh.instanceMatrix.needsUpdate = true;
}
