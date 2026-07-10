import React, { useRef, useEffect } from 'react';
import '@google/model-viewer';

const ModelViewer = ({ src, alt = "3D Model" }) => {
  const modelRef = useRef(null);

  useEffect(() => {
    const modelViewer = modelRef.current;
    if (!modelViewer) return;

    const applyMatteBlack = () => {
      const materials = modelViewer.model?.materials;
      if (materials) {
        materials.forEach(material => {
          if (material.pbrMetallicRoughness) {
            // Deep matte black
            material.pbrMetallicRoughness.setBaseColorFactor([0.02, 0.02, 0.02, 1]);
            material.pbrMetallicRoughness.setRoughnessFactor(0.85);
            material.pbrMetallicRoughness.setMetallicFactor(0.3);
          }
        });
      }
    };

    // Apply immediately if already loaded
    if (modelViewer.model) {
      applyMatteBlack();
    }
    
    modelViewer.addEventListener('load', applyMatteBlack);

    return () => {
      modelViewer.removeEventListener('load', applyMatteBlack);
    };
  }, []);

  return (
    <div style={{ 
      width: '100%', 
      height: '500px', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      animation: 'softHover 4s ease-in-out infinite alternate'
    }}>
      <style>
        {`
          @keyframes softHover {
            from { transform: translateY(10px); }
            to { transform: translateY(-10px); }
          }
        `}
      </style>
      <model-viewer
        ref={modelRef}
        src={src}
        alt={alt}
        interaction-prompt="none"
        shadow-intensity="2"
        shadow-softness="0.2"
        environment-image="legacy"
        exposure="1.1"
        camera-orbit="90deg 90deg 75%"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
      >
      </model-viewer>
    </div>
  );
};

export default ModelViewer;
