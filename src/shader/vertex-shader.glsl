 // Uniforms 
uniform float u_size;
uniform float u_time;
uniform vec2 u_mouse;

// Attributes
attribute float a_scale;

varying float v_time;
varying vec3 v_color;

 void main()
        {
            /**
             * Position
             */
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = projectedPosition;

            /**
             * Size
             */
            gl_PointSize = u_size * a_scale;
           // gl_PointSize *= (1.0 / - viewPosition.z);

            /**
             * Assignments
             */
            v_time = u_time;
            v_color = color;
        }