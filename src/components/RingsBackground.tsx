import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const SETTINGS = {
  rotation: 0.37,
  zoom: 36,
  size: 4,
  speed: 0.22,       // was 0.05 — larger stagger = slower rolling wave
  duration: 6,       // seconds per half-cycle (was default ~1s)
  ringCount: 40,
  baseRadius: 1,
  radiusStep: 0.5,
};

export default function RingsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ringCount = mobile ? 24 : SETTINGS.ringCount;
    const particleCount = reducedMotion ? 0 : mobile ? 1200 : 5000;

    let rafId = 0;
    let gsapCtx: gsap.Context | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    const rings: THREE.Mesh[] = [];
    let particleGeo: THREE.BufferGeometry | null = null;
    let particleMat: THREE.PointsMaterial | null = null;
    let particles: THREE.Points | null = null;

    const onContextLost = (event: Event) => {
      event.preventDefault();
      setShowFallback(true);
    };

    try {
      const contextAttributes = {
        alpha: true,
        antialias: !mobile,
        powerPreference: (mobile ? 'low-power' : 'high-performance') as WebGLPowerPreference,
      };
      const webglContext =
        canvas.getContext('webgl2', contextAttributes) ||
        canvas.getContext('webgl', contextAttributes) ||
        canvas.getContext('experimental-webgl', contextAttributes);

      if (!webglContext) {
        setShowFallback(true);
        return;
      }

      canvas.addEventListener('webglcontextlost', onContextLost, false);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({
        canvas,
        context: webglContext as WebGLRenderingContext,
        antialias: !mobile,
        alpha: true,
        powerPreference: mobile ? 'low-power' : 'high-performance',
      });

      renderer.setClearColor(0x000000, 1);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));

      // --- Rings ---
      const group = new THREE.Group();
      const initialColor = new THREE.Color('#404040');
      for (let i = 0; i < ringCount; i++) {
        const r = SETTINGS.baseRadius + i * SETTINGS.radiusStep;
        const geometry = new THREE.RingGeometry(r, r + 0.1, 64);
        const material = new THREE.MeshBasicMaterial({ color: initialColor.clone(), side: THREE.DoubleSide });
        const ring = new THREE.Mesh(geometry, material);
        rings.push(ring);
        group.add(ring);
      }
      scene.add(group);

      // --- Particles ---
      if (particleCount > 0) {
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
          positions[i] = (Math.random() - 0.5) * 100;
        }
        particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleMat = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: 0.6 });
        particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);
      }

      // --- Camera & tilt ---
      camera.position.set(0, 0, SETTINGS.zoom);
      camera.lookAt(0, 0, 0);
      group.rotation.x = -Math.PI * SETTINGS.rotation;

      // --- GSAP animations ---
      gsapCtx = gsap.context(() => {
        rings.forEach((ring, index) => {
          const delay = (rings.length - index) * SETTINGS.speed;
          gsap.to(ring.position, {
            y: -SETTINGS.size,
            duration: SETTINGS.duration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay,
          });
          gsap.to((ring.material as THREE.MeshBasicMaterial).color, {
            r: 1.0,
            g: 0.1,
            b: 0.05,
            duration: SETTINGS.duration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay,
          });
        });
      });

      // --- Resize ---
      const onResize = () => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (!w || !h || !renderer) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      onResize();
      window.addEventListener('resize', onResize);

      // --- Render loop ---
      const animate = () => {
        rafId = requestAnimationFrame(animate);
        if (particles) particles.rotation.y += 0.00004;
        renderer?.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', onResize);
        canvas.removeEventListener('webglcontextlost', onContextLost);
        gsapCtx?.revert();
        renderer?.dispose();
        rings.forEach(r => {
          r.geometry.dispose();
          (r.material as THREE.MeshBasicMaterial).dispose();
        });
        particleGeo?.dispose();
        particleMat?.dispose();
      };
    } catch {
      setShowFallback(true);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      gsapCtx?.revert();
      renderer?.dispose();
      rings.forEach(r => {
        r.geometry.dispose();
        (r.material as THREE.MeshBasicMaterial).dispose();
      });
      particleGeo?.dispose();
      particleMat?.dispose();
      cancelAnimationFrame(rafId);
      return;
    }
  }, []);

  if (showFallback) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(120% 80% at 50% 20%, rgba(96,96,120,0.35) 0%, rgba(32,32,40,0.6) 45%, #000 100%)',
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        filter: 'blur(5px)',
        transform: 'scale(1.03)',
      }}
    />
  );
}
