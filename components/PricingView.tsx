import React from 'react';
import { Check, Zap, Crown, Shield } from 'lucide-react';

export const PricingView: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: '/month',
      description: 'Perfect for trying out AdGenius.',
      features: [
        '5 Free Generations/mo',
        'Standard Resolution (1024x1024)',
        'Basic Templates',
        'Community Support',
        'AdGenius Watermark'
      ],
      cta: 'Start for Free',
      highlight: false,
      icon: Shield
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'For creators and small businesses.',
      features: [
        'Unlimited Generations',
        '4K Ultra-HD Resolution',
        'Magic Edit & Remove Object',
        'All Premium Templates',
        'Priority Processing',
        'No Watermark',
        'Commercial License'
      ],
      cta: 'Upgrade to Pro',
      highlight: true,
      icon: Zap
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For agencies and large teams.',
      features: [
        'Everything in Professional',
        'API Access',
        'Custom Brand Models',
        'Team Collaboration',
        'Dedicated Account Manager',
        'SLA Support'
      ],
      cta: 'Contact Sales',
      highlight: false,
      icon: Crown
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Simple, Transparent Pricing</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Choose the plan that best fits your creative needs. Upgrade or downgrade at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div 
            key={plan.name}
            className={`
              relative rounded-2xl p-8 flex flex-col transition-all duration-300
              ${plan.highlight 
                ? 'bg-indigo-600 text-white shadow-2xl scale-105 z-10' 
                : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-gray-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl'}
            `}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide shadow-lg">
                Most Popular
              </div>
            )}

            <div className={`p-3 rounded-xl w-fit mb-6 ${plan.highlight ? 'bg-white/10' : 'bg-indigo-50 dark:bg-indigo-900/30'}`}>
              <plan.icon className={`w-6 h-6 ${plan.highlight ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
            </div>

            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className={`text-sm mb-6 ${plan.highlight ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
              {plan.description}
            </p>

            <div className="flex items-baseline mb-8">
              <span className="text-4xl font-extrabold">{plan.price}</span>
              <span className={`text-sm ml-1 ${plan.highlight ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                {plan.period}
              </span>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className={`w-5 h-5 shrink-0 ${plan.highlight ? 'text-indigo-200' : 'text-green-500'}`} />
                  <span className={`text-sm ${plan.highlight ? 'text-indigo-50' : 'text-slate-600 dark:text-slate-300'}`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button className={`
              w-full py-3 px-6 rounded-xl font-semibold transition-colors
              ${plan.highlight 
                ? 'bg-white text-indigo-600 hover:bg-gray-50' 
                : 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700'}
            `}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};