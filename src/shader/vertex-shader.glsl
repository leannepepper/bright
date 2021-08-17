attribute vec3 next;
attribute vec3 prev;
attribute float side;
attribute float a_scale;

uniform vec2 u_resolution;
uniform float u_size;
uniform float u_time;

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
     current.xy -= normal * 1.0;
    return current;
    
}

void main() {
    gl_Position = getPosition();
    vec4 modelPosition = modelMatrix * vec4((position.x),(position.y),(position.z), 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

   // gl_Position = projectedPosition;
    v_color = color;
    
  //  gl_PointSize = u_size * a_scale;
   // gl_PointSize *= (1.0 / - viewPosition.z);
    //gl_Position = vec4( position, 1.0 );
}