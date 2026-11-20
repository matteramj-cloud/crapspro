import React, { useState, useEffect, useCallback, useMemo, useId } from 'react';
import {
  Flame, Trophy, Clock, Settings, Calculator, Delete,
  CheckCircle2, BookOpen, Volume2, VolumeX, X
} from 'lucide-react';

// ==========================================
// 1. DESIGN DES JETONS "MONTE-CARLO" (SVG)
// ==========================================
interface ChipSpec {
  base: string;
  insertOuter: string;
  insertInner: string;
  ringColor: string;
  birdColor: string;
  label: string;
  name: string;
}

const CHIP_SPECS: Record<number, ChipSpec> = {
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
    insertInner: '#ebb434',
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
  },
  1000: {
    base: '#c98a1c',
    insertOuter: '#1a1a1a',
    insertInner: '#f6e27f',
    ringColor: '#1a1a1a',
    birdColor: '#1a1a1a',
    label: '1K',
    name: '1 000 €'
  },
  5000: {
    base: '#4d2b6b',
    insertOuter: '#f6e27f',
    insertInner: '#d4495a',
    ringColor: '#f6e27f',
    birdColor: '#f6e27f',
    label: '5K',
    name: '5 000 €'
  }
};

// Composant SVG haute-fidélité des jetons Monte-Carlo
const MonteCarloChip = ({
  denom,
  size = 46,
  className = '',
  showText = true
}: {
  denom: number;
  size?: number;
  className?: string;
  showText?: boolean;
}) => {
  const spec = CHIP_SPECS[denom] || CHIP_SPECS[25];
  const uniqueId = useId().replace(/:/g, '');

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
        y={denom >= 100 ? '57' : '58.5'}
        textAnchor="middle"
        fill="#b89947"
        stroke="#151515"
        strokeWidth="1.8"
        paintOrder="stroke"
        fontSize={denom >= 100 ? '22' : '27'}
        fontWeight="900"
        fontFamily="Georgia, serif"
      >
        {spec.label}
      </text>
    </svg>
  );
};

// Bouton Demi-Jeton pour la barre de saisie rapide (+1, +5, +25, +100, +500)
const HalfChipButton = ({ denom, onClick }: { denom: number; onClick: (d: number) => void }) => {
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

function getChipBreakdown(amount: number): Array<{ denom: number; count: number }> {
  let rem = amount;
  const breakdown: Array<{ denom: number; count: number }> = [];
  for (const d of DENOMS) {
    if (rem >= d) {
      const count = Math.floor(rem / d);
      breakdown.push({ denom: d, count });
      rem %= d;
    }
  }
  return breakdown;
}

function isPayableInMaxTwoColors(amount: number): boolean {
  if (amount <= 0 || !Number.isInteger(amount)) return false;
  const breakdown = getChipBreakdown(amount);
  return breakdown.length <= 2;
}

// Pile physique ordonnée du plus grand (en bas, index 0) au plus petit (en haut, dernier index)
function buildVisualStack(amount: number, maxChipsPerDenom = 3): number[] {
  const breakdown = getChipBreakdown(amount);
  const visual: number[] = [];
  breakdown.forEach(({ denom, count }) => {
    const capped = Math.min(count, maxChipsPerDenom);
    for (let i = 0; i < capped; i++) {
      visual.push(denom);
    }
  });
  return visual;
}

// Calculs officiels des paiements de base
function calculatePointPayout(point: number, type: 'PLACE' | 'COME', bet: number, odds = 0): number {
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

function getMaxOddsMultiplier(point: number): number {
  if (point === 4 || point === 10) return 3;
  if (point === 5 || point === 9) return 4;
  if (point === 6 || point === 8) return 5;
  return 3;
}

interface BaseTableBet {
  id: string;
  type: 'COME' | 'PLACE';
  col: number;
  rowPos: 'COME_TOP' | 'COME_BOTTOM' | 'PLACE_TOP' | 'PLACE_BOTTOM';
  sideGroup: 'TOP' | 'BOTTOM';
  bet: number;
  odds: number;
  payout: number;
  paid: boolean;
  order: number;
}

// Trajectoire en boucle (Fer à cheval Monte-Carlo)
function getLoopPathScore(betItem: Pick<BaseTableBet, 'type' | 'sideGroup' | 'col'>, stickmanSide: 'LEFT' | 'RIGHT'): number {
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
const VALID_PLACE_BETS: Record<number, Array<{ bet: number; payout: number }>> = {
  4: [], 5: [], 6: [], 8: [], 9: [], 10: []
};
const VALID_COME_BETS: Record<number, Array<{ bet: number; odds: number; payout: number }>> = {
  4: [], 5: [], 6: [], 8: [], 9: [], 10: []
};

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
interface PropBetSpotSpec {
  id: string;
  shortName: string;
  fullName: string;
  divisor: number;
  minBet: number;
  allowedBets: number[];
  getGrossWinMultiplier: (rollTotal: number) => number;
  getGrossFormula: (bet: number, unit: number, rollTotal: number) => string;
}

const PROP_BET_SPOTS: Record<string, PropBetSpotSpec> = {
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
      if (rollTotal === 3) return 30;
      if (rollTotal === 2 || rollTotal === 12) return 30;
      if (rollTotal === 11) return 15;
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
      if (rollTotal === 12) return 60;
      if (rollTotal === 2) return 30;
      if (rollTotal === 3 || rollTotal === 11) return 15;
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
    getGrossWinMultiplier: (rollTotal) => (rollTotal === 2 || rollTotal === 12 ? 30 : 0),
    getGrossFormula: (bet, unit) => `Split 2-12 ${bet}€ [U=${unit}€×30 = ${unit * 30}€ brut]`
  },
  BLUE_SPLIT_3_11: {
    id: 'BLUE_SPLIT_3_11',
    shortName: 'Split 3-11',
    fullName: 'À cheval 3 & 11 (÷2, min 4€)',
    divisor: 2,
    minBet: 4,
    allowedBets: [4, 6, 8, 10, 20, 30, 40, 50],
    getGrossWinMultiplier: (rollTotal) => (rollTotal === 3 || rollTotal === 11 ? 15 : 0),
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

const STICK_ROLL_TEMPLATES = [
  {
    rollTotal: 11,
    rollName: 'Eleven (11)',
    diceOptions: [[5, 6], [6, 5]],
    winningSpots: [
      'PURPLE_CE', 'BLUE_SPLIT_12_11', 'BLUE_SPLIT_3_11', 'HORN_11L_BOX',
      'BET_THE_HORN_BOX', 'RED_HH_LEFT', 'RED_HH_RIGHT', 'GREEN_SEVEN_ELEVEN'
    ]
  },
  {
    rollTotal: 3,
    rollName: '3 Craps (Ace-Deuce)',
    diceOptions: [[1, 2], [2, 1]],
    winningSpots: [
      'YELLOW_3WAY', 'PURPLE_CE', 'ANY_CRAPS_BOX', 'HORN_3_BOX',
      'BLUE_SPLIT_3_2', 'BLUE_SPLIT_3_11', 'BET_THE_HORN_BOX', 'RED_HH_LEFT', 'RED_HH_RIGHT'
    ]
  },
  {
    rollTotal: 2,
    rollName: '2 Craps (Aces)',
    diceOptions: [[1, 1]],
    winningSpots: [
      'YELLOW_3WAY', 'PURPLE_CE', 'ANY_CRAPS_BOX', 'HORN_2_BOX',
      'BLUE_SPLIT_3_2', 'BLUE_SPLIT_2_12', 'BET_THE_HORN_BOX', 'RED_HH_LEFT', 'RED_HH_RIGHT'
    ]
  },
  {
    rollTotal: 12,
    rollName: '12 Craps (Boxcars)',
    diceOptions: [[6, 6]],
    winningSpots: [
      'YELLOW_3WAY', 'PURPLE_CE', 'ANY_CRAPS_BOX', 'HORN_12_BOX',
      'BLUE_SPLIT_2_12', 'BLUE_SPLIT_12_11', 'BET_THE_HORN_BOX', 'RED_HH_RIGHT', 'RED_HH_LEFT'
    ]
  },
  {
    rollTotal: 7,
    rollName: 'Seven (7)',
    diceOptions: [[4, 3], [5, 2], [6, 1]],
    winningSpots: ['SEVEN_BOX', 'GREEN_SEVEN_ELEVEN']
  }
];

const SPOT_CONFLICTS: Record<string, string[]> = {
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

function canAddSpot(chosenIds: string[], candidateId: string): boolean {
  if (chosenIds.includes(candidateId)) return false;
  const conflicts = SPOT_CONFLICTS[candidateId] || [];
  return !chosenIds.some((id) => conflicts.includes(id));
}

interface StickBetEntry {
  spotId: string;
  shortName: string;
  fullName: string;
  divisor: number;
  bet: number;
  unit: number;
  grossMult: number;
  grossWin: number;
  netContribution: number;
  formula: string;
}

interface StickMultiRound {
  id: string;
  rollTotal: number;
  rollName: string;
  dice: number[];
  bets: StickBetEntry[];
  totalGrossWin: number;
  totalTableBets: number;
  totalPayout: number;
  winningCount: number;
  paid: boolean;
}

// ==========================================
// 2C. MODULE 3 : BARÈME OFFICIEL "PLACE BET.PDF" (SOURCE DE VÉRITÉ)
// ==========================================
// Toutes les valeurs ci-dessous proviennent strictement du tableau de référence
// `Place bet.pdf` (Place Bets Lignes + Place Bets Inside et Outside),
// incluant les paliers standards (10 à 75 €) et les variantes avec «BUY» (100 à 5000 €).

export type PlaceBetTier =
  | 10 | 15 | 20 | 25 | 50 | 75
  | 100 | 200 | 300 | 500 | 1000 | 1500 | 2000 | 2500 | 3000 | 5000;

export type PlaceBetCategory = 'ACROSS' | 'INSIDE' | 'OUTSIDE';
export type PlaceBetPointCase = '6_8' | '5_9' | '4_10' | 'INCLUDING';
export type LineModeFilter = 'ALL' | 'ACROSS' | 'INSIDE' | 'OUTSIDE' | 'INCLUDING';
export type LineTierFilter = 'ALL' | 'STANDARD' | 'BUY';

export interface PlaceBetTierRow {
  /** Mise de base "par" / ligne en euros */
  tier: PlaceBetTier;
  /** true à partir de 100 € : variante «BUY» (commission 5% sur 4 et 10) */
  hasBuy: boolean;
  /** Détail exact par numéro correspondant aux montants officiels du tableau */
  perPoint: {
    /** Coût total d'un numéro 4 ou 10 (mise + commission BUY 5% si hasBuy) */
    p4_10: number;
    /** Commission BUY incluse dans p4_10 (0 pour 10..75€) */
    buyVig4_10: number;
    /** Mise posée sur un numéro 5 ou 9 */
    p5_9: number;
    /** Mise posée sur un numéro 6 ou 8 */
    p6_8: number;
  };
  /** Section 1 du PDF : PLACE BETS LIGNES (Across & Including the point) */
  lignes: Record<PlaceBetPointCase, number>;
  /** Section 2 du PDF : PLACE BETS INSIDE (5, 6, 8, 9 — jamais de BUY) */
  inside: Record<PlaceBetPointCase, number>;
  /** Section 2 du PDF : PLACE BETS OUTSIDE (4, 5, 9, 10 — avec «BUY» dès 100€) */
  outside: Record<PlaceBetPointCase, number>;
}

export const PLACE_BET_STANDARD_TIERS: readonly PlaceBetTier[] = [
  10, 15, 20, 25, 50, 75
] as const;

export const PLACE_BET_BUY_TIERS: readonly PlaceBetTier[] = [
  100, 200, 300, 500, 1000, 1500, 2000, 2500, 3000, 5000
] as const;

export const PLACE_BET_ALL_TIERS: readonly PlaceBetTier[] = [
  ...PLACE_BET_STANDARD_TIERS,
  ...PLACE_BET_BUY_TIERS
] as const;

export const PLACE_BET_REFERENCE_TABLE: Record<PlaceBetTier, PlaceBetTierRow> = {
  // --- PALIERS STANDARDS (10 € à 75 € — SANS «BUY») ---
  10: {
    tier: 10,
    hasBuy: false,
    perPoint: { p4_10: 10, buyVig4_10: 0, p5_9: 10, p6_8: 12 },
    lignes:  { '6_8': 52,  '5_9': 54,  '4_10': 54,  INCLUDING: 64 },
    inside:  { '6_8': 32,  '5_9': 34,  '4_10': 44,  INCLUDING: 44 },
    outside: { '6_8': 40,  '5_9': 30,  '4_10': 30,  INCLUDING: 40 }
  },
  15: {
    tier: 15,
    hasBuy: false,
    perPoint: { p4_10: 15, buyVig4_10: 0, p5_9: 15, p6_8: 18 },
    lignes:  { '6_8': 78,  '5_9': 81,  '4_10': 81,  INCLUDING: 96 },
    inside:  { '6_8': 48,  '5_9': 51,  '4_10': 66,  INCLUDING: 66 },
    outside: { '6_8': 60,  '5_9': 45,  '4_10': 45,  INCLUDING: 60 }
  },
  20: {
    tier: 20,
    hasBuy: false,
    perPoint: { p4_10: 20, buyVig4_10: 0, p5_9: 20, p6_8: 24 },
    lignes:  { '6_8': 104, '5_9': 108, '4_10': 108, INCLUDING: 128 },
    inside:  { '6_8': 64,  '5_9': 68,  '4_10': 88,  INCLUDING: 88 },
    outside: { '6_8': 80,  '5_9': 60,  '4_10': 60,  INCLUDING: 80 }
  },
  25: {
    tier: 25,
    hasBuy: false,
    perPoint: { p4_10: 25, buyVig4_10: 0, p5_9: 25, p6_8: 30 },
    lignes:  { '6_8': 130, '5_9': 135, '4_10': 135, INCLUDING: 160 },
    inside:  { '6_8': 80,  '5_9': 85,  '4_10': 110, INCLUDING: 110 },
    outside: { '6_8': 100, '5_9': 75,  '4_10': 75,  INCLUDING: 100 }
  },
  50: {
    tier: 50,
    hasBuy: false,
    perPoint: { p4_10: 50, buyVig4_10: 0, p5_9: 50, p6_8: 60 },
    lignes:  { '6_8': 260, '5_9': 270, '4_10': 270, INCLUDING: 320 },
    inside:  { '6_8': 160, '5_9': 170, '4_10': 220, INCLUDING: 220 },
    outside: { '6_8': 200, '5_9': 150, '4_10': 150, INCLUDING: 200 }
  },
  75: {
    tier: 75,
    hasBuy: false,
    perPoint: { p4_10: 75, buyVig4_10: 0, p5_9: 75, p6_8: 90 },
    lignes:  { '6_8': 390, '5_9': 405, '4_10': 405, INCLUDING: 480 },
    inside:  { '6_8': 240, '5_9': 255, '4_10': 330, INCLUDING: 330 },
    outside: { '6_8': 300, '5_9': 225, '4_10': 225, INCLUDING: 300 }
  },

  // --- PALIERS HAUTES LIMITES (100 € à 5000 € — AVEC «BUY» SUR 4 & 10) ---
  100: {
    tier: 100,
    hasBuy: true,
    perPoint: { p4_10: 105, buyVig4_10: 5, p5_9: 125, p6_8: 150 },
    lignes:  { '6_8': 610,   '5_9': 635,   '4_10': 655,   INCLUDING: 760 },
    inside:  { '6_8': 400,   '5_9': 425,   '4_10': 550,   INCLUDING: 550 },
    outside: { '6_8': 460,   '5_9': 335,   '4_10': 355,   INCLUDING: 460 }
  },
  200: {
    tier: 200,
    hasBuy: true,
    perPoint: { p4_10: 210, buyVig4_10: 10, p5_9: 250, p6_8: 300 },
    lignes:  { '6_8': 1220,  '5_9': 1270,  '4_10': 1310,  INCLUDING: 1520 },
    inside:  { '6_8': 800,   '5_9': 850,   '4_10': 1100,  INCLUDING: 1100 },
    outside: { '6_8': 920,   '5_9': 670,   '4_10': 710,   INCLUDING: 920 }
  },
  300: {
    tier: 300,
    hasBuy: true,
    perPoint: { p4_10: 315, buyVig4_10: 15, p5_9: 300, p6_8: 300 },
    lignes:  { '6_8': 1530,  '5_9': 1530,  '4_10': 1515,  INCLUDING: 1830 },
    inside:  { '6_8': 900,   '5_9': 900,   '4_10': 1200,  INCLUDING: 1200 },
    outside: { '6_8': 1230,  '5_9': 930,   '4_10': 915,   INCLUDING: 1230 }
  },
  500: {
    tier: 500,
    hasBuy: true,
    perPoint: { p4_10: 525, buyVig4_10: 25, p5_9: 500, p6_8: 600 },
    lignes:  { '6_8': 2650,  '5_9': 2750,  '4_10': 2725,  INCLUDING: 3250 },
    inside:  { '6_8': 1600,  '5_9': 1700,  '4_10': 2200,  INCLUDING: 2200 },
    outside: { '6_8': 2050,  '5_9': 1550,  '4_10': 1525,  INCLUDING: 2050 }
  },
  1000: {
    tier: 1000,
    hasBuy: true,
    perPoint: { p4_10: 1050, buyVig4_10: 50, p5_9: 1000, p6_8: 1200 },
    lignes:  { '6_8': 5300,  '5_9': 5500,  '4_10': 5450,  INCLUDING: 6500 },
    inside:  { '6_8': 3200,  '5_9': 3400,  '4_10': 4400,  INCLUDING: 4400 },
    outside: { '6_8': 4100,  '5_9': 3100,  '4_10': 3050,  INCLUDING: 4100 }
  },
  1500: {
    tier: 1500,
    hasBuy: true,
    perPoint: { p4_10: 1575, buyVig4_10: 75, p5_9: 1500, p6_8: 1800 },
    lignes:  { '6_8': 7950,  '5_9': 8250,  '4_10': 8175,  INCLUDING: 9750 },
    inside:  { '6_8': 4800,  '5_9': 5100,  '4_10': 6600,  INCLUDING: 6600 },
    outside: { '6_8': 6150,  '5_9': 4650,  '4_10': 4575,  INCLUDING: 6150 }
  },
  2000: {
    tier: 2000,
    hasBuy: true,
    perPoint: { p4_10: 2100, buyVig4_10: 100, p5_9: 2000, p6_8: 2400 },
    lignes:  { '6_8': 10600, '5_9': 11000, '4_10': 10900, INCLUDING: 13000 },
    inside:  { '6_8': 6400,  '5_9': 6800,  '4_10': 8800,  INCLUDING: 8800 },
    outside: { '6_8': 8200,  '5_9': 6200,  '4_10': 6100,  INCLUDING: 8200 }
  },
  2500: {
    tier: 2500,
    hasBuy: true,
    perPoint: { p4_10: 2625, buyVig4_10: 125, p5_9: 2500, p6_8: 3000 },
    lignes:  { '6_8': 13250, '5_9': 13750, '4_10': 13625, INCLUDING: 16250 },
    inside:  { '6_8': 8000,  '5_9': 8500,  '4_10': 11000, INCLUDING: 11000 },
    outside: { '6_8': 10250, '5_9': 7750,  '4_10': 7625,  INCLUDING: 10250 }
  },
  3000: {
    tier: 3000,
    hasBuy: true,
    perPoint: { p4_10: 3150, buyVig4_10: 150, p5_9: 3000, p6_8: 3000 },
    lignes:  { '6_8': 15300, '5_9': 15300, '4_10': 15150, INCLUDING: 18300 },
    inside:  { '6_8': 9000,  '5_9': 9000,  '4_10': 12000, INCLUDING: 12000 },
    outside: { '6_8': 12300, '5_9': 9300,  '4_10': 9150,  INCLUDING: 12300 }
  },
  5000: {
    tier: 5000,
    hasBuy: true,
    perPoint: { p4_10: 5250, buyVig4_10: 250, p5_9: 5000, p6_8: 6000 },
    lignes:  { '6_8': 26500, '5_9': 27500, '4_10': 27250, INCLUDING: 32500 },
    inside:  { '6_8': 16000, '5_9': 17000, '4_10': 22000, INCLUDING: 22000 },
    outside: { '6_8': 20500, '5_9': 15500, '4_10': 15250, INCLUDING: 20500 }
  }
};

/** Retourne le groupe de point du tableau officiel pour un point marqué (4,5,6,8,9,10) */
function getPointCaseFromNumber(point: number): Exclude<PlaceBetPointCase, 'INCLUDING'> {
  if (point === 6 || point === 8) return '6_8';
  if (point === 5 || point === 9) return '5_9';
  return '4_10';
}

/** Retourne le montant officiel exact issu du tableau de référence `Place bet.pdf` */
function getOfficialPlaceBetAmount(
  tier: PlaceBetTier,
  category: PlaceBetCategory,
  pointCase: PlaceBetPointCase
): number {
  const row = PLACE_BET_REFERENCE_TABLE[tier];
  if (category === 'ACROSS') return row.lignes[pointCase];
  if (category === 'INSIDE') return row.inside[pointCase];
  return row.outside[pointCase];
}

/** Indique si la configuration sélectionnée inclut le «BUY» (4 et/ou 10 joués à partir de 100€) */
function isBuyApplicable(tier: PlaceBetTier, category: PlaceBetCategory): boolean {
  const row = PLACE_BET_REFERENCE_TABLE[tier];
  return row.hasBuy && category !== 'INSIDE';
}

/** Libellé exact de la variante conformément aux en-têtes du PDF */
function getOfficialModeLabel(
  tier: PlaceBetTier,
  category: PlaceBetCategory,
  pointCase: PlaceBetPointCase
): string {
  const buy = isBuyApplicable(tier, category);
  if (category === 'ACROSS') {
    if (pointCase === 'INCLUDING') {
      return buy ? 'Including avec «BUY»' : 'Including the point (Across)';
    }
    return buy ? 'Across avec «BUY»' : 'Across';
  }
  if (category === 'OUTSIDE') {
    const base = buy ? 'Outside avec «BUY»' : 'Outside';
    return pointCase === 'INCLUDING' ? `${base} — Including the point` : base;
  }
  // INSIDE (jamais de BUY car 4 et 10 ne sont pas dans Inside)
  return pointCase === 'INCLUDING' ? 'Inside — Including the point' : 'Inside';
}

/** Libellé court du cas de point du tableau */
function getPointCaseLabel(pointCase: PlaceBetPointCase, markedPoint: number): string {
  if (pointCase === 'INCLUDING') return `Including the point (Pt ${markedPoint} inclus)`;
  if (pointCase === '6_8') return `Point 6 ou 8 (Point ${markedPoint})`;
  if (pointCase === '5_9') return `Point 5 ou 9 (Point ${markedPoint})`;
  return `Point 4 ou 10 (Point ${markedPoint})`;
}

/** Formate un montant en euros lisible (ex: 13 625 €) */
function formatEur(val: number): string {
  return val.toLocaleString('fr-FR');
}

interface LineHandout {
  givenTotal: number;
  chips: number[];
  desc: string;
}

/** Génère une remise de jetons réaliste par le client adaptée au montant (de 30€ jusqu'à 32 500€) */
function generateClientHandout(totalLineCost: number): LineHandout {
  const candidates: LineHandout[] = [];
  const chipDenoms =
    totalLineCost <= 300
      ? [25, 100, 500]
      : totalLineCost <= 2000
      ? [100, 500, 1000]
      : totalLineCost <= 8000
      ? [500, 1000, 5000]
      : [1000, 5000];

  chipDenoms.forEach((chipDenom) => {
    const countNeeded = Math.ceil(totalLineCost / chipDenom);
    if (countNeeded >= 1 && countNeeded <= 8) {
      const givenTotal = countNeeded * chipDenom;
      if (givenTotal >= totalLineCost) {
        candidates.push({
          givenTotal,
          chips: Array(Math.min(countNeeded, 5)).fill(chipDenom),
          desc: `${countNeeded} × ${formatEur(chipDenom)}€`
        });
      }
      if (countNeeded + 1 <= 6 && (countNeeded + 1) * chipDenom - totalLineCost < chipDenom * 1.5) {
        const extraTotal = (countNeeded + 1) * chipDenom;
        candidates.push({
          givenTotal: extraTotal,
          chips: Array(Math.min(countNeeded + 1, 5)).fill(chipDenom),
          desc: `${countNeeded + 1} × ${formatEur(chipDenom)}€`
        });
      }
    }
  });

  if (candidates.length === 0) {
    const step = totalLineCost >= 5000 ? 5000 : 1000;
    const count = Math.ceil(totalLineCost / step);
    const givenTotal = count * step;
    candidates.push({
      givenTotal,
      chips: Array(Math.min(count, 5)).fill(step),
      desc: `${count} × ${formatEur(step)}€`
    });
  }

  // Privilégier les cas où le croupier doit rendre du change (plus formateur)
  const withChange = candidates.filter((c) => c.givenTotal > totalLineCost);
  if (withChange.length > 0) {
    return withChange[Math.floor(Math.random() * withChange.length)];
  }
  return candidates[0];
}

interface LineRound {
  id: string;
  markedPoint: number;
  pointCase: PlaceBetPointCase;
  isIncludingPoint: boolean;
  category: PlaceBetCategory;
  tier: PlaceBetTier;
  usesBuy: boolean;
  modeLabel: string;
  pointCaseLabel: string;
  activePoints: number[];
  betsByPoint: Record<number, number>;
  perPoint: PlaceBetTierRow['perPoint'];
  totalLineCost: number;
  givenTotal: number;
  givenChips: number[];
  givenDesc: string;
  expectedChange: number;
  clientQuote: string;
  solved: boolean;
}

// ==========================================
// 3. COMPOSANTS VISUELS DE LA TABLE (DÉS, STICKMAN, PILES)
// ==========================================

// Puck ON officiel posé sur le Point Marqué
const OnPuck = ({ size = 40 }: { size?: number }) => (
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

const RedDie = ({ value = 5 }: { value?: number }) => {
  const pipsMap: Record<number, number[][]> = {
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]],
  };
  const pips = pipsMap[value] || [[50, 50]];

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

const FeltMiniDie = ({ value = 3, size = 20 }: { value?: number; size?: number }) => {
  const pipsMap: Record<number, number[][]> = {
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[24, 24], [50, 50], [76, 76]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]],
  };
  const pips = pipsMap[value] || [[50, 50]];

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0">
      <rect x="4" y="4" width="92" height="92" rx="16" fill="#d9e577" />
      {pips.map(([cx, cy], idx) => (
        <circle key={idx} cx={cx} cy={cy} r="9.5" fill="#134e35" />
      ))}
    </svg>
  );
};

const StickmanBadge = ({ side, onToggle }: { side: 'LEFT' | 'RIGHT'; onToggle: () => void }) => {
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
          d={isRight ? 'M26,20 L10,58 Q7,64 15,64' : 'M38,20 L54,58 Q57,64 49,64'}
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
const ChipStackOnFelt = ({
  betItem,
  isSelected,
  isPaid,
  isWrongOrder,
  onSelect,
  showOrderHint,
  orderNumber
}: {
  betItem: BaseTableBet;
  isSelected: boolean;
  isPaid: boolean;
  isWrongOrder: boolean;
  onSelect: (b: BaseTableBet) => void;
  showOrderHint: boolean;
  orderNumber: number;
}) => {
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

// Mini-pile de jetons compacte pour le Tableau du Milieu (Multi-Mises)
const MiniPropChipStack = ({ betEntry, isSolved }: { betEntry: StickBetEntry; isSolved?: boolean }) => {
  const stack = useMemo(() => buildVisualStack(betEntry.bet, 2), [betEntry.bet]);
  const isWinning = betEntry.grossWin > 0;

  return (
    <div className="relative flex flex-col items-center justify-center pointer-events-none select-none z-40">
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
  const [activeTab, setActiveTab] = useState<'BASE' | 'STICK' | 'LINES'>('BASE');

  const [stickmanSide, setStickmanSide] = useState<'LEFT' | 'RIGHT'>('RIGHT');
  const [showOrderHelper, setShowOrderHelper] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showRefTableModal, setShowRefTableModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [streak, setStreak] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // État Module 1 : Paiements de Base (Point)
  const [pointNumber, setPointNumber] = useState(5);
  const [dicePair, setDicePair] = useState<[number, number]>([3, 2]);
  const [tableBets, setTableBets] = useState<BaseTableBet[]>([]);
  const [selectedBetId, setSelectedBetId] = useState<string | null>(null);
  const [wrongOrderBetId, setWrongOrderBetId] = useState<string | null>(null);

  // État Module 2 : Milieu (Multi-Mises Combinées & Paiement Global "Still Up")
  const [stickMultiRound, setStickMultiRound] = useState<StickMultiRound | null>(null);
  const [stickBetCountMode, setStickBetCountMode] = useState<'2' | '3' | '4' | 'MIX'>('MIX');

  // État Module 3 : Lignes & Place Bets (Barème officiel `Place bet.pdf`)
  const [lineRound, setLineRound] = useState<LineRound | null>(null);
  const [lineModeFilter, setLineModeFilter] = useState<LineModeFilter>('ALL');
  const [lineTierFilter, setLineTierFilter] = useState<LineTierFilter>('ALL');
  const [lineCostInput, setLineCostInput] = useState(0);
  const [lineChangeInput, setLineChangeInput] = useState(0);
  const [activeLineField, setActiveLineField] = useState<'COST' | 'CHANGE'>('COST');
  const [lineErrorDetail, setLineErrorDetail] = useState<string | null>(null);

  // Clavier & Calculateur (Modules 1 & 2)
  const [inputAmount, setInputAmount] = useState(0);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'info' | 'success' | 'error';
    message: string;
  }>({
    type: 'info',
    message: 'Touche avec le pouce la 1e mise dans l’ordre !'
  });

  const playFeedbackSound = useCallback((type: 'tap' | 'success' | 'error') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
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

  const rollDiceForPoint = (pt: number): [number, number] => {
    const pairsMap: Record<number, Array<[number, number]>> = {
      4: [[1, 3], [3, 1], [2, 2]],
      5: [[2, 3], [3, 2], [1, 4], [4, 1]],
      6: [[2, 4], [4, 2], [1, 5], [5, 1], [3, 3]],
      8: [[2, 6], [6, 2], [3, 5], [5, 3], [4, 4]],
      9: [[3, 6], [6, 3], [4, 5], [5, 4]],
      10: [[4, 6], [6, 4], [5, 5]],
    };
    const pairs = pairsMap[pt] || [[3, 2]];
    return pairs[Math.floor(Math.random() * pairs.length)];
  };

  // ==========================================
  // GENERATION D'UN PROBLEME MODULE 1 (BASE)
  // ==========================================
  const generateBaseRound = useCallback((customSide: 'LEFT' | 'RIGHT' = stickmanSide) => {
    const points = [4, 5, 6, 8, 9, 10];
    const pt = points[Math.floor(Math.random() * points.length)];
    setPointNumber(pt);
    setDicePair(rollDiceForPoint(pt));

    const numCome = 2;
    const numPlace = 2;
    const shuffleArr = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

    const comeSlots = shuffleArr<Array<{ rowPos: 'COME_TOP' | 'COME_BOTTOM'; col: number; sideGroup: 'TOP' | 'BOTTOM' }>[number]>([
      { rowPos: 'COME_TOP', col: 0, sideGroup: 'TOP' },
      { rowPos: 'COME_TOP', col: 1, sideGroup: 'TOP' },
      { rowPos: 'COME_TOP', col: 2, sideGroup: 'TOP' },
      { rowPos: 'COME_TOP', col: 3, sideGroup: 'TOP' },
      { rowPos: 'COME_BOTTOM', col: 0, sideGroup: 'BOTTOM' },
      { rowPos: 'COME_BOTTOM', col: 1, sideGroup: 'BOTTOM' },
      { rowPos: 'COME_BOTTOM', col: 2, sideGroup: 'BOTTOM' },
      { rowPos: 'COME_BOTTOM', col: 3, sideGroup: 'BOTTOM' },
    ]);

    const chosenComeSlots: typeof comeSlots = [];
    for (const slot of comeSlots) {
      if (chosenComeSlots.length >= numCome) break;
      const tooClose = chosenComeSlots.some(
        (s) => s.rowPos === slot.rowPos && Math.abs(s.col - slot.col) <= 1
      );
      if (!tooClose) chosenComeSlots.push(slot);
    }

    const placeSlots = shuffleArr<Array<{ rowPos: 'PLACE_TOP' | 'PLACE_BOTTOM'; col: number; sideGroup: 'TOP' | 'BOTTOM' }>[number]>([
      { rowPos: 'PLACE_TOP', col: 0, sideGroup: 'TOP' },
      { rowPos: 'PLACE_TOP', col: 1, sideGroup: 'TOP' },
      { rowPos: 'PLACE_TOP', col: 2, sideGroup: 'TOP' },
      { rowPos: 'PLACE_TOP', col: 3, sideGroup: 'TOP' },
      { rowPos: 'PLACE_BOTTOM', col: 0, sideGroup: 'BOTTOM' },
      { rowPos: 'PLACE_BOTTOM', col: 1, sideGroup: 'BOTTOM' },
      { rowPos: 'PLACE_BOTTOM', col: 2, sideGroup: 'BOTTOM' },
      { rowPos: 'PLACE_BOTTOM', col: 3, sideGroup: 'BOTTOM' },
    ]).slice(0, numPlace);

    const newBets: Omit<BaseTableBet, 'order'>[] = [];

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

    const withOrder: BaseTableBet[] = newBets.map((item) => {
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
  const generateStickRound = useCallback((customCountMode: '2' | '3' | '4' | 'MIX' = stickBetCountMode) => {
    const shuffleArr = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

    const hornTemplates = STICK_ROLL_TEMPLATES.filter((t) => [2, 3, 11, 12].includes(t.rollTotal));
    const sevenTemplates = STICK_ROLL_TEMPLATES.filter((t) => t.rollTotal === 7);

    let chosenRound: StickMultiRound | null = null;

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
      const selectedSpotIds: string[] = [];

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

      const allSpotIds = shuffleArr(Object.keys(PROP_BET_SPOTS));
      for (const spotId of allSpotIds) {
        if (selectedSpotIds.length >= targetCount) break;
        if (canAddSpot(selectedSpotIds, spotId)) {
          selectedSpotIds.push(spotId);
        }
      }

      const betsOnFelt: StickBetEntry[] = selectedSpotIds.map((spotId) => {
        const spec = PROP_BET_SPOTS[spotId];
        const betChoices = spec.allowedBets.slice(0, 6);
        const betAmount = betChoices[Math.floor(Math.random() * betChoices.length)];
        const unit = betAmount / spec.divisor;
        const grossMult = spec.getGrossWinMultiplier(template.rollTotal);
        const grossWin = unit * grossMult;
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
      setDicePair([chosenRound.dice[0], chosenRound.dice[1]]);
      setInputAmount(0);
      const summaryBets = chosenRound.bets.map((b) => `${b.shortName} ${b.bet}€`).join(' + ');
      setFeedbackBanner({
        type: 'info',
        message: `Jet ${chosenRound.rollName} ! Paiement Global Still Up (Toutes mises conservées : ${summaryBets})`,
      });
    }
  }, [stickBetCountMode]);

  // ==========================================
  // GENERATION D'UN PROBLEME MODULE 3 : LIGNES & PLACE BETS (BARÈME OFFICIEL `Place bet.pdf`)
  // ==========================================
  const generateLineRound = useCallback(
    (
      customModeFilter: LineModeFilter = lineModeFilter,
      customTierFilter: LineTierFilter = lineTierFilter
    ) => {
      const points = [4, 5, 6, 8, 9, 10];
      const markedPoint = points[Math.floor(Math.random() * points.length)];

      // 1. Sélection de la catégorie (Across / Inside / Outside) et du cas Including the point
      let category: PlaceBetCategory;
      let isIncludingPoint = false;

      if (customModeFilter === 'ACROSS') {
        category = 'ACROSS';
        isIncludingPoint = Math.random() < 0.25;
      } else if (customModeFilter === 'INSIDE') {
        category = 'INSIDE';
        isIncludingPoint = Math.random() < 0.25;
      } else if (customModeFilter === 'OUTSIDE') {
        category = 'OUTSIDE';
        isIncludingPoint = Math.random() < 0.25;
      } else if (customModeFilter === 'INCLUDING') {
        const cats: PlaceBetCategory[] = ['ACROSS', 'INSIDE', 'OUTSIDE'];
        category = cats[Math.floor(Math.random() * cats.length)];
        isIncludingPoint = true;
      } else {
        // Mode Mix : couvre équitablement Across, Inside, Outside et Including the point
        const r = Math.random();
        if (r < 0.44) category = 'ACROSS';
        else if (r < 0.72) category = 'INSIDE';
        else category = 'OUTSIDE';
        isIncludingPoint = Math.random() < 0.22;
      }

      const pointCase: PlaceBetPointCase = isIncludingPoint
        ? 'INCLUDING'
        : getPointCaseFromNumber(markedPoint);

      // 2. Sélection du palier strictement parmi ceux présents dans `Place bet.pdf`
      const tierPool =
        customTierFilter === 'STANDARD'
          ? PLACE_BET_STANDARD_TIERS
          : customTierFilter === 'BUY'
          ? PLACE_BET_BUY_TIERS
          : PLACE_BET_ALL_TIERS;

      const tier = tierPool[Math.floor(Math.random() * tierPool.length)];
      const row = PLACE_BET_REFERENCE_TABLE[tier];
      const usesBuy = isBuyApplicable(tier, category);

      // 3. Valeur exacte lue directement dans le tableau officiel `Place bet.pdf`
      const totalLineCost = getOfficialPlaceBetAmount(tier, category, pointCase);

      // 4. Numéros actifs & répartition visuelle par numéro (en cohérence stricte avec le barème)
      const basePoints =
        category === 'ACROSS'
          ? [4, 5, 6, 8, 9, 10]
          : category === 'INSIDE'
          ? [5, 6, 8, 9]
          : [4, 5, 9, 10];

      const activePoints = isIncludingPoint
        ? basePoints
        : basePoints.filter((p) => p !== markedPoint);

      const betsByPoint: Record<number, number> = {};
      activePoints.forEach((pt) => {
        if (pt === 4 || pt === 10) betsByPoint[pt] = row.perPoint.p4_10;
        else if (pt === 5 || pt === 9) betsByPoint[pt] = row.perPoint.p5_9;
        else betsByPoint[pt] = row.perPoint.p6_8;
      });

      // 5. Jetons remis par le client & change attendu
      const handout = generateClientHandout(totalLineCost);
      const expectedChange = handout.givenTotal - totalLineCost;

      const modeLabel = getOfficialModeLabel(tier, category, pointCase);
      const pointCaseLabel = getPointCaseLabel(pointCase, markedPoint);

      // Formulation naturelle du client au croupier (précisant BUY et Including si applicable)
      const tierStr = formatEur(tier);
      const buySuffix = usesBuy ? ' avec BUY' : '';
      let clientQuote = '';
      if (category === 'ACROSS') {
        clientQuote = isIncludingPoint
          ? `« Ligne par ${tierStr}€ — Including the point${buySuffix} ! »`
          : `« Ligne Across par ${tierStr}€${buySuffix} ! »`;
      } else if (category === 'INSIDE') {
        clientQuote = isIncludingPoint
          ? `« Inside par ${tierStr}€ — Including the point ! »`
          : `« Inside par ${tierStr}€ ! »`;
      } else {
        clientQuote = isIncludingPoint
          ? `« Outside par ${tierStr}€${buySuffix} — Including the point ! »`
          : `« Outside par ${tierStr}€${buySuffix} ! »`;
      }

      const newRound: LineRound = {
        id: `line-${Date.now()}`,
        markedPoint,
        pointCase,
        isIncludingPoint,
        category,
        tier,
        usesBuy,
        modeLabel,
        pointCaseLabel,
        activePoints,
        betsByPoint,
        perPoint: row.perPoint,
        totalLineCost,
        givenTotal: handout.givenTotal,
        givenChips: handout.chips,
        givenDesc: handout.desc,
        expectedChange,
        clientQuote,
        solved: false
      };

      setLineRound(newRound);
      setDicePair(rollDiceForPoint(markedPoint));
      setLineCostInput(0);
      setLineChangeInput(0);
      setActiveLineField('COST');
      setLineErrorDetail(null);
      setFeedbackBanner({
        type: 'info',
        message: `${pointCaseLabel} • ${modeLabel} par ${tierStr}€ (Client donne ${formatEur(handout.givenTotal)}€)`,
      });
    },
    [lineModeFilter, lineTierFilter]
  );

  useEffect(() => {
    generateStickRound();
    generateLineRound();
    generateBaseRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const handleSelectBaseBet = (betItem: BaseTableBet) => {
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
  const handleAddChipValue = (val: number) => {
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

  const handleDigitPress = (digit: number) => {
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
        setStickMultiRound((prev) => (prev ? { ...prev, paid: true } : prev));
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

    // Module 3 : Lignes & Place Bets (Validation stricte contre le barème officiel `Place bet.pdf`)
    if (activeTab === 'LINES') {
      if (!lineRound || lineRound.solved) return;

      const officialAmount = getOfficialPlaceBetAmount(
        lineRound.tier,
        lineRound.category,
        lineRound.pointCase
      );
      const officialChange = lineRound.givenTotal - officialAmount;

      const isCostOk = lineCostInput === officialAmount;
      const isChangeOk = lineChangeInput === officialChange;

      // Si la 1e case (Montant Ligne) est exacte et que le change n'est pas encore saisi, basculer sur CHANGE
      if (activeLineField === 'COST' && isCostOk && lineChangeInput === 0 && officialChange > 0) {
        playFeedbackSound('tap');
        setLineErrorDetail(null);
        setActiveLineField('CHANGE');
        setFeedbackBanner({
          type: 'info',
          message: `Barème OK (${formatEur(officialAmount)}€) ! Entre maintenant le CHANGE à rendre sur ${formatEur(lineRound.givenTotal)}€.`,
        });
        return;
      }

      setTotalAttempts((t) => t + 1);

      if (isCostOk && isChangeOk) {
        playFeedbackSound('success');
        setCorrectAttempts((c) => c + 1);
        setStreak((s) => s + 1);
        setLineErrorDetail(null);
        setLineRound((prev) => (prev ? { ...prev, solved: true } : prev));

        setFeedbackBanner({
          type: 'success',
          message: `Parfait ! ${lineRound.modeLabel} par ${formatEur(lineRound.tier)}€ = ${formatEur(officialAmount)}€ | Change = ${formatEur(officialChange)}€`,
        });

        setTimeout(() => {
          generateLineRound();
        }, 1700);
      } else {
        playFeedbackSound('error');
        setStreak(0);

        const activeBreakdown = lineRound.activePoints
          .map((pt) => {
            const val = lineRound.betsByPoint[pt];
            const buyTag = lineRound.usesBuy && (pt === 4 || pt === 10) ? ' BUY' : '';
            return `${pt}:${formatEur(val)}€${buyTag}`;
          })
          .join(' • ');

        const expectedDetail =
          `Attendu [${lineRound.modeLabel} | ${lineRound.pointCaseLabel} | par ${formatEur(lineRound.tier)}€] : ` +
          `Barème = ${formatEur(officialAmount)}€ (${activeBreakdown}) • Change = ${formatEur(lineRound.givenTotal)}€ − ${formatEur(officialAmount)}€ = ${formatEur(officialChange)}€`;

        setLineErrorDetail(expectedDetail);

        if (!isCostOk && !isChangeOk) {
          setFeedbackBanner({
            type: 'error',
            message: `Erreur barème : attendu ${formatEur(officialAmount)}€ (Change : ${formatEur(officialChange)}€).`,
          });
          setActiveLineField('COST');
        } else if (!isCostOk) {
          setFeedbackBanner({
            type: 'error',
            message: `Montant faux (${formatEur(lineCostInput)}€) — Barème officiel : ${formatEur(officialAmount)}€.`,
          });
          setActiveLineField('COST');
        } else {
          setFeedbackBanner({
            type: 'error',
            message: `Montant ${formatEur(officialAmount)}€ OK, mais Change faux (${formatEur(lineChangeInput)}€). Attendu : ${formatEur(officialChange)}€.`,
          });
          setActiveLineField('CHANGE');
        }
      }
    }
  };

  // Helper pour récupérer une mise présente sur un spot donné dans le Module 2
  const getBetAtSpot = useCallback(
    (spotId: string) => {
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
            {([
              { id: 'BASE', label: 'Base (Point)' },
              { id: 'STICK', label: 'Milieu (Stick)' },
              { id: 'LINES', label: 'Lignes (Place)' },
            ] as const).map((tab) => {
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
                    ? lineRound?.isIncludingPoint
                      ? `INCLUDING (PT ${lineRound.markedPoint})`
                      : `POINT ${lineRound?.markedPoint || 4}`
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
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded bg-[#143d29] border border-[#2e6b4c] text-[10px] font-extrabold text-[#f5cf58] truncate">
                      {lineRound?.modeLabel || 'Across'} • PAR {formatEur(lineRound?.tier || 25)}€
                    </span>
                    {lineRound?.usesBuy && (
                      <span className="px-1.5 py-0.5 rounded bg-[#4a1c28] border border-[#e05d7b] text-[9px] font-black text-[#ffb3c6]">
                        BUY 5%
                      </span>
                    )}
                  </div>
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
                  {(['2', '3', '4', 'MIX'] as const).map((m) => (
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

                      {rowIdx === 2 && (
                        <div
                          className={`w-3.5 h-3.5 rounded-full border border-dashed border-[#c084fc] bg-[#c084fc]/15 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${
                            getBetAtSpot('PURPLE_CE') ? 'ring-2 ring-[#c084fc] z-40' : 'opacity-50'
                          }`}
                        >
                          {getBetAtSpot('PURPLE_CE') && (
                            <MiniPropChipStack
                              betEntry={getBetAtSpot('PURPLE_CE')!}
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

                  {/* 1. BOÎTE SEVEN + Repère Vert Seven-Eleven */}
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
                            betEntry={getBetAtSpot('SEVEN_BOX')!}
                            isSolved={stickMultiRound?.paid}
                          />
                        </div>
                      )}
                    </div>

                    <div
                      className={`w-3.5 h-3.5 rounded-full border border-dashed border-[#4ade80] bg-[#4ade80]/15 absolute -left-2 top-1/2 -translate-y-1/2 flex items-center justify-center ${
                        getBetAtSpot('GREEN_SEVEN_ELEVEN') ? 'ring-2 ring-[#4ade80] z-40' : 'opacity-60'
                      }`}
                    >
                      {getBetAtSpot('GREEN_SEVEN_ELEVEN') && (
                        <MiniPropChipStack
                          betEntry={getBetAtSpot('GREEN_SEVEN_ELEVEN')!}
                          isSolved={stickMultiRound?.paid}
                        />
                      )}
                    </div>
                  </div>

                  {/* 2. LES 4 HARDWAYS */}
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

                  {/* 3. BLOC HORN & COMBINATIONS */}
                  <div className="relative border-2 border-[#dce780] bg-[#115035]">
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

                    <div className="grid grid-cols-3">
                      <div className="h-14 border-r-2 border-[#dce780] flex flex-col items-center justify-center relative">
                        <div className="flex items-center gap-1">
                          <FeltMiniDie value={6} size={19} />
                          <FeltMiniDie value={5} size={19} />
                        </div>
                        <span className="text-[9px] font-black text-[#f5f3c8] mt-1">15 FOR 1</span>

                        {getBetAtSpot('HORN_11L_BOX') && (
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                            <MiniPropChipStack
                              betEntry={getBetAtSpot('HORN_11L_BOX')!}
                              isSolved={stickMultiRound?.paid}
                            />
                          </div>
                        )}
                      </div>

                      <div className="h-14 border-r-2 border-[#dce780] flex flex-col items-center justify-center relative px-1 text-center">
                        <span className="text-xs font-black font-serif leading-tight tracking-tight text-[#e88352]">
                          BET THE
                          <br />
                          HORN
                        </span>

                        {getBetAtSpot('BET_THE_HORN_BOX') && (
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                            <MiniPropChipStack
                              betEntry={getBetAtSpot('BET_THE_HORN_BOX')!}
                              isSolved={stickMultiRound?.paid}
                            />
                          </div>
                        )}
                      </div>

                      <div className="h-14 flex flex-col items-center justify-center relative">
                        <div className="flex items-center gap-1">
                          <FeltMiniDie value={6} size={19} />
                          <FeltMiniDie value={5} size={19} />
                        </div>
                        <span className="text-[9px] font-black text-[#f5f3c8] mt-1">15 FOR 1</span>
                      </div>
                    </div>

                    {/* Repères d'intersections */}
                    {[
                      { id: 'YELLOW_3WAY', cls: 'w-3.5 h-3.5 border-[#facc15] bg-[#facc15]/20 -left-2 top-[25%] -translate-y-1/2', ring: 'ring-[#facc15]' },
                      { id: 'BLUE_SPLIT_3_2', cls: 'w-3 h-3 border-[#60a5fa] bg-[#60a5fa]/20 left-[33.33%] top-[25%] -translate-x-1/2 -translate-y-1/2', ring: 'ring-[#60a5fa]' },
                      { id: 'BLUE_SPLIT_2_12', cls: 'w-3 h-3 border-[#60a5fa] bg-[#60a5fa]/20 left-[66.66%] top-[25%] -translate-x-1/2 -translate-y-1/2', ring: 'ring-[#60a5fa]' },
                      { id: 'BLUE_SPLIT_3_11', cls: 'w-3 h-3 border-[#60a5fa] bg-[#60a5fa]/20 left-[16.66%] top-[50%] -translate-x-1/2 -translate-y-1/2', ring: 'ring-[#60a5fa]' },
                      { id: 'BLUE_SPLIT_12_11', cls: 'w-3 h-3 border-[#60a5fa] bg-[#60a5fa]/20 left-[83.33%] top-[50%] -translate-x-1/2 -translate-y-1/2', ring: 'ring-[#60a5fa]' },
                      { id: 'RED_HH_LEFT', cls: 'w-3.5 h-3.5 border-[#f87171] bg-[#f87171]/25 left-[33.33%] top-[50%] -translate-x-1/2 -translate-y-1/2', ring: 'ring-[#f87171]' },
                      { id: 'RED_HH_RIGHT', cls: 'w-3.5 h-3.5 border-[#f87171] bg-[#f87171]/25 left-[66.66%] top-[50%] -translate-x-1/2 -translate-y-1/2', ring: 'ring-[#f87171]' },
                    ].map((marker) => {
                      const betHere = getBetAtSpot(marker.id);
                      return (
                        <div
                          key={marker.id}
                          className={`rounded-full border border-dashed absolute flex items-center justify-center ${marker.cls} ${
                            betHere ? `ring-2 ${marker.ring} z-40` : 'opacity-65'
                          }`}
                        >
                          {betHere && (
                            <MiniPropChipStack betEntry={betHere} isSolved={stickMultiRound?.paid} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* 4. BOÎTE ANY CRAPS */}
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
                            betEntry={getBetAtSpot('ANY_CRAPS_BOX')!}
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
            /* --- TAPIS MODULE 3 : LIGNES & PLACE BETS (BARÈME OFFICIEL PDF) ---    */
            /* ===================================================================== */
            <div className="relative my-1 flex-1 min-h-[345px] rounded-2xl bg-[#166444] border-2 border-[#7aa37c] shadow-[inset_0_0_35px_rgba(0,0,0,0.55)] px-2.5 py-2 flex flex-col justify-between overflow-hidden select-none">

              {/* Barre de filtres officiels (Mode + Paliers Standard/BUY + Accès Barème PDF) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-1">
                  {/* Filtre Catégorie / Mode */}
                  <div className="flex items-center gap-0.5 bg-[#06170f]/95 p-0.5 rounded-lg border border-[#24523a]">
                    {([
                      { id: 'ALL', label: 'Mix' },
                      { id: 'ACROSS', label: 'Across' },
                      { id: 'INSIDE', label: 'Inside' },
                      { id: 'OUTSIDE', label: 'Outside' },
                      { id: 'INCLUDING', label: 'Incl.' },
                    ] as const).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setLineModeFilter(m.id);
                          generateLineRound(m.id, lineTierFilter);
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

                  {/* Filtre Palier Standard vs BUY + Bouton Barème PDF */}
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5 bg-[#06170f]/95 p-0.5 rounded-lg border border-[#24523a]">
                      {([
                        { id: 'ALL', label: 'Tout' },
                        { id: 'STANDARD', label: '10-75' },
                        { id: 'BUY', label: 'BUY' },
                      ] as const).map((tf) => (
                        <button
                          key={tf.id}
                          onClick={() => {
                            setLineTierFilter(tf.id);
                            generateLineRound(lineModeFilter, tf.id);
                          }}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-black transition-colors ${
                            lineTierFilter === tf.id
                              ? tf.id === 'BUY'
                                ? 'bg-[#e05d7b] text-white'
                                : 'bg-[#dce780] text-[#092014]'
                              : 'text-[#89b59c] hover:text-white'
                          }`}
                        >
                          {tf.label}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setShowRefTableModal(true)}
                      className="p-1 rounded-lg bg-[#0b2619] border border-[#3a7555] text-[#dce780] hover:bg-[#143d29]"
                      title="Consulter le barème officiel Place bet.pdf"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bulle de demande du client */}
                <div className="flex items-center justify-between gap-2 bg-[#0a2317]/90 border border-[#2b5e43] rounded-xl px-2.5 py-1.5 shadow">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#90bd9f]">
                        {lineRound?.pointCaseLabel || 'Point'}
                      </span>
                      {lineRound?.isIncludingPoint && (
                        <span className="px-1 py-0.2 rounded bg-[#1d4d3a] border border-[#4ade80] text-[8px] font-black text-[#86efac]">
                          POINT INCLUS
                        </span>
                      )}
                    </div>
                    <span className="text-[13px] font-black text-[#f5d547] truncate">
                      {lineRound?.clientQuote || '« Ligne Across par 25€ ! »'}
                    </span>
                  </div>
                </div>
              </div>

              {/* RAMPE OFFICIELLE DES 6 POINTS (4 | 5 | SIX | 8 | NINE | 10) */}
              <div className="my-1 relative px-1 py-2.5">
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
                    const isBuyNumber = Boolean(lineRound?.usesBuy && (box.pt === 4 || box.pt === 10) && isIncludedInLine);

                    return (
                      <div
                        key={box.pt}
                        className={`relative h-24 flex flex-col justify-between items-center py-1 ${
                          idx < 5 ? 'border-r-[2.5px] border-[#d7e582]' : ''
                        } ${
                          isMarked && !isIncludedInLine
                            ? 'bg-[#0e3f2a]/85'
                            : isIncludedInLine
                            ? 'bg-[#196b49]'
                            : 'bg-[#114831]/60 opacity-55'
                        }`}
                      >
                        {/* 4 petits cercles jaunes en haut */}
                        <div className="w-full flex items-center justify-around px-0.5 -mt-2.5 z-10">
                          {[0, 1, 2, 3].map((c) => (
                            <div
                              key={`top-c-${box.pt}-${c}`}
                              className="w-2.5 h-2.5 rounded-full border-[1.6px] border-[#d7e582] bg-[#145a3d]"
                            />
                          ))}
                        </div>

                        {/* Centre de la boîte : Numéro + Puck ON + Indicateur BUY / Inclus */}
                        <div className="relative flex-1 w-full flex flex-col items-center justify-center">
                          <span
                            className={`font-serif font-black text-white select-none leading-none ${
                              box.tilted ? 'text-sm italic tracking-tight' : 'text-xl'
                            }`}
                            style={box.tilted ? { transform: 'rotate(-14deg)' } : undefined}
                          >
                            {box.label}
                          </span>

                          {/* PUCK "ON" posé sur le point marqué */}
                          {isMarked && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                              <OnPuck size={32} />
                              {lineRound?.isIncludingPoint && isIncludedInLine && (
                                <span className="mt-0.5 px-1 rounded bg-[#14532d] border border-[#4ade80] text-[7px] font-black text-[#bbf7d0] leading-tight">
                                  INCLUS
                                </span>
                              )}
                            </div>
                          )}

                          {/* Badge BUY sur 4 et 10 lorsque BUY actif */}
                          {isBuyNumber && !isMarked && (
                            <span className="mt-0.5 px-1 rounded bg-[#5c1a2a] border border-[#f472b6] text-[7px] font-black text-[#fbcfe8] leading-tight">
                              BUY
                            </span>
                          )}

                          {/* Montant exact sur ce point si aide 1-2-3, erreur ou résolu */}
                          {isIncludedInLine && (showOrderHelper || lineRound?.solved || Boolean(lineErrorDetail)) && (
                            <div className="mt-0.5 px-1 py-0.2 rounded-full bg-[#112419] border border-[#f5d547] text-[8px] font-black text-[#f5d547] shadow z-30">
                              {formatEur(pointBetAmount)}€
                            </div>
                          )}

                          {/* Point lumineux indiquant que la case est active dans la demande */}
                          {!isMarked && isIncludedInLine && !showOrderHelper && !lineRound?.solved && !lineErrorDetail && !isBuyNumber && (
                            <div className="mt-1 w-2 h-2 rounded-full bg-[#dce780] shadow-[0_0_6px_#dce780]" />
                          )}
                        </div>

                        {/* 4 petits cercles jaunes en bas */}
                        <div className="w-full flex items-center justify-around px-0.5 -mb-2.5 z-10">
                          {[0, 1, 2, 3].map((c) => (
                            <div
                              key={`bot-c-${box.pt}-${c}`}
                              className="w-2.5 h-2.5 rounded-full border-[1.6px] border-[#d7e582] bg-[#145a3d]"
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BANDEAU DÉTAIL D'ERREUR OFFICIEL (affiché uniquement après erreur) */}
              {lineErrorDetail && (
                <div className="mb-1 px-2.5 py-1.5 rounded-xl bg-[#361217]/95 border border-[#f87171] text-[10px] font-bold text-[#fecaca] leading-snug shadow">
                  {lineErrorDetail}
                </div>
              )}

              {/* ZONE DES JETONS POSÉS PAR LE CLIENT SUR LE TAPIS */}
              <div className="px-3 py-2 rounded-xl bg-[#0d2d1e]/95 border border-[#2f694b] flex items-center justify-between gap-2 shadow-inner">
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold uppercase text-[#99c4aa]">
                    Jetons envoyés par le client :
                  </span>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-base font-black text-white">
                      {formatEur(lineRound?.givenTotal || 200)} €
                    </span>
                    <span className="text-xs font-bold text-[#dce780]">
                      ({lineRound?.givenDesc || '2 × 100€'})
                    </span>
                  </div>
                  {showOrderHelper && lineRound && (
                    <span className="text-[10px] font-extrabold text-[#7dd3fc] mt-0.5">
                      Barème PDF : {formatEur(lineRound.totalLineCost)}€ | Change : {formatEur(lineRound.expectedChange)}€
                    </span>
                  )}
                </div>

                {/* Affichage visuel des jetons posés par le client */}
                <div className="flex items-center -space-x-2 shrink-0">
                  {lineRound?.givenChips?.map((denom, idx) => (
                    <div key={idx} className="transform hover:scale-105 transition-transform">
                      <MonteCarloChip denom={denom} size={38} />
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
                    1. Montant Barème
                  </span>
                  <span className="text-[10px] font-bold text-[#dce780] truncate">
                    À prendre
                  </span>
                </div>
                <div className="text-base font-black text-white shrink-0">
                  {formatEur(lineCostInput)} <span className="text-xs text-[#6ee7b7]">€</span>
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
                <div className="text-base font-black text-white shrink-0">
                  {formatEur(lineChangeInput)} <span className="text-xs text-[#88d4ee]">€</span>
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
                    ? `VALIDER (${formatEur(lineCostInput)}€) & CHANGE (${formatEur(lineChangeInput)}€)`
                    : selectedBetId
                    ? `VALIDER LE PAIEMENT (${inputAmount} €)`
                    : 'TOUCHE LA 1E MISE SUR LE TAPIS'}
                </span>
              </button>
            </div>
          </div>
        </>

        {/* ========================================== */}
        {/* MODALE BARÈME OFFICIEL `PLACE BET.PDF`     */}
        {/* ========================================== */}
        {showRefTableModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2.5">
            <div className="w-full max-w-[430px] max-h-[88vh] rounded-2xl bg-[#0b2318] border-2 border-[#397354] flex flex-col overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#214a34] bg-[#081a11]">
                <h3 className="text-xs font-black text-[#dce780] uppercase flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> Barème Officiel — Place bet.pdf
                </h3>
                <button
                  onClick={() => setShowRefTableModal(false)}
                  className="p-1 rounded-lg bg-[#143927] text-[#9ec4ad] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto p-3 space-y-4 text-[10px]">
                {/* TABLEAU 1 : PLACE BETS LIGNES */}
                <div>
                  <h4 className="text-[11px] font-black text-[#f5d547] uppercase mb-1.5">
                    1. Place Bets Lignes (Across & Including)
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-[#24523a]">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="bg-[#123826] text-[#dce780] font-black">
                          <th className="py-1.5 px-1.5 text-left">Ligne €</th>
                          <th className="py-1.5 px-1">6 ou 8</th>
                          <th className="py-1.5 px-1">5 ou 9</th>
                          <th className="py-1.5 px-1">4 ou 10</th>
                          <th className="py-1.5 px-1.5">Including</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PLACE_BET_ALL_TIERS.map((tier) => {
                          const r = PLACE_BET_REFERENCE_TABLE[tier];
                          return (
                            <React.Fragment key={`t1-${tier}`}>
                              {tier === 100 && (
                                <tr className="bg-[#4a1c28] text-[#ffb3c6] font-black text-center">
                                  <td colSpan={5} className="py-1 text-[9px] tracking-wider uppercase">
                                    Across avec «BUY» & Including avec «BUY»
                                  </td>
                                </tr>
                              )}
                              <tr className="border-t border-[#1c422f] odd:bg-[#0d2a1c] even:bg-[#092015]">
                                <td className="py-1 px-1.5 text-left font-black text-[#f5cf58]">{formatEur(tier)}</td>
                                <td className="py-1 px-1 font-bold">{formatEur(r.lignes['6_8'])}</td>
                                <td className="py-1 px-1 font-bold">{formatEur(r.lignes['5_9'])}</td>
                                <td className="py-1 px-1 font-bold">{formatEur(r.lignes['4_10'])}</td>
                                <td className="py-1 px-1.5 font-black text-[#86efac]">{formatEur(r.lignes.INCLUDING)}</td>
                              </tr>
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* TABLEAU 2 : PLACE BETS INSIDE & OUTSIDE */}
                <div>
                  <h4 className="text-[11px] font-black text-[#f5d547] uppercase mb-1.5">
                    2. Place Bets Inside & Outside
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-[#24523a]">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="bg-[#123826] text-[#dce780] font-black text-[9px]">
                          <th className="py-1 px-1 text-left" rowSpan={2}>Par</th>
                          <th className="py-1 px-1 text-center border-l border-[#24523a]" colSpan={2}>6 ou 8</th>
                          <th className="py-1 px-1 text-center border-l border-[#24523a]" colSpan={2}>5 ou 9</th>
                          <th className="py-1 px-1 text-center border-l border-[#24523a]" colSpan={2}>4 ou 10</th>
                          <th className="py-1 px-1 text-center border-l border-[#24523a]" colSpan={2}>Incl.</th>
                        </tr>
                        <tr className="bg-[#0f2f20] text-[#9ec4ad] font-extrabold text-[8px]">
                          <th className="py-0.5 px-1 border-l border-[#24523a]">Out</th>
                          <th className="py-0.5 px-1">In</th>
                          <th className="py-0.5 px-1 border-l border-[#24523a]">Out</th>
                          <th className="py-0.5 px-1">In</th>
                          <th className="py-0.5 px-1 border-l border-[#24523a]">Out</th>
                          <th className="py-0.5 px-1">In</th>
                          <th className="py-0.5 px-1 border-l border-[#24523a]">In</th>
                          <th className="py-0.5 px-1">Out</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PLACE_BET_ALL_TIERS.map((tier) => {
                          const r = PLACE_BET_REFERENCE_TABLE[tier];
                          return (
                            <React.Fragment key={`t2-${tier}`}>
                              {tier === 100 && (
                                <tr className="bg-[#4a1c28] text-[#ffb3c6] font-black text-center">
                                  <td colSpan={9} className="py-1 text-[9px] tracking-wider uppercase">
                                    Outside avec «BUY» • Inside (sans BUY)
                                  </td>
                                </tr>
                              )}
                              <tr className="border-t border-[#1c422f] odd:bg-[#0d2a1c] even:bg-[#092015] text-[9px]">
                                <td className="py-1 px-1 text-left font-black text-[#f5cf58]">{tier}</td>
                                <td className="py-1 px-0.5 border-l border-[#1c422f]">{r.outside['6_8']}</td>
                                <td className="py-1 px-0.5 text-[#88d4ee]">{r.inside['6_8']}</td>
                                <td className="py-1 px-0.5 border-l border-[#1c422f]">{r.outside['5_9']}</td>
                                <td className="py-1 px-0.5 text-[#88d4ee]">{r.inside['5_9']}</td>
                                <td className="py-1 px-0.5 border-l border-[#1c422f]">{r.outside['4_10']}</td>
                                <td className="py-1 px-0.5 text-[#88d4ee]">{r.inside['4_10']}</td>
                                <td className="py-1 px-0.5 border-l border-[#1c422f] text-[#88d4ee] font-bold">{r.inside.INCLUDING}</td>
                                <td className="py-1 px-0.5 font-bold text-[#86efac]">{r.outside.INCLUDING}</td>
                              </tr>
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
