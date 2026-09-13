import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe webhook is not configured' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY.trim());
    const supabaseAdmin = getSupabaseAdmin();
    const event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET.trim(),
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { paymentId, pinId, userId } = session.metadata || {};
      if (!paymentId || !pinId || !userId || session.payment_status !== 'paid') {
        return NextResponse.json({ received: true });
      }

      const { data: payment } = await supabaseAdmin
        .from('payments')
        .select('status')
        .eq('id', paymentId)
        .eq('user_id', userId)
        .single();

      if (!payment || payment.status === 'paid') return NextResponse.json({ received: true });

      const { data: pin } = await supabaseAdmin
        .from('pins')
        .select('status')
        .eq('id', pinId)
        .eq('owner_id', userId)
        .single();

      if (!pin) return NextResponse.json({ error: 'Pin not found' }, { status: 404 });

      await supabaseAdmin
        .from('payments')
        .update({
          status: 'paid',
          method: 'stripe',
          stripe_session_id: session.id,
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentId);

      if (pin.status !== 'active') {
        await supabaseAdmin
          .from('pins')
          .update({ status: 'active', updated_at: new Date().toISOString() })
          .eq('id', pinId)
          .eq('owner_id', userId);

        const { data: user } = await supabaseAdmin
          .from('users')
          .select('active_pins')
          .eq('id', userId)
          .single();
        if (user) {
          await supabaseAdmin
            .from('users')
            .update({ active_pins: (user.active_pins || 0) + 1 })
            .eq('id', userId);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid webhook';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}