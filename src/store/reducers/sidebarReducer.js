/* eslint-disable import/no-anonymous-default-export */
const initialState = {
    isSidebarOpen: true
};

export default function(state = initialState, action = {}) {
    switch (action.type) {
        case 'SET_SIDEBAR_OPEN':
            const {isSidebarOpen} = action.payload
            return { ...state, isSidebarOpen };

        default:
            return state;
    }
}

