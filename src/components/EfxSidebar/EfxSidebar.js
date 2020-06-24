import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import {
    addFilterToLayerByID,
    updateFilterByLayerIDandFilterID,
    moveFilterUp,
    moveFilterDown,
    deleteFilterFromLayer,
    setFiltersForLayerByID,
    setFiltersForAllLayers,
    updateLayerSetting
} from 'store/layer/layerActions';
import { getCurrentLayer, getLayers } from 'store/layer/layerSelectors';
import { getCurrentOptions } from 'store/onions/onionsSelectors';
import { setLayerEfxLines } from 'store/line/lineActions';
import { saveTempAsFrame } from 'store/gifmaker/gifmakerActions';
import { getOriginalLines } from 'store/line/lineSelectors';
import idGenerator from 'utils/id';

import {
    SidebarContainer,
    SidebarItem
} from 'components/common/SidebarContainer';
import ItemSelector from 'components/common/ItemSelector';

import FilterWrapper from 'filters/FilterWrapper';
import Multiply from 'filters/Multiply';
import Wiggle from 'filters/Wiggle';
import Distort from 'filters/Distort';
import RemoveLines from 'filters/RemoveLines';
import ShortenLines from 'filters/ShortenLine';
import SplitLines from 'filters/SplitLines';
import SplitLinesRandom from 'filters/SplitLinesRandom';
import Simplify from 'filters/Simplify';
import Experimental from 'filters/Experimental';
import Dots from 'filters/Dots';
import Move from 'filters/Move';
import Exes from 'filters/Exes';
import Smooth from 'filters/Smooth';

import {
    createLineFromPointArray,
    getPointArraysFromLine
} from '../../utils/lineUtils';

import styles from './EfxSidebar.styles.css';
import '../common/SidebarStyles.css';

const CONSTANT_FILTERS = [
    Move,
    Distort,
    ShortenLines,
    SplitLines,
    SplitLinesRandom,
    RemoveLines,
    Exes,
    Multiply,
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
    presets: []
};

class EfxSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = INIT_STATE;

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
        const { currentLayerID } = this.props;
        this.processEfxLinesForLayer(currentLayerID);
    };

    saveFrame = () => {
        const { dispatch } = this.props;
        dispatch(saveTempAsFrame());
    };

    processAllLayers = () => {
        const { allOriginalLines } = this.props;
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
        const {
            allOriginalLines,
            globalSettings,
            allLayers,
            dispatch
        } = this.props;
        dispatch(updateLayerSetting(layerID, 'loading', true));

        const { filters } = allLayers.find((l) => l.id === layerID);
        const linesForThisLayer = allOriginalLines[layerID];
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
            currentLayerID,
            isLoading,
            dispatch
        } = this.props;

        const { savingPreset, savePresetName, presets } = this.state;

        return (
            <SidebarContainer>
                <SidebarItem>
                    {isLoading && (
                        <Fragment>
                            <div className={styles.loadingEmoji}>
                                <div className={styles.emoji}>🌚</div>
                            </div>
                            <div className={styles.loadingMessage}>
                                processing...
                            </div>
                            <div className={styles.loadingEmoji}>
                                <div className={styles.emoji}>🌚</div>
                            </div>
                        </Fragment>
                    )}
                    {!isLoading && (
                        <Fragment>
                            <button
                                style={{ gridColumn: 'span 1' }}
                                type="button"
                                onClick={this.processCurrentLayer}
                            >
                                run current
                            </button>
                            <button
                                style={{ gridColumn: 'span 1' }}
                                type="button"
                                onClick={this.saveEfxToAllLayers}
                            >
                                copy efx
                            </button>
                            <button
                                style={{ gridColumn: 'span 1' }}
                                type="button"
                                onClick={this.processAllLayers}
                            >
                                run all layers
                            </button>
                            <button
                                style={{ gridColumn: 'span 1' }}
                                type="button"
                                onClick={this.saveFrame}
                                disabled={isLoading}
                            >
                                save frame
                            </button>
                        </Fragment>
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
                        <Fragment>
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
                        </Fragment>
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
                    const { Component, displayName } = foundFilter;

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

    return {
        globalSettings: options,
        currentLayerID: id,
        allOriginalLines,
        allLayers,
        filters,
        isLoading
    };
};

export default connect(mapStateToProps)(EfxSidebar);
