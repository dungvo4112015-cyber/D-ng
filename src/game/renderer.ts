/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { BoxCollider, CameraMode, CharacterId, LevelDefinition, PlayerPhysicsState, Vector3D } from './types';
import { PHYSICS_CONSTANTS } from './rules';
import { CharacterRig, animateCharacterRig, buildCharacterRig } from './character';
import { buildRealisticTrap, updateRealisticTrap, TrapVisualInstance } from './trapVisuals';

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
  private trapInstances: TrapVisualInstance[] = [];

  // Procedural 3D athletic humanoid / cartoon character rig
  public characterId: CharacterId = 'kaito';
  public characterRig: CharacterRig;
  public playerGroup: THREE.Group;
  private speedLines!: THREE.LineSegments;
  private hemiLight!: THREE.HemisphereLight;
  private dirLight!: THREE.DirectionalLight;
  private rimLight!: THREE.DirectionalLight;

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
    this.scene.background = new THREE.Color('#201a4e');
    this.scene.fog = new THREE.FogExp2('#201a4e', 0.0085);

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

    // Build distant atmospheric monolith columns & soft cloud mist layers
    this.buildDistantMonoliths();
    this.buildCloudMistLayers();

    // Build procedural humanoid & cartoon character rig (Default to Sparky / Cyber Astronaut Runner)
    this.characterId = 'sparky';
    this.characterRig = buildCharacterRig(this.characterId, this.isSoftwareGl);
    this.playerGroup = this.characterRig.rootGroup;
    this.scene.add(this.playerGroup);

    // Build speed line streaks
    this.speedLines = this.buildSpeedLines();
    this.scene.add(this.speedLines);

    // Handle resize
    window.addEventListener('resize', this.onResize);
  }

  private buildDistantMonoliths() {
    const monolithGroup = new THREE.Group();
    const monoMat = new THREE.MeshStandardMaterial({
      color: '#18133d',
      roughness: 0.7,
      metalness: 0.1,
    });
    const edgeMat = new THREE.LineBasicMaterial({
      color: '#4f46e5',
      transparent: true,
      opacity: 0.25,
    });

    const positions = [
      { x: -35, z: 20, w: 10, h: 80, d: 10 },
      { x: 38, z: 15, w: 12, h: 90, d: 12 },
      { x: -45, z: -40, w: 14, h: 110, d: 14 },
      { x: 42, z: -55, w: 10, h: 85, d: 10 },
      { x: -38, z: -90, w: 12, h: 95, d: 12 },
      { x: 36, z: -110, w: 14, h: 100, d: 14 },
      { x: -42, z: -150, w: 12, h: 90, d: 12 },
      { x: 40, z: -180, w: 15, h: 105, d: 15 },
      { x: -48, z: -220, w: 14, h: 110, d: 14 },
      { x: 38, z: -250, w: 12, h: 88, d: 12 },
      { x: -40, z: -290, w: 12, h: 92, d: 12 },
      { x: 44, z: -330, w: 15, h: 115, d: 15 },
      { x: -36, z: -370, w: 12, h: 90, d: 12 },
      { x: 40, z: -410, w: 14, h: 100, d: 14 },
    ];

    positions.forEach((p) => {
      const geo = new THREE.BoxGeometry(p.w, p.h, p.d);
      const m = new THREE.Mesh(geo, monoMat);
      m.position.set(p.x, p.h / 2 - 20, p.z);
      const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat);
      m.add(edge);
      monolithGroup.add(m);
    });

    this.scene.add(monolithGroup);
  }

  private buildCloudMistLayers() {
    const cloudGroup = new THREE.Group();
    const cloudMat = new THREE.MeshBasicMaterial({
      color: '#6366f1',
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    });

    for (let i = 0; i < 18; i++) {
      const radius = 12 + Math.random() * 16;
      const geo = new THREE.CircleGeometry(radius, 24);
      const mesh = new THREE.Mesh(geo, cloudMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(
        (Math.random() - 0.5) * 45,
        -1.5 - Math.random() * 4,
        -i * 26 + (Math.random() - 0.5) * 15
      );
      mesh.scale.set(1.4, 0.9, 1);
      cloudGroup.add(mesh);
    }

    this.scene.add(cloudGroup);
  }

  private setupLighting() {
    // Atmospheric indigo-violet ambient fill
    this.hemiLight = new THREE.HemisphereLight('#a5b4fc', '#1e1848', 1.15);
    this.hemiLight.position.set(0, 60, 0);
    this.scene.add(this.hemiLight);

    // Warm key sun light with soft shadows
    this.dirLight = new THREE.DirectionalLight('#e0e7ff', 1.6);
    this.dirLight.position.set(25, 45, 20);
    if (!this.isSoftwareGl) {
      this.dirLight.castShadow = true;
      this.dirLight.shadow.mapSize.width = 1024;
      this.dirLight.shadow.mapSize.height = 1024;
      this.dirLight.shadow.camera.near = 5;
      this.dirLight.shadow.camera.far = 120;
      const d = 40;
      this.dirLight.shadow.camera.left = -d;
      this.dirLight.shadow.camera.right = d;
      this.dirLight.shadow.camera.top = d;
      this.dirLight.shadow.camera.bottom = -d;
      this.dirLight.shadow.bias = -0.0005;
      this.dirLight.shadow.normalBias = 0.02;
    }
    this.scene.add(this.dirLight);

    // Vibrant cyan rim back-light
    this.rimLight = new THREE.DirectionalLight('#38bdf8', 0.85);
    this.rimLight.position.set(-20, 20, -30);
    this.scene.add(this.rimLight);
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
   * Sets sky background, fog, and three-point studio lighting based on biome theme
   */
  public setSkyTheme(theme: string) {
    if (theme === 'zenith') {
      this.scene.background = new THREE.Color('#0284c7');
      this.scene.fog = new THREE.FogExp2('#0369a1', 0.010);
      if (this.hemiLight) this.hemiLight.color.set('#bae6fd');
      if (this.dirLight) this.dirLight.color.set('#ffffff');
      if (this.rimLight) this.rimLight.color.set('#38bdf8');
    } else if (theme === 'sunset') {
      this.scene.background = new THREE.Color('#451a03');
      this.scene.fog = new THREE.FogExp2('#7c2d12', 0.011);
      if (this.hemiLight) this.hemiLight.color.set('#fdba74');
      if (this.dirLight) this.dirLight.color.set('#f97316');
      if (this.rimLight) this.rimLight.color.set('#fb923c');
    } else if (theme === 'cyber') {
      this.scene.background = new THREE.Color('#201a4e');
      this.scene.fog = new THREE.FogExp2('#201a4e', 0.0085);
      if (this.hemiLight) this.hemiLight.color.set('#c084fc');
      if (this.dirLight) this.dirLight.color.set('#00f0ff');
      if (this.rimLight) this.rimLight.color.set('#e879f9');
    } else if (theme === 'emerald') {
      this.scene.background = new THREE.Color('#022c22');
      this.scene.fog = new THREE.FogExp2('#064e3b', 0.012);
      if (this.hemiLight) this.hemiLight.color.set('#34d399');
      if (this.dirLight) this.dirLight.color.set('#6ee7b7');
      if (this.rimLight) this.rimLight.color.set('#10b981');
    } else if (theme === 'crimson') {
      this.scene.background = new THREE.Color('#2a0808');
      this.scene.fog = new THREE.FogExp2('#450a0a', 0.011);
      if (this.hemiLight) this.hemiLight.color.set('#f87171');
      if (this.dirLight) this.dirLight.color.set('#ef4444');
      if (this.rimLight) this.rimLight.color.set('#f97316');
    } else if (theme === 'midnight') {
      this.scene.background = new THREE.Color('#020617');
      this.scene.fog = new THREE.FogExp2('#020617', 0.013);
      if (this.hemiLight) this.hemiLight.color.set('#60a5fa');
      if (this.dirLight) this.dirLight.color.set('#93c5fd');
      if (this.rimLight) this.rimLight.color.set('#c084fc');
    } else if (theme === 'neon') {
      this.scene.background = new THREE.Color('#080d24');
      this.scene.fog = new THREE.FogExp2('#172554', 0.012);
      if (this.hemiLight) this.hemiLight.color.set('#38bdf8');
      if (this.dirLight) this.dirLight.color.set('#38bdf8');
      if (this.rimLight) this.rimLight.color.set('#ec4899');
    } else {
      this.scene.background = new THREE.Color('#fdba74');
      this.scene.fog = new THREE.FogExp2('#9a3412', 0.009);
      if (this.hemiLight) this.hemiLight.color.set('#fed7aa');
      if (this.dirLight) this.dirLight.color.set('#ffedd5');
      if (this.rimLight) this.rimLight.color.set('#f97316');
    }
  }

  /**
   * Constructs and adds 3D visuals for a single BoxCollider
   */
  public addColliderMesh(col: BoxCollider) {
    if (this.levelMeshes.has(col.id)) return;

    // 1. Visceral 3D Visuals for Lethal Hazard Traps
    if (col.type === 'hazard') {
      const trapInst = buildRealisticTrap(col, this.isSoftwareGl);
      this.scene.add(trapInst.group);
      this.levelMeshes.set(col.id, trapInst.group);
      this.trapInstances.push(trapInst);
      return;
    }

    const geo = new THREE.BoxGeometry(col.width, col.height, col.depth);
    let mat: THREE.Material;

    if (col.type === 'bounce') {
      // Futuristic Sky-Blue Pad with Glowing Emissive Core
      mat = new THREE.MeshStandardMaterial({
        color: '#f0f9ff',
        roughness: 0.25,
        metalness: 0.2,
        emissive: new THREE.Color('#0284c7'),
        emissiveIntensity: 0.25,
      });
    } else if (col.type === 'wall') {
      mat = new THREE.MeshStandardMaterial({
        color: col.color || '#c026d3',
        roughness: 0.25,
        metalness: 0.15,
        emissive: new THREE.Color(col.color || '#c026d3'),
        emissiveIntensity: 0.35,
      });
    } else if (col.type === 'speed') {
      mat = new THREE.MeshStandardMaterial({
        color: col.color || '#00f0ff',
        roughness: 0.2,
        metalness: 0.2,
        emissive: new THREE.Color(col.color || '#00f0ff'),
        emissiveIntensity: 0.45,
      });
    } else if (col.type === 'obstacle') {
      mat = new THREE.MeshStandardMaterial({
        color: '#ef4444',
        roughness: 0.4,
        metalness: 0.1,
      });
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
      mat = new THREE.MeshBasicMaterial({ color: '#00f0ff', wireframe: true });
    } else {
      // Sleek Dark Graphite Platform Surface
      mat = new THREE.MeshStandardMaterial({
        color: col.color || '#262938',
        roughness: 0.45,
        metalness: 0.12,
      });
    }

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(col.x, col.y, col.z);

    if (col.type !== 'finish') {
      mesh.receiveShadow = !this.isSoftwareGl;
      mesh.castShadow = !this.isSoftwareGl;

      if (col.type === 'bounce') {
        // Concentric electric cyan ripple rings on bounce pads (Exactly matching screenshot!)
        const rippleGroup = new THREE.Group();
        rippleGroup.position.set(0, col.height / 2 + 0.015, 0);
        rippleGroup.rotation.x = -Math.PI / 2;
        const rippleMat = new THREE.MeshBasicMaterial({ color: '#00f0ff', transparent: true, opacity: 0.95 });
        for (let r = 1; r <= 3; r++) {
          const ring = new THREE.Mesh(new THREE.RingGeometry(r * 0.42, r * 0.42 + 0.09, 32), rippleMat);
          ring.scale.set(1.35, 0.85, 1);
          rippleGroup.add(ring);
        }
        mesh.add(rippleGroup);

        // Vibrant cyan perimeter edge wire
        const edgeGeo = new THREE.EdgesGeometry(geo);
        const edgeMat = new THREE.LineBasicMaterial({
          color: '#00f0ff',
          transparent: true,
          opacity: 0.9,
        });
        const wire = new THREE.LineSegments(edgeGeo, edgeMat);
        mesh.add(wire);
      } else if (col.type === 'ground' || col.type === 'wall') {
        // Vibrant neon purple/magenta borders and beveled edge highlights (as in screenshot!)
        const borderColor = col.type === 'wall' ? (col.color || '#f97316') : '#c026d3';
        const edgeGeo = new THREE.EdgesGeometry(geo);
        const edgeMat = new THREE.LineBasicMaterial({
          color: borderColor,
          transparent: true,
          opacity: 0.95,
        });
        const wire = new THREE.LineSegments(edgeGeo, edgeMat);
        mesh.add(wire);

        if (col.type === 'ground') {
          // Subtle etched cross (+) marking on top surface of each platform
          const crossMat = new THREE.LineBasicMaterial({
            color: '#7c3aed',
            transparent: true,
            opacity: 0.5,
          });
          const halfW = Math.min(col.width * 0.38, 2.8);
          const halfD = Math.min(col.depth * 0.38, 2.8);
          const crossPoints = [
            new THREE.Vector3(-halfW, col.height / 2 + 0.012, 0),
            new THREE.Vector3(halfW, col.height / 2 + 0.012, 0),
            new THREE.Vector3(0, col.height / 2 + 0.012, -halfD),
            new THREE.Vector3(0, col.height / 2 + 0.012, halfD),
          ];
          const crossGeo = new THREE.BufferGeometry().setFromPoints(crossPoints);
          const crossMesh = new THREE.LineSegments(crossGeo, crossMat);
          mesh.add(crossMesh);

          // Glowing vertical corner bevel accents at the 4 corners of platform
          const cornerGeo = new THREE.BoxGeometry(0.12, col.height + 0.04, 0.12);
          const cornerMat = new THREE.MeshBasicMaterial({ color: '#e879f9' });
          const cx = col.width / 2;
          const cz = col.depth / 2;
          const c1 = new THREE.Mesh(cornerGeo, cornerMat);
          c1.position.set(-cx, 0, -cz);
          const c2 = new THREE.Mesh(cornerGeo, cornerMat);
          c2.position.set(cx, 0, -cz);
          const c3 = new THREE.Mesh(cornerGeo, cornerMat);
          c3.position.set(-cx, 0, cz);
          const c4 = new THREE.Mesh(cornerGeo, cornerMat);
          c4.position.set(cx, 0, cz);
          mesh.add(c1, c2, c3, c4);
        }
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
  }

  /**
   * Dynamically append new colliders into active scene (for endless procedural streaming)
   */
  public appendColliders(newColliders: BoxCollider[]) {
    for (const col of newColliders) {
      this.addColliderMesh(col);
    }
  }

  /**
   * Remove and clean up culled colliders that have fallen far behind player
   */
  public removeColliders(colliderIds: string[]) {
    const idSet = new Set(colliderIds);

    for (const id of colliderIds) {
      const mesh = this.levelMeshes.get(id);
      if (mesh) {
        this.scene.remove(mesh);
        mesh.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry?.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else if (obj.material) {
              obj.material.dispose();
            }
          }
        });
        this.levelMeshes.delete(id);
      }
    }

    this.movingMeshes = this.movingMeshes.filter((m) => !idSet.has(m.id));
    this.trapInstances = this.trapInstances.filter((t) => !idSet.has(t.collider.id));
  }

  /**
   * Build level 3D meshes from colliders
   */
  public loadLevel(level: LevelDefinition) {
    // Clear old meshes
    this.levelMeshes.forEach((mesh) => {
      this.scene.remove(mesh);
      mesh.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });
    });
    this.levelMeshes.clear();
    this.movingMeshes = [];
    this.trapInstances = [];

    // Sky, fog and dynamic biome lighting based on level theme
    this.setSkyTheme(level.skyTheme);

    level.colliders.forEach((col) => {
      this.addColliderMesh(col);
    });
  }

  /**
   * Updates animated level elements like moving platforms, rotating hazard traps,
   * high-speed serrated saw blades, hydraulic hammers, and electrical arcs
   */
  public updateAnimatedPlatforms(time: number, dt: number = 0.016) {
    // 1. Update realistic mechanical traps (sparks, hydraulic pistons, saw spins, laser flicker)
    for (let i = 0; i < this.trapInstances.length; i++) {
      updateRealisticTrap(this.trapInstances[i], time, dt);
    }

    // 2. Update regular moving platforms
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
        item.mesh.rotation[rot.axis] += rot.speed * dt;
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
