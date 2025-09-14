import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Alert, Button } from 'react-native'
import RazorpayCheckout from 'react-native-razorpay'
import { CardField, useStripe } from '@stripe/stripe-react-native'
import Constants from 'expo-constants'

export default function Payment({ route, navigation }) {
  const { confirmPayment } = useStripe()
  const [loading, setLoading] = useState(false)
  const paramsQuery = route.params?.query || ''
  const urlParams = new URLSearchParams(paramsQuery)

  const handlePay = async () => {
    try {
      setLoading(true)
      const booking = {
        fullName: urlParams.get('fullName'),
        email: urlParams.get('email'),
        licensePlate: urlParams.get('licensePlate'),
        lotId: urlParams.get('lotId'),
        startTime: urlParams.get('startTime'),
        amount: 1000,
      }
      const apiBase = Constants.expoConfig?.extra?.apiBaseUrl
      const res = await fetch(`${apiBase}/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      })
      if (!res.ok) throw new Error('Failed to create payment intent')
      const { clientSecret } = await res.json()

      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      })
      if (error) throw new Error(error.message)

      Alert.alert('Success', 'Payment confirmed!')
      navigation.popToTop()
    } catch (e) {
      Alert.alert('Error', e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleRazorpay = () => {
    try {
      const options = {
        description: 'Parking Slot Booking',
        image: 'https://yourlogo.com/logo.png',
        currency: 'INR',
        key: (Constants.expoConfig?.extra?.razorpayKeyId) || 'rzp_test_YourApiKeyHere',
        amount: 50000,
        name: 'Smart Parking',
        prefill: {
          email: urlParams.get('email') || 'customer@example.com',
          contact: '9999999999',
          name: urlParams.get('fullName') || 'Test User',
        },
        theme: { color: '#3399cc' },
      }
      RazorpayCheckout.open(options)
        .then((data) => {
          Alert.alert('Success', `Payment Id: ${data.razorpay_payment_id}`)
          navigation.popToTop()
        })
        .catch((error) => {
          Alert.alert('Error', `${error.code} | ${error.description}`)
        })
    } catch (e) {
      Alert.alert('Error', e.message || 'Something went wrong')
    }
  }

  const handlePayment = handleRazorpay

  return (
    <View className="flex-1 bg-white px-5 py-6">
      <Text className="text-xl font-semibold mb-4">Initial Payment</Text>
      <View className="bg-white rounded-2xl border border-gray-100 p-4">
        <CardField
          postalCodeEnabled={false}
          placeholders={{ number: '4242 4242 4242 4242' }}
          cardStyle={{ backgroundColor: '#FFFFFF' }}
          style={{ width: '100%', height: 50 }}
        />
      </View>
      <TouchableOpacity disabled={loading} onPress={handlePay} className={`mt-6 rounded-full py-4 items-center ${loading? 'bg-blue-400': 'bg-blue-600'}`}>
        <Text className="text-white font-semibold">{loading? 'Processing...': 'Pay with Card (Stripe)'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRazorpay} className="mt-3 rounded-full py-4 items-center bg-black">
        <Text className="text-white font-semibold">Pay with Razorpay</Text>
      </TouchableOpacity>

      <View className="mt-3">
        <Button title="Pay Now" onPress={handlePayment} color="#3399cc" />
      </View>
    </View>
  )
}


