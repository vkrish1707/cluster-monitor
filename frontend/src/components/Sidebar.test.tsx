import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Sidebar from './Sidebar'
import '@testing-library/jest-dom'

describe('Sidebar', () => {
  const cluster = { id: '1', name: 'Test Cluster' }
  const noCluster = null
  const onItemClick = jest.fn()

  it('renders the cluster name', () => {
    render(<Sidebar cluster={cluster} onItemClick={onItemClick} />)
    expect(screen.getByText('Test Cluster')).toBeInTheDocument()
  })

  it('renders fallback if no cluster is selected', () => {
    render(<Sidebar cluster={noCluster} onItemClick={onItemClick} />)
    expect(screen.getByText('No cluster selected')).toBeInTheDocument()
  })

  it('renders all navigation items', () => {
    render(<Sidebar cluster={cluster} onItemClick={onItemClick} />)
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument()
    expect(screen.getByText('Edit Snapshot Policy')).toBeInTheDocument()
  })

  it('calls onItemClick when a nav item is clicked', () => {
    render(<Sidebar cluster={cluster} onItemClick={onItemClick} />)
    // Find all nav items
    const navItems = screen.getAllByRole('link')
    fireEvent.click(navItems[0])
    expect(onItemClick).toHaveBeenCalled()
  })

  it('displays the user icon and username', () => {
    render(<Sidebar cluster={cluster} onItemClick={onItemClick} />)
    expect(screen.getByText('AD\\user')).toBeInTheDocument()
  })
})