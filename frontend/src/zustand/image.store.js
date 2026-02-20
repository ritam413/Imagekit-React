import { create } from 'zustand'

export const useImageStore = create((set, get) => ({
    
    uploadedImages: [],
    setUploadedImages: (images) => set({ uploadedImages: images }),

    activeImage: "",
    setActiveImage: (imageUrl) => set({ activeImage: imageUrl }),

    
    imageStates:{},
    updateActiveImageState:(newStates)=>{
        const activeId = get().activeImage;
        if(!activeId) return;

        set((state)=>({
            imageStates:{
                ...state.imageStates,
                [activeId]:{
                    ...(state.imageStates[activeId] || {}) || {rotation:0,crop:{x:0,y:0}},
                    ...newStates
                }
            }
        }))
    },

    transformations: {},
    addTransformation: (originalUrl, transformedUrl, type) => {
        const prev = get().transformations
        set({
            transformations: {
                ...prev,
                [originalUrl]: [
                    ...(prev[originalUrl] || []),
                { url: transformedUrl, type: type }
                ]
            },
            activeImage: transformedUrl
        });
    }
    
}))

