# 🏰 Chess Quest: Castle Puzzles for Kids

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: Web](https://img.shields.io/badge/Platform-Web%20%2F%20Mobile-blue.svg)](https://pages.github.com/)
[![Built for: GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-success.svg)](https://pages.github.com/)

An engaging, playful, and mobile-first educational chess puzzle game crafted specifically for children. Built using modern HTML5, CSS3, and JavaScript (ES Modules), with zero build-step overhead, ready to deploy instantly to **GitHub Pages**!

---

## 🌟 Key Features

### 1. 🐉 Sir Sparky the Puzzle Dragon (Character Companion)
- An animated vector mascot with expressive mood reactions (`idle`, `thinking`, `cheering`, `oops`, `hint`).
- Provides gentle, voiced-feeling conversational coaching tips and storyline setups for every puzzle.
- Celebrates victories with dancing animations and confetti showers!

### 2. 🗺️ 50 Progressive Levels Across 5 Magical Worlds
Puzzles are sequentially structured with an interactive map so children feel a rewarding sense of exploration:
- **🌱 World 1: Sunny Meadow (Levels 1–10)**: Mate-in-1 fundamentals, Scholar's mate patterns, lawnmower double rooks, Fool's mate counter, and pawn coronation.
- **🍎 World 2: Knight's Orchard (Levels 11–20)**: The magic of the knight, royal forks, double pawn punches, and free piece captures.
- **🏰 World 3: Coral Castle (Levels 21–30)**: Absolute pins, skewers, battery blasts, and diagonal lasers.
- **☁️ World 4: Cloud Kingdom (Levels 31–40)**: Discovered attacks, double checks, removing the guard, and 7th rank invasions.
- **🐉 World 5: Dragon's Peak (Levels 41–50)**: Grandmaster kid combinations, deflection sacrifices, and multi-move checkmates!

### 3. 🪄 3-Tier Progressive "Playful Coaching" Hint System
Children are never penalized or stuck:
- **Tier 1 (💡 Nudge)**: Highlights the specific superhero piece to move with a soft golden pulsating aura.
- **Tier 2 (🎯 Target)**: Highlights the exact destination square with a sparkling target ring.
- **Tier 3 (🪄 Magic Wand)**: Smoothly animates a glowing ghost piece showing the correct move, then lets the child mirror it!

### 4. 🧸 Non-Punitive & Gentle Feedback
- When an incorrect move is attempted, the board plays a gentle cartoon wobble sound and smoothly rewinds the piece to its original square.
- **NO red X's, NO harsh buzzer sounds.** Sparky gently suggests: *"Almost! Can you spot a move that traps the King?"*

### 5. 🎯 "Hot & Cold" Touch Decision Guides
- Tapping any piece displays friendly green pulsing dots on valid quiet squares and amber glowing rings on capture squares.
- Supports both **Drag & Drop** (with touch scroll prevention) and **Tap-to-Select / Tap-to-Move** for small fingers on tablets and phones.

### 6. 🔊 100% Procedural Web Audio Engine
- Synthesizes crisp wooden piece moves, bubbly pops for captures, musical harp checks, cartoon oops boings, and triumphant fanfare chords without external audio loading delays.
- Includes a one-tap mute/unmute toggle.

### 7. 🎨 Colorful Themes & Visual Customization
- **🍬 Candy Kingdom** (Pastel purples, sunny creams, soft pinks)
- **🌲 Forest Realm** (Mint greens, emeralds, warm ivory)
- **👑 Royal Castle** (Classic blue, sparkling gold, crisp white)
- **🚀 Cosmic Quest** (Deep space indigo, glowing neon cyan)

### 8. 🎯 Intelligent Adaptive Engine & Player Strength Allotment
- Dynamically calculates the player's tactical Elo rating (starting at 800 Elo) and rank title (e.g. *Pawn Scout*, *Knight Ranger*, *Bishop Marksman*, *Castle Guardian*, *Queen's Champion*, *Dragon Master*).
- Solves grant rating gains (`+20` for 0 hints, `+12` for 1 hint, `+6` for 2 hints), while retries gently deduct `8` Elo.
- The engine intelligently analyzes player strengths and weaknesses to allot the optimal next puzzle matching the player's real skill level.

### 9. ♾️ Lichess Endless Mode & Live API Integration
- Connects directly to Lichess.org public APIs (`https://lichess.org/api/puzzle/daily`) and provides an endless stream of rated tactical puzzles.
- Every Lichess puzzle is automatically adapted into the kid-friendly format with dynamic 3-tier hints.
- Includes a robust offline/local bank of real Lichess puzzles across ratings 600–1600+ with zero latency.

### 10. 📊 Player Performance & Learning Curve (`player.html`)
- **Interactive SVG Learning Curve**: Visualizes rating progression over time as children solve tactical puzzles.
- **Top Strengths**: Highlights tactical patterns where the child excels (e.g. *Mate in 1: 100%*, *Back-Rank Mate: 85%*).
- **Improvement Areas & Weaknesses**: Identifies tactics needing reinforcement with direct **"🎯 Practice This Weakness"** buttons that immediately queue targeted exercises!

### 11. ⚙️ Admin Portal & Puzzle Manager (`admin.html`)
- **Download Templates**: Download verified sample templates in `.csv` and `.json` formats.
- **Custom Puzzle Upload with 3 Dropdowns**:
  1. *Dropdown 1 (Access Tier)*: `1-Week Free Trial`, `Monthly Subscription`, `Yearly Subscription`.
  2. *Dropdown 2 (Tactical Theme)*: `Checkmate`, `Knight Fork`, `Pin`, `Skewer`, `Back-Rank`, `Hanging Piece`, `Endgame`.
  3. *Dropdown 3 (Difficulty & Rating)*: `600–800`, `801–1100`, `1101–1400`, `1401–1800+`.
- **Built-in Chess Engine Validation**: Uses `chess.js` to verify all FEN positions and legal moves before importing.
- **Subscription Tier Simulator**: Allows coaches and parents to simulate and test different subscription tiers (`Free Trial`, `Monthly`, `Yearly`).

### 12. 💾 Persistent Player Progress
- Automatically saves unlocked levels, stars earned (1–3 stars based on hints used), rating history, custom uploaded puzzles, and theme choices to browser `localStorage`.


---

## 🚀 Instant Deployment to GitHub Pages

This project is engineered to work directly out of the box with **zero build step**, zero package compilation, and 100% relative paths.

### Step-by-Step Setup:
1. **Create a new repository** on GitHub (e.g., `chess-puzzles-kids`).
2. **Push the project files** to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Chess Quest"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
3. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Click **Settings** (gear icon) ➔ **Pages** (in the left sidebar).
   - Under **Build and deployment** ➔ **Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and folder `/ (root)`.
   - Click **Save**.
4. **Play!**
   - In 1–2 minutes, GitHub Pages will deploy your game at:
     ```
     https://<your-username>.github.io/<your-repo-name>/
     ```

---

## 💻 Local Development & Testing

Since the application uses standard native ES Modules (`type="module"`), run it through any simple static server:

### Option A: Using Python (Built-in)
```bash
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Option B: Using Node (npx)
```bash
npx serve .
```

### Option C: Using VS Code Live Server
Right-click `index.html` and click **"Open with Live Server"**.

---

## 📁 Project Architecture

```
chess-puzzles/
├── index.html            # Main semantic HTML5 markup & responsive modals
├── README.md             # Documentation and GitHub Pages instructions
├── package.json          # Project metadata and test scripts
│
├── css/
│   ├── style.css         # Theme palettes, typography, responsive flex/grid layouts
│   ├── board.css         # Chessboard grid, SVG piece styles, hot & cold dots, hints
│   └── mascot.css        # Sir Sparky dragon animations, moods, and speech bubble
│
└── js/
    ├── app.js            # Main controller: level manager, storage, modals, game loop
    ├── board.js          # Touch & drag SVG chessboard with dual-input mechanics
    ├── chess.js          # Standalone, vendored chess engine (Peggy/chess.js ESM)
    ├── puzzles.js        # Curated database of 50 child-friendly verified puzzles
    ├── mascot.js         # Interactive animated vector mascot companion
    ├── audio.js          # Web Audio API synthesizer for all game sound effects
    └── confetti.js       # Celebratory canvas particles, stars, and ribbons
```

---

## 🧩 Educational Puzzle Breakdown

| World | Levels | Pedagogical Focus |
|---|---|---|
| **🌱 Sunny Meadow** | 1 – 10 | Mate in 1 Fundamentals (Queen hugs, Rook back-rank, Knight smothered mate, Lawnmower mate, Promotion) |
| **🍎 Knight's Orchard**| 11 – 20 | Forks & Double Attacks (Royal fork, Queen fork, Pawn fork, Skewers, Capturing hanging pieces) |
| **🏰 Coral Castle** | 21 – 30 | Absolute Pins, Traps & Diagonals (Trapping edge pieces, Queen battery on open lines, Bishop laser mates) |
| **☁️ Cloud Kingdom** | 31 – 40 | Discovered Attacks & Sieges (Discovered checks, double checks, removing the defender, 7th rank rooks) |
| **🐉 Dragon's Peak** | 41 – 50 | Multi-Move Combinations (Queen sacrifice mates, double rook escalators, deflection combos) |

---

## 📜 License
Distributed under the MIT License. Built with love for young chess champions! 🌟
