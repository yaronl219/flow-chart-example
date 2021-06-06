/* eslint-disable import/no-anonymous-default-export */
const initialState = {
    graphData: null,
    selectedNodes: null
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case 'SET_GRAPH_DATA':
            console.log('setting graph data')
            const { graphData } = action.payload
            return { ...state, graphData };

        case 'SET_SELECTED_NODES':
            const { selectedNodes } = action.payload
            return { ...state, selectedNodes }
        default:
            return state;
    }
}

