import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const { amount, email, description, userId, pinId, paymentId } = await request.json();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY is not configured.' },
        { status: 500 }
      );
    }

    if (!userId || !pinId || !paymentId) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const numericAmount = Number(amount ?? 10);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY.trim());
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email || undefined,
      line_items: [{
        price_data: {
          currency: 'thb',
          product_data: { name: description || 'Mudmy pin listing' },
          unit_amount: Math.round(numericAmount * 100),
        },
        quantity: 1,
      }],
      metadata: { paymentId, userId, pinId },
      success_url: `${origin}/dashboard?payment=success`,
      cancel_url: `${origin}/create-pin?payment=cancelled`,
    });

    return NextResponse.json({
      ok: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
