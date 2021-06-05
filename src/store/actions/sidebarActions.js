export function setSidebarOpen(isSidebarOpen) {
    return dispatch => {
        try {
            dispatch({type: 'SET_SIDEBAR_OPEN', payload: {isSidebarOpen: isSidebarOpen}})
        } catch (err) {
            console.log('failed to dispatch',err)
        }
    }
}
