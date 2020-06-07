import React from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { ActionCreators } from 'redux-undo';
import PropTypes from 'prop-types';
import {
    selectMainMode,
    selectDrawMode,
    setSelectOptionByKey,
    setOptionByKey,
    setSelectCoords
} from 'store/drawing/drawingActions';
import { getCurrentOptions } from 'store/onions/onionsSelectors';
import { getCurrentLayerID } from 'store/layer/layerSelectors';
import {
    shrinkCanvas,
    addMultipleLinesToLayerByID,
    deleteFillLinesFromLayerByID
} from 'store/line/lineActions';
import {
    SidebarContainer,
    SidebarItem
} from 'components/common/SidebarContainer';
import PercentClicker from 'components/common/PercentClicker';
import { EnabledToggleButton } from 'components/common/SidebarButton';
import { applyTemplate } from './TemplateUtils';

import TemplateOptions from './TemplateOptions';
import TextOptions from './TextOptions';
import EraserOptions from './EraserOptions';
import ShrinkCanvasOptions from './ShrinkCanvasOptions';
import MultiplyCanvasOptions from './MultiplyCanvasOptions';
import CircleOptions from './CircleOptions';

const MAIN_MODES = ['draw', 'select', 'scale', 'template'];
const DRAWING_MODES = [
    'pen',
    'eraser',
    'straightLine',
    'square',
    'circle',
    'text'
];
const SELECT_MODES = ['pen', 'square', 'circle'];
const SCALE_MODES = ['shrinkCanvas', 'multiplyCanvas'];

class DrawingSidebar extends React.Component {
    componentDidMount() {
        const { dispatch } = this.props;

        ipcRenderer.on('keystroke:undo', () => {
            dispatch(ActionCreators.undo());
        });
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners('keystroke:undo');
    }

    printFillLines = () => {
        const { fillLines, currentLayerID, dispatch } = this.props;
        dispatch(addMultipleLinesToLayerByID(currentLayerID, fillLines));
        this.clearSelection();
    };

    deleteLinesInSelection = () => {
        const { selectCoords, currentLayerID, dispatch } = this.props;
        dispatch(
            deleteFillLinesFromLayerByID(currentLayerID, selectCoords, true)
        );
        this.clearSelection();
    };

    deleteLinesOutsideSelection = () => {
        const { selectCoords, currentLayerID, dispatch } = this.props;
        dispatch(
            deleteFillLinesFromLayerByID(currentLayerID, selectCoords, false)
        );
        this.clearSelection();
    };

    addTemplateToCurrentLayer = (templateName) => {
        const { dispatch } = this.props;
        applyTemplate({ templateName, options: this.props, dispatch });
    };

    clearSelection = () => {
        const { dispatch } = this.props;
        dispatch(
            setSelectCoords({
                selectCoords: [],
                hullCoords: []
            })
        );
    };

    onShrinkCanvas = (factor) => {
        const { dispatch } = this.props;
        dispatch(
            shrinkCanvas({
                factor
            })
        );
    };

    render() {
        const {
            mainMode,
            mode,
            distanceBetweenLines,
            distanceBetweenPoints,
            lineMode,
            randomLineDensity,
            showPreviewLines,
            pointsOnEachLine,
            dispatch
        } = this.props;

        return (
            <SidebarContainer>
                <SidebarItem title="drawing type" height={2}>
                    {MAIN_MODES.map((modeKey) => {
                        return (
                            <button
                                style={{ gridColumn: 'span 1' }}
                                key={modeKey}
                                type="button"
                                disabled={mainMode === modeKey}
                                onClick={() => {
                                    dispatch(selectMainMode(modeKey));
                                }}
                            >
                                {modeKey}
                            </button>
                        );
                    })}
                </SidebarItem>
                <SidebarItem title="tool" height={2}>
                    {mainMode === 'draw' &&
                        DRAWING_MODES.map((modeKey) => {
                            return (
                                <button
                                    style={{ gridColumn: 'span 2' }}
                                    key={modeKey}
                                    type="button"
                                    disabled={mode === modeKey}
                                    onClick={() => {
                                        dispatch(selectDrawMode(modeKey));
                                    }}
                                >
                                    {modeKey}
                                </button>
                            );
                        })}
                    {mainMode === 'select' &&
                        SELECT_MODES.map((modeKey) => {
                            return (
                                <button
                                    style={{ gridColumn: 'span 2' }}
                                    key={modeKey}
                                    type="button"
                                    disabled={mode === modeKey}
                                    onClick={() => {
                                        dispatch(selectDrawMode(modeKey));
                                    }}
                                >
                                    {modeKey}
                                </button>
                            );
                        })}
                    {mainMode === 'scale' &&
                        SCALE_MODES.map((modeKey) => {
                            return (
                                <button
                                    style={{ gridColumn: 'span 2' }}
                                    key={modeKey}
                                    type="button"
                                    disabled={mode === modeKey}
                                    onClick={() => {
                                        dispatch(selectDrawMode(modeKey));
                                    }}
                                >
                                    {modeKey}
                                </button>
                            );
                        })}
                </SidebarItem>
                {mainMode === 'draw' && mode === 'text' && (
                    <TextOptions {...this.props} />
                )}
                {mainMode === 'draw' && mode === 'eraser' && (
                    <EraserOptions {...this.props} />
                )}
                {mode === 'circle' && <CircleOptions {...this.props} />}
                {mainMode === 'draw' &&
                    (mode === 'straightLine' || mode === 'square') && (
                        <SidebarItem title="text options" height={2}>
                            <PercentClicker
                                setValue={(value) => {
                                    dispatch(
                                        setOptionByKey({
                                            key: 'pointsOnEachLine',
                                            value
                                        })
                                    );
                                }}
                                float={false}
                                title="points on each line"
                                minLabel="2"
                                maxLabel="50"
                                minValue={2}
                                maxValue={50}
                                currentValue={pointsOnEachLine}
                            />
                        </SidebarItem>
                    )}
                {mainMode === 'select' && (
                    <SidebarItem title="select options" height={2}>
                        select options
                        <PercentClicker
                            setValue={(value) => {
                                dispatch(
                                    setSelectOptionByKey({
                                        key: 'distanceBetweenLines',
                                        value
                                    })
                                );
                            }}
                            float={false}
                            title="distance between lines"
                            minLabel="1"
                            maxLabel="15"
                            minValue={1}
                            maxValue={15}
                            currentValue={distanceBetweenLines}
                        />
                        <PercentClicker
                            setValue={(value) => {
                                dispatch(
                                    setSelectOptionByKey({
                                        key: 'distanceBetweenPoints',
                                        value
                                    })
                                );
                            }}
                            float={false}
                            title="distance between points"
                            minLabel="1"
                            maxLabel="15"
                            minValue={1}
                            maxValue={15}
                            currentValue={distanceBetweenPoints}
                        />
                        <PercentClicker
                            setValue={(value) => {
                                dispatch(
                                    setSelectOptionByKey({
                                        key: 'randomLineDensity',
                                        value
                                    })
                                );
                            }}
                            float={false}
                            title="random line density"
                            minLabel="1"
                            maxLabel="10"
                            minValue={1}
                            maxValue={10}
                            currentValue={randomLineDensity}
                        />
                        <EnabledToggleButton
                            style={{ gridColumn: 'span 2' }}
                            onClick={() => {
                                dispatch(
                                    setSelectOptionByKey({
                                        key: 'showPreviewLines',
                                        value: !showPreviewLines
                                    })
                                );
                            }}
                            active={showPreviewLines}
                            labelActive="ON"
                            labelInactive="OFF"
                        />
                        <button
                            style={{ gridColumn: 'span 2' }}
                            type="button"
                            disabled={lineMode === 'vertical'}
                            onClick={() => {
                                dispatch(
                                    setSelectOptionByKey({
                                        key: 'lineMode',
                                        value: 'vertical'
                                    })
                                );
                            }}
                        >
                            vertical
                        </button>
                        <button
                            style={{ gridColumn: 'span 2' }}
                            type="button"
                            disabled={lineMode === 'horizontal'}
                            onClick={() => {
                                dispatch(
                                    setSelectOptionByKey({
                                        key: 'lineMode',
                                        value: 'horizontal'
                                    })
                                );
                            }}
                        >
                            horizontal
                        </button>
                        <button
                            style={{ gridColumn: 'span 2' }}
                            type="button"
                            disabled={lineMode === 'random'}
                            onClick={() => {
                                dispatch(
                                    setSelectOptionByKey({
                                        key: 'lineMode',
                                        value: 'random'
                                    })
                                );
                            }}
                        >
                            random
                        </button>
                        <button
                            style={{ gridColumn: 'span 2' }}
                            type="button"
                            onClick={() => {
                                this.clearSelection();
                            }}
                        >
                            clear selection
                        </button>
                        <button
                            style={{ gridColumn: 'span 2' }}
                            type="button"
                            onClick={() => {
                                this.printFillLines();
                            }}
                        >
                            print selection
                        </button>
                        <button
                            style={{ gridColumn: 'span 4' }}
                            type="button"
                            onClick={() => {
                                this.deleteLinesInSelection();
                            }}
                        >
                            delete points outside selection
                        </button>
                        <button
                            style={{ gridColumn: 'span 4' }}
                            type="button"
                            onClick={() => {
                                this.deleteLinesOutsideSelection();
                            }}
                        >
                            delete points inside selection
                        </button>
                    </SidebarItem>
                )}
                {mainMode === 'scale' && mode === 'multiplyCanvas' && (
                    <MultiplyCanvasOptions {...this.props} />
                )}
                {mainMode === 'scale' && mode === 'shrinkCanvas' && (
                    <ShrinkCanvasOptions
                        onShrinkCanvas={this.onShrinkCanvas}
                        {...this.props}
                    />
                )}
                {mainMode === 'template' && (
                    <TemplateOptions
                        addTemplateToCurrentLayer={
                            this.addTemplateToCurrentLayer
                        }
                    />
                )}
            </SidebarContainer>
        );
    }
}

const mapStateToProps = (state) => {
    const options = getCurrentOptions(state);

    const currentLayerID = getCurrentLayerID(state);

    return {
        currentLayerID,
        globalSettings: options,
        globalHeight: options.height,
        globalWidth: options.width,
        ...state.drawingReducer,
        ...state.drawingReducer.selectOptions
    };
};

export default connect(mapStateToProps)(DrawingSidebar);

DrawingSidebar.defaultProps = {};

DrawingSidebar.propTypes = {
    dispatch: PropTypes.func.isRequired
};
