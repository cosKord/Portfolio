"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Ze palatte

const PALETTE = {
  gold:    [0.96, 0.72, 0.28],
  magenta: [0.78, 0.20, 0.55],
  purple:  [0.35, 0.30, 0.75],
  gray:    [0.48, 0.49, 0.54],
  white:   [0.98, 0.97, 0.93],
};

const glslColor = (color: number[]) =>
  `vec3(${color[0]}, ${color[1]}, ${color[2]})`;

const PARAMS = {
  zoom: 0.3,
  washout: 0.0,
  density: 1.0,
  complexity: 1,
  speed: 0.05,
};

const VERT_SRC = `
  attribute vec2 aPos;
  void main() {
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;

const FRAG_SRC = `
  precision highp float;
  uniform vec2 uRes;
  uniform float uTime;
  uniform float uZoom;
  uniform float uWashout;
  uniform float uDensity;
  uniform int uComplexity;

  vec3 permute3(vec3 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
  }

  float snoise(vec2 v){
    const vec4 C = vec4(
      0.211324865405187,
      0.366025403784439,
      -0.577350269189626,
      0.024390243902439
    );

    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    vec2 i1 = (x0.x > x0.y)
      ? vec2(1.0, 0.0)
      : vec2(0.0, 1.0);

    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    i = mod(i, 289.0);

    vec3 p = permute3(
      permute3(
        i.y + vec3(0.0, i1.y, 1.0)
      ) +
      i.x +
      vec3(0.0, i1.x, 1.0)
    );

    vec3 m = max(
      0.5 - vec3(
        dot(x0,x0),
        dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)
      ),
      0.0
    );

    m = m*m;
    m = m*m;

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    m *= 1.79284291400159 -
      0.85373472095314 *
      (a0*a0 + h*h);

    vec3 g;

    g.x =
      a0.x * x0.x +
      h.x * x0.y;

    g.yz =
      a0.yz * x12.xz +
      h.yz * x12.yw;

    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    float freq = 1.0;

    for (int i = 0; i < 6; i++) {
      if (i >= uComplexity) break;

      value += amp * snoise(p * freq);
      freq *= 2.02;
      amp *= 0.55;
    }

    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes.xy;

    vec2 p =
      (uv - 0.5) *
      vec2(uRes.x / uRes.y, 1.0) *
      uZoom;

    float t = uTime;

    vec2 q = vec2(
      fbm(p + vec2(0.0, 0.0) + t * 0.04),
      fbm(p + vec2(5.2, 1.3) - t * 0.03)
    );

    vec2 r = vec2(
      fbm(
        p +
        3.2 * q +
        vec2(1.7, 9.2) +
        t * 0.05
      ),
      fbm(
        p +
        3.2 * q +
        vec2(8.3, 2.8) -
        t * 0.045
      )
    );

    float f = fbm(p + 3.6 * r);

    // colors go strt here

    vec3 gold = ${glslColor(PALETTE.gold)};
    vec3 magenta = ${glslColor(PALETTE.magenta)};
    vec3 purple = ${glslColor(PALETTE.purple)};
    vec3 gray = ${glslColor(PALETTE.gray)};
    vec3 white = ${glslColor(PALETTE.white)};

    // five color options, just cuz

    float n1 = fbm(
      p * uDensity +
      3.6 * r +
      vec2(0.0, 0.0)
    );

    float n2 = fbm(
      p * uDensity +
      3.6 * r +
      vec2(4.7, 2.3)
    );

    float n3 = fbm(
      p * uDensity +
      3.6 * r +
      vec2(-3.1, 5.2)
    );

    float n4 = fbm(
      p * uDensity +
      3.6 * r +
      vec2(1.9, -4.6)
    );

    float n5 = fbm(
      p * uDensity +
      3.6 * r +
      vec2(-5.4, -2.1)
    );

    float sharpness = 2.5;

    float e1 = exp(n1 * sharpness);
    float e2 = exp(n2 * sharpness);
    float e3 = exp(n3 * sharpness);

    float e4 = exp((n4 + 0.12) * sharpness);
    float e5 = exp((n5 + 0.08) * sharpness);

    float wSum =
      e1 +
      e2 +
      e3 +
      e4 +
      e5;

    vec3 color =
      (
        e1 * gold +
        e2 * magenta +
        e3 * purple +
        e4 * white +
        e5 * gray
      ) / wSum;

    color = mix(
      color,
      vec3(1.0),
      uWashout * 0.55
    );

    float luma = dot(
      color,
      vec3(0.299, 0.587, 0.114)
    );

    color = mix(
      vec3(luma),
      color,
      1.25
    );

    color = (color - 0.5) * 1.35 + 0.5;

    color = clamp(
      color,
      0.0,
      1.0
    );

    gl_FragColor = vec4(
      color,
      1.0
    );
  }
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string
): WebGLShader {
  const shader = gl.createShader(type);

  if (!shader)
    throw new Error("Failed to create shader");

  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(
    shader,
    gl.COMPILE_STATUS
  )) {
    console.error(
      gl.getShaderInfoLog(shader)
    );
  }

  return shader;
}

interface HeroWavesProps {
  className?: string;
}

export default function HeroWaves({
  className = "",
}: HeroWavesProps) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const prefersReducedMotion =
    useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const gl = canvas.getContext(
      "webgl",
      {
        antialias: true,
      }
    );

    if (!gl) return;

    const program = gl.createProgram();

    if (!program) return;

    gl.attachShader(
      program,
      compileShader(
        gl,
        gl.VERTEX_SHADER,
        VERT_SRC
      )
    );

    gl.attachShader(
      program,
      compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        FRAG_SRC
      )
    );

    gl.linkProgram(program);
    gl.useProgram(program);

    const posBuffer =
      gl.createBuffer();

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      posBuffer
    );

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
        3, -1,
        -1, 3,
      ]),
      gl.STATIC_DRAW
    );

    const aPos =
      gl.getAttribLocation(
        program,
        "aPos"
      );

    gl.enableVertexAttribArray(aPos);

    gl.vertexAttribPointer(
      aPos,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );

    const uRes =
      gl.getUniformLocation(
        program,
        "uRes"
      );

    const uTime =
      gl.getUniformLocation(
        program,
        "uTime"
      );

    const uZoom =
      gl.getUniformLocation(
        program,
        "uZoom"
      );

    const uWashout =
      gl.getUniformLocation(
        program,
        "uWashout"
      );

    const uDensity =
      gl.getUniformLocation(
        program,
        "uDensity"
      );

    const uComplexity =
      gl.getUniformLocation(
        program,
        "uComplexity"
      );

    let raf: number | null = null;
    let visible = true;
    let start = performance.now();

    function resize() {
      if (!canvas || !gl) return;

      const rect =
        canvas.getBoundingClientRect();

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width =
        Math.round(
          rect.width * dpr
        );

      canvas.height =
        Math.round(
          rect.height * dpr
        );

      gl.viewport(
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    const ro =
      new ResizeObserver(resize);

    ro.observe(canvas);
    resize();

    function setUniforms(
      time: number
    ) {
      if (!canvas || !gl) return;

      gl.uniform2f(
        uRes,
        canvas.width,
        canvas.height
      );

      gl.uniform1f(
        uTime,
        time
      );

      gl.uniform1f(
        uZoom,
        PARAMS.zoom
      );

      gl.uniform1f(
        uWashout,
        PARAMS.washout
      );

      gl.uniform1f(
        uDensity,
        PARAMS.density
      );

      gl.uniform1i(
        uComplexity,
        PARAMS.complexity
      );

      gl.drawArrays(
        gl.TRIANGLES,
        0,
        3
      );
    }

    function frame(
      now: number
    ) {
      if (!visible) return;

      const t =
        ((now - start) / 1000) *
        PARAMS.speed;

      setUniforms(t);

      raf =
        requestAnimationFrame(frame);
    }

    if (prefersReducedMotion) {
      setUniforms(0);
    } else {
      raf =
        requestAnimationFrame(frame);
    }

    const io =
      new IntersectionObserver(
        ([entry]) => {
          visible =
            entry.isIntersecting;

          if (
            visible &&
            !prefersReducedMotion &&
            raf === null
          ) {
            start =
              performance.now();

            raf =
              requestAnimationFrame(frame);
          } else if (
            !visible &&
            raf !== null
          ) {
            cancelAnimationFrame(raf);
            raf = null;
          }
        },
        {
          threshold: 0.01,
        }
      );

    io.observe(canvas);

    return () => {
      if (raf !== null) {
        cancelAnimationFrame(raf);
      }

      ro.disconnect();
      io.disconnect();
    };
  }, [prefersReducedMotion]);

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 1.02,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 1.1,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </motion.div>
  );
}