import { Task } from '../utils/data-task'
import { useState } from 'react'

function TaskCard({
  task,
  updateTask,
}: {
  task: Task
  updateTask: (task: Task) => void
}) {
  const [isEditingTask, setIsEditingTask] = useState(false)

  return (
    <div>
      {isEditingTask ? (
        <input
          autoFocus
          onBlur={() => setIsEditingTask(false)}
          value={task.content}
          onChange={(e) => updateTask({ ...task, content: e.target.value })}
        />
      ) : (
        <li onClick={() => setIsEditingTask(true)}>{task.content}</li>
      )}
    </div>
  )
}

export default TaskCard
