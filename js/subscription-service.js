// Chess Quest: Subscription & Access Control Service
// Manages 1-Week Free Trial, Monthly, and Yearly subscription tiers

export const TIERS = {
  FREE_TRIAL: 'free_trial',
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
};

export const TIER_CONFIG = {
  [TIERS.FREE_TRIAL]: {
    name: '1-Week Free Trial',
    badge: '🌱 Free Trial',
    color: '#4CAF50',
    maxRating: 950,
    trialDays: 7,
    description: 'Access to beginner tactical puzzles (Rating up to 950) + Daily Lichess challenge'
  },
  [TIERS.MONTHLY]: {
    name: 'Monthly Subscription',
    badge: '🥈 Monthly Pass',
    color: '#2196F3',
    maxRating: 1350,
    trialDays: null,
    description: 'Access to intermediate puzzles (Rating up to 1350) + unlimited endless mode + full theme analytics'
  },
  [TIERS.YEARLY]: {
    name: 'Yearly Subscription',
    badge: '👑 Yearly Grandmaster',
    color: '#FF9800',
    maxRating: 2500,
    trialDays: null,
    description: 'Unlimited access to all difficulty tiers, custom admin puzzles, and master combinations'
  }
};

const STORAGE_KEY = 'chess_quest_subscription';

class SubscriptionService {
  constructor() {
    this.currentSubscription = this.loadSubscription();
  }

  loadSubscription() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed to parse subscription state, resetting to trial:', e);
        }
      }
    }

    // Default: Start a fresh 7-day 1-Week Free Trial
    const defaultSub = {
      tier: TIERS.FREE_TRIAL,
      startDate: new Date().toISOString(),
      expiresDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true
    };
    this.saveSubscription(defaultSub);
    return defaultSub;
  }

  saveSubscription(sub) {
    this.currentSubscription = sub;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sub));
    }
  }

  getCurrentTier() {
    return this.currentSubscription.tier || TIERS.FREE_TRIAL;
  }

  getDaysRemaining() {
    if (!this.currentSubscription.expiresDate) return 999;
    const diff = new Date(this.currentSubscription.expiresDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  }

  isTrialActive() {
    if (this.currentSubscription.tier !== TIERS.FREE_TRIAL) return true;
    return this.getDaysRemaining() > 0;
  }

  setTier(newTier) {
    if (!TIER_CONFIG[newTier]) return;
    let expiresDate = null;
    if (newTier === TIERS.FREE_TRIAL) {
      expiresDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (newTier === TIERS.MONTHLY) {
      expiresDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (newTier === TIERS.YEARLY) {
      expiresDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    }

    const updated = {
      tier: newTier,
      startDate: new Date().toISOString(),
      expiresDate: expiresDate,
      isActive: true
    };
    this.saveSubscription(updated);
    return updated;
  }

  isPuzzleAccessible(puzzle) {
    const userTier = this.getCurrentTier();
    const puzzleTier = puzzle.tier || TIERS.FREE_TRIAL;

    // Hierarchy: yearly > monthly > free_trial
    const tierWeights = {
      [TIERS.FREE_TRIAL]: 1,
      [TIERS.MONTHLY]: 2,
      [TIERS.YEARLY]: 3
    };

    const userWeight = tierWeights[userTier] || 1;
    const puzzleWeight = tierWeights[puzzleTier] || 1;

    // Check if free trial expired
    if (userTier === TIERS.FREE_TRIAL && !this.isTrialActive()) {
      return false;
    }

    // Check tier weight & max rating
    const config = TIER_CONFIG[userTier];
    if (puzzle.rating && puzzle.rating > config.maxRating && userWeight < puzzleWeight) {
      return false;
    }

    return userWeight >= puzzleWeight;
  }

  getTierInfo(tier = null) {
    const t = tier || this.getCurrentTier();
    return TIER_CONFIG[t] || TIER_CONFIG[TIERS.FREE_TRIAL];
  }
}

export const subscriptionService = new SubscriptionService();
