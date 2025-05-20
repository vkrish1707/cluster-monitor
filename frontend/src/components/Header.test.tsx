import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from './Header'
import '@testing-library/jest-dom'

describe('Header', () => {
  const clusters = [
    { id: '1', name: 'Cluster One' },
    { id: '2', name: 'Cluster Two' }
  ]
  const onToggleSidebar = jest.fn()
  const onClusterChange = jest.fn()

  it('renders the header title', () => {
    render(
      <Header
        onToggleSidebar={onToggleSidebar}
        isSidebarOpen={false}
        clusters={clusters}
        selectedClusterId={'1'}
        onClusterChange={onClusterChange}
      />
    )
    expect(screen.getByText('Cluster Monitor')).toBeInTheDocument()
  })

  it('renders all clusters in the dropdown', () => {
    render(
      <Header
        onToggleSidebar={onToggleSidebar}
        isSidebarOpen={false}
        clusters={clusters}
        selectedClusterId={'1'}
        onClusterChange={onClusterChange}
      />
    )
    expect(screen.getByText('Cluster One')).toBeInTheDocument()
    expect(screen.getByText('Cluster Two')).toBeInTheDocument()
  })

  it('calls onClusterChange when a new cluster is selected', () => {
    render(
      <Header
        onToggleSidebar={onToggleSidebar}
        isSidebarOpen={false}
        clusters={clusters}
        selectedClusterId={'1'}
        onClusterChange={onClusterChange}
      />
    )
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } })
    expect(onClusterChange).toHaveBeenCalledWith('2')
  })
})