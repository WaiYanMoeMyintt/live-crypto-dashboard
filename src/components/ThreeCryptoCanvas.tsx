'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeCryptoCanvasProps {
  coinName?: string;
  symbol?: string;
  className?: string;
  interactive?: boolean;
}

export const ThreeCryptoCanvas: React.FC<ThreeCryptoCanvasProps> = ({
  coinName = 'Ripple',
  symbol = 'XRP',
  className = '',
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 200;
    const height = mount.clientHeight || 200;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // Coin Group
    const coinGroup = new THREE.Group();
    scene.add(coinGroup);

    // 1. Coin Cylinder Body
    const coinGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.18, 64);
    const coinMaterial = new THREE.MeshStandardMaterial({
      color: 0x181920,
      metalness: 0.92,
      roughness: 0.22,
    });
    const coinMesh = new THREE.Mesh(coinGeometry, coinMaterial);
    coinMesh.rotation.x = Math.PI / 2;
    coinGroup.add(coinMesh);

    // 2. Outer Rim Ring (Neon Lime Accent / Platinum)
    const rimGeometry = new THREE.TorusGeometry(1.22, 0.05, 32, 64);
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4f434,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x3d470a,
    });
    const rimMesh = new THREE.Mesh(rimGeometry, rimMaterial);
    coinGroup.add(rimMesh);

    // 3. Inner Embossed Ring
    const innerRimGeo = new THREE.TorusGeometry(0.95, 0.025, 24, 64);
    const innerRimMat = new THREE.MeshStandardMaterial({
      color: 0x8892b0,
      metalness: 0.85,
      roughness: 0.3,
    });
    const innerRimMesh = new THREE.Mesh(innerRimGeo, innerRimMat);
    coinGroup.add(innerRimMesh);

    // 4. Central Stylized XRP / Crypto Cross Glyph
    const glyphGroup = new THREE.Group();
    const barGeo = new THREE.BoxGeometry(0.18, 0.9, 0.06);
    const barMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.1,
    });

    const bar1 = new THREE.Mesh(barGeo, barMat);
    bar1.rotation.z = Math.PI / 4;
    bar1.position.z = 0.1;

    const bar2 = new THREE.Mesh(barGeo, barMat);
    bar2.rotation.z = -Math.PI / 4;
    bar2.position.z = 0.1;

    glyphGroup.add(bar1, bar2);
    coinGroup.add(glyphGroup);

    // 5. Surrounding Orbiting Glow Particles
    const particlesCount = 35;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const scales = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      const theta = (i / particlesCount) * Math.PI * 2;
      const radius = 1.65 + (Math.random() - 0.5) * 0.4;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = Math.sin(theta) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
      scales[i] = Math.random() * 0.04 + 0.02;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xd4f434,
      size: 0.05,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xd4f434, 2.5, 10);
    pointLight1.position.set(2.5, 2.5, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x7c7bf2, 2.0, 10);
    pointLight2.position.set(-2.5, -2, 2.5);
    scene.add(pointLight2);

    const backLight = new THREE.DirectionalLight(0xffffff, 1.2);
    backLight.position.set(0, 0, -3);
    scene.add(backLight);

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      if (newWidth && newHeight) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Base idle rotation + interactive tilt
      coinGroup.rotation.y = elapsedTime * 0.45 + mouseRef.current.x * 0.8;
      coinGroup.rotation.x = Math.sin(elapsedTime * 0.6) * 0.15 - mouseRef.current.y * 0.6;
      coinGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.08;

      // Rotate particle cloud
      particles.rotation.z = -elapsedTime * 0.15;
      particles.rotation.y = elapsedTime * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      coinGeometry.dispose();
      coinMaterial.dispose();
      rimGeometry.dispose();
      rimMaterial.dispose();
      innerRimGeo.dispose();
      innerRimMat.dispose();
      barGeo.dispose();
      barMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [interactive, coinName, symbol]);

  return (
    <div
      ref={mountRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseRef.current.targetX = 0;
        mouseRef.current.targetY = 0;
      }}
      className={`relative cursor-grab active:cursor-grabbing transition-transform duration-300 ${className} ${
        isHovered ? 'scale-105' : ''
      }`}
      title={`Interactive 3D ${coinName} Token (Hover & Move Cursor)`}
    />
  );
};
