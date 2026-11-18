import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Flame, Trophy, Clock, Settings, Calculator, Delete, 
  RotateCcw, CheckCircle2, AlertCircle, BookOpen, Award, 
  ArrowLeftRight, HelpCircle, Sparkles, ChevronRight, Volume2, VolumeX
} from 'lucide-react';

// ==========================================
// 1. DESIGN DES JETONS "MONTE-CARLO" (SVG)
// ==========================================
const CHIP_SPECS = {
  1: {
    base: '#1259a8',
    insertOuter: '#f2f0e6',
    insertInner: '#2d8280',
    ringColor: '#f2f0e6',
    birdColor: '#f2f0e6',
    label: '1',
    name: '1 €'
  },
  5: {
    base: '#d9c293',
    insertOuter: '#181818',
    insertInner: '#7aa832',
    ringColor: '#181818',
    birdColor: '#181818',
    label: '5',
    name: '5 €'
  },
  25: {
    base: '#161616',
    insertOuter: '#f4f1ea',
    insertInner: '#c42f2b',
    ringColor: '#f4f1ea',
    birdColor: '#f4f1ea',
    label: '25',
    name: '25 €'
  },
  100: {
    base: '#68243c',
    insertOuter: '#1a1a1a',
    insertInner: '#ebB434',
    ringColor: '#1a1a1a',
    birdColor: '#1a1a1a',
    label: '100',
    name: '100 €'
  },
  500: {
    base: '#a36675',
    insertOuter: '#b8252b',
    insertInner: '#f3b792',
    ringColor: '#b8252b',
    birdColor: '#b8252b',
    label: '500',
    name: '500 €'
  }
};

// Composant SVG haute-fidélité des jetons Monte-Carlo
const MonteCarloChip = ({ denom, size = 46, className = '', showText = true }) => {
  const spec = CHIP_SPECS[denom] || CHIP_SPECS[25];
  const uniqueId = `chip-${denom}-${Math.random().toString(36).substr(2, 5)}`;

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={`select-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)] ${className}`}
    >
      <defs>
        <radialGradient id={`metal-${uniqueId}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#d8d6d0" />
          <stop offset="85%" stopColor="#9e9c96" />
          <stop offset="100%" stopColor="#bdbbb5" />
        </radialGradient>
        <clipPath id={`outerClip-${uniqueId}`}>
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>

      {/* Ombre / Tranche 3D du jeton */}
      <circle cx="50" cy="53" r="48" fill="#090d0b" />
      <circle cx="50" cy="51.5" r="48" fill={spec.base} filter="brightness(0.65)" />

      {/* Corps principal avec encoches */}
      <g clipPath={`url(#outerClip-${uniqueId})`}>
        <circle cx="50" cy="50" r="48" fill={spec.base} />

        {/* 3 Inserts bicolores à 30°, 150°, 270° */}
        {[30, 150, 270].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 50 50)`}>
            <polygon points="33,0 67,0 62,21 38,21" fill={spec.insertOuter} />
            <rect x="44.5" y="0" width="11" height="21" fill={spec.insertInner} />
          </g>
        ))}

        {/* 3 Silhouettes d'oiseaux / mouettes Monte-Carlo à 90°, 210°, 330° */}
        {[90, 210, 330].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 50 50)`}>
            <path 
              d="M50,6 C46,6 43,9 41,12 C45,11 48,11 49,14 L49,17 L51,17 L51,14 C52,11 55,11 59,12 C57,9 54,6 50,6 Z" 
              fill={spec.birdColor} 
            />
          </g>
        ))}
      </g>

      {/* Anneau de séparation avec 3 petits crans */}
      <circle cx="50" cy="50" r="32" fill="none" stroke={spec.ringColor} strokeWidth="4.5" />
      {[90, 210, 330].map((angle) => (
        <g key={`notch-${angle}`} transform={`rotate(${angle} 50 50)`}>
          <rect x="46.5" y="15.5" width="7" height="4" rx="1" fill={spec.ringColor} />
        </g>
      ))}

      {/* Coeur métallique argenté/nacre */}
      <circle cx="50" cy="50" r="29" fill={`url(#metal-${uniqueId})`} stroke="#222" strokeWidth="0.7" />
      <circle cx="50" cy="50" r="24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeDasharray="5 3" />

      {/* Textes micro-imprimés */}
      {showText && size >= 30 && (
        <>
          <text 
            x="50" 
            y="30.5" 
            textAnchor="middle" 
            fill="#181818" 
            fontSize="6.2" 
            fontWeight="900" 
            letterSpacing="0.3"
            fontFamily="Inter, system-ui, sans-serif"
          >
            JEUX AMERICAINS
          </text>
          <text 
            x="50" 
            y="73.5" 
            textAnchor="middle" 
            fill="#181818" 
            fontSize="6.2" 
            fontWeight="900" 
            letterSpacing="0.4"
            fontFamily="Inter, system-ui, sans-serif"
          >
            MONTE-CARLO
          </text>
        </>
      )}

      {/* Valeur faciale dorée */}
      <text
        x="50"
        y={denom >= 100 ? "57" : "58.5"}
        textAnchor="middle"
        fill="#b89947"
        stroke="#151515"
        strokeWidth="1.8"
        paintOrder="stroke"
        fontSize={denom >= 100 ? "23" : "27"}
        fontWeight="900"
        fontFamily="Georgia, serif"
      >
        {spec.label}
      </text>
    </svg>
  );
};

// Bouton Demi-Jeton pour la barre de saisie rapide (+1, +5, +25, +100, +500)
const HalfChipButton = ({ denom, onClick }) => {
  const spec = CHIP_SPECS[denom];
  return (
    <button
      onClick={() => onClick(denom)}
      className="relative flex-1 h-9 rounded-xl overflow-hidden border border-[#2a4d3b] bg-[#0b2418] active:scale-95 transition-transform shadow-md group"
    >
      <svg viewBox="0 0 100 50" className="w-full h-full">
        <path d="M 4 48 A 46 42 0 0 1 96 48 Z" fill={spec.base} stroke={spec.ringColor} strokeWidth="2.5" />
        <polygon points="15,14 27,7 33,20 21,25" fill={spec.insertOuter} />
        <polygon points="85,14 73,7 67,20 79,25" fill={spec.insertOuter} />
        <rect x="44" y="2" width="12" height="12" fill={spec.insertInner} />
        <rect x="14" y="16" width="72" height="26" rx="13" fill="#c7cbc8" stroke="#1b1b1b" strokeWidth="2" />
        <text
          x="50"
          y="34"
          textAnchor="middle"
          fill="#0c1c14"
          fontSize="16"
          fontWeight="900"
          fontFamily="Inter, sans-serif"
        >
          +{denom}
        </text>
      </svg>
    </button>
  );
};

// ==========================================
// 2. LOGIQUE METIER CRAPS & JETONS (MAX 2 COULEURS)
// ==========================================
const DENOMS = [500, 100, 25, 5, 1];

function getChipBreakdown(amount) {
  let rem = amount;
  const breakdown = [];
  for (const d of DENOMS) {
    if (rem >= d) {
      const count = Math.floor(rem / d);
      breakdown.push({ denom: d, count });
      rem %= d;
    }
  }
  return breakdown;
}

function isPayableInMaxTwoColors(amount) {
  if (amount <= 0 || !Number.isInteger(amount)) return false;
  const breakdown = getChipBreakdown(amount);
  return breakdown.length <= 2;
}

// Pile physique ordonnée du plus grand (en bas, index 0) au plus petit (en haut, dernier index)
function buildVisualStack(amount, maxChipsPerDenom = 3) {
  const breakdown = getChipBreakdown(amount);
  const visual = [];
  breakdown.forEach(({ denom, count }) => {
    const capped = Math.min(count, maxChipsPerDenom);
    for (let i = 0; i < capped; i++) {
      visual.push(denom);
    }
  });
  return visual;
}

// Calculs officiels des paiements de base
function calculatePointPayout(point, type, bet, odds = 0) {
  if (type === 'PLACE') {
    if (point === 4 || point === 10) return (bet * 9) / 5;
    if (point === 5 || point === 9) return (bet * 7) / 5;
    if (point === 6 || point === 8) return (bet * 7) / 6;
  }
  if (type === 'COME') {
    const flatWin = bet;
    let oddsWin = 0;
    if (point === 4 || point === 10) oddsWin = odds * 2;
    if (point === 5 || point === 9) oddsWin = (odds * 3) / 2;
    if (point === 6 || point === 8) oddsWin = (odds * 6) / 5;
    return flatWin + oddsWin;
  }
  return 0;
}

function getMaxOddsMultiplier(point) {
  if (point === 4 || point === 10) return 3;
  if (point === 5 || point === 9) return 4;
  if (point === 6 || point === 8) return 5;
  return 3;
}

// Trajectoire en boucle (Fer à cheval Monte-Carlo)
function getLoopPathScore(betItem, stickmanSide) {
  const categoryOffset = betItem.type === 'COME' ? 0 : 100;
  if (stickmanSide === 'RIGHT') {
    const stepInLoop = betItem.sideGroup === 'TOP' ? (3 - betItem.col) : (4 + betItem.col);
    return categoryOffset + stepInLoop;
  } else {
    const stepInLoop = betItem.sideGroup === 'TOP' ? betItem.col : (4 + (3 - betItem.col));
    return categoryOffset + stepInLoop;
  }
}

// Banques de mises Module 1
const VALID_PLACE_BETS = { 4: [], 5: [], 6: [], 8: [], 9: [], 10: [] };
const VALID_COME_BETS = { 4: [], 5: [], 6: [], 8: [], 9: [], 10: [] };

[4, 5, 6, 8, 9, 10].forEach((pt) => {
  const step = (pt === 6 || pt === 8) ? 6 : 5;
  for (let b = 10; b <= 500; b += 1) {
    if (b % step !== 0) continue;
    const pWin = calculatePointPayout(pt, 'PLACE', b);
    if (Number.isInteger(pWin) && isPayableInMaxTwoColors(pWin)) {
      if (isPayableInMaxTwoColors(b)) {
        VALID_PLACE_BETS[pt].push({ bet: b, payout: pWin });
      }
    }
  }

  const maxMult = getMaxOddsMultiplier(pt);
  const flatCandidates = [10, 15, 20, 25, 30, 50, 75, 100, 150, 200];
  flatCandidates.forEach((flat) => {
    const maxAllowedOdds = Math.min(500, flat * maxMult);
    for (let odds = 10; odds <= maxAllowedOdds; odds += 5) {
      if ((pt === 5 || pt === 9) && odds % 10 !== 0) continue;
      if ((pt === 6 || pt === 8) && odds % 5 !== 0) continue;
      if (!isPayableInMaxTwoColors(odds)) continue;
      const totalWin = calculatePointPayout(pt, 'COME', flat, odds);
      if (Number.isInteger(totalWin) && isPayableInMaxTwoColors(totalWin)) {
        VALID_COME_BETS[pt].push({ bet: flat, odds, payout: totalWin });
      }
    }
  });
});

// ==========================================
// 2B. MODULE 2 : SYSTÈME DE PAIEMENT GLOBAL MULTI-MISES ("STILL UP")
// ==========================================
// RÈGLE OFFICIELLE MONTE-CARLO DU PAIEMENT GLOBAL "STILL UP" :
// 1. Toutes les mises visibles sur le tapis (gagnantes comme perdantes sur ce coup) sont prises en compte
//    car le client laisse l'intégralité de ses jeux en place ("Still Up").
// 2. Formule universelle :
//      PAIEMENT GLOBAL STILL UP = (Somme des Gains Bruts "FOR 1" des paris touchés) - (Somme de TOUTES les mises affichées sur le tapis)
//    Ce qui équivaut aussi à :
//      (Somme des gains Still Up des mises gagnantes) - (Somme des mises non touchées qu'il faut reconstruire pour les laisser Still Up).
// 3. Les Hardways restent affichés sur le feutre pour le repère visuel mais ne reçoivent jamais de mises dans ce module.

const PROP_BET_SPOTS = {
  SEVEN_BOX: {
    id: 'SEVEN_BOX',
    shortName: 'Seven',
    fullName: 'Seven (5 FOR 1)',
    divisor: 1,
    minBet: 2,
    allowedBets: [2, 3, 4, 5, 10, 15, 20, 25, 50],
    getGrossWinMultiplier: (rollTotal) => (rollTotal === 7 ? 5 : 0),
    getGrossFormula: (bet, unit) => `Seven ${bet}€ (Brut ${unit}€×5 = ${unit * 5}€)`
  },
  ANY_CRAPS_BOX: {
    id: 'ANY_CRAPS_BOX',
    shortName: 'Any Craps',
    fullName: 'Any Craps (8 FOR 1)',
    divisor: 1,
    minBet: 2,
    allowedBets: [2, 3, 4, 5, 10, 15, 20, 25, 50],
    getGrossWinMultiplier: (rollTotal) => ([2, 3, 12].includes(rollTotal) ? 8 : 0),
    getGrossFormula: (bet, unit) => `Any Craps ${bet}€ (Brut ${unit}€×8 = ${unit * 8}€)`
  },
  HORN_3_BOX: {
    id: 'HORN_3_BOX',
    shortName: 'Plein 3',
    fullName: 'Ace-Deuce 3 (15 FOR 1)',
    divisor: 1,
    minBet: 2,
    allowedBets: [2, 3, 4, 5, 10, 15, 20, 25],
    getGrossWinMultiplier: (rollTotal) => (rollTotal === 3 ? 15 : 0),
    getGrossFormula: (bet, unit) => `Plein 3 ${bet}€ (Brut ${unit}€×15 = ${unit * 15}€)`
  },
  HORN_2_BOX: {
    id: 'HORN_2_BOX',
    shortName: 'Plein 2',
    fullName: 'Aces 2 (30 FOR 1)',
    divisor: 1,
    minBet: 2,
    allowedBets: [2, 3, 4, 5, 10, 15, 20, 25],
    getGrossWinMultiplier: (rollTotal) => (rollTotal === 2 ? 30 : 0),
    getGrossFormula: (bet, unit) => `Plein 2 ${bet}€ (Brut ${unit}€×30 = ${unit * 30}€)`
  },
  HORN_12_BOX: {
    id: 'HORN_12_BOX',
    shortName: 'Plein 12',
    fullName: 'Boxcars 12 (30 FOR 1)',
    divisor: 1,
    minBet: 2,
    allowedBets: [2, 3, 4, 5, 10, 15, 20, 25],
    getGrossWinMultiplier: (rollTotal) => (rollTotal === 12 ? 30 : 0),
    getGrossFormula: (bet, unit) => `Plein 12 ${bet}€ (Brut ${unit}€×30 = ${unit * 30}€)`
  },
  HORN_11L_BOX: {
    id: 'HORN_11L_BOX',
    shortName: 'Plein 11',
    fullName: 'Eleven 11 (15 FOR 1)',
    divisor: 1,
    minBet: 2,
    allowedBets: [2, 3, 4, 5, 10, 15, 20, 25],
    getGrossWinMultiplier: (rollTotal) => (rollTotal === 11 ? 15 : 0),
    getGrossFormula: (bet, unit) => `Plein 11 ${bet}€ (Brut ${unit}€×15 = ${unit * 15}€)`
  },
  GREEN_SEVEN_ELEVEN: {
    id: 'GREEN_SEVEN_ELEVEN',
    shortName: '7-11',
    fullName: 'Seven-Eleven (÷2, min 4€)',
    divisor: 2,
    minBet: 4,
    allowedBets: [4, 6, 8, 10, 20, 30, 40, 50],
    getGrossWinMultiplier: (rollTotal) => {
      if (rollTotal === 7) return 5;
      if (rollTotal === 11) return 15;
      return 0;
    },
    getGrossFormula: (bet, unit, rollTotal) =>
      `7-11 ${bet}€ [U=${unit}€×${rollTotal === 7 ? 5 : 15} = ${unit * (rollTotal === 7 ? 5 : 15)}€ brut]`
  },
  PURPLE_CE: {
    id: 'PURPLE_CE',
    shortName: 'C & E',
    fullName: 'C & E (÷2, min 4€)',
    divisor: 2,
    minBet: 4,
    allowedBets: [4, 6, 8, 10, 20, 30, 40, 50],
    getGrossWinMultiplier: (rollTotal) => {
      if ([2, 3, 12].includes(rollTotal)) return 8;
      if (rollTotal === 11) return 15;
      return 0;
    },
    getGrossFormula: (bet, unit, rollTotal) =>
      `C&E ${bet}€ [U=${unit}€×${rollTotal === 11 ? 15 : 8} = ${unit * (rollTotal === 11 ? 15 : 8)}€ brut]`
  },
  YELLOW_3WAY: {
    id: 'YELLOW_3WAY',
    shortName: '3-Way',
    fullName: '3-Way Craps (÷3, min 6€)',
    divisor: 3,
    minBet: 6,
    allowedBets: [6, 9, 12, 15, 30, 45, 60, 75],
    getGrossWinMultiplier: (rollTotal) => {
      if (rollTotal === 3) return 15;
      if (rollTotal === 2 || rollTotal === 12) return 30;
      return 0;
    },
    getGrossFormula: (bet, unit, rollTotal) =>
      `3-Way ${bet}€ [U=${unit}€×${rollTotal === 3 ? 15 : 30} = ${unit * (rollTotal === 3 ? 15 : 30)}€ brut]`
  },
  BET_THE_HORN_BOX: {
    id: 'BET_THE_HORN_BOX',
    shortName: 'Bet Horn',
    fullName: 'Bet The Horn (÷4, min 8€)',
    divisor: 4,
    minBet: 8,
    allowedBets: [8, 12, 16, 20, 40, 60, 80, 100],
    getGrossWinMultiplier: (rollTotal) => {
      if (rollTotal === 3 || rollTotal === 11) return 15;
      if (rollTotal === 2 || rollTotal === 12) return 30;
      return 0;
    },
    getGrossFormula: (bet, unit, rollTotal) =>
      `Bet Horn ${bet}€ [U=${unit}€×${rollTotal === 3 || rollTotal === 11 ? 15 : 30} = ${unit * (rollTotal === 3 || rollTotal === 11 ? 15 : 30)}€ brut]`
  },
  RED_HH_LEFT: {
    id: 'RED_HH_LEFT',
    shortName: 'Horn High 3',
    fullName: 'Horn High 3 (÷5, min 10€)',
    divisor: 5,
    minBet: 10,
    allowedBets: [10, 15, 20, 25, 50, 75, 100],
    getGrossWinMultiplier: (rollTotal) => {
      if (rollTotal === 3) return 30; // 2 unités sur le 3 × 15 FOR 1 = 30×U brut
      if (rollTotal === 2 || rollTotal === 12) return 30; // 1 unité × 30 FOR 1 = 30×U brut
      if (rollTotal === 11) return 15; // 1 unité × 15 FOR 1 = 15×U brut
      return 0;
    },
    getGrossFormula: (bet, unit, rollTotal) => {
      const m = rollTotal === 11 ? 15 : 30;
      return `HH3 ${bet}€ [U=${unit}€×${m} = ${unit * m}€ brut]`;
    }
  },
  RED_HH_RIGHT: {
    id: 'RED_HH_RIGHT',
    shortName: 'Horn High 12',
    fullName: 'Horn High 12 (÷5, min 10€)',
    divisor: 5,
    minBet: 10,
    allowedBets: [10, 15, 20, 25, 50, 75, 100],
    getGrossWinMultiplier: (rollTotal) => {
      if (rollTotal === 12) return 60; // 2 unités sur le 12 × 30 FOR 1 = 60×U brut
      if (rollTotal === 2) return 30;  // 1 unité sur le 2 × 30 FOR 1 = 30×U brut
      if (rollTotal === 3 || rollTotal === 11) return 15; // 1 unité × 15 FOR 1 = 15×U brut
      return 0;
    },
    getGrossFormula: (bet, unit, rollTotal) => {
      const m = rollTotal === 12 ? 60 : rollTotal === 2 ? 30 : 15;
      return `HH12 ${bet}€ [U=${unit}€×${m} = ${unit * m}€ brut]`;
    }
  },
  BLUE_SPLIT_3_2: {
    id: 'BLUE_SPLIT_3_2',
    shortName: 'Split 3-2',
    fullName: 'À cheval 3 & 2 (÷2, min 4€)',
    divisor: 2,
    minBet: 4,
    allowedBets: [4, 6, 8, 10, 20, 30, 40, 50],
    getGrossWinMultiplier: (rollTotal) => {
      if (rollTotal === 3) return 15;
      if (rollTotal === 2) return 30;
      return 0;
    },
    getGrossFormula: (bet, unit, rollTotal) =>
      `Split 3-2 ${bet}€ [U=${unit}€×${rollTotal === 3 ? 15 : 30} = ${unit * (rollTotal === 3 ? 15 : 30)}€ brut]`
  },
  BLUE_SPLIT_2_12: {
    id: 'BLUE_SPLIT_2_12',
    shortName: 'Split 2-12',
    fullName: 'À cheval 2 & 12 (÷2, min 4€)',
    divisor: 2,
    minBet: 4,
    allowedBets: [4, 6, 8, 10, 20, 30, 40, 50],
    getGrossWinMultiplier: (rollTotal) => {
      if (rollTotal === 2 || rollTotal === 12) return 30;
      return 0;
    },
    getGrossFormula: (bet, unit) => `Split 2-12 ${bet}€ [U=${unit}€×30 = ${unit * 30}€ brut]`
  },
  BLUE_SPLIT_3_11: {
    id: 'BLUE_SPLIT_3_11',
    shortName: 'Split 3-11',
    fullName: 'À cheval 3 & 11 (÷2, min 4€)',
    divisor: 2,
    minBet: 4,
    allowedBets: [4, 6, 8, 10, 20, 30, 40, 50],
    getGrossWinMultiplier: (rollTotal) => {
      if (rollTotal === 3 || rollTotal === 11) return 15;
      return 0;
    },
    getGrossFormula: (bet, unit) => `Split 3-11 ${bet}€ [U=${unit}€×15 = ${unit * 15}€ brut]`
  },
  BLUE_SPLIT_12_11: {
    id: 'BLUE_SPLIT_12_11',
    shortName: 'Split 12-11',
    fullName: 'À cheval 12 & 11 (÷2, min 4€)',
    divisor: 2,
    minBet: 4,
    allowedBets: [4, 6, 8, 10, 20, 30, 40, 50],
    getGrossWinMultiplier: (rollTotal) => {
      if (rollTotal === 12) return 30;
      if (rollTotal === 11) return 15;
      return 0;
    },
    getGrossFormula: (bet, unit, rollTotal) =>
      `Split 12-11 ${bet}€ [U=${unit}€×${rollTotal === 12 ? 30 : 15} = ${unit * (rollTotal === 12 ? 30 : 15)}€ brut]`
  }
};

// Lancers du Tableau du Milieu (Hardways exclus des paiements et des tirages)
const STICK_ROLL_TEMPLATES = [
  {
    rollTotal: 11,
    rollName: 'Eleven (11)',
    diceOptions: [[5, 6], [6, 5]],
    winningSpots: [
      'PURPLE_CE',
      'BLUE_SPLIT_12_11',
      'BLUE_SPLIT_3_11',
      'HORN_11L_BOX',
      'BET_THE_HORN_BOX',
      'RED_HH_LEFT',
      'RED_HH_RIGHT',
      'GREEN_SEVEN_ELEVEN'
    ]
  },
  {
    rollTotal: 3,
    rollName: '3 Craps (Ace-Deuce)',
    diceOptions: [[1, 2], [2, 1]],
    winningSpots: [
      'YELLOW_3WAY',
      'PURPLE_CE',
      'ANY_CRAPS_BOX',
      'HORN_3_BOX',
      'BLUE_SPLIT_3_2',
      'BLUE_SPLIT_3_11',
      'BET_THE_HORN_BOX',
      'RED_HH_LEFT',
      'RED_HH_RIGHT'
    ]
  },
  {
    rollTotal: 2,
    rollName: '2 Craps (Aces)',
    diceOptions: [[1, 1]],
    winningSpots: [
      'YELLOW_3WAY',
      'PURPLE_CE',
      'ANY_CRAPS_BOX',
      'HORN_2_BOX',
      'BLUE_SPLIT_3_2',
      'BLUE_SPLIT_2_12',
      'BET_THE_HORN_BOX',
      'RED_HH_LEFT',
      'RED_HH_RIGHT'
    ]
  },
  {
    rollTotal: 12,
    rollName: '12 Craps (Boxcars)',
    diceOptions: [[6, 6]],
    winningSpots: [
      'YELLOW_3WAY',
      'PURPLE_CE',
      'ANY_CRAPS_BOX',
      'HORN_12_BOX',
      'BLUE_SPLIT_2_12',
      'BLUE_SPLIT_12_11',
      'BET_THE_HORN_BOX',
      'RED_HH_RIGHT',
      'RED_HH_LEFT'
    ]
  },
  {
    rollTotal: 7,
    rollName: 'Seven (7)',
    diceOptions: [[4, 3], [5, 2], [6, 1]],
    winningSpots: ['SEVEN_BOX', 'GREEN_SEVEN_ELEVEN']
  }
];

// Conflits spatiaux à éviter pour que deux piles de jetons ne se chevauchent jamais visuellement
const SPOT_CONFLICTS = {
  HORN_3_BOX: ['BLUE_SPLIT_3_2', 'BLUE_SPLIT_3_11', 'RED_HH_LEFT', 'YELLOW_3WAY'],
  HORN_2_BOX: ['BLUE_SPLIT_3_2', 'BLUE_SPLIT_2_12', 'RED_HH_LEFT', 'RED_HH_RIGHT'],
  HORN_12_BOX: ['BLUE_SPLIT_2_12', 'BLUE_SPLIT_12_11', 'RED_HH_RIGHT'],
  HORN_11L_BOX: ['BLUE_SPLIT_3_11', 'RED_HH_LEFT'],
  BET_THE_HORN_BOX: ['RED_HH_LEFT', 'RED_HH_RIGHT'],
  RED_HH_LEFT: ['HORN_3_BOX', 'HORN_2_BOX', 'HORN_11L_BOX', 'BET_THE_HORN_BOX', 'BLUE_SPLIT_3_2', 'BLUE_SPLIT_3_11'],
  RED_HH_RIGHT: ['HORN_2_BOX', 'HORN_12_BOX', 'BET_THE_HORN_BOX', 'BLUE_SPLIT_2_12', 'BLUE_SPLIT_12_11'],
  BLUE_SPLIT_3_2: ['HORN_3_BOX', 'HORN_2_BOX', 'RED_HH_LEFT'],
  BLUE_SPLIT_2_12: ['HORN_2_BOX', 'HORN_12_BOX', 'RED_HH_RIGHT'],
  BLUE_SPLIT_3_11: ['HORN_3_BOX', 'HORN_11L_BOX', 'RED_HH_LEFT', 'YELLOW_3WAY'],
  BLUE_SPLIT_12_11: ['HORN_12_BOX', 'RED_HH_RIGHT'],
  YELLOW_3WAY: ['HORN_3_BOX', 'BLUE_SPLIT_3_11'],
  SEVEN_BOX: ['GREEN_SEVEN_ELEVEN'],
  GREEN_SEVEN_ELEVEN: ['SEVEN_BOX']
};

function canAddSpot(chosenIds, candidateId) {
  if (chosenIds.includes(candidateId)) return false;
  const conflicts = SPOT_CONFLICTS[candidateId] || [];
  return !chosenIds.some((id) => conflicts.includes(id));
}

// ==========================================
// 3. COMPOSANTS VISUELS DE LA TABLE (DÉS, STICKMAN, PILES)
// ==========================================

// Puck ON officiel posé sur le Point Marqué
constOnPuck = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.85)] select-none">
    <circle cx="50" cy="54" r="45" fill="#080c0a" />
    <circle cx="50" cy="50" r="45" fill="#f7f7f2" stroke="#181818" strokeWidth="6" />
    <circle cx="50" cy="50" r="37" fill="none" stroke="#222222" strokeWidth="2" />
    <text
      x="50"
      y="61"
      textAnchor="middle"
      fill="#111111"
      fontSize="33"
      fontWeight="900"
      fontFamily="Inter, system-ui, sans-serif"
      letterSpacing="1"
    >
      ON
    </text>
  </svg>
);

const RedDie = ({ value = 5 }) => {
  const pips = {
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]],
  }[value] || [[50, 50]];

  return (
    <svg width="36" height="36" viewBox="0 0 100 100" className="drop-shadow-md">
      <rect x="4" y="4" width="92" height="92" rx="20" fill="#c82829" stroke="#f05454" strokeWidth="4" />
      <rect x="10" y="10" width="80" height="80" rx="14" fill="#b51f20" />
      {pips.map(([cx, cy], idx) => (
        <circle key={idx} cx={cx} cy={cy} r="9" fill="#ffffff" />
      ))}
    </svg>
  );
};

const FeltMiniDie = ({ value = 3, size = 20 }) => {
  const pips = {
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[24, 24], [50, 50], [76, 76]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]],
  }[value] || [[50, 50]];

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0">
      <rect x="4" y="4" width="92" height="92" rx="16" fill="#d9e577" />
      {pips.map(([cx, cy], idx) => (
        <circle key={idx} cx={cx} cy={cy} r="9.5" fill="#134e35" />
      ))}
    </svg>
  );
};

const StickmanBadge = ({ side, onToggle }) => {
  const isRight = side === 'RIGHT';
  return (
    <button
      onClick={onToggle}
      title="Changer le côté du Stickman (Sens de paiement)"
      className="flex flex-col items-center justify-center w-12 h-16 rounded-2xl bg-[#0c261a] border-2 border-[#426b53] shadow-lg active:scale-95 transition-all hover:border-[#d9e583] group relative"
    >
      <svg width="36" height="44" viewBox="0 0 60 70">
        <circle cx="32" cy="15" r="7" fill="#ffffff" />
        <path d="M21,26 Q32,23 43,26 L41,50 L23,50 Z" fill="#091a12" stroke="#dce780" strokeWidth="2" />
        <polygon points="28,26 36,26 32,33" fill="#ffffff" />
        <path d="M22,28 L13,40" stroke="#dce780" strokeWidth="2.5" strokeLinecap="round" />
        <path 
          d={isRight ? "M26,20 L10,58 Q7,64 15,64" : "M38,20 L54,58 Q57,64 49,64"} 
          fill="none" 
          stroke="#e5b84b" 
          strokeWidth="3" 
          strokeLinecap="round" 
        />
      </svg>
      <span className="text-[9px] font-bold tracking-tighter text-[#b8d4a7] -mt-1">
        {isRight ? 'STICK D' : 'STICK G'}
      </span>
    </button>
  );
};

// Pile de jetons pour le Module 1 (Base / Point)
const ChipStackOnFelt = ({ betItem, isSelected, isPaid, isWrongOrder, onSelect, showOrderHint, orderNumber }) => {
  const flatStack = useMemo(() => buildVisualStack(betItem.bet), [betItem.bet]);
  const oddsStack = useMemo(() => (betItem.odds ? buildVisualStack(betItem.odds) : []), [betItem.odds]);

  return (
    <button
      onClick={() => onSelect(betItem)}
      disabled={isPaid}
      className={`relative flex flex-col items-center justify-center group transition-all duration-200 select-none focus:outline-none ${
        isPaid ? 'opacity-40 scale-90 cursor-default' : 'active:scale-95 cursor-pointer'
      }`}
    >
      <div
        className={`relative z-40 mb-1 px-1.5 py-0.5 rounded-full border text-[10px] leading-tight font-extrabold tracking-tight shadow-[0_2px_5px_rgba(0,0,0,0.9)] whitespace-nowrap transition-colors ${
          isPaid
            ? 'bg-[#133826] border-[#3ca370] text-[#6be6a3]'
            : isSelected
            ? 'bg-[#19160a] border-[#f5d547] text-[#f5d547] ring-2 ring-[#f5d547]/50 scale-105'
            : isWrongOrder
            ? 'bg-[#3b1212] border-[#ff5555] text-[#ff9999] animate-bounce'
            : 'bg-[#141711] border-[#d0cf7b] text-[#f5cf58]'
        }`}
      >
        {betItem.type === 'COME' ? (
          <span>
            <span className="text-[#88d4ee]">{betItem.bet}€</span>
            <span className="text-white mx-0.5">+</span>
            <span className="text-[#f5cf58]">{betItem.odds}€</span>
          </span>
        ) : (
          <span>{betItem.bet}€</span>
        )}
      </div>

      {betItem.type === 'PLACE' ? (
        <div className="relative w-10 h-10 flex items-center justify-center">
          {flatStack.map((d, idx) => (
            <div
              key={idx}
              style={{
                transform: `translateY(${-idx * 2.4}px)`,
                zIndex: 10 + idx,
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <MonteCarloChip denom={d} size={38} />
            </div>
          ))}

          {isPaid && (
            <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/45 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-[#4ade80] drop-shadow" />
            </div>
          )}

          {showOrderHint && !isPaid && (
            <div className="absolute -right-1.5 -bottom-1 z-30 w-4 h-4 rounded-full bg-[#e6ec78] text-[#092216] font-black text-[10px] flex items-center justify-center shadow border border-black">
              {orderNumber}
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-14 h-10 flex items-center justify-center">
          {flatStack.map((d, idx) => (
            <div
              key={`flat-${idx}`}
              style={{
                bottom: `${idx * 2.2}px`,
                left: '2px',
                zIndex: 10 + idx,
              }}
              className="absolute"
            >
              <MonteCarloChip denom={d} size={34} />
            </div>
          ))}
          {oddsStack.map((d, idx) => (
            <div
              key={`odds-${idx}`}
              style={{
                bottom: `${2 + idx * 2.2}px`,
                left: '17px',
                zIndex: 20 + idx,
              }}
              className="absolute"
            >
              <MonteCarloChip denom={d} size={34} />
            </div>
          ))}

          {isPaid && (
            <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/45 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-[#4ade80] drop-shadow" />
            </div>
          )}

          {showOrderHint && !isPaid && (
            <div className="absolute -right-1 -bottom-1 z-30 w-4 h-4 rounded-full bg-[#e6ec78] text-[#092216] font-black text-[10px] flex items-center justify-center shadow border border-black">
              {orderNumber}
            </div>
          )}
        </div>
      )}
    </button>
  );
};

// ==========================================
// MINI-PILE DE JETONS COMPACTE POUR LE TABLEAU DU MILIEU (MULTI-MISES)
// ==========================================
const MiniPropChipStack = ({ betEntry, isSolved }) => {
  const stack = useMemo(() => buildVisualStack(betEntry.bet, 2), [betEntry.bet]);
  const isWinning = betEntry.grossWin > 0;

  return (
    <div className="relative flex flex-col items-center justify-center pointer-events-none select-none z-40">
      {/* Étiquette ultra-nette indiquant le montant */}
      <div
        className={`mb-0.5 px-1.5 py-[1px] rounded-full border text-[9px] font-black leading-none tracking-tight whitespace-nowrap shadow-[0_2px_4px_rgba(0,0,0,0.95)] ${
          isSolved
            ? 'bg-[#0f3822] border-[#4ade80] text-[#86efac]'
            : isWinning
            ? 'bg-[#1a1505] border-[#facc15] text-[#fde047] ring-1 ring-[#facc15]/60'
            : 'bg-[#1f1215]/95 border-[#f87171] text-[#fecaca]'
        }`}
      >
        <span>{betEntry.bet}€</span>
      </div>

      {/* Mini pile de jetons (22px) laissant voir l'intersection exacte en dessous */}
      <div className="relative w-6 h-6 flex items-center justify-center">
        {isWinning && (
          <div className="absolute inset-0 rounded-full bg-[#facc15]/35 animate-pulse scale-110" />
        )}
        {stack.map((d, idx) => (
          <div
            key={idx}
            style={{
              transform: `translateY(${-idx * 1.8}px)`,
              zIndex: 10 + idx,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <MonteCarloChip denom={d} size={22} showText={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. APPLICATION PRINCIPALE CRAPSPRO
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('BASE'); // 'BASE' | 'STICK' | 'LINES'
  
  const [stickmanSide, setStickmanSide] = useState('RIGHT');
  const [showOrderHelper, setShowOrderHelper] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [streak, setStreak] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // État Module 1 : Paiements de Base (Point)
  const [pointNumber, setPointNumber] = useState(5);
  const [dicePair, setDicePair] = useState([3, 2]);
  const [tableBets, setTableBets] = useState([]);
  const [selectedBetId, setSelectedBetId] = useState(null);
  const [wrongOrderBetId, setWrongOrderBetId] = useState(null);

  // État Module 2 : Milieu (Multi-Mises Combinées & Paiement Global "Still Up")
  const [stickMultiRound, setStickMultiRound] = useState(null);
  const [stickBetCountMode, setStickBetCountMode] = useState('MIX'); // '2' | '3' | '4' | 'MIX'

  // État Module 3 : Lignes de Place Bets (Across / Inside selon le Point Marqué)
  const [lineRound, setLineRound] = useState(null);
  const [lineModeFilter, setLineModeFilter] = useState('ALL'); // 'ACROSS' | 'INSIDE' | 'ALL'
  const [lineCostInput, setLineCostInput] = useState(0);
  const [lineChangeInput, setLineChangeInput] = useState(0);
  const [activeLineField, setActiveLineField] = useState('COST'); // 'COST' | 'CHANGE'

  // Clavier & Calculateur (Modules 1 & 2)
  const [inputAmount, setInputAmount] = useState(0);
  const [feedbackBanner, setFeedbackBanner] = useState({
    type: 'info',
    message: 'Touche avec le pouce la 1e mise dans l’ordre !'
  });

  const playFeedbackSound = useCallback((type) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'tap') {
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.setValueAtTime(780, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } else if (type === 'error') {
        osc.frequency.setValueAtTime(170, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch {
      // Audio non autorisé
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (!timerRunning) return;
    const iv = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, [timerRunning]);

  const rollDiceForPoint = (pt) => {
    const pairs = {
      4: [[1, 3], [3, 1], [2, 2]],
      5: [[2, 3], [3, 2], [1, 4], [4, 1]],
      6: [[2, 4], [4, 2], [1, 5], [5, 1], [3, 3]],
      8: [[2, 6], [6, 2], [3, 5], [5, 3], [4, 4]],
      9: [[3, 6], [6, 3], [4, 5], [5, 4]],
      10: [[4, 6], [6, 4], [5, 5]],
    }[pt] || [[3, 2]];
    return pairs[Math.floor(Math.random() * pairs.length)];
  };

  // ==========================================
  // GENERATION D'UN PROBLEME MODULE 1 (BASE)
  // ==========================================
  const generateBaseRound = useCallback((customSide = stickmanSide) => {
    const points = [4, 5, 6, 8, 9, 10];
    const pt = points[Math.floor(Math.random() * points.length)];
    setPointNumber(pt);
    setDicePair(rollDiceForPoint(pt));

    const numCome = 2;
    const numPlace = 2;
    const shuffleArr = (arr) => [...arr].sort(() => Math.random() - 0.5);

    const comeSlots = shuffleArr([
      { rowPos: 'COME_TOP', col: 0, sideGroup: 'TOP' },
      { rowPos: 'COME_TOP', col: 1, sideGroup: 'TOP' },
      { rowPos: 'COME_TOP', col: 2, sideGroup: 'TOP' },
      { rowPos: 'COME_TOP', col: 3, sideGroup: 'TOP' },
      { rowPos: 'COME_BOTTOM', col: 0, sideGroup: 'BOTTOM' },
      { rowPos: 'COME_BOTTOM', col: 1, sideGroup: 'BOTTOM' },
      { rowPos: 'COME_BOTTOM', col: 2, sideGroup: 'BOTTOM' },
      { rowPos: 'COME_BOTTOM', col: 3, sideGroup: 'BOTTOM' },
    ]);

    const chosenComeSlots = [];
    for (const slot of comeSlots) {
      if (chosenComeSlots.length >= numCome) break;
      const tooClose = chosenComeSlots.some(
        (s) => s.rowPos === slot.rowPos && Math.abs(s.col - slot.col) <= 1
      );
      if (!tooClose) chosenComeSlots.push(slot);
    }

    const placeSlots = shuffleArr([
      { rowPos: 'PLACE_TOP', col: 0, sideGroup: 'TOP' },
      { rowPos: 'PLACE_TOP', col: 1, sideGroup: 'TOP' },
      { rowPos: 'PLACE_TOP', col: 2, sideGroup: 'TOP' },
      { rowPos: 'PLACE_TOP', col: 3, sideGroup: 'TOP' },
      { rowPos: 'PLACE_BOTTOM', col: 0, sideGroup: 'BOTTOM' },
      { rowPos: 'PLACE_BOTTOM', col: 1, sideGroup: 'BOTTOM' },
      { rowPos: 'PLACE_BOTTOM', col: 2, sideGroup: 'BOTTOM' },
      { rowPos: 'PLACE_BOTTOM', col: 3, sideGroup: 'BOTTOM' },
    ]).slice(0, numPlace);

    const newBets = [];

    chosenComeSlots.forEach((slot, idx) => {
      const pool = VALID_COME_BETS[pt];
      const sample = pool[Math.floor(Math.random() * pool.length)];
      newBets.push({
        id: `come-${slot.rowPos}-${slot.col}-${Date.now()}-${idx}`,
        type: 'COME',
        col: slot.col,
        rowPos: slot.rowPos,
        sideGroup: slot.sideGroup,
        bet: sample.bet,
        odds: sample.odds,
        payout: sample.payout,
        paid: false,
      });
    });

    placeSlots.forEach((slot, idx) => {
      const pool = VALID_PLACE_BETS[pt];
      const sample = pool[Math.floor(Math.random() * pool.length)];
      newBets.push({
        id: `place-${slot.rowPos}-${slot.col}-${Date.now()}-${idx}`,
        type: 'PLACE',
        col: slot.col,
        rowPos: slot.rowPos,
        sideGroup: slot.sideGroup,
        bet: sample.bet,
        odds: 0,
        payout: sample.payout,
        paid: false,
      });
    });

    const sorted = [...newBets].sort(
      (a, b) => getLoopPathScore(a, customSide) - getLoopPathScore(b, customSide)
    );

    const withOrder = newBets.map((item) => {
      const orderIndex = sorted.findIndex((s) => s.id === item.id) + 1;
      return { ...item, order: orderIndex };
    });

    setTableBets(withOrder);
    setSelectedBetId(null);
    setWrongOrderBetId(null);
    setInputAmount(0);
    setFeedbackBanner({
      type: 'info',
      message: 'Touche avec le pouce la 1e mise dans l’ordre !',
    });
  }, [stickmanSide]);

  // ==========================================
  // GENERATION D'UN PROBLEME MODULE 2 : PAIEMENT GLOBAL MULTI-MISES ("STILL UP")
  // ==========================================
  // Règle appliquée :
  // - Aucune mise n'est placée sur les Hardways (qui restent toutefois affichés sur le feutre).
  // - TOUTES les mises affichées sur le tapis sont prises en compte dans le calcul "Still Up" :
  //     Paiement Global Still Up = (Somme des Gains Bruts selon les cotes FOR 1 de Monte-Carlo)
  //                              - (Somme de TOUTES les mises présentes sur le tapis pour les laisser Still Up).
  const generateStickRound = useCallback((customCountMode = stickBetCountMode) => {
    const shuffleArr = (arr) => [...arr].sort(() => Math.random() - 0.5);

    const hornTemplates = STICK_ROLL_TEMPLATES.filter((t) => [2, 3, 11, 12].includes(t.rollTotal));
    const sevenTemplates = STICK_ROLL_TEMPLATES.filter((t) => t.rollTotal === 7);

    let chosenRound = null;

    for (let attempt = 0; attempt < 80; attempt++) {
      const useHorn = Math.random() < 0.88;
      const pool = useHorn ? hornTemplates : sevenTemplates;
      const template = pool[Math.floor(Math.random() * pool.length)];

      const targetCount =
        customCountMode === '2'
          ? 2
          : customCountMode === '3'
          ? 3
          : customCountMode === '4'
          ? 4
          : [2, 3, 3, 4][Math.floor(Math.random() * 4)];

      const winningCandidates = shuffleArr(template.winningSpots);
      const selectedSpotIds = [];

      // Garantir au moins 1 ou 2 mises gagnantes sur le jet
      const desiredWinners = Math.min(
        winningCandidates.length,
        template.winningSpots.length >= 2 ? Math.max(1, targetCount - 1) : 1
      );

      for (const spotId of winningCandidates) {
        if (selectedSpotIds.length >= desiredWinners) break;
        if (canAddSpot(selectedSpotIds, spotId)) {
          selectedSpotIds.push(spotId);
        }
      }

      // Compléter jusqu'à targetCount avec d'autres mises combinées du tableau (hors Hardways)
      const allSpotIds = shuffleArr(Object.keys(PROP_BET_SPOTS));
      for (const spotId of allSpotIds) {
        if (selectedSpotIds.length >= targetCount) break;
        if (canAddSpot(selectedSpotIds, spotId)) {
          selectedSpotIds.push(spotId);
        }
      }

      // Générer les montants respectant les divisibilités et calculer le Brut + le maintien Still Up de TOUTES les mises
      const betsOnFelt = selectedSpotIds.map((spotId) => {
        const spec = PROP_BET_SPOTS[spotId];
        const betChoices = spec.allowedBets.slice(0, 6);
        const betAmount = betChoices[Math.floor(Math.random() * betChoices.length)];
        const unit = betAmount / spec.divisor;
        const grossMult = spec.getGrossWinMultiplier(template.rollTotal);
        const grossWin = unit * grossMult;
        // Contribution nette de cette mise au paiement global Still Up :
        // Si elle touche : Gain Brut - sa mise (pour rester Still Up).
        // Si elle ne touche pas : 0 - sa mise (déduite pour être reconstruite et rester Still Up sur le tapis).
        const netContribution = grossWin - betAmount;
        const formula =
          grossWin > 0
            ? `${spec.getGrossFormula(betAmount, unit, template.rollTotal)} − ${betAmount}€ = +${netContribution}€`
            : `${spec.shortName} (−${betAmount}€ maintien Still Up)`;

        return {
          spotId,
          shortName: spec.shortName,
          fullName: spec.fullName,
          divisor: spec.divisor,
          bet: betAmount,
          unit,
          grossMult,
          grossWin,
          netContribution,
          formula
        };
      });

      const totalGrossWin = betsOnFelt.reduce((acc, b) => acc + b.grossWin, 0);
      const totalTableBets = betsOnFelt.reduce((acc, b) => acc + b.bet, 0);
      const totalGlobalPayout = totalGrossWin - totalTableBets;
      const winningBetsCount = betsOnFelt.filter((b) => b.grossWin > 0).length;

      // On s'assure que le paiement global Still Up (après maintien de toutes les mises du tapis) est strictement positif
      // et payable en maximum 2 couleurs de jetons.
      if (
        totalGlobalPayout >= 2 &&
        winningBetsCount >= 1 &&
        (isPayableInMaxTwoColors(totalGlobalPayout) || attempt > 65)
      ) {
        const chosenDice =
          template.diceOptions[Math.floor(Math.random() * template.diceOptions.length)];

        chosenRound = {
          id: `multi-stick-${Date.now()}`,
          rollTotal: template.rollTotal,
          rollName: template.rollName,
          dice: chosenDice,
          bets: betsOnFelt,
          totalGrossWin,
          totalTableBets,
          totalPayout: totalGlobalPayout,
          winningCount: winningBetsCount,
          paid: false
        };
        break;
      }
    }

    if (chosenRound) {
      setStickMultiRound(chosenRound);
      setDicePair(chosenRound.dice);
      setInputAmount(0);
      const summaryBets = chosenRound.bets.map((b) => `${b.shortName} ${b.bet}€`).join(' + ');
      setFeedbackBanner({
        type: 'info',
        message: `Jet ${chosenRound.rollName} ! Paiement Global Still Up (Toutes mises conservées : ${summaryBets})`,
      });
    }
  }, [stickBetCountMode]);

  // ==========================================
  // GENERATION D'UN PROBLEME MODULE 3 : LIGNES DE PLACE BETS (ACROSS / INSIDE)
  // ==========================================
  // Règle officielle des Lignes de Place Bets (Point Marqué exclu car déjà couvert par le Pass Line) :
  // - unitBase (ex: "par 5", "par 10", "par 15", "par 25", "par 50", "par 100") :
  //     * Chaque point 4, 5, 9, 10 prend : 1 × unitBase
  //     * Chaque point 6, 8 prend (par multiples de 6) : (unitBase / 5) × 6
  // - Ligne complète (ACROSS - tous les numéros hors Point Marqué) :
  //     * Si Point 4, 5, 9 ou 10 : reste trois numéros à 1×U et deux numéros (6 & 8) à 1.2×U => Total = (unitBase / 5) × 27
  //       (ex: par 5 = 27€, par 10 = 54€, par 15 = 81€, par 25 = 135€, par 50 = 270€, par 100 = 540€)
  //     * Si Point 6 ou 8 : reste quatre numéros à 1×U et un numéro (6 ou 8) à 1.2×U => Total = (unitBase / 5) × 26
  //       (ex: par 5 = 26€, par 10 = 52€, par 15 = 78€, par 25 = 130€, par 50 = 260€, par 100 = 520€)
  // - Intérieurs (INSIDE - 5, 6, 8, 9 hors Point Marqué) :
  //     * Si Point 4 ou 10 (les 4 intérieurs sont joués : 5, 6, 8, 9) => Total = (unitBase / 5) × 22
  //       (ex: par 5 = 22€, par 10 = 44€, par 25 = 110€, par 50 = 220€, par 100 = 440€)
  //     * Si Point 5 ou 9 (reste un point parmi 5/9 et les deux 6/8) => Total = (unitBase / 5) × 17
  //       (ex: par 5 = 17€, par 10 = 34€, par 25 = 85€, par 50 = 170€, par 100 = 340€)
  //     * Si Point 6 ou 8 (reste 5, 9 et l'autre 6/8) => Total = (unitBase / 5) × 16
  //       (ex: par 5 = 16€, par 10 = 32€, par 25 = 80€, par 50 = 160€, par 100 = 320€)
  const generateLineRound = useCallback((customFilter = lineModeFilter) => {
    const points = [4, 5, 6, 8, 9, 10];
    const markedPoint = points[Math.floor(Math.random() * points.length)];

    const lineType =
      customFilter === 'ACROSS'
        ? 'ACROSS'
        : customFilter === 'INSIDE'
        ? 'INSIDE'
        : Math.random() < 0.72
        ? 'ACROSS'
        : 'INSIDE';

    const unitCandidates = [5, 10, 15, 20, 25, 50, 75, 100];
    const unitBase = unitCandidates[Math.floor(Math.random() * unitCandidates.length)];
    const mult = unitBase / 5;
    const betOn45910 = unitBase;
    const betOn68 = mult * 6;

    const activePoints =
      lineType === 'ACROSS'
        ? points.filter((p) => p !== markedPoint)
        : [5, 6, 8, 9].filter((p) => p !== markedPoint);

    const betsByPoint = {};
    let totalLineCost = 0;
    activePoints.forEach((pt) => {
      const amt = pt === 6 || pt === 8 ? betOn68 : betOn45910;
      betsByPoint[pt] = amt;
      totalLineCost += amt;
    });

    // Générer les jetons donnés par le client (1 à 4 jetons d'une même coupure supérieure ou égale au coût)
    const possibleHandouts = [];

    // Option A : Multiple rond en jetons de 25€, 100€ ou 500€
    [25, 100, 500].forEach((chipDenom) => {
      const countNeeded = Math.ceil(totalLineCost / chipDenom);
      if (countNeeded >= 1 && countNeeded <= 4) {
        const givenTotal = countNeeded * chipDenom;
        if (givenTotal >= totalLineCost) {
          possibleHandouts.push({
            givenTotal,
            chips: Array(countNeeded).fill(chipDenom),
            desc: `${countNeeded} × ${chipDenom}€`
          });
        }
        // Parfois le client pose 1 jeton supplémentaire ou une coupure au-dessus
        if (countNeeded + 1 <= 4 && (countNeeded + 1) * chipDenom - totalLineCost < chipDenom) {
          const extraTotal = (countNeeded + 1) * chipDenom;
          possibleHandouts.push({
            givenTotal: extraTotal,
            chips: Array(countNeeded + 1).fill(chipDenom),
            desc: `${countNeeded + 1} × ${chipDenom}€`
          });
        }
      }
    });

    // Option B : Combinaison réaliste avec 100€ + 50€/25€ si le montant s'y prête
    if (possibleHandouts.length === 0) {
      const fallbackTotal = Math.ceil(totalLineCost / 100) * 100;
      const count100 = Math.max(1, Math.ceil(totalLineCost / 100));
      possibleHandouts.push({
        givenTotal: fallbackTotal,
        chips: Array(Math.min(count100, 6)).fill(100),
        desc: `${count100} × 100€`
      });
    }

    // Privilégier les cas où il y a du change à rendre (comme l'exemple "2 jetons de 100€ pour la ligne par 25")
    const withChange = possibleHandouts.filter((h) => h.givenTotal > totalLineCost);
    const chosenHandout =
      withChange.length > 0
        ? withChange[Math.floor(Math.random() * withChange.length)]
        : possibleHandouts[0];

    const expectedChange = chosenHandout.givenTotal - totalLineCost;

    const clientQuote =
      lineType === 'ACROSS'
        ? `« Faites-moi la ligne par ${unitBase} ! »`
        : `« Faites-moi les intérieurs par ${unitBase} ! »`;

    const newRound = {
      id: `line-${Date.now()}`,
      markedPoint,
      lineType,
      unitBase,
      betOn45910,
      betOn68,
      activePoints,
      betsByPoint,
      totalLineCost,
      givenTotal: chosenHandout.givenTotal,
      givenChips: chosenHandout.chips,
      givenDesc: chosenHandout.desc,
      expectedChange,
      clientQuote,
      solved: false
    };

    setLineRound(newRound);
    setDicePair(rollDiceForPoint(markedPoint));
    setLineCostInput(0);
    setLineChangeInput(0);
    setActiveLineField('COST');
    setFeedbackBanner({
      type: 'info',
      message: `Point ${markedPoint} : ${clientQuote} (Client donne ${chosenHandout.givenTotal}€)`,
    });
  }, [lineModeFilter]);

  useEffect(() => {
    generateStickRound();
    generateLineRound();
    generateBaseRound();
  }, []);

  const toggleStickmanSide = () => {
    const nextSide = stickmanSide === 'RIGHT' ? 'LEFT' : 'RIGHT';
    setStickmanSide(nextSide);
    setTableBets((prev) => {
      const sorted = [...prev].sort(
        (a, b) => getLoopPathScore(a, nextSide) - getLoopPathScore(b, nextSide)
      );
      return prev.map((b) => ({
        ...b,
        order: sorted.findIndex((s) => s.id === b.id) + 1,
      }));
    });
    setSelectedBetId(null);
    setFeedbackBanner({
      type: 'info',
      message: `Stickman passé à ${nextSide === 'RIGHT' ? 'DROITE' : 'GAUCHE'} : l'ordre en boucle s'inverse !`,
    });
  };

  // ==========================================
  // GESTION DE LA SELECTION AU POUCE (MODULE 1)
  // ==========================================
  const handleSelectBaseBet = (betItem) => {
    if (betItem.paid) return;

    const unpaidBets = tableBets.filter((b) => !b.paid).sort((a, b) => a.order - b.order);
    const nextExpected = unpaidBets[0];

    if (nextExpected && betItem.id !== nextExpected.id) {
      playFeedbackSound('error');
      setWrongOrderBetId(betItem.id);
      setTimeout(() => setWrongOrderBetId(null), 900);

      let reason = 'Respecte la boucle de paiement depuis le Stickman !';
      if (betItem.type === 'PLACE' && nextExpected.type === 'COME') {
        reason = 'Ordre refusé : Paye d’abord tous les COME + ODDS avant les PLACE BETS !';
      } else if (betItem.sideGroup !== nextExpected.sideGroup) {
        reason = 'Ordre refusé : Balaye d’abord la ligne du HAUT depuis le Stickman, puis reviens par le BAS !';
      } else {
        const dirText =
          nextExpected.sideGroup === 'TOP'
            ? stickmanSide === 'RIGHT'
              ? 'Haut : Droite → Gauche'
              : 'Haut : Gauche → Droite'
            : stickmanSide === 'RIGHT'
            ? 'Bas : Gauche → Droite (retour boucle)'
            : 'Bas : Droite → Gauche (retour boucle)';
        reason = `Ordre refusé : Suis la boucle (${dirText}) !`;
      }

      setFeedbackBanner({
        type: 'error',
        message: reason,
      });
      return;
    }

    playFeedbackSound('tap');
    setSelectedBetId(betItem.id);
    setInputAmount(0);
    setFeedbackBanner({
      type: 'info',
      message:
        betItem.type === 'COME'
          ? `Come ${betItem.bet}€ + Odds ${betItem.odds}€ sur le ${pointNumber} : entre le paiement total.`
          : `Place Bet ${betItem.bet}€ sur le ${pointNumber} : entre le paiement.`,
    });
  };

  // ==========================================
  // SAISIE CLAVIER & BOUTONS JETONS
  // ==========================================
  const handleAddChipValue = (val) => {
    playFeedbackSound('tap');
    if (activeTab === 'LINES') {
      if (activeLineField === 'COST') {
        setLineCostInput((prev) => Math.min(prev + val, 99999));
      } else {
        setLineChangeInput((prev) => Math.min(prev + val, 99999));
      }
      return;
    }
    setInputAmount((prev) => Math.min(prev + val, 99999));
  };

  const handleDigitPress = (digit) => {
    playFeedbackSound('tap');
    if (activeTab === 'LINES') {
      if (activeLineField === 'COST') {
        setLineCostInput((prev) => {
          const next = Number(`${prev === 0 ? '' : prev}${digit}`);
          return next <= 99999 ? next : prev;
        });
      } else {
        setLineChangeInput((prev) => {
          const next = Number(`${prev === 0 ? '' : prev}${digit}`);
          return next <= 99999 ? next : prev;
        });
      }
      return;
    }
    setInputAmount((prev) => {
      const next = Number(`${prev === 0 ? '' : prev}${digit}`);
      return next <= 99999 ? next : prev;
    });
  };

  const handleBackspace = () => {
    playFeedbackSound('tap');
    if (activeTab === 'LINES') {
      if (activeLineField === 'COST') {
        setLineCostInput((prev) => {
          const str = String(prev);
          return str.length <= 1 ? 0 : Number(str.slice(0, -1));
        });
      } else {
        setLineChangeInput((prev) => {
          const str = String(prev);
          return str.length <= 1 ? 0 : Number(str.slice(0, -1));
        });
      }
      return;
    }
    setInputAmount((prev) => {
      const str = String(prev);
      return str.length <= 1 ? 0 : Number(str.slice(0, -1));
    });
  };

  const handleResetInput = () => {
    playFeedbackSound('tap');
    if (activeTab === 'LINES') {
      if (activeLineField === 'COST') {
        setLineCostInput(0);
      } else {
        setLineChangeInput(0);
      }
      return;
    }
    setInputAmount(0);
  };

  // ==========================================
  // VALIDATION DU PAIEMENT / DE LA LIGNE
  // ==========================================
  const handleValidatePayout = () => {
    // Module 1 (Base / Point)
    if (activeTab === 'BASE') {
      const currentBet = tableBets.find((b) => b.id === selectedBetId);
      if (!currentBet) {
        setFeedbackBanner({
          type: 'error',
          message: 'Touche d’abord une mise sur le tapis avec le pouce !',
        });
        return;
      }

      setTotalAttempts((t) => t + 1);

      if (inputAmount === currentBet.payout) {
        playFeedbackSound('success');
        setCorrectAttempts((c) => c + 1);
        setStreak((s) => s + 1);

        const updated = tableBets.map((b) =>
          b.id === currentBet.id ? { ...b, paid: true } : b
        );
        setTableBets(updated);
        setSelectedBetId(null);
        setInputAmount(0);

        const breakdown = getChipBreakdown(currentBet.payout)
          .map((item) => `${item.count}×${item.denom}€`)
          .join(' + ');

        const remaining = updated.filter((b) => !b.paid);
        if (remaining.length === 0) {
          setFeedbackBanner({
            type: 'success',
            message: `Parfait (${currentBet.payout}€ : ${breakdown}) ! Tapis nettoyé, nouveau point généré...`,
          });
          setTimeout(() => {
            generateBaseRound();
          }, 1300);
        } else {
          setFeedbackBanner({
            type: 'success',
            message: `Exact ! ${currentBet.payout}€ (${breakdown}). Touche la mise suivante dans l'ordre !`,
          });
        }
      } else {
        playFeedbackSound('error');
        setStreak(0);
        setFeedbackBanner({
          type: 'error',
          message: `Erreur : ${inputAmount}€ saisi. Recalcule (${
            currentBet.type === 'COME'
              ? `Come ${currentBet.bet}€ [1:1] + Odds ${currentBet.odds}€`
              : `Place ${currentBet.bet}€ sur le ${pointNumber}`
          }).`,
        });
      }
      return;
    }

    // Module 2 : Milieu (Paiement Global Multi-Mises "Still Up")
    if (activeTab === 'STICK') {
      if (!stickMultiRound || stickMultiRound.paid) return;

      setTotalAttempts((t) => t + 1);

      if (inputAmount === stickMultiRound.totalPayout) {
        playFeedbackSound('success');
        setCorrectAttempts((c) => c + 1);
        setStreak((s) => s + 1);
        setStickMultiRound((prev) => ({ ...prev, paid: true }));
        setInputAmount(0);

        setFeedbackBanner({
          type: 'success',
          message: `Exact ! Brut ${stickMultiRound.totalGrossWin}€ − ${stickMultiRound.totalTableBets}€ (toutes mises Still Up) = ${stickMultiRound.totalPayout}€ !`,
        });

        setTimeout(() => {
          generateStickRound();
        }, 1600);
      } else {
        playFeedbackSound('error');
        setStreak(0);

        const grossParts = stickMultiRound.bets
          .filter((b) => b.grossWin > 0)
          .map((b) => `${b.shortName} (${b.grossWin}€ brut)`)
          .join(' + ');

        setFeedbackBanner({
          type: 'error',
          message: `Erreur (${inputAmount}€). Brut [${grossParts} = ${stickMultiRound.totalGrossWin}€] − Total mises tapis (${stickMultiRound.totalTableBets}€) = ${stickMultiRound.totalPayout}€ !`,
        });
      }
      return;
    }

    // Module 3 : Lignes de Place Bets (Montant Ligne + Change à rendre)
    if (activeTab === 'LINES') {
      if (!lineRound || lineRound.solved) return;

      const isCostOk = lineCostInput === lineRound.totalLineCost;
      const isChangeOk = lineChangeInput === lineRound.expectedChange;

      // Si l'utilisateur est sur la 1e case (COST) et n'a pas encore rempli le change, basculer automatiquement sur CHANGE si COST est bon
      if (activeLineField === 'COST' && isCostOk && lineChangeInput === 0 && lineRound.expectedChange > 0) {
        playFeedbackSound('tap');
        setActiveLineField('CHANGE');
        setFeedbackBanner({
          type: 'info',
          message: `Ligne à ${lineRound.totalLineCost}€ OK ! Entre maintenant le CHANGE à rendre sur ${lineRound.givenTotal}€.`,
        });
        return;
      }

      setTotalAttempts((t) => t + 1);

      if (isCostOk && isChangeOk) {
        playFeedbackSound('success');
        setCorrectAttempts((c) => c + 1);
        setStreak((s) => s + 1);
        setLineRound((prev) => ({ ...prev, solved: true }));

        setFeedbackBanner({
          type: 'success',
          message: `Parfait ! Ligne = ${lineRound.totalLineCost}€ | Change rendu = ${lineRound.expectedChange}€ (sur ${lineRound.givenTotal}€).`,
        });

        setTimeout(() => {
          generateLineRound();
        }, 1600);
      } else {
        playFeedbackSound('error');
        setStreak(0);

        if (!isCostOk && !isChangeOk) {
          setFeedbackBanner({
            type: 'error',
            message: `Erreur : Ligne attendue = ${lineRound.totalLineCost}€ (4/5/9/10 à ${lineRound.betOn45910}€, 6/8 à ${lineRound.betOn68}€) | Change = ${lineRound.expectedChange}€.`,
          });
          setActiveLineField('COST');
        } else if (!isCostOk) {
          setFeedbackBanner({
            type: 'error',
            message: `Montant de la ligne faux (${lineCostInput}€). Attendu : ${lineRound.totalLineCost}€ hors Point ${lineRound.markedPoint}.`,
          });
          setActiveLineField('COST');
        } else {
          setFeedbackBanner({
            type: 'error',
            message: `Ligne ${lineRound.totalLineCost}€ juste, mais Change faux (${lineChangeInput}€). ${lineRound.givenTotal}€ − ${lineRound.totalLineCost}€ = ${lineRound.expectedChange}€ !`,
          });
          setActiveLineField('CHANGE');
        }
      }
    }
  };

  // Helper pour récupérer une mise présente sur un spot donné dans le Module 2
  const getBetAtSpot = useCallback(
    (spotId) => {
      if (!stickMultiRound) return null;
      return stickMultiRound.bets.find((b) => b.spotId === spotId) || null;
    },
    [stickMultiRound]
  );

  const accuracyPercent = totalAttempts === 0 ? 100 : Math.round((correctAttempts / totalAttempts) * 100);
  const paidCount = tableBets.filter((b) => b.paid).length;
  const activeBaseBet = tableBets.find((b) => b.id === selectedBetId);
  const currentInputBreakdown = useMemo(() => getChipBreakdown(inputAmount), [inputAmount]);

  return (
    <div className="min-h-screen w-full bg-[#061810] text-white flex flex-col items-center justify-start font-sans select-none overflow-x-hidden">
      <div className="w-full max-w-[440px] min-h-screen bg-[#071c12] flex flex-col justify-between border-x border-[#173d2a] shadow-2xl px-2.5 py-2">
        
        {/* ========================================== */}
        {/* EN-TÊTE SUPERIEUR : LOGO + STATS + OUTILS  */}
        {/* ========================================== */}
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f2b84b] to-[#c77d1c] flex items-center justify-center shadow-inner border border-[#ffe194]">
                <span className="text-[#161209] font-black text-xs">🎲</span>
              </div>
              <div className="tracking-tight text-sm font-black">
                <span className="text-[#f0c85a]">CRAPS</span>
                <span className="text-white">PRO</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0d2b1d] border border-[#23533a] text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>{streak}</span>
              </div>

              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0d2b1d] border border-[#23533a] text-xs font-bold text-[#e6cf65]">
                <Trophy className="w-3.5 h-3.5 text-[#e6cf65]" />
                <span>{accuracyPercent}%</span>
              </div>

              <button
                onClick={() => setShowOrderHelper((v) => !v)}
                className={`px-2 py-1 rounded-lg border text-xs font-extrabold transition-colors ${
                  showOrderHelper
                    ? 'bg-[#dce780] text-[#082214] border-[#dce780]'
                    : 'bg-[#0d2b1d] text-[#9ec4ad] border-[#23533a]'
                }`}
                title="Afficher l'aide 1-2-3 / Détail formules"
              >
                1-2-3
              </button>

              <button
                onClick={() => {
                  if (timerRunning) {
                    setTimerRunning(false);
                  } else {
                    setTimerSeconds(0);
                    setTimerRunning(true);
                  }
                }}
                className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs font-bold ${
                  timerRunning
                    ? 'bg-[#2c5e43] border-[#78d6a2] text-white'
                    : 'bg-[#0d2b1d] border-[#23533a] text-[#8ab49a]'
                }`}
                title="Activer/Arrêter le chronomètre"
              >
                <Clock className="w-3.5 h-3.5" />
                {timerRunning && <span>{timerSeconds}s</span>}
              </button>

              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-1.5 rounded-lg bg-[#0d2b1d] border border-[#23533a] text-[#9ec4ad] hover:text-white"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          <nav className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#0b2318] border border-[#1d4631]">
            {[
              { id: 'BASE', label: 'Base (Point)' },
              { id: 'STICK', label: 'Milieu (Stick)' },
              { id: 'LINES', label: 'Lignes (Place)' },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setInputAmount(0);
                    if (tab.id === 'BASE') {
                      generateBaseRound();
                    } else if (tab.id === 'STICK') {
                      generateStickRound();
                    } else if (tab.id === 'LINES') {
                      generateLineRound();
                    }
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-extrabold transition-all truncate ${
                    active
                      ? 'bg-[#dce780] text-[#092216] shadow'
                      : 'text-[#84a993] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </header>

        {/* ========================================== */}
        {/* CONTENU SELON LE MODULE SELECTIONNE        */}
        {/* ========================================== */}
        <>
          {/* BANDEAU D'ÉTAT DU POINT / JET & DÉS */}
          <div className="mt-1 px-3 py-1.5 rounded-2xl bg-[#0c261a] border border-[#224e37] flex items-center justify-between gap-2 shadow-md">
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-[#dce780] text-[#092014] font-black text-xs tracking-wide uppercase">
                  {activeTab === 'STICK'
                    ? `JET : ${stickMultiRound?.rollName || '11'}`
                    : activeTab === 'LINES'
                    ? `POINT MARQUÉ : ${lineRound?.markedPoint || 4}`
                    : `POINT ${pointNumber}`}
                </span>
                {activeTab === 'BASE' ? (
                  <>
                    <span className="px-1.5 py-0.5 rounded bg-[#143d29] border border-[#2e6b4c] text-[10px] font-extrabold text-[#88d4ee]">
                      Max Odds {getMaxOddsMultiplier(pointNumber)}×
                    </span>
                    <span className="text-xs font-bold text-[#89b59c]">
                      Payées : <strong className="text-white">{paidCount} / {tableBets.length}</strong>
                    </span>
                  </>
                ) : activeTab === 'STICK' ? (
                  <span className="px-1.5 py-0.5 rounded bg-[#143d29] border border-[#2e6b4c] text-[10px] font-extrabold text-[#f5cf58] truncate">
                    GLOBAL STILL UP • {stickMultiRound?.bets.length || 0} MISES EN JEU
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded bg-[#143d29] border border-[#2e6b4c] text-[10px] font-extrabold text-[#f5cf58] truncate">
                    {lineRound?.lineType === 'INSIDE' ? 'INTÉRIEURS (INSIDE)' : 'LIGNE COMPLÈTE (ACROSS)'} • PAR {lineRound?.unitBase}€
                  </span>
                )}
              </div>

              <p
                className={`text-xs font-extrabold truncate ${
                  feedbackBanner.type === 'error'
                    ? 'text-[#ff7b7b]'
                    : feedbackBanner.type === 'success'
                    ? 'text-[#6ee7b7]'
                    : 'text-[#e7cf69]'
                }`}
              >
                {feedbackBanner.message}
              </p>
            </div>

            {/* Paire de dés rouges */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-[#081911] border border-[#1d422e]">
              <RedDie value={dicePair[0]} />
              <RedDie value={dicePair[1]} />
            </div>
          </div>

          {/* ========================================== */}
          {/* TAPIS DE CRAPS INTERACTIF                  */}
          {/* ========================================== */}
          {activeTab === 'BASE' ? (
            /* --- TAPIS MODULE 1 : CASE DE POINT (4 COLONNES JOUEURS ALIGNÉES) --- */
            <div className="relative my-1 flex-1 min-h-[335px] rounded-2xl bg-[#1a6b48] border-2 border-[#739c73] shadow-[inset_0_0_35px_rgba(0,0,0,0.5)] px-2 py-5 flex items-center justify-center overflow-hidden">
              
              {stickmanSide === 'LEFT' && (
                <div className="z-20 mr-1.5 flex flex-col items-center">
                  <StickmanBadge side="LEFT" onToggle={toggleStickmanSide} />
                </div>
              )}

              <div className="relative flex-1 h-full min-h-[295px] max-w-[332px] border-[3px] border-[#d3df85] bg-[#165e3f]/95 flex flex-col justify-between px-1.5 py-1 shadow-inner">

                {/* 1. LIGNE HAUT : 4 Cercles Place Bets */}
                <div className="grid grid-cols-4 gap-1 items-center justify-items-center z-20 -mt-5">
                  {[0, 1, 2, 3].map((colIdx) => {
                    const betHere = tableBets.find(
                      (b) => b.type === 'PLACE' && b.rowPos === 'PLACE_TOP' && b.col === colIdx
                    );
                    return (
                      <div
                        key={`place-top-${colIdx}`}
                        className="w-12 h-12 rounded-full border-[3.5px] border-[#d3df85] bg-[#165e3f] flex items-center justify-center relative shadow-md"
                      >
                        {betHere && (
                          <div className="absolute left-1/2 bottom-0.5 -translate-x-1/2 flex flex-col items-center">
                            <ChipStackOnFelt
                              betItem={betHere}
                              isSelected={selectedBetId === betHere.id}
                              isPaid={betHere.paid}
                              isWrongOrder={wrongOrderBetId === betHere.id}
                              onSelect={handleSelectBaseBet}
                              showOrderHint={showOrderHelper}
                              orderNumber={betHere.order}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 2. RANGÉE INTÉRIEURE HAUT : 4 Emplacements Come + Odds */}
                <div className="grid grid-cols-4 gap-1 items-center justify-items-center z-30 min-h-[64px] mt-1">
                  {[0, 1, 2, 3].map((colIdx) => {
                    const comeHere = tableBets.find(
                      (b) => b.type === 'COME' && b.rowPos === 'COME_TOP' && b.col === colIdx
                    );
                    return (
                      <div
                        key={`come-top-${colIdx}`}
                        className="w-full h-16 flex items-center justify-center relative"
                      >
                        {comeHere && (
                          <ChipStackOnFelt
                            betItem={comeHere}
                            isSelected={selectedBetId === comeHere.id}
                            isPaid={comeHere.paid}
                            isWrongOrder={wrongOrderBetId === comeHere.id}
                            onSelect={handleSelectBaseBet}
                            showOrderHint={showOrderHelper}
                            orderNumber={comeHere.order}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* CENTRE DE LA CASE : Grand nom du Point */}
                <div className="relative my-auto py-1 flex items-center justify-center pointer-events-none select-none z-10">
                  <span
                    className="text-4xl font-black tracking-wider text-white/25 italic font-serif leading-none"
                    style={{ transform: 'rotate(-8deg)' }}
                  >
                    {pointNumber === 6 ? 'SIX' : pointNumber === 9 ? 'NINE' : pointNumber}
                  </span>
                </div>

                {/* 3. RANGÉE INTÉRIEURE BAS : 4 Emplacements Come + Odds */}
                <div className="grid grid-cols-4 gap-1 items-center justify-items-center z-30 min-h-[64px] mb-1">
                  {[0, 1, 2, 3].map((colIdx) => {
                    const comeHere = tableBets.find(
                      (b) => b.type === 'COME' && b.rowPos === 'COME_BOTTOM' && b.col === colIdx
                    );
                    return (
                      <div
                        key={`come-bot-${colIdx}`}
                        className="w-full h-16 flex items-center justify-center relative"
                      >
                        {comeHere && (
                          <ChipStackOnFelt
                            betItem={comeHere}
                            isSelected={selectedBetId === comeHere.id}
                            isPaid={comeHere.paid}
                            isWrongOrder={wrongOrderBetId === comeHere.id}
                            onSelect={handleSelectBaseBet}
                            showOrderHint={showOrderHelper}
                            orderNumber={comeHere.order}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 4. LIGNE BAS : 4 Cercles Place Bets */}
                <div className="grid grid-cols-4 gap-1 items-center justify-items-center z-20 -mb-5">
                  {[0, 1, 2, 3].map((colIdx) => {
                    const betHere = tableBets.find(
                      (b) => b.type === 'PLACE' && b.rowPos === 'PLACE_BOTTOM' && b.col === colIdx
                    );
                    return (
                      <div
                        key={`place-bot-${colIdx}`}
                        className="w-12 h-12 rounded-full border-[3.5px] border-[#d3df85] bg-[#165e3f] flex items-center justify-center relative shadow-md"
                      >
                        {betHere && (
                          <div className="absolute left-1/2 bottom-0.5 -translate-x-1/2 flex flex-col items-center">
                            <ChipStackOnFelt
                              betItem={betHere}
                              isSelected={selectedBetId === betHere.id}
                              isPaid={betHere.paid}
                              isWrongOrder={wrongOrderBetId === betHere.id}
                              onSelect={handleSelectBaseBet}
                              showOrderHint={showOrderHelper}
                              orderNumber={betHere.order}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {stickmanSide === 'RIGHT' && (
                <div className="z-20 ml-1.5 flex flex-col items-center">
                  <StickmanBadge side="RIGHT" onToggle={toggleStickmanSide} />
                </div>
              )}
            </div>
          ) : activeTab === 'STICK' ? (
            /* --- TAPIS MODULE 2 : TABLEAU DU MILIEU MULTI-MISES (PAIEMENT GLOBAL STILL UP) --- */
            <div className="relative my-1 flex-1 min-h-[345px] rounded-2xl bg-[#135c3e] border-2 border-[#7aa37c] shadow-[inset_0_0_35px_rgba(0,0,0,0.55)] px-2 py-1.5 flex flex-col justify-between overflow-hidden select-none">
              
              {/* Barre récapitulative de TOUTES les mises actives du client + sélecteur de densité */}
              <div className="flex items-center justify-between gap-1 px-1 mb-1">
                <div className="flex items-center gap-1 flex-wrap min-w-0">
                  {stickMultiRound?.bets.map((b) => (
                    <span
                      key={b.spotId}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold border leading-none ${
                        b.grossWin > 0
                          ? 'bg-[#1a3f29] border-[#facc15] text-[#fde047]'
                          : 'bg-[#2a1417] border-[#f87171]/70 text-[#fecaca]'
                      }`}
                    >
                      {b.shortName}: {b.bet}€
                      {showOrderHelper && (
                        <strong className={b.grossWin > 0 ? 'text-[#4ade80] ml-1' : 'text-[#fca5a5] ml-1'}>
                          {b.grossWin > 0 ? `(+${b.netContribution}€)` : `(−${b.bet}€)`}
                        </strong>
                      )}
                    </span>
                  ))}
                </div>

                {/* Sélecteur rapide du nombre de mises simultanées */}
                <div className="flex items-center gap-0.5 bg-[#0a2317] p-0.5 rounded-lg border border-[#24523a] shrink-0">
                  {['2', '3', '4', 'MIX'].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setStickBetCountMode(m);
                        generateStickRound(m);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-black transition-colors ${
                        stickBetCountMode === m
                          ? 'bg-[#dce780] text-[#092014]'
                          : 'text-[#89b59c] hover:text-white'
                      }`}
                      title="Nombre de mises simultanées sur le tableau"
                    >
                      {m === 'MIX' ? 'Mix' : `${m}M`}
                    </button>
                  ))}
                </div>
              </div>

              {/* CONTENEUR PRINCIPAL DU TABLEAU DU MILIEU */}
              <div className="flex-1 flex items-stretch justify-between gap-1">
                
                {/* COLONNE GAUCHE : Cercles E - C reliés + Repère Violet C&E */}
                <div className="w-9 flex flex-col justify-center items-center gap-1.5 py-2 relative">
                  {[0, 1, 2, 3, 4, 5].map((rowIdx) => (
                    <div key={`ec-left-${rowIdx}`} className="flex items-center gap-0.5 relative">
                      <div className="w-3.5 h-3.5 rounded-full border border-[#dce780] flex items-center justify-center text-[8px] font-black text-[#dce780]">
                        E
                      </div>
                      <div className="w-1 h-[1.5px] bg-[#dce780]" />
                      <div className="w-3.5 h-3.5 rounded-full border border-[#dce780] flex items-center justify-center text-[8px] font-black text-[#dce780]">
                        C
                      </div>

                      {/* REPÈRE VIOLET : C & E (à cheval entre E et C sur la 3e ligne) */}
                      {rowIdx === 2 && (
                        <div
                          className={`w-3.5 h-3.5 rounded-full border border-dashed border-[#c084fc] bg-[#c084fc]/15 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${
                            getBetAtSpot('PURPLE_CE') ? 'ring-2 ring-[#c084fc] z-40' : 'opacity-50'
                          }`}
                        >
                          {getBetAtSpot('PURPLE_CE') && (
                            <MiniPropChipStack
                              betEntry={getBetAtSpot('PURPLE_CE')}
                              isSolved={stickMultiRound?.paid}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* GRILLE CENTRALE DU TABLEAU DU MILIEU */}
                <div className="flex-1 flex flex-col justify-between gap-1 max-w-[332px]">
                  
                  {/* 1. BOÎTE SEVEN (5 FOR 1 — Seven — 5 FOR 1) + Repère Vert Seven-Eleven */}
                  <div className="relative mx-3">
                    <div
                      className={`h-9 border-2 bg-[#115035] flex items-center justify-between px-3 relative transition-all ${
                        getBetAtSpot('SEVEN_BOX') ? 'border-[#f5d547]' : 'border-[#dce780]'
                      }`}
                    >
                      <span className="text-[10px] font-black text-[#f5f3c8]">5 FOR 1</span>
                      <span className="text-base font-black italic font-serif tracking-wide text-[#e88352]">
                        Seven
                      </span>
                      <span className="text-[10px] font-black text-[#f5f3c8]">5 FOR 1</span>

                      {getBetAtSpot('SEVEN_BOX') && (
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                          <MiniPropChipStack
                            betEntry={getBetAtSpot('SEVEN_BOX')}
                            isSolved={stickMultiRound?.paid}
                          />
                        </div>
                      )}
                    </div>

                    {/* REPÈRE VERT : Seven-Eleven */}
                    <div
                      className={`w-3.5 h-3.5 rounded-full border border-dashed border-[#4ade80] bg-[#4ade80]/15 absolute -left-2 top-1/2 -translate-y-1/2 flex items-center justify-center ${
                        getBetAtSpot('GREEN_SEVEN_ELEVEN') ? 'ring-2 ring-[#4ade80] z-40' : 'opacity-60'
                      }`}
                    >
                      {getBetAtSpot('GREEN_SEVEN_ELEVEN') && (
                        <MiniPropChipStack
                          betEntry={getBetAtSpot('GREEN_SEVEN_ELEVEN')}
                          isSolved={stickMultiRound?.paid}
                        />
                      )}
                    </div>
                  </div>

                  {/* 2. LES 4 HARDWAYS (Conservés visuellement sur le feutre, jamais de mises dessus) */}
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { id: 'HW6', die: 3, odds: '10 FOR 1' },
                      { id: 'HW10', die: 5, odds: '8 FOR 1' },
                      { id: 'HW8', die: 4, odds: '10 FOR 1' },
                      { id: 'HW4', die: 2, odds: '8 FOR 1' },
                    ].map((hw) => (
                      <div
                        key={hw.id}
                        className="h-10 border-2 border-[#dce780] bg-[#115035] px-1.5 flex items-center justify-between relative"
                      >
                        <span className="text-[10px] font-serif italic font-bold text-[#e7efc5]">
                          Hardway
                        </span>
                        <div className="flex items-center gap-0.5">
                          <FeltMiniDie value={hw.die} size={16} />
                          <FeltMiniDie value={hw.die} size={16} />
                        </div>
                        <span className="text-[9px] font-black text-[#f5f3c8] whitespace-nowrap">
                          {hw.odds}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 3. BLOC HORN & COMBINATIONS (2 Rangées × 3 Colonnes + Repères Jaune, Bleus, Rouges) */}
                  <div className="relative border-2 border-[#dce780] bg-[#115035]">
                    
                    {/* Rangée Supérieure du Horn : [3 (1-2) 15 FOR 1] | [2 (1-1) 30 FOR 1] | [12 (6-6) 30 FOR 1] */}
                    <div className="grid grid-cols-3 border-b-2 border-[#dce780]">
                      {[
                        { spot: 'HORN_3_BOX', d1: 1, d2: 2, label: '15 FOR 1', borderR: true },
                        { spot: 'HORN_2_BOX', d1: 1, d2: 1, label: '30 FOR 1', borderR: true },
                        { spot: 'HORN_12_BOX', d1: 6, d2: 6, label: '30 FOR 1', borderR: false },
                      ].map((box) => {
                        const betHere = getBetAtSpot(box.spot);
                        return (
                          <div
                            key={box.spot}
                            className={`h-14 flex flex-col items-center justify-center relative ${
                              box.borderR ? 'border-r-2 border-[#dce780]' : ''
                            }`}
                          >
                            <div className="flex items-center gap-1">
                              <FeltMiniDie value={box.d1} size={19} />
                              <FeltMiniDie value={box.d2} size={19} />
                            </div>
                            <span className="text-[9px] font-black text-[#f5f3c8] mt-1">
                              {box.label}
                            </span>

                            {betHere && (
                              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                                <MiniPropChipStack
                                  betEntry={betHere}
                                  isSolved={stickMultiRound?.paid}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Rangée Inférieure du Horn : [11 (6-5) 15 FOR 1] | [BET THE HORN] | [11 (6-5) 15 FOR 1] */}
                    <div className="grid grid-cols-3">
                      {/* 11 Gauche */}
                      <div className="h-14 border-r-2 border-[#dce780] flex flex-col items-center justify-center relative">
                        <div className="flex items-center gap-1">
                          <FeltMiniDie value={6} size={19} />
                          <FeltMiniDie value={5} size={19} />
                        </div>
                        <span className="text-[9px] font-black text-[#f5f3c8] mt-1">15 FOR 1</span>

                        {getBetAtSpot('HORN_11L_BOX') && (
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                            <MiniPropChipStack
                              betEntry={getBetAtSpot('HORN_11L_BOX')}
                              isSolved={stickMultiRound?.paid}
                            />
                          </div>
                        )}
                      </div>

                      {/* BET THE HORN (Centre) */}
                      <div className="h-14 border-r-2 border-[#dce780] flex flex-col items-center justify-center relative px-1 text-center">
                        <span className="text-xs font-black font-serif leading-tight tracking-tight text-[#e88352]">
                          BET THE
                          <br />
                          HORN
                        </span>

                        {getBetAtSpot('BET_THE_HORN_BOX') && (
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                            <MiniPropChipStack
                              betEntry={getBetAtSpot('BET_THE_HORN_BOX')}
                              isSolved={stickMultiRound?.paid}
                            />
                          </div>
                        )}
                      </div>

                      {/* 11 Droite */}
                      <div className="h-14 flex flex-col items-center justify-center relative">
                        <div className="flex items-center gap-1">
                          <FeltMiniDie value={6} size={19} />
                          <FeltMiniDie value={5} size={19} />
                        </div>
                        <span className="text-[9px] font-black text-[#f5f3c8] mt-1">15 FOR 1</span>
                      </div>
                    </div>

                    {/* REPÈRE JAUNE : 3-Way Craps */}
                    <div
                      className={`w-3.5 h-3.5 rounded-full border border-dashed border-[#facc15] bg-[#facc15]/20 absolute -left-2 top-[25%] -translate-y-1/2 flex items-center justify-center ${
                        getBetAtSpot('YELLOW_3WAY') ? 'ring-2 ring-[#facc15] z-40' : 'opacity-65'
                      }`}
                    >
                      {getBetAtSpot('YELLOW_3WAY') && (
                        <MiniPropChipStack
                          betEntry={getBetAtSpot('YELLOW_3WAY')}
                          isSolved={stickMultiRound?.paid}
                        />
                      )}
                    </div>

                    {/* REPÈRE BLEU 1 : Split 3 & 2 */}
                    <div
                      className={`w-3 h-3 rounded-full border border-dashed border-[#60a5fa] bg-[#60a5fa]/20 absolute left-[33.33%] top-[25%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${
                        getBetAtSpot('BLUE_SPLIT_3_2') ? 'ring-2 ring-[#60a5fa] z-40' : 'opacity-65'
                      }`}
                    >
                      {getBetAtSpot('BLUE_SPLIT_3_2') && (
                        <MiniPropChipStack
                          betEntry={getBetAtSpot('BLUE_SPLIT_3_2')}
                          isSolved={stickMultiRound?.paid}
                        />
                      )}
                    </div>

                    {/* REPÈRE BLEU 2 : Split 2 & 12 */}
                    <div
                      className={`w-3 h-3 rounded-full border border-dashed border-[#60a5fa] bg-[#60a5fa]/20 absolute left-[66.66%] top-[25%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${
                        getBetAtSpot('BLUE_SPLIT_2_12') ? 'ring-2 ring-[#60a5fa] z-40' : 'opacity-65'
                      }`}
                    >
                      {getBetAtSpot('BLUE_SPLIT_2_12') && (
                        <MiniPropChipStack
                          betEntry={getBetAtSpot('BLUE_SPLIT_2_12')}
                          isSolved={stickMultiRound?.paid}
                        />
                      )}
                    </div>

                    {/* REPÈRE BLEU 3 : Split 3 & 11 */}
                    <div
                      className={`w-3 h-3 rounded-full border border-dashed border-[#60a5fa] bg-[#60a5fa]/20 absolute left-[16.66%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${
                        getBetAtSpot('BLUE_SPLIT_3_11') ? 'ring-2 ring-[#60a5fa] z-40' : 'opacity-65'
                      }`}
                    >
                      {getBetAtSpot('BLUE_SPLIT_3_11') && (
                        <MiniPropChipStack
                          betEntry={getBetAtSpot('BLUE_SPLIT_3_11')}
                          isSolved={stickMultiRound?.paid}
                        />
                      )}
                    </div>

                    {/* REPÈRE BLEU 4 : Split 12 & 11 */}
                    <div
                      className={`w-3 h-3 rounded-full border border-dashed border-[#60a5fa] bg-[#60a5fa]/20 absolute left-[83.33%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${
                        getBetAtSpot('BLUE_SPLIT_12_11') ? 'ring-2 ring-[#60a5fa] z-40' : 'opacity-65'
                      }`}
                    >
                      {getBetAtSpot('BLUE_SPLIT_12_11') && (
                        <MiniPropChipStack
                          betEntry={getBetAtSpot('BLUE_SPLIT_12_11')}
                          isSolved={stickMultiRound?.paid}
                        />
                      )}
                    </div>

                    {/* REPÈRE ROUGE GAUCHE : Horn High 3 */}
                    <div
                      className={`w-3.5 h-3.5 rounded-full border border-dashed border-[#f87171] bg-[#f87171]/25 absolute left-[33.33%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${
                        getBetAtSpot('RED_HH_LEFT') ? 'ring-2 ring-[#f87171] z-40' : 'opacity-70'
                      }`}
                    >
                      {getBetAtSpot('RED_HH_LEFT') && (
                        <MiniPropChipStack
                          betEntry={getBetAtSpot('RED_HH_LEFT')}
                          isSolved={stickMultiRound?.paid}
                        />
                      )}
                    </div>

                    {/* REPÈRE ROUGE DROITE : Horn High 12 */}
                    <div
                      className={`w-3.5 h-3.5 rounded-full border border-dashed border-[#f87171] bg-[#f87171]/25 absolute left-[66.66%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${
                        getBetAtSpot('RED_HH_RIGHT') ? 'ring-2 ring-[#f87171] z-40' : 'opacity-70'
                      }`}
                    >
                      {getBetAtSpot('RED_HH_RIGHT') && (
                        <MiniPropChipStack
                          betEntry={getBetAtSpot('RED_HH_RIGHT')}
                          isSolved={stickMultiRound?.paid}
                        />
                      )}
                    </div>
                  </div>

                  {/* 4. BOÎTE ANY CRAPS (8 FOR 1 — Any Craps — 8 FOR 1) */}
                  <div className="mx-3">
                    <div
                      className={`h-9 border-2 bg-[#115035] flex items-center justify-between px-2.5 relative transition-all ${
                        getBetAtSpot('ANY_CRAPS_BOX') ? 'border-[#f5d547]' : 'border-[#dce780]'
                      }`}
                    >
                      <span className="text-[10px] font-black text-[#f5f3c8]">8 FOR 1</span>
                      <span className="text-sm font-black italic font-serif tracking-wide text-[#e88352]">
                        Any Craps
                      </span>
                      <span className="text-[10px] font-black text-[#f5f3c8]">8 FOR 1</span>

                      {getBetAtSpot('ANY_CRAPS_BOX') && (
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                          <MiniPropChipStack
                            betEntry={getBetAtSpot('ANY_CRAPS_BOX')}
                            isSolved={stickMultiRound?.paid}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* COLONNE DROITE : Cercles C - E reliés */}
                <div className="w-9 flex flex-col justify-center items-center gap-1.5 py-2">
                  {[0, 1, 2, 3, 4, 5].map((rowIdx) => (
                    <div key={`ce-right-${rowIdx}`} className="flex items-center gap-0.5">
                      <div className="w-3.5 h-3.5 rounded-full border border-[#dce780] flex items-center justify-center text-[8px] font-black text-[#dce780]">
                        C
                      </div>
                      <div className="w-1 h-[1.5px] bg-[#dce780]" />
                      <div className="w-3.5 h-3.5 rounded-full border border-[#dce780] flex items-center justify-center text-[8px] font-black text-[#dce780]">
                        E
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bandeau d'explication en bas du tapis */}
              <div className="mt-1 px-2 py-1 rounded-lg bg-[#0c261a]/95 border border-[#28593f] flex items-center justify-between text-[10px]">
                <span className="text-[#c5e3d1] font-bold truncate">
                  {showOrderHelper && stickMultiRound
                    ? `Brut ${stickMultiRound.totalGrossWin}€ − Total Tapis ${stickMultiRound.totalTableBets}€ (Still Up) = ${stickMultiRound.totalPayout}€`
                    : `Toutes les mises affichées (${stickMultiRound?.totalTableBets || 0}€ au total) restent Still Up`}
                </span>
              </div>
            </div>
          ) : (
            /* ===================================================================== */
            /* --- TAPIS MODULE 3 : LIGNES DE PLACE BETS (RAMPE 4 - 5 - SIX - 8 - NINE - 10) --- */
            /* ===================================================================== */
            <div className="relative my-1 flex-1 min-h-[340px] rounded-2xl bg-[#166444] border-2 border-[#7aa37c] shadow-[inset_0_0_35px_rgba(0,0,0,0.55)] px-2.5 py-2 flex flex-col justify-between overflow-hidden select-none">
              
              {/* Barre supérieure : Bulle de dialogue du client + filtre Ligne / Intérieurs */}
              <div className="flex items-center justify-between gap-2 bg-[#0a2317]/90 border border-[#2b5e43] rounded-xl px-2.5 py-1.5 shadow">
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#90bd9f]">
                    Demande du client au croupier :
                  </span>
                  <span className="text-sm font-black text-[#f5d547] truncate">
                    {lineRound?.clientQuote || '« Faites-moi la ligne par 25 ! »'}
                  </span>
                </div>

                <div className="flex items-center gap-0.5 bg-[#06170f] p-0.5 rounded-lg border border-[#24523a] shrink-0">
                  {[
                    { id: 'ALL', label: 'Mix' },
                    { id: 'ACROSS', label: 'Ligne' },
                    { id: 'INSIDE', label: 'Int.' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setLineModeFilter(m.id);
                        generateLineRound(m.id);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-black transition-colors ${
                        lineModeFilter === m.id
                          ? 'bg-[#dce780] text-[#092014]'
                          : 'text-[#89b59c] hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* RAMPE OFFICIELLE DES 6 POINTS (4 | 5 | SIX | 8 | NINE | 10) D'APRÈS LA PHOTO */}
              <div className="my-1.5 relative px-1 py-3">
                <div className="grid grid-cols-6 border-[2.5px] border-[#d7e582] bg-[#145a3d] shadow-lg">
                  {[
                    { pt: 4, label: '4', tilted: false },
                    { pt: 5, label: '5', tilted: false },
                    { pt: 6, label: 'SIX', tilted: true },
                    { pt: 8, label: '8', tilted: false },
                    { pt: 9, label: 'NINE', tilted: true },
                    { pt: 10, label: '10', tilted: false },
                  ].map((box, idx) => {
                    const isMarked = lineRound?.markedPoint === box.pt;
                    const isIncludedInLine = lineRound?.activePoints?.includes(box.pt);
                    const pointBetAmount = lineRound?.betsByPoint?.[box.pt] || 0;

                    return (
                      <div
                        key={box.pt}
                        className={`relative h-28 flex flex-col justify-between items-center py-1 ${
                          idx < 5 ? 'border-r-[2.5px] border-[#d7e582]' : ''
                        } ${
                          isMarked
                            ? 'bg-[#0e3f2a]/85'
                            : isIncludedInLine
                            ? 'bg-[#196b49]'
                            : 'bg-[#114831]/70 opacity-65'
                        }`}
                      >
                        {/* 4 petits cercles jaunes en haut chevauchant la bordure supérieure */}
                        <div className="w-full flex items-center justify-around px-0.5 -mt-3 z-10">
                          {[0, 1, 2, 3].map((c) => (
                            <div
                              key={`top-c-${box.pt}-${c}`}
                              className="w-3 h-3 rounded-full border-[1.8px] border-[#d7e582] bg-[#145a3d]"
                            />
                          ))}
                        </div>

                        {/* Centre de la boîte : Numéro du point + Puck ON si point marqué, ou montant d'aide si 1-2-3 activé */}
                        <div className="relative flex-1 w-full flex flex-col items-center justify-center">
                          <span
                            className={`font-serif font-black text-white select-none leading-none ${
                              box.tilted ? 'text-base italic tracking-tight' : 'text-2xl'
                            }`}
                            style={box.tilted ? { transform: 'rotate(-14deg)' } : undefined}
                          >
                            {box.label}
                          </span>

                          {/* PUCK "ON" posé sur le point marqué */}
                          {isMarked && (
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <constOnPuck size={38} />
                            </div>
                          )}

                          {/* Badge du montant individuel posé sur ce point (affiché si aide 1-2-3 ou une fois résolu) */}
                          {!isMarked && isIncludedInLine && (showOrderHelper || lineRound?.solved) && (
                            <div className="mt-1 px-1.5 py-0.5 rounded-full bg-[#112419] border border-[#f5d547] text-[9px] font-black text-[#f5d547] shadow">
                              {pointBetAmount}€
                            </div>
                          )}

                          {/* Petit point lumineux indiquant que la case fait partie de la ligne demandée */}
                          {!isMarked && isIncludedInLine && !showOrderHelper && !lineRound?.solved && (
                            <div className="mt-1 w-2 h-2 rounded-full bg-[#dce780] shadow-[0_0_6px_#dce780]" />
                          )}
                        </div>

                        {/* 4 petits cercles jaunes en bas chevauchant la bordure inférieure */}
                        <div className="w-full flex items-center justify-around px-0.5 -mb-3 z-10">
                          {[0, 1, 2, 3].map((c) => (
                            <div
                              key={`bot-c-${box.pt}-${c}`}
                              className="w-3 h-3 rounded-full border-[1.8px] border-[#d7e582] bg-[#145a3d]"
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ZONE DES JETONS POSÉS PAR LE CLIENT SUR LE TAPIS */}
              <div className="px-3 py-2 rounded-xl bg-[#0d2d1e]/95 border border-[#2f694b] flex items-center justify-between gap-2 shadow-inner">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-[#99c4aa]">
                    Jetons envoyés par le client :
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-white">
                      {lineRound?.givenTotal || 200} €
                    </span>
                    <span className="text-xs font-bold text-[#dce780]">
                      ({lineRound?.givenDesc || '2 × 100€'})
                    </span>
                  </div>
                  {showOrderHelper && lineRound && (
                    <span className="text-[10px] font-extrabold text-[#7dd3fc] mt-0.5">
                      Aide : Ligne = {lineRound.totalLineCost}€ | Change = {lineRound.expectedChange}€
                    </span>
                  )}
                </div>

                {/* Affichage visuel des jetons posés par le client */}
                <div className="flex items-center gap-1.5">
                  {lineRound?.givenChips?.map((denom, idx) => (
                    <div key={idx} className="transform hover:scale-105 transition-transform">
                      <MonteCarloChip denom={denom} size={42} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* AFFICHEUR DU MONTANT SAISI (OU 2 CASES POUR MODULE LIGNES) */}
          {/* ========================================== */}
          {activeTab === 'LINES' ? (
            <div className="my-0.5 grid grid-cols-2 gap-1.5">
              {/* Case 1 : Montant de la Ligne à prendre */}
              <button
                type="button"
                onClick={() => {
                  playFeedbackSound('tap');
                  setActiveLineField('COST');
                }}
                className={`px-3 py-1.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  activeLineField === 'COST'
                    ? 'bg-[#123826] border-[#dce780] ring-2 ring-[#dce780]/40'
                    : 'bg-[#0b2318] border-[#1d4631] opacity-85'
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#9ec4ad]">
                    1. Montant Ligne
                  </span>
                  <span className="text-[10px] font-bold text-[#dce780] truncate">
                    À prendre
                  </span>
                </div>
                <div className="text-lg font-black text-white shrink-0">
                  {lineCostInput} <span className="text-xs text-[#6ee7b7]">€</span>
                </div>
              </button>

              {/* Case 2 : Change à rendre au client */}
              <button
                type="button"
                onClick={() => {
                  playFeedbackSound('tap');
                  setActiveLineField('CHANGE');
                }}
                className={`px-3 py-1.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  activeLineField === 'CHANGE'
                    ? 'bg-[#123826] border-[#dce780] ring-2 ring-[#dce780]/40'
                    : 'bg-[#0b2318] border-[#1d4631] opacity-85'
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#9ec4ad]">
                    2. Change Client
                  </span>
                  <span className="text-[10px] font-bold text-[#88d4ee] truncate">
                    À rendre
                  </span>
                </div>
                <div className="text-lg font-black text-white shrink-0">
                  {lineChangeInput} <span className="text-xs text-[#88d4ee]">€</span>
                </div>
              </button>
            </div>
          ) : (
            <div className="my-0.5 px-3 py-1.5 rounded-xl bg-[#0b2318] border border-[#1d4631] flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Calculator className="w-4 h-4 text-[#b8d483] shrink-0" />
                {activeTab !== 'STICK' ? (
                  activeBaseBet ? (
                    <div className="text-xs font-extrabold text-[#d5e8d4] truncate">
                      {activeBaseBet.type === 'COME'
                        ? `COME ${activeBaseBet.bet}€ + ODDS ${activeBaseBet.odds}€ (Max ${getMaxOddsMultiplier(pointNumber)}×)`
                        : `PLACE BET ${activeBaseBet.bet}€ (POINT ${pointNumber})`}
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-[#7ca58d] uppercase tracking-wide truncate">
                      TOUCHE UNE MISE SUR LE TAPIS...
                    </span>
                  )
                ) : stickMultiRound ? (
                  <div className="text-xs font-extrabold text-[#d5e8d4] truncate">
                    TOTAL GLOBAL STILL UP ({stickMultiRound.bets.map((b) => `${b.shortName} ${b.bet}€`).join(' + ')})
                  </div>
                ) : (
                  <span className="text-xs font-bold text-[#7ca58d] uppercase tracking-wide truncate">
                    CALCULE LE PAIEMENT GLOBAL...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {inputAmount > 0 && (
                  <div className="hidden sm:flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#123826] text-[#9bd4b3] font-bold">
                    {currentInputBreakdown
                      .slice(0, 2)
                      .map((c) => `${c.count}×${c.denom}`)
                      .join(' + ')}
                  </div>
                )}
                <div className="text-lg font-black text-[#48b884]">
                  {inputAmount} <span className="text-xs">€</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* CLAVIER JETONS MONTE-CARLO + PAVÉ COMPACT  */}
          {/* ========================================== */}
          <div className="p-1.5 rounded-2xl bg-[#0a2016] border border-[#1b412d] space-y-1.5">
            <div className="flex items-center gap-1">
              {[1, 5, 25, 100, 500].map((denom) => (
                <HalfChipButton key={denom} denom={denom} onClick={handleAddChipValue} />
              ))}
            </div>

            <div className="grid grid-cols-4 gap-1">
              {[7, 8, 9].map((n) => (
                <button
                  key={n}
                  onClick={() => handleDigitPress(n)}
                  className="h-9 rounded-xl bg-[#0e2c1e] border border-[#214d36] text-sm font-black text-[#b8d4be] active:bg-[#194932] transition-colors"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={handleBackspace}
                className="h-9 rounded-xl bg-[#0e2c1e] border border-[#214d36] flex items-center justify-center text-[#8bb59b] active:bg-[#194932]"
                title="Effacer le dernier chiffre"
              >
                <Delete className="w-4 h-4" />
              </button>

              {[4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => handleDigitPress(n)}
                  className="h-9 rounded-xl bg-[#0e2c1e] border border-[#214d36] text-sm font-black text-[#b8d4be] active:bg-[#194932] transition-colors"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={handleResetInput}
                className="h-9 rounded-xl bg-[#271815] border border-[#522d25] text-xs font-black text-[#d49a89] active:bg-[#3d221d]"
              >
                RAZ
              </button>

              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => handleDigitPress(n)}
                  className="h-9 rounded-xl bg-[#0e2c1e] border border-[#214d36] text-sm font-black text-[#b8d4be] active:bg-[#194932] transition-colors"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => {
                  playFeedbackSound('tap');
                  if (activeTab === 'STICK') {
                    generateStickRound();
                  } else if (activeTab === 'LINES') {
                    generateLineRound();
                  } else {
                    generateBaseRound();
                  }
                }}
                className="h-9 rounded-xl bg-[#0f3524] border border-[#2c684b] text-[11px] font-extrabold text-[#9de2be] active:bg-[#184f36] px-1"
              >
                {activeTab === 'STICK'
                  ? 'Autre Jet'
                  : activeTab === 'LINES'
                  ? 'Autre Ligne'
                  : 'Autre Point'}
              </button>

              <button
                onClick={() => handleDigitPress(0)}
                className="h-10 rounded-xl bg-[#0e2c1e] border border-[#214d36] text-sm font-black text-[#b8d4be] active:bg-[#194932]"
              >
                0
              </button>

              <button
                onClick={handleValidatePayout}
                className={`col-span-3 h-10 rounded-xl border font-black text-xs tracking-wide flex items-center justify-center gap-1.5 transition-all shadow-lg ${
                  (activeTab === 'BASE' && selectedBetId) || activeTab !== 'BASE'
                    ? 'bg-gradient-to-r from-[#1f6e4a] to-[#288c5e] border-[#6ee7b7] text-white active:scale-98'
                    : 'bg-[#0f3524] border-[#2b694b] text-[#7ed6a8]'
                }`}
              >
                <span>👆</span>
                <span>
                  {activeTab === 'STICK'
                    ? `VALIDER PAIEMENT GLOBAL (${inputAmount} €)`
                    : activeTab === 'LINES'
                    ? `VALIDER LIGNE (${lineCostInput}€) & CHANGE (${lineChangeInput}€)`
                    : selectedBetId
                    ? `VALIDER LE PAIEMENT (${inputAmount} €)`
                    : 'TOUCHE LA 1E MISE SUR LE TAPIS'}
                </span>
              </button>
            </div>
          </div>
        </>

        {/* ========================================== */}
        {/* MODALE PARAMÈTRES & SENS DU STICKMAN       */}
        {/* ========================================== */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#0c261a] border-2 border-[#397354] p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#214a34] pb-3">
                <h3 className="text-sm font-black text-[#dce780] uppercase flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Réglages Table & Croupier
                </h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-xs font-bold text-[#8ab49a] hover:text-white px-2 py-1 rounded bg-[#143927]"
                >
                  Fermer
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#b8d8c5] block">
                  Position du Stickman (Sens de paiement sur la boîte)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (stickmanSide !== 'LEFT') toggleStickmanSide();
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                      stickmanSide === 'LEFT'
                        ? 'bg-[#dce780] text-[#092014] border-[#dce780]'
                        : 'bg-[#081b12] text-[#94b8a3] border-[#255039]'
                    }`}
                  >
                    👈 Stickman à Gauche
                  </button>
                  <button
                    onClick={() => {
                      if (stickmanSide !== 'RIGHT') toggleStickmanSide();
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                      stickmanSide === 'RIGHT'
                        ? 'bg-[#dce780] text-[#092014] border-[#dce780]'
                        : 'bg-[#081b12] text-[#94b8a3] border-[#255039]'
                    }`}
                  >
                    Stickman à Droite 👉
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#081b12] border border-[#255039]">
                <span className="text-xs font-bold text-[#b8d8c5]">Sons de retour tactile</span>
                <button
                  onClick={() => setSoundEnabled((v) => !v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 ${
                    soundEnabled ? 'bg-[#256947] text-white' : 'bg-[#2a1d1d] text-[#d88b8b]'
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  {soundEnabled ? 'Activés' : 'Muets'}
                </button>
              </div>

              <button
                onClick={() => {
                  setStreak(0);
                  setTotalAttempts(0);
                  setCorrectAttempts(0);
                  setShowSettingsModal(false);
                }}
                className="w-full py-2.5 rounded-xl bg-[#2c1919] border border-[#6b3232] text-xs font-extrabold text-[#f59898] hover:bg-[#3d2121]"
              >
                Réinitialiser les statistiques de session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
