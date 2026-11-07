/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { BoxCollider, Vector3D } from './types';

// ============================================================================
// PROCEDURAL CANVAS TEXTURES FOR REALISTIC INDUSTRIAL HARDWARE
// ============================================================================

let _hazardStripeTexture: THREE.CanvasTexture | null = null;
let _perforatedGrateTexture: THREE.CanvasTexture | null = null;
let _brushedMetalTexture: THREE.CanvasTexture | null = null;

export function getHazardStripeTexture(): THREE.CanvasTexture {
  if (_hazardStripeTexture) return _hazardStripeTexture;

  if (typeof document === 'undefined') {
    _hazardStripeTexture = new THREE.CanvasTexture({} as HTMLCanvasElement);
    return _hazardStripeTexture;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Industrial caution amber background
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, 0, 256, 256);

  // Black hazard chevrons / diagonal stripes
  ctx.fillStyle = '#111827';
  const stripeWidth = 32;
  for (let x = -256; x < 512; x += stripeWidth * 2) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + stripeWidth, 0);
    ctx.lineTo(x + stripeWidth + 256, 256);
    ctx.lineTo(x + 256, 256);
    ctx.closePath();
    ctx.fill();
  }

  // Weathering, edge grime, rivets
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(0, 0, 256, 8);
  ctx.fillRect(0, 248, 256, 8);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  _hazardStripeTexture = texture;
  return texture;
}

export function getPerforatedGrateTexture(): THREE.CanvasTexture {
  if (_perforatedGrateTexture) return _perforatedGrateTexture;

  if (typeof document === 'undefined') {
    _perforatedGrateTexture = new THREE.CanvasTexture({} as HTMLCanvasElement);
    return _perforatedGrateTexture;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Dark gunmetal plate
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 128, 128);

  // Perforated slot holes
  ctx.fillStyle = '#020617';
  const spacing = 16;
  for (let x = 8; x < 128; x += spacing) {
    for (let y = 8; y < 128; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Rim highlight
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 126, 126);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  _perforatedGrateTexture = texture;
  return texture;
}

export function getBrushedMetalTexture(): THREE.CanvasTexture {
  if (_brushedMetalTexture) return _brushedMetalTexture;

  if (typeof document === 'undefined') {
    _brushedMetalTexture = new THREE.CanvasTexture({} as HTMLCanvasElement);
    return _brushedMetalTexture;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#475569';
  ctx.fillRect(0, 0, 256, 256);

  // Concentric machining lathe grooves
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  for (let r = 10; r < 140; r += 4) {
    ctx.beginPath();
    ctx.arc(128, 128, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  _brushedMetalTexture = texture;
  return texture;
}

// ============================================================================
// TRAP VISUAL INSTANCE & ANIMATION SYSTEM
// ============================================================================

export interface TrapVisualPart {
  mesh: THREE.Object3D;
  behavior: 'saw_spin' | 'piston_slam' | 'laser_flicker' | 'flame_pulse' | 'tesla_arc' | 'pendulum' | 'spike_retract';
  speed?: number;
  initialPos?: THREE.Vector3;
  initialRot?: THREE.Euler;
  axis?: 'x' | 'y' | 'z';
}

export interface TrapVisualInstance {
  id: string;
  group: THREE.Group;
  collider: BoxCollider;
  origin: Vector3D;
  parts: TrapVisualPart[];
  sparks?: THREE.Points;
  electricArcs?: THREE.Line[];
}

// Shared PBR Materials
function getTrapMaterials(isSoftwareGl: boolean) {
  const hazardStripeTex = getHazardStripeTexture();
  const grateTex = getPerforatedGrateTexture();

  return {
    heavySteel: new THREE.MeshStandardMaterial({
      color: '#334155',
      roughness: 0.35,
      metalness: 0.85,
    }),
    polishedChrome: new THREE.MeshStandardMaterial({
      color: '#cbd5e1',
      roughness: 0.15,
      metalness: 0.95,
    }),
    darkCastIron: new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.6,
      metalness: 0.7,
    }),
    sawSteel: new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      roughness: 0.2,
      metalness: 0.9,
    }),
    sawTeethGleam: new THREE.MeshStandardMaterial({
      color: '#ef4444',
      roughness: 0.25,
      metalness: 0.75,
    }),
    hazardStripe: new THREE.MeshStandardMaterial({
      map: hazardStripeTex,
      roughness: 0.4,
      metalness: 0.3,
    }),
    grateBase: new THREE.MeshStandardMaterial({
      map: grateTex,
      roughness: 0.5,
      metalness: 0.6,
    }),
    spikeSteel: new THREE.MeshStandardMaterial({
      color: '#94a3b8',
      roughness: 0.2,
      metalness: 0.88,
    }),
    bloodiedTip: new THREE.MeshStandardMaterial({
      color: '#991b1b',
      roughness: 0.3,
      metalness: 0.6,
    }),
    laserCore: new THREE.MeshBasicMaterial({
      color: '#ffffff',
    }),
    laserRedGlow: new THREE.MeshBasicMaterial({
      color: '#ef4444',
      transparent: true,
      opacity: 0.65,
    }),
    laserCyanGlow: new THREE.MeshBasicMaterial({
      color: '#06b6d4',
      transparent: true,
      opacity: 0.65,
    }),
    laserGoldLens: new THREE.MeshStandardMaterial({
      color: '#f59e0b',
      roughness: 0.2,
      metalness: 0.9,
    }),
    teslaCopper: new THREE.MeshStandardMaterial({
      color: '#b45309',
      roughness: 0.3,
      metalness: 0.85,
    }),
    teslaPorcelain: new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      roughness: 0.15,
      metalness: 0.1,
    }),
    teslaArc: new THREE.MeshBasicMaterial({
      color: '#67e8f9',
      transparent: true,
      opacity: 0.9,
    }),
    fireInner: new THREE.MeshBasicMaterial({
      color: '#ffffff',
    }),
    fireMid: new THREE.MeshBasicMaterial({
      color: '#f97316',
      transparent: true,
      opacity: 0.8,
    }),
    fireOuter: new THREE.MeshBasicMaterial({
      color: '#dc2626',
      transparent: true,
      opacity: 0.5,
    }),
    acidFluid: new THREE.MeshStandardMaterial({
      color: '#65a30d',
      roughness: 0.15,
      metalness: 0.3,
      transparent: true,
      opacity: 0.88,
    }),
    acidGlow: new THREE.MeshBasicMaterial({
      color: '#a3e635',
      transparent: true,
      opacity: 0.55,
    }),
  };
}

/**
 * Creates high-fidelity serrated saw blade disc geometry with realistic 16-point teeth
 */
function createSerratedSawGeometry(radius: number, teethCount: number = 16): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const innerR = radius * 0.82;
  const outerR = radius;

  for (let i = 0; i < teethCount; i++) {
    const angle1 = (i / teethCount) * Math.PI * 2;
    const angle2 = ((i + 0.6) / teethCount) * Math.PI * 2;
    const angle3 = ((i + 1) / teethCount) * Math.PI * 2;

    const x1 = Math.cos(angle1) * innerR;
    const y1 = Math.sin(angle1) * innerR;
    const x2 = Math.cos(angle2) * outerR;
    const y2 = Math.sin(angle2) * outerR;
    const x3 = Math.cos(angle3) * innerR;
    const y3 = Math.sin(angle3) * innerR;

    if (i === 0) {
      shape.moveTo(x1, y1);
    }
    shape.lineTo(x2, y2);
    shape.lineTo(x3, y3);
  }

  // Center arbor hole
  const hole = new THREE.Path();
  hole.absarc(0, 0, radius * 0.22, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.06,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  };

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  return geo;
}

/**
 * Builds realistic spark particle emitter trailing dangerous machinery
 */
function buildSparkEmitter(): THREE.Points {
  const count = 18;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 0.6;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: '#fbbf24',
    size: 0.12,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geo, mat);
}

// ============================================================================
// MAIN REALISTIC TRAP BUILDER
// ============================================================================

export function buildRealisticTrap(col: BoxCollider, isSoftwareGl: boolean): TrapVisualInstance {
  const group = new THREE.Group();
  group.position.set(col.x, col.y, col.z);

  const mats = getTrapMaterials(isSoftwareGl);
  const parts: TrapVisualPart[] = [];
  let sparks: THREE.Points | undefined;
  const electricArcs: THREE.Line[] = [];

  const hType = col.metadata?.hazardType || 'spikes';

  // 1. CIRCULAR SERRATED SAWS & ROTARY BLADES
  if (hType === 'saw' || hType === 'blade_fan' || hType === 'vortex_blade' || hType === 'shredder_drums') {
    const sawRadius = Math.max(col.width, col.height) * 0.55;

    // Heavy industrial steel mounting bracket / safety shroud
    const bracketW = sawRadius * 2.2;
    const bracketGeo = new THREE.BoxGeometry(bracketW, 0.22, 0.45);
    const bracketMesh = new THREE.Mesh(bracketGeo, mats.hazardStripe);
    bracketMesh.position.y = -sawRadius * 0.85;
    bracketMesh.castShadow = !isSoftwareGl;
    group.add(bracketMesh);

    // Bearing pillow block
    const pillowGeo = new THREE.CylinderGeometry(sawRadius * 0.35, sawRadius * 0.4, 0.3, 12);
    const pillowMesh = new THREE.Mesh(pillowGeo, mats.darkCastIron);
    pillowMesh.rotation.x = Math.PI / 2;
    group.add(pillowMesh);

    // Rotary blade group (contains serrated disc + arbor flange + teeth)
    const bladeGroup = new THREE.Group();

    // High-poly serrated blade
    const sawGeo = createSerratedSawGeometry(sawRadius, 16);
    const sawMesh = new THREE.Mesh(sawGeo, mats.sawSteel);
    sawMesh.castShadow = !isSoftwareGl;
    bladeGroup.add(sawMesh);

    // Chrome arbor flange & hex nut
    const flangeGeo = new THREE.CylinderGeometry(sawRadius * 0.3, sawRadius * 0.3, 0.12, 12);
    const flangeMesh = new THREE.Mesh(flangeGeo, mats.polishedChrome);
    flangeMesh.rotation.x = Math.PI / 2;
    bladeGroup.add(flangeMesh);

    const nutGeo = new THREE.CylinderGeometry(sawRadius * 0.12, sawRadius * 0.12, 0.18, 6);
    const nutMesh = new THREE.Mesh(nutGeo, mats.heavySteel);
    nutMesh.rotation.x = Math.PI / 2;
    bladeGroup.add(nutMesh);

    // Danger red rim warning
    const rimGeo = new THREE.TorusGeometry(sawRadius * 0.78, 0.04, 6, 24);
    const rimMesh = new THREE.Mesh(rimGeo, mats.sawTeethGleam);
    bladeGroup.add(rimMesh);

    group.add(bladeGroup);

    // Spark emitter
    sparks = buildSparkEmitter();
    sparks.position.set(0, -sawRadius * 0.8, 0);
    group.add(sparks);

    parts.push({
      mesh: bladeGroup,
      behavior: 'saw_spin',
      speed: 35, // High RPM visceral spin
      axis: 'z',
    });
  }

  // 2. HEAVY HYDRAULIC CRUSHER HAMMERS & GUILLOTINES
  else if (
    hType === 'hammer' ||
    hType === 'guillotine' ||
    hType === 'crusher_jaws' ||
    hType === 'twin_crushers' ||
    hType === 'spike_wall_slam'
  ) {
    // Overhead steel gantry beam
    const gantryH = 0.5;
    const gantryGeo = new THREE.BoxGeometry(col.width * 1.3, gantryH, col.depth * 1.3);
    const gantryMesh = new THREE.Mesh(gantryGeo, mats.darkCastIron);
    gantryMesh.position.y = col.height * 0.95;
    group.add(gantryMesh);

    // Hydraulic cylinder sleeve (top fixed housing)
    const sleeveH = col.height * 0.8;
    const sleeveGeo = new THREE.CylinderGeometry(0.32, 0.35, sleeveH, 12);
    const sleeveMesh = new THREE.Mesh(sleeveGeo, mats.darkCastIron);
    sleeveMesh.position.y = col.height * 0.55;
    group.add(sleeveMesh);

    // Piston assembly (moving part: chrome rod + heavy head + hazard chevrons)
    const pistonGroup = new THREE.Group();

    // Polished chrome hydraulic rod
    const rodH = col.height * 1.1;
    const rodGeo = new THREE.CylinderGeometry(0.18, 0.18, rodH, 12);
    const rodMesh = new THREE.Mesh(rodGeo, mats.polishedChrome);
    rodMesh.position.y = rodH * 0.45;
    pistonGroup.add(rodMesh);

    // Massive forged steel hammer head
    const headW = col.width;
    const headH = col.height * 0.55;
    const headD = col.depth;
    const headGeo = new THREE.BoxGeometry(headW, headH, headD);
    const headMesh = new THREE.Mesh(headGeo, mats.heavySteel);
    headMesh.castShadow = !isSoftwareGl;
    pistonGroup.add(headMesh);

    // Caution hazard stripes on hammer head sides
    const stripeSideGeo = new THREE.BoxGeometry(headW + 0.02, headH * 0.65, headD + 0.02);
    const stripeMesh = new THREE.Mesh(stripeSideGeo, mats.hazardStripe);
    pistonGroup.add(stripeMesh);

    // Heavy reinforced impact face with impact studs
    const faceGeo = new THREE.BoxGeometry(headW * 0.88, 0.15, headD * 0.88);
    const faceMesh = new THREE.Mesh(faceGeo, mats.darkCastIron);
    faceMesh.position.y = -headH / 2 - 0.05;
    pistonGroup.add(faceMesh);

    group.add(pistonGroup);

    parts.push({
      mesh: pistonGroup,
      behavior: 'piston_slam',
      speed: 3.2,
      initialPos: pistonGroup.position.clone(),
      axis: 'y',
    });
  }

  // 3. LETHAL FORGED-STEEL SPIKES & GRATE
  else if (
    hType === 'spikes' ||
    hType === 'ice_spikes' ||
    hType === 'spike_popups' ||
    hType === 'falling_stalactite'
  ) {
    // Recessed dark iron floor grating plate with perforated holes
    const baseH = 0.18;
    const baseGeo = new THREE.BoxGeometry(col.width, baseH, col.depth);
    const baseMesh = new THREE.Mesh(baseGeo, mats.grateBase);
    baseMesh.position.y = -col.height / 2 + baseH / 2;
    group.add(baseMesh);

    // Perimeter steel retention rim with bolted corners
    const rimW = 0.2;
    const rimGeo = new THREE.BoxGeometry(col.width + rimW, baseH + 0.04, col.depth + rimW);
    const rimMesh = new THREE.Mesh(rimGeo, mats.darkCastIron);
    rimMesh.position.copy(baseMesh.position);
    group.add(rimMesh);

    // Dense cluster of razor-sharp faceted 4-sided dagger spikes
    const spikeH = col.height - baseH;
    const spikeRadius = Math.min(0.24, Math.min(col.width, col.depth) * 0.22);
    const spikeGeo = new THREE.ConeGeometry(spikeRadius, spikeH, 4); // 4-sided faceted dagger cone
    spikeGeo.translate(0, spikeH / 2, 0);

    const stepX = Math.max(0.65, col.width / Math.max(1, Math.round(col.width / 0.85)));
    const stepZ = Math.max(0.65, col.depth / Math.max(1, Math.round(col.depth / 0.85)));

    const spikeMat = hType === 'ice_spikes' ? mats.polishedChrome : mats.spikeSteel;

    const spikesGroup = new THREE.Group();
    spikesGroup.position.y = -col.height / 2 + baseH;

    for (let sx = -col.width / 2 + stepX / 2; sx <= col.width / 2; sx += stepX) {
      for (let sz = -col.depth / 2 + stepZ / 2; sz <= col.depth / 2; sz += stepZ) {
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.set(sx, 0, sz);
        spike.castShadow = !isSoftwareGl;
        spikesGroup.add(spike);

        // Bloodied menacing tip cap on steel spikes
        if (hType !== 'ice_spikes') {
          const tipH = spikeH * 0.28;
          const tipGeo = new THREE.ConeGeometry(spikeRadius * 0.35, tipH, 4);
          const tipMesh = new THREE.Mesh(tipGeo, mats.bloodiedTip);
          tipMesh.position.set(sx, spikeH - tipH / 2, sz);
          spikesGroup.add(tipMesh);
        }
      }
    }
    group.add(spikesGroup);

    if (hType === 'spike_popups') {
      parts.push({
        mesh: spikesGroup,
        behavior: 'spike_retract',
        speed: 4.0,
        initialPos: spikesGroup.position.clone(),
      });
    }
  }

  // 4. VOLUMETRIC INDUSTRIAL LASER GATES & SWEEPERS
  else if (
    hType === 'laser' ||
    hType === 'laser_grid' ||
    hType === 'plasma_beam' ||
    hType === 'freezing_beam' ||
    hType === 'energy_whip' ||
    hType === 'laser_sweeper'
  ) {
    const isCyan = hType === 'freezing_beam' || hType === 'plasma_beam';

    // Left and Right High-Tech Emitter Projector Towers
    const pylonW = Math.max(0.4, col.width * 0.1);
    const pylonH = col.height * 2.2;
    const pylonD = Math.max(0.6, col.depth * 1.6);
    const pylonGeo = new THREE.BoxGeometry(pylonW, pylonH, pylonD);

    const pylonL = new THREE.Mesh(pylonGeo, mats.darkCastIron);
    pylonL.position.x = -col.width / 2;
    const pylonR = new THREE.Mesh(pylonGeo, mats.darkCastIron);
    pylonR.position.x = col.width / 2;
    group.add(pylonL, pylonR);

    // Brass magnetic focus rings on emitters
    const ringGeo = new THREE.TorusGeometry(pylonD * 0.32, 0.08, 8, 16);
    const ringL = new THREE.Mesh(ringGeo, mats.laserGoldLens);
    ringL.rotation.y = Math.PI / 2;
    ringL.position.set(-col.width / 2 + pylonW / 2 + 0.05, 0, 0);
    const ringR = new THREE.Mesh(ringGeo, mats.laserGoldLens);
    ringR.rotation.y = Math.PI / 2;
    ringR.position.set(col.width / 2 - pylonW / 2 - 0.05, 0, 0);
    group.add(ringL, ringR);

    // Multi-layer laser beam:
    // 1. Intense White/Ruby Core
    const coreH = Math.max(0.08, col.height * 0.35);
    const coreD = Math.max(0.08, col.depth * 0.35);
    const beamGeo = new THREE.BoxGeometry(col.width, coreH, coreD);
    const coreMesh = new THREE.Mesh(beamGeo, mats.laserCore);
    group.add(coreMesh);

    // 2. Volumetric Glow Corona
    const glowH = col.height * 0.85;
    const glowD = col.depth * 0.85;
    const glowGeo = new THREE.BoxGeometry(col.width * 1.01, glowH, glowD);
    const glowMesh = new THREE.Mesh(glowGeo, isCyan ? mats.laserCyanGlow : mats.laserRedGlow);
    group.add(glowMesh);

    // 3. Hot spark particles at focal points
    sparks = buildSparkEmitter();
    sparks.position.set(-col.width / 2 + 0.4, 0, 0);
    group.add(sparks);

    parts.push({
      mesh: glowMesh,
      behavior: 'laser_flicker',
      speed: 12.0,
    });
  }

  // 5. HIGH-VOLTAGE TESLA COIL & PLASMA DISCHARGE
  else if (
    hType === 'tesla_coil' ||
    hType === 'electro_arc' ||
    hType === 'shock_grid' ||
    hType === 'shock' ||
    hType === 'electric_fence'
  ) {
    // Insulator base stack
    const baseGeo = new THREE.CylinderGeometry(0.5, 0.7, 0.4, 16);
    const baseMesh = new THREE.Mesh(baseGeo, mats.darkCastIron);
    baseMesh.position.y = -col.height / 2 + 0.2;
    group.add(baseMesh);

    // Ribbed porcelain insulator tower
    const towerH = col.height * 0.75;
    const towerGeo = new THREE.CylinderGeometry(0.28, 0.35, towerH, 14);
    const towerMesh = new THREE.Mesh(towerGeo, mats.teslaPorcelain);
    towerMesh.position.y = -col.height / 2 + 0.2 + towerH / 2;
    group.add(towerMesh);

    // Heavy copper induction toroids
    const toroidGeo = new THREE.TorusGeometry(0.65, 0.12, 8, 20);
    const toroid1 = new THREE.Mesh(toroidGeo, mats.teslaCopper);
    toroid1.rotation.x = Math.PI / 2;
    toroid1.position.y = towerMesh.position.y + towerH * 0.15;
    const toroid2 = new THREE.Mesh(toroidGeo, mats.teslaCopper);
    toroid2.rotation.x = Math.PI / 2;
    toroid2.position.y = towerMesh.position.y - towerH * 0.2;
    group.add(toroid1, toroid2);

    // Stainless steel top electrode sphere
    const sphereRadius = 0.52;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 16, 16);
    const sphereMesh = new THREE.Mesh(sphereGeo, mats.polishedChrome);
    sphereMesh.position.y = towerMesh.position.y + towerH / 2 + sphereRadius * 0.9;
    group.add(sphereMesh);

    // Dynamic procedural lightning arc lines
    const arcPositions = new Float32Array(8 * 3);
    for (let i = 0; i < 8; i++) {
      arcPositions[i * 3] = (Math.random() - 0.5) * 1.2;
      arcPositions[i * 3 + 1] = sphereMesh.position.y + (Math.random() - 0.5) * 0.8;
      arcPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
    }
    const arcGeo = new THREE.BufferGeometry();
    arcGeo.setAttribute('position', new THREE.BufferAttribute(arcPositions, 3));
    const arcLine = new THREE.Line(arcGeo, mats.teslaArc);
    group.add(arcLine);
    electricArcs.push(arcLine);

    parts.push({
      mesh: arcLine,
      behavior: 'tesla_arc',
      speed: 25.0,
    });
  }

  // 6. INDUSTRIAL FLAMETHROWER & LAVA GEYSER
  else if (
    hType === 'flamethrower' ||
    hType === 'lava_geyser' ||
    hType === 'fire_ring' ||
    hType === 'solar_flare_vent'
  ) {
    // Heavy cast-iron manifold burner nozzle with fuel intake collar
    const nozzleH = Math.min(0.4, col.height * 0.28);
    const nozzleGeo = new THREE.CylinderGeometry(col.width * 0.38, col.width * 0.52, nozzleH, 14);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, mats.darkCastIron);
    nozzleMesh.position.y = -col.height / 2 + nozzleH / 2;
    group.add(nozzleMesh);

    // Brass pilot igniter ring
    const igniterGeo = new THREE.TorusGeometry(col.width * 0.36, 0.05, 6, 16);
    const igniterMesh = new THREE.Mesh(igniterGeo, mats.laserGoldLens);
    igniterMesh.rotation.x = Math.PI / 2;
    igniterMesh.position.y = nozzleMesh.position.y + nozzleH / 2;
    group.add(igniterMesh);

    // Multi-stage roaring flame cone
    const flameH = col.height - nozzleH;
    const flameGeo = new THREE.ConeGeometry(col.width * 0.44, flameH, 10);
    flameGeo.translate(0, flameH / 2, 0);

    const flameInner = new THREE.Mesh(flameGeo, mats.fireInner);
    flameInner.scale.set(0.45, 0.75, 0.45);
    flameInner.position.y = -col.height / 2 + nozzleH;

    const flameMid = new THREE.Mesh(flameGeo, mats.fireMid);
    flameMid.scale.set(0.85, 0.95, 0.85);
    flameMid.position.y = -col.height / 2 + nozzleH;

    const flameOuter = new THREE.Mesh(flameGeo, mats.fireOuter);
    flameOuter.scale.set(1.15, 1.05, 1.15);
    flameOuter.position.y = -col.height / 2 + nozzleH;

    group.add(flameInner, flameMid, flameOuter);

    parts.push({
      mesh: flameOuter,
      behavior: 'flame_pulse',
      speed: 16.0,
    });
  }

  // 7. PENDULUM SPIKE BALL / MORNINGSTAR
  else if (
    hType === 'pendulum_spikeball' ||
    hType === 'spinning_axes' ||
    hType === 'bladed_pendulum'
  ) {
    const ballRadius = Math.min(col.width, col.height) * 0.48;

    // Overhead heavy mounting pivot
    const pivotGeo = new THREE.BoxGeometry(0.8, 0.4, 0.8);
    const pivotMesh = new THREE.Mesh(pivotGeo, mats.darkCastIron);
    pivotMesh.position.y = col.height * 1.4;
    group.add(pivotMesh);

    // Heavy linked steel suspension rod
    const rodH = col.height * 1.4;
    const rodGeo = new THREE.CylinderGeometry(0.08, 0.08, rodH, 8);
    const rodMesh = new THREE.Mesh(rodGeo, mats.heavySteel);
    rodMesh.position.y = rodH / 2;
    group.add(rodMesh);

    // Heavy forged cast-iron spherical mace head
    const maceGeo = new THREE.SphereGeometry(ballRadius, 14, 14);
    const maceMesh = new THREE.Mesh(maceGeo, mats.heavySteel);
    maceMesh.castShadow = !isSoftwareGl;
    group.add(maceMesh);

    // Banded iron equator with studs
    const bandGeo = new THREE.TorusGeometry(ballRadius * 0.98, 0.06, 6, 18);
    const bandMesh = new THREE.Mesh(bandGeo, mats.darkCastIron);
    bandMesh.rotation.x = Math.PI / 2;
    group.add(bandMesh);

    // Needle-sharp conical iron spikes pointing outward
    const spikeH = ballRadius * 0.7;
    const spikeGeo = new THREE.ConeGeometry(0.12, spikeH, 4);
    spikeGeo.translate(0, spikeH / 2, 0);

    for (let p = 0; p < 10; p++) {
      const theta = (p / 10) * Math.PI * 2;
      const sp = new THREE.Mesh(spikeGeo, mats.spikeSteel);
      sp.position.set(Math.sin(theta) * ballRadius, Math.cos(theta) * ballRadius, 0);
      sp.rotation.z = -theta - Math.PI / 2;
      group.add(sp);
    }
  }

  // 8. CHEMICAL ACID POOL VAT
  else if (
    hType === 'acid_pool' ||
    hType === 'toxic_gas_jet' ||
    hType === 'caustic_drip' ||
    hType === 'steam_vent'
  ) {
    // Reinforced steel vat rim with hazard stripes
    const vatH = 0.32;
    const vatGeo = new THREE.BoxGeometry(col.width, vatH, col.depth);
    const vatMesh = new THREE.Mesh(vatGeo, mats.darkCastIron);
    vatMesh.position.y = -col.height / 2 + vatH / 2;
    group.add(vatMesh);

    const rimGeo = new THREE.BoxGeometry(col.width + 0.15, vatH + 0.05, col.depth + 0.15);
    const rimMesh = new THREE.Mesh(rimGeo, mats.hazardStripe);
    rimMesh.position.copy(vatMesh.position);
    group.add(rimMesh);

    // Bubbling toxic caustic lime fluid
    const fluidGeo = new THREE.BoxGeometry(col.width * 0.92, 0.18, col.depth * 0.92);
    const fluidMesh = new THREE.Mesh(fluidGeo, mats.acidFluid);
    fluidMesh.position.y = -col.height / 2 + vatH * 0.8;
    group.add(fluidMesh);

    const glowGeo = new THREE.BoxGeometry(col.width * 0.9, 0.22, col.depth * 0.9);
    const glowMesh = new THREE.Mesh(glowGeo, mats.acidGlow);
    glowMesh.position.copy(fluidMesh.position);
    group.add(glowMesh);

    parts.push({
      mesh: glowMesh,
      behavior: 'laser_flicker',
      speed: 8.0,
    });
  }

  // 9. DEFAULT MENACING HAZARD REINFORCED BLOCK
  else {
    const boxGeo = new THREE.BoxGeometry(col.width, col.height, col.depth);
    const boxMesh = new THREE.Mesh(boxGeo, mats.hazardStripe);
    boxMesh.castShadow = !isSoftwareGl;
    group.add(boxMesh);

    const rimGeo = new THREE.BoxGeometry(col.width * 1.02, col.height * 0.3, col.depth * 1.02);
    const rimMesh = new THREE.Mesh(rimGeo, mats.darkCastIron);
    group.add(rimMesh);
  }

  return {
    id: col.id,
    group,
    collider: col,
    origin: { x: col.x, y: col.y, z: col.z },
    parts,
    sparks,
    electricArcs,
  };
}

/**
 * Updates realistic trap animations, high-RPM saw spins, hydraulic hammer slams,
 * flickering laser sheaths, and particle sparks
 */
export function updateRealisticTrap(instance: TrapVisualInstance, time: number, dt: number) {
  // 1. Move root group if collider has platform motion
  const mov = instance.collider.metadata?.moving;
  if (mov) {
    const offset = Math.sin(time * mov.speed) * (mov.distance / 2);
    if (mov.axis === 'x') {
      instance.group.position.x = instance.origin.x + offset;
      instance.collider.x = instance.group.position.x;
    } else if (mov.axis === 'y') {
      instance.group.position.y = instance.origin.y + offset;
      instance.collider.y = instance.group.position.y;
    } else if (mov.axis === 'z') {
      instance.group.position.z = instance.origin.z + offset;
      instance.collider.z = instance.group.position.z;
    }
  }

  const rot = instance.collider.metadata?.rotating;
  if (rot) {
    instance.group.rotation[rot.axis] += rot.speed * dt;
  }

  // 2. Animate internal visceral mechanical components
  for (const part of instance.parts) {
    if (part.behavior === 'saw_spin') {
      // High-speed saw spin
      const spd = part.speed || 35;
      part.mesh.rotation.z += spd * dt;
    } else if (part.behavior === 'piston_slam') {
      // Realistic hydraulic hammer timing:
      // Slow tension raise -> sudden 10-ton free-fall impact -> momentary ground pause
      const cycle = (time * (part.speed || 3.0)) % (Math.PI * 2);
      let yOffset = 0;
      if (cycle < Math.PI * 1.2) {
        // Slow hydraulic raise
        yOffset = (Math.sin(cycle / 1.2 - Math.PI / 2) + 1) * 0.5 * (instance.collider.height * 0.9);
      } else if (cycle < Math.PI * 1.45) {
        // Explosive downward slam (fast cubic drop)
        const dropT = (cycle - Math.PI * 1.2) / (Math.PI * 0.25);
        yOffset = (1 - dropT * dropT * dropT) * (instance.collider.height * 0.9);
      } else {
        // Impact ground hold with slight rebound vibration
        yOffset = Math.sin(time * 50) * 0.04;
      }
      part.mesh.position.y = (part.initialPos?.y || 0) + yOffset;
    } else if (part.behavior === 'laser_flicker') {
      // Dynamic pulsing glow
      const flicker = 0.5 + Math.sin(time * (part.speed || 12)) * 0.25 + Math.random() * 0.1;
      const mat = (part.mesh as THREE.Mesh).material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = THREE.MathUtils.clamp(flicker, 0.35, 0.85);
    } else if (part.behavior === 'flame_pulse') {
      // Pulsing turbulent flame scale
      const s = 1.0 + Math.sin(time * 16) * 0.12 + (Math.random() - 0.5) * 0.08;
      part.mesh.scale.set(s, s * (1 + Math.cos(time * 20) * 0.1), s);
    } else if (part.behavior === 'tesla_arc') {
      // Regenerate randomized crackling lightning arc positions
      const line = part.mesh as THREE.Line;
      const posAttr = line.geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < arr.length / 3; i++) {
        arr[i * 3] = (Math.random() - 0.5) * 1.4;
        arr[i * 3 + 1] = 0.8 + (Math.random() - 0.5) * 0.8;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 1.4;
      }
      posAttr.needsUpdate = true;
    } else if (part.behavior === 'spike_retract') {
      // Menacing pop-up spikes
      const popCycle = Math.sin(time * 3.5);
      const isExtended = popCycle > 0;
      const targetY = isExtended ? 0 : -instance.collider.height * 0.8;
      part.mesh.position.y = THREE.MathUtils.lerp(part.mesh.position.y, targetY, 0.2);
    }
  }

  // 3. Animate flying spark particles
  if (instance.sparks) {
    const posAttr = instance.sparks.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < arr.length / 3; i++) {
      arr[i * 3] += (Math.random() - 0.5) * 0.08;
      arr[i * 3 + 1] -= Math.random() * 0.06; // fall down
      arr[i * 3 + 2] += (Math.random() - 0.5) * 0.08;

      if (arr[i * 3 + 1] < -0.8) {
        arr[i * 3] = (Math.random() - 0.5) * 0.4;
        arr[i * 3 + 1] = 0.2;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
      }
    }
    posAttr.needsUpdate = true;
  }
}
