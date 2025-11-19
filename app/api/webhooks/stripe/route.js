import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/lib/mongodb';
import User from '@/models/user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    let event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id;

        await connectDB();
        await User.findByIdAndUpdate(userId, {
            hasPremium: true,
            premiumPurchaseDate: new Date(),
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
        });
    }

    if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object;

        await connectDB();
        await User.findOneAndUpdate(
            { stripeSubscriptionId: subscription.id },
            { hasPremium: false }
        );

        return NextResponse.json({ received: true });
    }
}