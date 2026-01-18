import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Crown, Shield } from 'lucide-react';
import { SUBSCRIPTION_PLANS, formatPrice } from '../utils/subscriptionPlans';

const PlanUpgradeModal = ({ isOpen, onClose, currentPlan, onSelectPlan }) => {
  const [selectedBilling, setSelectedBilling] = useState('monthly'); // monthly or annual
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const plans = [SUBSCRIPTION_PLANS.basic, SUBSCRIPTION_PLANS.standard, SUBSCRIPTION_PLANS.premium];

  const getPlanIcon = (planId) => {
    switch (planId) {
      case 'basic':
        return Shield;
      case 'standard':
        return Zap;
      case 'premium':
        return Crown;
      default:
        return Shield;
    }
  };

  const handleSelectPlan = (planId) => {
    if (planId === currentPlan) {
      onClose();
      return;
    }
    setSelectedPlanId(planId);
  };

  const handleConfirmUpgrade = () => {
    if (selectedPlanId && onSelectPlan) {
      onSelectPlan(selectedPlanId, selectedBilling);
      onClose();
    }
  };

  const getPrice = (plan) => {
    if (plan.price === 0) return 'Miễn phí';
    if (selectedBilling === 'annual') {
      const annualPrice = Math.floor(plan.price * 12 * 0.8); // 20% discount
      return `${formatPrice(annualPrice)}/năm`;
    }
    return `${formatPrice(plan.price)}/tháng`;
  };

  const getSavings = (plan) => {
    if (plan.price === 0 || selectedBilling !== 'annual') return null;
    const savings = plan.price * 12 * 0.2; // 20% off
    return formatPrice(savings);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-5xl max-h-[90vh] bg-dark/95 rounded-xl border-2 border-primary/30 overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Fixed Top Right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-red-500/80 hover:bg-red-500 rounded-full transition-all shadow-lg hover:scale-110"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Header */}
          <div className="relative p-6 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent border-b border-white/10">
            <h2 className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-primary bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="text-white/60 text-sm">
              Upgrade anytime. Cancel anytime.
            </p>

            {/* Billing Toggle */}
            <div className="mt-4 inline-flex items-center gap-2 glass rounded-full p-1">
              <button
                onClick={() => setSelectedBilling('monthly')}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  selectedBilling === 'monthly'
                    ? 'bg-gradient-primary text-white shadow-neon'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedBilling('annual')}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  selectedBilling === 'annual'
                    ? 'bg-gradient-primary text-white shadow-neon'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Annual
                <span className="ml-1 text-[10px] bg-accent/80 px-1.5 py-0.5 rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const Icon = getPlanIcon(plan.id);
              const isCurrentPlan = plan.id === currentPlan;
              const isSelected = plan.id === selectedPlanId;
              const savings = getSavings(plan);

              return (
                <motion.div
                  key={plan.id}
                  className={`relative glass rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-2 border-primary shadow-neon scale-[1.02]'
                      : isCurrentPlan
                      ? 'border-2 border-white/30'
                      : 'border border-white/10 hover:border-primary/50'
                  }`}
                  onClick={() => handleSelectPlan(plan.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {/* Badges */}
                  {plan.recommended && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-primary rounded-full text-[10px] font-bold">
                      RECOMMENDED
                    </div>
                  )}
                  {plan.popular && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-accent to-secondary rounded-full text-[10px] font-bold">
                      MOST POPULAR
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white/20 rounded-full text-[10px] font-bold">
                      CURRENT PLAN
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`mb-3 inline-flex p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20`}>
                    <Icon className="w-6 h-6" style={{ color: plan.color }} />
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-xl font-bold mb-2" style={{ color: plan.color }}>
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-3">
                    <div className="text-2xl font-bold text-white">
                      {getPrice(plan)}
                    </div>
                    {savings && (
                      <div className="text-xs text-accent mt-0.5">
                        Save {savings}
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-4">
                    {plan.features.slice(0, 5).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-white/80">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Select Button */}
                  <button
                    className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${
                      isCurrentPlan
                        ? 'bg-white/10 text-white/50 cursor-not-allowed'
                        : isSelected
                        ? 'bg-gradient-primary text-white shadow-neon'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? 'Current Plan' : isSelected ? 'Selected' : 'Select Plan'}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Confirm Button */}
          {selectedPlanId && selectedPlanId !== currentPlan && (
            <motion.div
              className="px-6 pb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={handleConfirmUpgrade}
                className="w-full py-3 bg-gradient-primary hover:shadow-neon rounded-lg font-bold transition-all"
              >
                {currentPlan === 'basic' ? 'Upgrade Now' : 'Change Plan'}
              </button>
              <p className="text-center text-white/40 text-xs mt-2">
                No hidden fees • Cancel anytime
              </p>
            </motion.div>
          )}

          {/* Footer Info */}
          <div className="px-6 pb-4 text-center text-white/50 text-xs border-t border-white/5 pt-4">
            <div className="flex justify-center gap-4">
              <span>✓ 14-day guarantee</span>
              <span>✓ Cancel anytime</span>
              <span>✓ Secure payment</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PlanUpgradeModal;
