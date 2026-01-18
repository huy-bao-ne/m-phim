// Subscription Plans Configuration

export const SUBSCRIPTION_PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 0,
    currency: 'VND',
    interval: 'month',
    features: [
      'Unlimited movies & TV shows',
      'Watch on 1 device',
      'HD (720p) quality',
      'Ad-supported content',
      'Mobile only streaming',
      'Standard support'
    ],
    limitations: [
      'No 4K streaming',
      'Single device only',
      'No downloads',
      'Ads included'
    ],
    maxDevices: 1,
    maxQuality: '720p',
    downloadLimit: 0,
    hasAds: true,
    color: '#6B7280' // Gray
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    price: 180000,
    currency: 'VND',
    interval: 'month',
    features: [
      'Everything in Basic',
      'Watch on 2 devices simultaneously',
      'Full HD (1080p) quality',
      'Ad-free experience',
      'Download on 5 devices',
      'Priority support',
      'Picture-in-Picture mode'
    ],
    limitations: [
      'No 4K streaming',
      'Limited to 2 simultaneous streams'
    ],
    maxDevices: 2,
    maxQuality: '1080p',
    downloadLimit: 5,
    hasAds: false,
    color: '#8B5CF6', // Purple
    recommended: true
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 260000,
    currency: 'VND',
    interval: 'month',
    features: [
      'Everything in Standard',
      'Watch on 4 devices simultaneously',
      'Ultra HD (4K) + HDR quality',
      'Spatial audio support',
      'Download on 10 devices',
      'Early access to new releases',
      '24/7 Premium support',
      'Exclusive content',
      'Watch party with friends'
    ],
    limitations: [],
    maxDevices: 4,
    maxQuality: '4K',
    downloadLimit: 10,
    hasAds: false,
    color: '#06B6D4', // Cyan
    popular: true
  }
};

// Get plan by ID
export const getPlanById = (planId) => {
  return SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.basic;
};

// Check if user can access feature
export const canAccessFeature = (userPlan, feature) => {
  const plan = getPlanById(userPlan);
  
  const featureMap = {
    '4k': ['premium'],
    'hd': ['standard', 'premium'],
    'downloads': ['standard', 'premium'],
    'multipleDevices': ['standard', 'premium'],
    'adFree': ['standard', 'premium'],
    'pip': ['standard', 'premium'],
    'watchParty': ['premium'],
    'earlyAccess': ['premium']
  };
  
  return featureMap[feature]?.includes(plan.id) || false;
};

// Format price
export const formatPrice = (price, currency = 'VND') => {
  if (price === 0) return 'Free';
  
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }
  
  return `${price} ${currency}`;
};

// Get all plans as array
export const getAllPlans = () => {
  return Object.values(SUBSCRIPTION_PLANS);
};

// Calculate savings
export const calculateAnnualSavings = (plan) => {
  if (plan.price === 0) return 0;
  const monthlyTotal = plan.price * 12;
  const annualPrice = plan.price * 12 * 0.8; // 20% discount
  return monthlyTotal - annualPrice;
};
