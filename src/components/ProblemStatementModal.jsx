import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const ProblemStatementModal = ({ open, onClose }) => {
    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative max-w-2xl w-full bg-background text-foreground rounded-3xl p-8 shadow-2xl border border-foreground/10"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-foreground/10 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Content */}
                    <h2 className="text-3xl font-bold mb-6">
                        The Problem Lock Focus Solves
                    </h2>

                    <section className="space-y-5 text-foreground/80 leading-relaxed">
                        <p>
                            Most digital reading platforms use <b>static layouts</b> and assume
                            linear reading behavior. This causes <b>cognitive overload</b>,
                            especially during long-form content consumption.
                        </p>

                        <div>
                            <h3 className="font-semibold mb-2">Who This Affects</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>ADHD users unintentionally skim and lose focus</li>
                                <li>Dyslexic users struggle with dense, rigid text blocks</li>
                                <li>Neurotypical users experience eye strain and mental fatigue</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">
                                Why Existing Solutions Fail
                            </h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Accessibility depends on manual setup or diagnosis</li>
                                <li>No real-time detection of confusion or disengagement</li>
                                <li>Feedback arrives too late — after focus is already lost</li>
                            </ul>
                        </div>

                        <p>
                            When digital content does not adapt to the reader, comprehension
                            drops, confidence decreases, and long-form learning becomes
                            unsustainable.
                        </p>

                        <div className="p-4 rounded-2xl bg-secondary/40 border border-foreground/10">
                            <h3 className="font-semibold mb-1">What Lock Focus Changes</h3>
                            <p>
                                Lock Focus introduces an <b>intent-aware adaptive reading
                                    system</b> that reshapes content dynamically based on user
                                interaction — without diagnosis, stigma, or manual
                                configuration.
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-secondary/40 border border-foreground/10">
                            <h3 className="font-semibold mb-1">
                                Proof in This Prototype
                            </h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Working Dyslexia Training Game (Syllable Slasher)</li>
                                <li>Immersive Reader to reduce cognitive load</li>
                                <li>Focus-aware interaction via the dashboard</li>
                            </ul>
                        </div>

                        <p className="text-sm text-foreground/50 pt-2">
                            This is not a mockup — it is a functional prototype built for
                            validation in real time.
                        </p>
                    </section>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProblemStatementModal;