/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

/**
 * Procedural texture generator for high-fidelity 3D surfaces with zero external assets
 */
export class ProceduralTextureEngine {
  private static deckTexture: THREE.CanvasTexture | null = null;
  private static deckBumpMap: THREE.CanvasTexture | null = null;
  private static speedChevronTexture: THREE.CanvasTexture | null = null;
  private static wallHexTexture: THREE.CanvasTexture | null = null;
  private static wallBumpMap: THREE.CanvasTexture | null = null;

  /**
   * Generates a high-tech sci-fi modular deck texture with micro-carbon fiber weave and beveled tile borders
   */
  public static getDeckTexture(maxAnisotropy: number = 8): THREE.CanvasTexture {
    if (this.deckTexture) return this.deckTexture;

    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // 1. Dark graphite composite base
      ctx.fillStyle = '#232634';
      ctx.fillRect(0, 0, size, size);

      // 2. Micro carbon-fiber diagonal weave
      ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
      for (let y = 0; y < size; y += 4) {
        for (let x = 0; x < size; x += 4) {
          if ((x + y) % 8 === 0) {
            ctx.fillRect(x, y, 3, 3);
          }
        }
      }

      // 3. Grid panel seam lines
      ctx.strokeStyle = '#141724';
      ctx.lineWidth = 6;
      ctx.strokeRect(4, 4, size - 8, size - 8);

      // Sub-quadrant panels (4 modular floor tiles)
      const half = size / 2;
      ctx.strokeRect(4, 4, half - 4, half - 4);
      ctx.strokeRect(half, 4, half - 4, half - 4);
      ctx.strokeRect(4, half, half - 4, half - 4);
      ctx.strokeRect(half, half, half - 4, half - 4);

      // 4. Subtle glowing metallic bevel edges
      ctx.strokeStyle = 'rgba(192, 38, 211, 0.35)'; // subtle violet edge tint
      ctx.lineWidth = 1.5;
      ctx.strokeRect(7, 7, half - 10, half - 10);
      ctx.strokeRect(half + 3, 7, half - 10, half - 10);
      ctx.strokeRect(7, half + 3, half - 10, half - 10);
      ctx.strokeRect(half + 3, half + 3, half - 10, half - 10);

      // 5. High-tech corner rivet bolt markers
      ctx.fillStyle = '#3f3f58';
      const rivets = [
        [16, 16], [half - 16, 16], [16, half - 16], [half - 16, half - 16],
        [half + 16, 16], [size - 16, 16], [half + 16, half - 16], [size - 16, half - 16],
        [16, half + 16], [half - 16, half + 16], [16, size - 16], [half - 16, size - 16],
        [half + 16, half + 16], [size - 16, half + 16], [half + 16, size - 16], [size - 16, size - 16],
      ];
      rivets.forEach(([rx, ry]) => {
        ctx.beginPath();
        ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 6. Central crosshair indicator
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(half - 24, half);
      ctx.lineTo(half + 24, half);
      ctx.moveTo(half, half - 24);
      ctx.lineTo(half, half + 24);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = maxAnisotropy;
    this.deckTexture = tex;
    return tex;
  }

  /**
   * Generates a high-precision bump / normal heightmap for tactile surface depth
   */
  public static getDeckBumpMap(maxAnisotropy: number = 8): THREE.CanvasTexture {
    if (this.deckBumpMap) return this.deckBumpMap;

    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Mid-gray neutral height base
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, size, size);

      // Recessed seams (black = deep groove)
      ctx.strokeStyle = '#050505';
      ctx.lineWidth = 6;
      ctx.strokeRect(4, 4, size - 8, size - 8);

      const half = size / 2;
      ctx.strokeRect(4, 4, half - 4, half - 4);
      ctx.strokeRect(half, 4, half - 4, half - 4);
      ctx.strokeRect(4, half, half - 4, half - 4);
      ctx.strokeRect(half, half, half - 4, half - 4);

      // Raised bevel borders (white = elevated ridge)
      ctx.strokeStyle = '#d4d4d4';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(8, 8, half - 12, half - 12);
      ctx.strokeRect(half + 4, 8, half - 12, half - 12);
      ctx.strokeRect(8, half + 4, half - 12, half - 12);
      ctx.strokeRect(half + 4, half + 4, half - 12, half - 12);

      // Elevated rivets
      ctx.fillStyle = '#f5f5f5';
      const rivets = [
        [16, 16], [half - 16, 16], [16, half - 16], [half - 16, half - 16],
        [half + 16, 16], [size - 16, 16], [half + 16, half - 16], [size - 16, half - 16],
        [16, half + 16], [half - 16, half + 16], [16, size - 16], [half - 16, size - 16],
        [half + 16, half + 16], [size - 16, half + 16], [half + 16, size - 16], [size - 16, size - 16],
      ];
      rivets.forEach(([rx, ry]) => {
        ctx.beginPath();
        ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.NoColorSpace; // Data texture in linear space
    tex.anisotropy = maxAnisotropy;
    this.deckBumpMap = tex;
    return tex;
  }

  /**
   * Generates high-speed directional chevrons for speed strips
   */
  public static getSpeedChevronTexture(): THREE.CanvasTexture {
    if (this.speedChevronTexture) return this.speedChevronTexture;

    const w = 256;
    const h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#081726';
      ctx.fillRect(0, 0, w, h);

      // Glowing Cyan Arrow Chevrons pointing forward (-Z)
      const count = 4;
      const step = h / count;
      for (let i = 0; i < count; i++) {
        const y = i * step + step * 0.5;
        ctx.beginPath();
        ctx.moveTo(w * 0.5, y - 36);
        ctx.lineTo(w * 0.88, y + 24);
        ctx.lineTo(w * 0.72, y + 36);
        ctx.lineTo(w * 0.5, y - 10);
        ctx.lineTo(w * 0.28, y + 36);
        ctx.lineTo(w * 0.12, y + 24);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, y - 36, 0, y + 36);
        grad.addColorStop(0, '#00f0ff');
        grad.addColorStop(1, '#0284c7');
        ctx.fillStyle = grad;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 12;
        ctx.fill();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    this.speedChevronTexture = tex;
    return tex;
  }

  /**
   * Generates vertical hexagonal grip texture for Wall-Run surfaces
   */
  public static getWallHexTexture(): THREE.CanvasTexture {
    if (this.wallHexTexture) return this.wallHexTexture;

    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#1e1136';
      ctx.fillRect(0, 0, size, size);

      ctx.strokeStyle = 'rgba(192, 38, 211, 0.45)';
      ctx.lineWidth = 1.5;

      // Hexagonal honeycomb grid
      const hexR = 24;
      const hDist = Math.sqrt(3) * hexR;
      const vDist = hexR * 1.5;

      for (let row = -1; row < size / vDist + 2; row++) {
        for (let col = -1; col < size / hDist + 2; col++) {
          const x = col * hDist + ((row % 2) * hDist * 0.5);
          const y = row * vDist;

          ctx.beginPath();
          for (let a = 0; a < 6; a++) {
            const angle = (a * Math.PI) / 3 - Math.PI / 6;
            const px = x + hexR * Math.cos(angle);
            const py = y + hexR * Math.sin(angle);
            if (a === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }

      // Vertical energy flow lines
      ctx.strokeStyle = 'rgba(232, 121, 249, 0.7)';
      ctx.lineWidth = 2;
      for (let x = 32; x < size; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, size);
        ctx.stroke();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    this.wallHexTexture = tex;
    return tex;
  }
}
