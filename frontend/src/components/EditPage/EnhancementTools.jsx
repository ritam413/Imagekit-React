import React, { useState , useEffect } from 'react';
import { AdjustmentSlider,PresetButton } from './EnhancementToolsIcon';
import { useImageStore } from '../../zustand/image.store';


export const EnhancementTools = () => {
    // State for various image adjustment values
    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(0);
    const [saturation, setSaturation] = useState(0);
    const [exposure, setExposure] = useState(0);
    const [warmth, setWarmth] = useState(0);
    const [sharpen, setSharpen] = useState(0);
    const [vignette, setVignette] = useState(0);
    const [clarity, setClarity] = useState(0);

    // State for active filter preset
    const [activeFilter, setActiveFilter] = useState('none');

    
    const activeImage = useImageStore((state) => state.activeImage)
    const updateActiveImageState = useImageStore((state)=>state.updateActiveImageState)
    useEffect(()=>{
        if(activeImage)
        {
            updateActiveImageState({
                sharpen,warmth,vignette,clarity,exposure,saturation,contrast,brightness
            })
        }
    },[sharpen, warmth, vignette, clarity, exposure, saturation, contrast, brightness, activeImage])

    // Dummy filter presets for demonstration
    const filters = [
        { name: 'None', value: 'none', icon: '✨' },
        { name: 'Warm', value: 'warm', icon: '☀️' },
        { name: 'Cool', value: 'cool', icon: '🧊' },
        { name: 'Vintage', value: 'vintage', icon: '🎞️' },
        { name: 'B&W', value: 'bnw', icon: '⚫⚪' },
        { name: 'Dramatic', value: 'dramatic', icon: '🎭' },
    ];

    const handleFilterClick = (filterValue) => {
        setActiveFilter(filterValue);
        // In a real app, you would apply the filter effects to the image here.
        console.log(`Applying filter: ${filterValue}`);
    };

    const handleReset = () => {
        setBrightness(0);
        setContrast(0);
        setSaturation(0);
        setExposure(0);
        setWarmth(0);
        setSharpen(0);
        setVignette(0);
        setClarity(0);
        setActiveFilter('none');
        console.log("All enhancements reset.");
    };

    const handleApplyChanges = () => {
        // Here you would typically send all current adjustment values and the active filter
        // to a function that processes the image on the canvas or backend.
        const currentEnhancements = {
            brightness, contrast, saturation, exposure, warmth, sharpen, vignette, clarity, activeFilter
        };
        console.log("Applying current enhancements:", currentEnhancements);
        // show a toast or notification upon successful application
    };


    return (
        <div className="flex flex-col gap-6 text-white h-full font-sans">
            <h2 className="text-xl font-semibold text-slate-200 mt-2 text-center">Image Enhancements</h2>

            {/* Filter Presets Section */}
            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-slate-400">FILTERS</h3>
                <div className="grid grid-cols-3 gap-2">
                    {filters.map(filter => (
                        <PresetButton
                            key={filter.value}
                            label={filter.name}
                            isActive={activeFilter === filter.value}
                            onClick={() => handleFilterClick(filter.value)}
                            icon={filter.icon}
                        />
                    ))}
                </div>
            </div>

            {/* Adjustment Sliders Section */}
            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-slate-400">ADJUSTMENTS</h3>
                <AdjustmentSlider
                    label="Brightness"
                    value={brightness}
                    min="-100" max="100" step="1"
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                />
                <AdjustmentSlider
                    label="Contrast"
                    value={contrast}
                    min="-100" max="100" step="1"
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                />
                <AdjustmentSlider
                    label="Saturation"
                    value={saturation}
                    min="-100" max="100" step="1"
                    onChange={(e) => setSaturation(parseInt(e.target.value))}
                />
                <AdjustmentSlider
                    label="Exposure"
                    value={exposure}
                    min="-100" max="100" step="1"
                    onChange={(e) => setExposure(parseInt(e.target.value))}
                />
                <AdjustmentSlider
                    label="Warmth"
                    value={warmth}
                    min="-100" max="100" step="1"
                    onChange={(e) => setWarmth(parseInt(e.target.value))}
                />
                <AdjustmentSlider
                    label="Sharpen"
                    value={sharpen}
                    min="0" max="100" step="1"
                    onChange={(e) => setSharpen(parseInt(e.target.value))}
                />
                <AdjustmentSlider
                    label="Vignette"
                    value={vignette}
                    min="0" max="100" step="1"
                    onChange={(e) => setVignette(parseInt(e.target.value))}
                />
                <AdjustmentSlider
                    label="Clarity"
                    value={clarity}
                    min="0" max="100" step="1"
                    onChange={(e) => setClarity(parseInt(e.target.value))}
                />
            </div>

            {/* Action Buttons */}
            <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-slate-700">
                <button
                    onClick={handleReset}
                    className="w-full py-2.5 text-center bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors font-semibold"
                >
                    Reset All
                </button>
                <button
                    onClick={handleApplyChanges}
                    className="w-full py-2.5 text-center bg-purple-600 hover:bg-pueple-700 rounded-lg transition-colors font-semibold"
                >
                    Apply Enhancements
                </button>
            </div>
        </div>
    );
};


