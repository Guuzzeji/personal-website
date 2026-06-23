attribute vec3 position;
attribute vec2 uv;

attribute vec3 a_initialPosition;
attribute vec3 a_targetPosition;
attribute vec2 a_uvOffset;

uniform float u_progress;

varying vec2 v_uv;
varying vec2 v_uvOffset;

void main() {
	vec3 currentPos = mix(a_initialPosition, a_targetPosition, u_progress);
	vec3 worldPos = currentPos + position;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPos, 1.0);
	v_uv = uv;
	v_uvOffset = a_uvOffset;
}
