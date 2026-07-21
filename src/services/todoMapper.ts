import type { Todo, Step } from "~/types/todoType"

export function mapTodoFromApi(apiTodo: any): Todo {
    return {
        id: apiTodo.id,
        text: apiTodo.title,
        description: apiTodo.description,
        completed: apiTodo.is_completed,
        priority: apiTodo.priority,
        steps: (apiTodo.steps || []).map(mapStepFromApi),
        createdAt: apiTodo.created_at,
    }
}

export function mapStepFromApi(apiStep: any): Step {
    return {
        id: apiStep.id,
        text: apiStep.text,
        completed: apiStep.completed,
    }
}