import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@10.17.0';

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY')!, {
  apiVersion: '2022-11-15',
});

serve(async (req) => {
  const { userId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: '100 Credits',
          },
          unit_amount: 1000, // $10.00
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${Deno.env.get('SITE_URL')}/payment-success`,
    cancel_url: `${Deno.env.get('SITE_URL')}/payment-cancelled`,
    metadata: {
      userId,
    },
  });

  return new Response(JSON.stringify({ id: session.id }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
