/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BoxCollider, Vector3D } from './types';
import { ALL_50_TRAPS } from './traps';

export interface EndlessBiome {
  id: string;
  name: string;
  theme: 'dawn' | 'neon' | 'cyber' | 'emerald' | 'crimson' | 'midnight' | 'zenith';
  color: string;
  groundColor: string;
  wallColor: string;
}

export const ENDLESS_BIOMES: EndlessBiome[] = [
  {
    id: 'cyber',
    name: 'Không Gian Cyber Vô Cực',
    theme: 'cyber',
    color: '#00f0ff',
    groundColor: '#262938',
    wallColor: '#c026d3',
  },
  {
    id: 'midnight',
    name: 'Dạ Khúc Vũ Trụ',
    theme: 'midnight',
    color: '#818cf8',
    groundColor: '#18133d',
    wallColor: '#6366f1',
  },
  {
    id: 'neon',
    name: 'Đô Thị Neon',
    theme: 'neon',
    color: '#06b6d4',
    groundColor: '#0f172a',
    wallColor: '#38bdf8',
  },
  {
    id: 'emerald',
    name: 'Mê Cung Lục Bảo',
    theme: 'emerald',
    color: '#10b981',
    groundColor: '#064e3b',
    wallColor: '#34d399',
  },
  {
    id: 'crimson',
    name: 'Hỏa Ngục Huyết Nguyệt',
    theme: 'crimson',
    color: '#ef4444',
    groundColor: '#270a0a',
    wallColor: '#f87171',
  },
  {
    id: 'zenith',
    name: 'Thiên Đỉnh Pha Lê',
    theme: 'zenith',
    color: '#0284c7',
    groundColor: '#f0f9ff',
    wallColor: '#38bdf8',
  },
  {
    id: 'dawn',
    name: 'Bình Minh Tối Giản',
    theme: 'dawn',
    color: '#f97316',
    groundColor: '#f8fafc',
    wallColor: '#fb923c',
  },
];

export interface EndlessChunk {
  chunkIndex: number;
  startZ: number;
  endZ: number;
  length: number;
  biome: EndlessBiome;
  colliders: BoxCollider[];
}

export interface EndlessStats {
  distance: number; // in meters (Math.abs(z))
  score: number;
  multiplier: number;
  biome: EndlessBiome;
  milestonesPassed: number;
  stuntBonus: number;
}

/**
 * Returns active biome according to distance reached
 */
export function getEndlessBiome(distance: number): EndlessBiome {
  const biomeIndex = Math.floor(distance / 350) % ENDLESS_BIOMES.length;
  return ENDLESS_BIOMES[biomeIndex];
}

/**
 * Calculate speed combo multiplier (1.0x to 3.0x)
 */
export function calculateSpeedMultiplier(speed: number, isDashing: boolean): number {
  if (isDashing) return 3.0;
  if (speed >= 22) return 2.5;
  if (speed >= 16) return 2.0;
  if (speed >= 10) return 1.5;
  return 1.0;
}

/**
 * Calculate total endless score based on distance, multiplier, and stunts
 */
export function calculateEndlessScore(
  distance: number,
  multiplier: number,
  stuntBonus: number
): number {
  return Math.floor(distance * 1.2 * multiplier + stuntBonus);
}

/**
 * Procedural Endless Segment Generator
 */
export class EndlessTrackGenerator {
  private currentZ: number = 0;
  private currentY: number = 0;
  private chunkCounter: number = 0;
  private milestoneCounter: number = 0;

  constructor() {
    this.reset();
  }

  public reset() {
    this.currentZ = 0;
    this.currentY = 0;
    this.chunkCounter = 0;
    this.milestoneCounter = 0;
  }

  /**
   * Generates initial runway safe zone for the runner
   */
  public generateInitialTrack(): EndlessChunk[] {
    this.reset();
    const chunks: EndlessChunk[] = [];

    // Safe starting platform (Z: 10 down to -50)
    const initialColliders: BoxCollider[] = [
      {
        id: 'endless_spawn_ground',
        type: 'ground',
        x: 0,
        y: 0,
        z: -15,
        width: 10,
        height: 1,
        depth: 50,
        color: ENDLESS_BIOMES[0].groundColor,
      },
      {
        id: 'endless_start_speed',
        type: 'speed',
        x: 0,
        y: 0.55,
        z: -25,
        width: 3.5,
        height: 0.1,
        depth: 12,
        color: '#06b6d4',
        metadata: { speedBoost: 16 },
      },
    ];

    const startChunk: EndlessChunk = {
      chunkIndex: this.chunkCounter++,
      startZ: 10,
      endZ: -40,
      length: 50,
      biome: ENDLESS_BIOMES[0],
      colliders: initialColliders,
    };
    this.currentZ = -40;
    chunks.push(startChunk);

    // Generate next 3 chunks ahead (~180m buffer)
    for (let i = 0; i < 3; i++) {
      chunks.push(this.generateNextChunk());
    }

    return chunks;
  }

  /**
   * Procedurally generates the next track chunk
   */
  public generateNextChunk(): EndlessChunk {
    const chunkIdx = this.chunkCounter++;
    const startZ = this.currentZ;
    const distanceTraveled = Math.abs(startZ);
    const biome = getEndlessBiome(distanceTraveled);

    // Difficulty scaling (0 to 1) capping at 2,000m
    const difficulty = Math.min(1.0, distanceTraveled / 2000);
    const trackWidth = Math.max(5.5, 9.0 - difficulty * 3.5);

    const colliders: BoxCollider[] = [];

    // Check if we should insert a Milestone Arch every ~250m
    const nextMilestoneDist = (this.milestoneCounter + 1) * 250;
    const isMilestoneChunk = distanceTraveled >= nextMilestoneDist - 40 && distanceTraveled < nextMilestoneDist + 40;
    if (isMilestoneChunk) {
      this.milestoneCounter++;
    }

    // Pick segment pattern
    // Available patterns:
    // 0: High-speed runway with sliding beams
    // 1: Wall run gauntlet (left/right)
    // 2: Chasm gap with bounce launchers
    // 3: Trap gauntlet with spinning saws / hydraulic crushers
    // 4: Laser sweepers arena
    // 5: Double wall zigzag over abyss
    // 6: Stepping pillar precision jumps
    const pattern = Math.floor(Math.random() * 7);

    const chunkLength = 50 + Math.floor(Math.random() * 20); // 50m - 70m
    const endZ = startZ - chunkLength;
    const midZ = (startZ + endZ) / 2;

    const basePrefix = `endless_${chunkIdx}`;

    switch (pattern) {
      case 0: {
        // High-speed runway with low sliding obstacles & speed strip
        colliders.push({
          id: `${basePrefix}_ground`,
          type: 'ground',
          x: 0,
          y: this.currentY,
          z: midZ,
          width: trackWidth,
          height: 1,
          depth: chunkLength,
          color: biome.groundColor,
        });

        // Speed pad
        colliders.push({
          id: `${basePrefix}_speed`,
          type: 'speed',
          x: 0,
          y: this.currentY + 0.55,
          z: startZ - 10,
          width: trackWidth * 0.45,
          height: 0.1,
          depth: 8,
          color: '#06b6d4',
          metadata: { speedBoost: 18 },
        });

        // 1 or 2 Low Slide Beams
        const slideY = this.currentY + 1.35; // Player standing height is 1.8; slide is 0.9
        colliders.push({
          id: `${basePrefix}_slide_beam_1`,
          type: 'hazard',
          x: 0,
          y: slideY,
          z: startZ - 25,
          width: trackWidth + 1,
          height: 0.6,
          depth: 0.8,
          metadata: {
            hazardType: 'spikes',
            hazardName: 'Thanh Quét Tầm Cao',
            hazardTip: 'Nhấn [C] hoặc [Ctrl] để trượt người xuống phía dưới!',
          },
        });

        if (difficulty > 0.3) {
          colliders.push({
            id: `${basePrefix}_slide_beam_2`,
            type: 'hazard',
            x: 0,
            y: slideY,
            z: startZ - 42,
            width: trackWidth + 1,
            height: 0.6,
            depth: 0.8,
            metadata: {
              hazardType: 'spikes',
              hazardName: 'Cổng Chắn Hạ Thấp',
              hazardTip: 'Duy trì trượt để vượt qua khe hẹp!',
            },
          });
        }
        break;
      }

      case 1: {
        // Wall Run Section: Chasm gap with left or right wall
        const side = chunkIdx % 2 === 0 ? 'left' : 'right';
        const wallX = side === 'left' ? -3.5 : 3.5;
        const normalX = side === 'left' ? 1 : -1;

        // Small takeoff platform
        colliders.push({
          id: `${basePrefix}_takeoff`,
          type: 'ground',
          x: 0,
          y: this.currentY,
          z: startZ - 6,
          width: trackWidth,
          height: 1,
          depth: 12,
          color: biome.groundColor,
        });

        // Vertical Wall Run Slab
        colliders.push({
          id: `${basePrefix}_wall`,
          type: 'wall',
          x: wallX,
          y: this.currentY + 2.5,
          z: midZ,
          width: 0.8,
          height: 6,
          depth: chunkLength - 16,
          color: biome.wallColor,
          metadata: {
            wallNormal: { x: normalX, z: 0 },
          },
        });

        // Landing platform
        colliders.push({
          id: `${basePrefix}_landing`,
          type: 'ground',
          x: 0,
          y: this.currentY,
          z: endZ + 6,
          width: trackWidth,
          height: 1,
          depth: 12,
          color: biome.groundColor,
        });
        break;
      }

      case 2: {
        // Chasm with Bounce Launcher
        const gapDist = 18 + difficulty * 6;
        colliders.push({
          id: `${basePrefix}_launch_platform`,
          type: 'ground',
          x: 0,
          y: this.currentY,
          z: startZ - 8,
          width: trackWidth,
          height: 1,
          depth: 16,
          color: biome.groundColor,
        });

        // Bounce pad
        colliders.push({
          id: `${basePrefix}_bounce`,
          type: 'bounce',
          x: 0,
          y: this.currentY + 0.6,
          z: startZ - 14,
          width: 4,
          height: 0.2,
          depth: 4,
          color: '#ec4899',
          metadata: { bounceStrength: 22 },
        });

        // Landing platform ahead across the abyss
        colliders.push({
          id: `${basePrefix}_chasm_land`,
          type: 'ground',
          x: 0,
          y: this.currentY,
          z: endZ + (chunkLength - gapDist) / 2,
          width: trackWidth,
          height: 1,
          depth: chunkLength - gapDist - 16,
          color: biome.groundColor,
        });
        break;
      }

      case 3: {
        // Trap Gauntlet: Full track with rotating saw blades or pendulum axes
        colliders.push({
          id: `${basePrefix}_ground`,
          type: 'ground',
          x: 0,
          y: this.currentY,
          z: midZ,
          width: trackWidth,
          height: 1,
          depth: chunkLength,
          color: biome.groundColor,
        });

        // Pick trap from realistic catalog
        const trapType = difficulty > 0.5 ? 'circular_saw' : 'pendulum_axe';
        const trapX = (chunkIdx % 2 === 0 ? 1 : -1) * (trackWidth * 0.25);

        colliders.push({
          id: `${basePrefix}_trap_1`,
          type: 'hazard',
          x: trapX,
          y: this.currentY + 1.2,
          z: startZ - 20,
          width: 2.2,
          height: 2.2,
          depth: 2.2,
          metadata: {
            hazardType: trapType,
            hazardName: trapType === 'circular_saw' ? 'Lưỡi Cưa Răng Cưa Tốc Độ Cao' : 'Rìu Con Lắc Hủy Diệt',
            hazardTip: 'Căn thời điểm hoặc nhảy đôi qua phía đối diện!',
            rotating: { axis: 'x', speed: 8 },
          },
        });

        if (difficulty > 0.4) {
          colliders.push({
            id: `${basePrefix}_trap_2`,
            type: 'hazard',
            x: -trapX,
            y: this.currentY + 1.2,
            z: startZ - 42,
            width: 2.2,
            height: 2.2,
            depth: 2.2,
            metadata: {
              hazardType: 'hydraulic_press',
              hazardName: 'Búa Thủy Lực Đập Nghiền',
              hazardTip: 'Lướt nhanh khi búa đang nâng lên!',
              moving: { axis: 'y', distance: 3.5, speed: 4.5 },
            },
          });
        }
        break;
      }

      case 4: {
        // Laser Sweeper Arena: Platform with traversing laser beam
        colliders.push({
          id: `${basePrefix}_ground`,
          type: 'ground',
          x: 0,
          y: this.currentY,
          z: midZ,
          width: trackWidth + 1,
          height: 1,
          depth: chunkLength,
          color: biome.groundColor,
        });

        // Moving laser trap
        colliders.push({
          id: `${basePrefix}_laser_sweep`,
          type: 'hazard',
          x: 0,
          y: this.currentY + 0.8,
          z: startZ - 28,
          width: trackWidth + 1,
          height: 0.4,
          depth: 0.4,
          metadata: {
            hazardType: 'laser_grid',
            hazardName: 'Lưới Laser Quét Ngang',
            hazardTip: 'Nhảy vọt qua tia laser hồng ngoại!',
            moving: { axis: 'z', distance: 16, speed: 3.2 },
          },
        });
        break;
      }

      case 5: {
        // Double Wall Zigzag over abyss
        const gapZ = 8;
        // Takeoff pad
        colliders.push({
          id: `${basePrefix}_takeoff`,
          type: 'ground',
          x: 0,
          y: this.currentY,
          z: startZ - 5,
          width: trackWidth,
          height: 1,
          depth: 10,
          color: biome.groundColor,
        });

        // Wall 1 (Left)
        colliders.push({
          id: `${basePrefix}_wall_left`,
          type: 'wall',
          x: -3.8,
          y: this.currentY + 2.5,
          z: startZ - 18,
          width: 0.8,
          height: 6,
          depth: 16,
          color: biome.wallColor,
          metadata: { wallNormal: { x: 1, z: 0 } },
        });

        // Wall 2 (Right)
        colliders.push({
          id: `${basePrefix}_wall_right`,
          type: 'wall',
          x: 3.8,
          y: this.currentY + 2.5,
          z: startZ - 36,
          width: 0.8,
          height: 6,
          depth: 16,
          color: biome.wallColor,
          metadata: { wallNormal: { x: -1, z: 0 } },
        });

        // Landing pad
        colliders.push({
          id: `${basePrefix}_landing`,
          type: 'ground',
          x: 0,
          y: this.currentY,
          z: endZ + 6,
          width: trackWidth,
          height: 1,
          depth: 12,
          color: biome.groundColor,
        });
        break;
      }

      default: {
        // Precision Pillars / Stepping Stones
        const stepCount = 3 + Math.floor(difficulty * 2);
        const stepSpacing = (chunkLength - 16) / stepCount;

        // Initial entry
        colliders.push({
          id: `${basePrefix}_step_in`,
          type: 'ground',
          x: 0,
          y: this.currentY,
          z: startZ - 4,
          width: trackWidth,
          height: 1,
          depth: 8,
          color: biome.groundColor,
        });

        for (let s = 0; s < stepCount; s++) {
          const stepZ = startZ - 10 - s * stepSpacing;
          const stepX = (s % 2 === 0 ? 1 : -1) * (1.8 * (s % 3 === 1 ? 0 : 1));
          colliders.push({
            id: `${basePrefix}_pillar_${s}`,
            type: 'ground',
            x: stepX,
            y: this.currentY,
            z: stepZ,
            width: 3.2,
            height: 1,
            depth: 4.2,
            color: biome.groundColor,
          });
        }

        // Exit pad
        colliders.push({
          id: `${basePrefix}_step_out`,
          type: 'ground',
          x: 0,
          y: this.currentY,
          z: endZ + 4,
          width: trackWidth,
          height: 1,
          depth: 8,
          color: biome.groundColor,
        });
        break;
      }
    }

    // Insert Milestone Checkpoint Archway if applicable
    if (isMilestoneChunk) {
      colliders.push({
        id: `${basePrefix}_milestone_arch`,
        type: 'checkpoint',
        x: 0,
        y: this.currentY + 2.5,
        z: midZ,
        width: trackWidth + 1.2,
        height: 5.5,
        depth: 1.5,
        metadata: {
          checkpointIndex: this.milestoneCounter,
        },
      });
    }

    this.currentZ = endZ;

    return {
      chunkIndex: chunkIdx,
      startZ,
      endZ,
      length: chunkLength,
      biome,
      colliders,
    };
  }
}
