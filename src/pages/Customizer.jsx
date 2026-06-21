import 'react'
import {useState,useEffect} from "react";
import {AnimatePresence,motion} from "framer-motion";
import {useSnapshot} from "valtio";

import config from "../config/config.js";
import state from '../store'
import {download} from '../assets'
import {downloadCanvasToImage,reader} from "../config/helpers.js";
import {EditorTabs,FilterTabs,DecalTypes} from "../config/constants.js";
import {fadeAnimation,slideAnimation} from "../config/motion.js";
import {AIPicker,ColorPicker,CustomButton,FilePicker,Tab} from '../components'

const Customizer = () => {

    const snap=useSnapshot(state)
    return (
        <AnimatePresence>
            {!snap.intro &&(
                <>
                    <motion.div
                    key='custom'
                    custom='absolute top-0 left-0 z-10'
                    {...slideAnimation('left')}
                    >
                        <div className='flex items-center min-h-screen'>
<div className='editortabs-container tabs '>
    {EditorTabs.map((tab)=>(
        <Tab
        key={tab.name}
        tab={tab}
        handleClick={()=>{}}
        />
       ))}
</div>
                        </div>
                    </motion.div>
                    <motion.div className='absolute z-10 top-5 right-5'
                                {...fadeAnimation}>

                        <CustomButton
                            type='filled'
                            title='Go Back'
                            handleClick={()=>{}}

                        />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
export default Customizer
