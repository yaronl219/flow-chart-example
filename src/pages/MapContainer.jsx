import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux';
import { setGraphData, setSelectedNodes } from '../store/actions/graphActions'
import dagre from 'dagre'
import ReactFlow, { isNode, MiniMap, getIncomers, getOutgoers } from 'react-flow-renderer';
import { MapNode } from '../cmps/MapNode';

function _MapContainer({ setGraphData, graphData, setSelectedNodes }) {

    const [displayMapData, setDisplayMapData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    let mapData = useRef(null)
    let time = useRef(0)
    let instance = useRef(null)

    useEffect(() => {
        setGraphData()
    }, [])

    useEffect(() => {
        setIsLoading(true)
        time.current = Date.now()
        parseMapData()
        setLayoutAndRender()
    }, [graphData])

    useEffect(() => {
        if (!time.current) return
        onNextFrame(() => {
            console.log('time from getting data', Date.now()-time.current)
            setIsLoading(false)
        })
    })

    const onSelectNode = (a) => {
        if (!a) {
            setSelectedNodes(null)
            return
        }
        const node = a[0]
        getVariantEdges(node)
    }

    const traverseBranch = (node, onTraverse = () => {}) => {
        // traverses a branch until it diverges

        const getFirstParent = (node) => {
            const incomers = getIncomers(node, displayMapData)
            if (!incomers.length) return node
            const incomerChildren = getOutgoers(incomers[0],displayMapData)
            onTraverse(node)
            if (incomerChildren.length > 1) return node
            return getFirstParent(incomers[0])
        }

        const getLastChild = (node) => {
            const outgoers = getOutgoers(node, displayMapData)
            onTraverse(node)
            if (outgoers.length === 1) return getLastChild(outgoers[0])
            return node
        }

        const firstParent = getFirstParent(node)
        const lastChild = getLastChild(node)

        return {firstParent, lastChild}
    }

    function getVariantEdges(node) {
        const variantNodes = []
        const addNodeToVariant = (node) => {
            const isNodeExist = !!variantNodes.find(variant => variant.id === node.id)
            if (isNodeExist) return
            variantNodes.push(node)
        }
        traverseBranch(node,addNodeToVariant)
        setSelectedNodes(variantNodes)
    }
    function onNextFrame(callback) {
        // called once the render is completed
        setTimeout(function () {
            requestAnimationFrame(callback)
        })
    }

    const getLayoutedElements = (elements, direction = 'TB', nodeWidth, nodeHeight) => {
        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));

        const isHorizontal = direction === 'LR';
        dagreGraph.setGraph({ rankdir: direction });

        elements.forEach((el) => {
            if (isNode(el)) {
                dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
            } else {
                dagreGraph.setEdge(el.source, el.target);
            }
        });

        dagre.layout(dagreGraph);
        const _elements = elements.map((el) => {
            if (isNode(el)) {
                const nodeWithPosition = dagreGraph.node(el.id);
                el.targetPosition = isHorizontal ? 'left' : 'top';
                el.sourcePosition = isHorizontal ? 'right' : 'bottom';

                // unfortunately we need this little hack to pass a slightly different position
                // to notify react flow about the change. Moreover we are shifting the dagre node position
                // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
                el.position = {
                    x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
                    y: nodeWithPosition.y - nodeHeight / 2,
                };
            }

            return el;
        });
        console.log('built graph', Date.now() - time.current)

        return _elements
    };

    const setLayoutAndRender = () => {
        if (!mapData.current) return
        const _displayMap = getLayoutedElements(mapData.current, 'TB', 50, 50)
        setDisplayMapData(_displayMap)
    }

    const onFinishLoadingMap = (ev) => {
        instance.current = ev
        console.log(Date.now()-time.current)
    }

    const onClickToObject = () => {
        console.log(instance.current.toObject())
    }

    const parseMapData = () => {
        const startTime = Date.now()
        if (!graphData) return
        const position = { x: 0, y: 0 };
        const _parsedMapData = []
        const graphRawData = graphData.data[0].graph
        const edgeType = 'smoothstep';

        Object.values(graphRawData.Edges).forEach(edge => {
            const edgeData = {
                id: edge.Id,
                source: edge.From.Id,
                target: edge.To.Id,
                type: edgeType
            }
            _parsedMapData.push(edgeData)
        })

        Object.values(graphRawData.Vertices).forEach(node => {
            const nodeData = {
                type: 'special',
                id: node.Id,
                data: node,
                position
            }
            _parsedMapData.push(nodeData)
        })
        
        mapData.current = _parsedMapData
        console.log('parsing the data took', Date.now() - startTime)
    }

    const nodeTypes = {
        special: MapNode,
    };

    if (isLoading) return <div>Loading...</div>
    if (!displayMapData) return <div />
    
    return (
        <div style={{ height: '1000px', width: '1600px' }}>
            <button onClick={setLayoutAndRender}>Reorganize</button>
            <button onClick={onClickToObject}>to object</button>
            <ReactFlow
                elements={displayMapData}
                nodeTypes={nodeTypes}
                connectionLineType="smoothstep"
                onSelectionChange={onSelectNode}
                onlyRenderVisibleElements={true}
                minZoom={0.2}
                onLoad={onFinishLoadingMap}
            >
            </ReactFlow>

        </div>
    )
}

const mapStateToProps = state => {
    const { graphData } = state.graphReducer
    return {
        graphData
    };
};

const mapDispatchToProps = {
    setGraphData,
    setSelectedNodes
}

export const MapContainer = connect(mapStateToProps, mapDispatchToProps)(_MapContainer);
