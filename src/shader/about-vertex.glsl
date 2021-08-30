uniform float u_size;
uniform float u_time;
uniform vec2 u_mouse;

attribute float a_scale;
attribute vec2 a_position;

 void main()
        {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = vec4(position, 1.0);
        }