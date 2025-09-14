import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function NavBar() {
  const { pathname } = useLocation()
  const isActive = (path) => pathname === path
  return (
    <nav className="w-full bg-white/80 backdrop-blur sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-sm mx-auto px-3 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">ParkInToday</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className={isActive('/') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}>Home</Link>
          <Link to="/booking" className={isActive('/booking') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}>Booking</Link>
        </div>
      </div>
    </nav>
  )
}


