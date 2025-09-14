import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'

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

export default function Booking() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    licensePlate: '',
    startTime: '',
  })
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
    const timer = setInterval(() => {
      setBufferSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer)
          setShowSummary(false)
          setSelectedSlot(null)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [showSummary])

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const timeDisplay = useMemo(() => {
    const m = Math.floor(bufferSeconds / 60)
    const s = bufferSeconds % 60
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(m)}:${pad(s)}`
  }, [bufferSeconds])

  const selectSlot = (slot) => {
    if (slot.status !== 'available' && slot.status !== 'booked') return
    setSelectedSlot(slot.id)
  }

  const colorStyles = (slot) => {
    const base = 'rounded-lg px-4 py-3 w-full flex items-center justify-center font-medium border transition'
    if (slot.status === 'occupied') return `${base} bg-red-50 text-red-700 border-red-200 cursor-not-allowed`
    if (slot.status === 'booked') return `${base} bg-green-50 text-green-700 border-green-200`
    return `${base} bg-gray-50 text-gray-700 border-gray-200`
  }

  const handleConfirm = () => {
    if (!selectedSlot) return
    const payload = {
      fullName: form.fullName,
      email: form.email,
      licensePlate: form.licensePlate,
      lotId: selectedSlot,
      startTime: form.startTime,
    }
    const params = new URLSearchParams(payload)
    navigate(`/payment?${params.toString()}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <NavBar />
      <main className="flex-1 w-full">
        <div className="max-w-sm mx-auto px-3 py-6 grid gap-6">
          <div className="grid gap-6 items-start">
            <section className="grid gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-xl font-semibold">Book your parking</h2>
                <p className="text-gray-600 text-sm">Enter details and pick a slot below.</p>
                <div className="grid gap-4 mt-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Full name</label>
                    <input required value={form.fullName} onChange={update('fullName')} className="w-full border rounded-md px-3 py-2" placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input required type="email" value={form.email} onChange={update('email')} className="w-full border rounded-md px-3 py-2" placeholder="jane@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">License plate</label>
                    <input required value={form.licensePlate} onChange={update('licensePlate')} className="w-full border rounded-md px-3 py-2" placeholder="ABC-1234" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Start time</label>
                    <input required type="datetime-local" value={form.startTime} onChange={update('startTime')} className="w-full border rounded-md px-3 py-2" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Choose a slot</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-gray-400"></span> <span className="text-gray-600">Available</span></div>
                    <div className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-green-500"></span> <span className="text-gray-600">Booked</span></div>
                    <div className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-red-500"></span> <span className="text-gray-600">Occupied</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => selectSlot(slot)}
                      disabled={slot.status === 'occupied'}
                      className={
                        colorStyles(slot) +
                        (selectedSlot === slot.id ? ' ring-2 ring-blue-500' : '')
                      }
                    >
                      <span className="text-sm">{slot.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <aside>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-lg font-semibold">Summary</h3>
                <div className="mt-4 grid gap-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Selected slot</span><span className="font-medium">{selectedSlot || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Start time</span><span className="font-medium">{form.startTime || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Buffer</span><span className="font-medium">1 hr</span></div>
                </div>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedSlot || !form.fullName || !form.email || !form.licensePlate || !form.startTime}
                  className="mt-4 w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold disabled:opacity-60"
                >
                  Confirm Booking
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {showSummary && selectedSlot && (
        <div className="fixed inset-x-0 bottom-0 px-3 pb-4">
          <div className="max-w-sm mx-auto">
            <div className="bg-white border border-gray-100 shadow-lg rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">{selectedSlot}</div>
                <div>
                  <div className="font-semibold">Slot reserved for 1 hr buffer</div>
                  <div className="text-sm text-gray-600">Time left: {timeDisplay}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowSummary(false)} className="px-4 py-2 rounded-full border border-gray-200">Hide</button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedSlot || !form.fullName || !form.email || !form.licensePlate || !form.startTime}
                  className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold disabled:opacity-60"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


