class Project {
    constructor(projectName) {
        this.projectName = projectName;
        this.todos = [];
        this.id = crypto.randomUUID();
    }
}

export function createProject(name) {
    return new Project(name);
}

export function addTodoToProject(project,todo){
    project.todos.push(todo);
}

export function removeTodoFromProject(project,todoId){
    project.todos = project.todos.filter(t=>t.id!==todoId);
}





