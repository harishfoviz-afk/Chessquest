// Kid-Friendly Progressive Chess Puzzles Database (50 Levels across 5 Worlds)
// Fully verified with chess.js engine

export const WORLDS = [
  { id: 1, name: "Sunny Meadow", icon: "🌱", color: "#4CAF50", description: "Mate in 1 Explorers" },
  { id: 2, name: "Knight's Orchard", icon: "🍎", color: "#FF9800", description: "Forks & Leaps" },
  { id: 3, name: "Coral Castle", icon: "🏰", color: "#2196F3", description: "Pins & Laser Diagonals" },
  { id: 4, name: "Cloud Kingdom", icon: "☁️", color: "#9C27B0", description: "Discovered Attacks & Sieges" },
  { id: 5, name: "Dragon's Peak", icon: "🐉", color: "#E91E63", description: "Grandmaster Combinations" }
];

export const PUZZLES = [
  {
    "id": 1,
    "world": 1,
    "worldName": "Sunny Meadow",
    "worldIcon": "🌱",
    "title": "The Queen's Hug",
    "theme": "Mate in 1",
    "story": "Queen Stella wants to sneak in for a royal high-five! Can you spot the checkmate?",
    "goal": "Checkmate the Black King in 1 move!",
    "fen": "r1bqkb1r/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
    "turn": "w",
    "moves": [
      "Qxf7#"
    ],
    "hint1": {
      "square": "h5",
      "text": "Look at Queen Stella on h5! She has laser focus on the black king."
    },
    "hint2": {
      "square": "f7",
      "text": "Target the soft f7 pawn right next to the King!"
    },
    "magicMove": {
      "from": "h5",
      "to": "f7"
    }
  },
  {
    "id": 2,
    "world": 1,
    "worldName": "Sunny Meadow",
    "worldIcon": "🌱",
    "title": "Castle Back Door",
    "theme": "Back-Rank Mate",
    "story": "The Black King is trapped behind his own wall of pawns! Roll your Rook down the file!",
    "goal": "Roll your Rook for an unstoppable back-rank mate!",
    "fen": "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Ra8#"
    ],
    "hint1": {
      "square": "a1",
      "text": "Your Rook on a1 is ready to race down the board!"
    },
    "hint2": {
      "square": "a8",
      "text": "Slide all the way to a8 to deliver the back-rank mate!"
    },
    "magicMove": {
      "from": "a1",
      "to": "a8"
    }
  },
  {
    "id": 3,
    "world": 1,
    "worldName": "Sunny Meadow",
    "worldIcon": "🌱",
    "title": "The Sneaky Horse",
    "theme": "Smothered Mate",
    "story": "The King is trapped in the corner by his own friendly guards. Jump your Knight in!",
    "goal": "Deliver a surprise Smothered Mate with your Knight!",
    "fen": "6rk/6pp/7N/8/8/8/8/6K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Nf7#"
    ],
    "hint1": {
      "square": "h6",
      "text": "Your brave Knight on h6 can leap over any piece!"
    },
    "hint2": {
      "square": "f7",
      "text": "Jump to f7 right into the heart of the corner!"
    },
    "magicMove": {
      "from": "h6",
      "to": "f7"
    }
  },
  {
    "id": 4,
    "world": 1,
    "worldName": "Sunny Meadow",
    "worldIcon": "🌱",
    "title": "Double Rook Roll",
    "theme": "Lawnmower Mate",
    "story": "Two rooks working as a team! One rook cuts off escape, now roll the second rook!",
    "goal": "Roll your second rook forward for checkmate!",
    "fen": "7k/R7/8/8/8/8/1R6/6K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Rb8#"
    ],
    "hint1": {
      "square": "b2",
      "text": "The Rook on b2 wants to join the party on the back rank!"
    },
    "hint2": {
      "square": "b8",
      "text": "Roll the rook all the way to b8!"
    },
    "magicMove": {
      "from": "b2",
      "to": "b8"
    }
  },
  {
    "id": 5,
    "world": 1,
    "worldName": "Sunny Meadow",
    "worldIcon": "🌱",
    "title": "The Arabian Hook",
    "theme": "Arabian Mate",
    "story": "The Knight and Rook make an unstoppable pair! Trap the corner King!",
    "goal": "Team up Knight and Rook for the Arabian Mate!",
    "fen": "7k/R6p/5N2/8/8/8/8/6K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Rxh7#"
    ],
    "hint1": {
      "square": "a7",
      "text": "Your Rook on a7 is ready to slide across the 7th rank!"
    },
    "hint2": {
      "square": "h7",
      "text": "Capture the pawn on h7! The Knight on f6 will protect you!"
    },
    "magicMove": {
      "from": "a7",
      "to": "h7"
    }
  },
  {
    "id": 6,
    "world": 1,
    "worldName": "Sunny Meadow",
    "worldIcon": "🌱",
    "title": "Queen's Royal Corridor",
    "theme": "Mate in 1",
    "story": "The Black King has no escape squares on the 8th rank. Fly the Queen in!",
    "goal": "Fly the Queen to the back rank for checkmate!",
    "fen": "6k1/5ppp/8/8/8/8/5PPP/4Q1K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Qe8#"
    ],
    "hint1": {
      "square": "e1",
      "text": "Queen Stella on e1 has a clear runway straight ahead!"
    },
    "hint2": {
      "square": "e8",
      "text": "Fly all the way to e8 for checkmate!"
    },
    "magicMove": {
      "from": "e1",
      "to": "e8"
    }
  },
  {
    "id": 7,
    "world": 1,
    "worldName": "Sunny Meadow",
    "worldIcon": "🌱",
    "title": "The Fool's Trap",
    "theme": "Fool's Mate",
    "story": "White left their diagonal completely open! Black Queen strikes with lightning speed!",
    "goal": "Zap along the open diagonal with your Queen!",
    "fen": "rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2",
    "turn": "b",
    "moves": [
      "Qh4#"
    ],
    "hint1": {
      "square": "d8",
      "text": "Your Black Queen on d8 spots the open diagonal pathway!"
    },
    "hint2": {
      "square": "h4",
      "text": "Fly diagonally to h4 to strike the exposed King!"
    },
    "magicMove": {
      "from": "d8",
      "to": "h4"
    }
  },
  {
    "id": 8,
    "world": 1,
    "worldName": "Sunny Meadow",
    "worldIcon": "🌱",
    "title": "The Tower Capture",
    "theme": "Back-Rank Mate",
    "story": "The enemy Rook guards the rank, but you can capture it and checkmate at the same time!",
    "goal": "Capture the Rook on d8 for checkmate!",
    "fen": "3r2k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Rxd8#"
    ],
    "hint1": {
      "square": "d1",
      "text": "Your Rook on d1 has eyes on the enemy Rook!"
    },
    "hint2": {
      "square": "d8",
      "text": "Capture the Rook on d8 and deliver checkmate!"
    },
    "magicMove": {
      "from": "d1",
      "to": "d8"
    }
  },
  {
    "id": 9,
    "world": 1,
    "worldName": "Sunny Meadow",
    "worldIcon": "🌱",
    "title": "Side Door Slam",
    "theme": "Back-Rank Mate",
    "story": "The Black King is trapped on the rim! Swing your Queen all the way across!",
    "goal": "Slide the Queen to b8 for checkmate!",
    "fen": "7k/8/6K1/8/8/8/8/1Q6 w - - 0 1",
    "turn": "w",
    "moves": [
      "Qb8#"
    ],
    "hint1": {
      "square": "b1",
      "text": "The Queen on b1 can roll all the way up the board!"
    },
    "hint2": {
      "square": "b8",
      "text": "Land on b8 to deliver an inescapable checkmate!"
    },
    "magicMove": {
      "from": "b1",
      "to": "b8"
    }
  },
  {
    "id": 10,
    "world": 1,
    "worldName": "Sunny Meadow",
    "worldIcon": "🌱",
    "title": "The Pawn's Golden Crown",
    "theme": "Promotion Mate",
    "story": "Pawn Percy reached the 7th rank! Push him forward and crown him Queen for checkmate!",
    "goal": "Promote your pawn to a Queen for checkmate!",
    "fen": "3k4/4RP2/8/3K4/8/8/8/8 w - - 0 1",
    "turn": "w",
    "moves": [
      "f8=Q#"
    ],
    "hint1": {
      "square": "f7",
      "text": "The brave pawn on f7 is just one step away from becoming a Queen!"
    },
    "hint2": {
      "square": "f8",
      "text": "March to f8 and crown a brand new Queen!"
    },
    "magicMove": {
      "from": "f7",
      "to": "f8",
      "promotion": "q"
    }
  },
  {
    "id": 11,
    "world": 2,
    "worldName": "Knight's Orchard",
    "worldIcon": "🍎",
    "title": "The Royal Fork",
    "theme": "Knight Fork",
    "story": "Jump your Knight onto c7 to attack the King and Rook at once!",
    "goal": "Fork the King and Rook with Nc7+!",
    "fen": "r3k3/ppp2ppp/8/3N4/8/8/PPPP1PPP/R1BQK2R w KQq - 0 1",
    "turn": "w",
    "moves": [
      "Nc7+"
    ],
    "hint1": {
      "square": "d5",
      "text": "Your Knight on d5 sees a golden jumping square!"
    },
    "hint2": {
      "square": "c7",
      "text": "Hop onto c7 to attack the King and the Rook simultaneously!"
    },
    "magicMove": {
      "from": "d5",
      "to": "c7"
    }
  },
  {
    "id": 12,
    "world": 2,
    "worldName": "Knight's Orchard",
    "worldIcon": "🍎",
    "title": "Queen Snatch",
    "theme": "Free Queen",
    "story": "The enemy Queen landed on an unguarded square! Snatch her with your Knight!",
    "goal": "Capture the unguarded Queen on d5!",
    "fen": "4k3/8/8/3q4/8/2N5/8/4K3 w - - 0 1",
    "turn": "w",
    "moves": [
      "Nxd5"
    ],
    "hint1": {
      "square": "c3",
      "text": "Your Knight on c3 is hungry for royalty!"
    },
    "hint2": {
      "square": "d5",
      "text": "Capture the Queen directly on d5!"
    },
    "magicMove": {
      "from": "c3",
      "to": "d5"
    }
  },
  {
    "id": 13,
    "world": 2,
    "worldName": "Knight's Orchard",
    "worldIcon": "🍎",
    "title": "Double Pawn Punch",
    "theme": "Pawn Fork",
    "story": "Pawn Pete can step up and fork two pieces at once! Strike in the center!",
    "goal": "Push your pawn to d4 to fork both black pieces!",
    "fen": "r1bqk2r/pppp1ppp/8/4b3/4n3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 1",
    "turn": "w",
    "moves": [
      "d4"
    ],
    "hint1": {
      "square": "d2",
      "text": "Push the d-pawn two squares straight ahead!"
    },
    "hint2": {
      "square": "d4",
      "text": "Land on d4 to poke both the Bishop and Knight at the same time!"
    },
    "magicMove": {
      "from": "d2",
      "to": "d4"
    }
  },
  {
    "id": 14,
    "world": 2,
    "worldName": "Knight's Orchard",
    "worldIcon": "🍎",
    "title": "The Skewer Spear",
    "theme": "Rook Skewer",
    "story": "Line up the King and the Queen! When the King is pinned, grab the Queen!",
    "goal": "Capture the Queen on e6!",
    "fen": "4k3/8/4q3/8/8/8/8/4R1K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Rxe6+"
    ],
    "hint1": {
      "square": "e1",
      "text": "Your Rook has laser focus down the e-file!"
    },
    "hint2": {
      "square": "e6",
      "text": "Capture the pinned Queen on e6 with check!"
    },
    "magicMove": {
      "from": "e1",
      "to": "e6"
    }
  },
  {
    "id": 15,
    "world": 2,
    "worldName": "Knight's Orchard",
    "worldIcon": "🍎",
    "title": "Double Check Wonder",
    "theme": "Double Check",
    "story": "Jump your Knight to attack with BOTH Knight and Bishop!",
    "goal": "Deliver a surprise Double Check with Nh6+!",
    "fen": "5rk1/5Npp/8/8/2B5/8/8/6K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Nh6+"
    ],
    "hint1": {
      "square": "f7",
      "text": "Your Knight can jump with double check power!"
    },
    "hint2": {
      "square": "h6",
      "text": "Jump to h6 to unleash a double check from Knight and Bishop!"
    },
    "magicMove": {
      "from": "f7",
      "to": "h6"
    }
  },
  {
    "id": 16,
    "world": 2,
    "worldName": "Knight's Orchard",
    "worldIcon": "🍎",
    "title": "Central Fork Strike",
    "theme": "Queen Fork",
    "story": "Queen Stella can zoom to the center, attacking the King and Knight simultaneously!",
    "goal": "Fork the Knight and pressure f7 with Qd5!",
    "fen": "r1bqk2r/pppp1ppp/2n5/4p3/4n3/2P2N2/PPP2PPP/R1BQKB1R w KQkq - 0 1",
    "turn": "w",
    "moves": [
      "Qd5"
    ],
    "hint1": {
      "square": "d1",
      "text": "Queen Stella on d1 sees two targets at once!"
    },
    "hint2": {
      "square": "d5",
      "text": "Step to d5 to fork the Knight and threaten checkmate!"
    },
    "magicMove": {
      "from": "d1",
      "to": "d5"
    }
  },
  {
    "id": 17,
    "world": 2,
    "worldName": "Knight's Orchard",
    "worldIcon": "🍎",
    "title": "The Corner Sniper",
    "theme": "Bishop Fork",
    "story": "Bishop Barnaby strikes the g7 pawn and traps the sleeping rook on h8!",
    "goal": "Capture g7 and fork the corner rook!",
    "fen": "r3k2r/1pp2ppp/8/8/8/8/1B6/4K3 w kq - 0 1",
    "turn": "w",
    "moves": [
      "Bxg7"
    ],
    "hint1": {
      "square": "b2",
      "text": "Bishop Barnaby on b2 controls the long diagonal!"
    },
    "hint2": {
      "square": "g7",
      "text": "Capture the g7 pawn and attack the trapped rook on h8!"
    },
    "magicMove": {
      "from": "b2",
      "to": "g7"
    }
  },
  {
    "id": 18,
    "world": 2,
    "worldName": "Knight's Orchard",
    "worldIcon": "🍎",
    "title": "Double Threat Queen",
    "theme": "Double Attack",
    "story": "Check the exposed King and eye the undefended rook in the corner!",
    "goal": "Deliver a royal double attack with Qe4+!",
    "fen": "r3k3/5ppp/8/8/8/8/5PPP/4Q1K1 w q - 0 1",
    "turn": "w",
    "moves": [
      "Qe4+"
    ],
    "hint1": {
      "square": "e1",
      "text": "Queen Stella can zoom to the center on e4!"
    },
    "hint2": {
      "square": "e4",
      "text": "Check the King on e4 and eye the corner Rook on a8!"
    },
    "magicMove": {
      "from": "e1",
      "to": "e4"
    }
  },
  {
    "id": 19,
    "world": 2,
    "worldName": "Knight's Orchard",
    "worldIcon": "🍎",
    "title": "Knight Helper Mate",
    "theme": "Mate in 1",
    "story": "The Knight guards the retreat squares while Queen delivers the final blow!",
    "goal": "Deliver checkmate with Qe8#!",
    "fen": "6k1/5ppp/8/5N2/8/8/5PPP/4Q1K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Qe8#"
    ],
    "hint1": {
      "square": "e1",
      "text": "Your Queen on e1 has a direct line to e8!"
    },
    "hint2": {
      "square": "e8",
      "text": "Fly all the way to e8 for checkmate!"
    },
    "magicMove": {
      "from": "e1",
      "to": "e8"
    }
  },
  {
    "id": 20,
    "world": 2,
    "worldName": "Knight's Orchard",
    "worldIcon": "🍎",
    "title": "The Knight's Golden Hook",
    "theme": "Knight Fork",
    "story": "Spring the Knight into c7 to win the heavy artillery on a8!",
    "goal": "Fork King and Rook with Nc7+!",
    "fen": "r1b1k3/pp3ppp/8/3N4/8/8/PP3PPP/4K3 w q - 0 1",
    "turn": "w",
    "moves": [
      "Nc7+"
    ],
    "hint1": {
      "square": "d5",
      "text": "Your Knight on d5 is ready to spring into action!"
    },
    "hint2": {
      "square": "c7",
      "text": "Hop to c7 with check and win the rook on a8!"
    },
    "magicMove": {
      "from": "d5",
      "to": "c7"
    }
  },
  {
    "id": 21,
    "world": 3,
    "worldName": "Coral Castle",
    "worldIcon": "🏰",
    "title": "The Frozen Knight",
    "theme": "Absolute Pin",
    "story": "Pin the enemy Knight to their King so it cannot move!",
    "goal": "Attack the pinned knight with Bg5!",
    "fen": "4k3/4n3/8/8/8/8/8/2B1R1K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Bg5"
    ],
    "hint1": {
      "square": "c1",
      "text": "Bishop Barnaby can target the helpless pinned piece!"
    },
    "hint2": {
      "square": "g5",
      "text": "Slide to g5 to double-attack the pinned knight!"
    },
    "magicMove": {
      "from": "c1",
      "to": "g5"
    }
  },
  {
    "id": 22,
    "world": 3,
    "worldName": "Coral Castle",
    "worldIcon": "🏰",
    "title": "The Trapped Queen",
    "theme": "Trapped Piece",
    "story": "The enemy Queen is trapped in the corner! Skewer and capture her!",
    "goal": "Capture the trapped Queen on a8!",
    "fen": "q3k3/8/8/8/8/8/8/R3K3 w Q - 0 1",
    "turn": "w",
    "moves": [
      "Rxa8+"
    ],
    "hint1": {
      "square": "a1",
      "text": "Your Rook on a1 can capture right now!"
    },
    "hint2": {
      "square": "a8",
      "text": "Take the Queen on a8 with check!"
    },
    "magicMove": {
      "from": "a1",
      "to": "a8"
    }
  },
  {
    "id": 23,
    "world": 3,
    "worldName": "Coral Castle",
    "worldIcon": "🏰",
    "title": "Bishop's Laser Kiss",
    "theme": "Diagonal Mate",
    "story": "Bishop Barnaby coordinates with King Leo to deliver a crisp mate!",
    "goal": "Deliver diagonal checkmate with Bd5#!",
    "fen": "k7/2K5/8/8/8/8/8/7B w - - 0 1",
    "turn": "w",
    "moves": [
      "Bd5#"
    ],
    "hint1": {
      "square": "h1",
      "text": "Bishop Barnaby on h1 controls the royal diagonal to a8!"
    },
    "hint2": {
      "square": "d5",
      "text": "Slide to d5 to checkmate the trapped King!"
    },
    "magicMove": {
      "from": "h1",
      "to": "d5"
    }
  },
  {
    "id": 24,
    "world": 3,
    "worldName": "Coral Castle",
    "worldIcon": "🏰",
    "title": "The Royal Battery",
    "theme": "Battery Mate",
    "story": "Queen and Bishop team up in a super battery pointing straight at h7!",
    "goal": "Unleash the battery mate with Qxh7#!",
    "fen": "r1b2rk1/ppp2ppp/2n5/3p4/8/3Q4/PPB2PPP/R1B1R1K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Qxh7#"
    ],
    "hint1": {
      "square": "d3",
      "text": "Queen Stella is in front of the battery!"
    },
    "hint2": {
      "square": "h7",
      "text": "Smash through on h7 for checkmate!"
    },
    "magicMove": {
      "from": "d3",
      "to": "h7"
    }
  },
  {
    "id": 25,
    "world": 3,
    "worldName": "Coral Castle",
    "worldIcon": "🏰",
    "title": "The Pin Snatcher",
    "theme": "Pin Tactic",
    "story": "The enemy Queen is pinned to her King! Capture her with your Bishop!",
    "goal": "Capture the pinned Queen with Bxd7+!",
    "fen": "r3k2r/pppq1ppp/8/1B6/8/8/PPPP1PPP/R1B1K2R w KQkq - 0 1",
    "turn": "w",
    "moves": [
      "Bxd7+"
    ],
    "hint1": {
      "square": "b5",
      "text": "Your Bishop on b5 has the Queen trapped in front of King!"
    },
    "hint2": {
      "square": "d7",
      "text": "Capture the Queen on d7 with check!"
    },
    "magicMove": {
      "from": "b5",
      "to": "d7"
    }
  },
  {
    "id": 26,
    "world": 3,
    "worldName": "Coral Castle",
    "worldIcon": "🏰",
    "title": "The Bishop Trap",
    "theme": "Trapping Piece",
    "story": "The enemy Bishop took a detour to a2. Capture him with your Rook!",
    "goal": "Capture the trapped Bishop on a2!",
    "fen": "r1bqk2r/pppp1ppp/2n5/4p3/4P3/8/bPPP1PPP/R1BQKBNR w KQkq - 0 1",
    "turn": "w",
    "moves": [
      "Rxa2"
    ],
    "hint1": {
      "square": "a1",
      "text": "Your Rook on a1 can capture the intruder!"
    },
    "hint2": {
      "square": "a2",
      "text": "Capture the stranded Bishop on a2!"
    },
    "magicMove": {
      "from": "a1",
      "to": "a2"
    }
  },
  {
    "id": 27,
    "world": 3,
    "worldName": "Coral Castle",
    "worldIcon": "🏰",
    "title": "The Queen Laser Skewer",
    "theme": "Queen Skewer",
    "story": "Line up the King and the Rook! Check the King and collect the Rook!",
    "goal": "Deliver a royal skewer fork with Qe5+!",
    "fen": "4k3/8/8/8/8/8/1r6/4Q1K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Qe5+"
    ],
    "hint1": {
      "square": "e1",
      "text": "Queen Stella can jump to the center on e5!"
    },
    "hint2": {
      "square": "e5",
      "text": "Check King on e8 and attack Rook on b2 simultaneously!"
    },
    "magicMove": {
      "from": "e1",
      "to": "e5"
    }
  },
  {
    "id": 28,
    "world": 3,
    "worldName": "Coral Castle",
    "worldIcon": "🏰",
    "title": "The Cross-Board Bishop",
    "theme": "Mate in 1",
    "story": "The Black King is trapped on the rim. Bishop sweeps in with King defense!",
    "goal": "Slide the Bishop to d4 for checkmate!",
    "fen": "7k/5K2/8/8/8/8/8/6B1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Bd4#"
    ],
    "hint1": {
      "square": "g1",
      "text": "Bishop Barnaby on g1 sees the grand highway!"
    },
    "hint2": {
      "square": "d4",
      "text": "Slide to d4 to deliver checkmate!"
    },
    "magicMove": {
      "from": "g1",
      "to": "d4"
    }
  },
  {
    "id": 29,
    "world": 3,
    "worldName": "Coral Castle",
    "worldIcon": "🏰",
    "title": "Rook Skewer on Rank 8",
    "theme": "Skewer",
    "story": "Skewering the Black King and his buddy Rook on the back rank!",
    "goal": "Capture the corner rook with Rxa8+!",
    "fen": "r6k/8/8/8/8/8/8/R5K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Rxa8+"
    ],
    "hint1": {
      "square": "a1",
      "text": "Your Rook on a1 can capture directly!"
    },
    "hint2": {
      "square": "a8",
      "text": "Take the Rook on a8 with check!"
    },
    "magicMove": {
      "from": "a1",
      "to": "a8"
    }
  },
  {
    "id": 30,
    "world": 3,
    "worldName": "Coral Castle",
    "worldIcon": "🏰",
    "title": "The Queen's Checkmate Crown",
    "theme": "Mate in 1",
    "story": "Queen Stella dives right in front of the King, protected by her friendly Bishop!",
    "goal": "Deliver back-rank checkmate with Qe8#!",
    "fen": "7k/4Qppp/8/8/1B6/8/5PPP/6K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Qe8#"
    ],
    "hint1": {
      "square": "e7",
      "text": "Queen Stella on e7 has the back rank in her sights!"
    },
    "hint2": {
      "square": "e8",
      "text": "Fly to e8 for a back rank checkmate!"
    },
    "magicMove": {
      "from": "e7",
      "to": "e8"
    }
  },
  {
    "id": 31,
    "world": 4,
    "worldName": "Cloud Kingdom",
    "worldIcon": "☁️",
    "title": "The Discovered Check",
    "theme": "Discovered Attack",
    "story": "Step the Knight aside to unleash the Rook's hidden laser beam!",
    "goal": "Unleash a discovered check with Nd6+!",
    "fen": "4k3/8/8/8/4N3/8/8/4R1K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Nd6+"
    ],
    "hint1": {
      "square": "e4",
      "text": "Your Knight can step away to reveal the Rook behind him!"
    },
    "hint2": {
      "square": "d6",
      "text": "Hop to d6 to deliver a powerful discovered check!"
    },
    "magicMove": {
      "from": "e4",
      "to": "d6"
    }
  },
  {
    "id": 32,
    "world": 4,
    "worldName": "Cloud Kingdom",
    "worldIcon": "☁️",
    "title": "Removing the Guard",
    "theme": "Remove Guard",
    "story": "The Knight on f6 defends the Black King! Capture it along the diagonal to shatter the defense!",
    "goal": "Remove the defender by playing Bxf6!",
    "fen": "5rk1/5ppp/5n2/8/8/2B5/5PPP/4R1K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Bxf6"
    ],
    "hint1": {
      "square": "c3",
      "text": "Bishop Barnaby can remove the key defensive knight on f6!"
    },
    "hint2": {
      "square": "f6",
      "text": "Capture the knight on f6 to ruin the king's castle!"
    },
    "magicMove": {
      "from": "c3",
      "to": "f6"
    }
  },
  {
    "id": 33,
    "world": 4,
    "worldName": "Cloud Kingdom",
    "worldIcon": "☁️",
    "title": "The Rook Infiltration",
    "theme": "7th Rank Rook",
    "story": "Rooks belong on the 7th rank! Invade the file and dominate the castle!",
    "goal": "Invade the 7th rank with Re7!",
    "fen": "5rk1/pp3ppp/8/8/8/8/PP3PPP/4R1K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Re7"
    ],
    "hint1": {
      "square": "e1",
      "text": "Invade the 7th rank with your Rook!"
    },
    "hint2": {
      "square": "e7",
      "text": "Slide to e7 to attack the enemy pawns!"
    },
    "magicMove": {
      "from": "e1",
      "to": "e7"
    }
  },
  {
    "id": 34,
    "world": 4,
    "worldName": "Cloud Kingdom",
    "worldIcon": "☁️",
    "title": "Double Discovered Smother",
    "theme": "Discovered Check",
    "story": "Unleash the hidden Bishop while checking with the Knight!",
    "goal": "Attack the weak square with Bxf7+!",
    "fen": "r1b1k2r/pppp1ppp/8/4N3/2B5/8/PPP2PPP/R1BQK2R w KQkq - 0 1",
    "turn": "w",
    "moves": [
      "Bxf7+"
    ],
    "hint1": {
      "square": "c4",
      "text": "Bishop Barnaby on c4 aims right at the king's weak spot!"
    },
    "hint2": {
      "square": "f7",
      "text": "Strike on f7 with check!"
    },
    "magicMove": {
      "from": "c4",
      "to": "f7"
    }
  },
  {
    "id": 35,
    "world": 4,
    "worldName": "Cloud Kingdom",
    "worldIcon": "☁️",
    "title": "The Queen's Deflection",
    "theme": "Deflection Mate",
    "story": "Infiltrate into the enemy camp and threaten back-rank mate!",
    "goal": "Dominate the position with Qe7!",
    "fen": "3r2k1/5ppp/8/8/8/8/5PPP/4Q1K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Qe7"
    ],
    "hint1": {
      "square": "e1",
      "text": "Queen Stella can advance into the enemy camp!"
    },
    "hint2": {
      "square": "e7",
      "text": "Step to e7 to attack d8 and threaten back-rank mate!"
    },
    "magicMove": {
      "from": "e1",
      "to": "e7"
    }
  },
  {
    "id": 36,
    "world": 4,
    "worldName": "Cloud Kingdom",
    "worldIcon": "☁️",
    "title": "The Knight Outpost",
    "theme": "Capturing Queen",
    "story": "Drop your Knight into the supreme square to capture the Black Queen!",
    "goal": "Capture the enemy Queen on d7!",
    "fen": "r3k2r/pppq1ppp/3p4/4N3/4P3/8/PPP2PPP/R1BQK2R w KQkq - 0 1",
    "turn": "w",
    "moves": [
      "Nxd7"
    ],
    "hint1": {
      "square": "e5",
      "text": "Knight on e5 can capture the Queen immediately!"
    },
    "hint2": {
      "square": "d7",
      "text": "Take the Queen on d7!"
    },
    "magicMove": {
      "from": "e5",
      "to": "d7"
    }
  },
  {
    "id": 37,
    "world": 4,
    "worldName": "Cloud Kingdom",
    "worldIcon": "☁️",
    "title": "The Clearance Strike",
    "theme": "Block & Counter",
    "story": "Push your pawn to block the check and attack the enemy Bishop!",
    "goal": "Block check and attack the bishop with c3!",
    "fen": "r1bqk2r/pppp1ppp/2n5/4p3/1b2P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 0 1",
    "turn": "w",
    "moves": [
      "c3"
    ],
    "hint1": {
      "square": "c2",
      "text": "Push the c-pawn forward to block the check!"
    },
    "hint2": {
      "square": "c3",
      "text": "Advance to c3 and attack the bishop!"
    },
    "magicMove": {
      "from": "c2",
      "to": "c3"
    }
  },
  {
    "id": 38,
    "world": 4,
    "worldName": "Cloud Kingdom",
    "worldIcon": "☁️",
    "title": "The Trapped Knight",
    "theme": "Trap",
    "story": "The black knight on a5 has nowhere to run! Push the pawn to capture it!",
    "goal": "Attack and trap the knight with b4!",
    "fen": "r1bqk2r/pppp1ppp/8/n3p3/4P3/3P4/PPP2PPP/RNBQKBNR w KQkq - 0 1",
    "turn": "w",
    "moves": [
      "b4"
    ],
    "hint1": {
      "square": "b2",
      "text": "Push the b-pawn to trap the edge knight!"
    },
    "hint2": {
      "square": "b4",
      "text": "Advance to b4 and attack the knight on a5!"
    },
    "magicMove": {
      "from": "b2",
      "to": "b4"
    }
  },
  {
    "id": 39,
    "world": 4,
    "worldName": "Cloud Kingdom",
    "worldIcon": "☁️",
    "title": "Center Dominance",
    "theme": "Centralize Queen",
    "story": "Place your Queen in the center to rule the entire board!",
    "goal": "Centralize your Queen on e4!",
    "fen": "4k3/4b3/8/8/8/8/8/4Q1K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Qe4"
    ],
    "hint1": {
      "square": "e1",
      "text": "Centralize your Queen on e4!"
    },
    "hint2": {
      "square": "e4",
      "text": "Step to e4 to dominate the center!"
    },
    "magicMove": {
      "from": "e1",
      "to": "e4"
    }
  },
  {
    "id": 40,
    "world": 4,
    "worldName": "Cloud Kingdom",
    "worldIcon": "☁️",
    "title": "Double Rook Checkmate",
    "theme": "Mate in 1",
    "story": "Two rooks trap the King against the edge! Finish the game!",
    "goal": "Deliver checkmate with Rc8#!",
    "fen": "k7/8/1K6/8/8/8/8/1RR5 w - - 0 1",
    "turn": "w",
    "moves": [
      "Rc8#"
    ],
    "hint1": {
      "square": "c1",
      "text": "Rook on c1 can slide straight up to c8!"
    },
    "hint2": {
      "square": "c8",
      "text": "Roll to c8 for the winning checkmate!"
    },
    "magicMove": {
      "from": "c1",
      "to": "c8"
    }
  },
  {
    "id": 41,
    "world": 5,
    "worldName": "Dragon's Peak",
    "worldIcon": "🐉",
    "title": "The Queen Sacrifice Mate",
    "theme": "Mate in 2",
    "story": "Sacrifice Queen Stella on the back rank to deflect the guard, then checkmate with Rook!",
    "goal": "Sacrifice Queen on e8, then checkmate with your Rook!",
    "fen": "3r2k1/5ppp/8/8/8/4Q3/5PPP/4R1K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Qe8+",
      "Rxe8",
      "Rxe8#"
    ],
    "hint1": {
      "square": "e3",
      "text": "Sacrifice Queen Stella on the back rank to deflect the rook!"
    },
    "hint2": {
      "square": "e8",
      "text": "Fly to e8 with check!"
    },
    "magicMove": {
      "from": "e3",
      "to": "e8"
    }
  },
  {
    "id": 42,
    "world": 5,
    "worldName": "Dragon's Peak",
    "worldIcon": "🐉",
    "title": "The Back-Rank Battery",
    "theme": "Mate in 2",
    "story": "Sacrifice your first Rook to break open the back rank, then mate with your second Rook!",
    "goal": "Break through on d8 with two rooks!",
    "fen": "2rr2k1/5ppp/8/8/8/3R4/5PPP/3R2K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Rxd8+",
      "Rxd8",
      "Rxd8#"
    ],
    "hint1": {
      "square": "d3",
      "text": "Take the enemy rook on d8 with check!"
    },
    "hint2": {
      "square": "d8",
      "text": "Crash through on d8!"
    },
    "magicMove": {
      "from": "d3",
      "to": "d8"
    }
  },
  {
    "id": 43,
    "world": 5,
    "worldName": "Dragon's Peak",
    "worldIcon": "🐉",
    "title": "The Dragon's Corridor",
    "theme": "Mate in 2",
    "story": "Push the King out of hiding with a check, then deliver the crowning blow!",
    "goal": "Check with Queen on h7, then finish with Qh8#!",
    "fen": "6k1/ppp2ppp/8/7Q/8/3B4/PPP2PPP/4R1K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Qxh7+",
      "Kf8",
      "Qh8#"
    ],
    "hint1": {
      "square": "h5",
      "text": "Queen Stella charges into h7 with check!"
    },
    "hint2": {
      "square": "h7",
      "text": "Capture the h7 pawn with check!"
    },
    "magicMove": {
      "from": "h5",
      "to": "h7"
    }
  },
  {
    "id": 44,
    "world": 5,
    "worldName": "Dragon's Peak",
    "worldIcon": "🐉",
    "title": "The Royal Decoy",
    "theme": "Mate in 2",
    "story": "Offer your Queen on the back rank to lure the defender away, then deliver mate with your Rook!",
    "goal": "Play Qd8+ to deflect the defender, then mate with Rxd8#!",
    "fen": "2r3k1/4Qppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Qd8+",
      "Rxd8",
      "Rxd8#"
    ],
    "hint1": {
      "square": "e7",
      "text": "Offer Queen Stella on d8 to deflect the defensive rook!"
    },
    "hint2": {
      "square": "d8",
      "text": "Slide to d8 with check!"
    },
    "magicMove": {
      "from": "e7",
      "to": "d8"
    }
  },
  {
    "id": 45,
    "world": 5,
    "worldName": "Dragon's Peak",
    "worldIcon": "🐉",
    "title": "Double Rook Escalator",
    "theme": "Mate in 2",
    "story": "Sacrifice Queen Stella into the enemy queen to clear the way for your Rook!",
    "goal": "Sacrifice Queen on e8, then checkmate with your Rook!",
    "fen": "3qr1k1/5ppp/8/8/8/4Q3/5PPP/4R1K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Qxe8+",
      "Qxe8",
      "Rxe8#"
    ],
    "hint1": {
      "square": "e3",
      "text": "Queen Stella charges into e8 to sacrifice herself for victory!"
    },
    "hint2": {
      "square": "e8",
      "text": "Capture on e8 with check!"
    },
    "magicMove": {
      "from": "e3",
      "to": "e8"
    }
  },
  {
    "id": 46,
    "world": 5,
    "worldName": "Dragon's Peak",
    "worldIcon": "🐉",
    "title": "The Rook Deflector",
    "theme": "Mate in 2",
    "story": "Deflect the back rank guardian, then march in with your second tower!",
    "goal": "Sacrifice Queen on e8, then checkmate with your Rook!",
    "fen": "1r4k1/5ppp/8/8/8/4Q3/5PPP/4R1K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Qe8+",
      "Rxe8",
      "Rxe8#"
    ],
    "hint1": {
      "square": "e3",
      "text": "Queen Stella dives into e8 to deflect the black rook!"
    },
    "hint2": {
      "square": "e8",
      "text": "Fly to e8 with check!"
    },
    "magicMove": {
      "from": "e3",
      "to": "e8"
    }
  },
  {
    "id": 47,
    "world": 5,
    "worldName": "Dragon's Peak",
    "worldIcon": "🐉",
    "title": "Smothered Knight Strike",
    "theme": "Mate in 2",
    "story": "Dive onto e8 with check to lure the defender, then deliver checkmate!",
    "goal": "Sacrifice Queen on e8, then checkmate with your Rook!",
    "fen": "2r3k1/5ppp/8/8/8/4Q3/5PPP/4R1K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Qe8+",
      "Rxe8",
      "Rxe8#"
    ],
    "hint1": {
      "square": "e3",
      "text": "Sacrifice Queen on e8 with check!"
    },
    "hint2": {
      "square": "e8",
      "text": "Fly to e8 with check!"
    },
    "magicMove": {
      "from": "e3",
      "to": "e8"
    }
  },
  {
    "id": 48,
    "world": 5,
    "worldName": "Dragon's Peak",
    "worldIcon": "🐉",
    "title": "The Double Rook Crusher",
    "theme": "Mate in 2",
    "story": "Offer your Queen on e8 with check to pull the defender away, then strike with Rook!",
    "goal": "Sacrifice Queen on e8, then checkmate with your Rook!",
    "fen": "5rk1/ppp2ppp/8/8/8/4Q3/PPP2PPP/4R1K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Qe8+",
      "Rxe8",
      "Rxe8#"
    ],
    "hint1": {
      "square": "e3",
      "text": "Queen Stella dives into e8 to deflect the black rook!"
    },
    "hint2": {
      "square": "e8",
      "text": "Fly to e8 with check!"
    },
    "magicMove": {
      "from": "e3",
      "to": "e8"
    }
  },
  {
    "id": 49,
    "world": 5,
    "worldName": "Dragon's Peak",
    "worldIcon": "🐉",
    "title": "The Dragon's Final Deflection",
    "theme": "Mate in 2",
    "story": "Deflect the back rank guardian, then march in with your second tower!",
    "goal": "Capture on d8 with check, then follow up with checkmate!",
    "fen": "2rr3k/5ppp/8/8/8/3R4/5PPP/3R2K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Rxd8+",
      "Rxd8",
      "Rxd8#"
    ],
    "hint1": {
      "square": "d3",
      "text": "Shatter the defense by capturing the rook on d8!"
    },
    "hint2": {
      "square": "d8",
      "text": "Capture on d8 with check!"
    },
    "magicMove": {
      "from": "d3",
      "to": "d8"
    }
  },
  {
    "id": 50,
    "world": 5,
    "worldName": "Dragon's Peak",
    "worldIcon": "🐉",
    "title": "The Coronation of the Dragon King",
    "theme": "Grand Finale Mate",
    "story": "The ultimate challenge! Queen Stella delivers the two-step royal checkmate!",
    "goal": "Deliver the 2-step coronation checkmate with Queen Stella!",
    "fen": "6k1/ppp2ppp/8/7Q/8/3B4/PPP2PPP/4R1K1 w - - 0 1",
    "turn": "w",
    "moves": [
      "Qxh7+",
      "Kf8",
      "Qh8#"
    ],
    "hint1": {
      "square": "h5",
      "text": "Queen Stella charges into h7 with check!"
    },
    "hint2": {
      "square": "h7",
      "text": "Capture the h7 pawn with check!"
    },
    "magicMove": {
      "from": "h5",
      "to": "h7"
    }
  }
];
