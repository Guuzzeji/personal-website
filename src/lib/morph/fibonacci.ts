/**
 * Generates evenly distributed points on a sphere surface using the
 * Fibonacci sphere algorithm.
 *
 * @param n - Number of points to generate
 * @param radius - Radius of the sphere
 * @returns Interleaved Float32Array [x0, y0, z0, x1, y1, z1, ...]
 */
export function fibonacciSphere(n: number, radius: number): Float32Array {
	if (n <= 0) return new Float32Array(0);
	if (n === 1) return new Float32Array([0, radius, 0]);

	const phi = Math.PI * (3 - Math.sqrt(5));
	const positions = new Float32Array(n * 3);

	for (let i = 0; i < n; i++) {
		const y = 1 - (i / (n - 1)) * 2;
		const r = Math.sqrt(1 - y * y);
		const theta = phi * i;
		const x = Math.cos(theta) * r * radius;
		const z = Math.sin(theta) * r * radius;

		positions[i * 3] = x;
		positions[i * 3 + 1] = y * radius;
		positions[i * 3 + 2] = z;
	}

	return positions;
}
