import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Plotter from 'plotting/plot-coords';

const { ipcRenderer } = window.require('electron');

export default class PresetManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            presets: []
        };
    }

    componentDidMount() {
        this.listAllPresets();
        ipcRenderer.on('preset:list:reply', (event, presets) => {
            this.setState({ presets });
        });
    }

    handleChange = e => {
        const { id, value } = e.target;
        this.setState({ [id]: value }, () => {});
    };

    listAllPresets = () => {
        ipcRenderer.send('preset:list:request');
    };

    onLoadPreset = () => {
        const { loadPreset } = this.props;
        const { selectedPresetName, presets } = this.state;
        const { preset } = presets.find(p => p.name === selectedPresetName);
        loadPreset(preset);
    };

    savePreset = () => {
        const { currentOptions } = this.props;
        const { presetName } = this.state;
        ipcRenderer.send('preset:save', {
            name: presetName,
            preset: currentOptions
        });
    };

    selectPreset = event => {
        this.setState({ selectedPresetName: event.target.value });
    };

    createDropDown = () => {
        const { presets, selectedPresetName } = this.state;

        const createPreset = ({ name }) => (
            <option
                key={name}
                value={name}
                selected={selectedPresetName === name}
            >
                {name}
            </option>
        );

        return (
            <select id="selectedPresetName" onChange={this.selectPreset}>
                {presets.map(currentPreset => createPreset(currentPreset))}
            </select>
        );
    };

    render() {
        return (
            <Fragment>
                <button type="button" onClick={this.savePreset}>
                    save preset
                </button>
                <button type="button" onClick={this.listAllPresets}>
                    list presets
                </button>
                {this.createDropDown()}
                <button type="button" onClick={this.onLoadPreset}>
                    load preset
                </button>
                <label>
                    name
                    <input
                        id="presetName"
                        type="text"
                        onChange={this.handleChange}
                    />
                </label>
            </Fragment>
        );
    }
}

PresetManager.defaultProps = {};

PresetManager.propTypes = {};
