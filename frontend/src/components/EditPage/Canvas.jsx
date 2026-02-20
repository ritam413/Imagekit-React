// Create a new file: src/components/Canvas.jsx

import { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useImageStore } from "../../zustand/image.store.js";
import { useEditStore } from "../../zustand/editpage.store.js";
import ImageEditor from "./Crop/ImageEditor.jsx";
import {contraintToBoudary} from '../../components/EditPage/Crop/CropHelperFunc.jsx'
import * as fabric from "fabric";
import fabricJsBackend from "../../utils/fabricjsBackend.js";
export default function Canvas({ }) {

  const fabricRef = useRef(null)
  const canvasRef = useRef(null)
  const activeImage = useImageStore((state) => state.activeImage)
  const setActiveImage = useImageStore((state) => state.setActiveImage);
  const imageStates = useImageStore((state)=>state.imageStates)
  const containerRef = useRef(null)
  const imgRef = useRef(null)
  const [cropBox,setCropBox] = useState(null);
  const visiblePanel = useEditStore((state) => state.visiblePanel);
  
  console.log("visiblePanel: ",visiblePanel)
  //! Setting UP my Canvas to Use in Editing
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
  //! FUnction to actaully load the Image in the Canvas
  const loadImageFromUrl = async (url) => {
    const canvas = fabricRef.current

    if (!canvas) return;
    try {
      canvas.clear();
      // 1. Load the image
      const img = await fabric.FabricImage.fromURL(url, {
        controls: fabric.FabricImage.createControls().controls,
        crossOrigin: 'anonymous'
      })

      // 2. Calculate scale factors (using 0.9 to leave a 10% padding buffer)
      const scaleX = ((containerRef.current.clientWidth) * 0.9) / img.width;
      const scaleY = ((containerRef.current.clientHeight) * 0.9) / img.height;

      // 3. Use the smaller scale factor to ensure it fits both ways
      const finalScale = Math.min(scaleX, scaleY);

      img.scale(finalScale);
      // img.isMoving=false;
      // img.selectable=false
      canvas.add(img)
      canvas.centerObject(img)
      canvas.setActiveObject(img)
      imgRef.current = img
      canvas.requestRenderAll()

    } catch (err) {
      console.log("Couldnt load Image from url", err)
    }
  }
  //*Looking for changes in active image and calling my display function to display theimage
  useEffect(() => {
    if (activeImage) loadImageFromUrl(activeImage)
  }, [activeImage])


  //* Checking the current ImageState , observe if it is being set or not
  useEffect(()=>{
    console.log("Sates of Image current image is: ",imageStates)
  },[imageStates])


  //!gettingg live Dimention of the Image to set the crop Container
  const getLiveDimensions=() =>{
    if(!imgRef.current) return

    const obj = imgRef.current

    return{
      displayWidth:obj.getScaledWidth(),
      displayHeight:obj.getScaledHeight(),

      left:obj.left,
      top:obj.top,

      scaleX:obj.scaleX,
      scaleY:obj.scaleY
    }

  }
  //! Actuall CropBox Overlay which we can see
  const toggleCropbox = (isActive)=>{
    const canvas = fabricRef.current
    if(!canvas) return;

    const dimestions = getLiveDimensions()

    if(isActive){
      const rect = new fabric.Rect({
        width: dimestions.displayWidth,
        height: dimestions.displayHeight,
        fill:'rgba(0,0,0,0.1)',
        stroke:'#fff',
        strokeDashArray:[5,5],
        strokeWidth:2,
        cornerColor:'#3b82f6',
        transparentCorners:false,
        RotatingPoint:false,
      })
      rect.setControlVisible('mtr',false)
      canvas.add(rect)
      canvas.centerObject(rect)
      canvas.setActiveObject(rect)
      setCropBox(rect);
    }else{
      if(cropBox){
        canvas.remove(cropBox)
        setCropBox(null)
      }
    }

  }
  //*Toggling ON/OFF CropBox according to the Current Panel
  useEffect(()=>{
    toggleCropbox(visiblePanel === 'crop')
  },[visiblePanel])


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