import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Handle } from 'react-flow-renderer'

function _BorderCmp({ selectedNodes, data }) {
    
    const [height, setHeight] = useState(0)
    
    useEffect(() => {
        if (!selectedNodes || !selectedNodes.length) return setHeight(0)
    }, [selectedNodes])

    useEffect(() => {
        const _height = data.lowestNodePos + 50 + 25 - data.yPos
        setHeight(_height)
    }, [data])

    if (!selectedNodes || !selectedNodes.length) return <div></div>
    return (
        <div style={{ height, width: data.width, border: '1px solid black', backgroundColor: 'yellow', borderRadius: '3px' }}>
            <Handle type="source" position="bottom" />
        </div>
    )
}

const mapStateToProps = state => {
    const { selectedNodes } = state.graphReducer
    return {
        selectedNodes
    };
};

const mapDispatchToProps = {

}
export const BorderCmp = connect(mapStateToProps, mapDispatchToProps)(_BorderCmp);
