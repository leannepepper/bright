    
    varying float v_time;
    varying vec3 v_color;
    
    void main()
            {

            float strength = 0.25 / (distance(vec2(gl_PointCoord.x, (gl_PointCoord.y - 0.5) * 10.0 + 0.5), vec2(0.5, (sin(v_time + 0.5) * 0.4) + 0.5) ));
            strength *= 0.05 / (distance(vec2(gl_PointCoord.y, (gl_PointCoord.x - 0.5) * 15.0 + 0.5), vec2(0.5, (cos(v_time + 0.5) * 0.4) + 0.5 )));

             vec3 color = mix(vec3(0.0), v_color, strength);
            gl_FragColor = vec4(color, 1.0);
            //gl_FragColor = vec4(vec3(strength), 1.0);
            }