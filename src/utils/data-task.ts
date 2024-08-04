export type Status = 'todo' | 'in-progress' | 'done'
export type Task = {
  id: string
  content: string
  status: Status
}
export const statuses: Status[] = ['todo', 'in-progress', 'done']
