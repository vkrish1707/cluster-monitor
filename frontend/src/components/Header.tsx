'use client'

import { Bars3Icon } from '@heroicons/react/24/outline'

interface HeaderProps {
  onToggleSidebar: () => void
  isSidebarOpen: boolean
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <div className="w-full bg-white shadow-sm px-4 py-3 flex items-center justify-start gap-4 border-b z-100">
      <button
        onClick={onToggleSidebar}
        className="text-gray-600 focus:outline-none"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      <h1 className="text-xl font-bold text-cyan-700">Cluster Monitor</h1>
      <span className="text-sm text-gray-500 ml-2">(Cluster: default)</span>
    </div>
  )
}