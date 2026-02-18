// Create a new file: src/components/Canvas.jsx

import { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useImageStore } from "../../zustand/image.store.js";
import { useEditStore } from "../../zustand/editpage.store.js";
import ImageEditor from "./Crop/ImageEditor.jsx";
import * as fabric from "fabric";
import fabricJsBackend from "../../utils/fabricjsBackend.js";
export default function Canvas({ }) {
  const fabricRef = useRef(null)
  const canvasRef = useRef(null)
  const activeImage = useImageStore((state) => state.activeImage)
  const setActiveImage = useImageStore((state) => state.setActiveImage);
  const visiblePanel = useEditStore().visiblePanel
  const containerRef = useRef(null)


  useEffect(() => {

    if (!canvasRef.current) return
    const { clientWidth, clientHeight } = containerRef.current

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: clientWidth,
      height: clientHeight
    })

    fabricRef.current = canvas
    fabricJsBackend();

    console.log("Backend being used is: ", fabric.getFilterBackend())

    const handleResize = () => {
      const { clientHeight: newHeight, clientWidth: newWidth } = containerRef.current
      canvas.setDimensions({ width: newWidth, height: newHeight })
      canvas.renderAll()
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.dispose()
    }
  }, [])



  const loadImageFromUrl = async (url) => {
    const canvas = fabricRef.current

    if (!canvas) return;
    try {
      const img = await fabric.FabricImage.fromURL(url, {
        controls: fabric.FabricImage.createControls().controls,
        crossOrigin: 'anonymous'
      })

      // 1. Get container dimensions
      const maxWidth = containerRef.current.clientWidth;
      const maxHeight = containerRef.current.clientHeight;

      // 2. Calculate scale factors (using 0.9 to leave a 10% padding buffer)
      const scaleX = (maxWidth * 0.9) / img.width;
      const scaleY = (maxHeight * 0.9) / img.height;

      // 3. Use the smaller scale factor to ensure it fits both ways
      const finalScale = Math.min(scaleX, scaleY);

      img.scale(finalScale);
      canvas.add(img)
      canvas.centerObject(img)
      canvas.setActiveObject(img)

      canvas.requestRenderAll()

    } catch (err) {
      console.log("Couldnt load Image from url", err)
    }
  }

  useEffect(() => {
    if (activeImage) loadImageFromUrl(activeImage)
  }, [activeImage])

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-base-100 rounded-lg flex items-center justify-center shadow-inner overflow-auto relative">
      {!activeImage ?
        <p className="text-base-content/50">Your Image Will Appear Here</p>
        :
        <>
          <RxCross2
            size={30}
            className="absolute top-3 right-3 text-xl text-base-content/70 cursor-pointer hover:text-base-content transition hover:scale-105" onClick={() => { setActiveImage('') }} />
          {/* {visiblePanel === "crop"
            ?
            // <ImageEditor className="max-w-full max-h-[80vh] overflow-auto flex items-center justify-center" /> 
            " "
            :
            <img src={activeImage} alt="Editing canvas" className="max-w-full max-h-full" />
           } */}
          <div

            className="max-w-full max-h-full"
          >
            <canvas ref={canvasRef} />
          </div>

        </>
      }
      {/* Example of where the image would go */}
    </div>
  );
}