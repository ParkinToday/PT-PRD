import express from 'express'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const router = express.Router()

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('Missing STRIPE_SECRET_KEY')
  return new Stripe(key)
}

function getSupabase() {
  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) throw new Error('Missing Supabase env vars')
  return createClient(url, serviceKey)
}

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { fullName, email, licensePlate, lotId, startTime, amount } = req.body || {}
    if (!fullName || !email || !licensePlate || !lotId || !startTime) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const stripe = getStripe()
    const supabase = getSupabase()

    const cents = typeof amount === 'number' && amount > 0 ? Math.floor(amount) : 1000

    const intent = await stripe.paymentIntents.create({
      amount: cents,
      currency: 'usd',
      capture_method: 'manual',
      automatic_payment_methods: { enabled: true },
      metadata: { licensePlate, lotId },
    })

    const { data: userRows, error: userErr } = await supabase
      .from('users')
      .upsert({ email, full_name: fullName }, { onConflict: 'email' })
      .select('*')
      .limit(1)
    if (userErr) throw userErr
    const user = userRows && userRows[0]

    const { data: bookingRows, error: bookingErr } = await supabase
      .from('bookings')
      .insert({
        user_id: user?.id || null,
        license_plate: licensePlate,
        lot_id: lotId,
        start_time: startTime,
        status: 'pending',
        initial_amount_cents: cents,
        stripe_payment_intent_id: intent.id,
      })
      .select('*')
      .limit(1)
    if (bookingErr) throw bookingErr

    const booking = bookingRows && bookingRows[0]

    await supabase.from('payments').insert({
      booking_id: booking.id,
      stripe_payment_intent_id: intent.id,
      amount_cents: cents,
      status: 'requires_confirmation',
      kind: 'initial',
    })

    return res.json({ clientSecret: intent.client_secret, bookingId: booking.id })
  } catch (err) {
    console.error(err)
    const message = typeof err?.message === 'string' ? err.message : 'Internal server error'
    return res.status(500).json({ error: message })
  }
})

export default router


