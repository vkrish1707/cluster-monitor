import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SnapshotPolicyForm from './SnapshotPolicyForm' // Ensure this is the default export of the component
import '@testing-library/jest-dom'
import { useCluster } from '@/context/ClusterContext'
import api from '../lib/api'

// MOCK CONTEXT & API
jest.mock('@/context/ClusterContext')
jest.mock('../lib/api')

const mockClusterId = 'test-cluster'
const mockPolicy = {
  policyName: 'Nightly Backup',
  applyToDirectory: 'prod/data',
  frequency: 'weekly',
  time: '07:15',
  timezone: 'America/New_York',
  days: ['Mon', 'Wed', 'Fri'],
  enabled: true,
  locking: true,
  deleteAfterDays: 14,
}

beforeEach(() => {
  (useCluster as jest.Mock).mockReturnValue({ clusterId: mockClusterId })
  ;(api.get as jest.Mock).mockResolvedValue({
    data: { snapshotPolicy: mockPolicy }
  })
  ;(api.put as jest.Mock).mockResolvedValue({ data: { success: true } })
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SnapshotPolicyForm', () => {
  it('renders form title', async () => {
    render(<SnapshotPolicyForm />)
    expect(await screen.findByText(/Edit Snapshot Policy/i)).toBeInTheDocument()
  })

  it('loads initial values from API', async () => {
    render(<SnapshotPolicyForm />)
    expect(await screen.findByDisplayValue('Nightly Backup')).toBeInTheDocument()
    expect(screen.getByDisplayValue('prod/data')).toBeInTheDocument()
    expect(screen.getByDisplayValue('07')).toBeInTheDocument()
    expect(screen.getByDisplayValue('15')).toBeInTheDocument()
  })

  it('renders all weekdays as checkboxes', async () => {
    render(<SnapshotPolicyForm />)
    for (const day of ['Every day', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) {
      expect(await screen.findByText(day)).toBeInTheDocument()
    }
  })

  it('handles "Every day" checkbox logic', async () => {
    render(<SnapshotPolicyForm />)
    const everyDay = await screen.findByLabelText('Every day')
    fireEvent.click(everyDay)
    expect(screen.getByLabelText('Mon')).toBeDisabled()
    expect(everyDay).toBeChecked()
    fireEvent.click(everyDay)
    expect(everyDay).not.toBeChecked()
    expect(screen.getByLabelText('Mon')).not.toBeDisabled()
  })

  it('calls API on save', async () => {
    render(<SnapshotPolicyForm />)
    const saveBtn = await screen.findByRole('button', { name: /save policy/i })
    fireEvent.click(saveBtn)
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(
        `/clusters/${mockClusterId}/policy`,
        expect.objectContaining({ snapshotPolicy: expect.any(Object) })
      )
    })
  })

  it('changes policy name', async () => {
    render(<SnapshotPolicyForm />)
    const input = await screen.findByLabelText(/Policy Name/i)
    fireEvent.change(input, { target: { value: 'Weekly Backup' } })
    expect((input as HTMLInputElement).value).toBe('Weekly Backup')
  })


  it('changes directory', async () => {
    render(<SnapshotPolicyForm />)
    const input = await screen.findByPlaceholderText('Production/ProjectX')
    fireEvent.change(input, { target: { value: 'prod/test' } })
    expect((input as HTMLInputElement).value).toBe('prod/test')
  })


  it('changes time', async () => {
    render(<SnapshotPolicyForm />)
    const hourInput = await screen.findByDisplayValue('07')
    fireEvent.change(hourInput, { target: { value: '12' } })
    expect((hourInput as HTMLInputElement).value).toBe('12')
    const minInput = await screen.findByDisplayValue('15')
    fireEvent.change(minInput, { target: { value: '30' } })
    expect((minInput as HTMLInputElement).value).toBe('30')
  })

  it('toggles enabled policy', async () => {
    render(<SnapshotPolicyForm />)
    const enabledCheckbox = await screen.findByLabelText(/Enable policy/i)
    fireEvent.click(enabledCheckbox)
    expect(enabledCheckbox).not.toBeChecked()
    fireEvent.click(enabledCheckbox)
    expect(enabledCheckbox).toBeChecked()
  })


  it('locking is disabled if deleteAfter is "Never"', async () => {
    render(<SnapshotPolicyForm />)
    const neverRadio = await screen.findByLabelText('Never')
    fireEvent.click(neverRadio)
    const lockingCheckbox = await screen.findByLabelText(/Enable locked snapshots/i)
    expect(lockingCheckbox).toBeDisabled()
  })


  it('does not allow input in deleteAfter when "Never" is selected', async () => {
    render(<SnapshotPolicyForm />)
    const neverRadio = await screen.findByLabelText('Never')
    fireEvent.click(neverRadio)
    const deleteAfterInput = await screen.getByDisplayValue('99')
    expect(deleteAfterInput).toBeDisabled()
  })

  it('shows all help tooltips/icons', async () => {
    render(<SnapshotPolicyForm />)
    expect(await screen.findByTitle(/This sets the timezone/i)).toBeInTheDocument()
  })

  it('shows Cancel button and responds to click', async () => {
    render(<SnapshotPolicyForm />)
    const cancelBtn = await screen.findByRole('button', { name: /cancel/i })
    fireEvent.click(cancelBtn)
    expect(cancelBtn).toBeInTheDocument()
  })

  it('resets form to initial values on cancel', async () => {
    render(<SnapshotPolicyForm />)
    const input = await screen.findByLabelText(/Policy Name/i)
    fireEvent.change(input, { target: { value: 'Something Else' } })
    const cancelBtn = await screen.findByRole('button', { name: /cancel/i })
    fireEvent.click(cancelBtn)
    expect(await screen.findByDisplayValue('Nightly Backup')).toBeInTheDocument()
  })

})