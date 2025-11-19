import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    const session = await getServerSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'paypal'],
        line_items: [
            {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: 'Premium Features',
                        description: 'FirstTry Challenge und mehr',
                    },
                    unit_amount: 499,
                    recurring: {
                        interval: 'month',
                    },
                },
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXTAUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/profile`,
        client_reference_id: session.user.id,
    });

    return NextResponse.json({ url: checkoutSession.url });
}