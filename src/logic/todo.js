class Task {
    constructor(title, dueDate, notes, desc, priority, id) {
        this.title = title;
        this.dueDate = dueDate;
        this.notes = notes;
        this.desc = desc;
        this.priority = priority;
        this.completed = false;
        this.id = id;
    }
}

export function createTodo(title, { dueDate, notes, desc, priority } = {}) {
    const id = crypto.randomUUID();
    const task = new Task(title, dueDate, notes, desc, priority, id);
    return task;
}

export function updateTodo(todo, { newTitle, newDueDate, newNotes, newDesc, newPriority, newStatus } = {}) {
    todo.title = newTitle || todo.title;
    todo.dueDate = newDueDate || todo.dueDate;
    todo.notes = newNotes || todo.notes;
    todo.desc = newDesc || todo.desc;
    todo.priority = newPriority || todo.priority;
    if (newStatus !== undefined) {
        todo.completed = newStatus;
    }
}

export function toggleTodo(todo) {
    todo.completed = !todo.completed;
}

