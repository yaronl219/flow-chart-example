import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux';
import { setGraphData, setSelectedNodes } from '../store/actions/graphActions'
import dagre from 'dagre'
import ReactFlow, { isNode, Background, getIncomers, getOutgoers } from 'react-flow-renderer';
import { MapNode } from '../cmps/MapNode';
import { BorderCmp } from '../cmps/BorderCmp';

function _MapContainer({ setGraphData, graphData, setSelectedNodes, selectedNodes }) {

    const [displayMapData, setDisplayMapData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    let mapData = useRef(null)
    let time = useRef(0)
    let instance = useRef(null)

    useEffect(() => {
        setGraphData()
    }, [])

    useEffect(() => {
        displayBorderNode()
    }, [selectedNodes])

    useEffect(() => {
        setIsLoading(true)
        time.current = Date.now()
        parseMapData()
        setLayoutAndRender()
    }, [graphData])

    useEffect(() => {
        if (!time.current) return
        onNextFrame(() => {
            console.log('time from getting data', Date.now() - time.current)
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

    const displayBorderNode = () => {
        if (!selectedNodes) return

        const padding = 25
        const width = 75
        let lowestNodePos
        let xPos
        let yPos
        selectedNodes.forEach(node => {
            if (!xPos || xPos > node.position.x) xPos = node.position.x
            if (!yPos || yPos > node.position.y) yPos = node.position.y
            if (!lowestNodePos || lowestNodePos < node.position.y) lowestNodePos = node.position.y
        })
        let data
        if (selectedNodes) {
            data = [...mapData.current]

            const nodeData = {
                type: 'border',
                id: 'border',
                data: {xPos, yPos, width, lowestNodePos},
                position: { x: xPos - (padding / 2), y: yPos - (padding / 2)},
                connectable: false,
                draggable: false,
                isHidden: !(selectedNodes && selectedNodes.length)
            }

            data.unshift(nodeData)
        }




        setLayoutAndRender(data)
    }

    const traverseBranch = (node, onTraverse = () => { }) => {
        // traverses a branch until it diverges

        const getFirstParent = (node) => {
            const incomers = getIncomers(node, displayMapData)
            if (!incomers.length) return node
            const incomerChildren = getOutgoers(incomers[0], displayMapData)
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

        return { firstParent, lastChild }
    }

    function getVariantEdges(node) {
        const variantNodes = []
        const addNodeToVariant = (node) => {
            const isNodeExist = !!variantNodes.find(variant => variant.id === node.id)
            if (isNodeExist) return
            variantNodes.push(node)
        }
        traverseBranch(node, addNodeToVariant)
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

    const setLayoutAndRender = (data) => {
        if (data) return setDisplayMapData(data)
        data = mapData.current
        if (!data) return
        const _displayMap = getLayoutedElements(data, 'TB', 50, 50)
        setDisplayMapData(_displayMap)
    }

    const onFinishLoadingMap = (ev) => {
        instance.current = ev
        console.log(Date.now() - time.current)
    }

    const onClickToObject = () => {
        console.log(instance.current.toObject())
    }

    const parseMapData = () => {
        const startTime = Date.now()
        setIsError(false)
        try {
            if (!graphData) return
            const position = { x: 0, y: 0 };
            const _parsedMapData = []
            const graphRawData = graphData.data[0].graph
            const edgeType = 'brazier';

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
        } catch (err) {
            setIsError(true)

        }
    }

    const nodeTypes = {
        special: MapNode,
        border: BorderCmp
    };

    if (isError) return <div>Error parsing the data</div>
    if (isLoading) return <div>Loading...</div>
    if (!displayMapData) return <div />

    return (
        <div >
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <button onClick={() => setLayoutAndRender(null)}>Reorganize</button>
                <button onClick={onClickToObject}>to object</button>
            </div>
            <div style={{ height: '800px', width: '1600px', margin: '1rem', border: '1px solid black', borderRadius: '0.25rem', padding: '1px' }}>
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
        </div>
    )
}

const mapStateToProps = state => {
    const { graphData, selectedNodes } = state.graphReducer
    return {
        graphData,
        selectedNodes
    };
};

const mapDispatchToProps = {
    setGraphData,
    setSelectedNodes
}

export const MapContainer = connect(mapStateToProps, mapDispatchToProps)(_MapContainer);
