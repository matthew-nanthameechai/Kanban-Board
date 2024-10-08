import { useEffect, useState } from 'react'
import type { Schema } from '../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import TaskCard from './components/TaskCard'
import { Status, statuses, Task } from './utils/data-task'

const client = generateClient<Schema>()

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const columns = statuses.map((status) => {
    const taskInColumn = tasks.filter((task) => task.status === status)
    return {
      status,
      tasks: taskInColumn,
    }
  })
  useEffect(() => {
    client.models.Task.observeQuery().subscribe({
      next: (data) => setTasks([...(data.items as Task[])]),
    })
  }, [])

  const createTask = (newTask: string) => {
    client.models.Task.create({
      content: newTask,
      status: 'todo',
    })
  }

  const updateTask = async (task: Task) => {
    const updatedTasks = tasks.map((t) => (t.id === task.id ? task : t))
    setTasks(updatedTasks)
    try {
      await client.models.Task.update({
        id: task.id,
        content: task.content,
        status: task.status,
      })
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const deleteTask = (id: string) => {
    client.models.Task.delete({ id })
  }

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    status: Status
  ) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('id')
    const task = tasks.find((task) => task.id === id)
    if (task) {
      await updateTask({ ...task, status })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTask === '') {
      return
    }
    createTask(newTask)
    setNewTask('')
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>{user?.signInDetails?.loginId}'s Kanban Board</h1>
          <button onClick={signOut}>Sign out</button>

          <div>
            <h1>Kanban</h1>
            <p>Write your task and click add or press enter.</p>
            <p>Click on the task card to edit task. Click off to update.</p>
            <p>To delete a task double click on the task.</p>
            <p>To move task card drag and drop.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              className="addTask-input"
              placeholder="Add New Task"
              onChange={(e) => setNewTask(e.target.value)}
              value={newTask}
            />
            <button className='add-button'>Add</button>
          </form>
          <div className="column-container">
            {columns.map((column) => (
              <div
                className="column"
                key={column.status}
                onDrop={(e) => handleDrop(e, column.status)}
                onDragOver={(e) => e.preventDefault()}
              >
                <h3>{column.status}</h3>
                {column.tasks.map((task, i) => (
                  <div key={i} onDoubleClick={() => deleteTask(task.id)}>
                    <TaskCard task={task} updateTask={updateTask} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </main>
      )}
    </Authenticator>
  )
}

export default App
