 // Uniforms 
uniform float u_size;
uniform float u_time;
uniform vec2 u_mouse;

// Attributes
attribute float a_scale;
attribute vec2 a_position;

varying float v_time;
varying vec3 v_color;
varying vec2 vUv;
varying vec3 vNormal;

 void main()
        {
            /**
             * Position
             */
            vec3 vNormal = normalize( normalMatrix * normal );
            
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = vec4(position, 1.0);

            //gl_Position = vec4(a_position, 0, 1);
            
           // gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);

            /**
             * Assignments
             */
            v_time = u_time;
            v_color = color;
            vUv = uv;
        }