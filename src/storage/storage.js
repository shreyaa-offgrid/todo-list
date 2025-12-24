export function saveStateToStorage(state) {
    localStorage.setItem(
        "projects",
        JSON.stringify(state.projects)
    );

    localStorage.setItem(
        "activeProjectId",
        JSON.stringify(state.activeProjectId)
    );
}

export function loadStateFromStorage() {
    const projectsJSON = localStorage.getItem("projects");
    const activeIdJSON = localStorage.getItem("activeProjectId");

    if (!projectsJSON || !activeIdJSON) {
        return null;
    }

    return {
        projects: JSON.parse(projectsJSON),
        activeProjectId: JSON.parse(activeIdJSON)
    };
}
