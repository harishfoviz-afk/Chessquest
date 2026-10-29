// Chess Quest: Admin Portal & Custom Puzzle Import Engine
// Manages template downloads, CSV/JSON validation with chess.js, tier assignment, and database state

import { Chess } from './chess.js';
import { subscriptionService, TIERS } from './subscription-service.js';
import { getCustomPuzzles, saveCustomPuzzles } from './puzzles.js';

let selectedFileContent = null;
let selectedFileName = '';

// Sample Templates
const CSV_TEMPLATE = `id,title,theme,rating,tier,fen,moves,hint1,hint2
custom_01,Brave Knight Jump,fork,850,free_trial,"r1bqk2r/pppp1ppp/2n5/4p3/1bB1n3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5",Nxe4,"c3","e4"
custom_02,Queen Battery Blast,mateIn2,1050,monthly,"r1b2rk1/pp1n1ppp/2p1p3/3p2q1/2PP4/2NBP3/PP3PPP/R2Q1RK1 w - - 0 11",Bxh7+ Kf8 Qh5,"d3","h7"
custom_03,Back Door Checkmate,backRankMate,720,free_trial,"6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",Rd8#,"d1","d8"
custom_04,Pinning Bishop,pin,920,monthly,"r1bqk2r/pppp1ppp/2n5/8/1bB1n3/2N1Q3/PPP2PPP/R1B1K1NR w KQkq - 0 7",Qxe4+,"e3","e4"
custom_05,Dragon Master Endgame,endgame,1400,yearly,"8/4k3/8/4P3/8/8/8/4K3 w - - 0 1",Kd2,"e1","d2"`;

const JSON_TEMPLATE = [
  {
    id: "custom_01",
    title: "Brave Knight Jump",
    theme: "fork",
    rating: 850,
    tier: "free_trial",
    fen: "r1bqk2r/pppp1ppp/2n5/4p3/1bB1n3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5",
    moves: ["Nxe4"],
    hint1: { square: "c3", text: "Look at your brave knight on c3!" },
    hint2: { square: "e4", text: "Capture the center piece on e4!" }
  },
  {
    id: "custom_02",
    title: "Back Door Checkmate",
    theme: "backRankMate",
    rating: 720,
    tier: "free_trial",
    fen: "6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
    moves: ["Rd8#"],
    hint1: { square: "d1", text: "Rook is ready to roll down the d-file!" },
    hint2: { square: "d8", text: "Checkmate on d8!" }
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initTemplateDownloads();
  initFileUpload();
  initSubscriptionSimulator();
  renderCustomPuzzlesTable();
});

// 1. Template Downloads
function initTemplateDownloads() {
  const btnCsv = document.getElementById('btn-download-csv');
  const btnJson = document.getElementById('btn-download-json');

  if (btnCsv) {
    btnCsv.addEventListener('click', () => {
      downloadFile('chess_quest_puzzle_template.csv', CSV_TEMPLATE, 'text/csv');
      showAlert('✅ CSV Template downloaded successfully!', 'success');
    });
  }

  if (btnJson) {
    btnJson.addEventListener('click', () => {
      downloadFile('chess_quest_puzzle_template.json', JSON.stringify(JSON_TEMPLATE, null, 2), 'application/json');
      showAlert('✅ JSON Template downloaded successfully!', 'success');
    });
  }
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 2. File Upload & 3 Dropdowns
function initFileUpload() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const btnImport = document.getElementById('btn-import-puzzles');
  const fileNameDisplay = document.getElementById('selected-file-name');

  if (!dropZone || !fileInput) return;

  dropZone.addEventListener('click', () => fileInput.click());

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#4CAF50';
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = 'var(--primary)';
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--primary)';
    if (e.dataTransfer.files.length > 0) {
      handleSelectedFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleSelectedFile(e.target.files[0]);
    }
  });

  function handleSelectedFile(file) {
    selectedFileName = file.name;
    if (fileNameDisplay) {
      fileNameDisplay.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
      fileNameDisplay.style.color = 'var(--primary)';
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      selectedFileContent = e.target.result;
      if (btnImport) btnImport.disabled = false;
    };
    reader.readAsText(file);
  }

  if (btnImport) {
    btnImport.addEventListener('click', () => {
      if (!selectedFileContent) {
        showAlert('⚠️ Please select a valid CSV or JSON file first.', 'error');
        return;
      }
      processImport(selectedFileName, selectedFileContent);
    });
  }
}

// Process and validate uploaded file
function processImport(filename, content) {
  const tierSelect = document.getElementById('upload-tier-select');
  const themeSelect = document.getElementById('upload-theme-select');
  const ratingSelect = document.getElementById('upload-rating-select');

  const selectedTier = tierSelect ? tierSelect.value : 'free_trial';
  const selectedTheme = themeSelect ? themeSelect.value : 'fork';
  const selectedRating = ratingSelect ? parseInt(ratingSelect.value, 10) : 800;

  let rawPuzzles = [];
  try {
    if (filename.endsWith('.json') || content.trim().startsWith('[') || content.trim().startsWith('{')) {
      const parsed = JSON.parse(content);
      rawPuzzles = Array.isArray(parsed) ? parsed : [parsed];
    } else {
      rawPuzzles = parseCSV(content);
    }
  } catch (err) {
    showAlert(`❌ Parsing error: ${err.message}. Please check template format.`, 'error');
    return;
  }

  if (rawPuzzles.length === 0) {
    showAlert('⚠️ No puzzle entries found in the uploaded file.', 'error');
    return;
  }

  // Validate with chess.js
  const validPuzzles = [];
  const errors = [];

  rawPuzzles.forEach((raw, idx) => {
    const rowNum = idx + 1;
    if (!raw.fen) {
      errors.push(`Row ${rowNum}: Missing FEN position.`);
      return;
    }

    try {
      const chess = new Chess(raw.fen);
      const moves = Array.isArray(raw.moves) ? raw.moves : (raw.moves || '').split(/[,\s]+/).filter(Boolean);

      if (moves.length === 0) {
        errors.push(`Row ${rowNum}: Missing solution moves.`);
        return;
      }

      // Test moves legality
      const testChess = new Chess(raw.fen);
      let firstMoveObj = null;
      for (const m of moves) {
        const res = testChess.move(m);
        if (!res) {
          throw new Error(`Illegal chess move '${m}' from position '${testChess.fen()}'`);
        }
        if (!firstMoveObj) firstMoveObj = res;
      }

      // Auto-construct 3 hints
      const fromSq = (raw.hint1 && raw.hint1.square) || (typeof raw.hint1 === 'string' ? raw.hint1 : firstMoveObj.from);
      const toSq = (raw.hint2 && raw.hint2.square) || (typeof raw.hint2 === 'string' ? raw.hint2 : firstMoveObj.to);

      const puzzleObj = {
        id: raw.id || `custom_${Date.now()}_${idx}`,
        title: raw.title || `Custom Puzzle #${rowNum}`,
        theme: raw.theme || selectedTheme,
        themeKey: selectedTheme,
        rating: raw.rating ? parseInt(raw.rating, 10) : selectedRating,
        tier: raw.tier || selectedTier, // Granted access tier from Dropdown 1
        goal: raw.goal || `Find the winning tactic!`,
        story: raw.story || `A custom challenge uploaded by your teacher/coach!`,
        fen: raw.fen,
        turn: chess.turn(),
        moves: moves,
        hint1: {
          square: fromSq,
          text: (raw.hint1 && raw.hint1.text) || `Focus on your piece on ${fromSq}!`
        },
        hint2: {
          square: toSq,
          text: (raw.hint2 && raw.hint2.text) || `Move to ${toSq} to unleash the tactic!`
        },
        magicMove: {
          from: fromSq,
          to: toSq
        }
      };

      validPuzzles.push(puzzleObj);
    } catch (e) {
      errors.push(`Row ${rowNum} ("${raw.title || 'Untitled'}"): ${e.message}`);
    }
  });

  if (validPuzzles.length === 0) {
    showAlert(`❌ Validation Failed:\n${errors.slice(0, 3).join('\n')}`, 'error');
    return;
  }

  // Merge with existing custom puzzles
  const existing = getCustomPuzzles();
  const merged = [...existing, ...validPuzzles];
  saveCustomPuzzles(merged);

  renderCustomPuzzlesTable();

  let msg = `🎉 Successfully imported ${validPuzzles.length} puzzle(s) under "${getTierName(selectedTier)}" access!`;
  if (errors.length > 0) {
    msg += ` (${errors.length} failed validation)`;
  }
  showAlert(msg, 'success');

  // Reset file input
  selectedFileContent = null;
  const btnImport = document.getElementById('btn-import-puzzles');
  if (btnImport) btnImport.disabled = true;
  const fileNameDisplay = document.getElementById('selected-file-name');
  if (fileNameDisplay) fileNameDisplay.textContent = 'Upload complete!';
}

// Simple CSV parser
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCSVLine(line);
    const item = {};
    headers.forEach((h, idx) => {
      item[h.trim()] = values[idx] !== undefined ? values[idx].trim() : '';
    });
    results.push(item);
  }
  return results;
}

function parseCSVLine(text) {
  const values = [];
  let inQuotes = false;
  let current = '';

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += c;
    }
  }
  values.push(current);
  return values;
}

// 3. Subscription Simulator
function initSubscriptionSimulator() {
  updateTierDisplay();

  const btnFree = document.getElementById('btn-set-free-trial');
  const btnMonthly = document.getElementById('btn-set-monthly');
  const btnYearly = document.getElementById('btn-set-yearly');
  const btnResetDays = document.getElementById('btn-reset-trial-days');

  if (btnFree) {
    btnFree.addEventListener('click', () => {
      subscriptionService.setTier(TIERS.FREE_TRIAL);
      updateTierDisplay();
      showAlert('🌱 Switched to 1-Week Free Trial tier (7 days remaining)!', 'success');
    });
  }

  if (btnMonthly) {
    btnMonthly.addEventListener('click', () => {
      subscriptionService.setTier(TIERS.MONTHLY);
      updateTierDisplay();
      showAlert('🥈 Switched to Monthly Subscription tier!', 'success');
    });
  }

  if (btnYearly) {
    btnYearly.addEventListener('click', () => {
      subscriptionService.setTier(TIERS.YEARLY);
      updateTierDisplay();
      showAlert('👑 Switched to Yearly Grandmaster Subscription tier!', 'success');
    });
  }

  if (btnResetDays) {
    btnResetDays.addEventListener('click', () => {
      subscriptionService.setTier(TIERS.FREE_TRIAL);
      updateTierDisplay();
      showAlert('🔄 Free trial timer reset to a full 7 days!', 'success');
    });
  }
}

function updateTierDisplay() {
  const display = document.getElementById('current-tier-display');
  if (!display) return;

  const currentTier = subscriptionService.getCurrentTier();
  const days = subscriptionService.getDaysRemaining();

  if (currentTier === TIERS.FREE_TRIAL) {
    display.className = 'tier-badge tier-free';
    display.textContent = `🌱 1-Week Free Trial (${days} days left)`;
  } else if (currentTier === TIERS.MONTHLY) {
    display.className = 'tier-badge tier-monthly';
    display.textContent = '🥈 Monthly Subscription (Active)';
  } else {
    display.className = 'tier-badge tier-yearly';
    display.textContent = '👑 Yearly Grandmaster (Unlimited)';
  }
}

// 4. Render Table
function renderCustomPuzzlesTable() {
  const tbody = document.getElementById('custom-puzzles-tbody');
  const countEl = document.getElementById('custom-count');
  const custom = getCustomPuzzles();

  if (countEl) countEl.textContent = custom.length;
  if (!tbody) return;

  if (custom.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">
          No custom puzzles uploaded yet. Download the template above to get started!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = custom.map((p, idx) => {
    let tierClass = 'tier-free';
    if (p.tier === 'monthly') tierClass = 'tier-monthly';
    if (p.tier === 'yearly') tierClass = 'tier-yearly';

    return `
      <tr>
        <td><strong>#${idx + 1}</strong></td>
        <td>${escapeHtml(p.title || 'Untitled')}</td>
        <td><code>${escapeHtml(p.theme || 'Tactics')}</code></td>
        <td>⭐ ${p.rating || 800}</td>
        <td><span class="tier-badge ${tierClass}">${getTierName(p.tier)}</span></td>
        <td><code>${(p.moves || []).join(' ')}</code></td>
        <td>
          <button class="game-btn btn-secondary btn-delete-puzzle" data-id="${p.id}" style="padding: 4px 8px; font-size: 0.78rem; color: #D32F2F;">
            🗑️ Delete
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Wire up delete buttons
  tbody.querySelectorAll('.btn-delete-puzzle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      deleteCustomPuzzle(id);
    });
  });

  // Clear all button
  const btnClear = document.getElementById('btn-clear-custom');
  if (btnClear) {
    btnClear.onclick = () => {
      if (confirm('Are you sure you want to delete all uploaded custom puzzles?')) {
        saveCustomPuzzles([]);
        renderCustomPuzzlesTable();
        showAlert('🗑️ All custom puzzles deleted.', 'success');
      }
    };
  }
}

function deleteCustomPuzzle(id) {
  const custom = getCustomPuzzles();
  const updated = custom.filter(p => p.id !== id);
  saveCustomPuzzles(updated);
  renderCustomPuzzlesTable();
  showAlert('🗑️ Custom puzzle removed.', 'success');
}

function getTierName(tier) {
  if (tier === 'monthly') return 'Monthly Pass';
  if (tier === 'yearly') return 'Yearly';
  return '1-Wk Free Trial';
}

function showAlert(message, type = 'success') {
  const alertBox = document.getElementById('admin-alert-box');
  if (!alertBox) return;

  alertBox.className = type === 'success' ? 'alert-banner alert-success' : 'alert-banner alert-error';
  alertBox.textContent = message;
  alertBox.style.display = 'block';

  setTimeout(() => {
    alertBox.style.display = 'none';
  }, 6000);
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
