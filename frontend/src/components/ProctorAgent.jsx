import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import Draggable from 'react-draggable';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

const ProctorAgent = ({ addNotification }) => {
    const webcamRef = useRef(null);
    const [isFlashing, setIsFlashing] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    // Refs to manage cooldowns and avoiding spamming notifications
    const lastMalpracticeTime = useRef(0);
    const absenceStartTime = useRef(null);
    const lookingAwayStartTime = useRef(null);
    const draggableNodeRef = useRef(null);
    const minimizedNodeRef = useRef(null);
    const dragPosRef = useRef({ x: 0, y: 0 });

    // Video constraints for a standard preview
    const videoConstraints = {
        width: 320,
        height: 240,
        facingMode: 'user',
    };

    const triggerMalpractice = useCallback((reason) => {
        const now = Date.now();
        // 5-second cooldown between notifications
        if (now - lastMalpracticeTime.current < 3000) return;

        lastMalpracticeTime.current = now;
        console.warn(`Malpractice detected: ${reason}`);

        if (addNotification) {
            addNotification(
                'alert',
                'WARNING',
                'PROCTOR SYSTEM',
                `Malpractice flagged: ${reason}. Please keep focus on the exam window.`
            );
        }

        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 5000);
    }, [addNotification]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) triggerMalpractice('Tab switching detected');
        };
        const handleBlur = () => {
            triggerMalpractice('Window focus lost');
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
        };
    }, [triggerMalpractice]);

    useEffect(() => {
        let isMounted = true;
        let camera = null;
        let faceMesh = null;

        const initializeProctor = async () => {
            if (!webcamRef.current || !webcamRef.current.video) {
                // Wait for video to be ready
                requestAnimationFrame(initializeProctor);
                return;
            }

            if (!isMounted) return;

            faceMesh = new FaceMesh({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`;
                }
            });

            faceMesh.setOptions({
                maxNumFaces: 1,
                refineLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            faceMesh.onResults((results) => {
                if (!isMounted) return;
                const now = Date.now();

                if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
                    if (!absenceStartTime.current) {
                        absenceStartTime.current = now;
                    } else if (now - absenceStartTime.current > 3000) {
                        triggerMalpractice('Face not detected in frame');
                        absenceStartTime.current = null;
                    }
                    lookingAwayStartTime.current = null;
                    return;
                }

                absenceStartTime.current = null;
                const landmarks = results.multiFaceLandmarks[0];

                const nose = landmarks[1];
                const leftEye = landmarks[33];
                const rightEye = landmarks[263];
                const top = landmarks[10];
                const bottom = landmarks[152];

                const leftDist = Math.abs(nose.x - leftEye.x);
                const rightDist = Math.abs(rightEye.x - nose.x);

                let isLookingAway = false;
                let direction = '';

                if (leftDist / rightDist > 1.5) {
                    isLookingAway = true;
                    direction = 'looking left';
                } else if (rightDist / leftDist > 1.5) {
                    isLookingAway = true;
                    direction = 'looking right';
                }

                const topDist = Math.abs(nose.y - top.y);
                const bottomDist = Math.abs(bottom.y - nose.y);

                if (topDist / bottomDist > 1.5) {
                    isLookingAway = true;
                    direction = 'looking down';
                } else if (bottomDist / topDist > 1.5) {
                    isLookingAway = true;
                    direction = 'looking up';
                }

                if (isLookingAway) {
                    if (!lookingAwayStartTime.current) {
                        lookingAwayStartTime.current = now;
                    } else if (now - lookingAwayStartTime.current > 1000) {
                        triggerMalpractice(`Head turned (${direction})`);
                        lookingAwayStartTime.current = null;
                    }
                } else {
                    lookingAwayStartTime.current = null;
                }
            });

            camera = new Camera(webcamRef.current.video, {
                onFrame: async () => {
                    if (!isMounted) return;
                    if (webcamRef.current && webcamRef.current.video && faceMesh) {
                        try {
                            await faceMesh.send({ image: webcamRef.current.video });
                        } catch (e) {
                            console.warn("FaceMesh process frame error: ", e);
                        }
                    }
                },
                width: 320,
                height: 240
            });
            camera.start();
        };

        requestAnimationFrame(initializeProctor);

        return () => {
            isMounted = false;
            try {
                if (camera) camera.stop();
            } catch (e) { }
            try {
                if (faceMesh) faceMesh.close();
            } catch (e) { }
        };
    }, [triggerMalpractice]);

    // Hidden webcam for when minimized so processing continues
    const hiddenWebcam = (
        <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className={isMinimized ? "hidden" : "absolute inset-0 w-full h-full object-cover"}
            mirrored={true}
        />
    );

    if (isMinimized) {
        return (
            <Draggable
                bounds="parent"
                nodeRef={minimizedNodeRef}
                onStart={(e, data) => {
                    dragPosRef.current = { x: data.x, y: data.y };
                }}
                onStop={(e, data) => {
                    const dx = Math.abs(data.x - dragPosRef.current.x);
                    const dy = Math.abs(data.y - dragPosRef.current.y);
                    if (dx < 5 && dy < 5) {
                        setIsMinimized(false);
                    }
                }}
            >
                <div
                    ref={minimizedNodeRef}
                    className={`fixed bottom-8 left-8 z-[150] w-16 h-16 rounded-full border-4 cursor-pointer flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-black transition-all hover:scale-105 active:scale-95
                        ${isFlashing ? 'animate-pulse border-red-600 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]' : 'border-[#F5A623]'}
                    `}
                >
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isFlashing ? 'text-red-500 animate-bounce' : 'text-[#F5A623]'}`}>
                        REC
                    </span>
                    {hiddenWebcam}
                </div>
            </Draggable>
        );
    }

    return (
        <Draggable bounds="parent" handle=".drag-handle" nodeRef={draggableNodeRef}>
            <div
                ref={draggableNodeRef}
                className={`fixed bottom-8 left-8 z-[150] overflow-hidden border-4 bg-black
                    shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center
                    ${isFlashing ? 'animate-pulse border-red-600 shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]' : 'border-black'}
                    `}
                style={{
                    resize: 'both',
                    minWidth: '200px',
                    minHeight: '150px',
                    maxWidth: '480px',
                    maxHeight: '360px',
                    width: '320px',
                    height: '240px',
                }}
            >
                <div className="w-full bg-black text-[#F5A623] px-2 py-1 text-xs font-bold tracking-widest uppercase border-b-2 border-black flex justify-between items-center z-10 drag-handle cursor-move">
                    <div className="flex items-center pointer-events-none">
                        <span>PROCTOR CAM {isFlashing && <span className="text-red-500 ml-2 animate-bounce inline-block">● REC</span>}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="opacity-50 text-[10px] pointer-events-none hidden sm:inline-block">DRAG / RESIZE ↘</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMinimized(true);
                            }}
                            className="text-white hover:text-white bg-black hover:bg-zinc-800 border-2 border-white px-2 rounded-sm text-xs leading-none pb-0.5 active:bg-zinc-600"
                            title="Minimize Proctor Cam"
                        >
                            -
                        </button>
                    </div>
                </div>

                <div className="w-full h-full relative bg-gray-900 flex items-center justify-center overflow-hidden pb-6"> {/* pb-6 to account for header */}
                    {hiddenWebcam}
                    {/* Resize handle visual indicator in bottom right */}
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-transparent cursor-se-resize flex items-end justify-end p-1 pointer-events-none">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 0V10H0L10 0Z" fill={isFlashing ? "#DC2626" : "black"} opacity="0.3" />
                        </svg>
                    </div>
                </div>
            </div>
        </Draggable>
    );
};

export default ProctorAgent;
