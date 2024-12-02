import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { debug } from '../../src/utils/debug';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    debug.error('Missing STRIPE_SECRET_KEY environment variable');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Stripe is not properly configured' })
    };
  }

  try {
    if (!event.body) {
      throw new Error('Missing request body');
    }

    const { priceId, userEmail, returnUrl } = JSON.parse(event.body);

    debug.info('Creating checkout session:', { priceId, userEmail });

    if (!priceId || !userEmail || !returnUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required parameters',
          missing: {
            priceId: !priceId,
            userEmail: !userEmail,
            returnUrl: !returnUrl
          }
        })
      };
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      success_url: `${returnUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}/pricing`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      metadata: {
        userEmail
      }
    });

    if (!session.url) {
      throw new Error('Failed to generate checkout URL');
    }

    debug.info('Checkout session created successfully:', { sessionId: session.id });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url })
    };
  } catch (error: any) {
    debug.error('Checkout session error:', error);
    
    let statusCode = 500;
    let message = 'Failed to create checkout session';

    if (error.type === 'StripeInvalidRequestError') {
      statusCode = 400;
      message = error.message;
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({ 
        error: message,
        details: error.message
      })
    };
  }
};