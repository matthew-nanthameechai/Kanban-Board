import { useEffect, useState } from 'react'
import type { Schema } from '../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import TaskCard from './components/TaskCard'
import { Task } from './utils/data-task'

const client = generateClient<Schema>()

function App() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    client.models.Task.observeQuery().subscribe({
      next: (data) => setTasks([...data.items as Task[]]),
    })
  }, [])

  function createTodo() {
    client.models.Task.create({ content: window.prompt('Todo content') })
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
          <ul>
            <h3>Todo</h3>
            {tasks.map((task) => (
              <TaskCard task={task} />
            ))}
          </ul>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  )
}

export default App
