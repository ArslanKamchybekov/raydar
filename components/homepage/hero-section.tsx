'use client'

import { Search, Sparkles, UploadCloud } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AnimatedRadar from "./animate-radar"
import GuestReportModal from "./guest-report-modal"
import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"

export default function HeroSection() {
  const user = useUser()
  return (
    <section
      className="flex flex-col items-center justify-center leading-6 mt-12 px-4 sm:px-6"
      aria-label="Raydar Lost and Found Hero Section"
    >
      <div className="flex flex-col items-center justify-center w-full max-w-4xl py-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-fit rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30 px-4 py-1 mb-6"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-200">
            <Sparkles className="h-4 w-4" />
            <span>AI Powered Lost and Found</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-300 dark:to-white animate-gradient-x pb-2 text-center"
        >
          Find What You've Lost On Campus with Raydar
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-center text-gray-600 dark:text-gray-400 mt-4 max-w-2xl"
        >
          Raydar is the smart AI lost and found platform for UIC students. Upload images, get matches, and find your
          belongings faster.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mt-6"
        >
          {user ? (
            <Link href="/dashboard/upload-lost">
              <Button size="lg" className="flex items-center gap-2">
                <UploadCloud size={20} />
                Upload Lost Item
              </Button>
            </Link>
          ) : (
            <GuestReportModal />
          )}
          <Link href="/dashboard/feed">
            <Button size="lg" variant="outline" className="flex items-center gap-2">
              <Search size={20} />
              Search Database
            </Button>
          </Link>
        </motion.div>

        {/* Animated Radar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative w-full flex justify-center mt-8 overflow-hidden"
          >
          <AnimatedRadar />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" />
        </motion.div>
      </div>
    </section>
  )
}

