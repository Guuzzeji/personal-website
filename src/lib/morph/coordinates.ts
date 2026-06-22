export function domToWebGL(
	domX: number,
	domY: number,
	viewportWidth: number,
	viewportHeight: number,
	dpr: number,
): { x: number; y: number; z: number } {
	const webglX = ((domX * dpr) / viewportWidth) * 2 - 1;
	const webglY = -(((domY * dpr) / viewportHeight) * 2 - 1);
	return { x: webglX, y: webglY, z: 0 };
}

export function getViewportDimensions(): {
	width: number;
	height: number;
	dpr: number;
} {
	if (typeof window === 'undefined') {
		return { width: 0, height: 0, dpr: 1 };
	}
	return {
		width: window.innerWidth,
		height: window.innerHeight,
		dpr: window.devicePixelRatio,
	};
}
