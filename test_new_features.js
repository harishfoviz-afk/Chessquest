// Automated Test Suite for New Features:
// 1. Adaptive Engine & Elo Allotment
// 2. Subscription Service & Tier Access Gating
// 3. Lichess Endless Mode & Puzzle Bank Validation
// 4. Custom Puzzles Integration

import { Chess } from './js/chess.js';
import { adaptiveEngine } from './js/adaptive-engine.js';
import { subscriptionService, TIERS } from './js/subscription-service.js';
import { LICHESS_PUZZLE_BANK } from './js/lichess-service.js';
import { getAllPuzzles, PUZZLES } from './js/puzzles.js';

console.log('--- TESTING NEW CHESS QUEST ENGINE & FEATURES ---');

let passedTests = 0;

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`  ✓ ${message}`);
}

try {
  // Test 1: Adaptive Rating Engine
  console.log('\n[1/4] Testing Adaptive Engine & Elo Progression...');
  const initialRating = adaptiveEngine.getRating();
  assert(initialRating >= 500, `Initial rating is valid (${initialRating})`);
  const initialRank = adaptiveEngine.getRank();
  assert(Boolean(initialRank.title && initialRank.icon), `Initial rank title & icon: ${initialRank.icon} ${initialRank.title}`);

  const mockPuzzle = {
    id: 'test_puz_1',
    title: 'Test Fork',
    theme: 'Knight Fork',
    rating: 800,
    themeKey: 'fork'
  };

  const solveRes = adaptiveEngine.recordSolve(mockPuzzle, 0); // 0 hints used
  assert(solveRes.newRating === solveRes.prevRating + 20, `Clean solve grants +20 rating (${solveRes.prevRating} -> ${solveRes.newRating})`);

  const failRes = adaptiveEngine.recordFailure(mockPuzzle);
  assert(failRes.newRating === failRes.prevRating - 8, `Gentle retry deduction of 8 (${failRes.prevRating} -> ${failRes.newRating})`);

  const { strengths, weaknesses } = adaptiveEngine.getStrengthsAndWeaknesses();
  assert(strengths.length > 0, `Strengths calculated successfully (${strengths.length} areas identified)`);
  assert(weaknesses.length > 0, `Improvement areas calculated successfully (${weaknesses.length} areas identified)`);

  const curveData = adaptiveEngine.getLearningCurveData();
  assert(curveData.length > 0, `Learning curve data points generated: ${curveData.length} points`);

  // Test 2: Subscription & Tier Access Control
  console.log('\n[2/4] Testing Subscription Service & Tier Gating...');
  const subTier = subscriptionService.getCurrentTier();
  assert(subTier === TIERS.FREE_TRIAL || subTier === TIERS.MONTHLY || subTier === TIERS.YEARLY, `Current tier is valid (${subTier})`);

  const freePuzzle = { id: 'p_free', tier: 'free_trial', rating: 700 };
  const monthlyPuzzle = { id: 'p_month', tier: 'monthly', rating: 1100 };
  const yearlyPuzzle = { id: 'p_year', tier: 'yearly', rating: 1600 };

  // Set Free Trial
  subscriptionService.setTier(TIERS.FREE_TRIAL);
  assert(subscriptionService.isPuzzleAccessible(freePuzzle), 'Free trial user can access free puzzle');
  assert(!subscriptionService.isPuzzleAccessible(yearlyPuzzle), 'Free trial user cannot access yearly grandmaster puzzle');

  // Set Yearly
  subscriptionService.setTier(TIERS.YEARLY);
  assert(subscriptionService.isPuzzleAccessible(freePuzzle), 'Yearly user can access free puzzle');
  assert(subscriptionService.isPuzzleAccessible(monthlyPuzzle), 'Yearly user can access monthly puzzle');
  assert(subscriptionService.isPuzzleAccessible(yearlyPuzzle), 'Yearly user can access yearly puzzle');

  // Test 3: Lichess Endless Mode Bank
  console.log('\n[3/4] Validating Lichess Puzzle Bank with chess.js...');
  assert(LICHESS_PUZZLE_BANK.length > 0, `Lichess puzzle bank loaded (${LICHESS_PUZZLE_BANK.length} puzzles)`);

  for (const lic of LICHESS_PUZZLE_BANK) {
    const c = new Chess(lic.fen);
    assert(c.turn() === lic.turn, `Lichess #${lic.id} turn matches FEN (${lic.turn})`);
    for (const m of lic.moves) {
      const res = c.move(m);
      if (!res) throw new Error(`Illegal move ${m} in Lichess puzzle #${lic.id}`);
    }
  }
  console.log(`  ✓ All ${LICHESS_PUZZLE_BANK.length} Lichess puzzles validated legally playable!`);

  // Test 4: Intelligent Next-Puzzle Selection
  console.log('\n[4/4] Testing Intelligent Next-Puzzle Allotment...');
  subscriptionService.setTier(TIERS.YEARLY); // Ensure all are accessible
  const allPuzzles = getAllPuzzles();
  assert(allPuzzles.length >= 50, `Catalog contains ${allPuzzles.length} total puzzles`);

  const nextAllotted = adaptiveEngine.selectNextPuzzle(allPuzzles);
  assert(Boolean(nextAllotted && nextAllotted.id), `Intelligent engine allotted puzzle: #${nextAllotted.id} "${nextAllotted.title}" (${nextAllotted.rating || 800} Elo)`);

  // Focus theme selection
  const forkPuzzle = adaptiveEngine.selectNextPuzzle(allPuzzles, { focusTheme: 'fork' });
  assert(Boolean(forkPuzzle && (forkPuzzle.themeKey === 'fork' || (forkPuzzle.theme || '').toLowerCase().includes('fork'))), `Focus theme allotment returned Fork tactic: "${forkPuzzle.title}"`);

  console.log(`\n🎉 ALL ${passedTests} TEST CASES PASSED SUCCESSFULLY!`);
} catch (e) {
  console.error('\n❌ TEST SUITE FAILED:', e);
  process.exit(1);
}
