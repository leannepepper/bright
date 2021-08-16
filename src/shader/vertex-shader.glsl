//  // Uniforms 
// uniform float u_size;
// uniform float u_time;
// uniform vec3 u_mouse;

// // Attributes
// attribute float a_scale;

 varying float v_time;
 varying vec3 v_color;

//  void main()
//         {
//             /**
//              * Position
//              */
//             vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//             vec4 viewPosition = viewMatrix * modelPosition;
//             vec4 projectedPosition = projectionMatrix * viewPosition;
//             //gl_Position = projectedPosition;
//             //gl_Position = vec4( position, 1.0 );
//             gl_Position = vec4( position.x , position.y, 1.0, 1.0 );

//             /**
//              * Size
//              */
//             gl_PointSize = u_size * a_scale;
//             gl_PointSize *= (1.0 / - viewPosition.z);

//             /**
//              * Assignments
//              */
//             v_time = u_time;
//             v_color = color;
//         }

//attribute vec3 position;
attribute vec3 next;
attribute vec3 prev;
//attribute vec2 uv;
attribute float side;

uniform vec2 u_resolution;

vec4 getPosition() {
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1);
    vec2 nextScreen = next.xy * aspect;
    vec2 prevScreen = prev.xy * aspect;

    vec2 tangent = normalize(nextScreen - prevScreen);
    vec2 normal = vec2(-tangent.y, tangent.x);
    normal /= aspect;
    normal *= uv.y * 0.2;
    
    vec4 current = vec4(position, 1);
   // current.xy -= normal * side;
    return current;
    
}

void main() {
    gl_Position = getPosition();
    //gl_Position = vec4( position, 1.0 );
}