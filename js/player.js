// Chess Quest: Player Analytics, Learning Curve Chart & Diagnostics
// Visualizes rating trajectory over time and highlights strengths vs improvement areas

import { adaptiveEngine } from './adaptive-engine.js';
import { subscriptionService, TIERS } from './subscription-service.js';

document.addEventListener('DOMContentLoaded', () => {
  renderOverviewStats();
  renderSubscriptionCard();
  renderLearningCurveChart();
  renderStrengthsAndWeaknesses();
});

function renderOverviewStats() {
  const ratingEl = document.getElementById('stat-player-rating');
  const rankEl = document.getElementById('stat-player-rank');
  const rankIconEl = document.getElementById('stat-rank-icon');
  const streakEl = document.getElementById('stat-player-streak');
  const solvedEl = document.getElementById('stat-player-solved');
  const peakRatingEl = document.getElementById('stat-peak-rating');

  const rating = adaptiveEngine.getRating();
  const rank = adaptiveEngine.getRank();
  const stats = adaptiveEngine.stats;

  if (ratingEl) ratingEl.textContent = rating;
  if (rankEl) rankEl.textContent = rank.title;
  if (rankIconEl) rankIconEl.textContent = rank.icon;
  if (streakEl) streakEl.textContent = `${stats.currentStreak || 0} Win(s)`;
  if (solvedEl) solvedEl.textContent = `${stats.totalSolved || 0} Solved`;
  if (peakRatingEl) peakRatingEl.textContent = `${stats.peakRating || rating} ⭐`;
}

function renderSubscriptionCard() {
  const tierNameEl = document.getElementById('player-tier-name');
  const tierDaysEl = document.getElementById('player-tier-days');
  const card = document.getElementById('subscription-status-card');

  const tier = subscriptionService.getCurrentTier();
  const days = subscriptionService.getDaysRemaining();

  if (tier === TIERS.FREE_TRIAL) {
    if (tierNameEl) tierNameEl.textContent = '🌱 1-Week Free Trial (Active)';
    if (tierDaysEl) tierDaysEl.textContent = `${days} day(s) remaining in your free trial adventure`;
  } else if (tier === TIERS.MONTHLY) {
    if (tierNameEl) tierNameEl.textContent = '🥈 Monthly Adventure Pass';
    if (tierDaysEl) tierDaysEl.textContent = 'Unlimited access to intermediate & tactical themes';
    if (card) {
      card.style.background = 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)';
      card.style.borderColor = '#0288D1';
    }
  } else {
    if (tierNameEl) tierNameEl.textContent = '👑 Yearly Grandmaster Subscription';
    if (tierDaysEl) tierDaysEl.textContent = 'Full unlimited access to all tactics and custom coach puzzles';
    if (card) {
      card.style.background = 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)';
      card.style.borderColor = '#FF9800';
    }
  }
}

// Render SVG Learning Curve Chart
function renderLearningCurveChart() {
  const svg = document.getElementById('learning-curve-svg');
  if (!svg) return;

  const data = adaptiveEngine.getLearningCurveData();
  const width = 800;
  const height = 240;
  const padLeft = 55;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 35;

  const ratings = data.map(d => d.rating);
  const minRating = Math.max(500, Math.min(...ratings) - 40);
  const maxRating = Math.max(...ratings) + 50;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const getX = (idx) => padLeft + (data.length <= 1 ? chartW / 2 : (idx / (data.length - 1)) * chartW);
  const getY = (val) => padTop + chartH - ((val - minRating) / (maxRating - minRating)) * chartH;

  // Grid lines (horizontal)
  const steps = 4;
  let gridLines = '';
  for (let i = 0; i <= steps; i++) {
    const rVal = Math.round(minRating + (i / steps) * (maxRating - minRating));
    const y = getY(rVal);
    gridLines += `
      <line x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" stroke="#E2E8F0" stroke-dasharray="4,4" stroke-width="1.2" />
      <text x="${padLeft - 8}" y="${y + 4}" font-size="11" font-family="Quicksand, sans-serif" font-weight="700" fill="#94A3B8" text-anchor="end">${rVal}</text>
    `;
  }

  // Points & Path
  const points = data.map((d, idx) => ({
    x: getX(idx),
    y: getY(d.rating),
    rating: d.rating,
    label: d.label,
    outcome: d.outcome
  }));

  let pathD = '';
  points.forEach((p, idx) => {
    if (idx === 0) pathD += `M ${p.x} ${p.y}`;
    else pathD += ` L ${p.x} ${p.y}`;
  });

  // Area fill under curve
  let areaD = pathD;
  if (points.length > 1) {
    const lastX = points[points.length - 1].x;
    const firstX = points[0].x;
    const bottomY = padTop + chartH;
    areaD += ` L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }

  // Circles for each point
  const circles = points.map(p => `
    <circle cx="${p.x}" cy="${p.y}" r="5" fill="#8E24AA" stroke="#FFFFFF" stroke-width="2.5" />
    <text x="${p.x}" y="${p.y - 10}" font-size="10" font-family="Quicksand, sans-serif" font-weight="800" fill="#8E24AA" text-anchor="middle">${p.rating}</text>
  `).join('');

  svg.innerHTML = `
    <defs>
      <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#8E24AA" stop-opacity="0.28" />
        <stop offset="100%" stop-color="#8E24AA" stop-opacity="0.02" />
      </linearGradient>
    </defs>
    ${gridLines}
    ${points.length > 1 ? `<path d="${areaD}" fill="url(#curveGradient)" />` : ''}
    <path d="${pathD}" fill="none" stroke="#8E24AA" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
    ${circles}
    <text x="${width / 2}" y="${height - 8}" font-size="11" font-family="Quicksand, sans-serif" font-weight="700" fill="#94A3B8" text-anchor="middle">
      Puzzles Completed (Recent Journey)
    </text>
  `;
}

// Render Strengths and Improvement Areas
function renderStrengthsAndWeaknesses() {
  const strengthsBox = document.getElementById('strengths-container');
  const weaknessesBox = document.getElementById('weaknesses-container');

  const { strengths, weaknesses } = adaptiveEngine.getStrengthsAndWeaknesses();

  if (strengthsBox) {
    strengthsBox.innerHTML = strengths.map(item => `
      <div class="theme-progress-item">
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 0.95rem; color: var(--text-main);">${escapeHtml(item.name)}</strong>
            <span style="font-weight: 800; color: #2E7D32; font-size: 0.92rem;">${item.accuracy}% Accuracy</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill fill-green" style="width: ${item.accuracy}%;"></div>
          </div>
          <span style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px; display: inline-block;">
            ${item.solved} solved out of ${item.attempted} attempts (${item.avgHints} avg hints)
          </span>
        </div>
      </div>
    `).join('');
  }

  if (weaknessesBox) {
    weaknessesBox.innerHTML = weaknesses.map(item => `
      <div class="theme-progress-item">
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 0.95rem; color: var(--text-main);">${escapeHtml(item.name)}</strong>
            <span style="font-weight: 800; color: ${item.accuracy < 50 ? '#D32F2F' : '#E65100'}; font-size: 0.92rem;">
              ${item.accuracy}% Accuracy
            </span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill ${item.accuracy < 50 ? 'fill-red' : 'fill-orange'}" style="width: ${item.accuracy}%;"></div>
          </div>
          <span style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px; display: inline-block;">
            ${item.solved} solved (${item.attempted - item.solved} missed / hinted)
          </span>
        </div>
        <div>
          <button class="game-btn btn-primary btn-practice-weakness" data-theme="${item.key}" style="padding: 6px 12px; font-size: 0.82rem; white-space: nowrap;">
            🎯 Practice
          </button>
        </div>
      </div>
    `).join('');

    // Wire up "Practice" buttons
    weaknessesBox.querySelectorAll('.btn-practice-weakness').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const themeKey = e.currentTarget.getAttribute('data-theme');
        localStorage.setItem('chess_quest_focus_theme', themeKey);
        window.location.href = 'index.html';
      });
    });
  }
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
