import { useEffect, useState } from 'react'
import type { Schema } from '../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import TaskCard from './components/TaskCard'
import { statuses, Task } from './utils/data-task'

const client = generateClient<Schema>()

function App() {
  const [tasks, setTasks] = useState<Task[]>([])

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

  function createTodo() {
    client.models.Task.create({
      content: window.prompt('Todo content'),
      status: 'todo',
    })
  }

  // function deleteTodo(id: string) {
  //   client.models.Todo.delete({ id })
  // }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>{user?.signInDetails?.loginId}'s todos</h1>
          <h1>Kanban</h1>
          <button onClick={createTodo}>+ new</button>
          <div className='column-container'>
            {columns.map((column) => (
              <ul>
                <h3>{column.status}</h3>
                {column.tasks.map((task) => (
                  <TaskCard task={task} />
                ))}
              </ul>
            ))}
          </div>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  )
}

export default App
