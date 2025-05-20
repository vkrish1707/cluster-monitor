import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import Dashboard from './Dashboard'
import '@testing-library/jest-dom'

// 1. Mock useCluster
jest.mock('@/context/ClusterContext', () => ({
  useCluster: () => ({ clusterId: 'test-cluster-id' }),
}))

// 2. Mock api.get
const mockApiGet = jest.fn()
jest.mock('@/lib/api', () => ({
  get: (...args: unknown[]) => mockApiGet(...args),
}))

const mockApiResponse = {
  iops: [
    { timestamp: '2024-05-20T00:00:00Z', read: 100, write: 80 },
    { timestamp: '2024-05-21T00:00:00Z', read: 110, write: 90 },
  ],
  throughput: [
    { read: 200, write: 150 },
    { read: 210, write: 160 },
  ],
  readIOP: 100,
  writeIOP: 80,
  readThroughput: 200,
  writeThroughput: 150,
};

describe('Dashboard', () => {
  beforeEach(() => {
    // Reset mocks and resolve the api.get with our data
    mockApiGet.mockReset()
    mockApiGet.mockResolvedValue({ data: mockApiResponse })
  })

  it('renders loading state and then shows the metrics', async () => {
    render(<Dashboard />)
    // Initial loading
    expect(screen.getByText(/loading metrics/i)).toBeInTheDocument()

    // Wait for the title (means data loaded)
    expect(await screen.findByText(/performance metrics/i)).toBeInTheDocument()

    // Check that values are rendered from our mock data
    expect(screen.getByText('100')).toBeInTheDocument() // readIOP
    expect(screen.getByText('80')).toBeInTheDocument()  // writeIOP
    expect(screen.getByText('200')).toBeInTheDocument() // readThroughput
    expect(screen.getByText('150')).toBeInTheDocument() // writeThroughput
  })

  it('shows error message if API fails', async () => {
    mockApiGet.mockRejectedValueOnce(new Error('Test error'))
    render(<Dashboard />)
    expect(screen.getByText(/loading metrics/i)).toBeInTheDocument()
    expect(await screen.findByText(/error/i)).toBeInTheDocument()
    expect(screen.getByText(/test error/i)).toBeInTheDocument()
  })
})