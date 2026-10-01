// Automated Unit Test Suite for Kid Chess Puzzles
// Tests all 50 puzzles with js/chess.js and verifies full playability and hints

import { Chess } from './js/chess.js';
import { WORLDS, PUZZLES } from './js/puzzles.js';

console.log('--- RUNNING CHESS QUEST TEST SUITE ---');
console.log(`Verifying ${PUZZLES.length} puzzles across ${WORLDS.length} magical worlds...\n`);

let passedCount = 0;
let errors = [];

for (const puzzle of PUZZLES) {
  try {
    // 1. Verify FEN is valid and starting turn matches
    const c = new Chess(puzzle.fen);
    if (c.turn() !== puzzle.turn) {
      throw new Error(`Turn mismatch in Level ${puzzle.id}: expected '${puzzle.turn}', engine reports '${c.turn()}'`);
    }

    // 2. Play through solution moves
    for (let i = 0; i < puzzle.moves.length; i++) {
      const moveSan = puzzle.moves[i];
      const moveRes = c.move(moveSan);
      if (!moveRes) {
        throw new Error(`Illegal move '${moveSan}' at step ${i} in Level ${puzzle.id}`);
      }
    }

    // 3. Verify hint squares match the first move
    if (puzzle.magicMove) {
      const testC = new Chess(puzzle.fen);
      const testRes = testC.move(puzzle.magicMove);
      if (!testRes) {
        throw new Error(`Magic move ${JSON.stringify(puzzle.magicMove)} is not legal in Level ${puzzle.id}`);
      }
      if (puzzle.hint1 && puzzle.hint1.square !== puzzle.magicMove.from) {
        throw new Error(`Hint 1 square '${puzzle.hint1.square}' does not match move start '${puzzle.magicMove.from}' in Level ${puzzle.id}`);
      }
      if (puzzle.hint2 && puzzle.hint2.square !== puzzle.magicMove.to) {
        throw new Error(`Hint 2 square '${puzzle.hint2.square}' does not match move destination '${puzzle.magicMove.to}' in Level ${puzzle.id}`);
      }
    }

    passedCount++;
  } catch (err) {
    errors.push(`Level ${puzzle.id} (${puzzle.title}): ${err.message}`);
  }
}

if (errors.length > 0) {
  console.error('❌ FAILURES DETECTED:');
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log(`✅ ALL ${passedCount} PUZZLES SUCCESSFULLY VALIDATED!`);
  console.log('Worlds:');
  WORLDS.forEach(w => {
    const count = PUZZLES.filter(p => p.world === w.id).length;
    console.log(`  ${w.icon} ${w.name}: ${count} levels`);
  });
  console.log('\n🎉 Test suite passed 100%!');
}
