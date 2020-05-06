import React, { Fragment } from 'react';

const { ipcRenderer } = window.require('electron');

export default class DrawingManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drawings: []
        };
    }

    componentDidMount() {
        ipcRenderer.send('drawing:getall:request');
        ipcRenderer.on('drawing:getall:reply', (event, drawings) => {
            this.setState({ drawings });
        });
    }

    handleChange = e => {
        const { id, value } = e.target;
        this.setState({ [id]: value });
    };

    listAllDrawings = () => {
        ipcRenderer.send('drawing:getall:request');
    };

    loadDrawing = () => {
        const { loadLinesFromFile } = this.props;
        const { selectedDrawingName, drawings } = this.state;
        const { lines } = drawings.find(p => p.name === selectedDrawingName);
        loadLinesFromFile(lines);
    };

    saveDrawing = () => {
        const { renderLines } = this.props;
        const { drawingName } = this.state;
        ipcRenderer.send('drawing:save', {
            name: drawingName,
            lines: renderLines
        });
    };

    selectDrawing = event => {
        this.setState({ selectedDrawingName: event.target.value });
    };

    createDropDown = () => {
        const { drawings, selectedDrawingName } = this.state;

        const createDrawing = ({ name }) => (
            <option
                key={name}
                value={name}
                selected={selectedDrawingName === name}
            >
                {name}
            </option>
        );

        return (
            <select id="selectedDrawingName" onChange={this.selectDrawing}>
                {drawings.map(currentDrawing => createDrawing(currentDrawing))}
            </select>
        );
    };

    render() {
        return (
            <Fragment>
                <button type="button" onClick={this.saveDrawing}>
                    save visible lines
                </button>
                <button type="button" onClick={this.listAllDrawings}>
                    list all saved drawings
                </button>
                {this.createDropDown()}
                <button type="button" onClick={this.loadDrawing}>
                    load drawing
                </button>
                <label>
                    name
                    <input
                        id="drawingName"
                        type="text"
                        onChange={this.handleChange}
                    />
                </label>
            </Fragment>
        );
    }
}

DrawingManager.defaultProps = {
    renderLines: []
};
