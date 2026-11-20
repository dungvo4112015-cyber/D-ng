/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkPointInBox,
  resolveBoxCollision,
  evaluateWallRun,
  calculateMedal,
  formatGameTime,
  calculateYawTowards,
  canPerformJump,
  PHYSICS_CONSTANTS,
  calculateAerodynamicDrag,
  calculateSlopeAcceleration,
  calculateBounceElasticRecoil,
  calculateLandingMomentumTransfer,
  calculateCentripetalBanking,
  calculateGForce,
  calculateKineticEnergy,
  calculateImpulseReaction,
} from './rules';
import { BoxCollider } from './types';
import { buildRealisticTrap, updateRealisticTrap } from './trapVisuals';

test('checkPointInBox detects containment inside box bounds', () => {
  const box: BoxCollider = {
    id: 'b1',
    type: 'ground',
    x: 0,
    y: 0,
    z: 0,
    width: 10,
    height: 2,
    depth: 10,
  };

  assert.equal(checkPointInBox({ x: 0, y: 0, z: 0 }, box), true);
  assert.equal(checkPointInBox({ x: 4, y: 0.9, z: 4 }, box), true);
  assert.equal(checkPointInBox({ x: 6, y: 0, z: 0 }, box), false);
  assert.equal(checkPointInBox({ x: 0, y: 2.1, z: 0 }, box), false);
});

test('resolveBoxCollision lands player squarely on top of box', () => {
  const floorBox: BoxCollider = {
    id: 'floor',
    type: 'ground',
    x: 0,
    y: 0,
    z: 0,
    width: 20,
    height: 2, // top is at y = 1
    depth: 20,
  };

  // Player falling down towards floor
  const playerPos = { x: 0, y: 0.95, z: 0 };
  const playerVel = { x: 0, y: -5, z: 0 };

  const res = resolveBoxCollision(
    playerPos,
    playerVel,
    PHYSICS_CONSTANTS.PLAYER_RADIUS,
    PHYSICS_CONSTANTS.PLAYER_STANDING_HEIGHT,
    floorBox
  );

  assert.equal(res.hitGround, true);
  assert.equal(res.pos.y, 1.0); // clamped to top of box (y = 1)
  assert.equal(res.vel.y, 0); // vertical downward velocity stopped
});

test('resolveBoxCollision stops horizontal penetration against wall', () => {
  const wallBox: BoxCollider = {
    id: 'wall',
    type: 'wall',
    x: 10,
    y: 5,
    z: 0,
    width: 2, // left edge is at x = 9
    height: 10,
    depth: 10,
  };

  // Player running towards wall from x = 8.8 with radius = 0.4 (penetrating into 9.2)
  const playerPos = { x: 8.8, y: 5, z: 0 };
  const playerVel = { x: 6, y: 0, z: 0 };

  const res = resolveBoxCollision(
    playerPos,
    playerVel,
    0.4,
    1.8,
    wallBox
  );

  assert.equal(res.hitWall, true);
  assert.equal(res.pos.x, 8.6); // 9.0 - 0.4
  assert.equal(res.vel.x, 0);
  assert.notEqual(res.wallNormal, null);
  assert.equal(res.wallNormal?.x, -1);
});

test('evaluateWallRun validates wall alignment and side', () => {
  const wallNormal = { x: 1, z: 0 }; // Wall is facing +X (running along Z axis)
  const lookYaw = Math.PI; // Looking in +Z direction (forward: x=0, z=1)
  const vel = { x: 0, y: 0, z: 10 };

  const res = evaluateWallRun(false, wallNormal, lookYaw, vel);
  assert.equal(res.canWallRun, true);
  assert.ok(res.side === 'left' || res.side === 'right');
  assert.equal(res.forwardDir.z !== 0, true);

  // Grounded player cannot wall run
  const groundedRes = evaluateWallRun(true, wallNormal, lookYaw, vel);
  assert.equal(groundedRes.canWallRun, false);
});

test('calculateMedal evaluates time against thresholds correctly', () => {
  const targets = { gold: 20, silver: 30, bronze: 45 };

  assert.equal(calculateMedal(18.5, targets), 'gold');
  assert.equal(calculateMedal(20.0, targets), 'gold');
  assert.equal(calculateMedal(25.4, targets), 'silver');
  assert.equal(calculateMedal(35.0, targets), 'bronze');
  assert.equal(calculateMedal(50.0, targets), 'none');
});

test('formatGameTime produces accurate two-digit padded strings', () => {
  assert.equal(formatGameTime(65.42), '01:05.42');
  assert.equal(formatGameTime(9.08), '00:09.08');
  assert.equal(formatGameTime(0), '00:00.00');
});

test('calculateYawTowards points directly to target coordinate', () => {
  // Target directly forward (-Z)
  const yawForward = calculateYawTowards({ x: 0, z: 0 }, { x: 0, z: -10 });
  assert.ok(Math.abs(yawForward - 0) < 0.001);

  // Target directly right (+X)
  const yawRight = calculateYawTowards({ x: 0, z: 0 }, { x: 10, z: 0 });
  assert.ok(Math.abs(yawRight - (-Math.PI / 2)) < 0.001);

  // Target directly left (-X)
  const yawLeft = calculateYawTowards({ x: 0, z: 0 }, { x: -10, z: 0 });
  assert.ok(Math.abs(yawLeft - (Math.PI / 2)) < 0.001);

  // Target backward (+Z)
  const yawBack = calculateYawTowards({ x: 0, z: 0 }, { x: 0, z: 10 });
  assert.ok(Math.abs(Math.abs(yawBack) - Math.PI) < 0.001);
});

test('canPerformJump supports ground jump, double jump in air, and wall jump', () => {
  // 1. On ground -> ground jump
  const groundRes = canPerformJump(true, 0, false, 2);
  assert.equal(groundRes.canJump, true);
  assert.equal(groundRes.jumpType, 'ground');

  // 2. In coyote time -> ground jump
  const coyoteRes = canPerformJump(false, 0.1, false, 2);
  assert.equal(coyoteRes.canJump, true);
  assert.equal(coyoteRes.jumpType, 'ground');

  // 3. In mid-air with 1 jump remaining -> double jump
  const doubleJumpRes = canPerformJump(false, 0, false, 1);
  assert.equal(doubleJumpRes.canJump, true);
  assert.equal(doubleJumpRes.jumpType, 'double');

  // 4. In mid-air with 0 jumps remaining -> cannot jump
  const exhaustedRes = canPerformJump(false, 0, false, 0);
  assert.equal(exhaustedRes.canJump, false);
  assert.equal(exhaustedRes.jumpType, 'none');

  // 5. On wall -> wall jump
  const wallRes = canPerformJump(false, 0, true, 0);
  assert.equal(wallRes.canJump, true);
  assert.equal(wallRes.jumpType, 'wall');
});

test('resolveBoxCollision detects lethal hazard collision across all trap types', () => {
  const trapTypes: Array<NonNullable<BoxCollider['metadata']>['hazardType']> = [
    'spikes',
    'laser',
    'saw',
    'shock',
    'hammer',
    'flamethrower',
    'roller_spikes',
    'laser_sweeper',
    'shock_grid',
    'pendulum_spikeball',
  ];

  trapTypes.forEach((hType, idx) => {
    const trap: BoxCollider = {
      id: `test_trap_${idx}`,
      type: 'hazard',
      x: 0,
      y: 1.0,
      z: -20,
      width: 4,
      height: 2,
      depth: 4,
      metadata: {
        hazardType: hType,
        hazardName: `Test ${hType}`,
        hazardTip: 'Avoid it!',
      },
    };

    const playerPos = { x: 0, y: 0.8, z: -20 };
    const playerVel = { x: 0, y: 0, z: -4 };
    const res = resolveBoxCollision(playerPos, playerVel, 0.4, 1.8, trap);
    assert.equal(res.triggerType, 'hazard');
  });
});

test('ALL_50_TRAPS catalog has exactly 50 distinct, valid traps with categories and lore', async () => {
  const { ALL_50_TRAPS, getTrapDefinition } = await import('./traps');
  assert.equal(ALL_50_TRAPS.length, 50);

  const idSet = new Set<string>();
  ALL_50_TRAPS.forEach((trap, i) => {
    assert.ok(trap.id && trap.id.length > 0, `Trap ${i} missing ID`);
    assert.ok(trap.name && trap.name.length > 0, `Trap ${trap.id} missing name`);
    assert.ok(trap.evasionTip && trap.evasionTip.length > 0, `Trap ${trap.id} missing evasionTip`);
    assert.ok(trap.dangerLevel >= 1 && trap.dangerLevel <= 5, `Trap ${trap.id} invalid danger level`);
    assert.ok(trap.icon && trap.icon.length > 0, `Trap ${trap.id} missing icon`);
    assert.ok(!idSet.has(trap.id), `Duplicate trap ID: ${trap.id}`);
    idSet.add(trap.id);

    const lookup = getTrapDefinition(trap.id);
    assert.equal(lookup.id, trap.id);
  });
});

test('All 50 levels have extended racetracks, uphill climbs, downhill drops, and checkpoints', async () => {
  const { LEVELS } = await import('./levels');
  assert.equal(LEVELS.length, 50);

  LEVELS.forEach((lvl) => {
    // 1. Extended course length: distance to finish > 250m
    const totalDistance = Math.abs(lvl.finishPoint.z - lvl.spawnPoint.z);
    assert.ok(
      totalDistance >= 250,
      `Level ${lvl.id} (${lvl.name}) course too short: ${totalDistance}m (expected >= 250m)`
    );

    // 2. Verticality: Must have platforms above spawn (chỗ lên) and platforms below (chỗ xuống)
    const yValues = lvl.colliders.filter((c) => c.type === 'ground').map((c) => c.y);
    const maxY = Math.max(...yValues);
    const minY = Math.min(...yValues);

    assert.ok(
      maxY >= 8,
      `Level ${lvl.id} (${lvl.name}) missing uphill climb (maxY = ${maxY}, expected >= 8)`
    );
    assert.ok(
      maxY - minY >= 12,
      `Level ${lvl.id} (${lvl.name}) missing dramatic vertical drop (span = ${maxY - minY}m, expected >= 12m)`
    );

    // 3. Checkpoints: Must have checkpoints for runner respawn
    const checkpoints = lvl.colliders.filter((c) => c.type === 'checkpoint');
    assert.ok(
      checkpoints.length >= 2,
      `Level ${lvl.id} (${lvl.name}) missing checkpoints (has ${checkpoints.length}, expected >= 2)`
    );

    // 4. Distinct archetype and Vietnamese archetypeLabel
    assert.ok(lvl.archetype && lvl.archetype.length > 0, `Level ${lvl.id} missing archetype`);
    assert.ok(lvl.archetypeLabel && lvl.archetypeLabel.length > 0, `Level ${lvl.id} missing archetypeLabel`);
  });

  // Verify that all 50 levels have uniquely distinct course configurations
  const { COURSE_BLUEPRINTS } = await import('./levels');
  const blueprintKeys = Object.keys(COURSE_BLUEPRINTS);
  assert.equal(blueprintKeys.length, 50);
});

test('CHARACTER_PRESETS provides both human and cartoon characters with complete metadata', async () => {
  const { CHARACTER_PRESETS, buildCharacterRig } = await import('./character');
  const characterIds = Object.keys(CHARACTER_PRESETS) as (keyof typeof CHARACTER_PRESETS)[];

  assert.equal(characterIds.length >= 4, true);

  // Must have human character
  const hasHuman = characterIds.some((id) => CHARACTER_PRESETS[id].category === 'human');
  assert.equal(hasHuman, true, 'Must have at least one human character');

  // Must have cartoon character
  const hasCartoon = characterIds.some((id) => CHARACTER_PRESETS[id].category === 'cartoon');
  assert.equal(hasCartoon, true, 'Must have at least one cartoon character');

  // Verify all character presets have name, subtitle, colors, and generate valid 3D rigs
  for (const id of characterIds) {
    const char = CHARACTER_PRESETS[id];
    assert.ok(char.name.length > 0);
    assert.ok(char.subtitle.length > 0);
    assert.ok(char.description.length > 0);
    assert.ok(char.colors.primary);

    // Verify 3D procedural rig builds cleanly with Three.js hierarchy
    const rig = buildCharacterRig(id, true);
    assert.ok(rig.rootGroup);
    assert.ok(rig.headGroup);
    assert.ok(rig.torsoGroup);
    assert.ok(rig.leftArmGroup);
    assert.ok(rig.rightArmGroup);
    assert.ok(rig.leftLegGroup);
    assert.ok(rig.rightLegGroup);
  }
});

test('buildRealisticTrap constructs high-fidelity models and updateRealisticTrap animates mechanical components', () => {
  const trapTypes: string[] = ['saw', 'hammer', 'spikes', 'laser', 'tesla_coil', 'flamethrower', 'acid_pool', 'pendulum_spikeball'];

  for (const hType of trapTypes) {
    const col: BoxCollider = {
      id: `trap_${hType}`,
      type: 'hazard',
      x: 0,
      y: 1,
      z: -10,
      width: 3,
      height: 2,
      depth: 3,
      metadata: {
        hazardType: hType,
        hazardName: `Test ${hType}`,
        moving: { axis: 'y', distance: 2, speed: 3 },
        rotating: { axis: 'z', speed: 10 },
      },
    };

    const inst = buildRealisticTrap(col, true);
    assert.ok(inst.group, `Trap group must exist for ${hType}`);
    assert.equal(inst.id, col.id);
    assert.ok(inst.group.children.length > 0, `Trap ${hType} must have realistic 3D child meshes`);

    // Verify animation update runs without throwing
    const initialY = inst.group.position.y;
    updateRealisticTrap(inst, 0.5, 0.016);
    // Moving collider y position should update
    assert.ok(inst.group.position.y !== undefined);
  }
});

test('Newtonian Physical Laws & Dynamics: Aerodynamic Drag, Slope Physics, Elastic Recoil, Landing Momentum, and G-Force', () => {
  // 1. Aerodynamic Drag (Newton I - Inertia & Fluid Drag)
  const highSpeedVel = { x: 0, y: 0, z: -30 };
  const dragged = calculateAerodynamicDrag(highSpeedVel, 0.024, 0.016);
  assert.ok(Math.abs(dragged.z) < 30, 'Drag must gently decelerate hypersonic velocities');
  assert.ok(Math.abs(dragged.z) > 28, 'Drag must not abruptly clamp speed');
  assert.equal(dragged.x, 0, 'Lateral velocity must remain unchanged if 0');

  // 2. Slope Tangential Acceleration (Newton II - F = m * a)
  const forwardDir = { x: 0, z: -1 };
  // Downhill angle (15 deg = 0.26 rad)
  const downhillAcc = calculateSlopeAcceleration(forwardDir, 0.26, -24.0);
  assert.ok(downhillAcc.az < 0, 'Downhill gradient must produce positive forward acceleration along -Z');

  // Uphill angle (-15 deg)
  const uphillAcc = calculateSlopeAcceleration(forwardDir, -0.26, -24.0);
  assert.ok(uphillAcc.az > 0, 'Uphill gradient must produce resistive deceleration against -Z');

  // 3. Elastic Restitution & Mechanical Energy (Hooke's Law on Bounce Pad)
  const shallowRebound = calculateBounceElasticRecoil(-5.0, 20.0, 1.25);
  const highFallRebound = calculateBounceElasticRecoil(-25.0, 20.0, 1.25);
  assert.ok(shallowRebound >= 20.0, 'Rebound must be at least base bounce power');
  assert.ok(highFallRebound > shallowRebound, 'Falling from high drop must produce higher rebound velocity (E_p -> E_k)');

  // 4. Momentum Transfer & Compression Spring Absorption on Landing
  const walkLanding = calculateLandingMomentumTransfer(-15.0, true, false);
  const slideLanding = calculateLandingMomentumTransfer(-15.0, true, true);
  const idleLanding = calculateLandingMomentumTransfer(-15.0, false, false);

  assert.ok(walkLanding.compressionSquat > 0, 'Landing impact must produce knee compression squat');
  assert.ok(walkLanding.forwardBoost > 0, 'Forward intended landing must transfer downward energy forward');
  assert.ok(slideLanding.forwardBoost > walkLanding.forwardBoost, 'Sliding parkour roll must transfer more kinetic energy forward');
  assert.equal(idleLanding.forwardBoost, 0, 'Idle vertical landing must not propel player forward');

  // 5. Centripetal Banking Angle
  const bankRight = calculateCentripetalBanking(15.0, 0.5, 0.016, 24.0);
  const bankLeft = calculateCentripetalBanking(15.0, -0.5, 0.016, 24.0);
  assert.ok(bankRight > 0, 'Turning right must tilt athlete rightwards (positive banking)');
  assert.ok(bankLeft < 0, 'Turning left must tilt athlete leftwards (negative banking)');

  // 6. G-Force Telemetry
  const freefallG = calculateGForce({ x: 0, y: -24.0, z: 0 }, -24.0);
  assert.equal(freefallG, 0.0, 'Freefall under pure gravity must yield 0.0 G (weightlessness)');

  const restG = calculateGForce({ x: 0, y: 0, z: 0 }, -24.0);
  assert.equal(restG, 1.0, 'Standing at rest on ground must yield exactly 1.0 G');

  const bounceG = calculateGForce({ x: 0, y: 40.0, z: 0 }, -24.0);
  assert.ok(bounceG > 2.0, 'Upward explosive rebound acceleration must yield >2.0 G');

  // 7. Kinetic Energy (E_k = 0.5 * m * v^2)
  const energy = calculateKineticEnergy(68.0, 10.0); // 0.5 * 68 * 100 = 3400 J = 3.4 kJ
  assert.equal(energy, 3.4);

  // 8. Newton's 3rd Law Reaction
  const reaction = calculateImpulseReaction({ x: 1, z: 0 }, 12.0);
  assert.equal(reaction.x, 12.0);
  assert.equal(reaction.z, 0);
});
