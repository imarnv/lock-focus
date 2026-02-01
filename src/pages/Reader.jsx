import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, Type, AlignLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Reader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { content, settings: importedSettings, fileName } = location.state || {};

    const [text, setText] = useState(content || "Paste your text here or start typing to experience the adaptive reading mode. Neuro-inclusive design helps reduce cognitive load by offering customizable text formatting options.");

    const [settings, setSettings] = useState({
        fontSize: 18,
        lineHeight: 1.8,
        letterSpacing: 0.5,
        maxWidth: 700,
        focusMode: false,
        font: 'inter',
        ...importedSettings // Merge imported settings
    });
    const [showSettings, setShowSettings] = useState(true);

    const toggleFocusMode = () => {
        setSettings(prev => ({ ...prev, focusMode: !prev.focusMode }));
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 ${settings.focusMode ? 'bg-zinc-900 text-gray-300' : 'bg-gray-50 text-gray-900'}`}>
            {/* Header */}
            <header className={`fixed top-0 w-full z-40 px-6 py-4 flex items-center justify-between transition-colors ${settings.focusMode ? 'bg-zinc-900/90' : 'bg-white/80'} backdrop-blur-md border-b ${settings.focusMode ? 'border-zinc-800' : 'border-gray-200'}`}>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className={`p-2 rounded-full transition-colors ${settings.focusMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'}`}>
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col">
                        <span className="font-bold tracking-tight">Adaptive Reader</span>
                        {fileName && <span className="text-xs text-primary font-medium">Optimized for: {fileName}</span>}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleFocusMode}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${settings.focusMode ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {settings.focusMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        Focus Mode
                    </button>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100'}`}
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="pt-24 pb-32 flex justify-center">
                <main
                    className="px-6 transition-all duration-300"
                    style={{ maxWidth: settings.maxWidth }}
                >
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className={`w-full h-[70vh] resize-none bg-transparent outline-none transition-all duration-300 selection:bg-primary/30`}
                        style={{
                            fontSize: `${settings.fontSize}px`,
                            lineHeight: settings.lineHeight,
                            letterSpacing: `${settings.letterSpacing}px`,
                            fontFamily: settings.font === 'dyslexic' ? 'OpenDyslexic, sans-serif' : 'Inter, sans-serif'
                        }}
                        placeholder="Start writing..."
                    />
                </main>
            </div>

            {/* Settings Panel */}
            <motion.div
                initial={false}
                animate={{ x: showSettings ? 0 : 320, opacity: showSettings ? 1 : 0.5 }}
                className={`fixed right-0 top-24 w-80 bg-white shadow-2xl rounded-l-2xl border-l border-gray-100 p-6 z-30 h-[calc(100vh-120px)] overflow-y-auto ${settings.focusMode ? 'bg-zinc-900 border-zinc-800 text-gray-200' : ''}`}
            >
                <div className="space-y-8">
                    {/* Font Size */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Type className="w-4 h-4" /> Size
                            </label>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{settings.fontSize}px</span>
                        </div>
                        <input
                            type="range" min="14" max="32" step="1"
                            value={settings.fontSize}
                            onChange={(e) => setSettings({ ...settings, fontSize: Number(e.target.value) })}
                            className="w-full accent-primary"
                        />
                    </div>

                    {/* Line Height */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <AlignLeft className="w-4 h-4" /> Spacing
                            </label>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{settings.lineHeight}</span>
                        </div>
                        <input
                            type="range" min="1.2" max="2.5" step="0.1"
                            value={settings.lineHeight}
                            onChange={(e) => setSettings({ ...settings, lineHeight: Number(e.target.value) })}
                            className="w-full accent-primary"
                        />
                    </div>

                    {/* Width */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold flex items-center gap-2">
                                Width
                            </label>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{settings.maxWidth}px</span>
                        </div>
                        <input
                            type="range" min="400" max="1000" step="50"
                            value={settings.maxWidth}
                            onChange={(e) => setSettings({ ...settings, maxWidth: Number(e.target.value) })}
                            className="w-full accent-primary"
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Reader;
