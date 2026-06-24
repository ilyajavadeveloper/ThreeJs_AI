import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state from '../store';
import { reader } from '../config/helpers';
import {
    EditorTabs,
    FilterTabs,
    DecalTypes,
} from '../config/constants';
import {
    fadeAnimation,
    slideAnimation,
} from '../config/motion';

import {
    AIPicker,
    ColorPicker,
    CustomButton,
    FilePicker,
    Tab,
} from '../components';

const Customizer = () => {
    const snap = useSnapshot(state);

    const [file, setFile] = useState('');
    const [prompt, setPrompt] = useState('');
    const [generatingImg, setGeneratingImg] = useState(false);

    const [activeEditorTab, setActiveEditorTab] = useState('');

    const [activeFilterTab, setActiveFilterTab] = useState({
        logoShirt: true,
        stylishShirt: false,
    });

    const handleActiveFilterTab = (tabName) => {
        switch (tabName) {
            case 'logoShirt':
                state.isLogoTexture = !activeFilterTab[tabName];
                break;

            case 'stylishShirt':
                state.isFullTexture = !activeFilterTab[tabName];
                break;

            default:
                state.isLogoTexture = true;
                state.isFullTexture = false;
                break;
        }

        setActiveFilterTab((previousState) => ({
            ...previousState,
            [tabName]: !previousState[tabName],
        }));
    };

    const handleDecals = (type, result) => {
        const decalType = DecalTypes[type];

        if (!decalType) {
            throw new Error(`Unknown decal type: ${type}`);
        }

        if (!result) {
            throw new Error('Image data is empty');
        }

        state[decalType.stateProperty] = result;

        if (!activeFilterTab[decalType.filterTab]) {
            handleActiveFilterTab(decalType.filterTab);
        }
    };

    const handleSubmit = async (type) => {
        const cleanPrompt = prompt.trim();

        if (!cleanPrompt) {
            alert('Please enter a prompt');
            return;
        }

        try {
            setGeneratingImg(true);

            const response = await fetch(
                'http://localhost:8080/api/v1/dalle',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: cleanPrompt,
                    }),
                }
            );

            let data;

            try {
                data = await response.json();
            } catch {
                throw new Error('Server returned an invalid response');
            }

            console.log('Image API response:', {
                status: response.status,
                ok: response.ok,
                data,
            });

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    `Image generation failed with status ${response.status}`
                );
            }

            if (!data?.photo || typeof data.photo !== 'string') {
                throw new Error('Server did not return image data');
            }

            const imageUrl = `data:image/png;base64,${data.photo}`;

            handleDecals(type, imageUrl);

            setPrompt('');
            setActiveEditorTab('');
        } catch (error) {
            console.error('Image generation error:', error);

            const message =
                error instanceof Error
                    ? error.message
                    : 'Something went wrong';

            alert(message);
        } finally {
            setGeneratingImg(false);
        }
    };

    const readFile = (type) => {
        if (!file) {
            alert('Please select a file');
            return;
        }

        reader(file)
            .then((result) => {
                handleDecals(type, result);
                setActiveEditorTab('');
            })
            .catch((error) => {
                console.error('File reading error:', error);
                alert('Could not read the selected file');
            });
    };

    const generateTabContent = () => {
        switch (activeEditorTab) {
            case 'colorpicker':
                return <ColorPicker />;

            case 'filepicker':
                return (
                    <FilePicker
                        file={file}
                        setFile={setFile}
                        readFile={readFile}
                    />
                );

            case 'aipicker':
                return (
                    <AIPicker
                        prompt={prompt}
                        setPrompt={setPrompt}
                        generatingImg={generatingImg}
                        handleSubmit={handleSubmit}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {!snap.intro && (
                <>
                    <motion.div
                        key="custom"
                        className="absolute top-0 left-0 z-10"
                        {...slideAnimation('left')}
                    >
                        <div className="flex items-center min-h-screen">
                            <div className="editortabs-container tabs">
                                {EditorTabs.map((tab) => (
                                    <Tab
                                        key={tab.name}
                                        tab={tab}
                                        handleClick={() =>
                                            setActiveEditorTab(tab.name)
                                        }
                                    />
                                ))}

                                {generateTabContent()}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="absolute z-10 top-5 right-5"
                        {...fadeAnimation}
                    >
                        <CustomButton
                            type="filled"
                            title="Go Back"
                            handleClick={() => {
                                state.intro = true;
                            }}
                            customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                        />
                    </motion.div>

                    <motion.div
                        className="filtertabs-container"
                        {...slideAnimation('up')}
                    >
                        {FilterTabs.map((tab) => (
                            <Tab
                                key={tab.name}
                                tab={tab}
                                isFilterTab
                                isActiveTab={activeFilterTab[tab.name]}
                                handleClick={() =>
                                    handleActiveFilterTab(tab.name)
                                }
                            />
                        ))}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Customizer;