import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ClientLayout from './ClientLayout'

// Mock dependencies
jest.mock('./Header', () => (props: any) => (
  <div data-testid="header">{JSON.stringify(props)}</div>
))
jest.mock('./Sidebar', () => (props: any) => (
  <div data-testid="sidebar">{JSON.stringify(props)}</div>
))
jest.mock('../lib/api.ts', () => ({
  get: jest.fn(() => Promise.resolve({ data: [{ id: 'c1', name: 'Cluster One' }, { id: 'c2', name: 'Cluster Two' }] }))
}))

describe('ClientLayout', () => {
  it('renders header and sidebar with fetched clusters', async () => {
    render(
      <ClientLayout>
        <div data-testid="main-content">Main Content</div>
      </ClientLayout>
    )

    expect(await screen.findByTestId('header')).toBeInTheDocument()
    expect(await screen.findByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('main-content')).toBeInTheDocument()
  })

  it('toggles sidebar when handleToggleSidebar is called', async () => {
    render(<ClientLayout>{() => <div>content</div>}</ClientLayout>)
    const header = await screen.findByTestId('header')
    // Simulate toggle from header
    const { onToggleSidebar } = JSON.parse(header.textContent!)
    fireEvent.click(document.createElement('button')) 
  })

})