import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Center } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';
import Product from './Product';

// Inner component to access R3F's useFrame loop
const SceneController = ({ stateRef, productRef, keyLightRef, rimLightRef, topLightRef, fillLightRef, sweepLightRef }) => {
  useFrame((state) => {
    const current = stateRef.current;
    if (!current) return;

    // 1. Dynamic Studio Lights (GSAP-orchestrated reveal)
    if (keyLightRef.current) keyLightRef.current.intensity = current.keyLightIntensity;
    if (rimLightRef.current) rimLightRef.current.intensity = current.rimLightIntensity;
    if (topLightRef.current) topLightRef.current.intensity = current.topLightIntensity;
    if (fillLightRef.current) fillLightRef.current.intensity = current.fillLightIntensity;
    if (sweepLightRef.current) {
      sweepLightRef.current.intensity = current.sweepIntensity;
      sweepLightRef.current.position.x = current.sweepX;
    }

    // 2. Camera Dolly (Push in 2-4% during reveal + slow scroll push)
    // Starts at current.cameraZ (~9.5) and dollys in
    const targetZ = current.cameraZ - current.scrollProgress * 0.4;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.08;

    // 3. Mouse Interaction (Camera sway: max 3 degrees, heavy smoothing)
    // Horizontal sway and vertical tilt
    const targetCamX = current.mouseX * 0.4;
    const targetCamY = -current.mouseY * 0.4;
    state.camera.position.x += (targetCamX - state.camera.position.x) * 0.06;
    state.camera.position.y += (targetCamY - state.camera.position.y) * 0.06;

    // Always focus camera target at the center of the product
    state.camera.lookAt(0.3, 0, 0); // slightly offset to center the model on the right

    // 4. Idle Floating & Scroll Rotation
    if (productRef.current) {
      const elapsed = state.clock.getElapsedTime();

      // Floating in air (float y: 4-6px, rotation x/y: ±2°)
      // Float height in Three.js coordinates is ~0.045
      const floatY = Math.sin(elapsed * 0.55) * 0.045;
      const floatRotX = Math.sin(elapsed * 0.4) * 0.035; // ~2 degrees
      const floatRotY = Math.cos(elapsed * 0.3) * 0.035;

      // Scroll rotates the product (max 10° = 0.175 rad)
      const scrollRotY = current.scrollProgress * 0.175;

      productRef.current.position.y = floatY;
      productRef.current.rotation.x = floatRotX;
      productRef.current.rotation.y = floatRotY + scrollRotY;
    }
  });

  return null;
};

const ProductScene = ({ stateRef }) => {
  const productRef = useRef(null);
  const keyLightRef = useRef(null);
  const rimLightRef = useRef(null);
  const topLightRef = useRef(null);
  const fillLightRef = useRef(null);
  const sweepLightRef = useRef(null);

  return (
    <Canvas
      shadows
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.6,
      }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Allow scrolling on top of the canvas
        zIndex: 5,
      }}
    >
      {/* 28 degree field of view: 50-70mm equivalent lens for luxury product look */}
      <PerspectiveCamera makeDefault fov={28} position={[0, 0, 9.5]} />

      {/* Fog to fade the model edges into the distance */}
      <fog attach="fog" args={['#050505', 8, 15]} />

      {/* STUDIO LIGHTING CONFIGURATION */}
      
      {/* Key Light: Large soft light, upper left, cool white */}
      <directionalLight
        ref={keyLightRef}
        color="#ffffff"
        intensity={0}
        position={[-3, 4, 3]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      {/* Fill Light: Very soft, low intensity, front */}
      <directionalLight
        ref={fillLightRef}
        color="#f2ebe3" // warm white fill
        intensity={0.1}
        position={[0, -1, 4]}
      />

      {/* Rim Light: Strong but diffused behind product for edge highlight */}
      <directionalLight
        ref={rimLightRef}
        color="#ffffff"
        intensity={0}
        position={[2, 2, -5]}
      />

      {/* Top Light: Very soft, outlines the top contours, avoids harsh shadows */}
      <directionalLight
        ref={topLightRef}
        color="#ffffff"
        intensity={0}
        position={[0, 5, 0]}
      />

      {/* Reflection Sweep Light: moves left-to-right to highlight steel/glass contours */}
      <directionalLight
        ref={sweepLightRef}
        color="#ffffff"
        intensity={0}
        position={[-5, 0.5, 3]}
      />

      {/* Ambient base lighting */}
      <ambientLight intensity={0.03} color="#050505" />

      {/* Center and Render Product Model */}
      {/* Shift right on desktop (x = 1.0) so it sits alongside the left-aligned hero text */}
      <group position={[1.0, -0.1, 0]}>
        <Center>
          <Product modelRef={productRef} />
        </Center>
      </group>

      {/* Postprocessing: Volumetric atmosphere, subtle bloom, and subtle depth of field */}
      <EffectComposer>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.7}
          luminanceSmoothing={0.3}
          mipmapBlur
        />
        <DepthOfField
          focusDistance={0.88}
          focalLength={0.25}
          bokehScale={1.5}
        />
      </EffectComposer>

      {/* Coordinate GSAP timeline attributes with R3F render loop */}
      <SceneController
        stateRef={stateRef}
        productRef={productRef}
        keyLightRef={keyLightRef}
        rimLightRef={rimLightRef}
        topLightRef={topLightRef}
        fillLightRef={fillLightRef}
        sweepLightRef={sweepLightRef}
      />
    </Canvas>
  );
};

export default ProductScene;
