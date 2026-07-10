import React, { useLayoutEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const Product = ({ modelRef }) => {
  // Preload and use model from the public directory
  const { scene } = useGLTF('/HEER_AS-10-1000010.glb');

  useLayoutEffect(() => {
    // Calculate bounding box of the scene to normalize and scale up the model
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Scale the model so its maximum dimension is 5.0
    const targetDim = 5.0;
    const scaleFactor = targetDim / (maxDim || 1);
    scene.scale.setScalar(scaleFactor);

    // Calculate height bounds for relative material assignment
    box.setFromObject(scene);
    const minY = box.min.y;
    const maxY = box.max.y;
    const totalHeight = maxY - minY || 1;

    // Procedural Linear Purple-to-Black Gradient Texture for the bottom base
    const baseCanvas = document.createElement('canvas');
    baseCanvas.width = 256;
    baseCanvas.height = 256;
    const baseCtx = baseCanvas.getContext('2d');
    
    // Bottom of the base (256) is rich deep violet, fading upwards to black (0)
    const baseGrad = baseCtx.createLinearGradient(0, 256, 0, 0);
    baseGrad.addColorStop(0, '#5a1294'); // rich deep metallic purple
    baseGrad.addColorStop(0.35, '#2b064c'); // dark indigo purple
    baseGrad.addColorStop(0.75, '#121214'); // fade to black
    baseGrad.addColorStop(1, '#121214');
    
    baseCtx.fillStyle = baseGrad;
    baseCtx.fillRect(0, 0, 256, 256);
    
    const purpleTexture = new THREE.CanvasTexture(baseCanvas);
    purpleTexture.wrapS = THREE.RepeatWrapping;
    purpleTexture.wrapT = THREE.RepeatWrapping;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          // Get the mesh center Y coordinate in world space
          const childBox = new THREE.Box3().setFromObject(child);
          const childCenterY = childBox.getCenter(new THREE.Vector3()).y;
          
          // Determine percentage position from bottom (0.0) to top (1.0)
          const pctY = (childCenterY - minY) / totalHeight;

          if (pctY > 0.65) {
            // 1. TOP CAP: Matte charcoal black (top 35% of model)
            child.material = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color('#1c1c1e'),
              metalness: 0.1,
              roughness: 0.68,
              clearcoat: 0.0,
              reflectivity: 0.2,
            });
          } else if (pctY > 0.3) {
            // 2. MIDDLE BODY / BUTTONS: Glossy dark chrome/black
            child.material = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color('#151516'),
              metalness: 0.9,
              roughness: 0.18,
              clearcoat: 0.35,
              clearcoatRoughness: 0.05,
              reflectivity: 0.95,
              envMapIntensity: 2.8,
            });
          } else {
            // 3. BOTTOM BASE: Metallic purple-to-black gradient (bottom 30%)
            child.material = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color('#ffffff'), // neutral to show gradient map
              map: purpleTexture,
              metalness: 0.98,
              roughness: 0.15,
              clearcoat: 0.5,
              clearcoatRoughness: 0.08,
              reflectivity: 0.98,
              envMapIntensity: 3.0, // strong highlights on the base curve
            });
          }
        }
      }
    });
  }, [scene]);

  return (
    <group ref={modelRef}>
      <primitive object={scene} />
    </group>
  );
};

// Preload the model to improve instant load experience
useGLTF.preload('/HEER_AS-10-1000010.glb');

export default Product;
