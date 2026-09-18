import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface PhoneComponentInfo {
  id: string;
  name: string;
  category: string;
  functionDesc: string;
  symptoms: string[];
  recommendedService: string;
  color: string;
}

export const PHONE_COMPONENTS: PhoneComponentInfo[] = [
  {
    id: 'display',
    name: 'Ceramic Shield OLED Assembly',
    category: 'Display Subsystem',
    functionDesc: 'Dynamic 120Hz OLED panel bonded with micron-thin capacitive digitizer and chemically toughened ceramic glass.',
    symptoms: ['Vertical color lines or flickering', 'Ghost touch or dead zones', 'Deep shattered glass fissures', 'Black screen with vibration'],
    recommendedService: 'Precision OLED & Glass Repair',
    color: '#38bdf8',
  },
  {
    id: 'battery',
    name: 'Dual-Cell High-Density Li-Ion Pack',
    category: 'Power Subsystem',
    functionDesc: 'Integrated lithium-ion energy cell with dedicated fuel-gauge microcontroller managing thermal curves.',
    symptoms: ['Battery health degradation below 80%', 'Sudden shutdown under heavy load', 'Swelling causing frame lifting', 'Overheating while charging'],
    recommendedService: 'High-Density Battery Replacement',
    color: '#10b981',
  },
  {
    id: 'board',
    name: 'Multi-Layer Logic Board & Bionic SoC',
    category: 'Core Processing Unit',
    functionDesc: 'High-density interconnect sandwich substrate containing main SoC, PMIC power management, and flash storage.',
    symptoms: ['Device completely unbootable', 'Stuck on manufacturer logo boot loop', 'Baseband or power rail failure', 'Rapid micro-short battery drain'],
    recommendedService: 'Board-Level Microsoldering & SoC Diagnostics',
    color: '#f59e0b',
  },
  {
    id: 'camera',
    name: 'Periscope & Sensor-Shift Optics',
    category: 'Optical Subsystem',
    functionDesc: 'Sensor-shift magnetic stabilization with multi-element sapphire coated optics and folded prism.',
    symptoms: ['Violent vibrating viewfinder', 'Blurry zoom optics unable to focus', 'Black screen in Camera app', 'Broken exterior sapphire camera glass'],
    recommendedService: 'Optical Camera Assembly Restoration',
    color: '#a855f7',
  },
  {
    id: 'port',
    name: 'USB-C Dock & Acoustic Assembly',
    category: 'I/O & Dock Subsystem',
    functionDesc: 'Reinforced connector socket supporting PD fast charging, differential data lines, and acoustic seals.',
    symptoms: ['Charging cable falls out or loose connection', 'Moisture detected warning', 'Intermittent charging at angles', 'Slow charging below 5W'],
    recommendedService: 'Precision Port & Connector Service',
    color: '#ec4899',
  },
  {
    id: 'chassis',
    name: 'Aerospace Grade Titanium Frame',
    category: 'Structural Enclosure',
    functionDesc: 'Precision CNC-machined titanium perimeter band bonded with sub-structure and laser-etched pass-throughs.',
    symptoms: ['Bent chassis affecting water seal', 'Shattered rear matte glass', 'Jammed side switches or buttons', 'Compromised IP68 perimeter seal'],
    recommendedService: 'Titanium Housing & Back Glass',
    color: '#94a3b8',
  },
];

interface Phone3DCanvasProps {
  progress?: number; // 0.0 to 1.0 continuous scroll progress
  stage?: number; // 1 to 10 fallback
  highlightedComponentId?: string | null;
  onSelectComponent?: (comp: PhoneComponentInfo) => void;
  interactive?: boolean;
  quality?: 'auto' | 'high' | 'medium' | 'low';
  className?: string;
  reducedMotion?: boolean;
}

function drawSafeRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  try {
    if (typeof (ctx as any).roundRect === 'function') {
      (ctx as any).roundRect(x, y, width, height, radius);
    } else {
      const r = Math.min(radius, width / 2, height / 2);
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + width, y, x + width, y + height, r);
      ctx.arcTo(x + width, y + height, x, y + height, r);
      ctx.arcTo(x, y + height, x, y, r);
      ctx.arcTo(x, y, x + width, y, r);
      ctx.closePath();
    }
  } catch {
    ctx.rect(x, y, width, height);
  }
}

export const Phone3DCanvas: React.FC<Phone3DCanvasProps> = ({
  progress = 0,
  stage = 1,
  highlightedComponentId = null,
  interactive = true,
  quality = 'auto',
  className = '',
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const phoneGroupRef = useRef<THREE.Group | null>(null);
  const guideLinesGroupRef = useRef<THREE.Group | null>(null);

  // Mesh references for smooth layer positioning
  const layersRef = useRef<{
    screenLayer?: THREE.Mesh;
    batteryMesh?: THREE.Mesh;
    logicBoardMesh?: THREE.Mesh;
    cameraModule?: THREE.Group;
    portMesh?: THREE.Mesh;
    chassisMesh?: THREE.Mesh;
    backGlass?: THREE.Mesh;
  }>({});

  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const userRotationRef = useRef({ x: 0, y: 0 });
  const [webglSupported, setWebglSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Current smooth animation progress target
  const currentProgressRef = useRef(progress);
  useEffect(() => {
    currentProgressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        setIsLoading(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      setIsLoading(false);
      return;
    }

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 460;
    const isMobileDevice = width < 640;

    // Quality setting resolution
    const isHigh = quality === 'high' || (quality === 'auto' && !isMobileDevice);
    const pixelRatio = isHigh ? Math.min(window.devicePixelRatio, 2) : 1;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera (responsive field of view)
    const fov = isMobileDevice ? 48 : 38;
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobileDevice ? 8.2 : 7.2);
    cameraRef.current = camera;

    // 3. Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: isHigh,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(pixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch {
      setWebglSupported(false);
      setIsLoading(false);
      return;
    }

    // 4. Lighting - Architectural Studio Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(5, 8, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xe0e7ff, 0.9);
    fillLight.position.set(0, -5, 5);
    scene.add(fillLight);

    // 5. Build Procedural Flagship Smartphone
    const phoneGroup = new THREE.Group();
    phoneGroupRef.current = phoneGroup;
    scene.add(phoneGroup);

    // Dimensions
    const pWidth = isMobileDevice ? 2.5 : 2.7;
    const pHeight = isMobileDevice ? 5.2 : 5.5;
    const pDepth = 0.32;

    // A. Titanium Chassis Perimeter Frame
    const chassisGeo = new THREE.BoxGeometry(pWidth, pHeight, pDepth);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x1c2026,
      metalness: 0.92,
      roughness: 0.25,
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    layersRef.current.chassisMesh = chassis;
    phoneGroup.add(chassis);

    // B. Rear Matte Textured Back Glass
    const backGlassGeo = new THREE.PlaneGeometry(pWidth - 0.08, pHeight - 0.08);
    const backGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x14161d,
      metalness: 0.2,
      roughness: 0.18,
      transmission: 0.25,
      thickness: 0.2,
    });
    const backGlass = new THREE.Mesh(backGlassGeo, backGlassMat);
    backGlass.position.z = -pDepth / 2 - 0.005;
    backGlass.rotation.y = Math.PI;
    layersRef.current.backGlass = backGlass;
    phoneGroup.add(backGlass);

    // C. Rear Camera Island & Optical Lenses
    const cameraGroup = new THREE.Group();
    cameraGroup.position.set(-0.62, 1.7, -pDepth / 2 - 0.05);

    const islandGeo = new THREE.BoxGeometry(1.15, 1.25, 0.1);
    const islandMat = new THREE.MeshStandardMaterial({ color: 0x181a20, metalness: 0.85, roughness: 0.25 });
    const island = new THREE.Mesh(islandGeo, islandMat);
    cameraGroup.add(island);

    // 3 Lenses
    const lensCoords = [
      [-0.26, 0.3],
      [-0.26, -0.3],
      [0.26, 0.0],
    ];
    lensCoords.forEach(([lx, ly]) => {
      const ringGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.12, 32);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x3b4252, metalness: 0.95, roughness: 0.1 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(lx, ly, -0.06);
      cameraGroup.add(ring);

      const glassGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.13, 24);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x05070a,
        roughness: 0.05,
        metalness: 0.9,
        transmission: 0.6,
      });
      const lensGlass = new THREE.Mesh(glassGeo, glassMat);
      lensGlass.rotation.x = Math.PI / 2;
      lensGlass.position.set(lx, ly, -0.065);
      cameraGroup.add(lensGlass);
    });

    layersRef.current.cameraModule = cameraGroup;
    phoneGroup.add(cameraGroup);

    // D. Front OLED Screen Assembly with Technical Telemetry
    const screenGeo = new THREE.PlaneGeometry(pWidth - 0.1, pHeight - 0.1);
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 1024;
    const sctx = screenCanvas.getContext('2d');

    if (sctx) {
      // Screen display background
      const grad = sctx.createLinearGradient(0, 0, 0, 1024);
      grad.addColorStop(0, '#07090e');
      grad.addColorStop(0.5, '#0b0f17');
      grad.addColorStop(1, '#050608');
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 512, 1024);

      // Dynamic Island
      sctx.fillStyle = '#000000';
      sctx.beginPath();
      drawSafeRoundRect(sctx, 176, 26, 160, 40, 20);
      sctx.fill();

      // Sensor dot
      sctx.fillStyle = '#1e293b';
      sctx.beginPath();
      sctx.arc(298, 46, 9, 0, Math.PI * 2);
      sctx.fill();

      // Micro grid lines
      sctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      sctx.lineWidth = 1;
      for (let y = 130; y < 900; y += 42) {
        sctx.beginPath();
        sctx.moveTo(35, y);
        sctx.lineTo(477, y);
        sctx.stroke();
      }

      // Telemetry text
      sctx.fillStyle = '#38bdf8';
      sctx.font = '700 24px -apple-system, monospace';
      sctx.fillText('TAJ LAB DIAGNOSTIC OS', 40, 150);

      sctx.fillStyle = '#ffffff';
      sctx.font = '700 40px -apple-system, sans-serif';
      sctx.fillText('CALIBRATED', 40, 205);

      sctx.fillStyle = '#94a3b8';
      sctx.font = '500 20px -apple-system, monospace';
      sctx.fillText('PANEL: 120Hz PROMOTION OLED', 40, 245);
      sctx.fillText('COLOR ACCURACY: DELTA-E < 1.0', 40, 275);
      sctx.fillText('TRUETONE EEPROM: SYNCED', 40, 305);
      sctx.fillText('BATTERY: 100% [ZERO CYCLES]', 40, 335);

      // Waveform line
      sctx.strokeStyle = '#38bdf8';
      sctx.lineWidth = 3;
      sctx.beginPath();
      sctx.moveTo(40, 460);
      sctx.lineTo(130, 460);
      sctx.lineTo(160, 400);
      sctx.lineTo(200, 510);
      sctx.lineTo(240, 420);
      sctx.lineTo(270, 460);
      sctx.lineTo(470, 460);
      sctx.stroke();

      // Address watermark & bottom bar
      sctx.fillStyle = '#64748b';
      sctx.font = '400 17px monospace';
      sctx.fillText('Fazal Trade Centre • Gulberg III Lahore', 40, 890);

      sctx.fillStyle = '#ffffff';
      sctx.beginPath();
      drawSafeRoundRect(sctx, 166, 975, 180, 8, 4);
      sctx.fill();
    }

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.anisotropy = 8;
    const screenMat = new THREE.MeshPhysicalMaterial({
      map: screenTexture,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = pDepth / 2 + 0.005;
    layersRef.current.screenLayer = screenMesh;
    phoneGroup.add(screenMesh);

    // E. Internal Battery Pack
    const battCanvas = document.createElement('canvas');
    battCanvas.width = 256;
    battCanvas.height = 512;
    const bctx = battCanvas.getContext('2d');
    if (bctx) {
      bctx.fillStyle = '#18181b';
      bctx.fillRect(0, 0, 256, 512);
      bctx.strokeStyle = '#27272a';
      bctx.lineWidth = 4;
      bctx.strokeRect(4, 4, 248, 504);
      bctx.fillStyle = '#10b981';
      bctx.font = '700 24px -apple-system, sans-serif';
      bctx.fillText('TAJ LAB CERTIFIED', 20, 50);
      bctx.fillStyle = '#a1a1aa';
      bctx.font = '500 16px monospace';
      bctx.fillText('LI-ION DUAL CELL', 20, 80);
      bctx.fillText('4422 mAh / 17.1 Wh', 20, 110);
      bctx.fillText('TI FUEL GAUGE: ACTIVE', 20, 140);
      bctx.fillText('SAFETY SHUTOFF: PASSED', 20, 170);
    }

    const battTexture = new THREE.CanvasTexture(battCanvas);
    const battGeo = new THREE.BoxGeometry(isMobileDevice ? 1.05 : 1.2, isMobileDevice ? 3.1 : 3.4, 0.12);
    const battMat = new THREE.MeshStandardMaterial({
      map: battTexture,
      color: 0x10b981,
      roughness: 0.35,
      metalness: 0.4,
    });
    const batteryMesh = new THREE.Mesh(battGeo, battMat);
    batteryMesh.position.set(-0.55, -0.4, 0);
    layersRef.current.batteryMesh = batteryMesh;
    phoneGroup.add(batteryMesh);

    // F. Multi-Layer Logic Board with Bionic SoC & Micron NAND
    const boardGeo = new THREE.BoxGeometry(isMobileDevice ? 0.9 : 1.0, isMobileDevice ? 2.9 : 3.2, 0.1);
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.3,
    });
    const boardMesh = new THREE.Mesh(boardGeo, boardMat);
    boardMesh.position.set(0.65, 0.5, 0);

    // Gold Bionic SoC
    const cpuGeo = new THREE.BoxGeometry(0.5, 0.5, 0.05);
    const cpuMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 });
    const cpuMesh = new THREE.Mesh(cpuGeo, cpuMat);
    cpuMesh.position.set(0, 0.4, 0.06);
    boardMesh.add(cpuMesh);

    // NAND Flash
    const nandGeo = new THREE.BoxGeometry(0.42, 0.42, 0.04);
    const nandMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const nandMesh = new THREE.Mesh(nandGeo, nandMat);
    nandMesh.position.set(0, -0.3, 0.05);
    boardMesh.add(nandMesh);

    layersRef.current.logicBoardMesh = boardMesh;
    phoneGroup.add(boardMesh);

    // G. USB-C Dock & Acoustic Taptic Module
    const portGeo = new THREE.BoxGeometry(1.5, 0.46, 0.14);
    const portMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      metalness: 0.85,
      roughness: 0.2,
    });
    const portMesh = new THREE.Mesh(portGeo, portMat);
    portMesh.position.set(0, -2.2, 0);
    layersRef.current.portMesh = portMesh;
    phoneGroup.add(portMesh);

    // H. Architectural Exploded Guide Lines
    const guideLinesGroup = new THREE.Group();
    guideLinesGroupRef.current = guideLinesGroup;
    phoneGroup.add(guideLinesGroup);

    setIsLoading(false);

    // Animation Loop with Continuous Spatial Mathematics
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let smoothedProgress = progress;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth progress interpolation to prevent abrupt jumps
      const targetP = currentProgressRef.current;
      smoothedProgress += (targetP - smoothedProgress) * 0.1;

      // Base rotation calculated continuously from progress
      let baseRotX = 0.12;
      let baseRotY = -0.28;

      if (!reducedMotion) {
        // Continuous rotation path through the 10 stages:
        // 0.0: front angled
        // 0.3: turn to 3/4 side profile for layer separation
        // 0.6: exploded isometric view
        // 0.85: inspection tilt
        // 1.0: returned to rest
        if (smoothedProgress < 0.2) {
          const t = smoothedProgress / 0.2;
          baseRotY = -0.28 - t * 0.2;
          baseRotX = 0.12 + t * 0.05;
        } else if (smoothedProgress < 0.5) {
          const t = (smoothedProgress - 0.2) / 0.3;
          baseRotY = -0.48 - t * 0.3;
          baseRotX = 0.17 + t * 0.1;
        } else if (smoothedProgress < 0.8) {
          const t = (smoothedProgress - 0.5) / 0.3;
          baseRotY = -0.78 + t * 0.35;
          baseRotX = 0.27 - t * 0.1;
        } else {
          const t = (smoothedProgress - 0.8) / 0.2;
          baseRotY = -0.43 + t * 0.18;
          baseRotX = 0.17 - t * 0.05;
        }
      }

      if (phoneGroupRef.current) {
        // Idle gentle breathing when user is not dragging
        if (!isDraggingRef.current) {
          const breathY = reducedMotion ? 0 : Math.sin(elapsedTime * 0.7) * 0.025;
          const breathX = reducedMotion ? 0 : Math.cos(elapsedTime * 0.5) * 0.02;
          phoneGroupRef.current.rotation.y = baseRotY + userRotationRef.current.y + breathY;
          phoneGroupRef.current.rotation.x = baseRotX + userRotationRef.current.x + breathX;
        } else {
          phoneGroupRef.current.rotation.y = baseRotY + userRotationRef.current.y;
          phoneGroupRef.current.rotation.x = baseRotX + userRotationRef.current.x;
        }
      }

      // Continuous Component Exploded Offset Calculations
      // Progress ranges:
      // 0.0 - 0.15: fully assembled
      // 0.15 - 0.35: display & back separate along Z
      // 0.35 - 0.65: battery, board, camera, port separate in coordinate system
      // 0.65 - 0.80: maximum exploded state
      // 0.80 - 0.95: smoothly reassembles
      // 0.95 - 1.00: fully restored and clamped
      let separation = 0;
      if (smoothedProgress < 0.12) {
        separation = 0;
      } else if (smoothedProgress < 0.65) {
        // Exploding out
        separation = (smoothedProgress - 0.12) / 0.53;
      } else if (smoothedProgress < 0.82) {
        // Peak explosion
        separation = 1.0;
      } else if (smoothedProgress < 0.96) {
        // Reassembling
        separation = 1.0 - (smoothedProgress - 0.82) / 0.14;
      } else {
        separation = 0;
      }

      // Mobile reduces horizontal dispersion so phone never clips at 320-390px
      const hFactor = isMobileDevice ? 0.65 : 1.0;
      const vFactor = isMobileDevice ? 1.15 : 1.0;

      const {
        screenLayer,
        backGlass,
        cameraModule,
        batteryMesh,
        logicBoardMesh,
        portMesh,
      } = layersRef.current;

      const targetScreenZ = (pDepth / 2 + 0.005) + separation * 1.7;
      const targetScreenY = separation * 0.35 * vFactor;
      const targetBackZ = (-pDepth / 2 - 0.005) - separation * 1.5;
      const targetCameraZ = (-pDepth / 2 - 0.05) - separation * 1.9;

      const targetBattZ = separation * 0.65;
      const targetBattX = -0.55 - separation * 0.45 * hFactor;

      const targetBoardZ = separation * 0.75;
      const targetBoardX = 0.65 + separation * 0.45 * hFactor;

      const targetPortZ = separation * 0.9;
      const targetPortY = -2.2 - separation * 0.7 * vFactor;

      // Smooth lerping
      const lerpSpd = 0.12;
      if (screenLayer) {
        screenLayer.position.z += (targetScreenZ - screenLayer.position.z) * lerpSpd;
        screenLayer.position.y += (targetScreenY - screenLayer.position.y) * lerpSpd;
      }
      if (backGlass) {
        backGlass.position.z += (targetBackZ - backGlass.position.z) * lerpSpd;
      }
      if (cameraModule) {
        cameraModule.position.z += (targetCameraZ - cameraModule.position.z) * lerpSpd;
      }
      if (batteryMesh) {
        batteryMesh.position.z += (targetBattZ - batteryMesh.position.z) * lerpSpd;
        batteryMesh.position.x += (targetBattX - batteryMesh.position.x) * lerpSpd;
      }
      if (logicBoardMesh) {
        logicBoardMesh.position.z += (targetBoardZ - logicBoardMesh.position.z) * lerpSpd;
        logicBoardMesh.position.x += (targetBoardX - logicBoardMesh.position.x) * lerpSpd;
      }
      if (portMesh) {
        portMesh.position.z += (targetPortZ - portMesh.position.z) * lerpSpd;
        portMesh.position.y += (targetPortY - portMesh.position.y) * lerpSpd;
      }

      // Highlight subtle pulse if active
      if (highlightedComponentId) {
        const pulse = 1.0 + Math.sin(elapsedTime * 6) * 0.06;
        if (highlightedComponentId === 'battery' && batteryMesh) {
          batteryMesh.scale.set(pulse, pulse, pulse);
        } else if (highlightedComponentId === 'display' && screenLayer) {
          screenLayer.scale.set(pulse, pulse, 1);
        } else if (highlightedComponentId === 'board' && logicBoardMesh) {
          logicBoardMesh.scale.set(pulse, pulse, pulse);
        } else if (highlightedComponentId === 'camera' && cameraModule) {
          cameraModule.scale.set(pulse, pulse, pulse);
        } else if (highlightedComponentId === 'port' && portMesh) {
          portMesh.scale.set(pulse, pulse, pulse);
        }
      }

      try {
        renderer.render(scene, camera);
      } catch (err) {
        console.warn('Phone3DCanvas render error, falling back to schematic:', err);
        cancelAnimationFrame(animationFrameId);
        setWebglSupported(false);
        setIsLoading(false);
        return;
      }
    };

    animate();

    // Resize Observer with safe bounds checking
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      try {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w <= 0 || h <= 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      } catch {
        // ignore resize error
      }
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      try {
        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);
      } catch {
        // ignore
      }
    } else {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeObserver) {
        try {
          resizeObserver.disconnect();
        } catch {
          // ignore
        }
      } else {
        window.removeEventListener('resize', handleResize);
      }
      try {
        renderer.dispose();
      } catch {
        // ignore
      }
    };
  }, [quality, reducedMotion]);

  // Pointer drag controls for interactive 360 inspection
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !interactive) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    userRotationRef.current.y += deltaX * 0.007;
    userRotationRef.current.x += deltaY * 0.007;

    // Clamp vertical tilt
    userRotationRef.current.x = Math.max(-0.6, Math.min(0.6, userRotationRef.current.x));
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // WebGL Fallback - High-Craft 2D Architectural Schematic
  if (!webglSupported) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-6 bg-[#0c0d12] rounded-3xl border border-white/10 text-center ${className}`}
      >
        <div className="w-48 max-w-full space-y-2 py-4">
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-semibold">
            1. Display Assembly (OLED)
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold">
            2. Multi-Layer Logic Board
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
            3. High-Density Battery Cell
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-semibold">
            4. Triple Optical Camera Array
          </div>
          <div className="p-3 rounded-xl bg-zinc-800 border border-white/10 text-zinc-300 text-xs font-mono font-semibold">
            5. Titanium Precision Frame
          </div>
        </div>
        <p className="text-xs text-zinc-400 mt-2 font-mono">
          Hardware Architecture Schematic • WebGL Canvas Accelerated
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`relative w-full h-full cursor-grab active:cursor-grabbing touch-none select-none ${className}`}
      title="Drag to inspect layers from any perspective"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10 transition-opacity">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900 border border-white/10 text-xs text-zinc-400 font-mono">
            <div className="w-3 h-3 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <span>Preparing the laboratory...</span>
          </div>
        </div>
      )}
    </div>
  );
};
