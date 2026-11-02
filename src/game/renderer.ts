/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { BoxCollider, CameraMode, CharacterId, LevelDefinition, PlayerPhysicsState, Vector3D } from './types';
import { PHYSICS_CONSTANTS } from './rules';
import { CharacterRig, animateCharacterRig, buildCharacterRig } from './character';

// Pre-allocated scratch vectors for zero-GC render loop
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();

export class ParkourRenderer {
  public isSoftwareGl: boolean;
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public cameraMode: CameraMode = 'third_person';
  public container: HTMLElement;

  private frameId: number = 0;
  private isDestroyed: boolean = false;
  private levelMeshes: Map<string, THREE.Mesh | THREE.Group> = new Map();
  private movingMeshes: { id: string; mesh: THREE.Mesh | THREE.Group; collider: BoxCollider; origin: Vector3D }[] = [];

  // Procedural 3D athletic humanoid / cartoon character rig
  public characterId: CharacterId = 'kaito';
  public characterRig: CharacterRig;
  public playerGroup: THREE.Group;
  private speedLines!: THREE.LineSegments;

  // Camera damping
  private currentCamPos = new THREE.Vector3(0, 5, 10);
  private currentLookAt = new THREE.Vector3(0, 2, 0);
  private cameraRoll = 0;
  private cameraFovBase = 68;

  // Title flyover animation
  public isTitleScreen: boolean = true;
  private titleFlyTime = 0;

  constructor(container: HTMLElement) {
    this.container = container;

    // Detect software WebGL
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // Setup scene & camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0f172a');
    this.scene.fog = new THREE.FogExp2('#0f172a', 0.012);

    this.camera = new THREE.PerspectiveCamera(
      this.cameraFovBase,
      container.clientWidth / container.clientHeight,
      0.1,
      400
    );
    this.camera.position.set(0, 8, 14);

    // Studio Environment reflection
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Setup Lighting
    this.setupLighting();

    // Build procedural humanoid & cartoon character rig
    this.characterRig = buildCharacterRig(this.characterId, this.isSoftwareGl);
    this.playerGroup = this.characterRig.rootGroup;
    this.scene.add(this.playerGroup);

    // Build speed line streaks
    this.speedLines = this.buildSpeedLines();
    this.scene.add(this.speedLines);

    // Handle resize
    window.addEventListener('resize', this.onResize);
  }

  private setupLighting() {
    // Cool sky/ground ambient fill
    const hemiLight = new THREE.HemisphereLight('#f8fafc', '#334155', 0.95);
    hemiLight.position.set(0, 60, 0);
    this.scene.add(hemiLight);

    // Warm key sun light with soft shadows
    const dirLight = new THREE.DirectionalLight('#fff7ed', 1.8);
    dirLight.position.set(25, 45, 20);
    if (!this.isSoftwareGl) {
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 5;
      dirLight.shadow.camera.far = 120;
      const d = 40;
      dirLight.shadow.camera.left = -d;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = -d;
      dirLight.shadow.bias = -0.0005;
      dirLight.shadow.normalBias = 0.02;
    }
    this.scene.add(dirLight);

    // Subtle blue rim back-light
    const rimLight = new THREE.DirectionalLight('#38bdf8', 0.6);
    rimLight.position.set(-20, 20, -30);
    this.scene.add(rimLight);
  }

  /**
   * Switch the 3D player avatar to a selected Humanoid or Cartoon character
   */
  public setCharacter(characterId: CharacterId) {
    this.characterId = characterId;
    if (this.playerGroup) {
      this.scene.remove(this.playerGroup);
    }
    this.characterRig = buildCharacterRig(characterId, this.isSoftwareGl);
    this.playerGroup = this.characterRig.rootGroup;
    this.scene.add(this.playerGroup);
  }

  private mouseRaycaster = new THREE.Raycaster();
  private mouseNdc = new THREE.Vector2();
  private groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private groundTarget = new THREE.Vector3();

  /**
   * Projects screen mouse NDC (-1 to +1) onto 3D horizontal plane at player height
   */
  public getGroundIntersection(ndcX: number, ndcY: number, groundY: number): THREE.Vector3 | null {
    this.groundPlane.constant = -groundY;
    this.mouseNdc.set(ndcX, ndcY);
    this.mouseRaycaster.setFromCamera(this.mouseNdc, this.camera);
    const hit = this.mouseRaycaster.ray.intersectPlane(this.groundPlane, this.groundTarget);
    return hit ? this.groundTarget : null;
  }

  /**
   * Speed lines effect in high sprint/dash
   */
  private buildSpeedLines(): THREE.LineSegments {
    const lineCount = 30;
    const positions = new Float32Array(lineCount * 6);
    for (let i = 0; i < lineCount; i++) {
      const idx = i * 6;
      const x = (Math.random() - 0.5) * 8;
      const y = (Math.random() - 0.5) * 5;
      const z = -Math.random() * 8;
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;
      positions[idx + 3] = x;
      positions[idx + 4] = y;
      positions[idx + 5] = z - (2 + Math.random() * 4);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.LineBasicMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0,
    });
    const lines = new THREE.LineSegments(geo, mat);
    lines.visible = false;
    return lines;
  }

  /**
   * Build level 3D meshes from colliders
   */
  public loadLevel(level: LevelDefinition) {
    // Clear old meshes
    this.levelMeshes.forEach((mesh) => {
      this.scene.remove(mesh);
      if (mesh instanceof THREE.Mesh) {
        mesh.geometry.dispose();
      }
    });
    this.levelMeshes.clear();
    this.movingMeshes = [];

    // Sky and fog color based on level theme
    if (level.skyTheme === 'zenith') {
      this.scene.background = new THREE.Color('#0369a1');
      this.scene.fog = new THREE.FogExp2('#0369a1', 0.012);
    } else if (level.skyTheme === 'sunset') {
      this.scene.background = new THREE.Color('#431407');
      this.scene.fog = new THREE.FogExp2('#431407', 0.011);
    } else if (level.skyTheme === 'cyber') {
      this.scene.background = new THREE.Color('#1e1b4b');
      this.scene.fog = new THREE.FogExp2('#1e1b4b', 0.012);
    } else if (level.skyTheme === 'emerald') {
      this.scene.background = new THREE.Color('#064e3b');
      this.scene.fog = new THREE.FogExp2('#064e3b', 0.012);
    } else if (level.skyTheme === 'crimson') {
      this.scene.background = new THREE.Color('#4c0519');
      this.scene.fog = new THREE.FogExp2('#4c0519', 0.011);
    } else if (level.skyTheme === 'midnight') {
      this.scene.background = new THREE.Color('#020617');
      this.scene.fog = new THREE.FogExp2('#020617', 0.013);
    } else if (level.skyTheme === 'neon') {
      this.scene.background = new THREE.Color('#172554');
      this.scene.fog = new THREE.FogExp2('#172554', 0.012);
    } else {
      this.scene.background = new THREE.Color('#0f172a');
      this.scene.fog = new THREE.FogExp2('#0f172a', 0.013);
    }

    // Shared materials for clean performance
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.5,
      metalness: 0.05,
    });
    const wallRunMat = new THREE.MeshStandardMaterial({
      color: '#f97316', // Orange wall run strip
      roughness: 0.3,
      metalness: 0.1,
    });
    const bounceMat = new THREE.MeshStandardMaterial({
      color: '#ec4899', // Bright pink / orange bounce pad
      roughness: 0.25,
      metalness: 0.3,
    });
    const obstacleMat = new THREE.MeshStandardMaterial({
      color: '#ef4444', // Red laser / bar
      roughness: 0.4,
      metalness: 0.1,
    });
    const hazardLaserMat = new THREE.MeshBasicMaterial({
      color: '#ff003b',
    });
    const hazardLaserGlowMat = new THREE.MeshBasicMaterial({
      color: '#ff4d6d',
      transparent: true,
      opacity: 0.45,
    });
    const hazardSpikeMat = new THREE.MeshStandardMaterial({
      color: '#dc2626',
      roughness: 0.25,
      metalness: 0.8,
    });
    const hazardSawMat = new THREE.MeshStandardMaterial({
      color: '#e11d48',
      roughness: 0.2,
      metalness: 0.85,
    });
    const hazardPylonMat = new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.5,
      metalness: 0.6,
    });
    const hazardHammerMat = new THREE.MeshStandardMaterial({
      color: '#f59e0b', // High-visibility caution amber
      roughness: 0.35,
      metalness: 0.6,
    });
    const hazardSteelMat = new THREE.MeshStandardMaterial({
      color: '#334155',
      roughness: 0.25,
      metalness: 0.85,
    });
    const hazardFireMat = new THREE.MeshBasicMaterial({
      color: '#ff4500', // Roaring fiery orange
    });
    const hazardFireGlowMat = new THREE.MeshBasicMaterial({
      color: '#fbbf24', // Yellow flame glow
      transparent: true,
      opacity: 0.55,
    });
    const hazardShockMat = new THREE.MeshBasicMaterial({
      color: '#38bdf8', // Electric arc cyan
    });
    const hazardShockCoreMat = new THREE.MeshBasicMaterial({
      color: '#c084fc', // High voltage purple
      transparent: true,
      opacity: 0.7,
    });

    const hazardAcidMat = new THREE.MeshStandardMaterial({
      color: '#84cc16',
      roughness: 0.2,
      metalness: 0.2,
    });
    const hazardAcidGlowMat = new THREE.MeshBasicMaterial({
      color: '#a3e635',
      transparent: true,
      opacity: 0.7,
    });
    const hazardIceMat = new THREE.MeshStandardMaterial({
      color: '#38bdf8',
      roughness: 0.1,
      metalness: 0.3,
    });
    const hazardIceGlowMat = new THREE.MeshBasicMaterial({
      color: '#e0f2fe',
      transparent: true,
      opacity: 0.65,
    });
    const hazardPurpleMat = new THREE.MeshBasicMaterial({
      color: '#a855f7',
    });
    const hazardPurpleGlowMat = new THREE.MeshBasicMaterial({
      color: '#c084fc',
      transparent: true,
      opacity: 0.6,
    });
    const hazardDarkMat = new THREE.MeshStandardMaterial({
      color: '#1e293b',
      roughness: 0.4,
      metalness: 0.8,
    });

    level.colliders.forEach((col) => {
      // 1. Specialized 3D Visuals for Lethal Hazard Traps
      if (col.type === 'hazard') {
        const hazardGroup = new THREE.Group();
        hazardGroup.position.set(col.x, col.y, col.z);

        const hType = col.metadata?.hazardType || 'spikes';

        if (hType === 'spikes' || hType === 'ice_spikes' || hType === 'spike_popups' || hType === 'falling_stalactite') {
          // Sharp danger spikes (cones)
          const baseHeight = Math.min(0.15, col.height * 0.2);
          const baseGeo = new THREE.BoxGeometry(col.width, baseHeight, col.depth);
          const baseMesh = new THREE.Mesh(baseGeo, hazardPylonMat);
          baseMesh.position.y = -col.height / 2 + baseHeight / 2;
          hazardGroup.add(baseMesh);

          const spikeH = col.height - baseHeight;
          const spikeRadius = Math.min(0.25, Math.min(col.width, col.depth) * 0.25);
          const spikeGeo = new THREE.ConeGeometry(spikeRadius, spikeH, 4);
          const matToUse = hType === 'ice_spikes' ? hazardIceMat : hazardSpikeMat;

          const stepX = Math.max(0.6, col.width / Math.max(1, Math.round(col.width / 0.8)));
          const stepZ = Math.max(0.6, col.depth / Math.max(1, Math.round(col.depth / 0.8)));

          for (let sx = -col.width / 2 + stepX / 2; sx <= col.width / 2; sx += stepX) {
            for (let sz = -col.depth / 2 + stepZ / 2; sz <= col.depth / 2; sz += stepZ) {
              const spikeMesh = new THREE.Mesh(spikeGeo, matToUse);
              spikeMesh.position.set(sx, -col.height / 2 + baseHeight + spikeH / 2, sz);
              spikeMesh.castShadow = !this.isSoftwareGl;
              hazardGroup.add(spikeMesh);
            }
          }
        } else if (
          hType === 'laser' ||
          hType === 'laser_grid' ||
          hType === 'plasma_beam' ||
          hType === 'freezing_beam' ||
          hType === 'energy_whip'
        ) {
          // Glowing laser beam core + outer glow sheath
          const beamGeo = new THREE.BoxGeometry(col.width, col.height * 0.6, col.depth * 0.6);
          const beamMesh = new THREE.Mesh(beamGeo, hType === 'freezing_beam' ? hazardIceGlowMat : hazardLaserMat);
          hazardGroup.add(beamMesh);

          const glowGeo = new THREE.BoxGeometry(col.width * 1.02, col.height, col.depth);
          const glowMesh = new THREE.Mesh(glowGeo, hType === 'freezing_beam' ? hazardIceMat : hazardLaserGlowMat);
          hazardGroup.add(glowMesh);

          // Pylons
          const pylonW = Math.max(0.3, col.width * 0.08);
          const pylonH = col.height * 2.2;
          const pylonGeo = new THREE.BoxGeometry(pylonW, pylonH, col.depth * 1.8);

          const pylonL = new THREE.Mesh(pylonGeo, hazardPylonMat);
          pylonL.position.x = -col.width / 2;
          const pylonR = new THREE.Mesh(pylonGeo, hazardPylonMat);
          pylonR.position.x = col.width / 2;
          hazardGroup.add(pylonL, pylonR);
        } else if (hType === 'saw' || hType === 'blade_fan' || hType === 'vortex_blade') {
          // High-speed rotating hazard saw blade
          const sawRadius = Math.max(col.width, col.height) / 2;
          const sawGeo = new THREE.CylinderGeometry(sawRadius, sawRadius, 0.08, 16);
          const sawMesh = new THREE.Mesh(sawGeo, hazardSawMat);
          sawMesh.rotation.x = Math.PI / 2;
          hazardGroup.add(sawMesh);

          const hubGeo = new THREE.CylinderGeometry(sawRadius * 0.35, sawRadius * 0.35, 0.12, 12);
          const hubMesh = new THREE.Mesh(hubGeo, hazardPylonMat);
          hubMesh.rotation.x = Math.PI / 2;
          hazardGroup.add(hubMesh);
        } else if (hType === 'hammer' || hType === 'guillotine' || hType === 'crusher_jaws' || hType === 'twin_crushers' || hType === 'spike_wall_slam') {
          // Heavy Hydraulic Crusher Hammer / Guillotine
          const headGeo = new THREE.BoxGeometry(col.width, col.height, col.depth);
          const headMesh = new THREE.Mesh(headGeo, hazardHammerMat);
          hazardGroup.add(headMesh);

          const shaftH = col.height * 1.8;
          const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, shaftH, 10);
          const shaftMesh = new THREE.Mesh(shaftGeo, hazardSteelMat);
          shaftMesh.position.y = col.height / 2 + shaftH / 2;
          hazardGroup.add(shaftMesh);

          const faceGeo = new THREE.BoxGeometry(col.width * 0.85, col.height * 0.85, col.depth + 0.02);
          const faceMesh = new THREE.Mesh(faceGeo, hazardPylonMat);
          hazardGroup.add(faceMesh);
        } else if (hType === 'flamethrower' || hType === 'lava_geyser' || hType === 'fire_ring' || hType === 'solar_flare_vent') {
          // Industrial Burner Base Nozzle
          const nozzleH = Math.min(0.3, col.height * 0.25);
          const nozzleGeo = new THREE.CylinderGeometry(col.width * 0.45, col.width * 0.55, nozzleH, 12);
          const nozzleMesh = new THREE.Mesh(nozzleGeo, hazardSteelMat);
          nozzleMesh.position.y = -col.height / 2 + nozzleH / 2;
          hazardGroup.add(nozzleMesh);

          const flameH = col.height - nozzleH;
          const flameGeo = new THREE.ConeGeometry(col.width * 0.42, flameH, 8);
          const flameMesh = new THREE.Mesh(flameGeo, hazardFireMat);
          flameMesh.position.y = -col.height / 2 + nozzleH + flameH / 2;
          hazardGroup.add(flameMesh);

          const glowGeo = new THREE.ConeGeometry(col.width * 0.52, flameH * 1.05, 8);
          const glowMesh = new THREE.Mesh(glowGeo, hazardFireGlowMat);
          glowMesh.position.copy(flameMesh.position);
          hazardGroup.add(glowMesh);
        } else if (hType === 'roller_spikes' || hType === 'shredder_drums' || hType === 'drill_column') {
          // Horizontal Cylindrical Spiked Roller
          const rRadius = Math.min(col.width, col.height) * 0.4;
          const rLength = Math.max(col.width, col.depth);
          const cylinderGeo = new THREE.CylinderGeometry(rRadius, rRadius, rLength, 12);
          const cylinderMesh = new THREE.Mesh(cylinderGeo, hazardSteelMat);
          cylinderMesh.rotation.z = Math.PI / 2;
          hazardGroup.add(cylinderMesh);

          const ringCount = Math.max(3, Math.round(rLength / 1.2));
          const spikeH = rRadius * 0.8;
          const spikeRadius = 0.12;
          const spikeGeo = new THREE.ConeGeometry(spikeRadius, spikeH, 4);

          for (let r = 0; r < ringCount; r++) {
            const zPos = -rLength / 2 + (rLength / (ringCount + 1)) * (r + 1);
            for (let a = 0; a < 4; a++) {
              const angle = (a * Math.PI) / 2 + (r % 2 === 0 ? 0 : Math.PI / 4);
              const spMesh = new THREE.Mesh(spikeGeo, hazardSpikeMat);
              spMesh.position.set(
                Math.sin(angle) * (rRadius + spikeH / 2),
                Math.cos(angle) * (rRadius + spikeH / 2),
                zPos
              );
              spMesh.rotation.z = -angle;
              hazardGroup.add(spMesh);
            }
          }
        } else if (hType === 'laser_sweeper') {
          // Central Rotating Emitter Tower
          const towerGeo = new THREE.CylinderGeometry(0.35, 0.45, col.height * 1.5, 12);
          const towerMesh = new THREE.Mesh(towerGeo, hazardSteelMat);
          hazardGroup.add(towerMesh);

          const armLen = col.width / 2;
          const armGeo = new THREE.BoxGeometry(armLen, 0.22, 0.22);
          const armL = new THREE.Mesh(armGeo, hazardLaserMat);
          armL.position.x = armLen / 2;
          const armR = new THREE.Mesh(armGeo, hazardLaserMat);
          armR.position.x = -armLen / 2;
          hazardGroup.add(armL, armR);

          const armGlowGeo = new THREE.BoxGeometry(col.width, 0.35, 0.35);
          const armGlow = new THREE.Mesh(armGlowGeo, hazardLaserGlowMat);
          hazardGroup.add(armGlow);
        } else if (hType === 'shock_grid' || hType === 'shock' || hType === 'electric_fence') {
          // High-Voltage Electrified Floor Grid
          const baseGeo = new THREE.BoxGeometry(col.width, 0.12, col.depth);
          const baseMesh = new THREE.Mesh(baseGeo, hazardPylonMat);
          baseMesh.position.y = -col.height / 2 + 0.06;
          hazardGroup.add(baseMesh);

          const gridGeo = new THREE.BoxGeometry(col.width * 0.95, 0.16, col.depth * 0.95);
          const gridMesh = new THREE.Mesh(gridGeo, hazardShockMat);
          gridMesh.position.y = -col.height / 2 + 0.12;
          hazardGroup.add(gridMesh);

          const coreGeo = new THREE.BoxGeometry(col.width * 0.9, 0.2, col.depth * 0.9);
          const coreMesh = new THREE.Mesh(coreGeo, hazardShockCoreMat);
          coreMesh.position.copy(gridMesh.position);
          hazardGroup.add(coreMesh);
        } else if (hType === 'pendulum_spikeball' || hType === 'spinning_axes' || hType === 'bladed_pendulum') {
          // Overhead Pivot & Suspension Rod
          const ballRadius = Math.min(col.width, col.height) * 0.45;
          const ballGeo = new THREE.SphereGeometry(ballRadius, 12, 10);
          const ballMesh = new THREE.Mesh(ballGeo, hazardSteelMat);
          hazardGroup.add(ballMesh);

          const spikeH = ballRadius * 0.65;
          const spikeGeo = new THREE.ConeGeometry(0.14, spikeH, 4);
          for (let p = 0; p < 8; p++) {
            const theta = (p * Math.PI) / 4;
            const sp = new THREE.Mesh(spikeGeo, hazardSpikeMat);
            sp.position.set(Math.sin(theta) * (ballRadius + spikeH / 2), Math.cos(theta) * (ballRadius + spikeH / 2), 0);
            sp.rotation.z = -theta;
            hazardGroup.add(sp);
          }

          const cableGeo = new THREE.CylinderGeometry(0.04, 0.04, col.height * 2.5, 6);
          const cableMesh = new THREE.Mesh(cableGeo, hazardSteelMat);
          cableMesh.position.y = ballRadius + col.height * 1.25;
          hazardGroup.add(cableMesh);
        } else if (hType === 'tesla_coil' || hType === 'electro_arc' || hType === 'plasma_orb' || hType === 'ion_discharger') {
          // Tesla Coil & Plasma Lightning Tower
          const coilH = col.height * 0.8;
          const poleGeo = new THREE.CylinderGeometry(0.3, 0.45, coilH, 12);
          const poleMesh = new THREE.Mesh(poleGeo, hazardDarkMat);
          hazardGroup.add(poleMesh);

          const ringGeo = new THREE.TorusGeometry(0.7, 0.12, 8, 16);
          const ringMesh = new THREE.Mesh(ringGeo, hazardHammerMat);
          ringMesh.rotation.x = Math.PI / 2;
          ringMesh.position.y = coilH * 0.25;
          hazardGroup.add(ringMesh);

          const orbGeo = new THREE.SphereGeometry(0.55, 12, 12);
          const orbMesh = new THREE.Mesh(orbGeo, hazardPurpleMat);
          orbMesh.position.y = coilH / 2 + 0.35;
          hazardGroup.add(orbMesh);

          const glowGeo = new THREE.SphereGeometry(0.8, 12, 12);
          const glowMesh = new THREE.Mesh(glowGeo, hazardPurpleGlowMat);
          glowMesh.position.copy(orbMesh.position);
          hazardGroup.add(glowMesh);
        } else if (hType === 'acid_pool' || hType === 'toxic_gas_jet' || hType === 'caustic_drip' || hType === 'steam_vent') {
          // Corrosive Acid Vat Pool
          const vatGeo = new THREE.BoxGeometry(col.width, 0.25, col.depth);
          const vatMesh = new THREE.Mesh(vatGeo, hazardDarkMat);
          hazardGroup.add(vatMesh);

          const fluidGeo = new THREE.BoxGeometry(col.width * 0.92, 0.3, col.depth * 0.92);
          const fluidMesh = new THREE.Mesh(fluidGeo, hazardAcidMat);
          hazardGroup.add(fluidMesh);

          const glowGeo = new THREE.BoxGeometry(col.width * 0.88, 0.35, col.depth * 0.88);
          const glowMesh = new THREE.Mesh(glowGeo, hazardAcidGlowMat);
          hazardGroup.add(glowMesh);
        } else if (hType === 'gravity_well' || hType === 'antimatter_rift' || hType === 'quantum_barrier') {
          // Gravitational Singularity Core
          const coreGeo = new THREE.SphereGeometry(Math.min(col.width, col.height) * 0.4, 16, 16);
          const coreMesh = new THREE.Mesh(coreGeo, hazardDarkMat);
          hazardGroup.add(coreMesh);

          const ringGeo = new THREE.TorusGeometry(col.width * 0.45, 0.15, 8, 20);
          const ringMesh = new THREE.Mesh(ringGeo, hazardPurpleGlowMat);
          ringMesh.rotation.x = Math.PI / 2;
          hazardGroup.add(ringMesh);
        } else if (
          hType === 'proximity_mine' ||
          hType === 'sonic_emitter' ||
          hType === 'pulse_cannon' ||
          hType === 'hyper_core_meltdown' ||
          hType === 'meteor_strike'
        ) {
          // Tactical Mine / Sonic Turret
          const baseGeo = new THREE.CylinderGeometry(col.width * 0.4, col.width * 0.5, 0.25, 12);
          const baseMesh = new THREE.Mesh(baseGeo, hazardSteelMat);
          hazardGroup.add(baseMesh);

          const domeGeo = new THREE.SphereGeometry(col.width * 0.3, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2);
          const domeMesh = new THREE.Mesh(domeGeo, hazardLaserMat);
          domeMesh.position.y = 0.12;
          hazardGroup.add(domeMesh);
        } else {
          // Fallback lethal hazard block
          const boxGeo = new THREE.BoxGeometry(col.width, col.height, col.depth);
          const boxMesh = new THREE.Mesh(boxGeo, hazardLaserMat);
          hazardGroup.add(boxMesh);
        }

        this.scene.add(hazardGroup);
        this.levelMeshes.set(col.id, hazardGroup);

        if (col.metadata?.moving || col.metadata?.rotating) {
          this.movingMeshes.push({
            id: col.id,
            mesh: hazardGroup,
            collider: col,
            origin: { x: col.x, y: col.y, z: col.z },
          });
        }
        return;
      }

      const geo = new THREE.BoxGeometry(col.width, col.height, col.depth);

      let mat: THREE.Material;
      if (col.type === 'bounce') {
        mat = bounceMat;
      } else if (col.type === 'wall' && col.color === '#f97316') {
        mat = wallRunMat;
      } else if (col.type === 'obstacle') {
        mat = obstacleMat;
      } else if (col.type === 'checkpoint') {
        // Glowing 3D Emerald Checkpoint Gate Arch
        const cpGroup = new THREE.Group();
        cpGroup.position.set(col.x, col.y, col.z);

        const pillarMat = new THREE.MeshBasicMaterial({ color: '#10b981' });
        const glowMat = new THREE.MeshBasicMaterial({ color: '#34d399', transparent: true, opacity: 0.35 });

        // Left & Right Gate Pylons
        const pylonGeo = new THREE.BoxGeometry(0.5, col.height, 0.5);
        const pL = new THREE.Mesh(pylonGeo, pillarMat);
        pL.position.x = -col.width / 2;
        const pR = new THREE.Mesh(pylonGeo, pillarMat);
        pR.position.x = col.width / 2;
        cpGroup.add(pL, pR);

        // Top Arch Crossbar
        const archGeo = new THREE.BoxGeometry(col.width + 0.5, 0.5, 0.5);
        const archTop = new THREE.Mesh(archGeo, pillarMat);
        archTop.position.y = col.height / 2;
        cpGroup.add(archTop);

        // Holographic pass-through barrier
        const barrierGeo = new THREE.BoxGeometry(col.width, col.height * 0.9, 0.05);
        const barrier = new THREE.Mesh(barrierGeo, glowMat);
        cpGroup.add(barrier);

        // Floating Diamond Waypoint Marker
        const diamondGeo = new THREE.OctahedronGeometry(0.5, 0);
        const diamond = new THREE.Mesh(diamondGeo, pillarMat);
        diamond.position.y = col.height * 0.15;
        cpGroup.add(diamond);

        this.scene.add(cpGroup);
        this.levelMeshes.set(col.id, cpGroup);
        return;
      } else if (col.type === 'finish') {
        // Grand finish portal
        mat = new THREE.MeshBasicMaterial({ color: '#06b6d4', wireframe: true });
      } else {
        mat = col.color
          ? new THREE.MeshStandardMaterial({ color: col.color, roughness: 0.45, metalness: 0.05 })
          : groundMat;
      }

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(col.x, col.y, col.z);
      if (col.type !== 'finish') {
        mesh.receiveShadow = !this.isSoftwareGl;
        mesh.castShadow = !this.isSoftwareGl;

        // Subtle architectural edge accent for minimalist depth
        if (col.type === 'ground' || col.type === 'wall') {
          const edgeGeo = new THREE.EdgesGeometry(geo);
          const edgeMat = new THREE.LineBasicMaterial({
            color: col.type === 'wall' && col.color === '#f97316' ? '#fdba74' : '#64748b',
            transparent: true,
            opacity: 0.35,
          });
          const wire = new THREE.LineSegments(edgeGeo, edgeMat);
          mesh.add(wire);
        }
      }

      this.scene.add(mesh);
      this.levelMeshes.set(col.id, mesh);

      if (col.metadata?.moving || col.metadata?.rotating) {
        this.movingMeshes.push({
          id: col.id,
          mesh,
          collider: col,
          origin: { x: col.x, y: col.y, z: col.z },
        });
      }
    });
  }

  /**
   * Updates animated level elements like moving platforms and rotating hazard traps
   */
  public updateAnimatedPlatforms(time: number) {
    this.movingMeshes.forEach((item) => {
      const mov = item.collider.metadata?.moving;
      if (mov) {
        const offset = Math.sin(time * mov.speed) * (mov.distance / 2);
        if (mov.axis === 'x') {
          item.mesh.position.x = item.origin.x + offset;
          item.collider.x = item.mesh.position.x;
        } else if (mov.axis === 'y') {
          item.mesh.position.y = item.origin.y + offset;
          item.collider.y = item.mesh.position.y;
        } else if (mov.axis === 'z') {
          item.mesh.position.z = item.origin.z + offset;
          item.collider.z = item.mesh.position.z;
        }
      }

      const rot = item.collider.metadata?.rotating;
      if (rot) {
        item.mesh.rotation[rot.axis] += rot.speed * 0.016;
      }
    });
  }

  /**
   * Updates player 3D avatar pose, rotation, and animation
   */
  public updatePlayerMesh(player: PlayerPhysicsState, time: number, dt: number = 0.016) {
    // Always third person view - runner avatar is fully visible
    this.cameraMode = 'third_person';
    this.playerGroup.visible = true;

    // Animate full humanoid / cartoon character rig
    animateCharacterRig(this.characterRig, player, time, dt);

    // Speed lines
    const isHighSpeed = player.speed > 16 || player.isDashing;
    this.speedLines.visible = isHighSpeed;
    if (isHighSpeed) {
      this.speedLines.position.copy(this.camera.position);
      this.speedLines.quaternion.copy(this.camera.quaternion);
      const lineMat = this.speedLines.material as THREE.LineBasicMaterial;
      lineMat.opacity = Math.min((player.speed - 16) / 10, 0.6);
    }
  }

  /**
   * Smoothly updates camera position and look target in 3rd person chase view
   */
  public updateCamera(player: PlayerPhysicsState, dt: number) {
    if (this.isTitleScreen) {
      // Cinematic orbital flyover around start area showcasing the runner
      this.titleFlyTime += dt * 0.45;
      const r = 16;
      this.camera.position.set(
        Math.sin(this.titleFlyTime) * r,
        7 + Math.cos(this.titleFlyTime * 0.6) * 2,
        Math.cos(this.titleFlyTime) * r - 12
      );
      this.camera.lookAt(player.position.x, player.position.y + 1.2, player.position.z);
      return;
    }

    const yaw = player.rotation.yaw;
    const pitch = player.rotation.pitch;

    // Cinematic, athletic third-person chase camera (Camera số 3)
    const camDist = player.isSliding ? 3.8 : 4.8;
    const camHeight = player.isSliding ? 1.4 : 2.1;

    const backX = Math.sin(yaw) * Math.cos(pitch) * camDist;
    const backY = camHeight - Math.sin(pitch) * camDist;
    const backZ = Math.cos(yaw) * Math.cos(pitch) * camDist;

    _targetCamPos.set(
      player.position.x + backX,
      player.position.y + backY,
      player.position.z + backZ
    );

    // Camera target directly centered on character's core (chuột cố định ở giữa nhân vật)
    _targetLookAt.set(
      player.position.x,
      player.position.y + (player.isSliding ? 0.6 : 1.05),
      player.position.z
    );

    // Exponential damping
    const dampFactor = 1 - Math.exp(-20 * dt);
    this.currentCamPos.lerp(_targetCamPos, dampFactor);
    this.currentLookAt.lerp(_targetLookAt, dampFactor);

    this.camera.position.copy(this.currentCamPos);
    this.camera.lookAt(this.currentLookAt);

    // Dynamic FOV based on speed
    const targetFov = this.cameraFovBase + Math.min(player.speed * 0.8, 16);
    this.camera.fov = THREE.MathUtils.damp(this.camera.fov, targetFov, 6, dt);
    this.camera.updateProjectionMatrix();

    // Update jump rings
    this.updateJumpRings(dt);
  }

  private jumpRings: { mesh: THREE.Mesh; life: number; maxLife: number }[] = [];

  public spawnDoubleJumpRing(pos: Vector3D) {
    const ringGeo = new THREE.RingGeometry(0.2, 0.55, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(ringGeo, ringMat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(pos.x, pos.y + 0.1, pos.z);
    this.scene.add(mesh);
    this.jumpRings.push({ mesh, life: 0.28, maxLife: 0.28 });
  }

  private updateJumpRings(dt: number) {
    for (let i = this.jumpRings.length - 1; i >= 0; i--) {
      const item = this.jumpRings[i];
      item.life -= dt;
      const progress = 1 - item.life / item.maxLife;
      const scale = 1 + progress * 2.2;
      item.mesh.scale.set(scale, scale, scale);
      const mat = item.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, (item.life / item.maxLife) * 0.85);

      if (item.life <= 0) {
        this.scene.remove(item.mesh);
        item.mesh.geometry.dispose();
        mat.dispose();
        this.jumpRings.splice(i, 1);
      }
    }
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  private onResize = () => {
    if (!this.container || this.isDestroyed) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  public destroy() {
    this.isDestroyed = true;
    window.removeEventListener('resize', this.onResize);
    cancelAnimationFrame(this.frameId);
    this.renderer.dispose();
  }
}
