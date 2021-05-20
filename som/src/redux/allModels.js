import * as ActionTypes from './ActionTypes';

export const AllModelFiles = (state = {
    isLoading: true,
    errMess: null,
    modelFiles: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_ALL_MODELS:
            console.log("add all models: ", action.payload);
            return { ...state, isLoading: false, errMess: null, modelFiles: action.payload };

        default:
            return state;
    }
};
