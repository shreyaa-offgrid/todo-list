import { format } from "date-fns";
function createElement(tag, className, text) {

    const el = document.createElement(tag);
    if (className) {
        el.classList.add(className);
    }
    if (text !== undefined && text !== null) {
        el.textContent = text;
    }
    return el;
}

export function updateTodayDate(){
    let formattedDate = format(new Date(), "dd MMMM yyyy,  EEEE");
    let headerDate = document.querySelector(".todayDate p");
    headerDate.textContent = formattedDate;
}

export function renderListOfProjects(storedProjects, onProjectSelect, onAddNewProject) {

    let len = storedProjects.length;
    const lists = document.querySelector(".lists");
    lists.replaceChildren();

    const h2 = createElement("h3", "", "Your Projects");
    lists.appendChild(h2);

    for (let i = 0; i < len; i++) {
        const list = createElement("div", "list");
        const name = createElement("p", "", storedProjects[i].projectName);
        const num = createElement("p", "", `(${storedProjects[i].todos.length})`);

        list.setAttribute("data-projectId", storedProjects[i].id);

        list.addEventListener("click", () => {
            onProjectSelect(storedProjects[i].id);
        });

        list.append(name, num);
        lists.appendChild(list);
    }
    const newProjectBtn = document.querySelector(".actions .new-project");
    const newProjectDialog = document.querySelector(".newProjectDialog");
    const saveNewProjectBtn = document.querySelector(".newProjectDialog button");
    saveNewProjectBtn.onclick = (e) => {
        e.preventDefault();
        const pName = newProjectDialog.querySelector("#project-name").value;
        if (!pName.trim()) return;
        onAddNewProject(pName);
        newProjectDialog.close();
    };
    newProjectBtn.onclick = () => {
        newProjectDialog.showModal();
    };
}

export function renderActiveProjectTodos(activeProject, onAddNewTask, onDeleteTask, onEditTask) {

    const activeProjectDiv = document.querySelector(".active-project");
    activeProjectDiv.replaceChildren();

    const h2 = createElement("h2", "", activeProject.projectName);
    activeProjectDiv.appendChild(h2);

    const cardsGrid = document.querySelector(".cards");
    cardsGrid.replaceChildren();

    const todos = activeProject.todos;
    const len = todos.length;

    for (let i = 0; i < len; i++) {
        let todo = todos[i];
        renderTodo(todo, cardsGrid, onDeleteTask, onEditTask);
    }

    const newTask = createElement("div", "newTask");
    const newTaskBtn = createElement("button", "newTaskBtn", "+");
    newTask.appendChild(newTaskBtn);
    newTaskBtn.addEventListener("click", () => {
        newTaskForm(onAddNewTask);
    });
    const promptText = createElement("p", "", "New Task");
    newTask.appendChild(promptText);

    cardsGrid.appendChild(newTask);

    const headerNewTaskBtn = document.querySelector(".actions .new-task");
    headerNewTaskBtn.onclick = () => {
        newTaskForm(onAddNewTask)
    };
}

function renderTodo(task, cardsGrid, onDeleteTask, onEditTask) {

    const cardContainer = document.createElement("div");
    let card = createElement("div", "card");
    card.setAttribute("data-id", task.id);
    card.addEventListener("click", () => {
        expandTask(task, onDeleteTask, onEditTask);
    });
    switch (task.priority) {
        case "high":
            card.classList.add("high");
            break;
        case "low":
            card.classList.add("low");
            break;
        default:
            card.classList.add("default");
    }

    const title = createElement("h4", "", task.title);
    const date = createElement("p", "", task.dueDate);

    card.append(title, date);

    cardContainer.appendChild(card);
    cardsGrid.appendChild(cardContainer);
}

let detailDialog = createElement("dialog", "detailDialog");
document.body.appendChild(detailDialog);

let editTaskDialog = document.querySelector(".editTaskDialog");

function expandTask(task, onDeleteTask, onEditTask) {

    detailDialog.replaceChildren();
    const flexContainer = createElement("div", "detailFlex");

    const title = createElement("h2", "", task.title);
    const priority = createElement("p", "", `Priority: ${task.priority}`);
    const dueDate = createElement("p", "", `Due Date: ${task.dueDate}`);
    const desc = createElement("p", "", `Description: ${task.desc}`);
    const notes = createElement("p", "", task.notes);

    const btnDiv = createElement("div", "btnDiv");
    const closeBtn = createElement("button", "closeDialogBtn", "Close");
    closeBtn.type = "button";
    closeBtn.addEventListener("click", () => {
        detailDialog.replaceChildren();
        detailDialog.close();
    });

    const editBtn = createElement("button", "editDialogBtn", "Edit");
    editBtn.type = "button";
    editBtn.addEventListener("click", () => {
        detailDialog.replaceChildren();
        detailDialog.close();

        const saveBtn = document.querySelector(".editTaskDialog button");
        saveBtn.onclick = (e) => {
            e.preventDefault();

            const newTitle = document.getElementById("edit-todo-title").value;
            const newDueDate = document.getElementById("edit-due-date").value;
            const newDesc = document.getElementById("edit-description").value;
            const newPriorityEl = document.querySelector('.editTaskDialog input[name="priority"]:checked');
            const newPriority = newPriorityEl ? newPriorityEl.id : undefined;
            const newNotes = document.getElementById("edit-notes").value;
            const newStatus = editTaskDialog.querySelector(".status>input").checked;
            const form = document.querySelector(".editTaskDialog form");
            form.reset();
            onEditTask(task, { newTitle, newDueDate, newDesc, newPriority, newNotes, newStatus });
            editTaskDialog.close();
        };

        const titleEl = document.getElementById("edit-todo-title");
        const oldTitle = task.title;
        titleEl.value = oldTitle;

        const dueDateEl = document.getElementById("edit-due-date");
        const oldDueDate = task.dueDate;
        dueDateEl.value = oldDueDate;

        const descInput = document.getElementById("edit-description");
        const oldDesc = task.desc;
        descInput.value = oldDesc;

        const priorityRadios = document.querySelectorAll('.editTaskDialog input[name="priority"]');
        priorityRadios.forEach(radio => {
            radio.checked = (radio.id === task.priority);
        });

        const notesEl = document.getElementById("edit-notes");
        const oldNotes = task.notes;
        notesEl.value = oldNotes;

        const statusEl = document.querySelector(".editTaskDialog .status>input");
        const oldStatus = task.completed;
        if (oldStatus) {
            statusEl.checked = true;
        }

        editTaskDialog.showModal();
    });

    const deleteBtn = createElement("button", "deleteTodoBtn", "Delete");
    deleteBtn.type = "button";
    deleteBtn.addEventListener("click", () => {
        detailDialog.replaceChildren();
        detailDialog.close();
        onDeleteTask(task);
    });

    btnDiv.append(closeBtn, editBtn, deleteBtn);

    flexContainer.append(
        desc,
        dueDate,
        priority,
        notes,
        btnDiv
    );
    detailDialog.append(title, flexContainer);
    if (!detailDialog.open) {
        detailDialog.showModal();
    }
}

export function newTaskForm(onAddNewTask) {
    const formDialog = document.querySelector(".formDialog");
    formDialog.showModal();

    const saveBtn = document.querySelector(".formDialog .form-submit");

    saveBtn.onclick = (e) => {
        e.preventDefault();
        const title = document.getElementById("todo-title").value;
        const dueDate = document.getElementById("due-date").value;
        const desc = document.getElementById("description").value;
        const priorityEl = document.querySelector('input[name="priority"]:checked');
        const priority = priorityEl ? priorityEl.id : undefined;
        const notes = document.getElementById("notes").value;
        const status = document.querySelector(".status>input").checked;
        const form = document.querySelector(".formDialog form");
        form.reset();
        onAddNewTask({ title, dueDate, desc, priority, notes, status });
        formDialog.close();
    };
}

























