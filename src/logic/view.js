import { isToday, isThisWeek, parseISO } from "date-fns";

function getAllTodos(state){
    const allProjects = state.projects;
    const allTodos = allProjects.flatMap(project=>project.todos);
    return allTodos;
}

function getTodayView(state){
    let today = [];
    const allTodos = getAllTodos(state);
    allTodos.forEach(todo => {
        if(todo.dueDate && isToday(parseISO(todo.dueDate))){
            today.push(todo);
        }
    });
    return {projectName: "Today", todos: today};
}

function getWeekView(state){
    let week = [];
    const allTodos = getAllTodos(state);
    allTodos.forEach(todo => {
        if(todo.dueDate && isThisWeek(parseISO(todo.dueDate), {weekStartsOn:1})){
            week.push(todo);
        }
    });
    return {projectName: "This Week", todos: week };
}

function getAllView(state){
    return {projectName: "All Time", todos: getAllTodos(state)};
}
