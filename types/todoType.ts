export type Priority = 'low' | 'medium' | 'high'

export type FilterValue = 'all' | 'active' | 'completed'

export type SortValue = 'date-desc' | 'date-asc' | 'priority-high'

export type PriorityFilterValue = 'all' | Priority

export interface Step {
  id: number
  text: string
  completed: boolean
}

export type StepDraft = Pick<Step, 'id' | 'text'>

export interface Todo {
  id: number
  text: string
  description: string | null
  completed: boolean
  priority: Priority
  steps: Step[]
  stepsUnordered: boolean
  createdAt: string
  groupName?: string | null
  orderedSteps: boolean
}

export interface StatusFilterOption {
  label: string
  value: FilterValue
}

export interface PriorityFilterOption {
  label: string
  value: PriorityFilterValue
}

export interface SortOption {
  label: string
  value: SortValue
  icon: string
}

export interface DialogForm {
  title: string
  description: string
  priority: Priority
}

export type DialogMode = 'add' | 'edit'