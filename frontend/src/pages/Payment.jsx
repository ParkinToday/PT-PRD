import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

function PaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const query = useQuery()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handlePay = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError('')
    try {
      const booking = {
        fullName: query.get('fullName'),
        email: query.get('email'),
        licensePlate: query.get('licensePlate'),
        lotId: query.get('lotId'),
        startTime: query.get('startTime'),
        amount: 1000,
      }

      const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      })
      if (!res.ok) throw new Error('Failed to create payment intent')
      const { clientSecret } = await res.json()

      const cardElement = elements.getElement(CardElement)
      const confirmResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: booking.fullName, email: booking.email },
        },
      })

      if (confirmResult.error) {
        throw new Error(confirmResult.error.message || 'Payment failed')
      }

      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handlePay} className="grid gap-4">
      <div className="p-4 border rounded-md bg-white">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-800">Payment successful! Booking created.</div>
      ) : (
        <button disabled={!stripe || loading} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-60">
          {loading ? 'Processing...' : 'Pay and Book'}
        </button>
      )}
    </form>
  )
}

export default function Payment() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <NavBar />
      <main className="flex-1 w-full">
        <div className="max-w-sm mx-auto px-3 py-6">
          <h2 className="text-2xl font-semibold mb-6">Initial Payment</h2>
          <Elements stripe={stripePromise} options={{ appearance: { theme: 'stripe' } }}>
            <PaymentForm />
          </Elements>
        </div>
      </main>
    </div>
  )
}


