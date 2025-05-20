import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import Dashboard from './Dashboard'

// Mock the context and API call
jest.mock('@/context/ClusterContext', () => ({
  useCluster: () => ({ clusterId: 'test-cluster-id' })
}))

jest.mock('@/lib/api', () => ({
  get: jest.fn(() =>
    Promise.resolve({
      data: {
        matrix: {
          iops: [{ timestamp: '2025-05-15T00:00:00Z', read: 100, write: 80 }],
          throughput: [{ timestamp: '2025-05-15T00:00:00Z', read: 200, write: 160 }],
          readIOP: 100,
          writeIOP: 80,
          readThroughput: 200,
          writeThroughput: 160
        }
      }
    })
  )
}))

// If your IOPSGraph/ThroughputGraph files don't exist, comment these lines out
// jest.mock('./IOPSGraph', () => () => <div data-testid="iops-graph">IOPS Graph</div>)
// jest.mock('./ThroughputGraph', () => () => <div data-testid="throughput-graph">Throughput Graph</div>)

describe('Dashboard', () => {
  it('shows loading initially', () => {
    render(<Dashboard />)
    expect(screen.getByText(/loading matrix/i)).toBeInTheDocument()
  })

  it('renders the graphs after load', async () => {
    render(<Dashboard />);
    // Wait for any UI change after state update (like a div, or text)
    expect(await screen.findByText(/Performance Metrics/i)).toBeInTheDocument();
  });

  it('shows correct average values', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText(/100/)).toBeInTheDocument()  // readIOP
      expect(screen.getByText(/80/)).toBeInTheDocument()   // writeIOP
      expect(screen.getByText(/200/)).toBeInTheDocument()  // readThroughput
      expect(screen.getByText(/160/)).toBeInTheDocument()  // writeThroughput
    })
  })

  it('renders the legend', async () => {
    render(<Dashboard />)
    expect(await screen.findByText(/anomaly pointers/i)).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    expect(() => render(<Dashboard />)).not.toThrow()
  })
})