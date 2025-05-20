import { useEffect, useState } from 'react'
import api from '../lib/api'
import { useCluster } from '@/context/ClusterContext';
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid'

const WEEKDAYS = ['Every day', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function SnapshotPolicyForm() {
  const [enabled, setEnabled] = useState(true)
  const [locking, setLocking] = useState(false)
  const { clusterId } = useCluster();
    const [deletePeriodUnit, setDeletePeriodUnit] = useState<'days' | 'weeks' | 'months'>('days')
  const [formData, setFormData] = useState({
    policyName: '',
    applyToDirectory: '',
    scheduleType: '',
    timeZone: '',
    snapshotHour: '',
    snapshotMinute: '',
    days: [] as string[],
    deleteAfter: '',
  })

  useEffect(() => {
    if (formData.deleteAfter === '0') {
      setLocking(false);
    }
  }, [formData.deleteAfter]);

  useEffect(() => {
    api.get(`/clusters/${clusterId}/policy`)
      .then(res => {
        const policy = res.data.snapshotPolicy;
        // Parse time
        let hour = '07', min = '00';
        if (policy?.time) {
          [hour, min] = policy.time.split(':');
        }
        setFormData({
          policyName: policy?.policyName || '',
          applyToDirectory: policy?.applyToDirectory || '',
          scheduleType: policy?.frequency || 'daily',
          timeZone: policy?.timezone || 'America/Los_Angeles',
          snapshotHour: hour,
          snapshotMinute: min,
          days: policy?.days || [],
          deleteAfter: policy?.deleteAfterDays?.toString() || '99',
        })
        setEnabled(policy?.enabled ?? true)
        setLocking(policy?.locking ?? false)
      })
      .catch(err => console.error('Failed to fetch policy data', err))
  }, [clusterId])

  // Handle day checkbox change
  const handleDayChange = (day: string) => {
    setFormData((prev) => {
      if (day === "Every day") {
        // If selecting "Every day", clear others
        return { ...prev, days: prev.days.includes(day) ? [] : ["Every day"] };
      } else {
        // If selecting another day, remove "Every day" if present
        let newDays = prev.days.includes(day)
          ? prev.days.filter(d => d !== day)
          : [...prev.days.filter(d => d !== "Every day"), day];
        return { ...prev, days: newDays };
      }
    });
  };

  // Handle time change
  const handleTimeChange = (key: 'snapshotHour' | 'snapshotMinute', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  // Handle other input changes
  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Handle delete radio (for never/after N days)
  const handleDeleteChange = (type: 'never' | 'after') => {
    setFormData(prev => ({
      ...prev,
      deleteAfter: type === 'never'
        ? '0'
        : prev.deleteAfter === '0' || prev.deleteAfter === ''
          ? '99'
          : prev.deleteAfter
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    api.put(`/clusters/${clusterId}/policy`, {
      id: clusterId,
      snapshotPolicy: {
        enabled,
        locking,
        policyName: formData.policyName,
        applyToDirectory: formData.applyToDirectory,
        frequency: formData.scheduleType,
        time: `${formData.snapshotHour}:${formData.snapshotMinute}`,
        timezone: formData.timeZone,
        deleteAfterDays: parseInt(formData.deleteAfter, 10),
        days: formData.days,
      }
    })
      .then((resp) => {
        console.log('Policy saved successfully')
      })
      .catch(err => {
        console.error('Failed to save policy', err)
      })
  }

  const lockingDisabled = formData.deleteAfter === '0';

  return (
    <div className="policy-form-eui pl-[5px] pt-[3px] pr-[7px]">
      <form onSubmit={handleSubmit} className="space-y-10 px-[17px] pt-[5px] pb-10 bg-[#1b222b] text-white min-h-screen text-sm">
        <h2 className="text-xl mb-[18px] font-semibold pt-[12px] text-white">Edit Snapshot Policy</h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-[#c7cacc]">Policy Name</label>
            <input
              type="text"
              className="input-eui w-full max-w-md"
              value={formData.policyName}
              onChange={e => handleChange('policyName', e.target.value)}
            />
          </div>
          <div >
            <label className="block mb-1 rounded-r text-[#c7cacc]">Apply to Directory</label>
            <div className="flex max-w-md">
              <span className="flex items-center px-3 bg-[#23272f] text-gray-300 rounded-l border border-[#424b53] border-r-0 h-10">
                /
              </span>
              <input
                type="text"
                className="input-eui w-full h-10 border border-[#424b53] rounded-r focus:outline-none bg-[#23272f] text-white placeholder-gray-400"
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                value={formData.applyToDirectory}
                onChange={e => handleChange('applyToDirectory', e.target.value)}
                placeholder="Production/ProjectX"
              />
            </div>
          </div>
        </div>
        <label className="block mb-1 text-[#c7cacc]">Run Policy on the Following Schedule</label>
        <div className="bg-[#2f373f] p-6 rounded grid grid-cols-5 gap-4 items-start">
          <div className="col-span-1 text-right text-[#c7cacc] flex justify-end items-center h-full">Select Schedule Type</div>
          <div className="col-span-4">
            <select
              className="input-eui w-full max-w-xs"
              value={formData.scheduleType}
              onChange={e => handleChange('scheduleType', e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div className="col-span-1 text-right text-[#c7cacc] flex justify-end items-center h-full">Set to Time Zone</div>
          <div className="col-span-4">
            <div className="flex items-center gap-2 text-gray-300">
              <span>{formData.timeZone}</span>
              <span title="This sets the timezone used for scheduling.">
                <QuestionMarkCircleIcon className="w-4 h-4 text-blue-400" />
              </span>
            </div>
          </div>

          <div className="col-span-1 text-right text-[#c7cacc] flex justify-end items-center h-full">Take a Snapshot at</div>
          <div className="col-span-4 flex items-center gap-2">
            <input
              type="number"
              value={formData.snapshotHour}
              min="00"
              max="23"
              className="input-eui w-16"
              onChange={e => handleTimeChange('snapshotHour', e.target.value.padStart(2, '0'))}
            />
            <span className="text-white">:</span>
            <input
              type="number"
              value={formData.snapshotMinute}
              min="00"
              max="59"
              className="input-eui w-16"
              onChange={e => handleTimeChange('snapshotMinute', e.target.value.padStart(2, '0'))}
            />
          </div>

          <div className="col-span-1 text-right text-[#c7cacc] flex justify-end items-center h-full">On the Following Day(s)</div>
          <div className="col-span-4">
            <div className="flex flex-wrap gap-3 mt-2">
              {WEEKDAYS.map((day, idx) => {
                // "Every day" logic
                const isEveryDay = idx === 0;
                const everyDaySelected = formData.days.includes('Every day');
                return (
                  <label key={day} className="flex items-center gap-1 text-gray-300">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={formData.days.includes(day)}
                      onChange={() => handleDayChange(day)}
                      disabled={!isEveryDay && everyDaySelected}
                    />
                    <span>{day}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="col-span-1 text-right text-[#c7cacc] flex justify-end items-center h-full">Delete Each Snapshot</div>
          <div className="col-span-4 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="radio"
                name="delete"
                checked={formData.deleteAfter === '0'}
                onChange={() => handleDeleteChange('never')}
              />
              <span>Never</span>
            </label>
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="radio"
                name="delete"
                checked={formData.deleteAfter !== '0'}
                onChange={() => handleDeleteChange('after')}
              />
              <span>Automatically after</span>
              <input
                type="number"
                className={`input-eui w-16 ${formData.deleteAfter === '0' ? 'input-eui-disabled' : ''}`}
                value={formData.deleteAfter === '0' ? '99' : formData.deleteAfter}
                onChange={e => handleChange('deleteAfter', e.target.value)}
                disabled={formData.deleteAfter === '0'}
                min={1}
              />
              <select
                className={`input-eui ml-1 rounded px-2 py-1 ${formData.deleteAfter === '0' ? 'input-eui-disabled' : ''}`}
                value={deletePeriodUnit}
                onChange={e => setDeletePeriodUnit(e.target.value as 'days' | 'weeks' | 'months')}
                disabled={formData.deleteAfter === '0'}
                style={{ minWidth: '70px' }}
              >
                <option value="days">days</option>
                <option value="weeks">weeks</option>
                <option value="months">months</option>
              </select>          </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-white">Snapshot Locking</h3>
          <p className="text-[#a6aaae] text-[16px] mb-1">Locked snapshots cannot be deleted before the deletion schedule expires. For this feature to be available, snapshots must be set to automatically delete.</p>
          <label className="flex items-center gap-2 text-gray-300">
            <input className="accent-blue-500" type="checkbox" checked={!lockingDisabled && locking}
              disabled={lockingDisabled} onChange={() => setLocking(!locking)} />
            <span>Enable locked snapshots</span>
          </label>
        </div>

        <label className="flex items-center gap-2 text-gray-300">
          <input className="accent-blue-500" type="checkbox" checked={enabled} onChange={() => setEnabled(!enabled)} />
          <span>Enable policy</span>
        </label>

        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Save Policy
          </button>
          <button type="button" className="text-[#c7cacc] hover:underline">Cancel</button>
        </div>
      </form>
    </div>
  )
}