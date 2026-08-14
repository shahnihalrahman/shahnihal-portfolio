'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { STAGES, stage, type StageConfig } from '@/lib/stage';

/**
 * THE PRODUCT SYSTEM
 *
 * One persistent WebGL system for the entire page. It is not decoration: each
 * sub-system maps to a part of how a product actually gets built, and the story
 * section the visitor is reading decides which parts are active.
 *
 *   core          the product idea, always present
 *   lattice       services and the connections between them
 *   rings         orbital context
 *   fragments     interface surfaces, raised while real products are shown
 *   ai            the AI layer, wired in during the AI section
 *   architecture  stacked technical layers, expanded in the architecture section
 *
 * Everything is generated procedurally — no textures, no model files, no image
 * requests — and every transition is a weight interpolation, so moving between
 * sections *is* the animation.
 */

const CYAN = new THREE.Color('#3ee0f2');
const BLUE = new THREE.Color('#6e8cff');
const VIOLET = new THREE.Color('#a98cff');

function fibonacciSphere(count: number, radius: number) {
  const points: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    points.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius));
  }
  return points;
}

/* ─────────────────────────────  SHARED SHADER  ───────────────────────────── */

const fresnelVertex = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vViewW;
  void main() {
    vNormalW = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewW = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fresnelFragment = /* glsl */ `
  uniform vec3 uInner;
  uniform vec3 uOuter;
  uniform float uPower;
  uniform float uIntensity;
  varying vec3 vNormalW;
  varying vec3 vViewW;
  void main() {
    float rim = pow(1.0 - abs(dot(normalize(vNormalW), normalize(vViewW))), uPower);
    gl_FragColor = vec4(mix(uInner, uOuter, rim), rim * uIntensity);
  }
`;

function makeFresnel(inner: THREE.Color, outer: THREE.Color, power: number, intensity: number) {
  return new THREE.ShaderMaterial({
    vertexShader: fresnelVertex,
    fragmentShader: fresnelFragment,
    uniforms: {
      uInner: { value: inner.clone() },
      uOuter: { value: outer.clone() },
      uPower: { value: power },
      uIntensity: { value: intensity },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.BackSide,
  });
}

/** Weights, lerped every frame toward the active stage. */
type Weights = Omit<StageConfig, 'x' | 'y' | 'scale' | 'cam'>;

/* ───────────────────────────────  SUB-SYSTEMS  ──────────────────────────── */

function useAdditive(color: THREE.Color, opacity: number) {
  return useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: color.clone(),
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [color, opacity],
  );
}

export default function SystemScene({ compact }: { compact: boolean }) {
  return (
    <Canvas
      dpr={[1, compact ? 1.25 : 1.5]}
      camera={{ position: [0, 0, 8], fov: 42 }}
      gl={{ antialias: !compact, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        const canvas = gl.domElement;
        canvas.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          stage.glLost = true;
          document.documentElement.dataset.glLost = 'true';
        });
        canvas.addEventListener('webglcontextrestored', () => {
          stage.glLost = false;
          delete document.documentElement.dataset.glLost;
        });
      }}
      style={{ pointerEvents: 'none' }}
      aria-hidden
    >
      <System compact={compact} />
    </Canvas>
  );
}

function System({ compact }: { compact: boolean }) {
  const root = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const nodeCount = compact ? 16 : 26;
  const latticeRadius = compact ? 2.1 : 2.35;

  /* ── Geometry, built once ─────────────────────────────────────────────── */

  const nodes = useMemo(() => fibonacciSphere(nodeCount, latticeRadius), [nodeCount, latticeRadius]);

  const edges = useMemo(() => {
    const pairs: [number, number][] = [];
    const threshold = latticeRadius * 0.8;
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        if (nodes[i].distanceTo(nodes[j]) < threshold) pairs.push([i, j]);
      }
    }
    return pairs;
  }, [nodes, latticeRadius]);

  const edgeGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edges.length * 6), 3));
    return g;
  }, [edges.length]);

  const packetEdges = useMemo(() => {
    const stride = Math.max(1, Math.floor(edges.length / (compact ? 7 : 12)));
    return edges.filter((_, i) => i % stride === 0);
  }, [edges, compact]);

  const packetGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(packetEdges.length * 3), 3));
    return g;
  }, [packetEdges.length]);

  const coreWire = useMemo(() => {
    const base = new THREE.IcosahedronGeometry(0.92, 1);
    const wire = new THREE.WireframeGeometry(base);
    base.dispose();
    return wire;
  }, []);

  /** Interface fragments: thin panels that read as UI surfaces. */
  const fragmentPlacements = useMemo(
    () =>
      [
        { pos: [1.55, 1.15, 1.1], rot: [-0.24, -0.55, 0.06], size: [1.5, 1] },
        { pos: [-1.75, 0.55, 0.85], rot: [-0.16, 0.6, -0.05], size: [1.25, 0.85] },
        { pos: [1.2, -1.35, 0.6], rot: [0.28, -0.42, 0.1], size: [1.35, 0.9] },
        { pos: [-1.35, -1.2, 1.2], rot: [0.2, 0.5, -0.08], size: [1.1, 0.75] },
        { pos: [0.15, 1.85, -0.6], rot: [-0.4, 0.1, 0.04], size: [1.2, 0.8] },
      ] as const,
    [],
  );

  const architectureLayers = useMemo(() => [1.05, 1.5, 1.95, 2.4, 2.85], []);

  /* ── Materials ───────────────────────────────────────────────────────── */

  const coreGlow = useMemo(() => makeFresnel(BLUE, CYAN, 3, 0.5), []);
  const shellGlow = useMemo(() => makeFresnel(VIOLET, CYAN, 4.2, 0.15), []);
  const coreLineMat = useAdditive(CYAN, 0.55);
  const edgeMat = useAdditive(BLUE, 0.38);
  const nodeMat = useAdditive(CYAN, 0.85);
  const ringMat = useAdditive(CYAN, 0.45);
  const aiMat = useAdditive(VIOLET, 0.9);
  const archMat = useAdditive(BLUE, 0.4);

  const fragmentFill = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#0d1a2b'),
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const fragmentEdge = useAdditive(CYAN, 0.5);

  const packetMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: VIOLET.clone(),
        size: 0.08,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  /* ── Group refs ──────────────────────────────────────────────────────── */

  const coreGroup = useRef<THREE.Group>(null);
  const latticeGroup = useRef<THREE.Group>(null);
  const ringGroup = useRef<THREE.Group>(null);
  const fragmentGroup = useRef<THREE.Group>(null);
  const aiGroup = useRef<THREE.Group>(null);
  const archGroup = useRef<THREE.Group>(null);
  const instances = useRef<THREE.InstancedMesh>(null);
  const aiInstances = useRef<THREE.InstancedMesh>(null);
  const coreWireRef = useRef<THREE.LineSegments>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  /* Current interpolated state. */
  const current = useRef<Weights & { x: number; y: number; scale: number; cam: number }>({
    ...STAGES.hero,
  });
  const spin = useRef({ x: 0, y: 0 });

  useFrame((_, rawDelta) => {
    if (!stage.visible) return;
    const delta = Math.min(0.05, rawDelta);
    const target = STAGES[stage.id] ?? STAGES.hero;
    const c = current.current;
    // Critically damped-ish approach; slow enough to read as a transition.
    const k = Math.min(1, delta * 1.9);

    c.x += (target.x - c.x) * k;
    c.y += (target.y - c.y) * k;
    c.scale += (target.scale - c.scale) * k;
    c.cam += (target.cam - c.cam) * k;
    c.core += (target.core - c.core) * k;
    c.lattice += (target.lattice - c.lattice) * k;
    c.rings += (target.rings - c.rings) * k;
    c.fragments += (target.fragments - c.fragments) * k;
    c.ai += (target.ai - c.ai) * k;
    c.architecture += (target.architecture - c.architecture) * k;
    c.spread += (target.spread - c.spread) * k;

    camera.position.z += (c.cam - camera.position.z) * k;

    const t = performance.now() * 0.001;

    // Whole-system placement and pointer-led rotation.
    const g = root.current;
    if (g) {
      g.position.x += (c.x - g.position.x) * k;
      g.position.y += (c.y + Math.sin(t * 0.35) * 0.05 - g.position.y) * k;
      g.scale.setScalar(c.scale);
      spin.current.x += (stage.pointer.y * 0.2 - spin.current.x) * Math.min(1, delta * 2.2);
      spin.current.y += (stage.pointer.x * 0.3 - spin.current.y) * Math.min(1, delta * 2.2);
      g.rotation.x = spin.current.x;
      g.rotation.z = spin.current.y * 0.1;
      g.rotation.y += delta * 0.05;
    }

    /* Core */
    if (coreGroup.current) {
      coreGroup.current.scale.setScalar(0.55 + c.core * 0.55);
      coreGroup.current.visible = c.core > 0.02;
    }
    if (coreWireRef.current) {
      coreWireRef.current.rotation.y += delta * 0.15;
      coreWireRef.current.rotation.x -= delta * 0.05;
    }
    coreGlow.uniforms.uIntensity.value = 0.5 * c.core;
    shellGlow.uniforms.uIntensity.value = 0.15 * c.core;
    coreLineMat.opacity = 0.55 * c.core;

    /* Lattice — nodes reveal progressively so the system reads as assembling. */
    const mesh = instances.current;
    if (mesh) {
      const reveal = c.lattice;
      for (let i = 0; i < nodes.length; i += 1) {
        // Each node has its own activation threshold.
        const nodeReveal = Math.min(1, Math.max(0, reveal * nodes.length - i));
        const breathe = 1 + Math.sin(t * 0.9 + i * 0.7) * 0.05;
        tmp.copy(nodes[i]).multiplyScalar(breathe * c.spread);
        dummy.position.copy(tmp);
        dummy.scale.setScalar(Math.max(0.0001, (0.032 + Math.sin(t * 1.3 + i) * 0.008) * nodeReveal));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    const edgeAttr = edgeGeometry.getAttribute('position') as THREE.BufferAttribute;
    edges.forEach(([a, b], i) => {
      const reveal = Math.min(
        Math.min(1, Math.max(0, c.lattice * nodes.length - a)),
        Math.min(1, Math.max(0, c.lattice * nodes.length - b)),
      );
      const s = c.spread * reveal;
      edgeAttr.setXYZ(i * 2, nodes[a].x * s, nodes[a].y * s, nodes[a].z * s);
      edgeAttr.setXYZ(i * 2 + 1, nodes[b].x * s, nodes[b].y * s, nodes[b].z * s);
    });
    edgeAttr.needsUpdate = true;
    edgeMat.opacity = 0.34 * c.lattice;
    nodeMat.opacity = 0.85 * Math.min(1, c.lattice + 0.15);

    /* Data packets travelling the connections. */
    const packetAttr = packetGeometry.getAttribute('position') as THREE.BufferAttribute;
    packetEdges.forEach(([a, b], i) => {
      const phase = (t * 0.26 + i * 0.37) % 1;
      tmp.copy(nodes[a]).lerp(nodes[b], phase).multiplyScalar(c.spread);
      packetAttr.setXYZ(i, tmp.x, tmp.y, tmp.z);
    });
    packetAttr.needsUpdate = true;
    packetMat.opacity = 0.95 * c.lattice;

    /* Rings */
    if (ringGroup.current) {
      ringGroup.current.visible = c.rings > 0.02;
      ringGroup.current.rotation.z += delta * 0.05;
      ringGroup.current.rotation.x -= delta * 0.03;
    }
    ringMat.opacity = 0.45 * c.rings;

    /* Interface fragments rise toward the viewer as products are shown. */
    if (fragmentGroup.current) {
      fragmentGroup.current.visible = c.fragments > 0.02;
      fragmentGroup.current.children.forEach((child, i) => {
        const base = fragmentPlacements[i];
        if (!base) return;
        const lift = c.fragments;
        child.position.set(
          base.pos[0] * (0.75 + lift * 0.55),
          base.pos[1] * (0.75 + lift * 0.55) + Math.sin(t * 0.5 + i) * 0.06,
          base.pos[2] * (0.4 + lift * 1.15),
        );
        child.scale.setScalar(0.5 + lift * 0.6);
      });
    }
    fragmentFill.opacity = 0.5 * c.fragments;
    fragmentEdge.opacity = 0.55 * c.fragments;

    /* AI layer */
    const ai = aiInstances.current;
    if (ai && aiGroup.current) {
      aiGroup.current.visible = c.ai > 0.02;
      aiGroup.current.rotation.y -= delta * 0.16;
      const count = 12;
      for (let i = 0; i < count; i += 1) {
        const angle = (i / count) * Math.PI * 2 + t * 0.18;
        const radius = 1.35 + Math.sin(t * 0.6 + i) * 0.1;
        dummy.position.set(
          Math.cos(angle) * radius,
          Math.sin(i * 1.9 + t * 0.3) * 0.75,
          Math.sin(angle) * radius,
        );
        dummy.scale.setScalar(Math.max(0.0001, 0.055 * c.ai));
        dummy.updateMatrix();
        ai.setMatrixAt(i, dummy.matrix);
      }
      ai.instanceMatrix.needsUpdate = true;
    }
    aiMat.opacity = 0.9 * c.ai;

    /* Architecture: flat layers stack out of the core. */
    if (archGroup.current) {
      archGroup.current.visible = c.architecture > 0.02;
      archGroup.current.children.forEach((child, i) => {
        const spread = c.architecture;
        child.position.y = (i - (architectureLayers.length - 1) / 2) * 0.62 * spread;
        child.scale.setScalar(0.35 + spread * 0.65);
        child.rotation.z += delta * (0.04 + i * 0.008);
      });
    }
    archMat.opacity = 0.4 * c.architecture;
  });

  return (
    <group ref={root}>
      {/* Core */}
      <group ref={coreGroup}>
        <mesh material={coreGlow}>
          <sphereGeometry args={[0.58, 32, 32]} />
        </mesh>
        <lineSegments ref={coreWireRef} geometry={coreWire} material={coreLineMat} />
        <mesh material={shellGlow}>
          <sphereGeometry args={[1.8, 28, 28]} />
        </mesh>
      </group>

      {/* Service lattice */}
      <group ref={latticeGroup}>
        <lineSegments geometry={edgeGeometry} material={edgeMat} />
        <instancedMesh ref={instances} args={[undefined, undefined, nodes.length]} material={nodeMat}>
          <icosahedronGeometry args={[1, 1]} />
        </instancedMesh>
        <points geometry={packetGeometry} material={packetMat} />
      </group>

      {/* Orbits */}
      <group ref={ringGroup}>
        <mesh rotation={[Math.PI / 2.6, 0, 0]} material={ringMat}>
          <torusGeometry args={[2.62, 0.0035, 3, 96]} />
        </mesh>
        <mesh rotation={[0, Math.PI / 3.1, Math.PI / 5]} material={ringMat}>
          <torusGeometry args={[3.05, 0.003, 3, 96]} />
        </mesh>
        <mesh rotation={[Math.PI / 1.9, Math.PI / 6, 0]} material={ringMat}>
          <torusGeometry args={[3.4, 0.0025, 3, 96]} />
        </mesh>
      </group>

      {/* Interface fragments */}
      <group ref={fragmentGroup}>
        {fragmentPlacements.map((f, i) => (
          <group key={i} rotation={f.rot as unknown as [number, number, number]}>
            <mesh material={fragmentFill}>
              <planeGeometry args={[f.size[0], f.size[1]]} />
            </mesh>
            <lineSegments material={fragmentEdge}>
              <edgesGeometry args={[new THREE.PlaneGeometry(f.size[0], f.size[1])]} />
            </lineSegments>
            {/* A couple of interface rules so the panel reads as a screen. */}
            <lineSegments material={fragmentEdge} position={[0, f.size[1] * 0.28, 0.001]}>
              <edgesGeometry args={[new THREE.PlaneGeometry(f.size[0] * 0.78, 0.001)]} />
            </lineSegments>
            <lineSegments material={fragmentEdge} position={[0, f.size[1] * 0.08, 0.001]}>
              <edgesGeometry args={[new THREE.PlaneGeometry(f.size[0] * 0.5, 0.001)]} />
            </lineSegments>
          </group>
        ))}
      </group>

      {/* AI layer */}
      <group ref={aiGroup}>
        <instancedMesh ref={aiInstances} args={[undefined, undefined, 12]} material={aiMat}>
          <octahedronGeometry args={[1, 0]} />
        </instancedMesh>
      </group>

      {/* Architecture layers */}
      <group ref={archGroup}>
        {architectureLayers.map((r, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]} material={archMat}>
            <torusGeometry args={[r, 0.004, 3, 72]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
