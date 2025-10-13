import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { userId, email, name } = await request.json();

    if (!userId || !email || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const merchantId = process.env.PAYHERE_MERCHANT_ID!;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET!;
    const orderId = `PRO-${userId}-${Date.now()}`;
    const amount = 500;
    const currency = 'LKR';

    const hash = crypto
      .createHash('md5')
      .update(
        `${merchantId}${orderId}${amount.toFixed(2)}${currency}${crypto
          .createHash('md5')
          .update(merchantSecret)
          .digest('hex')
          .toUpperCase()}`
      )
      .digest('hex')
      .toUpperCase();

    const checkoutData = {
      merchant_id: merchantId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?canceled=true`,
      notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payhere/webhook`,
      order_id: orderId,
      items: 'Koopi Pro Subscription',
      amount: amount.toFixed(2),
      currency,
      first_name: name,
      last_name: '',
      email,
      phone: '',
      address: '',
      city: '',
      country: 'Sri Lanka',
      hash,
    };

    return NextResponse.json(checkoutData);
  } catch (error) {
    console.error('Error creating PayHere checkout data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}