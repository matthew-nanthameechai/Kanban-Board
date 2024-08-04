import { Task } from "../utils/data-task"

function TaskCard({task}: {task:Task}) {
  return <li>{task.content}</li>
}

export default TaskCard
