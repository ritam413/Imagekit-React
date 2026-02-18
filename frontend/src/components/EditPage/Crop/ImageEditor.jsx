// src/components/Editor/ImageEditor.jsx
// MODIFIED to accept fileSrc as a prop and remove file inputs

import React, { useState, useEffect, useRef } from 'react';
// Note: We are NOT importing ImageInput
import { useImageStore } from '../../../zustand/image.store';
import PreviewDisplay from './PreviewDisplay.jsx';
import CropContainer from './CropContainer.jsx';
import fabricJsBackend from '../../../utils/fabricjsBackend.js';

// Accept fileSrc from props
export default function ImageEditor() {
  // UI state
  fabricJsBackend();
  const [fileSrc, setFileSrc] = useState(''); // data URL or external url
  const [showPreview, setShowPreview] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState('');

  const activeImage = useImageStore((state) => state.activeImage)

  // Image state
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [displayedSize, setDisplayedSize] = useState({ w: 0, h: 0 });

  // Edit state
  const rotationState = useImageStore((state) => state.rotation);
  const setRotationState = useImageStore((state) => state.setRotation);
  const [rotation, setRotation] = useState(0);

  const canvasref = useRef(null);
  const imgRef = useRef(null);
  
  const [crop, setCrop] = useState({ x: 50, y: 50, w: 200, h: 200 })

  const setCropState = useImageStore((state) => state.setCrop);
  // When the prop from Zustand changes, update the internal state
  useEffect(() => {
    if (activeImage) {
      setFileSrc(activeImage);
      resetState();
    }
  }, [activeImage]); // Re-run when the active image changes

  function resetState() {
    setShowPreview(false);
    setPreviewDataUrl('');
    setRotation(0);
  }

  // 2. --- Image Load Handler ---
  function onImageLoad(img) {
    const dispW = img.clientWidth;
    const dispH = img.clientHeight;
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    setDisplayedSize({ w: dispW, h: dispH });
    const size = Math.min(dispW, dispH) * 0.6;
    setCrop({
      x: (dispW - size) / 2,
      y: (dispH - size) / 2,
      w: size,
      h: size,
    });
  }

  const addImagefromUrl = () =>{
    
  }

 
  return (
    // This component now just renders the editor UI, not the page title or file inputs
    <div className="bg-base-200 rounded p-3 max-w-full max-h-full flex flex-col">
          <CropContainer
            fileSrc={fileSrc}
            rotation={rotation}
            crop={crop}
            onCropChange={setCrop}
            onImageLoad={onImageLoad}
          />


      <PreviewDisplay
        showPreview={showPreview}
        previewDataUrl={fileSrc}
      />
    </div>
  );
}