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
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('id', task.id)
      }}
    >
      {isEditingTask ? (
        <input
          autoFocus
          onBlur={() => setIsEditingTask(false)}
          value={task.content}
          onChange={async (e) => await updateTask({ ...task, content: e.target.value })}
        />
      ) : (
        <li onClick={() => setIsEditingTask(true)}>{task.content}</li>
      )}
    </div>
  )
}

export default TaskCard
