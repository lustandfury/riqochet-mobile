import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // --- Scene setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

    renderer.setClearColor(0x000000, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // --- Rings ---
    const group = new THREE.Group();
    const rings: THREE.Mesh[] = [];
    const initialColor = new THREE.Color('#404040');

    for (let i = 0; i < SETTINGS.ringCount; i++) {
      const r = SETTINGS.baseRadius + i * SETTINGS.radiusStep;
      const geometry = new THREE.RingGeometry(r, r + 0.1, 64);
      const material = new THREE.MeshBasicMaterial({ color: initialColor.clone(), side: THREE.DoubleSide });
      const ring = new THREE.Mesh(geometry, material);
      rings.push(ring);
      group.add(ring);
    }
    scene.add(group);

    // --- Particles ---
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 100;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Camera & tilt ---
    camera.position.set(0, 0, SETTINGS.zoom);
    camera.lookAt(0, 0, 0);
    group.rotation.x = -Math.PI * SETTINGS.rotation;

    // --- GSAP animations ---
    const gsapCtx = gsap.context(() => {
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
          r: 1.0, g: 0.1, b: 0.05,
          duration: SETTINGS.duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay,
        });
      });
    });

    // --- Render loop ---
    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      particles.rotation.y += 0.00004;
      renderer.render(scene, camera);
    };
    animate();

    // --- Resize ---
    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      gsapCtx.revert();
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      rings.forEach(r => { r.geometry.dispose(); (r.material as THREE.MeshBasicMaterial).dispose(); });
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', filter: 'blur(6px)', transform: 'scale(1.04)' }}
    />
  );
}
