import { useState, useEffect, useRef, useCallback } from 'react';
import { FaceLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

/**
 * Advanced eye tracking using MediaPipe Face Landmarker with Iris Tracking
 * Provides precise pupil tracking and gaze estimation
 */
export function useEyeTracking() {
    const [isTracking, setIsTracking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFixating, setIsFixating] = useState(true);
    const [gazePoint, setGazePoint] = useState({ x: 0.5, y: 0.5 });
    const [headTurnDetected, setHeadTurnDetected] = useState(false);
    const [faceDetected, setFaceDetected] = useState(false);
    const [calibrationOffset, setCalibrationOffset] = useState({ x: 0, y: 0 });

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);
    const requestRef = useRef(null);
    const lastVideoTimeRef = useRef(-1);
    const gazeHistoryRef = useRef([]);

    // Config
    const EYE_INDICES = {
        left: [33, 133, 160, 158, 153, 144, 159, 145], // Example simplified indices around eye
        right: [362, 263, 385, 387, 373, 380, 386, 374],
        leftIris: [468, 469, 470, 471, 472],
        rightIris: [473, 474, 475, 476, 477]
    };

    const startTracking = useCallback(async () => {
        if (isTracking || isLoading) return;
        setIsLoading(true);

        try {
            // 1. Initialize FilesetResolver
            const filesetResolver = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );

            // 2. Create FaceLandmarker
            landmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                    delegate: "GPU"
                },
                outputFaceBlendshapes: true,
                runningMode: "VIDEO",
                numFaces: 1
            });

            // 3. Start Camera
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: 'user' }
            });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await new Promise(resolve => {
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play();
                        resolve();
                    };
                });
            }

            setIsTracking(true);
            setIsLoading(false);

            // Start Loop
            predictWebcam();

        } catch (error) {
            console.error("Error starting eye tracking:", error);
            setIsLoading(false);
            setIsTracking(false);
        }
    }, [isTracking, isLoading]);

    const stopTracking = useCallback(() => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
        setIsTracking(false);
        setFaceDetected(false);
    }, []);

    const predictWebcam = useCallback(() => {
        if (!landmarkerRef.current || !videoRef.current || !isTracking) return;

        let startTimeMs = performance.now();
        if (lastVideoTimeRef.current !== videoRef.current.currentTime) {
            lastVideoTimeRef.current = videoRef.current.currentTime;

            const results = landmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);

            if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                setFaceDetected(true);
                const landmarks = results.faceLandmarks[0];

                // --- IRIS TRACKING LOGIC ---
                // Left Iris Center: 468, Right Iris Center: 473
                const leftIris = landmarks[468];
                const rightIris = landmarks[473];

                // Eye Corners for calibration (width normalization)
                const leftEyeInner = landmarks[133];
                const leftEyeOuter = landmarks[33];
                const rightEyeInner = landmarks[362];
                const rightEyeOuter = landmarks[263];

                // Calculate Pupil Position (0-1 range within the eye)
                // We project the 3D position to 2D relative to eye corners

                // Simple Euclidean approximation for X-axis gaze
                // Left Eye
                const leftEyeWidth = Math.sqrt(Math.pow(leftEyeInner.x - leftEyeOuter.x, 2) + Math.pow(leftEyeInner.y - leftEyeOuter.y, 2));
                const leftIrisDist = Math.sqrt(Math.pow(leftIris.x - leftEyeOuter.x, 2) + Math.pow(leftIris.y - leftEyeOuter.y, 2));
                const leftRatio = leftIrisDist / leftEyeWidth;

                // Right Eye
                const rightEyeWidth = Math.sqrt(Math.pow(rightEyeInner.x - rightEyeOuter.x, 2) + Math.pow(rightEyeInner.y - rightEyeOuter.y, 2));
                const rightIrisDist = Math.sqrt(Math.pow(rightIris.x - rightEyeOuter.x, 2) + Math.pow(rightIris.y - rightEyeOuter.y, 2));
                const rightRatio = rightIrisDist / rightEyeWidth;

                // Average X gaze (0 = looking left relative to face, 1 = right)
                // Note: Webcam is mirrored usually
                let avgGazeX = (leftRatio + rightRatio) / 2;

                // Y-axis gaze (simplified vertical ratio)
                // Use eye height vs iris height
                const leftEyeTop = landmarks[159];
                const leftEyeBottom = landmarks[145];
                const leftEyeHeight = Math.abs(leftEyeTop.y - leftEyeBottom.y);
                const leftIrisY = Math.abs(leftIris.y - leftEyeTop.y);
                let avgGazeY = leftIrisY / leftEyeHeight;

                // --- CALIBRATION & SMOOTHING ---
                // Map raw ratio to screen coordinates (Approximate)
                // Center is roughly 0.5, 0.5. 
                // We exaggerate the movement to cover the screen.

                // Sensitivity Multiplier
                const SENSITIVITY_X = 2.5;
                const SENSITIVITY_Y = 3.0; // Eyes move less vertically

                // Normalize around 0.5 centered
                let procGazeX = 0.5 + (avgGazeX - 0.45) * SENSITIVITY_X; // 0.45 is slight bias correction
                let procGazeY = 0.5 + (avgGazeY - 0.45) * SENSITIVITY_Y;

                // Mirror for UI if needed (usually webcam feels mirrored)
                procGazeX = 1 - procGazeX;

                // Clamp
                procGazeX = Math.max(0, Math.min(1, procGazeX));
                procGazeY = Math.max(0, Math.min(1, procGazeY));

                setGazePoint({ x: procGazeX, y: procGazeY });

                // --- FIXATION DETECTION ---
                gazeHistoryRef.current.push({ x: procGazeX, y: procGazeY });
                if (gazeHistoryRef.current.length > 20) gazeHistoryRef.current.shift();

                if (gazeHistoryRef.current.length > 5) {
                    const variance = calculateVariance(gazeHistoryRef.current);

                    // Center zone check (0.35 to 0.65)
                    const inCenter = procGazeX > 0.3 && procGazeX < 0.7 && procGazeY > 0.3 && procGazeY < 0.7;
                    const isStable = variance < 0.05; // Tight variance

                    setIsFixating(inCenter && isStable);
                }

                // --- HEAD TURN DETECTION (Pose) ---
                // Matrix logic is complex, use simple keypoint ratio
                const noseTip = landmarks[1];
                const leftCheek = landmarks[454];
                const rightCheek = landmarks[234];
                const midPointX = (leftCheek.x + rightCheek.x) / 2;

                // If nose is far from midpoint of cheeks, head is turned
                const headTurnVal = (noseTip.x - midPointX);
                setHeadTurnDetected(Math.abs(headTurnVal) > 0.05);

            } else {
                setFaceDetected(false);
            }
        }
        requestRef.current = requestAnimationFrame(predictWebcam);
    }, [isTracking]);

    useEffect(() => {
        return () => {
            stopTracking();
        };
    }, []);

    return {
        isTracking,
        isLoading,
        isFixating,
        gazePoint,
        headTurnDetected,
        faceDetected,
        videoRef,
        canvasRef,
        startTracking,
        stopTracking
    };
}

function calculateVariance(points) {
    if (points.length < 2) return 0;
    const meanX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const meanY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    return points.reduce((sum, p) => sum + Math.pow(p.x - meanX, 2) + Math.pow(p.y - meanY, 2), 0) / points.length;
}

export default useEyeTracking;
