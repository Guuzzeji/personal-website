uniform sampler2D u_texture;

varying vec2 v_uv;
varying vec2 v_uvOffset;

void main() {
	vec2 atlasUV = v_uv + v_uvOffset;
	vec4 color = texture2D(u_texture, atlasUV);
	if (color.a < 0.1) discard;
	gl_FragColor = vec4(1.0, 1.0, 1.0, color.a);
}
