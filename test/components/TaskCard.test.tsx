import { render, screen } from '@testing-library/react'
import TaskCard from '../../src/components/TaskCard'
import { it, expect, describe } from 'vitest'
import React from 'react'
import '@testing-library/jest-dom/vitest'

type Status = 'todo' | 'in-progress' | 'done'
const statuses: Status[] = ['todo', 'in-progress', 'done']
const mockTask = { id: '1', content: 'Do laundry', status: statuses[0] }
const mockUpdateTask = () => {}

describe('Task Card', () => {
  it('should ', () => {
    render(<TaskCard task={mockTask} updateTask={mockUpdateTask} />)

    const listItem = screen.getByRole("listitem")
    expect(listItem).toBeInTheDocument()
    expect(listItem).toHaveTextContent(/laundry/i)
  })
})
