import React, { useState } from 'react'
import { connect } from 'react-redux';
import { setGraphData } from '../store/actions/graphActions'

function _NodeGenerator({setGraphData}) {
    const [amountOfNodes, setAmountOfNodes] = useState(100)

    const onChangeAmountOfNodes = (ev) => {
        const amount = +ev.target.value
        if (isNaN(amount)) return
        setAmountOfNodes(amount)
    }


    return (
        <div style={{display:'flex', flexDirection:'column'}}>
            <h3>Generate random nodes</h3>
            <input value={amountOfNodes} onChange={onChangeAmountOfNodes} />
            <button onClick={() => setGraphData(amountOfNodes)}>Generate</button>
        </div>
    )
}

const mapStateToProps = state => {
    return {}
};

const mapDispatchToProps = {
    setGraphData,
}

export const NodeGenerator = connect(mapStateToProps, mapDispatchToProps)(_NodeGenerator);
