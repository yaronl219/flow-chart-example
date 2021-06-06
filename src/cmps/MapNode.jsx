import React, { useEffect, useState } from 'react'
import { Handle } from 'react-flow-renderer'
import { connect } from 'react-redux'

function _MapNode({selectedNodes, data, selected}) {

    const [isPartOfSelectedVariant, setIsPartOfSelectedVariant] = useState(false)

    useEffect(() => {
        if (!selectedNodes) return setIsPartOfSelectedVariant(false)
        const isSelected = !!selectedNodes.find(node => node.id === data.Id)
        setIsPartOfSelectedVariant(isSelected)
    }, [selectedNodes, data.Id])

    return (
        <div style={{ borderRadius: '50%', height: 50, width: 50, border: '1px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundColor:'white' }}>
            <Handle type="source" position="bottom" />
            <div>{data.Id}</div>
            <div>{selected && 'selected'}</div>
            <div>{isPartOfSelectedVariant && 'variant'}</div>
            <Handle type="target" position="top" />
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

export const MapNode = connect(mapStateToProps, mapDispatchToProps)(_MapNode)
