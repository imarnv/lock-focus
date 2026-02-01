import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, useCursor } from '@react-three/drei';
import * as THREE from 'three';

const EyeBall = ({ mouse }) => {
    const mesh = useRef();
    const [hovered, setHover] = useState(false);

    useCursor(hovered);

    useFrame((state) => {
        if (!mesh.current) return;

        // Calculate rotation to look at mouse
        // Mouse is normalized (-1 to 1)
        const targetX = mouse.current[0] * 1; // Sensitivity
        const targetY = mouse.current[1] * 1;

        // Smooth damping
        mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, targetX, 0.1);
        mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, -targetY, 0.1);
    });

    return (
        <group ref={mesh} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
            {/* Sclera (White part) */}
            <Sphere args={[1, 32, 32]}>
                <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
            </Sphere>

            {/* Iris (Colored part) */}
            <group rotation={[0, -Math.PI / 2, 0]} position={[0.92, 0, 0]}>
                {/* Pupil (Black) */}
                <Sphere args={[0.25, 32, 32]} position={[0.08, 0, 0]} scale={[1, 1, 0.3]}>
                    <meshStandardMaterial color="#000000" roughness={0.0} />
                </Sphere>
                {/* Iris Base */}
                <Sphere args={[0.45, 32, 32]} position={[0, 0, 0]} scale={[1, 1, 0.1]}>
                    <meshStandardMaterial color="#3b82f6" roughness={0.3} />
                </Sphere>
            </group>
        </group>
    );
};

const ThreeDEye = () => {
    const mouse = useRef([0, 0]);

    const handleMouseMove = (e) => {
        // Normalize mouse coordinates to -1 to 1
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        mouse.current = [x, y];
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="w-full h-full relative">
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                {/* The Eye */}
                <EyeBall mouse={mouse} />
            </Canvas>
        </div>
    );
};

export default ThreeDEye;
