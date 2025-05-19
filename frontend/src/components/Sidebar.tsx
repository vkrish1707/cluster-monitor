'use client'

import { usePathname } from 'next/navigation'
import { ChevronDownIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import clsx from 'clsx'

const navItems = [
  { label: 'Performance Metrics', href: '/' },
  { label: 'Edit Snapshot Policy', href: '/snapshot-policy' },
]

export default function Sidebar({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname()

  return (
    <aside className="h-screen w-64  bg-[#1b222b] text-white flex flex-col pl-6 pr-0 py-5 shadow-md">
      <div className="text-lg font-semibold text-cyan-300 mb-8 tracking-wide flex items-center gap-2">
      <img src="/cluster.svg" alt="Cluster Icon" className="h-6 w-6 mr-2" />
        [Cluster Name]
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={clsx(
              'relative block w-full px-4 py-2 text-[14px] leading-6 font-medium rounded-l transition-all duration-150',
              pathname === item.href
                ? 'bg-cyan-800/20 text-white before:absolute before:right-0 before:top-0 before:h-full before:w-1 before:bg-cyan-400'
                : 'text-gray-300 hover:bg-gray-700'
            )}
          >
            <li>{item.label}</li>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-700 text-xs text-gray-400 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-full p-0.5">
            <UserCircleIcon className="w-4 h-4 text-black" />
          </div>
          <span>AD\\user</span>
        </div>
        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
      </div>
    </aside>
  )
}