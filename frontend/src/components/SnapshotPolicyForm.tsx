'use client'

import { useState } from 'react'

export default function SnapshotPolicyForm() {
  const [enabled, setEnabled] = useState(true)
  const [locking, setLocking] = useState(false)

  return (
    <form className="space-y-10 px-[10px] pt-[5px] pb-10 bg-[#1b222b] text-white min-h-screen text-sm">
      <h2 className="text-xl font-semibold text-white">Edit Snapshot Policy</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-400">Policy Name</label>
          <input type="text" className="w-full bg-[#2a2f36] text-white px-3 py-2 rounded" placeholder="ProjectX_Daily" />
        </div>
        <div>
          <label className="block mb-1 text-gray-400">Apply to Directory</label>
          <input type="text" className="w-full bg-[#2a2f36] text-white px-3 py-2 rounded" placeholder="/Production/ProjectX" />
        </div>
      </div>

      <div className="bg-[#2a2f36] p-6 rounded grid grid-cols-5 gap-4 items-start">
        <div className="col-span-1 text-right text-gray-400 flex justify-end items-center h-full">Select Schedule Type</div>
        <div className="col-span-4">
          <select className="bg-[#1b222b] text-white px-3 py-2 rounded w-full max-w-xs">
            <option>Daily or Weekly</option>
          </select>
        </div>

        <div className="col-span-1 text-right text-gray-400 flex justify-end items-center h-full">Set to Time Zone</div>
        <div className="col-span-4">
          <select className="bg-[#1b222b] text-white px-3 py-2 rounded w-full max-w-xs">
            <option>America/Los_Angeles</option>
            <option>America/New_York</option>
            <option>UTC</option>
          </select>
        </div>

        <div className="col-span-1 text-right text-gray-400 flex justify-end items-center h-full">Take a Snapshot at</div>
        <div className="col-span-4 flex items-center gap-2">
          <input type="number" value="07" className="w-16 bg-[#1b222b] text-white px-2 py-1 rounded" />
          <span className="text-white">:</span>
          <input type="number" value="00" className="w-16 bg-[#1b222b] text-white px-2 py-1 rounded" />
        </div>

        <div className="col-span-1 text-right text-gray-400 flex justify-end items-center h-full">On the Following Day(s)</div>
        <div className="col-span-4">
          <div className="flex flex-wrap gap-3 mt-2">
            {['Every day', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'].map(day => (
              <label key={day} className="flex items-center gap-1 text-gray-300">
                <input type="checkbox" className="accent-blue-500" />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="col-span-1 text-right text-gray-400 flex justify-end items-center h-full">Delete Each Snapshot</div>
        <div className="col-span-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-gray-300">
            <input type="radio" name="delete" />
            <span>Never</span>
          </label>
          <label className="flex items-center gap-2 text-gray-300">
            <input type="radio" name="delete" />
            <span>Automatically after</span>
            <input type="number" className="w-16 bg-[#1b222b] text-white px-2 py-1 rounded" value="99" />
            <span>day(s)</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-white">Snapshot Locking</h3>
        <p className="text-gray-500 text-xs mb-1">Locked snapshots cannot be deleted before the deletion schedule expires. For this feature to be available, snapshots must be set to automatically delete.</p>
        <label className="flex items-center gap-2 text-gray-300">
          <input type="checkbox" checked={locking} onChange={() => setLocking(!locking)} />
          <span>Enable locked snapshots</span>
        </label>
      </div>

      <label className="flex items-center gap-2 text-gray-300">
        <input type="checkbox" checked={enabled} onChange={() => setEnabled(!enabled)} />
        <span>Enable policy</span>
      </label>

      <div className="flex gap-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Policy
        </button>
        <button type="button" className="text-gray-400 hover:underline">Cancel</button>
      </div>
    </form>
  )
}