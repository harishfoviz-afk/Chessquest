// Chess Quest: Adaptive Elo Rating & Intelligent Puzzle Allotment Engine
// Tracks player strength, learning curve, strengths & weaknesses, and allots optimal next puzzles

import { subscriptionService } from './subscription-service.js';

const STATS_STORAGE_KEY = 'chess_quest_player_stats';

export const THEME_NAMES = {
  mateIn1: 'Mate in 1 Checkmate',
  mateIn2: 'Mate in 2 Combination',
  backRankMate: 'Back-Rank Castle Mate',
  fork: 'Knight & Piece Forks',
  pin: 'Laser Pins',
  skewer: 'Skewer Tactics',
  hangingPiece: 'Free Hanging Piece',
  doubleCheck: 'Double Check Surprise',
  discoveredAttack: 'Discovered Attack',
  endgame: 'Pawn & King Endgame'
};

export const RANKS = [
  { min: 0, max: 749, title: 'Pawn Scout', icon: '🥚', color: '#8BC34A' },
  { min: 750, max: 899, title: 'Knight Ranger', icon: '🐴', color: '#03A9F4' },
  { min: 900, max: 1049, title: 'Bishop Marksman', icon: '🏹', color: '#9C27B0' },
  { min: 1050, max: 1249, title: 'Castle Guardian', icon: '🏰', color: '#FF9800' },
  { min: 1250, max: 1499, title: "Queen's Champion", icon: '👑', color: '#E91E63' },
  { min: 1500, max: 9999, title: 'Grand Dragon Master', icon: '🐉', color: '#FFD700' }
];

class AdaptiveEngine {
  constructor() {
    this.stats = this.loadStats();
    this.recentlyPlayedIds = new Set();
  }

  loadStats() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.rating) return parsed;
        } catch (e) {
          console.warn('Failed to parse player stats, initializing fresh:', e);
        }
      }
    }

    const defaultStats = {
      rating: 800,
      peakRating: 800,
      totalSolved: 0,
      totalAttempted: 0,
      currentStreak: 0,
      bestStreak: 0,
      history: [
        {
          timestamp: new Date().toISOString(),
          puzzleId: 'init',
          title: 'Knight Induction',
          rating: 800,
          theme: 'fork',
          outcome: 'win',
          hintsUsed: 0,
          newRating: 800
        }
      ],
      themeStats: {
        mateIn1: { solved: 3, attempted: 3, hintsTotal: 0 },
        fork: { solved: 2, attempted: 4, hintsTotal: 3 },
        pin: { solved: 1, attempted: 3, hintsTotal: 2 },
        backRankMate: { solved: 3, attempted: 4, hintsTotal: 1 },
        hangingPiece: { solved: 2, attempted: 2, hintsTotal: 0 },
        skewer: { solved: 1, attempted: 2, hintsTotal: 2 }
      }
    };
    this.saveStats(defaultStats);
    return defaultStats;
  }

  saveStats(statsToSave = null) {
    if (statsToSave) this.stats = statsToSave;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(this.stats));
    }
  }

  getRating() {
    return Math.round(this.stats.rating || 800);
  }

  getRank() {
    const r = this.getRating();
    for (const rank of RANKS) {
      if (r >= rank.min && r <= rank.max) {
        return rank;
      }
    }
    return RANKS[0];
  }

  recordAttempt(puzzle) {
    this.stats.totalAttempted = (this.stats.totalAttempted || 0) + 1;
    const themeKey = puzzle.themeKey || this.inferThemeKey(puzzle.theme);
    if (!this.stats.themeStats[themeKey]) {
      this.stats.themeStats[themeKey] = { solved: 0, attempted: 0, hintsTotal: 0 };
    }
    this.stats.themeStats[themeKey].attempted += 1;
    this.saveStats();
  }

  recordSolve(puzzle, hintsUsedCount = 0) {
    const prevRating = this.getRating();
    let ratingGain = 0;

    if (hintsUsedCount === 0) {
      ratingGain = 20; // Pure solve
      this.stats.currentStreak = (this.stats.currentStreak || 0) + 1;
    } else if (hintsUsedCount === 1) {
      ratingGain = 12; // Used Hint 1
      this.stats.currentStreak = (this.stats.currentStreak || 0) + 1;
    } else if (hintsUsedCount === 2) {
      ratingGain = 6;  // Used Hint 2
      this.stats.currentStreak = (this.stats.currentStreak || 0) + 1;
    } else {
      ratingGain = 2;  // Used Magic Wand (still positive for kids)
      this.stats.currentStreak = 0;
    }

    if (this.stats.currentStreak > (this.stats.bestStreak || 0)) {
      this.stats.bestStreak = this.stats.currentStreak;
    }

    const newRating = Math.max(500, prevRating + ratingGain);
    this.stats.rating = newRating;
    if (newRating > (this.stats.peakRating || 800)) {
      this.stats.peakRating = newRating;
    }

    this.stats.totalSolved = (this.stats.totalSolved || 0) + 1;

    // Theme stats
    const themeKey = puzzle.themeKey || this.inferThemeKey(puzzle.theme);
    if (!this.stats.themeStats[themeKey]) {
      this.stats.themeStats[themeKey] = { solved: 0, attempted: 1, hintsTotal: 0 };
    }
    this.stats.themeStats[themeKey].solved += 1;
    this.stats.themeStats[themeKey].hintsTotal += hintsUsedCount;

    // History entry (keep last 40)
    const historyEntry = {
      timestamp: new Date().toISOString(),
      puzzleId: puzzle.id,
      title: puzzle.title || `Puzzle #${puzzle.id}`,
      rating: puzzle.rating || 800,
      theme: themeKey,
      outcome: 'win',
      hintsUsed: hintsUsedCount,
      ratingGain: ratingGain,
      newRating: newRating
    };

    if (!Array.isArray(this.stats.history)) {
      this.stats.history = [];
    }
    this.stats.history.push(historyEntry);
    if (this.stats.history.length > 40) {
      this.stats.history.shift();
    }

    this.recentlyPlayedIds.add(puzzle.id);
    this.saveStats();

    return {
      prevRating,
      newRating,
      ratingGain,
      currentRank: this.getRank()
    };
  }

  recordFailure(puzzle) {
    const prevRating = this.getRating();
    const ratingLoss = 8; // Gentle deduction
    const newRating = Math.max(500, prevRating - ratingLoss);
    this.stats.rating = newRating;
    this.stats.currentStreak = 0;

    const themeKey = puzzle.themeKey || this.inferThemeKey(puzzle.theme);
    if (!this.stats.themeStats[themeKey]) {
      this.stats.themeStats[themeKey] = { solved: 0, attempted: 1, hintsTotal: 0 };
    }

    const historyEntry = {
      timestamp: new Date().toISOString(),
      puzzleId: puzzle.id,
      title: puzzle.title || `Puzzle #${puzzle.id}`,
      rating: puzzle.rating || 800,
      theme: themeKey,
      outcome: 'retry',
      hintsUsed: 3,
      ratingGain: -ratingLoss,
      newRating: newRating
    };

    if (!Array.isArray(this.stats.history)) {
      this.stats.history = [];
    }
    this.stats.history.push(historyEntry);
    if (this.stats.history.length > 40) {
      this.stats.history.shift();
    }

    this.saveStats();
    return { prevRating, newRating, ratingLoss };
  }

  inferThemeKey(themeName = '') {
    const lower = (themeName || '').toLowerCase();
    if (lower.includes('mate in 1') || lower.includes('matein1')) return 'mateIn1';
    if (lower.includes('mate in 2') || lower.includes('matein2')) return 'mateIn2';
    if (lower.includes('back-rank') || lower.includes('backrank')) return 'backRankMate';
    if (lower.includes('fork')) return 'fork';
    if (lower.includes('pin')) return 'pin';
    if (lower.includes('skewer')) return 'skewer';
    if (lower.includes('hanging')) return 'hangingPiece';
    if (lower.includes('double check')) return 'doubleCheck';
    if (lower.includes('discovered')) return 'discoveredAttack';
    if (lower.includes('endgame')) return 'endgame';
    return 'fork';
  }

  selectNextPuzzle(allPuzzles, options = {}) {
    if (!allPuzzles || allPuzzles.length === 0) return null;

    const { focusTheme = null } = options;
    const currentRating = this.getRating();
    const isStreakActive = (this.stats.currentStreak || 0) >= 3;

    // Filter accessible puzzles based on subscription
    let accessible = allPuzzles.filter(p => subscriptionService.isPuzzleAccessible(p));
    if (accessible.length === 0) accessible = allPuzzles;

    // Target rating: if on streak, slightly stretch upwards; if focusTheme, target weakness
    let targetRating = currentRating;
    if (isStreakActive) {
      targetRating = currentRating + 45; // Gentle stretch
    }

    // Filter by focus theme if requested
    let candidates = accessible;
    if (focusTheme) {
      const themeCandidates = accessible.filter(p => (p.themeKey || this.inferThemeKey(p.theme)) === focusTheme);
      if (themeCandidates.length > 0) {
        candidates = themeCandidates;
      }
    }

    // Avoid recently played if possible
    let unplayed = candidates.filter(p => !this.recentlyPlayedIds.has(p.id));
    if (unplayed.length === 0) {
      this.recentlyPlayedIds.clear();
      unplayed = candidates;
    }

    // Sort by rating proximity to targetRating
    unplayed.sort((a, b) => {
      const distA = Math.abs((a.rating || 800) - targetRating);
      const distB = Math.abs((b.rating || 800) - targetRating);
      return distA - distB;
    });

    // Pick randomly from the top 3 closest matches so it feels fresh
    const pickPool = unplayed.slice(0, Math.min(3, unplayed.length));
    const selected = pickPool[Math.floor(Math.random() * pickPool.length)];

    return selected;
  }

  getStrengthsAndWeaknesses() {
    const themeStats = this.stats.themeStats || {};
    const strengths = [];
    const weaknesses = [];

    for (const [key, stats] of Object.entries(themeStats)) {
      const attempted = stats.attempted || 0;
      const solved = stats.solved || 0;
      if (attempted < 2) continue; // Need at least 2 attempts to gauge

      const accuracy = Math.round((solved / attempted) * 100);
      const avgHints = stats.hintsTotal ? (stats.hintsTotal / solved).toFixed(1) : 0;
      const themeName = THEME_NAMES[key] || key;

      const item = {
        key,
        name: themeName,
        accuracy,
        solved,
        attempted,
        avgHints
      };

      if (accuracy >= 70) {
        strengths.push(item);
      } else {
        weaknesses.push(item);
      }
    }

    // Sort strengths by accuracy descending
    strengths.sort((a, b) => b.accuracy - a.accuracy);
    // Sort weaknesses by accuracy ascending (lowest first)
    weaknesses.sort((a, b) => a.accuracy - b.accuracy);

    // Fallbacks if player hasn't played much yet
    if (strengths.length === 0) {
      strengths.push({
        key: 'mateIn1',
        name: 'Mate in 1 Checkmate',
        accuracy: 100,
        solved: 1,
        attempted: 1,
        avgHints: 0,
        isStarter: true
      });
    }

    if (weaknesses.length === 0) {
      weaknesses.push({
        key: 'fork',
        name: 'Knight & Piece Forks',
        accuracy: 50,
        solved: 1,
        attempted: 2,
        avgHints: 1.5,
        isStarter: true
      });
    }

    return { strengths, weaknesses };
  }

  getLearningCurveData() {
    const history = this.stats.history || [];
    if (history.length === 0) {
      return [{ step: 1, rating: 800, label: 'Start' }];
    }

    return history.map((item, idx) => ({
      step: idx + 1,
      rating: item.newRating || 800,
      label: item.title || `P${idx + 1}`,
      outcome: item.outcome || 'win'
    }));
  }
}

export const adaptiveEngine = new AdaptiveEngine();
