import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeDEye from '../components/ThreeDEye';
import { ArrowLeft, Check, ArrowRight, Play, Eye } from 'lucide-react';
import NerveAnimation from '../components/NerveAnimation';
import { useNavigate } from 'react-router-dom';

const TestStep = ({ title, description, children, onNext, isLast }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-2xl mx-auto"
        >
            <h2 className="text-3xl font-light mb-2">{title}</h2>
            <p className="text-gray-500 mb-8">{description}</p>
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm mb-8 min-h-[300px]">
                {children}
            </div>
            <div className="flex justify-end">
                <button
                    onClick={onNext}
                    className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors"
                >
                    {isLast ? 'Complete Scan' : 'Next Step'}
                    {isLast ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </button>
            </div>
        </motion.div>
    );
};

const ReactionTimeTest = ({ onComplete }) => {
    const [state, setState] = useState('waiting'); // waiting, ready, now, clicked, done, penalty
    const [startTime, setStartTime] = useState(0);
    const [times, setTimes] = useState([]);
    const [penalties, setPenalties] = useState(0);
    const [round, setRound] = useState(1);
    const [isTarget, setIsTarget] = useState(true); // true = GREEN (Go), false = RED (No-Go)

    // Config
    const TOTAL_ROUNDS = 8; // Increased rounds for reliability

    const startRound = useCallback(() => {
        setState('ready');
        // Random delay 1.5s - 4s
        const delay = 1500 + Math.random() * 2500;

        setTimeout(() => {
            // Randomly decide if this is a "Go" (Green) or "No-Go" (Red) trial
            // 70% chance of "Go" (Green), 30% chance of "No-Go" (Red)
            const isGoTrial = Math.random() > 0.3;
            setIsTarget(isGoTrial);
            setState('now');
            setStartTime(Date.now());

            // If it's a "No-Go" (Red), we need to auto-pass the round if they DON'T click after 2s
            if (!isGoTrial) {
                setTimeout(() => {
                    handleNoGoSuccess();
                }, 1500); // 1.5s window to NOT click
            }
        }, delay);
    }, []);

    const handleNoGoSuccess = () => {
        // User successfully inhibited (didn't click red)
        setState(current => {
            if (current === 'now') { // Only if they haven't clicked yet
                nextRound();
                return 'waiting';
            }
            return current;
        });
    };

    const nextRound = () => {
        if (round < TOTAL_ROUNDS) {
            setState('waiting');
            setRound(r => r + 1);
        } else {
            finishTest();
        }
    };

    const finishTest = () => {
        setState('done');
        // Filter out any missed or weird times
        const validTimes = times.length > 0 ? times : [500];
        const avg = Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length);

        // Penalty calculation: Add 100ms for each false start/wrong click
        const finalScore = avg + (penalties * 100);
        onComplete(finalScore);
    };

    const handleClick = () => {
        if (state === 'now') {
            if (isTarget) {
                // Correct "Go" click
                const time = Date.now() - startTime;
                setTimes([...times, time]);
                nextRound();
            } else {
                // "No-Go" Fail (Clicked Red)
                setPenalties(p => p + 1);
                setState('penalty'); // Show "X" or feedback
                setTimeout(() => nextRound(), 500);
            }
        } else if (state === 'ready') {
            // False Start (Clicked too early)
            setPenalties(p => p + 1);
            alert("Too early! Wait for the signal.");
            setState('waiting');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-80 gap-6">
            <div className="flex justify-between w-full max-w-md px-4 text-sm font-bold text-gray-400 uppercase tracking-widest">
                <span>Round {round} / {TOTAL_ROUNDS}</span>
                <span className="text-red-400">Errors: {penalties}</span>
            </div>

            {state === 'waiting' && (
                <button onClick={startRound} className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-xl hover:scale-105 transition-transform shadow-lg shadow-blue-500/30">
                    {round === 1 ? 'Start Inhibition Test' : 'Next Round'}
                </button>
            )}

            {state === 'ready' && (
                <div
                    onClick={handleClick}
                    className="w-full h-full max-h-48 bg-gray-200 rounded-2xl flex items-center justify-center cursor-pointer text-gray-500 font-bold text-2xl animate-pulse shadow-inner border-4 border-dashed border-gray-300"
                >
                    Wait for proper signal...
                </div>
            )}

            {(state === 'now' || state === 'penalty') && (
                <div
                    onClick={handleClick}
                    className={`w-full h-full max-h-48 rounded-2xl flex flex-col items-center justify-center cursor-pointer text-white font-bold text-4xl shadow-xl transform transition-all duration-100 ${state === 'penalty' ? 'bg-red-800 scale-95' :
                            isTarget ? 'bg-green-500 scale-105' : 'bg-red-500' // Green = Go, Red = Don't Go
                        }`}
                >
                    {state === 'penalty' ? (
                        <>
                            <span>❌</span>
                            <span className="text-lg mt-2">Don't click RED!</span>
                        </>
                    ) : isTarget ? 'CLICK!' : 'AWAIT...'}
                </div>
            )}

            {state === 'done' && (
                <div className="text-center animate-bounce-in">
                    <p className="text-lg text-gray-500 mb-2">Cognitive Response Time</p>
                    <p className="text-5xl font-black text-primary">{Math.round(times.reduce((a, b) => a + b, 0) / (times.length || 1))}ms</p>
                    <p className="text-sm text-red-500 mt-2 font-bold">Inhibition Errors: {penalties}</p>
                </div>
            )}

            <p className="text-xs text-center max-w-xs text-gray-400 mt-4">
                <strong>Instructions:</strong> Click <span className="text-green-600 font-bold">GREEN</span> boxes fast. Do <u>NOT</u> click <span className="text-red-500 font-bold">RED</span> boxes.
            </p>
        </div>
    );
};

const ASRSQuestion = ({ question, options = ["Never", "Rarely", "Sometimes", "Often", "Very Often"] }) => {
    const [selected, setSelected] = useState(null);
    return (
        <div className="space-y-4">
            <h3 className="font-medium text-lg">{question}</h3>
            <div className="grid grid-cols-5 gap-2">
                {options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => setSelected(i)}
                        className={`py-4 rounded-xl text-base font-medium transition-all ${selected === i ? 'bg-primary text-white shadow-lg scale-105' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105'}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

const ContrastTest = ({ onComplete }) => {
    const [level, setLevel] = useState(1); // 1 to 5, 5 is hardest
    const [targetNumber, setTargetNumber] = useState(8);

    // Opacity levels: 0.1 (hardest) to 0.5 (easiest) - relative to background difference
    // Actually let's use text colors that get closer to bg #f3f4f6 (gray-100)
    // Gray-100 is approx #f3f4f6.
    // Level 1: #374151 (Gray 700) - Easy
    // Level 2: #9ca3af (Gray 400)
    // Level 3: #d1d5db (Gray 300)
    // Level 4: #e5e7eb (Gray 200) - Hard
    // Level 5: #f3f4f6 (Gray 100) - Invisible almost (using #f0f0f0 for distinct but hard)

    const colors = [
        '#374151',
        '#9ca3af',
        '#d1d5db',
        '#e5e7eb',
        '#eff0f2', // Very close to #f3f4f6
    ];

    const generateRound = useCallback(() => {
        const num = Math.floor(Math.random() * 9) + 1; // 1-9
        setTargetNumber(num);
    }, []);

    const handleGuess = (guess) => {
        if (guess === targetNumber) {
            if (level < 5) {
                setLevel(l => l + 1);
                generateRound();
            } else {
                // Completed all levels
                onComplete('Superior');
            }
        } else {
            // Failed at this level, performance is previous level
            const result = level === 1 ? 'Low' : level === 2 ? 'Below Average' : level === 3 ? 'Average' : level === 4 ? 'High' : 'Superior';
            onComplete(result);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-64 gap-6">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Level {level} / 5
            </div>

            <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <span
                    className="text-6xl md:text-9xl font-bold select-none transition-colors duration-500"
                    style={{ color: colors[level - 1] }}
                >
                    {targetNumber}
                </span>
            </div>

            <div className="grid grid-cols-5 gap-2 w-full max-w-md">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                        key={num}
                        onClick={() => handleGuess(num)}
                        className="py-2 rounded-lg border border-gray-200 hover:bg-white hover:shadow-md transition-all font-bold text-gray-600"
                    >
                        {num}
                    </button>
                ))}
                <button
                    onClick={() => handleGuess(-1)} // Force fail/skip
                    className="col-span-5 text-xs text-gray-400 hover:text-gray-600 mt-2"
                >
                    I can't see it
                </button>
            </div>
        </div>
    );
};

const FocusScan = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);

    // Timer
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [wpm, setWpm] = useState(0);
    const textWordCount = 60;

    // Preferences
    const [measures, setMeasures] = useState({
        reaction: 0,
        crowding: 'standard',
        contrast: 'Pending'
    });

    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const toggleTimer = () => {
        if (!isTimerRunning && elapsedTime === 0) {
            setIsTimerRunning(true);
        } else if (isTimerRunning) {
            setIsTimerRunning(false);
            const calculatedWpm = Math.round((textWordCount / elapsedTime) * 60);
            setWpm(calculatedWpm);
        }
    };

    const nextStep = () => {
        if (step < 5) {
            setStep(step + 1);
        } else {
            // Calculate detailed score
            const reactionScore = Math.max(0, 100 - (measures.reaction / 10)); // simple mock formula
            const wpmScore = Math.min(100, (wpm / 300) * 100);
            const totalScore = Math.round((reactionScore + wpmScore) / 2) || 85; // Fallback if 0

            // Navigate to Results Page instead of Dashboard
            navigate('/test-results', {
                state: {
                    wpm: wpm || 250,
                    score: totalScore,
                    profile: {
                        type: measures.crowding === 'spaced' ? 'Visual Sensitivity' : 'Neuro-Typical',
                        needsFocusMode: measures.crowding === 'spaced'
                    }
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Header / Visualization Area */}
            <div className={`relative h-[40vh] w-full bg-white flex items-center justify-center overflow-hidden transition-all duration-700 ${step > 0 ? 'h-[25vh]' : ''}`}>

                {/* Visualizations Layer (Nerves) */}
                <div className="absolute inset-0 w-full h-full z-0">
                    <NerveAnimation />
                </div>

                {/* Back Button */}
                <button onClick={() => navigate('/dashboard')} className="absolute top-8 left-8 p-2 rounded-full hover:bg-gray-100 z-30 transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-500" />
                </button>

                {/* Content Container - Flex row for Side-by-Side */}
                <div className="relative z-10 w-full max-w-6xl px-8 flex items-center justify-between h-full pointer-events-none">

                    {/* Left: Text / Instructions */}
                    <div className="max-w-xl pointer-events-auto">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-light tracking-tight text-gray-900 mb-4"
                        >
                            <span className="font-bold text-blue-600">Focus</span> Calibration
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-500 text-lg"
                        >
                            Initializing neural interface...
                        </motion.p>
                    </div>

                    {/* Right: 3D Eye */}
                    <div className="w-1/3 h-full flex items-center justify-center relative pointer-events-auto">
                        <div className="w-64 h-64 relative">
                            <ThreeDEye />
                        </div>
                    </div>
                </div>
            </div>

            {/* Test Content Area */}
            <div className="flex-1 p-8 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {/* Step 0: ASRS */}
                    {step === 0 && (
                        <TestStep key="step0" title="Attention Screening" description="Answer honestly based on your last 30 days." onNext={nextStep}>
                            <div className="space-y-8">
                                <ASRSQuestion question="How often do you have trouble wrapping up the final details of a project?" />
                                <ASRSQuestion question="How often do you have difficulty getting things in order?" />
                            </div>
                        </TestStep>
                    )}

                    {/* Step 1: Reading Speed */}
                    {step === 1 && (
                        <TestStep key="step1" title="Reading Speed Check" description="Read the text. Click 'Finish' when done." onNext={nextStep}>
                            <div className="prose prose-lg max-w-none text-gray-700 leading-loose">
                                <p>Neurodiversity refers to the variation in the human brain regarding sociability, learning, attention, mood and other mental functions. It was coined in 1998 by sociologist Judy Singer, who helped popularize the concept along with journalist Harvey Blume.</p>
                                <p>The concept was originally thought of as a way to clear up assumptions about ADHD, Autism, and Dyslexia, however it has since expanded to include other conditions.</p>
                            </div>
                            <div className="flex flex-col items-center gap-4 mt-8">
                                {!wpm ? (
                                    <button onClick={toggleTimer} className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all ${isTimerRunning ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' : 'bg-primary text-white hover:bg-blue-700'}`}>
                                        <Play className={`w-4 h-4 ${isTimerRunning ? 'hidden' : 'block'}`} />
                                        {isTimerRunning ? `Reading... ${elapsedTime}s (Click to Stop)` : 'Start Reading Timer'}
                                    </button>
                                ) : (
                                    <div className="text-center animate-fade-in-up">
                                        <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-1">Your Speed</p>
                                        <div className="text-5xl font-black text-primary mb-2">{wpm} <span className="text-lg text-gray-400 font-medium">WPM</span></div>
                                        <p className="text-gray-400 text-sm">Recorded.</p>
                                    </div>
                                )}
                            </div>
                        </TestStep>
                    )}

                    {/* Step 2: Reaction Time */}
                    {step === 2 && (
                        <TestStep key="step2" title="Reaction Time & Reflexes" description="Click as fast as you can when the box turns GREEN." onNext={nextStep}>
                            <ReactionTimeTest onComplete={(time) => {
                                console.log('Reaction:', time);
                                setMeasures(prev => ({ ...prev, reaction: time }));
                            }} />
                        </TestStep>
                    )}

                    {/* Step 3: Crowding */}
                    {step === 3 && (
                        <TestStep key="step3" title="Visual Crowding" description="Select which paragraph is easier to read." onNext={nextStep}>
                            <div className="grid grid-cols-2 gap-8">
                                <button
                                    onClick={() => setMeasures(prev => ({ ...prev, crowding: 'tight' }))}
                                    className={`p-6 border-2 rounded-xl text-left transition-all focus:ring-2 focus:ring-primary/20 active:scale-95 ${measures.crowding === 'tight' ? 'border-primary bg-blue-50' : 'border-gray-100 bg-gray-50 hover:border-primary'}`}
                                >
                                    <h4 className="font-bold mb-2">Option A (Standard)</h4>
                                    <p className="text-sm leading-tight text-justify">Tight spacing might be standard, but can increase visual crowding. Swift brown fox jumps over the lazy dog.</p>
                                </button>
                                <button
                                    onClick={() => setMeasures(prev => ({ ...prev, crowding: 'spaced' }))}
                                    className={`p-6 border-2 rounded-xl text-left transition-all focus:ring-2 focus:ring-primary/20 active:scale-95 ${measures.crowding === 'spaced' ? 'border-primary bg-blue-50' : 'border-gray-100 bg-gray-50 hover:border-primary'}`}
                                >
                                    <h4 className="font-bold mb-2">Option B (Spaced)</h4>
                                    <p className="text-sm leading-loose tracking-wide text-left">Expanded spacing often reduces visual stress. It gives the eyes more room to rest.</p>
                                </button>
                            </div>
                        </TestStep>
                    )}

                    {/* Step 4: Contrast Sensitivity */}
                    {step === 4 && (
                        <TestStep key="step4" title="Contrast Sensitivity" description="Select the number hidden in the box. It will get harder." onNext={nextStep}>
                            {measures.contrast === 'Pending' ? (
                                <ContrastTest onComplete={(result) => {
                                    setMeasures(prev => ({ ...prev, contrast: result }));
                                }} />
                            ) : (
                                <div className="text-center py-12">
                                    <div className="inline-block p-4 rounded-full bg-blue-50 text-blue-600 mb-4">
                                        <Eye className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Analysis Complete</h3>
                                    <p className="text-gray-500 mt-2">Visual Threshold: <span className="font-bold text-primary">{measures.contrast}</span></p>
                                </div>
                            )}
                        </TestStep>
                    )}

                    {/* Step 5: Complete */}
                    {step === 5 && (
                        <TestStep key="step5" title="Processing Complete" description="Analysis done." onNext={nextStep} isLast>
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                    <Check className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Profile Calibrated</h3>
                                <p className="text-gray-500 max-w-sm">We've adjusted the Adaptive Reader settings to match your visual preferences and reading speed.</p>
                            </div>
                        </TestStep>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FocusScan;
