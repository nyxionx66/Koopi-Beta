import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const merchantId = formData.get('merchant_id') as string;
    const orderId = formData.get('order_id') as string;
    const payhereAmount = formData.get('payhere_amount') as string;
    const payhereCurrency = formData.get('payhere_currency') as string;
    const statusCode = formData.get('status_code') as string;
    const md5sig = formData.get('md5sig') as string;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET!;

    const localMd5sig = crypto
      .createHash('md5')
      .update(
        `${merchantId}${orderId}${payhereAmount}${payhereCurrency}${statusCode}${crypto
          .createHash('md5')
          .update(merchantSecret)
          .digest('hex')
          .toUpperCase()}`
      )
      .digest('hex')
      .toUpperCase();

    if (localMd5sig === md5sig && statusCode === '2') {
      const userId = orderId.split('-')[1];

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

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error('Error processing PayHere webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}