import { ipcRenderer } from 'electron';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { saveTempAsFrame, setTempBlob } from 'store/gifmaker/gifmakerActions';
import {
    addFilterToLayerByID,
    deleteFilterFromLayer,
    moveFilterDown,
    moveFilterUp,
    setFiltersForAllLayers,
    setFiltersForLayerByID,
    updateFilterByLayerIDandFilterID,
    updateLayerSetting
} from 'store/layer/layerActions';
import { getCurrentLayer, getLayers } from 'store/layer/layerSelectors';
import { setLayerEfxLines } from 'store/line/lineActions';
import { getOriginalLines } from 'store/line/lineSelectors';
import { getCurrentOptions } from 'store/options/optionsSelectors';
import idGenerator from 'utils/id';

import ItemSelector from 'components/common/ItemSelector/ItemSelector';
import {
    SidebarContainer,
    SidebarItem
} from 'components/common/SidebarContainer/SidebarContainer';

import ConnectLines from 'filters/ConnectLines';
import Distort from 'filters/Distort';
import Dots from 'filters/Dots';
import Exes from 'filters/Exes';
import Experimental from 'filters/Experimental';
import FilterWrapper from 'filters/FilterWrapper';
import Move from 'filters/Move';
import RemoveLines from 'filters/RemoveLines';
import ShortenLines from 'filters/ShortenLine';
import Simplify from 'filters/Simplify';
import Smooth from 'filters/Smooth';
import SplitLines from 'filters/SplitLines';
import SplitLinesRandom from 'filters/SplitLinesRandom';
import Wiggle from 'filters/Wiggle';

import {
    createLineFromPointArray,
    getPointArraysFromLine
} from '../../utils/lineUtils';

import '../common/SidebarContainer/SidebarStyles.css';
import * as styles from './EfxSidebar.styles.css';

const CONSTANT_FILTERS = [
    Move,
    Distort,
    ShortenLines,
    SplitLines,
    SplitLinesRandom,
    ConnectLines,
    RemoveLines,
    Exes,
    Wiggle,
    Experimental,
    Dots,
    Simplify,
    Smooth
];

const INIT_STATE = {
    savingPreset: false,
    savePresetName: '',
    selectedPresetName: null,
    presets: [],
    loadingMessage: ''
};

const LOADING_MESSAGES = [
    'processing',
    'calculating',
    'combobulating',
    'converting',
    'transforming',
    'concocting',
    'preparing'
];

class EfxSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = INIT_STATE;

        this.state.loadingMessage = _.sample(LOADING_MESSAGES);

        this.listAllPresets();
        ipcRenderer.on('preset:list:reply', (event, receivedPresets) => {
            this.setState({ presets: receivedPresets });
        });
    }

    componentDidMount() {
        ipcRenderer.on('renderer:efxLines', (event, arg) => {
            this.onReceiveWorkerResults(arg);
        });
    }

    componentDidUpdate(prevProps) {
        const { isLoading } = this.props;
        if (prevProps.isLoading !== isLoading) {
            this.updateLoadingMessage();
        }
    }

    updateLoadingMessage = () => {
        this.setState({
            loadingMessage: _.sample(LOADING_MESSAGES)
        });
    };

    onReceiveWorkerResults = (results) => {
        const { dispatch } = this.props;
        const [layerID, pointArrays] = results;
        const linesWithId = pointArrays.map((pointArray) =>
            createLineFromPointArray(pointArray)
        );
        dispatch(setLayerEfxLines(layerID, linesWithId));
        dispatch(updateLayerSetting(layerID, 'loading', false));
    };

    addFilterToCurrentLayer = (filterName) => {
        const { dispatch, currentLayerID, globalSettings } = this.props;

        const { initSettings } = CONSTANT_FILTERS.find(
            (filter) => filter.name === filterName
        );

        if (!initSettings) {
            return;
        }

        const settingsWithId = {
            id: idGenerator(),
            ...initSettings(globalSettings)
        };

        dispatch(addFilterToLayerByID(currentLayerID, settingsWithId));
    };

    updateSettingForCurrentLayerFilterById = (
        filterID,
        updatedFilterSettings
    ) => {
        const { dispatch, currentLayerID } = this.props;
        dispatch(
            updateFilterByLayerIDandFilterID(
                currentLayerID,
                filterID,
                updatedFilterSettings
            )
        );
    };

    processCurrentLayer = () => {
        const { currentLayerID, dispatch } = this.props;
        dispatch(setTempBlob(null));
        this.processEfxLinesForLayer(currentLayerID);
    };

    saveFrame = () => {
        const { dispatch } = this.props;
        dispatch(saveTempAsFrame());
    };

    processAllLayers = () => {
        const { allOriginalLines, dispatch } = this.props;
        dispatch(setTempBlob(null));
        const allLayerIds = Object.keys(allOriginalLines);
        // this might not work, make sure to remove deleted ones
        allLayerIds.forEach((layerID) => {
            this.processEfxLinesForLayer(layerID);
        });
    };

    saveEfxToAllLayers = () => {
        const { filters, dispatch } = this.props;

        dispatch(setFiltersForAllLayers(filters));
    };

    processEfxLinesForLayer = (layerID) => {
        const { allOriginalLines, globalSettings, allLayers, dispatch } =
            this.props;

        const { filters } = allLayers.find((l) => l.id === layerID);
        const linesForThisLayer = allOriginalLines[layerID];

        if (linesForThisLayer == null) {
            return;
        }

        dispatch(updateLayerSetting(layerID, 'loading', true));
        const pointArrays = linesForThisLayer.map((line) =>
            getPointArraysFromLine(line)
        );

        const payload = {
            layerID,
            pointArrays,
            globalSettings,
            filters
        };

        ipcRenderer.send('main:processEfxLines', payload);
    };

    //
    // preset stuff below, todo: move to own component
    //

    resetState = () => {
        this.setState(INIT_STATE);
    };

    updatePresetName = (savePresetName) => {
        this.setState({
            savePresetName
        });
    };

    setSelectedPreset = (selectedPresetName) => {
        this.setState({ selectedPresetName });
    };

    loadPreset = () => {
        const { currentLayerID, dispatch } = this.props;
        const { selectedPresetName, presets } = this.state;

        const foundPreset = presets.find(
            (preset) => preset.name === selectedPresetName
        );

        if (!foundPreset) {
            return;
        }

        const { filters } = foundPreset;

        dispatch(setFiltersForLayerByID(currentLayerID, filters));
    };

    startSavingPreset = () => {
        this.setState({ savingPreset: true });
    };

    savePreset = () => {
        const { filters } = this.props;
        const { savePresetName } = this.state;

        const savedPresetObj = {
            name: savePresetName,
            filters
        };

        ipcRenderer.send('preset:save', savedPresetObj);
    };

    listAllPresets = () => {
        console.log('requesting presets');
        ipcRenderer.send('preset:list:request');
    };

    render() {
        const {
            filters,
            globalSettings,
            tempBlobIsNull,
            currentLayerID,
            currentLayerHasLines,
            isLoading,
            dispatch
        } = this.props;

        const { savingPreset, savePresetName, presets, loadingMessage } =
            this.state;

        return (
            <SidebarContainer>
                <SidebarItem>
                    {isLoading && (
                        <div className={styles.loadingContainer}>
                            <div className={styles.loadingText}>
                                {loadingMessage}...
                            </div>
                            <div className={styles.loadingBackground} />
                        </div>
                    )}
                    {!isLoading && (
                        <>
                            <button
                                style={{ gridColumn: 'span 1' }}
                                type="button"
                                disabled={isLoading || !currentLayerHasLines}
                                onClick={this.processCurrentLayer}
                            >
                                run current
                            </button>
                            <button
                                style={{ gridColumn: 'span 1' }}
                                type="button"
                                disabled={isLoading}
                                onClick={this.processAllLayers}
                            >
                                run all layers
                            </button>
                            <button
                                style={{ gridColumn: 'span 1' }}
                                type="button"
                                disabled={isLoading}
                                onClick={this.saveEfxToAllLayers}
                            >
                                copy efx to all layers
                            </button>
                            <button
                                style={{ gridColumn: 'span 1' }}
                                type="button"
                                onClick={this.saveFrame}
                                disabled={isLoading || tempBlobIsNull}
                            >
                                save frame to gif
                            </button>
                        </>
                    )}
                </SidebarItem>
                <SidebarItem title="presets" height={1} half startOpen={false}>
                    {!savingPreset && (
                        <ItemSelector
                            spanCount={4}
                            onChange={(selectedPresetName) => {
                                this.setSelectedPreset(selectedPresetName);
                            }}
                            items={presets.map((preset) => ({
                                key: preset.name,
                                title: preset.name
                            }))}
                            showConfirmButton={false}
                        />
                    )}
                    {savingPreset && (
                        <div style={{ gridColumn: 'span 4' }}>
                            preset name
                            <input
                                style={{ width: '100%' }}
                                value={savePresetName}
                                type="text"
                                onChange={(e) => {
                                    this.updatePresetName(e.target.value);
                                }}
                            />
                        </div>
                    )}
                    {!savingPreset && (
                        <button
                            style={{ gridColumn: 'span 2' }}
                            type="button"
                            onClick={() => {
                                this.loadPreset();
                            }}
                        >
                            load
                        </button>
                    )}
                    {savingPreset && (
                        <>
                            <button
                                style={{ gridColumn: 'span 2' }}
                                type="button"
                                onClick={() => {
                                    this.savePreset();
                                }}
                            >
                                save
                            </button>
                            <button
                                style={{ gridColumn: 'span 2' }}
                                type="button"
                                onClick={() => {
                                    this.resetState();
                                }}
                            >
                                cancel
                            </button>
                        </>
                    )}
                    {!savingPreset && (
                        <button
                            style={{ gridColumn: 'span 2' }}
                            type="button"
                            onClick={() => {
                                this.startSavingPreset();
                            }}
                        >
                            save
                        </button>
                    )}
                </SidebarItem>
                <SidebarItem title="add filter" height={1} half>
                    <ItemSelector
                        onSelect={(filterName) => {
                            this.addFilterToCurrentLayer(filterName);
                        }}
                        title="add filter"
                        items={CONSTANT_FILTERS.map((filter) => ({
                            key: filter.name,
                            title: filter.name
                        }))}
                    />
                </SidebarItem>
                {filters.map((filterSetting, index) => {
                    const { filterName, id } = filterSetting;
                    const foundFilter = CONSTANT_FILTERS.find(
                        (mainFilter) => mainFilter.name === filterName
                    );

                    if (!foundFilter) {
                        return null;
                    }
                    const { Component, displayName, helpText } = foundFilter;

                    const updateOptions = (valueObj) => {
                        this.updateSettingForCurrentLayerFilterById(
                            id,
                            valueObj
                        );
                    };

                    return (
                        <FilterWrapper
                            key={id}
                            displayName={displayName}
                            helpText={`${displayName}: ${helpText}`}
                            filterSettings={filterSetting}
                            updateOptions={updateOptions}
                            deleteFilter={() => {
                                dispatch(
                                    deleteFilterFromLayer(currentLayerID, id)
                                );
                            }}
                            canMoveDown={index !== 0}
                            canMoveUp={index < filters.length - 1}
                            moveFilterUp={() => {
                                dispatch(moveFilterUp(currentLayerID, id));
                            }}
                            moveFilterDown={() => {
                                dispatch(moveFilterDown(currentLayerID, id));
                            }}
                        >
                            <Component
                                key={filterName}
                                filterSettings={filterSetting}
                                globalSettings={globalSettings}
                                updateOptions={updateOptions}
                            />
                        </FilterWrapper>
                    );
                })}
            </SidebarContainer>
        );
    }
}

const mapStateToProps = (state) => {
    const { id, filters } = getCurrentLayer(state);
    const allOriginalLines = getOriginalLines(state);
    const allLayers = getLayers(state);
    const options = getCurrentOptions(state);
    const isLoading = allLayers.map((layer) => layer.loading).includes(true);
    const tempBlobIsNull = state.gifmakerReducer.tempBlob == null;
    const currentLayerHasLines = allOriginalLines[id];

    return {
        globalSettings: options,
        currentLayerID: id,
        allOriginalLines,
        allLayers,
        filters,
        tempBlobIsNull,
        isLoading,
        currentLayerHasLines
    };
};

export default connect(mapStateToProps)(EfxSidebar);
