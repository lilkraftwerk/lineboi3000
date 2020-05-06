export const NEW_PROJECT = 'NEW_PROJECT';
export const LOAD_PROJECT = 'LOAD_PROJECT';

// action creators
export const newProject = () => {
    return {
        type: NEW_PROJECT
    };
};

export const loadProject = projectState => {
    return {
        type: LOAD_PROJECT,
        value: projectState
    };
};
