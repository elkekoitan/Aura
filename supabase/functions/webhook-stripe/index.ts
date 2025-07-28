import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()
  
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Update order status to processing
        await supabaseClient
          .from('orders')
          .update({ 
            status: 'processing',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        console.log('Payment succeeded:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Update order status to cancelled
        await supabaseClient
          .from('orders')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        console.log('Payment failed:', paymentIntent.id)
        break
      }

      case 'customer.created': {
        const customer = event.data.object as Stripe.Customer
        console.log('Customer created:', customer.id)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('Invoice payment succeeded:', invoice.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('Invoice payment failed:', invoice.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response('Webhook handled successfully', { status: 200 })
  } catch (error) {
    console.error('Error handling webhook:', error)
    return new Response('Webhook handler failed', { status: 500 })
  }
})
