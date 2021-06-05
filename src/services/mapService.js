
const getGraphData = async (nodeAmount = 100) => {
    return _createMockData(nodeAmount,3)
}

function _createMockData(numberOfEvents = 10, numberOfColumns = 1) {
    const vertices = {}
    for (let i = 0; i < numberOfEvents; i++) {
        vertices[i] = _createMockVertice(i+1)
    }

    const columns = []

    for (let i=0; i< numberOfColumns; i++) {
        columns[i] = null
    }

    const edges = {}
    let {key,mockEdge} = _createMockEdge(1,2)
    edges[key] = mockEdge
    for (let i = 1; i < numberOfEvents - 1; i++) {
        // select random column
        // debugger
        const rand = getRandomInt(0,numberOfColumns)
        const col = columns[rand] ? columns[rand] : i+1
        let {key,mockEdge} = _createMockEdge(col,i+2)
        edges[key] = mockEdge
        if (shouldDiverge(10)) {
            columns[rand] = i+1
        }
    }
    console.log('finished creating data')
    return {
        data: [
            {
                graph: {
                    Vertices: vertices,
                    Edges: edges
                }
            }
        ]
    }
}

function shouldDiverge(chancesOfDivergence) {
    
    const chance = getRandomInt(0,100)
    if (chance >= chancesOfDivergence) return true
    return false
}

function _createMockEdge(from, to) {
    const key = `<${from},${to}>`
    const mockEdge = {
        "Id": key,
        "From": {
            "Id": `${from}`
        },
        "To": {
            "Id": `${to}`
        }
    }

    return {key, mockEdge}
}

function _createMockVertice(id) {
    return {
        "Id": `${id}`,
        "Properties": {

        },
        "Type": getRandomInt(1, 15),
        "WindowID": 4,
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * max) + min
}
export const mapService = {
    getGraphData
}
