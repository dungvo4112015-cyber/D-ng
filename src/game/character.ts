/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { CharacterDefinition, CharacterId, PlayerPhysicsState } from './types';

export const CHARACTER_PRESETS: Record<CharacterId, CharacterDefinition> = {
  kaito: {
    id: 'kaito',
    name: 'Kaito',
    subtitle: 'Vận Động Viên Parkour Chân Thực',
    category: 'human',
    badge: 'CON NGƯỜI / ATHLETIC HUMAN',
    description: 'Mô hình 3D người thật chân thực: giải phẫu cơ thể học chuẩn xác (vai cơ, ngực, bắp tay, đùi, bắp chân), khuôn mặt sống động, trang phục hoodie kỹ thuật cao và giày AcroKicks đệm khí.',
    colors: {
      primary: '#ef4444',
      secondary: '#ffffff',
      accent: '#0284c7',
      skin: '#f5c6a5',
      hair: '#251610',
      eyes: '#1e40af',
    },
  },
  kibo: {
    id: 'kibo',
    name: 'Kibo',
    subtitle: 'Ninja Cáo Hoạt Hình',
    category: 'cartoon',
    badge: 'HOẠT HÌNH / TOON FOX',
    description: 'Nhân vật hoạt hình phong cách chibi đáng yêu: đôi tai cáo ngộ nghĩnh, khăn choàng đỏ tung bay trong gió, dải băng đeo trán và bước chạy thoăn thoắt.',
    colors: {
      primary: '#f97316',
      secondary: '#fef08a',
      accent: '#dc2626',
      skin: '#fb923c',
      hair: '#ea580c',
      eyes: '#0d9488',
    },
  },
  aoi: {
    id: 'aoi',
    name: 'Aoi',
    subtitle: 'Nữ Thần Tốc Độ Anime',
    category: 'cartoon',
    badge: 'ANIME / HEROINE',
    description: 'Thiếu nữ anime tương lai với mái tóc twintail bồng bềnh chuyển động theo từng bước nhảy, tai nghe mèo phát sáng và trang phục parkour công nghệ cao.',
    colors: {
      primary: '#06b6d4',
      secondary: '#f43f5e',
      accent: '#a855f7',
      skin: '#ffe4c9',
      hair: '#06b6d4',
      eyes: '#0891b2',
    },
  },
  sparky: {
    id: 'sparky',
    name: 'Sparky',
    subtitle: 'Phi Hành Gia Cyber 3D',
    category: 'cartoon',
    badge: 'CYBER BOT / PHI HÀNH GIA',
    description: 'Chiến binh robot phi hành gia không gian tương lai: mũ bảo hiểm công nghệ cao với kính màn hình LED xanh cyan phát sáng, bộ giáp phản lực và giày sneakers trắng năng động.',
    colors: {
      primary: '#1e2433',
      secondary: '#ffffff',
      accent: '#00f0ff',
      skin: '#111827',
      hair: '#1e2433',
      eyes: '#00f0ff',
    },
  },
};

export interface CharacterRig {
  characterId: CharacterId;
  rootGroup: THREE.Group;
  innerBodyGroup: THREE.Group;
  headGroup: THREE.Group;
  torsoGroup: THREE.Group;
  leftArmGroup: THREE.Group;
  rightArmGroup: THREE.Group;
  leftLegGroup: THREE.Group;
  rightLegGroup: THREE.Group;
  leftFootGroup: THREE.Group;
  rightFootGroup: THREE.Group;
  // Sub-articulated limb nodes for realistic human kinematics
  leftForearmGroup?: THREE.Group;
  rightForearmGroup?: THREE.Group;
  leftCalfGroup?: THREE.Group;
  rightCalfGroup?: THREE.Group;
  // Dynamic secondary motion nodes
  secondaryNodes: {
    scarfBones?: THREE.Mesh[];
    hairLeft?: THREE.Group;
    hairRight?: THREE.Group;
    antennaGroup?: THREE.Group;
    tailGroup?: THREE.Group;
    hoodieCords?: THREE.Mesh[];
    eyeL?: THREE.Mesh;
    eyeR?: THREE.Mesh;
    pupilL?: THREE.Mesh;
    pupilR?: THREE.Mesh;
    mouth?: THREE.Mesh;
    earL?: THREE.Group;
    earR?: THREE.Group;
    jetFlames?: THREE.Mesh[];
  };
  contactShadow: THREE.Mesh;
  arrowMesh: THREE.Mesh;
  doubleJumpFlipProgress: number;
  landingSquash: number;
  blinkTimer: number;
  isBlinking: boolean;
}

/**
 * Procedural character mesh generator with rich human & cartoon details
 */
export function buildCharacterRig(characterId: CharacterId, isSoftwareGl: boolean): CharacterRig {
  const rootGroup = new THREE.Group();
  const innerBodyGroup = new THREE.Group();
  rootGroup.add(innerBodyGroup);

  const headGroup = new THREE.Group();
  const torsoGroup = new THREE.Group();
  const leftArmGroup = new THREE.Group();
  const rightArmGroup = new THREE.Group();
  const leftLegGroup = new THREE.Group();
  const rightLegGroup = new THREE.Group();
  const leftFootGroup = new THREE.Group();
  const rightFootGroup = new THREE.Group();
  const leftForearmGroup = new THREE.Group();
  const rightForearmGroup = new THREE.Group();
  const leftCalfGroup = new THREE.Group();
  const rightCalfGroup = new THREE.Group();

  innerBodyGroup.add(torsoGroup);
  innerBodyGroup.add(headGroup);
  innerBodyGroup.add(leftArmGroup);
  innerBodyGroup.add(rightArmGroup);
  innerBodyGroup.add(leftLegGroup);
  innerBodyGroup.add(rightLegGroup);

  const secondaryNodes: CharacterRig['secondaryNodes'] = {};

  // Standard shared PBR materials builder
  const pbrMat = (color: string, roughness = 0.45, metalness = 0.1) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
    });

  const basicMat = (color: string) => new THREE.MeshBasicMaterial({ color });

  if (characterId !== 'kaito') {
    leftLegGroup.add(leftFootGroup);
    rightLegGroup.add(rightFootGroup);
  }

  // 1. Build character specifics based on CharacterId
  if (characterId === 'kaito') {
    // ------------------------------------------------------------------------
    // KAITO: High-Fidelity Realistic Athletic Human Parkour Athlete
    // ------------------------------------------------------------------------
    // Realistic PBR Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: '#f5c6a5',
      roughness: 0.62,
      metalness: 0.0,
    });
    const lipsMat = new THREE.MeshStandardMaterial({
      color: '#c96a60',
      roughness: 0.55,
      metalness: 0.0,
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: '#251610',
      roughness: 0.38,
      metalness: 0.12,
    });
    const hoodieRedMat = new THREE.MeshStandardMaterial({
      color: '#dc2626',
      roughness: 0.72,
      metalness: 0.05,
    });
    const hoodieDarkMat = new THREE.MeshStandardMaterial({
      color: '#18181b',
      roughness: 0.75,
      metalness: 0.05,
    });
    const hoodieWhiteMat = new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.65,
      metalness: 0.05,
    });
    const metalChromeMat = new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      roughness: 0.2,
      metalness: 0.9,
    });
    const joggersMat = new THREE.MeshStandardMaterial({
      color: '#1e293b',
      roughness: 0.78,
      metalness: 0.08,
    });
    const reflective3MMat = new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      roughness: 0.15,
      metalness: 0.85,
    });
    const gloveLeatherMat = new THREE.MeshStandardMaterial({
      color: '#09090b',
      roughness: 0.38,
      metalness: 0.2,
    });
    const smartWatchMat = new THREE.MeshBasicMaterial({ color: '#00e5ff' });
    const sneakerRedMat = new THREE.MeshStandardMaterial({
      color: '#ef4444',
      roughness: 0.45,
      metalness: 0.08,
    });
    const sneakerWhiteMat = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.35,
      metalness: 0.05,
    });
    const sneakerRubberMat = new THREE.MeshStandardMaterial({
      color: '#09090b',
      roughness: 0.65,
      metalness: 0.05,
    });
    const airCushionMat = new THREE.MeshStandardMaterial({
      color: '#0284c7',
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    const eyeScleraMat = new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.2,
      metalness: 0.0,
    });
    const eyeIrisMat = new THREE.MeshStandardMaterial({
      color: '#1e40af',
      roughness: 0.25,
      metalness: 0.15,
    });
    const eyePupilMat = new THREE.MeshBasicMaterial({ color: '#020617' });
    const eyeGlintMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const headbandMat = new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.6,
      metalness: 0.1,
    });

    // ------------------------------------------------------------------------
    // Anatomical Torso & Technical Parkour Hoodie
    // ------------------------------------------------------------------------
    torsoGroup.position.set(0, 0, 0);

    // Upper chest / pectorals: V-tapered athletic human contour
    const upperChestGeo = new THREE.CylinderGeometry(0.24, 0.20, 0.34, 16);
    const upperChestMesh = new THREE.Mesh(upperChestGeo, hoodieRedMat);
    upperChestMesh.position.set(0, 1.18, 0);
    upperChestMesh.scale.set(1.0, 1.0, 0.72);
    upperChestMesh.castShadow = !isSoftwareGl;
    torsoGroup.add(upperChestMesh);

    // Sculpted athletic pectoral muscle plates (left & right)
    const pecGeo = new THREE.BoxGeometry(0.17, 0.14, 0.05);
    const lPec = new THREE.Mesh(pecGeo, hoodieRedMat);
    lPec.position.set(-0.09, 1.22, -0.13);
    lPec.rotation.set(-0.05, 0.08, 0.06);
    const rPec = new THREE.Mesh(pecGeo, hoodieRedMat);
    rPec.position.set(0.09, 1.22, -0.13);
    rPec.rotation.set(-0.05, -0.08, -0.06);
    torsoGroup.add(lPec, rPec);

    // Ribcage & tapered athletic waist
    const ribcageGeo = new THREE.CylinderGeometry(0.20, 0.165, 0.28, 16);
    const ribcageMesh = new THREE.Mesh(ribcageGeo, hoodieDarkMat);
    ribcageMesh.position.set(0, 0.94, 0);
    ribcageMesh.scale.set(1.0, 1.0, 0.72);
    ribcageMesh.castShadow = !isSoftwareGl;
    torsoGroup.add(ribcageMesh);

    // High ergonomic collar wrapping the neck
    const collarGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.12, 16);
    const collarMesh = new THREE.Mesh(collarGeo, hoodieDarkMat);
    collarMesh.position.set(0, 1.37, 0);
    collarMesh.scale.set(1.0, 1.0, 0.78);
    torsoGroup.add(collarMesh);

    // Metallic front zipper track with 3D slider and dangling pull tab
    const zipTrackGeo = new THREE.BoxGeometry(0.016, 0.58, 0.02);
    const zipTrack = new THREE.Mesh(zipTrackGeo, hoodieWhiteMat);
    zipTrack.position.set(0, 1.13, -0.142);
    const zipSliderGeo = new THREE.BoxGeometry(0.032, 0.055, 0.025);
    const zipSlider = new THREE.Mesh(zipSliderGeo, metalChromeMat);
    zipSlider.position.set(0, 1.24, -0.146);
    const zipPullGeo = new THREE.BoxGeometry(0.018, 0.07, 0.015);
    const zipPull = new THREE.Mesh(zipPullGeo, metalChromeMat);
    zipPull.position.set(0, 1.19, -0.15);
    torsoGroup.add(zipTrack, zipSlider, zipPull);

    // Angled zippered chest pockets with reflective accents
    const pocketGeo = new THREE.BoxGeometry(0.08, 0.014, 0.02);
    const lPocket = new THREE.Mesh(pocketGeo, reflective3MMat);
    lPocket.position.set(-0.11, 1.14, -0.135);
    lPocket.rotation.z = 0.28;
    const rPocket = new THREE.Mesh(pocketGeo, reflective3MMat);
    rPocket.position.set(0.11, 1.14, -0.135);
    rPocket.rotation.z = -0.28;
    torsoGroup.add(lPocket, rPocket);

    // Draped hoodie hood on the upper back (realistic cloth volume)
    const hoodDomeGeo = new THREE.SphereGeometry(0.155, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.72);
    const hoodDome = new THREE.Mesh(hoodDomeGeo, hoodieRedMat);
    hoodDome.position.set(0, 1.26, 0.12);
    hoodDome.scale.set(1.0, 0.8, 0.65);
    hoodDome.rotation.x = -0.45;
    const hoodRimGeo = new THREE.TorusGeometry(0.135, 0.024, 8, 16);
    const hoodRim = new THREE.Mesh(hoodRimGeo, hoodieDarkMat);
    hoodRim.position.set(0, 1.33, 0.09);
    hoodRim.rotation.x = Math.PI / 3;
    torsoGroup.add(hoodDome, hoodRim);

    // Dynamic hanging hoodie drawstrings with metallic silver aglets
    const cordGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.24, 6);
    const cordL = new THREE.Mesh(cordGeo, hoodieWhiteMat);
    cordL.position.set(-0.07, 1.22, -0.145);
    const agletL = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.035, 6), metalChromeMat);
    agletL.position.set(0, -0.11, 0);
    cordL.add(agletL);

    const cordR = new THREE.Mesh(cordGeo, hoodieWhiteMat);
    cordR.position.set(0.07, 1.22, -0.145);
    const agletR = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.035, 6), metalChromeMat);
    agletR.position.set(0, -0.11, 0);
    cordR.add(agletR);

    torsoGroup.add(cordL, cordR);
    secondaryNodes.hoodieCords = [cordL, cordR];

    // Elastic ribbed hem at waist
    const hemGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.06, 16);
    const hemMesh = new THREE.Mesh(hemGeo, hoodieDarkMat);
    hemMesh.position.set(0, 0.78, 0);
    hemMesh.scale.set(1.0, 1.0, 0.72);
    torsoGroup.add(hemMesh);

    // ------------------------------------------------------------------------
    // Anatomical Head & Realistic Face
    // ------------------------------------------------------------------------
    headGroup.position.set(0, 1.54, 0);

    // Anatomical neck with natural forward posture
    const neckGeo = new THREE.CylinderGeometry(0.068, 0.082, 0.16, 16);
    const neckMesh = new THREE.Mesh(neckGeo, skinMat);
    neckMesh.position.set(0, -0.10, -0.01);
    neckMesh.rotation.x = 0.08;
    headGroup.add(neckMesh);

    // Smooth cranium dome
    const craniumGeo = new THREE.SphereGeometry(0.145, 18, 16);
    const craniumMesh = new THREE.Mesh(craniumGeo, skinMat);
    craniumMesh.position.set(0, 0.08, 0.01);
    craniumMesh.scale.set(0.96, 1.05, 1.02);
    craniumMesh.castShadow = !isSoftwareGl;
    headGroup.add(craniumMesh);

    // Contoured mandible / jawline tapering down to chin
    const jawGeo = new THREE.CylinderGeometry(0.125, 0.082, 0.14, 16);
    const jawMesh = new THREE.Mesh(jawGeo, skinMat);
    jawMesh.position.set(0, -0.01, -0.02);
    jawMesh.scale.set(0.95, 1.0, 0.88);
    headGroup.add(jawMesh);

    // Sculpted athletic chin
    const chinGeo = new THREE.SphereGeometry(0.042, 12, 10);
    const chinMesh = new THREE.Mesh(chinGeo, skinMat);
    chinMesh.position.set(0, -0.075, -0.085);
    headGroup.add(chinMesh);

    // Sculpted cheekbone arches (left & right)
    const cheekGeo = new THREE.SphereGeometry(0.038, 10, 8);
    const lCheek = new THREE.Mesh(cheekGeo, skinMat);
    lCheek.position.set(-0.105, 0.015, -0.05);
    const rCheek = new THREE.Mesh(cheekGeo, skinMat);
    rCheek.position.set(0.105, 0.015, -0.05);
    headGroup.add(lCheek, rCheek);

    // Contoured 3D Nose (nasal bridge + tip + nostrils)
    const nasalBridgeGeo = new THREE.CylinderGeometry(0.012, 0.022, 0.072, 8);
    const nasalBridge = new THREE.Mesh(nasalBridgeGeo, skinMat);
    nasalBridge.position.set(0, 0.025, -0.142);
    nasalBridge.rotation.x = 0.28;
    const noseTipGeo = new THREE.SphereGeometry(0.022, 10, 8);
    const noseTip = new THREE.Mesh(noseTipGeo, skinMat);
    noseTip.position.set(0, -0.014, -0.158);
    const nostrilGeo = new THREE.SphereGeometry(0.013, 8, 6);
    const lNostril = new THREE.Mesh(nostrilGeo, skinMat);
    lNostril.position.set(-0.022, -0.020, -0.148);
    const rNostril = new THREE.Mesh(nostrilGeo, skinMat);
    rNostril.position.set(0.022, -0.020, -0.148);
    headGroup.add(nasalBridge, noseTip, lNostril, rNostril);

    // Realistic Mouth with Philtrum & Contoured Lips
    const philtrumGeo = new THREE.BoxGeometry(0.015, 0.025, 0.01);
    const philtrum = new THREE.Mesh(philtrumGeo, skinMat);
    philtrum.position.set(0, -0.042, -0.146);

    const upperLipGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.045, 8);
    const upperLip = new THREE.Mesh(upperLipGeo, lipsMat);
    upperLip.position.set(0, -0.054, -0.144);
    upperLip.rotation.z = Math.PI / 2;

    const lowerLipGeo = new THREE.SphereGeometry(0.022, 10, 8);
    const lowerLip = new THREE.Mesh(lowerLipGeo, lipsMat);
    lowerLip.position.set(0, -0.070, -0.140);
    lowerLip.scale.set(1.4, 0.6, 0.8);
    headGroup.add(philtrum, upperLip, lowerLip);

    // Realistic Eyes (Curved Sclera, Deep Blue Iris, Pupil & Corneal Glint)
    const eyeScleraGeo = new THREE.SphereGeometry(0.038, 14, 12);
    const eyeIrisGeo = new THREE.CircleGeometry(0.022, 16);
    const eyePupilGeo = new THREE.CircleGeometry(0.011, 16);
    const eyeGlintGeo = new THREE.CircleGeometry(0.006, 8);

    // Left Eye
    const lEyeSclera = new THREE.Mesh(eyeScleraGeo, eyeScleraMat);
    lEyeSclera.position.set(-0.068, 0.045, -0.128);
    const lEyeIris = new THREE.Mesh(eyeIrisGeo, eyeIrisMat);
    lEyeIris.position.set(-0.068, 0.045, -0.158);
    const lEyePupil = new THREE.Mesh(eyePupilGeo, eyePupilMat);
    lEyePupil.position.set(-0.068, 0.045, -0.159);
    const lEyeGlint = new THREE.Mesh(eyeGlintGeo, eyeGlintMat);
    lEyeGlint.position.set(-0.062, 0.052, -0.160);
    headGroup.add(lEyeSclera, lEyeIris, lEyePupil, lEyeGlint);

    // Right Eye
    const rEyeSclera = new THREE.Mesh(eyeScleraGeo, eyeScleraMat);
    rEyeSclera.position.set(0.068, 0.045, -0.128);
    const rEyeIris = new THREE.Mesh(eyeIrisGeo, eyeIrisMat);
    rEyeIris.position.set(0.068, 0.045, -0.158);
    const rEyePupil = new THREE.Mesh(eyePupilGeo, eyePupilMat);
    rEyePupil.position.set(0.068, 0.045, -0.159);
    const rEyeGlint = new THREE.Mesh(eyeGlintGeo, eyeGlintMat);
    rEyeGlint.position.set(0.074, 0.052, -0.160);
    headGroup.add(rEyeSclera, rEyeIris, rEyePupil, rEyeGlint);

    secondaryNodes.eyeL = lEyeSclera;
    secondaryNodes.eyeR = rEyeSclera;

    // Sculpted Eyelids & Eyebrows
    const eyelidGeo = new THREE.TorusGeometry(0.038, 0.009, 6, 12, Math.PI);
    const lEyelid = new THREE.Mesh(eyelidGeo, skinMat);
    lEyelid.position.set(-0.068, 0.056, -0.138);
    lEyelid.rotation.x = 0.35;
    const rEyelid = new THREE.Mesh(eyelidGeo, skinMat);
    rEyelid.position.set(0.068, 0.056, -0.138);
    rEyelid.rotation.x = 0.35;

    const browGeo = new THREE.BoxGeometry(0.082, 0.016, 0.02);
    const lBrow = new THREE.Mesh(browGeo, hairMat);
    lBrow.position.set(-0.07, 0.096, -0.142);
    lBrow.rotation.z = 0.1;
    const rBrow = new THREE.Mesh(browGeo, hairMat);
    rBrow.position.set(0.07, 0.096, -0.142);
    rBrow.rotation.z = -0.1;
    headGroup.add(lEyelid, rEyelid, lBrow, rBrow);

    // Sculpted Anatomical Ears
    const earHelixGeo = new THREE.TorusGeometry(0.034, 0.011, 8, 14, Math.PI * 1.3);
    const lEar = new THREE.Mesh(earHelixGeo, skinMat);
    lEar.position.set(-0.146, 0.03, 0.01);
    lEar.rotation.set(0, -0.2, 0.15);
    const rEar = new THREE.Mesh(earHelixGeo, skinMat);
    rEar.position.set(0.146, 0.03, 0.01);
    rEar.rotation.set(0, 0.2, -0.15);
    const earLobeGeo = new THREE.SphereGeometry(0.016, 8, 8);
    const lLobe = new THREE.Mesh(earLobeGeo, skinMat);
    lLobe.position.set(-0.146, -0.014, 0.01);
    const rLobe = new THREE.Mesh(earLobeGeo, skinMat);
    rLobe.position.set(0.146, -0.014, 0.01);
    headGroup.add(lEar, rEar, lLobe, rLobe);

    // Realistic Layered Swept Athletic Hair
    // Base hair volume
    const hairDomeGeo = new THREE.SphereGeometry(0.152, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const hairDome = new THREE.Mesh(hairDomeGeo, hairMat);
    hairDome.position.set(0, 0.10, 0.01);
    headGroup.add(hairDome);

    // Dynamic swept hair locks across top & front
    const hairLockGeo = new THREE.ConeGeometry(0.05, 0.16, 6);
    const lock1 = new THREE.Mesh(hairLockGeo, hairMat);
    lock1.position.set(-0.06, 0.18, -0.12);
    lock1.rotation.set(-0.55, 0.1, -0.25);

    const lock2 = new THREE.Mesh(hairLockGeo, hairMat);
    lock2.position.set(0.02, 0.20, -0.13);
    lock2.rotation.set(-0.45, -0.15, 0.18);

    const lock3 = new THREE.Mesh(hairLockGeo, hairMat);
    lock3.position.set(0.08, 0.17, -0.11);
    lock3.rotation.set(-0.50, -0.25, 0.35);

    const lockBack1 = new THREE.Mesh(hairLockGeo, hairMat);
    lockBack1.position.set(-0.05, 0.19, 0.08);
    lockBack1.rotation.set(0.6, 0.1, -0.15);

    const lockBack2 = new THREE.Mesh(hairLockGeo, hairMat);
    lockBack2.position.set(0.05, 0.19, 0.08);
    lockBack2.rotation.set(0.6, -0.1, 0.15);

    headGroup.add(lock1, lock2, lock3, lockBack1, lockBack2);

    // Sports Sweatband across forehead
    const bandGeo = new THREE.CylinderGeometry(0.148, 0.148, 0.034, 24, 1, true);
    const sweatBand = new THREE.Mesh(bandGeo, headbandMat);
    sweatBand.position.set(0, 0.10, 0.01);
    const logoMarkGeo = new THREE.BoxGeometry(0.035, 0.016, 0.01);
    const logoMark = new THREE.Mesh(logoMarkGeo, hoodieRedMat);
    logoMark.position.set(0, 0.10, -0.142);
    headGroup.add(sweatBand, logoMark);

    // ------------------------------------------------------------------------
    // Articulated Upper Limbs: Deltoids, Biceps, Forearms, Parkour Gloves
    // ------------------------------------------------------------------------
    leftArmGroup.position.set(-0.28, 1.32, 0);
    rightArmGroup.position.set(0.28, 1.32, 0);

    // Muscular Deltoid Shoulder Caps
    const deltoidGeo = new THREE.SphereGeometry(0.078, 14, 12);
    const lDeltoid = new THREE.Mesh(deltoidGeo, hoodieRedMat);
    lDeltoid.scale.set(1.1, 1.0, 0.9);
    const rDeltoid = new THREE.Mesh(deltoidGeo, hoodieRedMat);
    rDeltoid.scale.set(1.1, 1.0, 0.9);
    leftArmGroup.add(lDeltoid);
    rightArmGroup.add(rDeltoid);

    // Upper Arm (Biceps & Triceps)
    const upperArmGeo = new THREE.CylinderGeometry(0.062, 0.052, 0.22, 14);
    const lUpperArm = new THREE.Mesh(upperArmGeo, hoodieDarkMat);
    lUpperArm.position.y = -0.11;
    const rUpperArm = new THREE.Mesh(upperArmGeo, hoodieDarkMat);
    rUpperArm.position.y = -0.11;
    leftArmGroup.add(lUpperArm);
    rightArmGroup.add(rUpperArm);

    // Articulated Forearm Groups (attached at elbow for realistic flexion)
    leftForearmGroup.position.set(0, -0.22, 0);
    rightForearmGroup.position.set(0, -0.22, 0);
    leftArmGroup.add(leftForearmGroup);
    rightArmGroup.add(rightForearmGroup);

    // Elbow Condyles
    const elbowGeo = new THREE.SphereGeometry(0.052, 12, 10);
    const lElbow = new THREE.Mesh(elbowGeo, hoodieDarkMat);
    const rElbow = new THREE.Mesh(elbowGeo, hoodieDarkMat);
    leftForearmGroup.add(lElbow);
    rightForearmGroup.add(rElbow);

    // Muscular Forearms
    const forearmGeo = new THREE.CylinderGeometry(0.054, 0.042, 0.22, 14);
    const lForearm = new THREE.Mesh(forearmGeo, skinMat);
    lForearm.position.y = -0.11;
    const rForearm = new THREE.Mesh(forearmGeo, skinMat);
    rForearm.position.y = -0.11;
    leftForearmGroup.add(lForearm);
    rightForearmGroup.add(rForearm);

    // Left Wrist: Smart Sports Parkour Tracker Watch
    const watchBandGeo = new THREE.CylinderGeometry(0.046, 0.046, 0.038, 14);
    const watchBand = new THREE.Mesh(watchBandGeo, gloveLeatherMat);
    watchBand.position.y = -0.20;
    const watchScreenGeo = new THREE.BoxGeometry(0.038, 0.032, 0.015);
    const watchScreen = new THREE.Mesh(watchScreenGeo, smartWatchMat);
    watchScreen.position.set(0, -0.20, -0.046);
    leftForearmGroup.add(watchBand, watchScreen);

    // Right Wrist: Athletic Compression Support Strap
    const strapGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.04, 14);
    const strapMesh = new THREE.Mesh(strapGeo, hoodieRedMat);
    strapMesh.position.y = -0.20;
    rightForearmGroup.add(strapMesh);

    // Realistic Half-Finger Tactical Parkour Gloves & Articulated Hands
    const palmGeo = new THREE.BoxGeometry(0.088, 0.09, 0.044);
    const thumbGeo = new THREE.BoxGeometry(0.032, 0.065, 0.032);
    const fingerGeo = new THREE.BoxGeometry(0.024, 0.075, 0.026);
    const fingerTipGeo = new THREE.BoxGeometry(0.022, 0.03, 0.024);

    // Left Hand (Palm + Opposable Thumb + Articulated Fingers)
    const lPalm = new THREE.Mesh(palmGeo, gloveLeatherMat);
    lPalm.position.y = -0.27;

    const lThumb = new THREE.Mesh(thumbGeo, gloveLeatherMat);
    lThumb.position.set(0.045, -0.25, -0.025);
    lThumb.rotation.set(0.2, 0, -0.4);
    const lThumbTip = new THREE.Mesh(fingerTipGeo, skinMat);
    lThumbTip.position.set(0, -0.035, 0);
    lThumb.add(lThumbTip);

    // Index & Gripping fingers
    const lIndex = new THREE.Mesh(fingerGeo, gloveLeatherMat);
    lIndex.position.set(0.026, -0.32, -0.01);
    lIndex.rotation.x = 0.25;
    const lIndexTip = new THREE.Mesh(fingerTipGeo, skinMat);
    lIndexTip.position.set(0, -0.04, 0);
    lIndex.add(lIndexTip);

    const lMiddle = new THREE.Mesh(fingerGeo, gloveLeatherMat);
    lMiddle.position.set(0.0, -0.325, -0.01);
    lMiddle.rotation.x = 0.32;
    const lMiddleTip = new THREE.Mesh(fingerTipGeo, skinMat);
    lMiddleTip.position.set(0, -0.04, 0);
    lMiddle.add(lMiddleTip);

    const lRing = new THREE.Mesh(fingerGeo, gloveLeatherMat);
    lRing.position.set(-0.026, -0.315, -0.01);
    lRing.rotation.x = 0.35;
    const lRingTip = new THREE.Mesh(fingerTipGeo, skinMat);
    lRingTip.position.set(0, -0.04, 0);
    lRing.add(lRingTip);

    leftForearmGroup.add(lPalm, lThumb, lIndex, lMiddle, lRing);

    // Right Hand (Palm + Opposable Thumb + Articulated Fingers)
    const rPalm = new THREE.Mesh(palmGeo, gloveLeatherMat);
    rPalm.position.y = -0.27;

    const rThumb = new THREE.Mesh(thumbGeo, gloveLeatherMat);
    rThumb.position.set(-0.045, -0.25, -0.025);
    rThumb.rotation.set(0.2, 0, 0.4);
    const rThumbTip = new THREE.Mesh(fingerTipGeo, skinMat);
    rThumbTip.position.set(0, -0.035, 0);
    rThumb.add(rThumbTip);

    const rIndex = new THREE.Mesh(fingerGeo, gloveLeatherMat);
    rIndex.position.set(-0.026, -0.32, -0.01);
    rIndex.rotation.x = 0.25;
    const rIndexTip = new THREE.Mesh(fingerTipGeo, skinMat);
    rIndexTip.position.set(0, -0.04, 0);
    rIndex.add(rIndexTip);

    const rMiddle = new THREE.Mesh(fingerGeo, gloveLeatherMat);
    rMiddle.position.set(0.0, -0.325, -0.01);
    rMiddle.rotation.x = 0.32;
    const rMiddleTip = new THREE.Mesh(fingerTipGeo, skinMat);
    rMiddleTip.position.set(0, -0.04, 0);
    rMiddle.add(rMiddleTip);

    const rRing = new THREE.Mesh(fingerGeo, gloveLeatherMat);
    rRing.position.set(0.026, -0.315, -0.01);
    rRing.rotation.x = 0.35;
    const rRingTip = new THREE.Mesh(fingerTipGeo, skinMat);
    rRingTip.position.set(0, -0.04, 0);
    rRing.add(rRingTip);

    rightForearmGroup.add(rPalm, rThumb, rIndex, rMiddle, rRing);

    // ------------------------------------------------------------------------
    // Muscular Athletic Lower Limbs: Quadriceps, Calves & AcroKicks Sneakers
    // ------------------------------------------------------------------------
    leftLegGroup.position.set(-0.14, 0.76, 0);
    rightLegGroup.position.set(0.14, 0.76, 0);

    // Muscular Thighs (Quadriceps with athletic taper)
    const thighGeo = new THREE.CylinderGeometry(0.088, 0.070, 0.34, 14);
    const lThigh = new THREE.Mesh(thighGeo, joggersMat);
    lThigh.position.y = -0.17;
    lThigh.scale.set(1.0, 1.0, 1.05);
    const rThigh = new THREE.Mesh(thighGeo, joggersMat);
    rThigh.position.y = -0.17;
    rThigh.scale.set(1.0, 1.0, 1.05);
    leftLegGroup.add(lThigh);
    rightLegGroup.add(rThigh);

    // Articulated Calf Groups (positioned at knee for natural running flexion)
    leftCalfGroup.position.set(0, -0.34, 0);
    rightCalfGroup.position.set(0, -0.34, 0);
    leftLegGroup.add(leftCalfGroup);
    rightLegGroup.add(rightCalfGroup);

    // Patella Kneecaps with reinforced technical parkour panels
    const kneeGeo = new THREE.BoxGeometry(0.11, 0.10, 0.05);
    const lKnee = new THREE.Mesh(kneeGeo, hoodieDarkMat);
    lKnee.position.set(0, 0, -0.06);
    const rKnee = new THREE.Mesh(kneeGeo, hoodieDarkMat);
    rKnee.position.set(0, 0, -0.06);
    leftCalfGroup.add(lKnee);
    rightCalfGroup.add(rKnee);

    // Muscular Calves (Gastrocnemius contour tapering to Achilles)
    const calfGeo = new THREE.CylinderGeometry(0.076, 0.050, 0.32, 14);
    const lCalf = new THREE.Mesh(calfGeo, joggersMat);
    lCalf.position.y = -0.16;
    lCalf.scale.set(1.0, 1.0, 1.08);
    const rCalf = new THREE.Mesh(calfGeo, joggersMat);
    rCalf.position.y = -0.16;
    rCalf.scale.set(1.0, 1.0, 1.08);

    // Reflective 3M vertical side stripes along outer jogger seams
    const stripeGeo = new THREE.BoxGeometry(0.012, 0.30, 0.02);
    const lStripe = new THREE.Mesh(stripeGeo, reflective3MMat);
    lStripe.position.set(-0.076, -0.16, 0);
    const rStripe = new THREE.Mesh(stripeGeo, reflective3MMat);
    rStripe.position.set(0.076, -0.16, 0);

    // Ribbed ankle cuffs
    const cuffGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.05, 14);
    const lCuff = new THREE.Mesh(cuffGeo, hoodieDarkMat);
    lCuff.position.y = -0.32;
    const rCuff = new THREE.Mesh(cuffGeo, hoodieDarkMat);
    rCuff.position.y = -0.32;

    leftCalfGroup.add(lCalf, lStripe, lCuff);
    rightCalfGroup.add(rCalf, rStripe, rCuff);

    // Connect feet directly to calf groups for lifelike articulated leg kinematics
    leftCalfGroup.add(leftFootGroup);
    rightCalfGroup.add(rightFootGroup);

    // ------------------------------------------------------------------------
    // Pro Parkour Sneakers ("AcroKicks"): Curved Toe Spring, EVA Midsole, Air Unit
    // ------------------------------------------------------------------------
    leftFootGroup.position.set(0, -0.34, -0.04);
    rightFootGroup.position.set(0, -0.34, -0.04);

    const buildRealisticSneaker = () => {
      const shoeGroup = new THREE.Group();

      // Curved Rubber Outsole with traction tread
      const outsoleGeo = new THREE.BoxGeometry(0.155, 0.035, 0.28);
      const outsole = new THREE.Mesh(outsoleGeo, sneakerRubberMat);
      outsole.position.set(0, -0.065, 0.02);

      // Curved Upturned Toe Spring (anatomical running roll)
      const toeSpringGeo = new THREE.BoxGeometry(0.15, 0.032, 0.09);
      const toeSpring = new THREE.Mesh(toeSpringGeo, sneakerRubberMat);
      toeSpring.position.set(0, -0.048, -0.135);
      toeSpring.rotation.x = -0.22;

      // Sculpted EVA Foam Midsole
      const midsoleGeo = new THREE.BoxGeometry(0.152, 0.045, 0.27);
      const midsole = new THREE.Mesh(midsoleGeo, sneakerWhiteMat);
      midsole.position.set(0, -0.03, 0.02);

      // Translucent Rear Air-Cushion Unit Window
      const airGeo = new THREE.BoxGeometry(0.13, 0.025, 0.10);
      const airMesh = new THREE.Mesh(airGeo, airCushionMat);
      airMesh.position.set(0, -0.03, 0.08);

      // Main Shoe Upper Body (Tech-fabric)
      const upperGeo = new THREE.BoxGeometry(0.145, 0.095, 0.25);
      const upper = new THREE.Mesh(upperGeo, sneakerRedMat);
      upper.position.set(0, 0.02, 0.02);

      // Front Toe Bumper Cap
      const toeCapGeo = new THREE.BoxGeometry(0.142, 0.06, 0.08);
      const toeCap = new THREE.Mesh(toeCapGeo, sneakerWhiteMat);
      toeCap.position.set(0, 0.01, -0.11);
      toeCap.rotation.x = -0.2;

      // Padded Tongue & High-Top Collar
      const tongueGeo = new THREE.BoxGeometry(0.11, 0.10, 0.03);
      const tongue = new THREE.Mesh(tongueGeo, sneakerWhiteMat);
      tongue.position.set(0, 0.08, -0.04);
      tongue.rotation.x = -0.25;

      const collarGeo = new THREE.BoxGeometry(0.14, 0.05, 0.12);
      const collar = new THREE.Mesh(collarGeo, sneakerWhiteMat);
      collar.position.set(0, 0.07, 0.08);

      // 3D Crossed Shoelaces & Tied Knot
      const laceBarGeo = new THREE.BoxGeometry(0.09, 0.012, 0.02);
      const lace1 = new THREE.Mesh(laceBarGeo, sneakerWhiteMat);
      lace1.position.set(0, 0.07, -0.07);
      const lace2 = new THREE.Mesh(laceBarGeo, sneakerWhiteMat);
      lace2.position.set(0, 0.085, -0.04);
      const lace3 = new THREE.Mesh(laceBarGeo, sneakerWhiteMat);
      lace3.position.set(0, 0.10, -0.01);
      const knotGeo = new THREE.SphereGeometry(0.018, 8, 8);
      const knot = new THREE.Mesh(knotGeo, sneakerWhiteMat);
      knot.position.set(0, 0.115, -0.02);

      // Rear Heel Pull Tab
      const tabGeo = new THREE.BoxGeometry(0.02, 0.06, 0.015);
      const tab = new THREE.Mesh(tabGeo, sneakerRedMat);
      tab.position.set(0, 0.09, 0.14);

      shoeGroup.add(
        outsole,
        toeSpring,
        midsole,
        airMesh,
        upper,
        toeCap,
        tongue,
        collar,
        lace1,
        lace2,
        lace3,
        knot,
        tab
      );
      return shoeGroup;
    };

    leftFootGroup.add(buildRealisticSneaker());
    rightFootGroup.add(buildRealisticSneaker());
  } else if (characterId === 'kibo') {
    // ------------------------------------------------------------------------
    // KIBO: Cute Cartoon Ninja Fox
    // ------------------------------------------------------------------------
    const foxFurMat = pbrMat('#f97316', 0.6, 0.0);
    const creamFurMat = pbrMat('#fef08a', 0.5, 0.0);
    const ninjaRedMat = pbrMat('#dc2626', 0.4, 0.05);
    const ninjaYellowMat = basicMat('#eab308');
    const darkNinjaMat = pbrMat('#1e1b4b', 0.5, 0.1);
    const metalMat = pbrMat('#e2e8f0', 0.2, 0.85);
    const eyeTealMat = basicMat('#0d9488');
    const eyeBlackMat = basicMat('#0f172a');
    const eyeSparkMat = basicMat('#ffffff');

    // Torso: Ninja Gi & Sash
    const torsoGeo = new THREE.BoxGeometry(0.42, 0.58, 0.26);
    const torsoMesh = new THREE.Mesh(torsoGeo, darkNinjaMat);
    torsoMesh.position.y = 1.05;
    torsoGroup.add(torsoMesh);

    // Cream chest fur bib
    const bibGeo = new THREE.BoxGeometry(0.26, 0.44, 0.03);
    const bibMesh = new THREE.Mesh(bibGeo, creamFurMat);
    bibMesh.position.set(0, 1.08, -0.132);
    torsoGroup.add(bibMesh);

    // Red sash around waist with knot
    const beltGeo = new THREE.BoxGeometry(0.44, 0.12, 0.28);
    const beltMesh = new THREE.Mesh(beltGeo, ninjaRedMat);
    beltMesh.position.set(0, 0.82, 0);
    torsoGroup.add(beltMesh);

    // Fluffy Cartoon Fox Tail!
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.82, 0.16);

    const tailBaseGeo = new THREE.ConeGeometry(0.12, 0.35, 8);
    const tailBase = new THREE.Mesh(tailBaseGeo, foxFurMat);
    tailBase.position.set(0, 0.15, 0.18);
    tailBase.rotation.x = 1.1;

    const tailTipGeo = new THREE.ConeGeometry(0.09, 0.25, 8);
    const tailTip = new THREE.Mesh(tailTipGeo, creamFurMat);
    tailTip.position.set(0, 0.32, 0.36);
    tailTip.rotation.x = 1.4;

    tailGroup.add(tailBase, tailTip);
    torsoGroup.add(tailGroup);
    secondaryNodes.tailGroup = tailGroup;

    // Head: Chibi Cartoon Fox
    headGroup.position.set(0, 1.54, 0);

    const headGeo = new THREE.BoxGeometry(0.36, 0.34, 0.34);
    const headMesh = new THREE.Mesh(headGeo, foxFurMat);
    headMesh.position.y = 0.05;
    headGroup.add(headMesh);

    // Cute Fox Muzzle / Snout
    const muzzleGeo = new THREE.BoxGeometry(0.18, 0.12, 0.14);
    const muzzleMesh = new THREE.Mesh(muzzleGeo, creamFurMat);
    muzzleMesh.position.set(0, -0.02, -0.2);
    headGroup.add(muzzleMesh);

    // Cute Black Fox Nose
    const noseGeo = new THREE.ConeGeometry(0.035, 0.05, 6);
    const noseMesh = new THREE.Mesh(noseGeo, basicMat('#0f172a'));
    noseMesh.rotation.x = -Math.PI / 2;
    noseMesh.position.set(0, 0.01, -0.27);
    headGroup.add(noseMesh);

    // Whiskers
    const whiskerGeo = new THREE.BoxGeometry(0.1, 0.012, 0.01);
    const whiskerL = new THREE.Mesh(whiskerGeo, basicMat('#0f172a'));
    whiskerL.position.set(-0.16, -0.02, -0.19);
    whiskerL.rotation.z = 0.1;
    const whiskerR = new THREE.Mesh(whiskerGeo, basicMat('#0f172a'));
    whiskerR.position.set(0.16, -0.02, -0.19);
    whiskerR.rotation.z = -0.1;
    headGroup.add(whiskerL, whiskerR);

    // Large Anime Cartoon Eyes
    const eyeWhiteGeo = new THREE.BoxGeometry(0.08, 0.1, 0.02);
    const eyeTealGeo = new THREE.BoxGeometry(0.05, 0.07, 0.025);
    const eyeBlackGeo = new THREE.BoxGeometry(0.03, 0.04, 0.03);
    const eyeSparkGeo = new THREE.BoxGeometry(0.02, 0.02, 0.035);

    // Left Eye
    const eLWhite = new THREE.Mesh(eyeWhiteGeo, basicMat('#ffffff'));
    eLWhite.position.set(-0.1, 0.06, -0.172);
    const eLTeal = new THREE.Mesh(eyeTealGeo, eyeTealMat);
    eLTeal.position.set(-0.1, 0.06, -0.174);
    const eLBlack = new THREE.Mesh(eyeBlackGeo, eyeBlackMat);
    eLBlack.position.set(-0.1, 0.06, -0.176);
    const eLSpark = new THREE.Mesh(eyeSparkGeo, eyeSparkMat);
    eLSpark.position.set(-0.11, 0.085, -0.178);
    headGroup.add(eLWhite, eLTeal, eLBlack, eLSpark);

    // Right Eye
    const eRWhite = new THREE.Mesh(eyeWhiteGeo, basicMat('#ffffff'));
    eRWhite.position.set(0.1, 0.06, -0.172);
    const eRTeal = new THREE.Mesh(eyeTealGeo, eyeTealMat);
    eRTeal.position.set(0.1, 0.06, -0.174);
    const eRBlack = new THREE.Mesh(eyeBlackGeo, eyeBlackMat);
    eRBlack.position.set(0.1, 0.06, -0.176);
    const eRSpark = new THREE.Mesh(eyeSparkGeo, eyeSparkMat);
    eRSpark.position.set(0.09, 0.085, -0.178);
    headGroup.add(eRWhite, eRTeal, eRBlack, eRSpark);

    secondaryNodes.eyeL = eLWhite;
    secondaryNodes.eyeR = eRWhite;

    // Fox Ears: Pointy with cream inner fluff
    const earGroupL = new THREE.Group();
    earGroupL.position.set(-0.15, 0.22, -0.02);
    const outerEarL = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.22, 6), foxFurMat);
    outerEarL.rotation.z = 0.3;
    const innerEarL = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.16, 6), creamFurMat);
    innerEarL.position.set(0.02, 0, -0.02);
    innerEarL.rotation.z = 0.3;
    earGroupL.add(outerEarL, innerEarL);

    const earGroupR = new THREE.Group();
    earGroupR.position.set(0.15, 0.22, -0.02);
    const outerEarR = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.22, 6), foxFurMat);
    outerEarR.rotation.z = -0.3;
    const innerEarR = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.16, 6), creamFurMat);
    innerEarR.position.set(-0.02, 0, -0.02);
    innerEarR.rotation.z = -0.3;
    earGroupR.add(outerEarR, innerEarR);

    headGroup.add(earGroupL, earGroupR);
    secondaryNodes.earL = earGroupL;
    secondaryNodes.earR = earGroupR;

    // Ninja Headband & Metal Plate
    const headbandGeo = new THREE.BoxGeometry(0.38, 0.08, 0.36);
    const headband = new THREE.Mesh(headbandGeo, ninjaRedMat);
    headband.position.set(0, 0.14, 0);
    headGroup.add(headband);

    const plateGeo = new THREE.BoxGeometry(0.18, 0.06, 0.02);
    const plateMesh = new THREE.Mesh(plateGeo, metalMat);
    plateMesh.position.set(0, 0.14, -0.182);
    headGroup.add(plateMesh);

    // Dynamic Fluttering Ninja Scarf Ribbons! (Secondary physics)
    const scarfBones: THREE.Mesh[] = [];
    const ribbonSegmentCount = 4;
    for (let i = 0; i < ribbonSegmentCount; i++) {
      const segGeo = new THREE.BoxGeometry(0.12, 0.04, 0.18);
      const segMesh = new THREE.Mesh(segGeo, ninjaYellowMat);
      segMesh.position.set(-0.06, 1.34 - i * 0.06, 0.18 + i * 0.16);
      innerBodyGroup.add(segMesh);
      scarfBones.push(segMesh);
    }
    secondaryNodes.scarfBones = scarfBones;

    // Limbs: Ninja arms with hand wraps
    leftArmGroup.position.set(-0.29, 1.32, 0);
    rightArmGroup.position.set(0.29, 1.32, 0);

    const nShoulderGeo = new THREE.BoxGeometry(0.13, 0.22, 0.13);
    const nForearmGeo = new THREE.BoxGeometry(0.11, 0.24, 0.11);
    const nPawsGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);

    const lShoulder = new THREE.Mesh(nShoulderGeo, darkNinjaMat);
    lShoulder.position.y = -0.1;
    const lForearm = new THREE.Mesh(nForearmGeo, ninjaRedMat);
    lForearm.position.y = -0.32;
    const lPaw = new THREE.Mesh(nPawsGeo, creamFurMat);
    lPaw.position.y = -0.48;
    leftArmGroup.add(lShoulder, lForearm, lPaw);

    const rShoulder = new THREE.Mesh(nShoulderGeo, darkNinjaMat);
    rShoulder.position.y = -0.1;
    const rForearm = new THREE.Mesh(nForearmGeo, ninjaRedMat);
    rForearm.position.y = -0.32;
    const rPaw = new THREE.Mesh(nPawsGeo, creamFurMat);
    rPaw.position.y = -0.48;
    rightArmGroup.add(rShoulder, rForearm, rPaw);

    // Legs: Ninja Tabi Boots
    leftLegGroup.position.set(-0.14, 0.74, 0);
    rightLegGroup.position.set(0.14, 0.74, 0);

    const nThighGeo = new THREE.BoxGeometry(0.15, 0.34, 0.15);
    const nCalfGeo = new THREE.BoxGeometry(0.13, 0.32, 0.13);
    const nBootGeo = new THREE.BoxGeometry(0.15, 0.14, 0.26);

    const lThigh = new THREE.Mesh(nThighGeo, darkNinjaMat);
    lThigh.position.y = -0.15;
    const lCalf = new THREE.Mesh(nCalfGeo, ninjaRedMat);
    lCalf.position.y = -0.42;
    leftLegGroup.add(lThigh, lCalf);

    const rThigh = new THREE.Mesh(nThighGeo, darkNinjaMat);
    rThigh.position.y = -0.15;
    const rCalf = new THREE.Mesh(nCalfGeo, ninjaRedMat);
    rCalf.position.y = -0.42;
    rightLegGroup.add(rThigh, rCalf);

    leftFootGroup.position.set(0, -0.66, -0.04);
    const lBoot = new THREE.Mesh(nBootGeo, darkNinjaMat);
    const lPawToe = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.08), creamFurMat);
    lPawToe.position.set(0, -0.03, -0.1);
    leftFootGroup.add(lBoot, lPawToe);

    rightFootGroup.position.set(0, -0.66, -0.04);
    const rBoot = new THREE.Mesh(nBootGeo, darkNinjaMat);
    const rPawToe = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.08), creamFurMat);
    rPawToe.position.set(0, -0.03, -0.1);
    rightFootGroup.add(rBoot, rPawToe);
  } else if (characterId === 'aoi') {
    // ------------------------------------------------------------------------
    // AOI: Anime Cyber Speedster Heroine
    // ------------------------------------------------------------------------
    const animeSkinMat = pbrMat('#ffe4e6', 0.6, 0.0);
    const hairTealMat = pbrMat('#06b6d4', 0.45, 0.1);
    const jacketWhiteMat = pbrMat('#f8fafc', 0.35, 0.05);
    const jacketPinkMat = pbrMat('#f43f5e', 0.35, 0.1);
    const glowCyanMat = basicMat('#22d3ee');
    const glowPinkMat = basicMat('#f43f5e');
    const shortsMat = pbrMat('#0f172a', 0.5, 0.1);

    // Torso: Cropped Techwear Parkour Jacket
    const torsoGeo = new THREE.BoxGeometry(0.4, 0.58, 0.24);
    const torsoMesh = new THREE.Mesh(torsoGeo, jacketWhiteMat);
    torsoMesh.position.y = 1.05;
    torsoGroup.add(torsoMesh);

    // Pink geometric chest accents
    const chestAccentGeo = new THREE.BoxGeometry(0.41, 0.14, 0.25);
    const chestAccent = new THREE.Mesh(chestAccentGeo, jacketPinkMat);
    chestAccent.position.set(0, 1.18, 0);
    torsoGroup.add(chestAccent);

    // Glowing cyber neon line on spine
    const spineGlowGeo = new THREE.BoxGeometry(0.04, 0.48, 0.02);
    const spineGlow = new THREE.Mesh(spineGlowGeo, glowCyanMat);
    spineGlow.position.set(0, 1.05, 0.122);
    torsoGroup.add(spineGlow);

    // Head: Anime Girl Head
    headGroup.position.set(0, 1.54, 0);

    const headGeo = new THREE.BoxGeometry(0.3, 0.32, 0.3);
    const headMesh = new THREE.Mesh(headGeo, animeSkinMat);
    headMesh.position.y = 0.05;
    headGroup.add(headMesh);

    // Big Anime Eyes with Cyan Irises & Double Sparkle
    const eyeWhiteGeo = new THREE.BoxGeometry(0.075, 0.1, 0.02);
    const eyeIrisGeo = new THREE.BoxGeometry(0.05, 0.075, 0.025);
    const eyePupilGeo = new THREE.BoxGeometry(0.028, 0.045, 0.03);
    const eyeSpark1Geo = new THREE.BoxGeometry(0.02, 0.02, 0.035);
    const eyeSpark2Geo = new THREE.BoxGeometry(0.012, 0.012, 0.035);

    // Left Anime Eye
    const eLWhite = new THREE.Mesh(eyeWhiteGeo, basicMat('#ffffff'));
    eLWhite.position.set(-0.08, 0.05, -0.152);
    const eLIris = new THREE.Mesh(eyeIrisGeo, basicMat('#06b6d4'));
    eLIris.position.set(-0.08, 0.05, -0.154);
    const eLPupil = new THREE.Mesh(eyePupilGeo, basicMat('#083344'));
    eLPupil.position.set(-0.08, 0.05, -0.156);
    const eLSpark1 = new THREE.Mesh(eyeSpark1Geo, basicMat('#ffffff'));
    eLSpark1.position.set(-0.09, 0.075, -0.158);
    const eLSpark2 = new THREE.Mesh(eyeSpark2Geo, basicMat('#ffffff'));
    eLSpark2.position.set(-0.07, 0.03, -0.158);
    headGroup.add(eLWhite, eLIris, eLPupil, eLSpark1, eLSpark2);

    // Right Anime Eye
    const eRWhite = new THREE.Mesh(eyeWhiteGeo, basicMat('#ffffff'));
    eRWhite.position.set(0.08, 0.05, -0.152);
    const eRIris = new THREE.Mesh(eyeIrisGeo, basicMat('#06b6d4'));
    eRIris.position.set(0.08, 0.05, -0.154);
    const eRPupil = new THREE.Mesh(eyePupilGeo, basicMat('#083344'));
    eRPupil.position.set(0.08, 0.05, -0.156);
    const eRSpark1 = new THREE.Mesh(eyeSpark1Geo, basicMat('#ffffff'));
    eRSpark1.position.set(0.07, 0.075, -0.158);
    const eRSpark2 = new THREE.Mesh(eyeSpark2Geo, basicMat('#ffffff'));
    eRSpark2.position.set(0.09, 0.03, -0.158);
    headGroup.add(eRWhite, eRIris, eRPupil, eRSpark1, eRSpark2);

    secondaryNodes.eyeL = eLWhite;
    secondaryNodes.eyeR = eRWhite;

    // Anime Hair Bangs
    const bangsGeo = new THREE.BoxGeometry(0.32, 0.1, 0.06);
    const bangs = new THREE.Mesh(bangsGeo, hairTealMat);
    bangs.position.set(0, 0.16, -0.14);
    bangs.rotation.x = -0.2;
    headGroup.add(bangs);

    // Hair Cap Base
    const hairCapGeo = new THREE.BoxGeometry(0.33, 0.22, 0.33);
    const hairCap = new THREE.Mesh(hairCapGeo, hairTealMat);
    hairCap.position.set(0, 0.15, 0.02);
    headGroup.add(hairCap);

    // Bouncy Dynamic Anime Twintails!
    const hairLeftGroup = new THREE.Group();
    hairLeftGroup.position.set(-0.2, 0.16, 0.06);
    const pigtailGeo = new THREE.ConeGeometry(0.07, 0.45, 7);
    const lPigtail = new THREE.Mesh(pigtailGeo, hairTealMat);
    lPigtail.position.set(-0.06, -0.18, 0.05);
    lPigtail.rotation.set(0.2, 0, -0.3);
    const lHairTie = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.015, 8, 12), glowPinkMat);
    lHairTie.rotation.x = Math.PI / 2;
    hairLeftGroup.add(lHairTie, lPigtail);

    const hairRightGroup = new THREE.Group();
    hairRightGroup.position.set(0.2, 0.16, 0.06);
    const rPigtail = new THREE.Mesh(pigtailGeo, hairTealMat);
    rPigtail.position.set(0.06, -0.18, 0.05);
    rPigtail.rotation.set(0.2, 0, 0.3);
    const rHairTie = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.015, 8, 12), glowPinkMat);
    rHairTie.rotation.x = Math.PI / 2;
    hairRightGroup.add(rHairTie, rPigtail);

    headGroup.add(hairLeftGroup, hairRightGroup);
    secondaryNodes.hairLeft = hairLeftGroup;
    secondaryNodes.hairRight = hairRightGroup;

    // Glowing Neon Cat-Ear Headphones
    const bandGeo = new THREE.TorusGeometry(0.18, 0.018, 8, 16, Math.PI);
    const bandMesh = new THREE.Mesh(bandGeo, pbrMat('#0f172a', 0.2, 0.8));
    bandMesh.position.set(0, 0.12, 0);
    bandMesh.rotation.z = Math.PI;
    headGroup.add(bandMesh);

    const catEarGeo = new THREE.ConeGeometry(0.05, 0.1, 4);
    const catEarL = new THREE.Mesh(catEarGeo, glowPinkMat);
    catEarL.position.set(-0.12, 0.28, 0);
    catEarL.rotation.z = 0.2;
    const catEarR = new THREE.Mesh(catEarGeo, glowPinkMat);
    catEarR.position.set(0.12, 0.28, 0);
    catEarR.rotation.z = -0.2;
    headGroup.add(catEarL, catEarR);

    // Limbs: Athletic Girl Arms
    leftArmGroup.position.set(-0.28, 1.32, 0);
    rightArmGroup.position.set(0.28, 1.32, 0);

    const aUpperGeo = new THREE.BoxGeometry(0.11, 0.22, 0.11);
    const aLowerGeo = new THREE.BoxGeometry(0.09, 0.22, 0.09);
    const aGloveGeo = new THREE.BoxGeometry(0.1, 0.13, 0.1);

    const lUpper = new THREE.Mesh(aUpperGeo, jacketWhiteMat);
    lUpper.position.y = -0.1;
    const lLower = new THREE.Mesh(aLowerGeo, animeSkinMat);
    lLower.position.y = -0.3;
    const lGlove = new THREE.Mesh(aGloveGeo, glowPinkMat);
    lGlove.position.y = -0.46;
    leftArmGroup.add(lUpper, lLower, lGlove);

    const rUpper = new THREE.Mesh(aUpperGeo, jacketWhiteMat);
    rUpper.position.y = -0.1;
    const rLower = new THREE.Mesh(aLowerGeo, animeSkinMat);
    rLower.position.y = -0.3;
    const rGlove = new THREE.Mesh(aGloveGeo, glowPinkMat);
    rGlove.position.y = -0.46;
    rightArmGroup.add(rUpper, rLower, rGlove);

    // Legs: Runner Shorts & High-tech Sneakers
    leftLegGroup.position.set(-0.13, 0.74, 0);
    rightLegGroup.position.set(0.13, 0.74, 0);

    const aThighGeo = new THREE.BoxGeometry(0.14, 0.32, 0.14);
    const aCalfGeo = new THREE.BoxGeometry(0.12, 0.3, 0.12);

    const lThigh = new THREE.Mesh(aThighGeo, shortsMat);
    lThigh.position.y = -0.14;
    const lCalf = new THREE.Mesh(aCalfGeo, animeSkinMat);
    lCalf.position.y = -0.42;
    leftLegGroup.add(lThigh, lCalf);

    const rThigh = new THREE.Mesh(aThighGeo, shortsMat);
    rThigh.position.y = -0.14;
    const rCalf = new THREE.Mesh(aCalfGeo, animeSkinMat);
    rCalf.position.y = -0.42;
    rightLegGroup.add(rThigh, rCalf);

    // Futuristic Hover Sneakers
    const aShoeGeo = new THREE.BoxGeometry(0.15, 0.12, 0.26);
    const aSoleGeo = new THREE.BoxGeometry(0.16, 0.04, 0.28);

    leftFootGroup.position.set(0, -0.64, -0.04);
    const lShoe = new THREE.Mesh(aShoeGeo, jacketWhiteMat);
    const lSole = new THREE.Mesh(aSoleGeo, glowCyanMat);
    lSole.position.y = -0.06;
    leftFootGroup.add(lShoe, lSole);

    rightFootGroup.position.set(0, -0.64, -0.04);
    const rShoe = new THREE.Mesh(aShoeGeo, jacketWhiteMat);
    const rSole = new THREE.Mesh(aSoleGeo, glowCyanMat);
    rSole.position.y = -0.06;
    rightFootGroup.add(rShoe, rSole);
  } else {
    // ------------------------------------------------------------------------
    // SPARKY: Charming Chibi Toon Robot
    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------
    // SPARKY: Cyber Astronaut Parkour Runner (Exactly matching reference screenshot)
    // ------------------------------------------------------------------------
    const cyberDarkMat = pbrMat('#1e2433', 0.45, 0.25);
    const cyberSuitMat = pbrMat('#111827', 0.5, 0.2);
    const cyberCyanMat = new THREE.MeshStandardMaterial({
      color: '#00f0ff',
      emissive: new THREE.Color('#00f0ff'),
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.1,
    });
    const sneakerWhiteMat = pbrMat('#ffffff', 0.35, 0.05);
    const sneakerSoleMat = pbrMat('#0f172a', 0.7, 0.1);
    const flameMat = basicMat('#00f0ff');

    // Torso: High-tech Dark Cyber Armor with Cyan Chest Accent
    const torsoGeo = new THREE.BoxGeometry(0.44, 0.52, 0.28);
    const torsoMesh = new THREE.Mesh(torsoGeo, cyberSuitMat);
    torsoMesh.position.y = 1.05;
    torsoGroup.add(torsoMesh);

    // Glowing Cyan Core Stripe on chest
    const chestStripeGeo = new THREE.BoxGeometry(0.12, 0.3, 0.02);
    const chestStripe = new THREE.Mesh(chestStripeGeo, cyberCyanMat);
    chestStripe.position.set(0, 1.08, -0.145);
    torsoGroup.add(chestStripe);

    // Tech Backpack / Jetpack with Vertical Glowing Cyan Light Bar
    const jetPackGeo = new THREE.BoxGeometry(0.32, 0.38, 0.15);
    const jetPack = new THREE.Mesh(jetPackGeo, cyberDarkMat);
    jetPack.position.set(0, 1.06, 0.2);
    torsoGroup.add(jetPack);

    // Vertical glowing energy tube on backpack
    const energyTubeGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.26, 8);
    const energyTube = new THREE.Mesh(energyTubeGeo, cyberCyanMat);
    energyTube.position.set(0, 1.06, 0.28);
    torsoGroup.add(energyTube);

    // Dual mini jet nozzles
    const nozzleGeo = new THREE.CylinderGeometry(0.045, 0.06, 0.1, 8);
    const nozL = new THREE.Mesh(nozzleGeo, cyberDarkMat);
    nozL.position.set(-0.09, 0.84, 0.2);
    const nozR = new THREE.Mesh(nozzleGeo, cyberDarkMat);
    nozR.position.set(0.09, 0.84, 0.2);
    torsoGroup.add(nozL, nozR);

    // Thruster flame jets
    const flameGeo = new THREE.ConeGeometry(0.05, 0.22, 6);
    const flameL = new THREE.Mesh(flameGeo, flameMat);
    flameL.position.set(-0.09, 0.72, 0.2);
    flameL.rotation.x = Math.PI;
    flameL.visible = false;
    const flameR = new THREE.Mesh(flameGeo, flameMat);
    flameR.position.set(0.09, 0.72, 0.2);
    flameR.rotation.x = Math.PI;
    flameR.visible = false;
    torsoGroup.add(flameL, flameR);
    secondaryNodes.jetFlames = [flameL, flameR];

    // Head: Cylindrical Dark Astronaut Helmet with Glowing Cyan Visor Screen
    headGroup.position.set(0, 1.52, 0);

    const helmetGeo = new THREE.CylinderGeometry(0.22, 0.20, 0.36, 16);
    const helmetMesh = new THREE.Mesh(helmetGeo, cyberDarkMat);
    helmetMesh.position.y = 0.04;
    headGroup.add(helmetMesh);

    // Helmet Top Dome
    const domeGeo = new THREE.SphereGeometry(0.22, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, cyberDarkMat);
    dome.position.y = 0.22;
    headGroup.add(dome);

    // Glowing Curved Cyan Visor Lens Screen on front of helmet
    const visorGeo = new THREE.BoxGeometry(0.3, 0.16, 0.06);
    const visor = new THREE.Mesh(visorGeo, cyberCyanMat);
    visor.position.set(0, 0.05, -0.19);
    headGroup.add(visor);

    // Side Headset Canister / Communicator (visible on left side of helmet in screenshot)
    const canGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.12, 12);
    const canister = new THREE.Mesh(canGeo, cyberDarkMat);
    canister.rotation.z = Math.PI / 2;
    canister.position.set(-0.23, 0.05, 0);

    const canRingGeo = new THREE.TorusGeometry(0.065, 0.012, 6, 16);
    const canRing = new THREE.Mesh(canRingGeo, cyberCyanMat);
    canRing.rotation.y = Math.PI / 2;
    canRing.position.set(-0.28, 0.05, 0);
    headGroup.add(canister, canRing);

    // Limbs: Sleek dark arms with cyan wristbands
    leftArmGroup.position.set(-0.28, 1.30, 0);
    rightArmGroup.position.set(0.28, 1.30, 0);

    const bArmGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.44, 8);
    const lArm = new THREE.Mesh(bArmGeo, cyberSuitMat);
    lArm.position.y = -0.22;
    const lBand = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.06, 8), cyberCyanMat);
    lBand.position.y = -0.38;
    leftArmGroup.add(lArm, lBand);

    const rArm = new THREE.Mesh(bArmGeo, cyberSuitMat);
    rArm.position.y = -0.22;
    const rBand = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.06, 8), cyberCyanMat);
    rBand.position.y = -0.38;
    rightArmGroup.add(rArm, rBand);

    // Legs: Slim dark cyber legs
    leftLegGroup.position.set(-0.14, 0.74, 0);
    rightLegGroup.position.set(0.14, 0.74, 0);

    const bLegGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.50, 8);
    const lLeg = new THREE.Mesh(bLegGeo, cyberSuitMat);
    lLeg.position.y = -0.25;
    leftLegGroup.add(lLeg);

    const rLeg = new THREE.Mesh(bLegGeo, cyberSuitMat);
    rLeg.position.y = -0.25;
    rightLegGroup.add(rLeg);

    // Feet: Crisp clean WHITE cyber sneakers with dark rubber soles (just like in screenshot!)
    leftFootGroup.position.set(0, -0.66, -0.04);
    const lShoeTop = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.12, 0.28), sneakerWhiteMat);
    const lShoeSole = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.30), sneakerSoleMat);
    lShoeSole.position.y = -0.07;
    leftFootGroup.add(lShoeTop, lShoeSole);

    rightFootGroup.position.set(0, -0.66, -0.04);
    const rShoeTop = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.12, 0.28), sneakerWhiteMat);
    const rShoeSole = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.30), sneakerSoleMat);
    rShoeSole.position.y = -0.07;
    rightFootGroup.add(rShoeTop, rShoeSole);
  }

  // 2. Ground Contact Shadow
  const shadowGeo = new THREE.CircleGeometry(0.55, 16);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: '#000000',
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.02;
  rootGroup.add(contactShadow);

  // 3. Directional Navigation Arrow on Floor
  const arrowShape = new THREE.Shape();
  arrowShape.moveTo(0, -1.05);
  arrowShape.lineTo(0.22, -0.65);
  arrowShape.lineTo(0.09, -0.65);
  arrowShape.lineTo(0.09, 0);
  arrowShape.lineTo(-0.09, 0);
  arrowShape.lineTo(-0.09, -0.65);
  arrowShape.lineTo(-0.22, -0.65);
  arrowShape.closePath();

  const arrowGeo = new THREE.ShapeGeometry(arrowShape);
  const arrowMat = new THREE.MeshBasicMaterial({
    color: '#38bdf8',
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
  arrowMesh.rotation.x = -Math.PI / 2;
  arrowMesh.position.y = 0.03;
  rootGroup.add(arrowMesh);

  // 4. Glowing 3D Holographic Ground Reticle (Circle with 4 crosshair ticks & center dot)
  const reticleGroup = new THREE.Group();
  reticleGroup.position.set(0, 0.035, -0.75); // positioned right in front of runner on floor
  reticleGroup.rotation.x = -Math.PI / 2;

  const reticleMat = new THREE.MeshBasicMaterial({
    color: '#00f0ff',
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });

  // Main cyan ring
  const reticleRing = new THREE.Mesh(new THREE.RingGeometry(0.35, 0.40, 32), reticleMat);
  reticleGroup.add(reticleRing);

  // 4 Crosshair Tick Marks
  const tickGeoH = new THREE.PlaneGeometry(0.14, 0.04);
  const tickGeoV = new THREE.PlaneGeometry(0.04, 0.14);

  const tickN = new THREE.Mesh(tickGeoV, reticleMat);
  tickN.position.set(0, 0.44, 0);
  const tickS = new THREE.Mesh(tickGeoV, reticleMat);
  tickS.position.set(0, -0.44, 0);
  const tickE = new THREE.Mesh(tickGeoH, reticleMat);
  tickE.position.set(0.44, 0, 0);
  const tickW = new THREE.Mesh(tickGeoH, reticleMat);
  tickW.position.set(-0.44, 0, 0);
  reticleGroup.add(tickN, tickS, tickE, tickW);

  // Center Target Bead
  const centerDot = new THREE.Mesh(new THREE.CircleGeometry(0.07, 16), reticleMat);
  reticleGroup.add(centerDot);

  rootGroup.add(reticleGroup);

  return {
    characterId,
    rootGroup,
    innerBodyGroup,
    headGroup,
    torsoGroup,
    leftArmGroup,
    rightArmGroup,
    leftLegGroup,
    rightLegGroup,
    leftFootGroup,
    rightFootGroup,
    leftForearmGroup: characterId === 'kaito' ? leftForearmGroup : undefined,
    rightForearmGroup: characterId === 'kaito' ? rightForearmGroup : undefined,
    leftCalfGroup: characterId === 'kaito' ? leftCalfGroup : undefined,
    rightCalfGroup: characterId === 'kaito' ? rightCalfGroup : undefined,
    secondaryNodes,
    contactShadow,
    arrowMesh,
    doubleJumpFlipProgress: 0,
    landingSquash: 1.0,
    blinkTimer: 0,
    isBlinking: false,
  };
}

/**
 * Updates full humanoid locomotion kinematics, cartoon secondary physics,
 * facial blinking, acrobatic flips, wall-runs, and slide poses.
 */
export function animateCharacterRig(
  rig: CharacterRig,
  player: PlayerPhysicsState,
  time: number,
  dt: number
) {
  // Sync root position & yaw
  rig.rootGroup.position.set(player.position.x, player.position.y, player.position.z);
  rig.rootGroup.rotation.y = player.rotation.yaw;

  // Stride parameters
  const isMoving = player.speed > 0.5 && player.isGrounded && !player.isSliding;
  const runFreq = player.speed * 1.55;

  // Dynamic height scaling during slide
  const targetScaleY = player.isSliding ? 0.55 : 1.0;
  rig.rootGroup.scale.y = THREE.MathUtils.damp(rig.rootGroup.scale.y, targetScaleY, 15, dt);

  // Blinking timer for animated expressive eyes
  rig.blinkTimer += dt;
  if (rig.blinkTimer > 3.2) {
    rig.isBlinking = true;
    if (rig.blinkTimer > 3.36) {
      rig.isBlinking = false;
      rig.blinkTimer = 0;
    }
  }

  if (rig.secondaryNodes.eyeL && rig.secondaryNodes.eyeR) {
    const eyeScaleY = rig.isBlinking ? 0.15 : 1.0;
    rig.secondaryNodes.eyeL.scale.y = eyeScaleY;
    rig.secondaryNodes.eyeR.scale.y = eyeScaleY;
  }

  // Thruster flame visibility
  const thrusterVisible = !player.isGrounded || player.isDashing;
  if (rig.secondaryNodes.jetFlames) {
    rig.secondaryNodes.jetFlames.forEach((flame) => {
      flame.visible = thrusterVisible;
      if (thrusterVisible) {
        const flamePulse = 1.0 + Math.sin(time * 30) * 0.25;
        flame.scale.set(flamePulse, flamePulse * (player.isDashing ? 1.8 : 1.2), flamePulse);
      }
    });
  }

  // 1. Sliding Pose
  if (player.isSliding) {
    rig.innerBodyGroup.rotation.x = THREE.MathUtils.damp(rig.innerBodyGroup.rotation.x, -0.48, 12, dt);
    rig.innerBodyGroup.position.y = THREE.MathUtils.damp(rig.innerBodyGroup.position.y, -0.15, 12, dt);

    rig.headGroup.rotation.x = 0.25;
    rig.leftLegGroup.rotation.x = -1.25;
    rig.rightLegGroup.rotation.x = -0.95;
    rig.leftArmGroup.rotation.x = 0.6;
    rig.rightArmGroup.rotation.x = 0.6;
    rig.doubleJumpFlipProgress = 0;

    if (rig.leftForearmGroup) rig.leftForearmGroup.rotation.x = THREE.MathUtils.damp(rig.leftForearmGroup.rotation.x, 0.85, 14, dt);
    if (rig.rightForearmGroup) rig.rightForearmGroup.rotation.x = THREE.MathUtils.damp(rig.rightForearmGroup.rotation.x, 0.85, 14, dt);
    if (rig.leftCalfGroup) rig.leftCalfGroup.rotation.x = THREE.MathUtils.damp(rig.leftCalfGroup.rotation.x, 0.65, 14, dt);
    if (rig.rightCalfGroup) rig.rightCalfGroup.rotation.x = THREE.MathUtils.damp(rig.rightCalfGroup.rotation.x, 0.95, 14, dt);
  }
  // 2. Aerial Acrobatics / Jumping / Falling
  else if (!player.isGrounded) {
    if (player.currentAction === 'double_jumping') {
      // Fast dynamic front-flip rotation!
      rig.doubleJumpFlipProgress = Math.min(Math.PI * 2, rig.doubleJumpFlipProgress + dt * 18);
      rig.innerBodyGroup.rotation.x = -rig.doubleJumpFlipProgress;
      rig.innerBodyGroup.position.y = 0;

      // Acrobatic tuck
      rig.leftLegGroup.rotation.x = -0.8;
      rig.rightLegGroup.rotation.x = -0.8;
      rig.leftArmGroup.rotation.x = 1.2;
      rig.rightArmGroup.rotation.x = 1.2;

      if (rig.leftForearmGroup) rig.leftForearmGroup.rotation.x = 1.1;
      if (rig.rightForearmGroup) rig.rightForearmGroup.rotation.x = 1.1;
      if (rig.leftCalfGroup) rig.leftCalfGroup.rotation.x = 1.2;
      if (rig.rightCalfGroup) rig.rightCalfGroup.rotation.x = 1.2;
    } else {
      rig.doubleJumpFlipProgress = 0;
      // Normal jump / airborne glide
      rig.innerBodyGroup.rotation.x = THREE.MathUtils.damp(rig.innerBodyGroup.rotation.x, 0.16, 10, dt);
      rig.leftArmGroup.rotation.x = -0.55;
      rig.rightArmGroup.rotation.x = -0.55;
      rig.leftLegGroup.rotation.x = -0.35;
      rig.rightLegGroup.rotation.x = 0.25;

      if (rig.leftForearmGroup) rig.leftForearmGroup.rotation.x = THREE.MathUtils.damp(rig.leftForearmGroup.rotation.x, 0.45, 12, dt);
      if (rig.rightForearmGroup) rig.rightForearmGroup.rotation.x = THREE.MathUtils.damp(rig.rightForearmGroup.rotation.x, 0.45, 12, dt);
      if (rig.leftCalfGroup) rig.leftCalfGroup.rotation.x = THREE.MathUtils.damp(rig.leftCalfGroup.rotation.x, 0.5, 12, dt);
      if (rig.rightCalfGroup) rig.rightCalfGroup.rotation.x = THREE.MathUtils.damp(rig.rightCalfGroup.rotation.x, 0.35, 12, dt);
    }
  }
  // 3. Ground Locomotion (Walk / Sprint / Idle)
  else {
    rig.doubleJumpFlipProgress = 0;

    if (isMoving) {
      // Torso bounce & forward lean proportional to velocity
      const torsoBounce = Math.abs(Math.sin(time * runFreq)) * 0.06;
      rig.innerBodyGroup.position.y = THREE.MathUtils.damp(rig.innerBodyGroup.position.y, torsoBounce, 15, dt);
      const forwardLean = Math.min(0.28, 0.08 + player.speed * 0.012);
      rig.innerBodyGroup.rotation.x = THREE.MathUtils.damp(rig.innerBodyGroup.rotation.x, forwardLean, 10, dt);

      // Arm and leg swings with natural phase opposition
      const armSwing = Math.sin(time * runFreq) * 0.85;
      const legSwing = Math.sin(time * runFreq) * 0.95;

      rig.leftArmGroup.rotation.x = armSwing;
      rig.rightArmGroup.rotation.x = -armSwing;
      rig.leftLegGroup.rotation.x = -legSwing;
      rig.rightLegGroup.rotation.x = legSwing;

      // Realistic Human Locomotion:
      // 1. Torso counter-twist relative to hip stride
      rig.innerBodyGroup.rotation.y = THREE.MathUtils.damp(rig.innerBodyGroup.rotation.y, -legSwing * 0.12, 12, dt);

      // 2. Elbow flexion: deep bend on forward drive, extension on rear swing
      const lElbow = Math.max(0.35, 0.75 + armSwing * 0.42);
      const rElbow = Math.max(0.35, 0.75 - armSwing * 0.42);
      if (rig.leftForearmGroup) rig.leftForearmGroup.rotation.x = THREE.MathUtils.damp(rig.leftForearmGroup.rotation.x, lElbow, 16, dt);
      if (rig.rightForearmGroup) rig.rightForearmGroup.rotation.x = THREE.MathUtils.damp(rig.rightForearmGroup.rotation.x, rElbow, 16, dt);

      // 3. Knee flexion: calf folds backwards during backward recovery stride
      const lKnee = legSwing < 0 ? Math.min(1.25, -legSwing * 1.35) : 0;
      const rKnee = legSwing > 0 ? Math.min(1.25, legSwing * 1.35) : 0;
      if (rig.leftCalfGroup) rig.leftCalfGroup.rotation.x = THREE.MathUtils.damp(rig.leftCalfGroup.rotation.x, lKnee, 18, dt);
      if (rig.rightCalfGroup) rig.rightCalfGroup.rotation.x = THREE.MathUtils.damp(rig.rightCalfGroup.rotation.x, rKnee, 18, dt);

      // 4. Foot ankle dorsiflexion / heel strike
      rig.leftFootGroup.rotation.x = THREE.MathUtils.damp(rig.leftFootGroup.rotation.x, legSwing > 0 ? 0.22 : -0.18, 16, dt);
      rig.rightFootGroup.rotation.x = THREE.MathUtils.damp(rig.rightFootGroup.rotation.x, legSwing < 0 ? 0.22 : -0.18, 16, dt);

      // Subtle head bob
      const headBob = Math.sin(time * runFreq * 2) * 0.04;
      rig.headGroup.rotation.x = headBob;
    } else {
      // Realistic Idle: Natural breathing & relaxed posture
      const breath = Math.sin(time * 2.2);
      rig.torsoGroup.scale.set(1.0 + breath * 0.015, 1.0 + breath * 0.012, 1.0 + breath * 0.02);
      rig.headGroup.position.y = 1.54 + breath * 0.005;

      rig.innerBodyGroup.position.y = THREE.MathUtils.damp(rig.innerBodyGroup.position.y, 0, 10, dt);
      rig.innerBodyGroup.rotation.x = THREE.MathUtils.damp(rig.innerBodyGroup.rotation.x, 0, 10, dt);
      rig.innerBodyGroup.rotation.y = THREE.MathUtils.damp(rig.innerBodyGroup.rotation.y, 0, 10, dt);

      rig.leftArmGroup.rotation.x = THREE.MathUtils.damp(rig.leftArmGroup.rotation.x, 0.05, 10, dt);
      rig.rightArmGroup.rotation.x = THREE.MathUtils.damp(rig.rightArmGroup.rotation.x, 0.05, 10, dt);
      rig.leftLegGroup.rotation.x = THREE.MathUtils.damp(rig.leftLegGroup.rotation.x, 0, 10, dt);
      rig.rightLegGroup.rotation.x = THREE.MathUtils.damp(rig.rightLegGroup.rotation.x, 0, 10, dt);

      if (rig.leftForearmGroup) rig.leftForearmGroup.rotation.x = THREE.MathUtils.damp(rig.leftForearmGroup.rotation.x, 0.15, 10, dt);
      if (rig.rightForearmGroup) rig.rightForearmGroup.rotation.x = THREE.MathUtils.damp(rig.rightForearmGroup.rotation.x, 0.15, 10, dt);
      if (rig.leftCalfGroup) rig.leftCalfGroup.rotation.x = THREE.MathUtils.damp(rig.leftCalfGroup.rotation.x, 0, 10, dt);
      if (rig.rightCalfGroup) rig.rightCalfGroup.rotation.x = THREE.MathUtils.damp(rig.rightCalfGroup.rotation.x, 0, 10, dt);

      rig.leftFootGroup.rotation.x = THREE.MathUtils.damp(rig.leftFootGroup.rotation.x, 0, 10, dt);
      rig.rightFootGroup.rotation.x = THREE.MathUtils.damp(rig.rightFootGroup.rotation.x, 0, 10, dt);
      rig.headGroup.rotation.x = Math.sin(time * 2) * 0.015;
    }
  }

  // Wall-run lateral tilt
  if (player.isWallRunning) {
    const tilt = player.wallRunSide === 'left' ? -0.42 : 0.42;
    rig.rootGroup.rotation.z = THREE.MathUtils.damp(rig.rootGroup.rotation.z, tilt, 14, dt);
    // Wall arm balances along the wall
    if (player.wallRunSide === 'left') {
      rig.leftArmGroup.rotation.z = -0.5;
    } else {
      rig.rightArmGroup.rotation.z = 0.5;
    }
  } else {
    rig.rootGroup.rotation.z = THREE.MathUtils.damp(rig.rootGroup.rotation.z, 0, 10, dt);
    rig.leftArmGroup.rotation.z = 0;
    rig.rightArmGroup.rotation.z = 0;
  }

  // --------------------------------------------------------------------------
  // Secondary Physics & Cartoon Charm
  // --------------------------------------------------------------------------

  // 1. Kibo's Flying Ninja Scarf Ribbons
  if (rig.secondaryNodes.scarfBones) {
    const windSpeed = Math.max(player.speed, 8);
    rig.secondaryNodes.scarfBones.forEach((bone, idx) => {
      const wave = Math.sin(time * 16 - idx * 0.85) * 0.15;
      bone.position.y = 1.3 - idx * 0.07 + wave;
      bone.position.z = 0.18 + idx * 0.16 + (windSpeed * 0.012);
      bone.rotation.x = 0.35 + wave * 0.8;
      bone.rotation.y = Math.cos(time * 12 - idx * 0.8) * 0.12;
    });
  }

  // 2. Kibo's Waggling Fox Tail & Bouncing Fox Ears
  if (rig.secondaryNodes.tailGroup) {
    const tailWag = isMoving ? Math.sin(time * runFreq) * 0.35 : Math.sin(time * 3) * 0.12;
    rig.secondaryNodes.tailGroup.rotation.y = tailWag;
    rig.secondaryNodes.tailGroup.rotation.x = isMoving ? 0.3 : 0;
  }
  if (rig.secondaryNodes.earL && rig.secondaryNodes.earR) {
    const earBounce = isMoving ? Math.sin(time * runFreq * 2) * 0.08 : 0;
    rig.secondaryNodes.earL.rotation.x = earBounce;
    rig.secondaryNodes.earR.rotation.x = earBounce;
  }

  // 3. Aoi's Bouncy Anime Twintails
  if (rig.secondaryNodes.hairLeft && rig.secondaryNodes.hairRight) {
    const hairSway = isMoving ? Math.sin(time * runFreq) * 0.3 : Math.sin(time * 2.5) * 0.08;
    const airLift = !player.isGrounded ? 0.4 : isMoving ? 0.2 : 0;
    rig.secondaryNodes.hairLeft.rotation.z = -0.15 + hairSway;
    rig.secondaryNodes.hairRight.rotation.z = 0.15 - hairSway;
    rig.secondaryNodes.hairLeft.rotation.x = airLift;
    rig.secondaryNodes.hairRight.rotation.x = airLift;
  }

  // 4. Sparky's Springy Wobbling Antenna
  if (rig.secondaryNodes.antennaGroup) {
    const antennaWobble = isMoving ? Math.sin(time * 20) * 0.25 : Math.sin(time * 4) * 0.05;
    rig.secondaryNodes.antennaGroup.rotation.z = antennaWobble;
    rig.secondaryNodes.antennaGroup.rotation.x = (player.speed / 20) * 0.3;
  }

  // 5. Kaito's Hoodie Cords Swing
  if (rig.secondaryNodes.hoodieCords) {
    const cordSwing = isMoving ? Math.sin(time * runFreq) * 0.25 : 0;
    rig.secondaryNodes.hoodieCords.forEach((c) => {
      c.rotation.x = cordSwing;
    });
  }
}
