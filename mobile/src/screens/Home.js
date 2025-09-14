import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export default function Home({ navigation }) {
  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <Text className="text-3xl font-bold">ParkInToday</Text>
      <Text className="text-gray-600 mt-2">Find parking fast and pay seamlessly.</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Booking')} className="mt-8 bg-blue-600 px-6 py-3 rounded-full">
        <Text className="text-white font-semibold">Book a spot</Text>
      </TouchableOpacity>
    </View>
  )
}


