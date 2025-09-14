import React, { useMemo, useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native'
import Constants from 'expo-constants'

const initialSlots = [
  { id: 'A1', status: 'available' },
  { id: 'A2', status: 'occupied' },
  { id: 'A3', status: 'available' },
  { id: 'A4', status: 'booked' },
  { id: 'B1', status: 'available' },
  { id: 'B2', status: 'occupied' },
  { id: 'B3', status: 'available' },
  { id: 'B4', status: 'available' },
  { id: 'C1', status: 'booked' },
  { id: 'C2', status: 'available' },
  { id: 'C3', status: 'occupied' },
  { id: 'C4', status: 'available' },
]

export default function Booking({ navigation }) {
  const [form, setForm] = useState({ fullName: '', email: '', licensePlate: '', startTime: '' })
  const [slots] = useState(initialSlots)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bufferSeconds, setBufferSeconds] = useState(60 * 60)
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    if (!selectedSlot) return
    setShowSummary(true)
    setBufferSeconds(60 * 60)
  }, [selectedSlot])

  useEffect(() => {
    if (!showSummary) return
    const t = setInterval(() => {
      setBufferSeconds((s) => {
        if (s <= 1) { clearInterval(t); setShowSummary(false); setSelectedSlot(null); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [showSummary])

  const timeDisplay = useMemo(() => {
    const m = Math.floor(bufferSeconds / 60)
    const s = bufferSeconds % 60
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(m)}:${pad(s)}`
  }, [bufferSeconds])

  const colorFor = (status) => {
    if (status === 'occupied') return 'bg-red-100 border-red-300'
    if (status === 'booked') return 'bg-green-100 border-green-300'
    return 'bg-gray-100 border-gray-300'
  }

  const canConfirm = selectedSlot && form.fullName && form.email && form.licensePlate && form.startTime

  const handleConfirm = () => {
    const params = new URLSearchParams({ ...form, lotId: selectedSlot })
    navigation.navigate('Payment', { query: params.toString() })
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-5 pt-6 pb-3 border-b border-gray-100"><Text className="text-xl font-semibold">Book your parking</Text></View>

      <View className="px-5 py-4">
        <View className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-gray-600 mb-1">Full name</Text>
              <TextInput className="border rounded-md px-3 py-2" value={form.fullName} onChangeText={(v)=>setForm({...form, fullName:v})} placeholder="Jane Doe" />
            </View>
          </View>
          <View className="flex-row gap-3 mt-3">
            <View className="flex-1">
              <Text className="text-gray-600 mb-1">Email</Text>
              <TextInput className="border rounded-md px-3 py-2" value={form.email} onChangeText={(v)=>setForm({...form, email:v})} placeholder="jane@example.com" keyboardType="email-address" />
            </View>
          </View>
          <View className="flex-row gap-3 mt-3">
            <View className="flex-1">
              <Text className="text-gray-600 mb-1">License plate</Text>
              <TextInput className="border rounded-md px-3 py-2" value={form.licensePlate} onChangeText={(v)=>setForm({...form, licensePlate:v})} placeholder="ABC-1234" />
            </View>
          </View>
          <View className="flex-row gap-3 mt-3">
            <View className="flex-1">
              <Text className="text-gray-600 mb-1">Start time</Text>
              <TextInput className="border rounded-md px-3 py-2" value={form.startTime} onChangeText={(v)=>setForm({...form, startTime:v})} placeholder="2025-09-11T10:00" />
            </View>
          </View>
        </View>

        <View className="bg-white rounded-2xl border border-gray-100 p-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold">Choose a slot</Text>
            <View className="flex-row gap-3">
              <View className="flex-row items-center gap-1"><View className="h-3 w-3 rounded-full bg-gray-400"/><Text className="text-gray-600 ml-1">Available</Text></View>
              <View className="flex-row items-center gap-1"><View className="h-3 w-3 rounded-full bg-green-500"/><Text className="text-gray-600 ml-1">Booked</Text></View>
              <View className="flex-row items-center gap-1"><View className="h-3 w-3 rounded-full bg-red-500"/><Text className="text-gray-600 ml-1">Occupied</Text></View>
            </View>
          </View>

          <FlatList
            data={slots}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={{ gap: 8 }}
            ItemSeparatorComponent={() => <View className="h-2" />}
            renderItem={({ item }) => (
              <TouchableOpacity
                disabled={item.status === 'occupied'}
                onPress={() => setSelectedSlot(item.id)}
                className={`flex-1 items-center justify-center rounded-xl px-4 py-4 border ${colorFor(item.status)} ${selectedSlot===item.id? 'border-blue-500': ''}`}
                style={{ minWidth: 0 }}
              >
                <Text className="font-medium">{item.id}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      <View className="absolute left-0 right-0 bottom-0 px-5 pb-6">
        {showSummary && selectedSlot && (
          <View className="bg-white rounded-2xl border border-gray-100 shadow p-4 mb-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="h-10 w-10 rounded-full bg-blue-600 items-center justify-center mr-3"><Text className="text-white font-semibold text-center">{selectedSlot}</Text></View>
                <View>
                  <Text className="font-semibold">Slot reserved for 1 hr buffer</Text>
                  <Text className="text-gray-600">Time left: {timeDisplay}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={()=>setShowSummary(false)} className="px-4 py-2 rounded-full border border-gray-200"><Text>Hide</Text></TouchableOpacity>
            </View>
          </View>
        )}
        <TouchableOpacity disabled={!canConfirm} onPress={handleConfirm} className={`rounded-full py-4 items-center ${canConfirm? 'bg-blue-600': 'bg-blue-400'}`}>
          <Text className="text-white font-semibold">Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}


