import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  RoundedBox, Cylinder, Environment, Lightformer,
  ContactShadows, Float, OrbitControls, PerspectiveCamera, MeshReflectorMaterial,
} from '@react-three/drei'
import * as THREE from 'three'

const RED = '#EF233C'

/* ── Car paint (glossy clearcoat metallic) ──────────────── */
function PaintMaterial({ color = RED }) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={0.7}
      roughness={0.28}
      clearcoat={1}
      clearcoatRoughness={0.08}
      envMapIntensity={1.4}
    />
  )
}

/* ── A single wheel (tyre + machined rim) ───────────────── */
function Wheel({ position }) {
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      {/* Tyre */}
      <Cylinder args={[0.52, 0.52, 0.34, 40]}>
        <meshStandardMaterial color="#0c0d12" roughness={0.85} metalness={0.1} />
      </Cylinder>
      {/* Rim face */}
      <Cylinder args={[0.34, 0.34, 0.36, 6]} position={[0, 0, 0.01]}>
        <meshStandardMaterial color="#c8ccd4" metalness={1} roughness={0.22} />
      </Cylinder>
      {/* Hub */}
      <Cylinder args={[0.1, 0.1, 0.4, 20]}>
        <meshStandardMaterial color={RED} metalness={0.9} roughness={0.3} />
      </Cylinder>
      {/* Brake caliper accent */}
      <Cylinder args={[0.26, 0.26, 0.2, 24]} position={[0, 0, -0.02]}>
        <meshStandardMaterial color="#15161d" metalness={0.6} roughness={0.5} />
      </Cylinder>
    </group>
  )
}

/* ── The sculpted sports car ────────────────────────────── */
function Car() {
  const group = useRef()

  // Subtle continuous spin
  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.35
  })

  return (
    <group ref={group} position={[0, -0.35, 0]} rotation={[0, Math.PI / 5, 0]} scale={1.05}>

      {/* ── Long low main body (single cohesive form) ── */}
      <RoundedBox args={[4.7, 0.5, 1.9]} radius={0.24} smoothness={8} position={[0, 0.6, 0]}>
        <PaintMaterial />
      </RoundedBox>

      {/* ── Shoulder line (slightly narrower, sits on top — subtle, no big step) ── */}
      <RoundedBox args={[4.5, 0.34, 1.74]} radius={0.22} smoothness={8} position={[0, 0.86, 0]}>
        <PaintMaterial />
      </RoundedBox>

      {/* ── Long sloping hood ── */}
      <RoundedBox args={[1.7, 0.22, 1.64]} radius={0.14} smoothness={6} position={[1.55, 0.98, 0]}>
        <PaintMaterial />
      </RoundedBox>

      {/* ── Rear deck (low) ── */}
      <RoundedBox args={[1.25, 0.26, 1.66]} radius={0.14} smoothness={6} position={[-1.6, 0.98, 0]}>
        <PaintMaterial />
      </RoundedBox>

      {/* ── Low sleek cabin / greenhouse ── */}
      <RoundedBox args={[2.1, 0.46, 1.42]} radius={0.3} smoothness={8} position={[-0.25, 1.16, 0]}>
        <PaintMaterial />
      </RoundedBox>

      {/* ── Windscreen + side glass (dark tinted, reflective) ── */}
      <RoundedBox args={[1.96, 0.4, 1.48]} radius={0.26} smoothness={8} position={[-0.18, 1.2, 0]}>
        <meshPhysicalMaterial color="#0a0c14" metalness={0.4} roughness={0.04} transparent opacity={0.8} envMapIntensity={2.2} clearcoat={1} />
      </RoundedBox>

      {/* ── A-pillar tint blending hood to roof ── */}
      <RoundedBox args={[0.6, 0.3, 1.4]} radius={0.16} smoothness={6} position={[0.78, 1.04, 0]}>
        <meshPhysicalMaterial color="#0a0c14" metalness={0.4} roughness={0.05} transparent opacity={0.75} envMapIntensity={2} clearcoat={1} />
      </RoundedBox>

      {/* ── Front splitter ── */}
      <RoundedBox args={[0.55, 0.1, 1.95]} radius={0.04} position={[2.15, 0.36, 0]}>
        <meshStandardMaterial color="#0c0d12" metalness={0.5} roughness={0.6} />
      </RoundedBox>

      {/* ── Rear diffuser ── */}
      <RoundedBox args={[0.5, 0.16, 1.85]} radius={0.04} position={[-2.15, 0.42, 0]}>
        <meshStandardMaterial color="#0c0d12" metalness={0.5} roughness={0.6} />
      </RoundedBox>

      {/* ── Side skirts ── */}
      {[0.96, -0.96].map((z) => (
        <RoundedBox key={z} args={[3.4, 0.1, 0.12]} radius={0.04} position={[0, 0.36, z]}>
          <meshStandardMaterial color="#0c0d12" metalness={0.5} roughness={0.6} />
        </RoundedBox>
      ))}

      {/* ── Headlights (emissive white blades, swept) ── */}
      {[0.6, -0.6].map((z) => (
        <RoundedBox key={z} args={[0.5, 0.1, 0.3]} radius={0.04} position={[2.0, 0.82, z]}>
          <meshStandardMaterial color="#ffffff" emissive="#dfefff" emissiveIntensity={2.4} toneMapped={false} />
        </RoundedBox>
      ))}

      {/* ── Tail light bar (emissive red, full width) ── */}
      <RoundedBox args={[0.1, 0.12, 1.62]} radius={0.04} position={[-2.22, 0.86, 0]}>
        <meshStandardMaterial color={RED} emissive={RED} emissiveIntensity={3.2} toneMapped={false} />
      </RoundedBox>

      {/* ── Rear wing ── */}
      <RoundedBox args={[0.45, 0.05, 1.66]} radius={0.025} position={[-2.05, 1.16, 0]}>
        <meshStandardMaterial color="#15161d" metalness={0.7} roughness={0.35} />
      </RoundedBox>
      {[0.66, -0.66].map((z) => (
        <RoundedBox key={z} args={[0.1, 0.24, 0.07]} radius={0.02} position={[-2.0, 1.02, z]}>
          <meshStandardMaterial color="#15161d" metalness={0.7} roughness={0.35} />
        </RoundedBox>
      ))}

      {/* ── Wheels ── */}
      <Wheel position={[1.45, 0.5, 1.0]} />
      <Wheel position={[1.45, 0.5, -1.0]} />
      <Wheel position={[-1.5, 0.5, 1.0]} />
      <Wheel position={[-1.5, 0.5, -1.0]} />
    </group>
  )
}

/* ── Procedural studio environment (no network HDR needed) ── */
function StudioEnv() {
  return (
    <Environment resolution={256} frames={1}>
      {/* Key light overhead */}
      <Lightformer form="rect" intensity={3} position={[0, 5, 1]} scale={[10, 6, 1]} color="#ffffff" />
      {/* Soft fill */}
      <Lightformer form="rect" intensity={1.2} position={[-5, 2, -3]} scale={[8, 4, 1]} color="#cfd6e6" />
      {/* Brand-red rim from the right */}
      <Lightformer form="rect" intensity={2.5} position={[6, 2, 2]} scale={[3, 6, 1]} color={RED} rotation={[0, -Math.PI / 2, 0]} />
      {/* Streak reflections that sweep across the paint */}
      <Lightformer form="ring" intensity={1.5} position={[3, 4, -4]} scale={4} color="#ffffff" />
      <Lightformer form="rect" intensity={1} position={[0, 1, 6]} scale={[10, 1.5, 1]} color="#ffffff" />
    </Environment>
  )
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[5.5, 2.4, 6]} fov={32} />

      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />
      <spotLight position={[-6, 6, -2]} angle={0.5} penumbra={1} intensity={1.6} color={RED} />
      <pointLight position={[0, 3, 4]} intensity={0.6} color="#aeb9d4" />

      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.4} floatingRange={[-0.05, 0.12]}>
        <Car />
      </Float>

      {/* Showroom floor reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.42, 0]}>
        <planeGeometry args={[40, 40]} />
        <MeshReflectorMaterial
          blur={[300, 80]}
          resolution={1024}
          mixBlur={1}
          mixStrength={45}
          roughness={0.9}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0c0d14"
          metalness={0.6}
          mirror={0}
        />
      </mesh>

      {/* Grounding shadow */}
      <ContactShadows position={[0, -0.41, 0]} opacity={0.55} scale={14} blur={2.6} far={4.5} color="#000000" />

      <StudioEnv />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 2.05}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  )
}

export default function Car3D() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      style={{ width: '100%', height: '100%' }}>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
