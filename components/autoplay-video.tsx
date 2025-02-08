"use client"

import { useEffect, useRef } from "react"

export default function AutoplayVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Autoplay was prevented:", error)
      })
    }
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto my-16 text-center">
      <h2 className="text-5xl font-bold mb-4">Discover Our App</h2>
      <p className="text-gray-600 mb-6">
        Experience the power of seamless lost & found tracking. Watch the demo to see how it works!
      </p>

      <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          poster="/path/to/poster-image.jpg"
          aria-label="App demo video showcasing features"
        >
          <source src="/demo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  )
}
