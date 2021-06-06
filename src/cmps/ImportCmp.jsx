import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { importGraphData } from '../store/actions/graphActions'

function _ImportCmp({importGraphData}) {

    const [text, setText] = useState('')
    const [isValidJson, setIsValidJson] = useState(false)

    const onChangeTextField = (ev) => {
        const {value} = ev.target
        setText(value)
    }

    useEffect(() => {
        if (!text) return
        try {
            JSON.parse(text)
            setIsValidJson(true)
        } catch (err) {
            setIsValidJson(false)
        }
    }, [text])

    const onSetGraphFromJson = () => {
        try {
            const graphData = JSON.parse(text)
            importGraphData(graphData)
        } catch (err) {
            console.log(err)
            setIsValidJson(false)
        }
    }

    return (
        <div style={{display:'flex', flexDirection:'column'}}>
            <h3>Import from JSON</h3>
            <input value={text} onChange={onChangeTextField} />
            <button onClick={onSetGraphFromJson} disabled={!(text && isValidJson) }>Set graph from JSON</button>
        </div>
    )
}

const mapStateToProps = state => {
    return {}
};

const mapDispatchToProps = {
    importGraphData,
}

export const ImportCmp = connect(mapStateToProps, mapDispatchToProps)(_ImportCmp);
