import React from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <NavBar />
      <main className="flex-1 w-full">
        <section className="max-w-sm mx-auto px-3 py-8 grid gap-6 items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-2xl font-bold leading-tight">Find parking fast</h1>
            <p className="mt-2 text-gray-600">Book a secure parking spot and pay seamlessly.</p>
            <div className="mt-5">
              <Link to="/booking" className="inline-block w-full text-center bg-blue-600 text-white px-5 py-3 rounded-full hover:bg-blue-700">Book a spot</Link>
            </div>
          </motion.div>
        </section>
      </main>
      <footer className="w-full max-w-sm mx-auto text-center text-xs text-gray-500 py-4">© {new Date().getFullYear()} ParkInToday</footer>
    </div>
  )
}


