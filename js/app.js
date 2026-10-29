// Chess Quest: Main Application Controller
// Orchestrates adaptive progression, Lichess endless mode, hint tiers, local storage, UI dialogs, and game loop

import { Chess } from './chess.js';
import { WORLDS, getAllPuzzles } from './puzzles.js';
import { sound } from './audio.js';
import { confetti } from './confetti.js';
import { MascotCompanion } from './mascot.js';
import { KidChessBoard } from './board.js';
import { adaptiveEngine } from './adaptive-engine.js';
import { subscriptionService, TIERS } from './subscription-service.js';
import { lichessService } from './lichess-service.js';

class ChessQuestApp {
  constructor() {
    this.puzzles = getAllPuzzles();
    this.worlds = WORLDS;

    this.currentLevelIndex = 0;
    this.activePuzzle = null;
    this.unlockedLevel = 1;
    this.levelStars = {};
    this.currentHintsUsed = new Set();
    this.currentMoveIndex = 0;
    this.activeTheme = 'candy';
    this.isEndlessMode = false;

    // Helper dots: disabled by default; offered after 3s inactivity
    this.helperDotsActive = false;
    this.inactivityTimer = null;
    this.inactivityPromptAnswered = false;

    this.chess = new Chess();
    this.board = null;
    this.mascot = null;

    this.initStorage();
    this.initMascotAndBoard();
    this.bindUIEvents();
    this.applyTheme(this.activeTheme);
    this.updateHeaderRating();

    // Check if player came from Player Stats with a focus theme to practice
    const focusTheme = localStorage.getItem('chess_quest_focus_theme');
    if (focusTheme) {
      localStorage.removeItem('chess_quest_focus_theme');
      const focusPuzzle = adaptiveEngine.selectNextPuzzle(this.puzzles, { focusTheme });
      if (focusPuzzle) {
        this.loadPuzzleDirect(focusPuzzle);
        return;
      }
    }

    this.loadLevel(this.currentLevelIndex);
  }

  initStorage() {
    // Unlocked level
    const savedUnlocked = localStorage.getItem('chess_quest_unlocked_level');
    this.unlockedLevel = savedUnlocked ? parseInt(savedUnlocked, 10) : 1;

    // Stars
    const savedStars = localStorage.getItem('chess_quest_stars');
    this.levelStars = savedStars ? JSON.parse(savedStars) : {};

    // Theme
    const savedTheme = localStorage.getItem('chess_quest_theme');
    if (savedTheme) this.activeTheme = savedTheme;

    // Last played level
    const lastPlayed = localStorage.getItem('chess_quest_current_level');
    if (lastPlayed) {
      const idx = parseInt(lastPlayed, 10);
      if (idx >= 0 && idx < this.puzzles.length && idx < this.unlockedLevel) {
        this.currentLevelIndex = idx;
      }
    }
  }

  saveProgress() {
    localStorage.setItem('chess_quest_unlocked_level', this.unlockedLevel);
    localStorage.setItem('chess_quest_stars', JSON.stringify(this.levelStars));
    localStorage.setItem('chess_quest_current_level', this.currentLevelIndex);
  }

  initMascotAndBoard() {
    this.mascot = new MascotCompanion('mascot-mount');

    this.board = new KidChessBoard('chessboard-mount', {
      chess: this.chess,
      orientation: 'w',
      showDots: this.helperDotsActive,
      onMove: (moveObj) => this.handlePlayerMove(moveObj),
      onSelectSquare: (sq) => this.handleSquareSelected(sq)
    });
  }

  getCurrentPuzzle() {
    if (this.activePuzzle) return this.activePuzzle;
    return this.puzzles[this.currentLevelIndex] || this.puzzles[0];
  }

  loadLevel(index) {
    if (index < 0 || index >= this.puzzles.length) return;
    const puzzle = this.puzzles[index];
    this.loadPuzzleDirect(puzzle, index);
  }

  loadPuzzleDirect(puzzle, index = null) {
    // Subscription access check
    if (!subscriptionService.isPuzzleAccessible(puzzle)) {
      this.showSubscriptionLockModal(puzzle);
      return;
    }

    this.activePuzzle = puzzle;
    if (index !== null) {
      this.currentLevelIndex = index;
    } else {
      const foundIdx = this.puzzles.findIndex(p => p.id === puzzle.id);
      if (foundIdx !== -1) this.currentLevelIndex = foundIdx;
    }

    // Reset chess engine
    this.chess.load(puzzle.fen);
    this.currentMoveIndex = 0;
    this.currentHintsUsed.clear();

    // Set board orientation: 'w' for white, 'b' for black
    this.board.setOrientation(puzzle.turn);
    this.board.clearHints();

    // Reset helper dots: OFF by default
    this.helperDotsActive = false;
    this.inactivityPromptAnswered = false;
    this.board.setShowDots(false);
    this.updateDotsButtonState();
    this.hideHelperDotsPrompt();
    this.board.render();

    // Record attempt in adaptive engine
    adaptiveEngine.recordAttempt(puzzle);

    // Update Header / UI Info
    this.updateLevelInfo(puzzle);
    this.updateHintButtons();
    this.updateTotalStarsBadge();
    this.updateHeaderRating();

    // Mascot welcomes player with storyline
    this.mascot.say(`${puzzle.title}: ${puzzle.story}`, 'thinking', 6000);

    // Save current level index and start 3-second inactivity timer
    this.saveProgress();
    this.startInactivityTimer();
  }

  async loadNextIntelligentPuzzle() {
    if (this.isEndlessMode) {
      const endlessPuzzle = await lichessService.getNextEndlessPuzzle(adaptiveEngine.getRating());
      if (endlessPuzzle) {
        this.loadPuzzleDirect(endlessPuzzle);
        return;
      }
    }

    // Adaptive Mode: Pick next puzzle based on player strength!
    const nextPuzzle = adaptiveEngine.selectNextPuzzle(this.puzzles);
    if (nextPuzzle) {
      this.loadPuzzleDirect(nextPuzzle);
    } else {
      // Fallback to sequential next
      this.loadLevel((this.currentLevelIndex + 1) % this.puzzles.length);
    }
  }

  showSubscriptionLockModal(puzzle) {
    const modal = document.getElementById('subscription-lock-modal');
    if (!modal) return;

    const titleEl = document.getElementById('lock-modal-title');
    const descEl = document.getElementById('lock-modal-desc');

    const tierInfo = subscriptionService.getTierInfo(puzzle.tier);
    if (titleEl) {
      titleEl.textContent = `🏰 ${tierInfo.name} Required`;
    }
    if (descEl) {
      descEl.innerHTML = `"${puzzle.title}" is part of the <strong>${tierInfo.name}</strong> (${puzzle.rating || 900} Elo).<br>You can switch or simulate subscription tiers in the <strong>Admin Portal</strong>!`;
    }

    this.openModal('subscription-lock-modal');
  }

  updateLevelInfo(puzzle) {
    const levelNumberEl = document.getElementById('level-number-text');
    const levelTitleEl = document.getElementById('level-title-text');
    const levelGoalEl = document.getElementById('level-goal-text');
    const worldBadgeEl = document.getElementById('world-badge-btn');
    const starsEarnedEl = document.getElementById('level-stars-display');
    const modeBadgeEl = document.getElementById('level-mode-badge');
    const tierBadgeEl = document.getElementById('level-tier-badge');

    if (levelNumberEl) {
      levelNumberEl.textContent = puzzle.lichessId ? `Lichess #${puzzle.lichessId}` : `Level ${puzzle.id}`;
    }
    if (levelTitleEl) levelTitleEl.textContent = puzzle.title;
    if (levelGoalEl) {
      const turnName = puzzle.turn === 'w' ? 'White' : 'Black';
      levelGoalEl.innerHTML = `<span class="turn-dot turn-${puzzle.turn}"></span> ${turnName} to Play — ${puzzle.goal} (${puzzle.rating || 800} Elo)`;
    }

    if (modeBadgeEl) {
      modeBadgeEl.textContent = this.isEndlessMode ? '♾️ Lichess Endless' : '🎯 Adaptive';
      modeBadgeEl.style.background = this.isEndlessMode ? '#9C27B0' : '#0288D1';
    }

    if (tierBadgeEl) {
      if (puzzle.tier === 'yearly') {
        tierBadgeEl.textContent = '👑 Yearly';
        tierBadgeEl.style.background = '#FF9800';
      } else if (puzzle.tier === 'monthly') {
        tierBadgeEl.textContent = '🥈 Monthly';
        tierBadgeEl.style.background = '#2196F3';
      } else {
        tierBadgeEl.textContent = '🌱 Free';
        tierBadgeEl.style.background = '#4CAF50';
      }
    }

    if (worldBadgeEl) {
      worldBadgeEl.innerHTML = `${puzzle.worldIcon || '🏰'} ${puzzle.worldName || 'Tactics'}`;
    }

    if (starsEarnedEl) {
      const stars = this.levelStars[puzzle.id] || 0;
      let starsHtml = '';
      for (let i = 1; i <= 3; i++) {
        starsHtml += `<span class="star-icon ${i <= stars ? 'star-filled' : 'star-empty'}">⭐</span>`;
      }
      starsEarnedEl.innerHTML = starsHtml;
    }
  }

  updateTotalStarsBadge() {
    const badge = document.getElementById('total-stars-count');
    if (badge) {
      let total = 0;
      Object.values(this.levelStars).forEach(s => total += s);
      badge.textContent = `${total} ⭐`;
    }
  }

  updateHeaderRating() {
    const ratingEl = document.getElementById('header-rating-text');
    if (ratingEl) {
      const r = adaptiveEngine.getRating();
      const rank = adaptiveEngine.getRank();
      ratingEl.textContent = `${rank.icon} ${r} ⭐`;
      const badge = document.getElementById('player-rating-badge');
      if (badge) {
        badge.title = `Rating: ${r} • Rank: ${rank.title} (Click 📊 Player Stats to view curve)`;
      }
    }
  }

  updateHintButtons() {
    const btnNudge = document.getElementById('btn-hint-nudge');
    const btnTarget = document.getElementById('btn-hint-target');
    const btnWand = document.getElementById('btn-hint-wand');

    if (btnNudge) {
      btnNudge.classList.toggle('hint-used', this.currentHintsUsed.has(1));
    }
    if (btnTarget) {
      btnTarget.classList.toggle('hint-used', this.currentHintsUsed.has(2));
    }
    if (btnWand) {
      btnWand.classList.toggle('hint-used', this.currentHintsUsed.has(3));
    }
  }

  // 3-Second Inactivity & Helper Dots Logic
  startInactivityTimer() {
    this.clearInactivityTimer();
    if (this.helperDotsActive || this.inactivityPromptAnswered) return;

    this.inactivityTimer = setTimeout(() => {
      if (!this.helperDotsActive && !this.inactivityPromptAnswered) {
        this.showHelperDotsPrompt();
      }
    }, 3000);
  }

  clearInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  handleSquareSelected(squareKey) {
    if (!this.helperDotsActive && !this.inactivityPromptAnswered) {
      this.startInactivityTimer();
    }
  }

  showHelperDotsPrompt() {
    const promptEl = document.getElementById('helper-dots-prompt');
    if (promptEl) {
      promptEl.style.display = 'block';
      const card = promptEl.querySelector('.helper-toast-card');
      if (card) {
        card.classList.remove('toast-pop-out');
      }
    }
    this.mascot.say("Need a little help? Want me to show the green helper dots? 🟢", 'thinking', 8000);

    if (this.toastAutoDismissTimer) clearTimeout(this.toastAutoDismissTimer);
    this.toastAutoDismissTimer = setTimeout(() => {
      this.hideHelperDotsPrompt();
    }, 9000);
  }

  hideHelperDotsPrompt() {
    if (this.toastAutoDismissTimer) {
      clearTimeout(this.toastAutoDismissTimer);
      this.toastAutoDismissTimer = null;
    }
    const promptEl = document.getElementById('helper-dots-prompt');
    if (promptEl && promptEl.style.display !== 'none') {
      const card = promptEl.querySelector('.helper-toast-card');
      if (card) {
        card.classList.add('toast-pop-out');
        setTimeout(() => {
          promptEl.style.display = 'none';
          card.classList.remove('toast-pop-out');
        }, 280);
      } else {
        promptEl.style.display = 'none';
      }
    }
  }

  enableHelperDots() {
    this.helperDotsActive = true;
    this.inactivityPromptAnswered = true;
    this.clearInactivityTimer();
    this.board.setShowDots(true);
    this.updateDotsButtonState();
    this.hideHelperDotsPrompt();
    sound.playHint();
    this.mascot.say("Helper dots turned ON! Look for the green circles! 🟢✨", 'hint', 4000);
  }

  dismissHelperDots() {
    this.helperDotsActive = false;
    this.inactivityPromptAnswered = true;
    this.clearInactivityTimer();
    this.board.setShowDots(false);
    this.updateDotsButtonState();
    this.hideHelperDotsPrompt();
    sound.playPop();
    this.mascot.say("You can do it, young tactician! Take your time! 💪", 'idle', 3500);
  }

  toggleHelperDotsManual() {
    if (this.helperDotsActive) {
      this.dismissHelperDots();
    } else {
      this.enableHelperDots();
    }
  }

  updateDotsButtonState() {
    const btn = document.getElementById('btn-toggle-dots');
    if (btn) {
      btn.textContent = this.helperDotsActive ? '🟢' : '⚪';
      btn.title = this.helperDotsActive ? 'Helper Dots: ON (Click to hide)' : 'Helper Dots: OFF (Click to show)';
    }
  }

  handlePlayerMove(moveObj) {
    this.clearInactivityTimer();
    this.hideHelperDotsPrompt();

    const puzzle = this.getCurrentPuzzle();
    const solutionMoves = puzzle.moves;

    // Check legality first
    let moveRes = null;
    try {
      moveRes = this.chess.move(moveObj);
    } catch (e) {
      return;
    }

    if (!moveRes) return; // Illegal chess move

    // Check if player's move matches expected solution move
    const expectedMoveSan = solutionMoves[this.currentMoveIndex];
    const isExpectedSolution = this.checkIfMoveMatchesSolution(moveRes, expectedMoveSan);

    if (isExpectedSolution) {
      // CORRECT MOVE!
      this.board.clearHints();
      this.board.render();

      if (moveRes.captured) {
        sound.playCapture();
      } else if (this.chess.inCheck()) {
        sound.playCheck();
      } else {
        sound.playMove();
      }

      this.currentMoveIndex++;

      // Check if more moves in sequence (computer reply)
      if (this.currentMoveIndex < solutionMoves.length) {
        this.board.gridEl.style.pointerEvents = 'none';
        this.mascot.say("Great move! Watch the opponent's reply...", 'thinking', 2000);

        setTimeout(() => {
          const compMoveSan = solutionMoves[this.currentMoveIndex];
          const compMoveRes = this.chess.move(compMoveSan);
          this.currentMoveIndex++;

          if (compMoveRes.captured) {
            sound.playCapture();
          } else {
            sound.playMove();
          }

          this.board.render();
          this.board.gridEl.style.pointerEvents = 'auto';
          this.mascot.say("Now deliver the final winning blow!", 'hint', 4000);
          this.startInactivityTimer();
        }, 650);
      } else {
        // PUZZLE FULLY SOLVED!
        this.handlePuzzleComplete();
      }
    } else {
      // INCORRECT MOVE
      adaptiveEngine.recordFailure(puzzle);
      this.updateHeaderRating();

      sound.playOops();
      this.board.playOopsAnimation(moveObj.from, moveObj.to);
      this.mascot.sayOops();

      setTimeout(() => {
        this.chess.undo();
        this.board.render();
        this.startInactivityTimer();
      }, 500);
    }
  }

  checkIfMoveMatchesSolution(actualMove, expectedSan) {
    if (!expectedSan) return false;
    const cleanActual = actualMove.san.replace(/[+#]/g, '');
    const cleanExpected = expectedSan.replace(/[+#]/g, '');

    if (cleanActual === cleanExpected) return true;

    if (this.currentMoveIndex === 0) {
      const puzzle = this.getCurrentPuzzle();
      if (puzzle.magicMove) {
        return actualMove.from === puzzle.magicMove.from && actualMove.to === puzzle.magicMove.to;
      }
    }
    return false;
  }

  handlePuzzleComplete() {
    const puzzle = this.getCurrentPuzzle();
    sound.playVictory();
    confetti.burst(100);

    const hintsCount = this.currentHintsUsed.size;
    let starsEarned = 3;
    if (hintsCount === 1) starsEarned = 2;
    else if (hintsCount >= 2) starsEarned = 1;

    // Save stars
    const previousStars = this.levelStars[puzzle.id] || 0;
    if (starsEarned > previousStars) {
      this.levelStars[puzzle.id] = starsEarned;
    }

    if (puzzle.id === this.unlockedLevel && this.unlockedLevel < this.puzzles.length) {
      this.unlockedLevel++;
    }

    this.saveProgress();
    this.updateTotalStarsBadge();

    // Record in adaptive engine
    const ratingResult = adaptiveEngine.recordSolve(puzzle, hintsCount);
    this.updateHeaderRating();

    this.mascot.sayVictory(starsEarned);

    setTimeout(() => {
      this.showVictoryModal(puzzle, starsEarned, ratingResult);
    }, 700);
  }

  showVictoryModal(puzzle, starsEarned, ratingResult) {
    const modal = document.getElementById('victory-modal');
    if (!modal) return;

    const starsContainer = document.getElementById('victory-stars-box');
    const titleEl = document.getElementById('victory-title');
    const msgEl = document.getElementById('victory-message');
    const nextBtn = document.getElementById('btn-next-level');

    if (titleEl) {
      titleEl.textContent = starsEarned === 3 ? '🌟 Master Tactician!' : '🎉 Puzzle Solved!';
    }
    if (msgEl) {
      msgEl.textContent = `You completed "${puzzle.title}" with flying colors!`;
    }

    const ratingGainEl = document.getElementById('victory-rating-gain-box');
    const newRatingEl = document.getElementById('victory-new-rating');
    const rankNameEl = document.getElementById('victory-rank-name');

    if (ratingResult && ratingGainEl) {
      ratingGainEl.style.display = 'inline-flex';
      if (newRatingEl) newRatingEl.textContent = ratingResult.newRating;
      if (rankNameEl) rankNameEl.textContent = ratingResult.currentRank.title;
    }

    if (starsContainer) {
      starsContainer.innerHTML = `
        <span class="victory-star star-1 ${starsEarned >= 1 ? 'animate-star' : 'star-dim'}">⭐</span>
        <span class="victory-star star-2 ${starsEarned >= 2 ? 'animate-star' : 'star-dim'}">⭐</span>
        <span class="victory-star star-3 ${starsEarned >= 3 ? 'animate-star' : 'star-dim'}">⭐</span>
      `;
    }

    if (nextBtn) {
      nextBtn.textContent = 'Next Puzzle ➔';
      nextBtn.onclick = () => {
        this.closeModal('victory-modal');
        this.loadNextIntelligentPuzzle();
      };
    }

    const replayBtn = document.getElementById('btn-replay-level');
    if (replayBtn) {
      replayBtn.onclick = () => {
        this.closeModal('victory-modal');
        this.loadPuzzleDirect(puzzle);
      };
    }

    this.openModal('victory-modal');
  }

  // Progressive Hint Triggers
  triggerHint1Nudge() {
    const puzzle = this.getCurrentPuzzle();
    if (!puzzle.hint1) return;

    sound.playHint();
    this.currentHintsUsed.add(1);
    this.board.showHintNudge(puzzle.hint1.square);
    this.mascot.sayNudge(puzzle.hint1.text);
    this.updateHintButtons();
  }

  triggerHint2Target() {
    const puzzle = this.getCurrentPuzzle();
    if (!puzzle.hint2) return;

    sound.playHint();
    this.currentHintsUsed.add(2);
    this.board.showHintTarget(puzzle.hint2.square);
    this.mascot.sayTarget(puzzle.hint2.text);
    this.updateHintButtons();
  }

  triggerHint3MagicWand() {
    const puzzle = this.getCurrentPuzzle();
    if (!puzzle.magicMove) return;

    sound.playHint();
    this.currentHintsUsed.add(3);
    this.mascot.sayMagicWand();
    this.updateHintButtons();

    this.board.animateMagicWand(puzzle.magicMove.from, puzzle.magicMove.to, () => {
      this.board.showHintNudge(puzzle.magicMove.from);
      this.board.showHintTarget(puzzle.magicMove.to);
    });
  }

  toggleMode() {
    this.isEndlessMode = !this.isEndlessMode;
    const modeBtn = document.getElementById('btn-mode-toggle');
    if (modeBtn) {
      modeBtn.textContent = this.isEndlessMode ? '♾️' : '🎯';
      modeBtn.title = this.isEndlessMode
        ? 'Mode: Lichess Endless (Click for Adaptive Story)'
        : 'Mode: Adaptive Elo (Click for Lichess Endless)';
    }

    const modeBadge = document.getElementById('level-mode-badge');
    if (modeBadge) {
      modeBadge.textContent = this.isEndlessMode ? '♾️ Lichess Endless' : '🎯 Adaptive';
      modeBadge.style.background = this.isEndlessMode ? '#9C27B0' : '#0288D1';
    }

    sound.playPop();
    if (this.isEndlessMode) {
      this.mascot.say("Lichess Endless Mode activated! Streaming infinite tactical puzzles! ♾️✨", 'cheer', 5000);
      this.loadNextIntelligentPuzzle();
    } else {
      this.mascot.say("Adaptive Adventure Mode activated! Intelligently matching your tactical strength! 🎯🛡️", 'cheer', 5000);
      this.loadNextIntelligentPuzzle();
    }
  }

  // Modals & UI Controls
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  openLevelSelectModal() {
    const modal = document.getElementById('level-select-modal');
    if (!modal) return;
    this.renderLevelSelectGrid(1);
    this.openModal('level-select-modal');
  }

  renderLevelSelectGrid(worldId) {
    const tabsContainer = document.getElementById('world-tabs-container');
    const gridContainer = document.getElementById('level-grid-container');

    if (tabsContainer) {
      tabsContainer.innerHTML = '';
      this.worlds.forEach(w => {
        const btn = document.createElement('button');
        btn.className = `world-tab-btn ${w.id === worldId ? 'active' : ''}`;
        btn.textContent = `${w.icon} ${w.name}`;
        btn.onclick = () => this.renderLevelSelectGrid(w.id);
        tabsContainer.appendChild(btn);
      });
    }

    if (gridContainer) {
      gridContainer.innerHTML = '';
      const worldPuzzles = this.puzzles.filter(p => p.world === worldId);

      worldPuzzles.forEach(p => {
        const isUnlocked = p.id <= this.unlockedLevel;
        const stars = this.levelStars[p.id] || 0;

        const card = document.createElement('div');
        card.className = `level-card ${isUnlocked ? 'unlocked' : 'locked'}`;

        let starsHtml = '';
        for (let i = 1; i <= 3; i++) {
          starsHtml += `<span class="star-icon ${i <= stars ? 'star-filled' : 'star-empty'}">⭐</span>`;
        }

        card.innerHTML = `
          <div class="level-card-number">${isUnlocked ? p.id : '🔒'}</div>
          <div class="level-card-title">${p.title}</div>
          <div class="level-card-stars">${isUnlocked ? starsHtml : 'Locked'}</div>
        `;

        if (isUnlocked) {
          card.onclick = () => {
            this.closeModal('level-select-modal');
            this.loadLevel(p.id - 1);
          };
        }

        gridContainer.appendChild(card);
      });
    }
  }

  applyTheme(themeName) {
    this.activeTheme = themeName;
    document.body.dataset.theme = themeName;
    localStorage.setItem('chess_quest_theme', themeName);
  }

  bindUIEvents() {
    // Hint buttons
    const btnNudge = document.getElementById('btn-hint-nudge');
    if (btnNudge) btnNudge.addEventListener('click', () => this.triggerHint1Nudge());

    const btnTarget = document.getElementById('btn-hint-target');
    if (btnTarget) btnTarget.addEventListener('click', () => this.triggerHint2Target());

    const btnWand = document.getElementById('btn-hint-wand');
    if (btnWand) btnWand.addEventListener('click', () => this.triggerHint3MagicWand());

    // Navigation buttons
    const btnPrev = document.getElementById('btn-prev-level');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (this.currentLevelIndex > 0) {
          sound.playPop();
          this.loadLevel(this.currentLevelIndex - 1);
        }
      });
    }

    const btnNext = document.getElementById('btn-next-level-nav');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        sound.playPop();
        this.loadNextIntelligentPuzzle();
      });
    }

    const btnRestart = document.getElementById('btn-restart-level');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        sound.playPop();
        this.loadPuzzleDirect(this.getCurrentPuzzle());
      });
    }

    // Mode Toggle (Adaptive vs Lichess Endless)
    const btnMode = document.getElementById('btn-mode-toggle');
    if (btnMode) {
      btnMode.addEventListener('click', () => this.toggleMode());
    }

    // Level map & World badge
    const btnMap = document.getElementById('btn-open-map');
    if (btnMap) btnMap.addEventListener('click', () => this.openLevelSelectModal());

    const worldBadge = document.getElementById('world-badge-btn');
    if (worldBadge) worldBadge.addEventListener('click', () => this.openLevelSelectModal());

    // Helper dots toggle & prompt buttons
    const btnDotsYes = document.getElementById('btn-helper-dots-yes');
    if (btnDotsYes) btnDotsYes.addEventListener('click', () => this.enableHelperDots());

    const btnDotsNo = document.getElementById('btn-helper-dots-no');
    if (btnDotsNo) btnDotsNo.addEventListener('click', () => this.dismissHelperDots());

    const btnToggleDots = document.getElementById('btn-toggle-dots');
    if (btnToggleDots) btnToggleDots.addEventListener('click', () => this.toggleHelperDotsManual());

    // Lock modal close
    const btnLockClose = document.getElementById('btn-lock-close');
    if (btnLockClose) {
      btnLockClose.addEventListener('click', () => {
        this.closeModal('subscription-lock-modal');
        this.loadLevel(0); // Load starter free level
      });
    }

    // Audio toggle
    const soundToggle = document.getElementById('btn-toggle-sound');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        const enabled = sound.toggleSound();
        soundToggle.textContent = enabled ? '🔊' : '🔇';
        soundToggle.title = enabled ? 'Mute Sound' : 'Unmute Sound';
      });
      soundToggle.textContent = sound.enabled ? '🔊' : '🔇';
    }

    // Theme selector
    const themeToggle = document.getElementById('btn-theme-selector');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const themes = ['candy', 'forest', 'royal', 'cosmic'];
        const nextTheme = themes[(themes.indexOf(this.activeTheme) + 1) % themes.length];
        this.applyTheme(nextTheme);
        sound.playPop();
      });
    }

    // Rules modal
    const btnRules = document.getElementById('btn-how-to-play');
    if (btnRules) {
      btnRules.addEventListener('click', () => {
        sound.playPop();
        this.openModal('rules-modal');
      });
    }

    // Modal close buttons
    const closeButtons = document.querySelectorAll('.modal-close-btn');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });

    // Close on overlay backdrop click
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });

    // Reset progress button
    const btnReset = document.getElementById('btn-reset-progress');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('Start your adventure over from Level 1? (Stars will be reset)')) {
          localStorage.removeItem('chess_quest_unlocked_level');
          localStorage.removeItem('chess_quest_stars');
          localStorage.removeItem('chess_quest_current_level');
          this.unlockedLevel = 1;
          this.levelStars = {};
          this.loadLevel(0);
          this.closeModal('level-select-modal');
        }
      });
    }
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.chessQuestApp = new ChessQuestApp();
});
