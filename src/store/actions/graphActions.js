import { mapService } from "../../services/mapService"

export function setGraphData(amount) {
    return async dispatch => {
        const graphData = await mapService.getGraphData(amount)
        dispatch({type: 'SET_GRAPH_DATA', payload: {graphData}})
    }
}

export function setSelectedNodes(selectedNodes) {
    return dispatch => {
        dispatch({type: 'SET_SELECTED_NODES', payload: {selectedNodes}})
    }
}
