import "./styles.css";
import { createTodo, updateTodo, toggleTodo } from "./logic/todo.js";
import { createProject, addTodoToProject, removeTodoFromProject } from "./logic/project.js";
import { state, setActiveProject, getActiveProject } from "./logic/state.js";
import { renderActiveProjectTodos, renderListOfProjects, updateTodayDate } from "./dom/render.js";
import { storageAvailable } from "./storage/check.js";
import { loadStateFromStorage, saveStateToStorage } from "./storage/storage.js";

//app start
const stored = loadStateFromStorage();
if (!stored) {
    const inbox = createProject("Inbox");
    addTodoToProject(inbox,createTodo("Test1",
        {dueDate:"23-Dec-2025", 
        notes:"I am a note",
        desc:"This is a test todo",
        priority:"high",}
    ));
    addTodoToProject(inbox,createTodo("Test2",
        {dueDate: "24-Dec-2025",
        notes: "These are some notes",
        desc: "This is a description",
        priority: "low",}
    ));
    addTodoToProject(inbox,createTodo("Test3",
        {dueDate: "25-Dec-2025",
        notes: "I made these notes",
        desc: "Merry Chrysler",}
    ));
    state.projects.push(inbox);
    state.projects.push(createProject("Fitness"));
    state.projects.push(createProject("Appointments"));
    state.activeProjectId = inbox.id;
    saveStateToStorage(state);
} else {
    state.projects = stored.projects;
    state.activeProjectId = stored.activeProjectId;
}

render();

function render(){

    updateTodayDate();

    renderListOfProjects(state.projects,
        handleProjectSelect,
         handleAddNewProject);

    renderActiveProjectTodos(
        getActiveProject(),
        handleAddNewTodo,
        handleDeleteTodo,
        handleEditTodo);
}

function handleProjectSelect(projectId){
    setActiveProject(projectId);
    saveStateToStorage(state);
    render();
}

function handleAddNewTodo({title,dueDate,desc,priority,notes,status}){
    let newTodo = createTodo(title,{dueDate,notes,desc,priority});
    newTodo.completed = status;
    let activeProject = getActiveProject();
    addTodoToProject(activeProject,newTodo);
    saveStateToStorage(state);
    render();
}

function handleDeleteTodo(todo){
    let activeProject = getActiveProject();
    removeTodoFromProject(activeProject,todo.id);
    saveStateToStorage(state);
    render();
}

function handleEditTodo(todo,{newTitle,newDueDate,newDesc,newPriority,newNotes,newStatus}){
    updateTodo(todo,{newTitle,newDueDate,newNotes,newDesc,newPriority,newStatus});
    saveStateToStorage(state);
    render();
}

function handleAddNewProject(name){
    let newProject = createProject(name);
    state.projects.push(newProject);
    setActiveProject(newProject.id);
    saveStateToStorage(state);
    render();
}





