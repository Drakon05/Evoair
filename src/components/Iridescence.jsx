import React, { useEffect, useRef } from 'react';

const Iridescence = ({ color = [1, 1, 1], speed = 0.3, amplitude = 0.03 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Vertex Shader
    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader - Creates soft, shifting pearl/silver/champagne waves
    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uResolution;
      
      // Simplex noise approximation
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 a0 = x - floor(x + 0.5);
        vec3 r = 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        a0 *= r;
        h  *= r;
        vec3 v1 = vec3(a0.x  * x0.x  + h.x  * x0.y,
          a0.y  * x12.x + h.y  * x12.y,
          a0.z  * x12.z + h.z  * x12.w);
        return 130.0 * dot(m, v1);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        
        // Fluid, organic noise values
        float n1 = snoise(uv * 1.5 + vec2(uTime * ${speed * 0.1}, uTime * ${speed * 0.05}));
        float n2 = snoise(uv * 2.5 - vec2(uTime * ${speed * 0.07}, -uTime * ${speed * 0.1}));
        
        // Blend luxury color palette: pearl, silver, soft champagne
        vec3 pearl = vec3(0.97, 0.95, 0.92);
        vec3 silver = vec3(0.92, 0.92, 0.94);
        vec3 champagne = vec3(0.94, 0.90, 0.83);
        
        float mixVal = n1 * 0.5 + 0.5;
        vec3 color = mix(pearl, silver, mixVal);
        color = mix(color, champagne, n2 * ${amplitude} * 10.0 + 0.3);
        
        // Soft white glow highlight
        float dist = length(uv - vec2(0.5));
        color += (1.0 - dist) * 0.06;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Compile shader helper
    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeUniform = gl.getUniformLocation(program, 'uTime');
    const resUniform = gl.getUniformLocation(program, 'uResolution');

    let animationFrameId;
    let startTime = Date.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      gl.uniform1f(timeUniform, elapsed);
      gl.uniform2f(resUniform, canvas.width, canvas.height);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [speed, amplitude]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        filter: 'blur(100px)',
        opacity: 0.08, // Opacity restricted to 8% to keep it extremely subtle
        mixBlendMode: 'screen',
        zIndex: 1,
      }}
    />
  );
};

export default Iridescence;
