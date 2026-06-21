
import "react";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useSnapshot } from "valtio";

import config from "../config/config.js";
import state from "../store";
import { download } from "../assets";
import {
    downloadCanvasToImage,
    reader,
} from "../config/helpers.js";
import {
    EditorTabs,
    FilterTabs,
    DecalTypes,
} from "../config/constants.js";
import {
    fadeAnimation,
    slideAnimation,
} from "../config/motion.js";
import {
    AIPicker,
    ColorPicker,
    CustomButton,
    FilePicker,
    Tab,
} from "../components";

const Customizer = () => {
    const snap = useSnapshot(state);

    return (
        <AnimatePresence>
            {!snap.intro && (
                <>
                    <motion.div
                        key ='custom'
                        className='absolute top-0 left-0 z-10'
                        {...slideAnimation('left')}
                    >
                        <div flex items-center min-h-screen >
<div className='editortabs-container tabs'>
    {EditorTabs.map((tab, index) => (
        <Tab
        key={tab.name}
        tab={tab}
        handleClick={()=>{}}
        />
    ))}
</div>

                        </div>


                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Customizer;

