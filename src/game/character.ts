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
    subtitle: 'Cậu Bé Parkour',
    category: 'human',
    badge: 'CON NGƯỜI / HUMAN',
    description: 'Vận động viên parkour đường phố với áo hoodie đỏ-trắng năng động, mái tóc vuốt cá tính, găng tay thể thao và sneaker chạy bộ cao cấp.',
    colors: {
      primary: '#ef4444',
      secondary: '#ffffff',
      accent: '#0284c7',
      skin: '#ffdfba',
      hair: '#382216',
      eyes: '#2563eb',
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
    subtitle: 'Robot Hoạt Hình Ngộ Nghĩnh',
    category: 'cartoon',
    badge: 'HOẠT HÌNH / TOON BOT',
    description: 'Chú robot hoạt hình tròn trịa đáng yêu với màn hình mắt kỹ thuật số biểu cảm chớp nháy, ăng-ten lắc lư tinh nghịch và động cơ phản lực mini.',
    colors: {
      primary: '#eab308',
      secondary: '#0f172a',
      accent: '#38bdf8',
      skin: '#facc15',
      hair: '#0f172a',
      eyes: '#38bdf8',
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

  innerBodyGroup.add(torsoGroup);
  innerBodyGroup.add(headGroup);
  innerBodyGroup.add(leftArmGroup);
  innerBodyGroup.add(rightArmGroup);
  innerBodyGroup.add(leftLegGroup);
  innerBodyGroup.add(rightLegGroup);

  leftLegGroup.add(leftFootGroup);
  rightLegGroup.add(rightFootGroup);

  const secondaryNodes: CharacterRig['secondaryNodes'] = {};

  // Standard shared PBR materials builder
  const pbrMat = (color: string, roughness = 0.45, metalness = 0.1) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
    });

  const basicMat = (color: string) => new THREE.MeshBasicMaterial({ color });

  // 1. Build character specifics based on CharacterId
  if (characterId === 'kaito') {
    // ------------------------------------------------------------------------
    // KAITO: Athletic Human Street Parkour Runner
    // ------------------------------------------------------------------------
    const skinMat = pbrMat('#fed7aa', 0.65, 0.0);
    const hairMat = pbrMat('#2d1a0f', 0.8, 0.05);
    const hoodieRed = pbrMat('#dc2626', 0.5, 0.05);
    const hoodieWhite = pbrMat('#f8fafc', 0.4, 0.05);
    const pantsMat = pbrMat('#1e293b', 0.6, 0.1);
    const gloveMat = pbrMat('#0f172a', 0.35, 0.2);
    const shoeRedMat = pbrMat('#ef4444', 0.35, 0.15);
    const shoeWhiteMat = pbrMat('#ffffff', 0.25, 0.1);
    const eyeWhiteMat = basicMat('#ffffff');
    const eyeBlueMat = basicMat('#2563eb');
    const eyePupilMat = basicMat('#0f172a');
    const eyeGlintMat = basicMat('#ffffff');
    const capMat = pbrMat('#0f172a', 0.5, 0.1);

    // Torso: Athletic Hoodie
    const torsoGeo = new THREE.BoxGeometry(0.44, 0.62, 0.26);
    const torsoMesh = new THREE.Mesh(torsoGeo, hoodieRed);
    torsoMesh.position.y = 1.05;
    torsoMesh.castShadow = !isSoftwareGl;
    torsoGroup.add(torsoMesh);

    // White center zipper stripe & front pocket
    const zipperGeo = new THREE.BoxGeometry(0.04, 0.6, 0.02);
    const zipperMesh = new THREE.Mesh(zipperGeo, hoodieWhite);
    zipperMesh.position.set(0, 1.05, -0.132);
    torsoGroup.add(zipperMesh);

    const pocketGeo = new THREE.BoxGeometry(0.3, 0.2, 0.04);
    const pocketMesh = new THREE.Mesh(pocketGeo, hoodieRed);
    pocketMesh.position.set(0, 0.9, -0.135);
    torsoGroup.add(pocketMesh);

    // Folded hoodie collar & hood on back
    const hoodBackGeo = new THREE.BoxGeometry(0.32, 0.26, 0.14);
    const hoodBackMesh = new THREE.Mesh(hoodBackGeo, hoodieRed);
    hoodBackMesh.position.set(0, 1.25, 0.14);
    hoodBackMesh.rotation.x = -0.3;
    torsoGroup.add(hoodBackMesh);

    // Hoodie drawstrings that swing
    const cordGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.22, 6);
    const cordL = new THREE.Mesh(cordGeo, hoodieWhite);
    cordL.position.set(-0.09, 1.15, -0.14);
    const cordR = new THREE.Mesh(cordGeo, hoodieWhite);
    cordR.position.set(0.09, 1.15, -0.14);
    torsoGroup.add(cordL, cordR);
    secondaryNodes.hoodieCords = [cordL, cordR];

    // Head: Human stylized contours
    headGroup.position.set(0, 1.56, 0);

    const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.12, 8);
    const neckMesh = new THREE.Mesh(neckGeo, skinMat);
    neckMesh.position.y = -0.14;
    headGroup.add(neckMesh);

    const headGeo = new THREE.BoxGeometry(0.32, 0.33, 0.32);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.y = 0.06;
    headMesh.castShadow = !isSoftwareGl;
    headGroup.add(headMesh);

    // Human Anime Face: Big lively eyes
    const eyeWhiteGeo = new THREE.BoxGeometry(0.075, 0.09, 0.02);
    const eyeIrisGeo = new THREE.BoxGeometry(0.045, 0.06, 0.025);
    const eyePupilGeo = new THREE.BoxGeometry(0.025, 0.035, 0.03);
    const eyeGlintGeo = new THREE.BoxGeometry(0.018, 0.018, 0.035);

    // Left eye
    const eyeWhiteL = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    eyeWhiteL.position.set(-0.085, 0.06, -0.162);
    const eyeIrisL = new THREE.Mesh(eyeIrisGeo, eyeBlueMat);
    eyeIrisL.position.set(-0.085, 0.06, -0.164);
    const eyePupilL = new THREE.Mesh(eyePupilGeo, eyePupilMat);
    eyePupilL.position.set(-0.085, 0.06, -0.166);
    const eyeGlintL = new THREE.Mesh(eyeGlintGeo, eyeGlintMat);
    eyeGlintL.position.set(-0.095, 0.08, -0.168);
    headGroup.add(eyeWhiteL, eyeIrisL, eyePupilL, eyeGlintL);

    // Right eye
    const eyeWhiteR = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    eyeWhiteR.position.set(0.085, 0.06, -0.162);
    const eyeIrisR = new THREE.Mesh(eyeIrisGeo, eyeBlueMat);
    eyeIrisR.position.set(0.085, 0.06, -0.164);
    const eyePupilR = new THREE.Mesh(eyePupilGeo, eyePupilMat);
    eyePupilR.position.set(0.085, 0.06, -0.166);
    const eyeGlintR = new THREE.Mesh(eyeGlintGeo, eyeGlintMat);
    eyeGlintR.position.set(0.075, 0.08, -0.168);
    headGroup.add(eyeWhiteR, eyeIrisR, eyePupilR, eyeGlintR);

    secondaryNodes.eyeL = eyeWhiteL;
    secondaryNodes.eyeR = eyeWhiteR;

    // Eyebrows
    const browGeo = new THREE.BoxGeometry(0.08, 0.018, 0.02);
    const browL = new THREE.Mesh(browGeo, hairMat);
    browL.position.set(-0.085, 0.13, -0.162);
    browL.rotation.z = 0.08;
    const browR = new THREE.Mesh(browGeo, hairMat);
    browR.position.set(0.085, 0.13, -0.162);
    browR.rotation.z = -0.08;
    headGroup.add(browL, browR);

    // Stylized smile
    const smileGeo = new THREE.BoxGeometry(0.07, 0.018, 0.02);
    const smileMesh = new THREE.Mesh(smileGeo, basicMat('#be123c'));
    smileMesh.position.set(0, -0.05, -0.162);
    headGroup.add(smileMesh);

    // Human stylized ears
    const earGeo = new THREE.BoxGeometry(0.03, 0.08, 0.07);
    const earL = new THREE.Mesh(earGeo, skinMat);
    earL.position.set(-0.175, 0.06, 0);
    const earR = new THREE.Mesh(earGeo, skinMat);
    earR.position.set(0.175, 0.06, 0);
    headGroup.add(earL, earR);

    // Backward snapback cap & styled brown hair
    const capDomeGeo = new THREE.SphereGeometry(0.185, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2);
    const capDome = new THREE.Mesh(capDomeGeo, capMat);
    capDome.position.set(0, 0.13, 0.02);
    headGroup.add(capDome);

    // Cap backward brim / visor
    const brimGeo = new THREE.BoxGeometry(0.24, 0.02, 0.16);
    const brimMesh = new THREE.Mesh(brimGeo, capMat);
    brimMesh.position.set(0, 0.13, 0.22);
    brimMesh.rotation.x = 0.15;
    headGroup.add(brimMesh);

    // Front spiky hair tufts peeking out from cap
    const hairBangsGeo = new THREE.ConeGeometry(0.06, 0.14, 5);
    const bang1 = new THREE.Mesh(hairBangsGeo, hairMat);
    bang1.position.set(-0.08, 0.14, -0.16);
    bang1.rotation.set(-0.5, 0, -0.2);
    const bang2 = new THREE.Mesh(hairBangsGeo, hairMat);
    bang2.position.set(0.02, 0.15, -0.165);
    bang2.rotation.set(-0.4, 0, 0.15);
    const bang3 = new THREE.Mesh(hairBangsGeo, hairMat);
    bang3.position.set(0.09, 0.13, -0.155);
    bang3.rotation.set(-0.5, 0, 0.3);
    headGroup.add(bang1, bang2, bang3);

    // Arms & Gloved Hands
    leftArmGroup.position.set(-0.31, 1.34, 0);
    rightArmGroup.position.set(0.31, 1.34, 0);

    const shoulderGeo = new THREE.BoxGeometry(0.14, 0.18, 0.14);
    const sleeveGeo = new THREE.BoxGeometry(0.13, 0.22, 0.13);
    const forearmGeo = new THREE.BoxGeometry(0.11, 0.22, 0.11);
    const gloveGeo = new THREE.BoxGeometry(0.12, 0.15, 0.13);
    const thumbGeo = new THREE.BoxGeometry(0.04, 0.07, 0.05);

    // Left Arm parts
    const lShoulder = new THREE.Mesh(shoulderGeo, hoodieRed);
    lShoulder.position.y = -0.06;
    const lSleeve = new THREE.Mesh(sleeveGeo, hoodieWhite);
    lSleeve.position.y = -0.22;
    const lForearm = new THREE.Mesh(forearmGeo, skinMat);
    lForearm.position.y = -0.38;
    const lGlove = new THREE.Mesh(gloveGeo, gloveMat);
    lGlove.position.y = -0.52;
    const lThumb = new THREE.Mesh(thumbGeo, gloveMat);
    lThumb.position.set(0.06, -0.5, -0.04);
    leftArmGroup.add(lShoulder, lSleeve, lForearm, lGlove, lThumb);

    // Right Arm parts
    const rShoulder = new THREE.Mesh(shoulderGeo, hoodieRed);
    rShoulder.position.y = -0.06;
    const rSleeve = new THREE.Mesh(sleeveGeo, hoodieWhite);
    rSleeve.position.y = -0.22;
    const rForearm = new THREE.Mesh(forearmGeo, skinMat);
    rForearm.position.y = -0.38;
    const rGlove = new THREE.Mesh(gloveGeo, gloveMat);
    rGlove.position.y = -0.52;
    const rThumb = new THREE.Mesh(thumbGeo, gloveMat);
    rThumb.position.set(-0.06, -0.5, -0.04);
    rightArmGroup.add(rShoulder, rSleeve, rForearm, rGlove, rThumb);

    // Legs: Joggers & Chunky Sneakers
    leftLegGroup.position.set(-0.15, 0.74, 0);
    rightLegGroup.position.set(0.15, 0.74, 0);

    const thighGeo = new THREE.BoxGeometry(0.16, 0.34, 0.16);
    const calfGeo = new THREE.BoxGeometry(0.14, 0.32, 0.14);
    const cuffGeo = new THREE.BoxGeometry(0.15, 0.08, 0.15);

    const lThigh = new THREE.Mesh(thighGeo, pantsMat);
    lThigh.position.y = -0.15;
    const lCalf = new THREE.Mesh(calfGeo, pantsMat);
    lCalf.position.y = -0.42;
    const lCuff = new THREE.Mesh(cuffGeo, pbrMat('#0f172a', 0.5, 0.1));
    lCuff.position.y = -0.58;
    leftLegGroup.add(lThigh, lCalf, lCuff);

    const rThigh = new THREE.Mesh(thighGeo, pantsMat);
    rThigh.position.y = -0.15;
    const rCalf = new THREE.Mesh(calfGeo, pantsMat);
    rCalf.position.y = -0.42;
    const rCuff = new THREE.Mesh(cuffGeo, pbrMat('#0f172a', 0.5, 0.1));
    rCuff.position.y = -0.58;
    rightLegGroup.add(rThigh, rCalf, rCuff);

    // Sneakers: Detailed sports kicks
    const shoeBodyGeo = new THREE.BoxGeometry(0.16, 0.13, 0.28);
    const shoeSoleGeo = new THREE.BoxGeometry(0.17, 0.05, 0.3);
    const shoeToeGeo = new THREE.BoxGeometry(0.16, 0.08, 0.1);
    const airBubbleGeo = new THREE.BoxGeometry(0.14, 0.025, 0.14);
    const airBubbleMat = basicMat('#38bdf8');

    // Left shoe
    leftFootGroup.position.set(0, -0.66, -0.04);
    const lShoeBody = new THREE.Mesh(shoeBodyGeo, shoeRedMat);
    const lShoeSole = new THREE.Mesh(shoeSoleGeo, shoeWhiteMat);
    lShoeSole.position.y = -0.07;
    const lShoeToe = new THREE.Mesh(shoeToeGeo, shoeWhiteMat);
    lShoeToe.position.set(0, -0.03, -0.11);
    const lAirBubble = new THREE.Mesh(airBubbleGeo, airBubbleMat);
    lAirBubble.position.set(0, -0.05, 0.05);
    leftFootGroup.add(lShoeBody, lShoeSole, lShoeToe, lAirBubble);

    // Right shoe
    rightFootGroup.position.set(0, -0.66, -0.04);
    const rShoeBody = new THREE.Mesh(shoeBodyGeo, shoeRedMat);
    const rShoeSole = new THREE.Mesh(shoeSoleGeo, shoeWhiteMat);
    rShoeSole.position.y = -0.07;
    const rShoeToe = new THREE.Mesh(shoeToeGeo, shoeWhiteMat);
    rShoeToe.position.set(0, -0.03, -0.11);
    const rAirBubble = new THREE.Mesh(airBubbleGeo, airBubbleMat);
    rAirBubble.position.set(0, -0.05, 0.05);
    rightFootGroup.add(rShoeBody, rShoeSole, rShoeToe, rAirBubble);
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
    const botYellowMat = pbrMat('#facc15', 0.35, 0.2);
    const botDarkMat = pbrMat('#1e293b', 0.5, 0.4);
    const eyeLedMat = basicMat('#38bdf8');
    const heartLedMat = basicMat('#ef4444');
    const flameMat = basicMat('#f97316');

    // Torso: Rounded Cartoon Robot Chassis
    const torsoGeo = new THREE.BoxGeometry(0.48, 0.56, 0.3);
    const torsoMesh = new THREE.Mesh(torsoGeo, botYellowMat);
    torsoMesh.position.y = 1.05;
    torsoGroup.add(torsoMesh);

    // Glowing Heart / Power Meter Screen on chest
    const screenGeo = new THREE.BoxGeometry(0.24, 0.2, 0.03);
    const screenMesh = new THREE.Mesh(screenGeo, botDarkMat);
    screenMesh.position.set(0, 1.1, -0.152);
    const heartGeo = new THREE.OctahedronGeometry(0.06, 0);
    const heartMesh = new THREE.Mesh(heartGeo, heartLedMat);
    heartMesh.position.set(0, 1.1, -0.168);
    torsoGroup.add(screenMesh, heartMesh);

    // Twin Jet Thrusters on back
    const jetPackGeo = new THREE.BoxGeometry(0.34, 0.36, 0.14);
    const jetPack = new THREE.Mesh(jetPackGeo, botDarkMat);
    jetPack.position.set(0, 1.05, 0.2);
    torsoGroup.add(jetPack);

    const nozzleGeo = new THREE.CylinderGeometry(0.05, 0.07, 0.12, 8);
    const nozL = new THREE.Mesh(nozzleGeo, botDarkMat);
    nozL.position.set(-0.1, 0.82, 0.2);
    const nozR = new THREE.Mesh(nozzleGeo, botDarkMat);
    nozR.position.set(0.1, 0.82, 0.2);
    torsoGroup.add(nozL, nozR);

    // Thruster flame jets
    const flameGeo = new THREE.ConeGeometry(0.06, 0.24, 6);
    const flameL = new THREE.Mesh(flameGeo, flameMat);
    flameL.position.set(-0.1, 0.68, 0.2);
    flameL.rotation.x = Math.PI;
    flameL.visible = false;
    const flameR = new THREE.Mesh(flameGeo, flameMat);
    flameR.position.set(0.1, 0.68, 0.2);
    flameR.rotation.x = Math.PI;
    flameR.visible = false;
    torsoGroup.add(flameL, flameR);
    secondaryNodes.jetFlames = [flameL, flameR];

    // Head: Rounded Box Screen Head with Big Expressive LED Eyes
    headGroup.position.set(0, 1.54, 0);

    const headGeo = new THREE.BoxGeometry(0.4, 0.36, 0.36);
    const headMesh = new THREE.Mesh(headGeo, botYellowMat);
    headMesh.position.y = 0.05;
    headGroup.add(headMesh);

    // Black Digital Faceplate Glass
    const faceplateGeo = new THREE.BoxGeometry(0.34, 0.24, 0.03);
    const faceplate = new THREE.Mesh(faceplateGeo, botDarkMat);
    faceplate.position.set(0, 0.05, -0.182);
    headGroup.add(faceplate);

    // Big Glowing Digital Emoji Eyes: Curved arch or circular LED dots
    const ledEyeGeo = new THREE.TorusGeometry(0.045, 0.015, 8, 12, Math.PI);
    const ledEyeL = new THREE.Mesh(ledEyeGeo, eyeLedMat);
    ledEyeL.position.set(-0.08, 0.06, -0.198);
    ledEyeL.rotation.z = Math.PI; // Happy curved eye `^`
    const ledEyeR = new THREE.Mesh(ledEyeGeo, eyeLedMat);
    ledEyeR.position.set(0.08, 0.06, -0.198);
    ledEyeR.rotation.z = Math.PI;
    headGroup.add(ledEyeL, ledEyeR);

    secondaryNodes.eyeL = ledEyeL;
    secondaryNodes.eyeR = ledEyeR;

    // Bouncy Antenna on top with glowing sphere bobble
    const antennaGroup = new THREE.Group();
    antennaGroup.position.set(0, 0.23, 0);

    const mastGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.2, 6);
    const mast = new THREE.Mesh(mastGeo, botDarkMat);
    mast.position.y = 0.1;
    const bobbleGeo = new THREE.SphereGeometry(0.055, 8, 8);
    const bobble = new THREE.Mesh(bobbleGeo, eyeLedMat);
    bobble.position.y = 0.23;
    antennaGroup.add(mast, bobble);
    headGroup.add(antennaGroup);
    secondaryNodes.antennaGroup = antennaGroup;

    // Limbs: Cute segmented robot arms
    leftArmGroup.position.set(-0.32, 1.32, 0);
    rightArmGroup.position.set(0.32, 1.32, 0);

    const bArmGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.44, 8);
    const clawGeo = new THREE.BoxGeometry(0.12, 0.1, 0.12);

    const lArm = new THREE.Mesh(bArmGeo, botDarkMat);
    lArm.position.y = -0.22;
    const lClaw = new THREE.Mesh(clawGeo, botYellowMat);
    lClaw.position.y = -0.48;
    leftArmGroup.add(lArm, lClaw);

    const rArm = new THREE.Mesh(bArmGeo, botDarkMat);
    rArm.position.y = -0.22;
    const rClaw = new THREE.Mesh(clawGeo, botYellowMat);
    rClaw.position.y = -0.48;
    rightArmGroup.add(rArm, rClaw);

    // Legs: Chunky cute robotic legs
    leftLegGroup.position.set(-0.16, 0.74, 0);
    rightLegGroup.position.set(0.16, 0.74, 0);

    const bLegGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.48, 8);
    const bFootGeo = new THREE.BoxGeometry(0.17, 0.14, 0.28);

    const lLeg = new THREE.Mesh(bLegGeo, botDarkMat);
    lLeg.position.y = -0.24;
    leftLegGroup.add(lLeg);

    const rLeg = new THREE.Mesh(bLegGeo, botDarkMat);
    rLeg.position.y = -0.24;
    rightLegGroup.add(rLeg);

    leftFootGroup.position.set(0, -0.64, -0.04);
    const lFoot = new THREE.Mesh(bFootGeo, botYellowMat);
    leftFootGroup.add(lFoot);

    rightFootGroup.position.set(0, -0.64, -0.04);
    const rFoot = new THREE.Mesh(bFootGeo, botYellowMat);
    rightFootGroup.add(rFoot);
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
  arrowShape.moveTo(0, -0.9);
  arrowShape.lineTo(0.2, -0.55);
  arrowShape.lineTo(0.08, -0.55);
  arrowShape.lineTo(0.08, 0);
  arrowShape.lineTo(-0.08, 0);
  arrowShape.lineTo(-0.08, -0.55);
  arrowShape.lineTo(-0.2, -0.55);
  arrowShape.closePath();

  const arrowGeo = new THREE.ShapeGeometry(arrowShape);
  const arrowMat = new THREE.MeshBasicMaterial({
    color: '#06b6d4',
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  });
  const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
  arrowMesh.rotation.x = -Math.PI / 2;
  arrowMesh.position.y = 0.03;
  rootGroup.add(arrowMesh);

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
    } else {
      rig.doubleJumpFlipProgress = 0;
      // Normal jump / airborne glide
      rig.innerBodyGroup.rotation.x = THREE.MathUtils.damp(rig.innerBodyGroup.rotation.x, 0.16, 10, dt);
      rig.leftArmGroup.rotation.x = -0.55;
      rig.rightArmGroup.rotation.x = -0.55;
      rig.leftLegGroup.rotation.x = -0.35;
      rig.rightLegGroup.rotation.x = 0.25;
    }
  }
  // 3. Ground Locomotion (Walk / Sprint / Idle)
  else {
    rig.doubleJumpFlipProgress = 0;

    // Torso bounce & forward lean proportional to velocity
    const torsoBounce = isMoving ? Math.abs(Math.sin(time * runFreq)) * 0.06 : 0;
    rig.innerBodyGroup.position.y = THREE.MathUtils.damp(rig.innerBodyGroup.position.y, torsoBounce, 15, dt);
    const forwardLean = isMoving ? Math.min(0.28, 0.08 + player.speed * 0.012) : 0;
    rig.innerBodyGroup.rotation.x = THREE.MathUtils.damp(rig.innerBodyGroup.rotation.x, forwardLean, 10, dt);

    // Humanoid / cartoon arm and leg swings with natural phase opposition
    const armSwing = isMoving ? Math.sin(time * runFreq) * 0.85 : 0;
    const legSwing = isMoving ? Math.sin(time * runFreq) * 0.95 : 0;

    rig.leftArmGroup.rotation.x = armSwing;
    rig.rightArmGroup.rotation.x = -armSwing;
    rig.leftLegGroup.rotation.x = -legSwing;
    rig.rightLegGroup.rotation.x = legSwing;

    // Subtle head bob
    const headBob = isMoving ? Math.sin(time * runFreq * 2) * 0.04 : Math.sin(time * 2) * 0.02;
    rig.headGroup.rotation.x = headBob;
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
