import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (userId) {
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          'subscription.plan': 'pro',
          'subscription.status': 'active',
          'subscription.productLimit': Infinity,
        });
      } catch (error) {
        console.error('Error updating user subscription:', error);
        return NextResponse.json({ error: 'Error updating user subscription' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}