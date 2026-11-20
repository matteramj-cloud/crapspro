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
