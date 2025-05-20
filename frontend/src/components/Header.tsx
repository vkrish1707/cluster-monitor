'use client'

import { Bars3Icon } from '@heroicons/react/24/outline'

interface HeaderProps {
  onToggleSidebar: () => void
  isSidebarOpen: boolean
  clusters: any[]
  selectedClusterId: string | null
  onClusterChange: (id: string) => void
}

export default function Header({ onToggleSidebar, isSidebarOpen, clusters, selectedClusterId, onClusterChange }: HeaderProps) {
  return (
    <div className="w-full bg-[#243142] shadow-sm px-4 py-3 flex items-center justify-start gap-4 border-b z-100">
      <button
        onClick={onToggleSidebar}
        className="text-white-600 focus:outline-none"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
      <h1 className="text-xl font-bold text-white-700">Cluster Monitor</h1>
      <span className="text-sm text-gray-500 ml-2">
        {/* Cluster selection dropdown */}
        <select
          className="bg-gray-100 px-2 py-1 rounded ml-2"
          value={selectedClusterId || ''}
          onChange={e => onClusterChange(e.target.value)}
        >
          {clusters.map(cluster => (
            <option key={cluster.id} value={cluster.id}>{cluster.name || cluster.id}</option>
          ))}
        </select>
      </span>
    </div>
  )
}