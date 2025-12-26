import "./styles.css";
import { createTodo, updateTodo, toggleTodo } from "./logic/todo.js";
import { createProject, addTodoToProject, removeTodoFromProject } from "./logic/project.js";
import { state, setActiveProject, getActiveProject } from "./logic/state.js";
import { renderActiveProjectTodos, renderListOfProjects, updateTodayDate } from "./dom/render.js";
import { storageAvailable } from "./storage/check.js";
import { loadStateFromStorage, saveStateToStorage } from "./storage/storage.js";
import { getTodayView, getWeekView, getAllView } from "./logic/view.js"

//app start
const stored = loadStateFromStorage();
if (!stored) {
    const inbox = createProject("Inbox");
    addTodoToProject(inbox, createTodo("Test1",
        {
            dueDate: "2025-12-23",
            notes: "I am a note",
            desc: "This is a test todo",
            priority: "high",
        }
    ));
    addTodoToProject(inbox, createTodo("Test2",
        {
            dueDate: "2025-12-24",
            notes: "These are some notes",
            desc: "This is a description",
            priority: "low",
        }
    ));
    addTodoToProject(inbox, createTodo("Test3",
        {
            dueDate: "2025-12-25",
            notes: "I made these notes",
            desc: "Merry Chrysler",
        }
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

function render() {

    updateTodayDate();

    const today = getTodayView(state);
    const week = getWeekView(state);
    const all = getAllView(state);

    renderListOfProjects(state.projects,
        handleProjectSelect,
        handleAddNewProject,
        handleViewSelect,
        {
            todayCnt:today.todos.length, 
            weekCnt:week.todos.length, 
            allCnt:all.todos.length}
    );
    const isView = Boolean(state.activeView);
    if (isView) {
        switch (state.activeView) {
            case "view-today":
                renderActiveProjectTodos(getTodayView(state),
                    handleAddNewTodo,
                    handleDeleteTodo,
                    handleEditTodo,
                    isView);
                break;
            case "view-week":
                renderActiveProjectTodos(getWeekView(state),
                    handleAddNewTodo,
                    handleDeleteTodo,
                    handleEditTodo,
                    isView);
                break;
            case "view-all":
                renderActiveProjectTodos(getAllView(state),
                    handleAddNewTodo,
                    handleDeleteTodo,
                    handleEditTodo,
                    isView);
                break;
        }
    } else {
        renderActiveProjectTodos(
            getActiveProject(),
            handleAddNewTodo,
            handleDeleteTodo,
            handleEditTodo,
            isView
        );
    }
}

function handleProjectSelect(projectId) {
    setActiveProject(projectId);
    state.activeView=null;
    saveStateToStorage(state);
    render();
}

function handleViewSelect(weekKey) {
    state.activeView = weekKey;
    saveStateToStorage(state);
    render();
}

function handleAddNewTodo({ title, dueDate, desc, priority, notes, status }) {
    let newTodo = createTodo(title, { dueDate, notes, desc, priority });
    newTodo.completed = status;
    let activeProject = getActiveProject();
    addTodoToProject(activeProject, newTodo);
    saveStateToStorage(state);
    render();
}

function handleDeleteTodo(todo) {
    const owningProject = state.projects.find(project =>
        project.todos.some(t => t.id === todo.id)
    );

    if (!owningProject) return;

    removeTodoFromProject(owningProject, todo.id);
    saveStateToStorage(state);
    render();
}

function handleEditTodo(todo, { newTitle, newDueDate, newDesc, newPriority, newNotes, newStatus }) {
    updateTodo(todo, { newTitle, newDueDate, newNotes, newDesc, newPriority, newStatus });
    saveStateToStorage(state);
    render();
}

function handleAddNewProject(name) {
    let newProject = createProject(name);
    state.projects.push(newProject);
    setActiveProject(newProject.id);
    saveStateToStorage(state);
    render();
}





