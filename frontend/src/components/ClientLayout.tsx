'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import api from '@/lib/api'
import { ClusterContext } from '@/context/ClusterContext';

export default function ClientLayout({ children }: { children: React.ReactNode | ((props: { clusterId: string }) => React.ReactNode) }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [clusters, setClusters] = useState<any[]>([])
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null)

  // Fetch clusters on mount
  useEffect(() => {
    api.get('/clusters')
      .then(res => {
        setClusters(res.data)
        setSelectedClusterId(res.data?.[0]?.id || null)
      })
      .catch(() => {
        setClusters([])
        setSelectedClusterId(null)
      })
  }, [])

  useLayoutEffect(() => {
    setIsClient(true)
    const checkScreenSize = () => {
      const isSmall = window.innerWidth < 768
      setIsSmallScreen(isSmall)
      if (isSmall) setSidebarOpen(false)
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
  const handleClusterChange = (id: string) => setSelectedClusterId(id)

  return (
    <ClusterContext.Provider value={{ clusterId: selectedClusterId, setClusterId: handleClusterChange }}>
    <div className="flex flex-col min-h-screen overflow-hidden">
      <div className="h-[5vh] min-h-[48px] shrink-0  relative">
        <Header
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={isSidebarOpen}
          clusters={clusters}
          selectedClusterId={selectedClusterId}
          onClusterChange={handleClusterChange}
        />
      </div>
      <div className="flex flex-1 relative overflow-hidden min-h-0">
        {isSidebarOpen && (
          <div className={`bg-gray-900 ${isSmallScreen ? 'fixed inset-y-0 left-0 z-50' : 'md:relative md:block'}`}>
            <Sidebar
              cluster={clusters.find(c => c.id === selectedClusterId)}
            />
          </div>
        )}
        {isClient && isSidebarOpen && isSmallScreen && (
          <div
            className="fixed inset-0 z-40 bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="flex-1 h-[95vh] bg-[#12181e] text-white">
        {typeof children === 'function' ? children({ clusterId: selectedClusterId || '' }) : children}
        </main>
      </div>
    </div>
    </ClusterContext.Provider>
  )
}