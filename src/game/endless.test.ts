/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert';
import {
  calculateEndlessScore,
  calculateSpeedMultiplier,
  ENDLESS_BIOMES,
  EndlessTrackGenerator,
  getEndlessBiome,
} from './endless';

test('getEndlessBiome shifts theme smoothly based on distance thresholds', () => {
  const b0 = getEndlessBiome(0);
  assert.strictEqual(b0.theme, ENDLESS_BIOMES[0].theme);

  const b350 = getEndlessBiome(350);
  assert.strictEqual(b350.theme, ENDLESS_BIOMES[1].theme);

  const b700 = getEndlessBiome(700);
  assert.strictEqual(b700.theme, ENDLESS_BIOMES[2].theme);

  const b1050 = getEndlessBiome(1050);
  assert.strictEqual(b1050.theme, ENDLESS_BIOMES[3].theme);

  const b1400 = getEndlessBiome(1400);
  assert.strictEqual(b1400.theme, ENDLESS_BIOMES[4].theme);

  const b1750 = getEndlessBiome(1750);
  assert.strictEqual(b1750.theme, ENDLESS_BIOMES[5].theme);

  const b2100 = getEndlessBiome(2100);
  assert.strictEqual(b2100.theme, ENDLESS_BIOMES[6].theme);

  // Cycles back cleanly after full rotation
  const b2450 = getEndlessBiome(2450);
  assert.strictEqual(b2450.theme, ENDLESS_BIOMES[0].theme);
});

test('calculateSpeedMultiplier provides correct combo scaling', () => {
  assert.strictEqual(calculateSpeedMultiplier(5, false), 1.0);
  assert.strictEqual(calculateSpeedMultiplier(12, false), 1.5);
  assert.strictEqual(calculateSpeedMultiplier(18, false), 2.0);
  assert.strictEqual(calculateSpeedMultiplier(24, false), 2.5);
  // Dash overrides with top 3.0x combo multiplier
  assert.strictEqual(calculateSpeedMultiplier(8, true), 3.0);
});

test('calculateEndlessScore accurately combines distance, multiplier, and stunt bonuses', () => {
  const score1 = calculateEndlessScore(100, 1.0, 0);
  assert.strictEqual(score1, 120);

  const scoreWithCombo = calculateEndlessScore(200, 2.0, 150);
  // 200 * 1.2 * 2.0 + 150 = 480 + 150 = 630
  assert.strictEqual(scoreWithCombo, 630);
});

test('EndlessTrackGenerator builds seamless continuous chunks with valid colliders', () => {
  const generator = new EndlessTrackGenerator();
  const initialChunks = generator.generateInitialTrack();

  assert.ok(initialChunks.length >= 4, 'Should generate at least 4 chunks initially');
  assert.strictEqual(initialChunks[0].startZ, 10);
  assert.ok(initialChunks[0].endZ < 0, 'First chunk must head into negative Z');

  // Verify continuity: chunk N startZ should match chunk N-1 endZ (or start directly from it)
  for (let i = 1; i < initialChunks.length; i++) {
    const prev = initialChunks[i - 1];
    const curr = initialChunks[i];
    assert.strictEqual(curr.startZ, prev.endZ, `Chunk ${i} must seamlessly connect to chunk ${i - 1}`);
    assert.ok(curr.endZ < curr.startZ, `Chunk ${i} endZ must be further along the negative Z track`);
    assert.ok(curr.colliders.length > 0, `Chunk ${i} must contain at least one collider`);
  }

  // Generate 10 more procedural chunks and verify no NaN or inverted coordinates
  for (let j = 0; j < 10; j++) {
    const nextChunk = generator.generateNextChunk();
    assert.ok(!Number.isNaN(nextChunk.startZ));
    assert.ok(!Number.isNaN(nextChunk.endZ));
    assert.ok(nextChunk.colliders.length > 0);
    for (const c of nextChunk.colliders) {
      assert.ok(!Number.isNaN(c.x), `Collider ${c.id} x is NaN`);
      assert.ok(!Number.isNaN(c.y), `Collider ${c.id} y is NaN`);
      assert.ok(!Number.isNaN(c.z), `Collider ${c.id} z is NaN`);
      assert.ok(c.width > 0, `Collider ${c.id} width must be positive`);
      assert.ok(c.height > 0, `Collider ${c.id} height must be positive`);
      assert.ok(c.depth > 0, `Collider ${c.id} depth must be positive`);
    }
  }
});
