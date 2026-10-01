// High Performance Kid-Friendly SVG Chessboard
// Dual Input Support (Drag & Drop + Tap to Move), Hot & Cold hints, Magic Wand animations

export class KidChessBoard {
  constructor(elementId, options = {}) {
    this.container = document.getElementById(elementId);
    this.chess = options.chess; // Chess.js instance
    this.orientation = options.orientation || 'w'; // 'w' or 'b'
    this.onMove = options.onMove || (() => {});
    this.onSelectSquare = options.onSelectSquare || (() => {});
    this.showDots = options.showDots || false; // By default, do NOT show dots immediately
    
    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    this.draggedPiece = null;
    this.dragOriginSquare = null;
    this.ghostEl = null;

    this.hintSourceSquare = null;
    this.hintTargetSquare = null;

    this.initBoard();
    this.bindEvents();
  }

  // Beautiful Kid-Friendly SVG Chess Piece Icons
  static getPieceSvg(pieceKey) {
    // pieceKey e.g. "wP", "wN", "wB", "wR", "wQ", "wK", "bP", ...
    const isWhite = pieceKey[0] === 'w';
    const type = pieceKey[1];

    const fillMain = isWhite ? '#FFFFFF' : '#2D3748';
    const fillSec = isWhite ? '#FFF9C4' : '#4A5568';
    const stroke = isWhite ? '#1A202C' : '#0F172A';
    const accent = isWhite ? '#FFB300' : '#805AD5';

    let paths = '';

    switch (type) {
      case 'P': // Pawn
        paths = `
          <ellipse cx="25" cy="14" rx="7" ry="7" fill="${fillMain}" stroke="${stroke}" stroke-width="2.2" />
          <path d="M 20 21 Q 25 24 30 21 Q 29 32 32 37 L 18 37 Q 21 32 20 21 Z" fill="${fillMain}" stroke="${stroke}" stroke-width="2.2" />
          <ellipse cx="25" cy="38" rx="10" ry="3.5" fill="${fillSec}" stroke="${stroke}" stroke-width="2" />
          <path d="M 13 41 Q 25 39 37 41 L 37 45 Q 25 43 13 45 Z" fill="${fillMain}" stroke="${stroke}" stroke-width="2" />
        `;
        break;
      case 'R': // Rook / Tower
        paths = `
          <rect x="15" y="11" width="20" height="8" rx="2" fill="${fillMain}" stroke="${stroke}" stroke-width="2" />
          <rect x="18" y="10" width="4" height="4" fill="${accent}" />
          <rect x="28" y="10" width="4" height="4" fill="${accent}" />
          <path d="M 17 19 L 19 36 L 31 36 L 33 19 Z" fill="${fillMain}" stroke="${stroke}" stroke-width="2.2" />
          <ellipse cx="25" cy="27" rx="4" ry="4" fill="${fillSec}" />
          <path d="M 14 36 L 36 36 L 38 44 L 12 44 Z" fill="${fillSec}" stroke="${stroke}" stroke-width="2.2" />
        `;
        break;
      case 'N': // Knight / Brave Horse
        paths = `
          <!-- Horse Base / Plinth -->
          <path d="M 13 44 L 37 44 Q 38 40 35 39 L 15 39 Q 12 40 13 44 Z" fill="${fillSec}" stroke="${stroke}" stroke-width="2.2" stroke-linejoin="round" />
          
          <!-- Distinctive Horse Silhouette (Arched Neck, Perky Ears, Extended Snout) -->
          <path d="M 16 39 
                   C 16 33, 17 29, 20 27 
                   C 17 27, 12 25, 10 22 
                   C 8 19, 13 16, 18 15 
                   C 20 12, 21 7, 23 5 
                   C 25 7, 25 10, 25 11 
                   C 28 8, 30 7, 31 10 
                   C 36 13, 37 19, 36 24 
                   C 38 27, 37 32, 34 35 
                   C 35 37, 34 39, 34 39 Z" 
                fill="${fillMain}" stroke="${stroke}" stroke-width="2.2" stroke-linejoin="round" />

          <!-- Pointed Horse Ears -->
          <path d="M 23 12 L 23 5 L 26 11 Z" fill="${accent}" stroke="${stroke}" stroke-width="1.8" />
          <path d="M 28 12 L 31 7 L 32 12 Z" fill="${fillMain}" stroke="${stroke}" stroke-width="1.8" />

          <!-- Distinctive Golden Mane Tufts down the arched neck -->
          <path d="M 34 16 Q 38 18 36 22" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" />
          <path d="M 35 23 Q 39 26 36 30" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" />
          <path d="M 34 31 Q 38 34 34 37" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" />

          <!-- Big Friendly Horse Eye -->
          <ellipse cx="20" cy="18" rx="2.8" ry="3.2" fill="${accent}" stroke="${stroke}" stroke-width="1.2" />
          <circle cx="21" cy="17" r="1.1" fill="#FFFFFF" />

          <!-- Horse Nostril & Smiling Mouth -->
          <circle cx="12" cy="20.5" r="1.2" fill="${stroke}" />
          <path d="M 11 23 Q 14 24 16 22.5" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" />
          
          <!-- Cute Cheek Blush -->
          <ellipse cx="18" cy="22" rx="2" ry="1.2" fill="#FF8A80" opacity="0.6" />
        `;
        break;
      case 'B': // Bishop / Wizard Hat
        paths = `
          <circle cx="25" cy="11" r="2.5" fill="${accent}" stroke="${stroke}" stroke-width="1.8" />
          <path d="M 18 24 C 17 14 33 14 32 24 C 32 30 30 35 31 38 L 19 38 C 20 35 18 30 18 24 Z" fill="${fillMain}" stroke="${stroke}" stroke-width="2.2" />
          <path d="M 21 21 L 29 27" stroke="${stroke}" stroke-width="2" />
          <path d="M 14 38 L 36 38 L 37 44 L 13 44 Z" fill="${fillSec}" stroke="${stroke}" stroke-width="2.2" />
        `;
        break;
      case 'Q': // Queen Stella
        paths = `
          <circle cx="16" cy="14" r="2.2" fill="${accent}" stroke="${stroke}" stroke-width="1.5" />
          <circle cx="25" cy="10" r="2.5" fill="${accent}" stroke="${stroke}" stroke-width="1.5" />
          <circle cx="34" cy="14" r="2.2" fill="${accent}" stroke="${stroke}" stroke-width="1.5" />
          <path d="M 16 16 L 19 35 L 31 35 L 34 16 L 28 24 L 25 13 L 22 24 Z" fill="${fillMain}" stroke="${stroke}" stroke-width="2.2" />
          <ellipse cx="25" cy="28" rx="4" ry="4" fill="${accent}" />
          <path d="M 14 36 L 36 36 L 38 44 L 12 44 Z" fill="${fillSec}" stroke="${stroke}" stroke-width="2.2" />
        `;
        break;
      case 'K': // King Leo
        paths = `
          <!-- Cross -->
          <line x1="25" y1="7" x2="25" y2="15" stroke="${accent}" stroke-width="3" stroke-linecap="round" />
          <line x1="21" y1="10" x2="29" y2="10" stroke="${accent}" stroke-width="3" stroke-linecap="round" />
          <!-- Crown Head -->
          <path d="M 17 19 Q 25 15 33 19 Q 34 26 31 35 L 19 35 Q 16 26 17 19 Z" fill="${fillMain}" stroke="${stroke}" stroke-width="2.2" />
          <ellipse cx="25" cy="27" rx="3.5" ry="3.5" fill="${accent}" />
          <path d="M 13 36 L 37 36 L 38 44 L 12 44 Z" fill="${fillSec}" stroke="${stroke}" stroke-width="2.2" />
        `;
        break;
    }

    return `
      <svg viewBox="0 0 50 50" class="chess-piece-svg piece-${pieceKey}" draggable="false">
        <filter id="pieceShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.25" />
        </filter>
        <g filter="url(#pieceShadow)">
          ${paths}
        </g>
      </svg>
    `;
  }

  initBoard() {
    this.container.innerHTML = `
      <div class="chessboard-wrapper" id="board-grid-wrapper">
        <div class="chessboard-grid" id="chessboard-grid"></div>
      </div>
    `;
    this.gridEl = document.getElementById('chessboard-grid');
    this.render();
  }

  setOrientation(orientation) {
    this.orientation = orientation;
    this.render();
  }

  render() {
    if (!this.gridEl || !this.chess) return;

    this.gridEl.innerHTML = '';
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    const renderFiles = this.orientation === 'w' ? files : [...files].reverse();
    const renderRanks = this.orientation === 'w' ? ranks : [...ranks].reverse();

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const file = renderFiles[f];
        const rank = renderRanks[r];
        const squareKey = `${file}${rank}`;

        const isLight = (file.charCodeAt(0) - 97 + parseInt(rank)) % 2 !== 0;
        const squareEl = document.createElement('div');
        squareEl.className = `board-square ${isLight ? 'square-light' : 'square-dark'}`;
        squareEl.dataset.square = squareKey;

        // Visual coordinate tags on edges
        if (f === 0) {
          const rankLabel = document.createElement('span');
          rankLabel.className = 'coord-label coord-rank';
          rankLabel.textContent = rank;
          squareEl.appendChild(rankLabel);
        }
        if (r === 7) {
          const fileLabel = document.createElement('span');
          fileLabel.className = 'coord-label coord-file';
          fileLabel.textContent = file;
          squareEl.appendChild(fileLabel);
        }

        // Piece on square
        const piece = this.chess.get(squareKey);
        if (piece) {
          const pieceEl = document.createElement('div');
          pieceEl.className = `piece-element piece-${piece.color}${piece.type.toUpperCase()}`;
          pieceEl.dataset.square = squareKey;
          pieceEl.dataset.piece = `${piece.color}${piece.type.toUpperCase()}`;
          pieceEl.innerHTML = KidChessBoard.getPieceSvg(`${piece.color}${piece.type.toUpperCase()}`);
          squareEl.appendChild(pieceEl);
        }

        this.gridEl.appendChild(squareEl);
      }
    }

    this.refreshHighlights();
  }

  refreshHighlights() {
    // Remove past highlights
    const allSquares = this.gridEl.querySelectorAll('.board-square');
    allSquares.forEach(sq => {
      sq.classList.remove('selected', 'hint-source', 'hint-target', 'in-check');
      const indicator = sq.querySelector('.move-dot, .capture-ring');
      if (indicator) indicator.remove();
    });

    // Check indicator if king is checked
    if (this.chess.inCheck()) {
      const turn = this.chess.turn();
      const board = this.chess.board();
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = board[r][c];
          if (piece && piece.type === 'k' && piece.color === turn) {
            const file = String.fromCharCode(97 + c);
            const rank = (8 - r).toString();
            const sqEl = this.gridEl.querySelector(`[data-square="${file}${rank}"]`);
            if (sqEl) sqEl.classList.add('in-check');
          }
        }
      }
    }

    // Selected piece highlight
    if (this.selectedSquare) {
      const selectedEl = this.gridEl.querySelector(`[data-square="${this.selectedSquare}"]`);
      if (selectedEl) selectedEl.classList.add('selected');

      // Show hot & cold dots on valid destination squares ONLY if showDots is enabled
      if (this.showDots) {
        this.legalMovesForSelected.forEach(m => {
          const destEl = this.gridEl.querySelector(`[data-square="${m.to}"]`);
          if (destEl) {
            const indicator = document.createElement('div');
            if (m.captured) {
              indicator.className = 'capture-ring';
            } else {
              indicator.className = 'move-dot';
            }
            destEl.appendChild(indicator);
          }
        });
      }
    }

    // Hint 1: Glow source square
    if (this.hintSourceSquare) {
      const hintSrcEl = this.gridEl.querySelector(`[data-square="${this.hintSourceSquare}"]`);
      if (hintSrcEl) hintSrcEl.classList.add('hint-source');
    }

    // Hint 2: Sparkle target square
    if (this.hintTargetSquare) {
      const hintTgtEl = this.gridEl.querySelector(`[data-square="${this.hintTargetSquare}"]`);
      if (hintTgtEl) hintTgtEl.classList.add('hint-target');
    }
  }

  bindEvents() {
    this.gridEl.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    window.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    window.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    window.addEventListener('pointercancel', (e) => this.handlePointerCancel(e));
  }

  handlePointerDown(e) {
    const squareEl = e.target.closest('.board-square');
    if (!squareEl) return;

    const squareKey = squareEl.dataset.square;
    const piece = this.chess.get(squareKey);
    const isPlayerTurn = piece && piece.color === this.chess.turn();

    // Case 1: Tapping on an existing selected target square (Tap to move)
    if (this.selectedSquare && this.legalMovesForSelected.some(m => m.to === squareKey)) {
      this.attemptMove(this.selectedSquare, squareKey);
      this.clearSelection();
      return;
    }

    // Case 2: Tapping on a friendly piece (select or initiate drag)
    if (isPlayerTurn) {
      this.selectSquare(squareKey);

      // Setup drag
      const pieceEl = squareEl.querySelector('.piece-element');
      if (pieceEl) {
        this.draggedPiece = pieceEl;
        this.dragOriginSquare = squareKey;
        this.startX = e.clientX;
        this.startY = e.clientY;

        // Create floating ghost
        this.createGhostPiece(pieceEl, e.clientX, e.clientY);
        pieceEl.classList.add('dragging-source');
      }
    } else {
      // Tapping elsewhere deselects
      this.clearSelection();
    }
  }

  handlePointerMove(e) {
    if (!this.ghostEl) return;
    e.preventDefault();

    // Position ghost piece centered on touch / mouse pointer
    this.ghostEl.style.left = `${e.clientX}px`;
    this.ghostEl.style.top = `${e.clientY}px`;

    // Highlight hovered square
    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    const sqBelow = elemBelow ? elemBelow.closest('.board-square') : null;

    const allSquares = this.gridEl.querySelectorAll('.board-square');
    allSquares.forEach(sq => sq.classList.remove('drag-hover'));

    if (sqBelow && sqBelow.dataset.square !== this.dragOriginSquare) {
      sqBelow.classList.add('drag-hover');
    }
  }

  handlePointerUp(e) {
    if (!this.ghostEl) return;

    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    const sqBelow = elemBelow ? elemBelow.closest('.board-square') : null;

    const fromSquare = this.dragOriginSquare;
    const toSquare = sqBelow ? sqBelow.dataset.square : null;

    // Remove drag artifacts
    this.removeGhostPiece();
    if (this.draggedPiece) {
      this.draggedPiece.classList.remove('dragging-source');
    }

    const allSquares = this.gridEl.querySelectorAll('.board-square');
    allSquares.forEach(sq => sq.classList.remove('drag-hover'));

    // Check if dragged a minimum distance (to differentiate tap vs drag)
    const dist = Math.hypot(e.clientX - this.startX, e.clientY - this.startY);

    if (dist > 15 && toSquare && toSquare !== fromSquare) {
      // Player dragged and dropped onto a square
      this.attemptMove(fromSquare, toSquare);
      this.clearSelection();
    }

    this.draggedPiece = null;
    this.dragOriginSquare = null;
  }

  handlePointerCancel() {
    this.removeGhostPiece();
    if (this.draggedPiece) {
      this.draggedPiece.classList.remove('dragging-source');
    }
    this.draggedPiece = null;
    this.dragOriginSquare = null;
  }

  createGhostPiece(pieceEl, x, y) {
    this.ghostEl = pieceEl.cloneNode(true);
    this.ghostEl.className = 'floating-ghost-piece';
    this.ghostEl.style.position = 'fixed';
    this.ghostEl.style.pointerEvents = 'none';
    this.ghostEl.style.zIndex = '9999';
    this.ghostEl.style.width = `${pieceEl.offsetWidth * 1.15}px`;
    this.ghostEl.style.height = `${pieceEl.offsetHeight * 1.15}px`;
    this.ghostEl.style.transform = 'translate(-50%, -50%)';
    this.ghostEl.style.left = `${x}px`;
    this.ghostEl.style.top = `${y}px`;
    document.body.appendChild(this.ghostEl);
  }

  removeGhostPiece() {
    if (this.ghostEl) {
      this.ghostEl.remove();
      this.ghostEl = null;
    }
  }

  selectSquare(squareKey) {
    this.selectedSquare = squareKey;
    const rawMoves = this.chess.moves({ square: squareKey, verbose: true });
    this.legalMovesForSelected = rawMoves;
    this.refreshHighlights();
    if (this.onSelectSquare) {
      this.onSelectSquare(squareKey);
    }
  }

  setShowDots(enable) {
    this.showDots = enable;
    this.refreshHighlights();
  }

  clearSelection() {
    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    this.refreshHighlights();
  }

  attemptMove(from, to) {
    const move = { from, to, promotion: 'q' };
    this.onMove(move);
  }

  // Playful oops wobble animation when an incorrect move is made
  playOopsAnimation(from, to) {
    const boardWrapper = document.getElementById('board-grid-wrapper');
    if (boardWrapper) {
      boardWrapper.classList.remove('board-wobble');
      void boardWrapper.offsetWidth; // Force reflow
      boardWrapper.classList.add('board-wobble');
      setTimeout(() => {
        boardWrapper.classList.remove('board-wobble');
      }, 600);
    }
  }

  // Hint Tier 1: Nudge (Glow source piece)
  showHintNudge(square) {
    this.hintSourceSquare = square;
    this.refreshHighlights();
  }

  // Hint Tier 2: Target (Highlight destination square)
  showHintTarget(square) {
    this.hintTargetSquare = square;
    this.refreshHighlights();
  }

  // Clear all hints
  clearHints() {
    this.hintSourceSquare = null;
    this.hintTargetSquare = null;
    this.refreshHighlights();
  }

  // Hint Tier 3: Magic Wand Demo (Animates ghost piece along the winning path)
  animateMagicWand(from, to, callback) {
    const fromEl = this.gridEl.querySelector(`[data-square="${from}"] .piece-element`);
    const toEl = this.gridEl.querySelector(`[data-square="${to}"]`);

    if (!fromEl || !toEl) {
      if (callback) callback();
      return;
    }

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const wandGhost = fromEl.cloneNode(true);
    wandGhost.className = 'magic-wand-ghost';
    wandGhost.style.position = 'fixed';
    wandGhost.style.left = `${fromRect.left}px`;
    wandGhost.style.top = `${fromRect.top}px`;
    wandGhost.style.width = `${fromRect.width}px`;
    wandGhost.style.height = `${fromRect.height}px`;
    wandGhost.style.zIndex = '9999';
    wandGhost.style.transition = 'all 1.1s cubic-bezier(0.34, 1.56, 0.64, 1)';
    wandGhost.style.pointerEvents = 'none';

    document.body.appendChild(wandGhost);

    // Trigger magic sparkle motion
    requestAnimationFrame(() => {
      wandGhost.style.left = `${toRect.left}px`;
      wandGhost.style.top = `${toRect.top}px`;
      wandGhost.style.transform = 'scale(1.2) rotate(6deg)';
    });

    setTimeout(() => {
      // Flash target square
      toEl.classList.add('magic-wand-flash');
      setTimeout(() => toEl.classList.remove('magic-wand-flash'), 500);

      // Fade ghost piece
      wandGhost.style.opacity = '0';
      wandGhost.style.transform = 'scale(0.8)';
      setTimeout(() => {
        wandGhost.remove();
        if (callback) callback();
      }, 350);
    }, 1200);
  }
}
