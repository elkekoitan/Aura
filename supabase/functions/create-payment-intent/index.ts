import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, currency = 'usd', productIds, shippingAddress } = await req.json()

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) {
      throw new Error('Unauthorized')
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        user_id: user.id,
        product_ids: JSON.stringify(productIds),
      },
      shipping: shippingAddress ? {
        name: shippingAddress.name,
        address: shippingAddress.address,
      } : undefined,
    })

    // Create order record in database
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        stripe_payment_intent_id: paymentIntent.id,
        total_amount: amount,
        currency,
        status: 'pending',
        shipping_address: shippingAddress,
        billing_address: shippingAddress, // Same as shipping for now
      })
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    // Add order items
    if (productIds && productIds.length > 0) {
      const { data: products } = await supabaseClient
        .from('products')
        .select('*')
        .in('id', productIds)

      if (products) {
        const orderItems = products.map(product => ({
          order_id: order.id,
          product_id: product.id,
          quantity: 1, // Default quantity
          price: product.price,
        }))

        await supabaseClient
          .from('order_items')
          .insert(orderItems)
      }
    }

    return new Response(
      JSON.stringify({
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        order_id: order.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
