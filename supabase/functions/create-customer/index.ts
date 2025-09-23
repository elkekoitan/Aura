/**
 * @module supabase/functions/create-customer
 * @description This Supabase edge function handles the creation of a new Stripe customer.
 * It receives user details, creates a corresponding customer in Stripe, and then updates
 * the user's profile in the Supabase database with the new Stripe customer ID.
 *
 * @requires deno.land/std/http/server
 * @requires @supabase/supabase-js
 * @requires stripe
 *
 * @param {Request} req - The incoming HTTP request.
 * @param {object} req.body - The request body.
 * @param {string} req.body.email - The user's email address.
 * @param {string} req.body.name - The user's full name.
 *
 * @returns {Response} A response object with the created customer's details or an error message.
 */
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
    const { email, name } = await req.json()

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

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        user_id: user.id,
      },
    })

    // Update user profile with Stripe customer ID
    const { error: updateError } = await supabaseClient
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        stripe_customer_id: customer.id,
        full_name: name,
      })

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({
        customer_id: customer.id,
        email: customer.email,
        name: customer.name,
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
