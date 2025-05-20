'use client'

import React, { useEffect, useLayoutEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import api from '@/lib/api'
import { ClusterContext } from '@/context/ClusterContext';

// ClientLayout component provides a layout structure with a header, sidebar, and main content.
// It manages the state of the sidebar, screen size, clusters, and selected cluster.
export default function ClientLayout({ children }: { children: React.ReactNode | ((props: { clusterId: string }) => React.ReactNode) }) {
  // State to manage sidebar visibility
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  // State to determine if the component is rendered on the client side
  const [isClient, setIsClient] = useState(false)
  // State to track if the screen size is small
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  // State to store the list of clusters
  const [clusters, setClusters] = useState<any[]>([])
  // State to store the ID of the currently selected cluster
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
      // Check if the screen width is less than 768px (considered small)
      const isSmall = window.innerWidth < 768
      setIsSmallScreen(isSmall)
      // Close the sidebar if the screen is small
      if (isSmall) setSidebarOpen(false)
    }
    // Add event listener for window resize to check screen size

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 500) {
      // Prevent body scrolling when sidebar is open on very small screens
      document.body.style.overflow = 'hidden'
    } else {
      // Restore body scrolling
      document.body.style.overflow = ''
    }
    // Cleanup function to restore body overflow when the component unmounts or isSidebarOpen changes
    return () => { document.body.style.overflow = '' };
  }, [isSidebarOpen])

  // Handler to toggle the sidebar open/close state
  const handleToggleSidebar = () => setSidebarOpen(!isSidebarOpen)
  // Handler to change the selected cluster ID
  const handleClusterChange = (id: string) => setSelectedClusterId(id)
  return (
    // Provide the selected cluster ID and setter to the context
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
        {/* Render the sidebar if it's open */}
        {isSidebarOpen && (
          <div className={`bg-gray-900 ${isSmallScreen ? 'fixed inset-y-0 left-0 z-50' : 'md:relative md:block'}`}>
            {/* Pass the selected cluster data to the Sidebar component */}
            <Sidebar
              cluster={clusters.find(c => c.id === selectedClusterId)}
            />
          </div>
        )}
        {/* Render an overlay to close the sidebar on small screens when the sidebar is open */}
        {isClient && isSidebarOpen && isSmallScreen && (
          <div
            className="fixed inset-0 z-40 bg-opacity-50"
            // Close the sidebar when the overlay is clicked
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