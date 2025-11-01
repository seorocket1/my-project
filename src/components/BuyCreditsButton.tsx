import React from 'react';
import { CreditCard } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your_stripe_public_key');

interface BuyCreditsButtonProps {
  userId: string;
}

export const BuyCreditsButton: React.FC<BuyCreditsButtonProps> = ({ userId }) => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    if (!stripe) return;

    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    const session = await response.json();

    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <button onClick={handleCheckout} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
      <CreditCard className="w-4 h-4 mr-2 inline" />
      Buy Credits
    </button>
  );
};
