import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StripeProvider } from '@stripe/stripe-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import Home from './src/screens/Home'
import Booking from './src/screens/Booking'
import Payment from './src/screens/Payment'
import Constants from 'expo-constants'

const Stack = createNativeStackNavigator()

export default function App() {
  const stripeKey = Constants.expoConfig?.extra?.stripePublishableKey || ''
  return (
    <StripeProvider publishableKey={stripeKey}>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar style="dark" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Booking" component={Booking} />
            <Stack.Screen name="Payment" component={Payment} />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </StripeProvider>
  )
}


