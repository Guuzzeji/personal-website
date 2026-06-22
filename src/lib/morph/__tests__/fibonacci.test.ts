import { describe, it, expect } from 'vitest';
import { fibonacciSphere } from '../fibonacci';

describe('fibonacciSphere', () => {
	it('should place 100 points on sphere of radius 5', () => {
		const n = 100;
		const radius = 5;
		const positions = fibonacciSphere(n, radius);

		expect(positions).toBeInstanceOf(Float32Array);
		expect(positions.length).toBe(n * 3);

		for (let i = 0; i < n; i++) {
			const x = positions[i * 3];
			const y = positions[i * 3 + 1];
			const z = positions[i * 3 + 2];
			const dist = Math.sqrt(x * x + y * y + z * z);
			expect(dist).toBeCloseTo(radius, 3);
		}
	});

	it('should return empty Float32Array for n=0', () => {
		const positions = fibonacciSphere(0, 10);
		expect(positions).toBeInstanceOf(Float32Array);
		expect(positions.length).toBe(0);
	});

	it('should return [0, radius, 0] for n=1', () => {
		const radius = 5;
		const positions = fibonacciSphere(1, radius);
		expect(positions).toBeInstanceOf(Float32Array);
		expect(positions.length).toBe(3);
		expect(positions[0]).toBe(0);
		expect(positions[1]).toBe(radius);
		expect(positions[2]).toBe(0);
	});

	it('should not produce identical points', () => {
		const n = 100;
		const radius = 3;
		const positions = fibonacciSphere(n, radius);

		const seen = new Set<string>();
		for (let i = 0; i < n; i++) {
			const key = `${positions[i * 3]},${positions[i * 3 + 1]},${positions[i * 3 + 2]}`;
			expect(seen.has(key)).toBe(false);
			seen.add(key);
		}
	});
});
