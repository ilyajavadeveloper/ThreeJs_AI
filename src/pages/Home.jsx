import React from 'react'
import {motion, AnimatePresence} from 'framer-motion'

import state from '../store'

import {useSnapshot} from "valtio";
import {
    headContainerAnimation,
    headContentAnimation,
    headTextAnimation,
    slideAnimation
} from '../config/motion.js'

const Home = () => {
    const snap = useSnapshot(state)


    return (
        <div>
            Home
        </div>
    )
}
export default Home
