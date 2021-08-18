attribute vec3 next;
attribute vec3 prev;
attribute float side;
attribute float a_scale;

uniform vec2 u_resolution;
uniform float u_size;
uniform float u_time;
uniform mat4 u_projection;

varying float v_time;
varying vec3 v_color;

vec4 getPosition() {
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1);
    vec2 nextScreen = next.xy * aspect;
    vec2 prevScreen = prev.xy * aspect;

    vec2 tangent = normalize(nextScreen - prevScreen);
    vec2 normal = vec2(-tangent.y, tangent.x);
    normal /= aspect;
    normal *= 0.1;
    
    vec4 current = vec4(position, 1);
    current.xy -= normal * side;
    return current;
}

void main() {
    gl_Position = vec4(position, 1);
    v_color = color;
}