export const state = {
    projects:[],
    activeProjectId: null,
}

export function setActiveProject(projectId){
    state.activeProjectId = projectId;
}

export function getActiveProject(){
    return state.projects.find(p=>p.id===state.activeProjectId);
}