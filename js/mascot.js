// Sir Sparky the Puzzle Dragon - Kid-Friendly Animated Mascot Companion
// Features dynamic SVG rendering, expressive mood states, and interactive playful speech

export class MascotCompanion {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.mood = 'idle';
    this.speechTimeout = null;
    this.dialogueQueue = [];
    this.render();
    this.initInteractions();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="mascot-wrapper" id="mascot-avatar">
        <!-- Speech Bubble -->
        <div class="mascot-bubble" id="mascot-bubble" aria-live="polite">
          <span class="bubble-text" id="mascot-text">Hello adventurer! I'm Sparky! Let's solve some puzzles! 🐉</span>
          <div class="bubble-tail"></div>
        </div>

        <!-- Animated Mascot SVG -->
        <div class="mascot-character" id="sparky-figure" title="Tap Sparky for a tip!">
          <svg viewBox="0 0 160 160" class="sparky-svg" id="sparky-svg">
            <defs>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#4EBA6F" />
                <stop offset="100%" stop-color="#2E7D32" />
              </linearGradient>
              <linearGradient id="bellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FFF59D" />
                <stop offset="100%" stop-color="#FFEE58" />
              </linearGradient>
              <linearGradient id="hornGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFD54F" />
                <stop offset="100%" stop-color="#FFB300" />
              </linearGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Wings (Flap in cheer mood) -->
            <g class="dragon-wings">
              <path class="wing-left" d="M 45 75 Q 15 50 20 85 Q 35 90 48 85 Z" fill="#81C784" stroke="#2E7D32" stroke-width="2.5" />
              <path class="wing-right" d="M 115 75 Q 145 50 140 85 Q 125 90 112 85 Z" fill="#81C784" stroke="#2E7D32" stroke-width="2.5" />
            </g>

            <!-- Tail with cute spade -->
            <g class="dragon-tail">
              <path d="M 110 120 Q 145 125 145 105 Q 140 95 130 102" fill="none" stroke="#2E7D32" stroke-width="9" stroke-linecap="round" />
              <polygon points="142,95 152,105 138,110" fill="#FFB300" />
            </g>

            <!-- Dragon Body -->
            <ellipse cx="80" cy="105" rx="36" ry="34" fill="url(#bodyGrad)" stroke="#1B5E20" stroke-width="3" />

            <!-- Dragon Soft Belly -->
            <ellipse cx="80" cy="110" rx="22" ry="24" fill="url(#bellyGrad)" />
            <path d="M 68 102 Q 80 106 92 102" stroke="#FDD835" stroke-width="2" fill="none" stroke-linecap="round" />
            <path d="M 66 114 Q 80 118 94 114" stroke="#FDD835" stroke-width="2" fill="none" stroke-linecap="round" />
            <path d="M 70 124 Q 80 127 90 124" stroke="#FDD835" stroke-width="2" fill="none" stroke-linecap="round" />

            <!-- Cute Feet -->
            <ellipse cx="60" cy="138" rx="14" ry="9" fill="#2E7D32" stroke="#1B5E20" stroke-width="2.5" />
            <ellipse cx="100" cy="138" rx="14" ry="9" fill="#2E7D32" stroke="#1B5E20" stroke-width="2.5" />
            <circle cx="53" cy="142" r="2.5" fill="#FFF59D" />
            <circle cx="60" cy="144" r="2.5" fill="#FFF59D" />
            <circle cx="67" cy="142" r="2.5" fill="#FFF59D" />
            <circle cx="93" cy="142" r="2.5" fill="#FFF59D" />
            <circle cx="100" cy="144" r="2.5" fill="#FFF59D" />
            <circle cx="107" cy="142" r="2.5" fill="#FFF59D" />

            <!-- Horns -->
            <path d="M 52 46 Q 38 22 45 18 Q 58 26 62 42 Z" fill="url(#hornGrad)" stroke="#FF8F00" stroke-width="2" />
            <path d="M 108 46 Q 122 22 115 18 Q 102 26 98 42 Z" fill="url(#hornGrad)" stroke="#FF8F00" stroke-width="2" />

            <!-- Golden Crown / Knight Helmet Cap -->
            <g class="dragon-crown">
              <path d="M 64 36 L 70 20 L 80 30 L 90 20 L 96 36 Z" fill="#FFD54F" stroke="#FF8F00" stroke-width="2" />
              <circle cx="70" cy="22" r="2.5" fill="#E91E63" />
              <circle cx="80" cy="30" r="2.5" fill="#2196F3" />
              <circle cx="90" cy="22" r="2.5" fill="#4CAF50" />
            </g>

            <!-- Dragon Head -->
            <ellipse cx="80" cy="62" rx="34" ry="30" fill="url(#bodyGrad)" stroke="#1B5E20" stroke-width="3" />

            <!-- Cute Rosy Cheeks -->
            <ellipse class="cheek-left" cx="54" cy="74" rx="7" ry="4.5" fill="#FF8A80" opacity="0.65" />
            <ellipse class="cheek-right" cx="106" cy="74" rx="7" ry="4.5" fill="#FF8A80" opacity="0.65" />

            <!-- Cute Big Eyes -->
            <g class="dragon-eyes" id="dragon-eyes">
              <!-- Left Eye -->
              <ellipse class="eye-white" cx="64" cy="58" rx="10" ry="12" fill="#FFFFFF" stroke="#1B5E20" stroke-width="1.8" />
              <ellipse class="eye-pupil" cx="66" cy="58" rx="6.5" ry="8" fill="#1B5E20" />
              <circle class="eye-highlight" cx="68" cy="54" r="3" fill="#FFFFFF" />
              <circle class="eye-sparkle" cx="64" cy="62" r="1.5" fill="#FFFFFF" />

              <!-- Right Eye -->
              <ellipse class="eye-white" cx="96" cy="58" rx="10" ry="12" fill="#FFFFFF" stroke="#1B5E20" stroke-width="1.8" />
              <ellipse class="eye-pupil" cx="94" cy="58" rx="6.5" ry="8" fill="#1B5E20" />
              <circle class="eye-highlight" cx="96" cy="54" r="3" fill="#FFFFFF" />
              <circle class="eye-sparkle" cx="92" cy="62" r="1.5" fill="#FFFFFF" />
            </g>

            <!-- Snout / Nostrils -->
            <ellipse cx="76" cy="69" rx="1.5" ry="2" fill="#1B5E20" />
            <ellipse cx="84" cy="69" rx="1.5" ry="2" fill="#1B5E20" />

            <!-- Cheerful Mouth -->
            <path class="dragon-mouth" id="dragon-mouth" d="M 72 75 Q 80 84 88 75" fill="none" stroke="#1B5E20" stroke-width="2.6" stroke-linecap="round" />

            <!-- Cute Paws -->
            <g class="dragon-hands">
              <ellipse class="hand-left" cx="54" cy="100" rx="9" ry="8" fill="#4EBA6F" stroke="#1B5E20" stroke-width="2" />
              <ellipse class="hand-right" cx="106" cy="100" rx="9" ry="8" fill="#4EBA6F" stroke="#1B5E20" stroke-width="2" />
            </g>

            <!-- Magic Wand (Visible in Hint mood) -->
            <g class="magic-wand" id="magic-wand" style="display: none;">
              <line x1="112" y1="96" x2="136" y2="60" stroke="#FFD54F" stroke-width="4" stroke-linecap="round" />
              <path d="M 136 60 L 140 50 L 144 60 L 154 62 L 146 68 L 148 78 L 138 72 L 128 78 L 130 68 L 122 62 Z" fill="#FFF176" stroke="#FFB300" stroke-width="1.5" filter="url(#softGlow)" />
            </g>
          </svg>
        </div>
      </div>
    `;
  }

  initInteractions() {
    const figure = document.getElementById('sparky-figure');
    if (figure) {
      figure.addEventListener('click', () => {
        this.sayRandomFunQuote();
      });
    }
  }

  setMood(mood) {
    this.mood = mood;
    const figure = document.getElementById('sparky-figure');
    const mouth = document.getElementById('dragon-mouth');
    const eyes = document.getElementById('dragon-eyes');
    const wand = document.getElementById('magic-wand');

    if (!figure || !mouth || !eyes) return;

    figure.classList.remove('mood-idle', 'mood-thinking', 'mood-cheer', 'mood-oops', 'mood-hint');
    figure.classList.add(`mood-${mood}`);

    if (wand) {
      wand.style.display = mood === 'hint' ? 'block' : 'none';
    }

    if (mood === 'cheer') {
      mouth.setAttribute('d', 'M 70 73 Q 80 90 90 73 Z');
      mouth.setAttribute('fill', '#E91E63');
      eyes.innerHTML = `
        <path d="M 54 60 Q 64 50 74 60" fill="none" stroke="#1B5E20" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 86 60 Q 96 50 106 60" fill="none" stroke="#1B5E20" stroke-width="3.5" stroke-linecap="round" />
      `;
    } else if (mood === 'oops') {
      mouth.setAttribute('d', 'M 74 79 Q 80 73 86 79');
      mouth.setAttribute('fill', 'none');
      eyes.innerHTML = `
        <ellipse cx="64" cy="59" rx="8" ry="10" fill="#FFFFFF" stroke="#1B5E20" stroke-width="1.8" />
        <ellipse cx="66" cy="60" rx="5" ry="6" fill="#1B5E20" />
        <circle cx="68" cy="57" r="2.5" fill="#FFFFFF" />
        <ellipse cx="96" cy="59" rx="8" ry="10" fill="#FFFFFF" stroke="#1B5E20" stroke-width="1.8" />
        <ellipse cx="94" cy="60" rx="5" ry="6" fill="#1B5E20" />
        <circle cx="96" cy="57" r="2.5" fill="#FFFFFF" />
      `;
    } else if (mood === 'thinking') {
      mouth.setAttribute('d', 'M 75 76 Q 80 78 85 76');
      mouth.setAttribute('fill', 'none');
      eyes.innerHTML = `
        <ellipse cx="64" cy="56" rx="9" ry="10" fill="#FFFFFF" stroke="#1B5E20" stroke-width="1.8" />
        <ellipse cx="67" cy="53" rx="5" ry="6" fill="#1B5E20" />
        <circle cx="69" cy="51" r="2.5" fill="#FFFFFF" />
        <ellipse cx="96" cy="56" rx="9" ry="10" fill="#FFFFFF" stroke="#1B5E20" stroke-width="1.8" />
        <ellipse cx="99" cy="53" rx="5" ry="6" fill="#1B5E20" />
        <circle cx="101" cy="51" r="2.5" fill="#FFFFFF" />
      `;
    } else {
      // Idle / Normal
      mouth.setAttribute('d', 'M 72 75 Q 80 84 88 75');
      mouth.setAttribute('fill', 'none');
      eyes.innerHTML = `
        <ellipse cx="64" cy="58" rx="10" ry="12" fill="#FFFFFF" stroke="#1B5E20" stroke-width="1.8" />
        <ellipse cx="66" cy="58" rx="6.5" ry="8" fill="#1B5E20" />
        <circle cx="68" cy="54" r="3" fill="#FFFFFF" />
        <circle cx="64" cy="62" r="1.5" fill="#FFFFFF" />
        <ellipse cx="96" cy="58" rx="10" ry="12" fill="#FFFFFF" stroke="#1B5E20" stroke-width="1.8" />
        <ellipse cx="94" cy="58" rx="6.5" ry="8" fill="#1B5E20" />
        <circle cx="96" cy="54" r="3" fill="#FFFFFF" />
        <circle cx="92" cy="62" r="1.5" fill="#FFFFFF" />
      `;
    }
  }

  say(text, mood = 'idle', duration = 6500) {
    this.setMood(mood);
    const bubble = document.getElementById('mascot-bubble');
    const label = document.getElementById('mascot-text');

    if (bubble && label) {
      label.textContent = text;
      bubble.classList.remove('bubble-pop');
      void bubble.offsetWidth; // Force reflow
      bubble.classList.add('bubble-pop');

      if (this.speechTimeout) {
        clearTimeout(this.speechTimeout);
      }

      this.speechTimeout = setTimeout(() => {
        if (this.mood !== 'cheer') {
          this.setMood('idle');
        }
      }, duration);
    }
  }

  // Playful coaching hints
  sayNudge(text) {
    this.say(`💡 Sparky's Clue: ${text}`, 'hint', 8000);
  }

  sayTarget(text) {
    this.say(`🎯 Target Found: ${text}`, 'hint', 8000);
  }

  sayMagicWand() {
    this.say(`🪄 Abracadabra! Watch the magic move! Now it's your turn!`, 'hint', 7000);
  }

  sayOops(customMessage) {
    const oopsMessages = [
      "Nice thought! That King is sneaky though. Try looking at another piece!",
      "Almost! Can you spot a move that protects your pieces or corners the King?",
      "Oopsie daisy! That square gave the king an escape! What else can we try?",
      "Close call! Take a breath and look across the board together!",
      "Good try, young knight! Look for a piece that can strike without getting trapped!"
    ];
    const msg = customMessage || oopsMessages[Math.floor(Math.random() * oopsMessages.length)];
    this.say(msg, 'oops', 6000);
  }

  sayVictory(stars = 3) {
    const praises = [
      "✨ ROAAR OF TRIUMPH! Brilliant tactical thinking!",
      "🌟 WOW! You solved it like a Grandmaster Knight!",
      "🎉 Outstanding! The kingdom celebrates your victory!",
      "👑 Amazing checkmate! You're unstoppable!"
    ];
    const msg = praises[Math.floor(Math.random() * praises.length)];
    this.say(msg, 'cheer', 9000);
  }

  sayRandomFunQuote() {
    const quotes = [
      "Knights can hop right over castle walls! Boing boing! 🐴",
      "Rooks roll in straight lines like heavy steam rollers! 🏰",
      "Bishops love zooming along their favorite diagonal color! ⚡",
      "Pawns are brave! If they reach the other side, they become Queens! 👑",
      "I believe in you! Let's find the golden tactic together! ✨"
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    this.say(quote, 'thinking', 5000);
  }
}
