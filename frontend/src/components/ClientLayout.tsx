'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useLayoutEffect(() => {
    setIsClient(true)
    const checkScreenSize = () => {
      const isSmall = window.innerWidth < 768
      setIsSmallScreen(isSmall)
      if (isSmall) {
        setSidebarOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 500) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen])

  const handleToggleSidebar = () => setSidebarOpen(!isSidebarOpen)

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <div className="h-[5vh] min-h-[48px] shrink-0  relative">
        <Header onToggleSidebar={handleToggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>

      <div className="flex flex-1 relative overflow-hidden min-h-0">

        {isSidebarOpen && (
          <div className={`bg-gray-900 w-64 ${isSmallScreen ? 'fixed inset-y-0 left-0 z-50' : 'md:relative md:block'
            }`}>
            <Sidebar />
          </div>
        )}
        {/* Sidebar overlay for small screens */}
        {isClient && isSidebarOpen && isSmallScreen && (
          <div
            className="fixed inset-0 z-40 bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 bg-[#12181e] text-white">
          {children}
        </main>
      </div>
    </div>
  )
}