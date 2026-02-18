import * as fabric from 'fabric';

export default function fabricJsBackend(){
    
    const limit = fabric.config.textureSize || 2048

    console.log("limit: ",limit)

    try{
        const backend = new fabric.WebGLFilterBackend({tileSize:limit})
        fabric.setFilterBackend(backend)
        
        console.log("Backend set with size : ",limit);
    }catch(err){
        console.log("Error setting backend: ",err)
        fabric.setFilterBackend(new fabric.Canvas2dFilterBackend())
    }

}