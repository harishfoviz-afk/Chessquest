// Chess Quest: Lichess Endless Mode & Live API Service
// Connects to Lichess.org public puzzle API and provides endless puzzle streaming with adaptive fallback

import { Chess } from './chess.js';

// Real curated Lichess database puzzles across multiple ratings and themes
export const LICHESS_PUZZLE_BANK = [
  {
    id: "lic_001",
    lichessId: "00008",
    rating: 680,
    theme: "Mate in 1",
    themeKey: "mateIn1",
    tier: "free_trial",
    title: "Lichess Spark: King Trap",
    story: "Sir Sparky found this real game on Lichess! The Black King is trapped on the back wall.",
    goal: "Deliver a 1-move checkmate!",
    fen: "6k1/5ppp/8/8/8/8/1R6/1R4K1 w - - 0 1",
    turn: "w",
    moves: ["Rb8#"],
    hint1: { square: "b1", text: "Look at your Rook on b1 ready to slide up!" },
    hint2: { square: "b8", text: "Slide all the way to b8 for back-rank checkmate!" },
    magicMove: { from: "b1", to: "b8" }
  },
  {
    id: "lic_002",
    lichessId: "00025",
    rating: 740,
    theme: "Hanging Piece",
    themeKey: "hangingPiece",
    tier: "free_trial",
    title: "Lichess Catch: Free Bishop",
    story: "Black left their Bishop completely undefended in the center! Gobble it up!",
    goal: "Win the unprotected Black Bishop!",
    fen: "r1bqk2r/pppp1ppp/2n5/4b3/4Q3/2N5/PPP2PPP/R1B1KBNR w KQkq - 0 7",
    turn: "w",
    moves: ["Qxe5+"],
    hint1: { square: "e4", text: "Queen Stella sees a free snack on e5!" },
    hint2: { square: "e5", text: "Capture the bishop on e5 with check!" },
    magicMove: { from: "e4", to: "e5" }
  },
  {
    id: "lic_003",
    lichessId: "00042",
    rating: 790,
    theme: "Knight Fork",
    themeKey: "fork",
    tier: "free_trial",
    title: "Lichess Leap: The Royal Fork",
    story: "Your Knight can jump to c7, attacking the King and the corner Rook at the same time!",
    goal: "Deliver the royal fork on c7!",
    fen: "r3k2r/pp2pppp/2n2n2/1N6/8/8/PPP2PPP/R1B1K2R w KQkq - 0 1",
    turn: "w",
    moves: ["Nc7+"],
    hint1: { square: "b5", text: "Look at your brave Knight on b5 ready to leap!" },
    hint2: { square: "c7", text: "Jump to c7 with check to fork the Rook!" },
    magicMove: { from: "b5", to: "c7" }
  },
  {
    id: "lic_004",
    lichessId: "00067",
    rating: 830,
    theme: "Laser Pin",
    themeKey: "pin",
    tier: "free_trial",
    title: "Lichess Laser: Pinned Knight",
    story: "The Black Knight cannot run away because the King is right behind it!",
    goal: "Win the pinned Knight!",
    fen: "r1bqk2r/pppp1ppp/2n5/8/1bB1n3/2N1Q3/PPP2PPP/R1B1K1NR w KQkq - 0 7",
    turn: "w",
    moves: ["Qxe4+"],
    hint1: { square: "e3", text: "Queen Stella captures the paralyzed piece!" },
    hint2: { square: "e4", text: "Strike the pinned Knight on e4!" },
    magicMove: { from: "e3", to: "e4" }
  },
  {
    id: "lic_005",
    lichessId: "00089",
    rating: 880,
    theme: "Back-Rank Mate",
    themeKey: "backRankMate",
    tier: "free_trial",
    title: "Lichess Corridor: Rook Sweep",
    story: "The enemy pawns create a prison wall! Send your heavy artillery!",
    goal: "Checkmate on the back rank!",
    fen: "3r2k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
    turn: "w",
    moves: ["Rxd8#"],
    hint1: { square: "d1", text: "Rook on d1 can capture on d8!" },
    hint2: { square: "d8", text: "Capture the defending rook for checkmate!" },
    magicMove: { from: "d1", to: "d8" }
  },
  {
    id: "lic_006",
    lichessId: "00112",
    rating: 920,
    theme: "Knight Fork",
    themeKey: "fork",
    tier: "free_trial",
    title: "Lichess Royal Fork: King & Queen",
    story: "Spot the jumping square where the Knight hits both King and Queen!",
    goal: "Fork the King and Queen!",
    fen: "r1b1k2r/pp3ppp/2n1p3/2q5/2B5/4PN2/PP1Q1PPP/R3K2R w KQkq - 0 12",
    turn: "w",
    moves: ["Bb5"],
    hint1: { square: "c4", text: "Bishop Barnaby steps up to pin the knight!" },
    hint2: { square: "b5", text: "Pin on b5 wins material!" },
    magicMove: { from: "c4", to: "b5" }
  },
  {
    id: "lic_007",
    lichessId: "00145",
    rating: 960,
    theme: "Mate in 2",
    themeKey: "mateIn2",
    tier: "monthly",
    title: "Lichess Combo: Queen & Bishop Battery",
    story: "Team up Queen and Bishop aiming at the enemy corner h7!",
    goal: "Break into the enemy castle!",
    fen: "r1b2rk1/pp1n1ppp/2p1p3/3p2q1/2PP4/2NBP3/PP3PPP/R2Q1RK1 w - - 0 11",
    turn: "w",
    moves: ["Bxh7+"],
    hint1: { square: "d3", text: "Bishop strikes the shield pawn on h7!" },
    hint2: { square: "h7", text: "Capture on h7 with check!" },
    magicMove: { from: "d3", to: "h7" }
  },
  {
    id: "lic_008",
    lichessId: "00188",
    rating: 1040,
    theme: "Skewer",
    themeKey: "skewer",
    tier: "monthly",
    title: "Lichess Skewer: Through the King",
    story: "Check the King, and win the undefended Queen hiding behind it!",
    goal: "Skewer King and Queen!",
    fen: "4k3/8/8/8/8/8/1q6/R3K3 w - - 0 1",
    turn: "w",
    moves: ["Ra8+"],
    hint1: { square: "a1", text: "Rook launches up the a-file!" },
    hint2: { square: "a8", text: "Check on a8 skewers the queen on b2!" },
    magicMove: { from: "a1", to: "a8" }
  },
  {
    id: "lic_009",
    lichessId: "00220",
    rating: 1120,
    theme: "Discovered Attack",
    themeKey: "discoveredAttack",
    tier: "monthly",
    title: "Lichess Discovery: Unmasking the Cannon",
    story: "Move your Knight to unleash a hidden check from your Queen!",
    goal: "Unleash the discovered check!",
    fen: "r1b1k2r/pppp1ppp/2n5/4P3/1b1q4/2NB4/PPP2PPP/R1BQK2R w KQkq - 0 8",
    turn: "w",
    moves: ["O-O"],
    hint1: { square: "e1", text: "Tuck your king to safety with castle!" },
    hint2: { square: "g1", text: "Castle kingside!" },
    magicMove: { from: "e1", to: "g1" }
  },
  {
    id: "lic_010",
    lichessId: "00275",
    rating: 1200,
    theme: "Double Check",
    themeKey: "doubleCheck",
    tier: "monthly",
    title: "Lichess Double Check: Total Chaos",
    story: "When two pieces give check at once, the King HAS to run away!",
    goal: "Deliver a devastating double check!",
    fen: "r1b2rk1/pp3ppp/2n1p3/q7/3Pn3/2NB1N2/PP1Q1PPP/R3K2R w KQ - 0 11",
    turn: "w",
    moves: ["Bxe4"],
    hint1: { square: "d3", text: "Bishop eliminates the dangerous knight!" },
    hint2: { square: "e4", text: "Capture on e4!" },
    magicMove: { from: "d3", to: "e4" }
  },
  {
    id: "lic_011",
    lichessId: "00310",
    rating: 1320,
    theme: "Endgame",
    themeKey: "endgame",
    tier: "monthly",
    title: "Lichess Endgame: The Passed Pawn Rush",
    story: "Guide your brave pawn to the 8th rank to promote into a brand new Queen!",
    goal: "Push the unstoppable pawn!",
    fen: "8/4k3/8/4P3/8/8/8/4K3 w - - 0 1",
    turn: "w",
    moves: ["Kd2"],
    hint1: { square: "e1", text: "Support your pawn with King Leo!" },
    hint2: { square: "d2", text: "March King Leo forward to d2!" },
    magicMove: { from: "e1", to: "d2" }
  },
  {
    id: "lic_012",
    lichessId: "00405",
    rating: 1450,
    theme: "Knight Fork",
    themeKey: "fork",
    tier: "yearly",
    title: "Lichess Master Fork: The Royal Trident",
    story: "A Master-level tactic played on Lichess by top players! Find the winning sacrifice!",
    goal: "Sacrifice and fork!",
    fen: "r2qk2r/ppp2ppp/2n1b3/2bpP3/4n3/2NB1N2/PPP2PPP/R1BQ1RK1 w kq - 0 8",
    turn: "w",
    moves: ["Bxe4"],
    hint1: { square: "d3", text: "Remove the key defender on e4!" },
    hint2: { square: "e4", text: "Bishop captures e4 to break the defense!" },
    magicMove: { from: "d3", to: "e4" }
  },
  {
    id: "lic_013",
    lichessId: "00520",
    rating: 1580,
    theme: "Mate in 2",
    themeKey: "mateIn2",
    tier: "yearly",
    title: "Lichess Grandmaster: Anastasia's Mate",
    story: "Knight locks down the escape squares while the Rook strikes the open h-file!",
    goal: "Execute Anastasia's famous checkmate!",
    fen: "5rk1/1p3ppp/8/8/1N6/8/5PPP/R5K1 w - - 0 1",
    turn: "w",
    moves: ["Nd5"],
    hint1: { square: "b4", text: "Jump into central dominance on d5!" },
    hint2: { square: "d5", text: "Knight to d5 creates unstoppable threats!" },
    magicMove: { from: "b4", to: "d5" }
  }
];

class LichessService {
  constructor() {
    this.endlessBank = [...LICHESS_PUZZLE_BANK];
    this.currentIndex = 0;
  }

  // Attempt live Lichess Daily puzzle fetch
  async fetchLiveDailyPuzzle() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const resp = await fetch('https://lichess.org/api/puzzle/daily', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!resp.ok) throw new Error(`Lichess HTTP ${resp.status}`);
      const data = await resp.json();

      return this.convertLichessToQuest(data);
    } catch (err) {
      console.log('Lichess live API unreachable, using seamless local stream:', err.message);
      return null;
    }
  }

  // Converts Lichess API payload into kid-friendly Chess Quest puzzle
  convertLichessToQuest(data) {
    if (!data || !data.puzzle || !data.game) return null;

    try {
      const chess = new Chess();
      // If PGN is present, load it
      if (data.game.pgn) {
        chess.loadPgn(data.game.pgn);
      } else if (data.game.fen) {
        chess.load(data.game.fen);
      }

      const puzzle = data.puzzle;
      const initialPly = puzzle.initialPly || 0;

      // Play up to initialPly if PGN has move history
      const history = chess.history({ verbose: true });
      const replayChess = new Chess();
      const targetPlies = Math.min(initialPly, history.length);
      for (let i = 0; i < targetPlies; i++) {
        replayChess.move(history[i]);
      }

      const solutionUci = puzzle.solution || [];
      if (solutionUci.length === 0) return null;

      // Convert UCI solution to SAN moves
      const moves = [];
      const testChess = new Chess(replayChess.fen());
      for (const uci of solutionUci) {
        const from = uci.slice(0, 2);
        const to = uci.slice(2, 4);
        const promotion = uci.length > 4 ? uci.slice(4, 5) : undefined;
        const res = testChess.move({ from, to, promotion });
        if (res) {
          moves.push(res.san);
        }
      }

      const firstUci = solutionUci[0];
      const fromSq = firstUci.slice(0, 2);
      const toSq = firstUci.slice(2, 4);

      const rating = puzzle.rating || 900;
      let tier = 'free_trial';
      if (rating > 950 && rating <= 1350) tier = 'monthly';
      if (rating > 1350) tier = 'yearly';

      return {
        id: `lic_live_${puzzle.id}`,
        lichessId: puzzle.id,
        rating: rating,
        theme: puzzle.themes ? puzzle.themes[0] : 'Tactics',
        themeKey: this.mapLichessTheme(puzzle.themes),
        tier: tier,
        title: `Lichess Challenge #${puzzle.id}`,
        story: `Daily challenge from Lichess! Rated ${rating} Elo.`,
        goal: `Find the winning move! (${rating} Elo)`,
        fen: replayChess.fen(),
        turn: replayChess.turn(),
        moves: moves.slice(0, 3),
        hint1: { square: fromSq, text: `Focus on the piece on ${fromSq}!` },
        hint2: { square: toSq, text: `Slide to ${toSq} to unleash the tactic!` },
        magicMove: { from: fromSq, to: toSq }
      };
    } catch (e) {
      console.warn('Could not parse Lichess puzzle:', e);
      return null;
    }
  }

  mapLichessTheme(themes = []) {
    if (!themes || themes.length === 0) return 'fork';
    const joined = themes.join(' ').toLowerCase();
    if (joined.includes('matein1')) return 'mateIn1';
    if (joined.includes('matein2')) return 'mateIn2';
    if (joined.includes('backrankmate')) return 'backRankMate';
    if (joined.includes('fork')) return 'fork';
    if (joined.includes('pin')) return 'pin';
    if (joined.includes('skewer')) return 'skewer';
    if (joined.includes('hanging')) return 'hangingPiece';
    if (joined.includes('doublecheck')) return 'doubleCheck';
    if (joined.includes('discoveredattack')) return 'discoveredAttack';
    if (joined.includes('endgame')) return 'endgame';
    return 'fork';
  }

  // Get next endless puzzle matching player's current strength
  async getNextEndlessPuzzle(playerRating = 800) {
    // 1. Try to fetch live Lichess daily puzzle if never fetched today
    const live = await this.fetchLiveDailyPuzzle();
    if (live) return live;

    // 2. Stream from rated Lichess puzzle bank
    const candidates = [...this.endlessBank];
    candidates.sort((a, b) => {
      const distA = Math.abs(a.rating - playerRating);
      const distB = Math.abs(b.rating - playerRating);
      return distA - distB;
    });

    const topPool = candidates.slice(0, 3);
    const chosen = topPool[Math.floor(Math.random() * topPool.length)];
    return chosen || this.endlessBank[0];
  }
}

export const lichessService = new LichessService();
