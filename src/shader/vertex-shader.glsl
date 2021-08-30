uniform float u_size;
uniform float u_time;

attribute float a_scale;

varying float v_time;
varying vec3 v_color;

 void main()
        {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = projectedPosition;

            gl_PointSize = u_size * a_scale;
        
            v_time = u_time;
            v_color = color;
        }