import React, { useEffect, useRef } from 'react';

const AuroraAnimation = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let t = 0;

        const resize = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };

        const draw = () => {
            // Using a simple, performant gradient mesh simulation
            const gradient = ctx.createLinearGradient(0, 0, width, height);

            // Subtle shifting colors
            const r1 = Math.sin(t * 0.001) * 20 + 20; // range 0-40
            const g1 = Math.cos(t * 0.002) * 20 + 20;
            const b1 = Math.sin(t * 0.003) * 50 + 200; // Blue dominant

            // Second color set (Teal/Purple shift)
            const r2 = Math.sin(t * 0.002 + 2) * 30 + 30;
            const g2 = Math.cos(t * 0.001 + 1) * 30 + 150; // Teal dominant
            const b2 = Math.sin(t * 0.002 + 4) * 40 + 200;

            // Clear with transparency
            ctx.clearRect(0, 0, width, height);

            // Create soft moving orbs/gradients
            const drawOrb = (x, y, r, color) => {
                const g = ctx.createRadialGradient(x, y, 0, x, y, r);
                g.addColorStop(0, color);
                g.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw fewer orbs or simplify
            ctx.globalCompositeOperation = 'screen';

            // Orb 1 (Blue-ish)
            const x1 = width * 0.2 + Math.sin(t * 0.0005) * (width * 0.1);
            const y1 = height * 0.4 + Math.cos(t * 0.0003) * (height * 0.1);
            drawOrb(x1, y1, width * 0.5, `rgba(59, 130, 246, 0.1)`);

            // Orb 2 (Teal-ish)
            const x2 = width * 0.8 - Math.sin(t * 0.0004) * (width * 0.1);
            const y2 = height * 0.6 - Math.cos(t * 0.0006) * (height * 0.1);
            drawOrb(x2, y2, width * 0.4, `rgba(45, 212, 191, 0.1)`);

            t += 2; // Move faster through time to reduce calculation overhead per frame
            requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => window.removeEventListener('resize', resize);
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full opacity-60 dark:opacity-40 transition-opacity duration-1000" />;
};

export default AuroraAnimation;
