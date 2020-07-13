import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { ActionCreators } from 'redux-undo';
import {
    selectMainMode,
    selectDrawMode,
    setOptionByKey
} from 'store/drawing/drawingActions';
import { getCurrentOptions } from 'store/options/optionsSelectors';
import { getCurrentLayerID } from 'store/layer/layerSelectors';
import {
    SidebarContainer,
    SidebarItem
} from 'components/common/SidebarContainer/SidebarContainer';
import PercentClicker from 'components/common/PercentClicker/PercentClicker';
import {
    EnabledToggleButton,
    EmojiButton
} from 'components/common/SidebarButton/SidebarButton';
import { applyTemplate } from './TemplateUtils';

import TemplateOptions from './TemplateOptions';
import FillOptions from './FillOptions';
import SelectOptions from './SelectOptions';
import TextOptions from './TextOptions';
import EraserOptions from './EraserOptions';
import ShrinkCanvasOptions from './ShrinkCanvasOptions';
import MultiplyCanvasOptions from './MultiplyCanvasOptions';
import CircleOptions from './CircleOptions';

const MAIN_MODES = {
    draw: {
        displayName: 'tool',
        emoji: 'palette'
    },
    scale: {
        displayName: 'scale',
        emoji: 'magnifyingglass'
    },
    template: {
        displayName: 'template',
        emoji: 'fax'
    }
};

const DRAWING_MODES = {
    pen: {
        displayName: 'pen',
        emoji: 'fountainpen'
    },
    fill: {
        displayName: 'fill brush',
        emoji: 'brush'
    },
    eraser: {
        displayName: 'eraser',
        emoji: 'prohibited'
    },
    straightLine: {
        displayName: 'line shape',
        emoji: 'minus'
    },
    square: {
        displayName: 'square shape',
        emoji: 'blacksquare'
    },
    circle: {
        displayName: 'circle shape',
        emoji: 'blackcircle'
    },
    text: {
        displayName: 'text',
        emoji: 'letters'
    }
};

// unavailable for now
// const SELECT_MODES = ['pen', 'square', 'circle'];

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

    addTemplateToCurrentLayer = (templateName) => {
        const { dispatch } = this.props;
        applyTemplate({ templateName, options: this.props, dispatch });
    };

    render() {
        const {
            mainMode,
            mode,
            pointsOnEachLine,
            fillSquareAndCircle,
            dispatch
        } = this.props;

        const showFillOptions =
            (mainMode === 'draw' && mode === 'fill') ||
            (mainMode === 'draw' &&
                (mode === 'square' || mode === 'circle') &&
                fillSquareAndCircle);

        return (
            <SidebarContainer>
                <SidebarItem title="drawing mode" height={2}>
                    {_.keys(MAIN_MODES).map((modeKey) => {
                        const { displayName, emoji } = MAIN_MODES[modeKey];
                        return (
                            <EmojiButton
                                key={modeKey}
                                style={{ gridColumn: 'span 2' }}
                                text={displayName}
                                disabled={mainMode === modeKey}
                                emoji={emoji}
                                onClick={() => {
                                    dispatch(selectMainMode(modeKey));
                                }}
                            />
                        );
                    })}
                </SidebarItem>
                <SidebarItem
                    title={`${_.lowerCase(mainMode)} options`}
                    height={2}
                >
                    {mainMode === 'draw' &&
                        _.keys(DRAWING_MODES).map((modeKey) => {
                            const { displayName, emoji } = DRAWING_MODES[
                                modeKey
                            ];
                            return (
                                <EmojiButton
                                    key={modeKey}
                                    style={{ gridColumn: 'span 2' }}
                                    text={displayName}
                                    emoji={emoji}
                                    disabled={mode === modeKey}
                                    onClick={() => {
                                        dispatch(selectDrawMode(modeKey));
                                    }}
                                />
                            );
                        })}
                    {mainMode === 'scale' && (
                        <>
                            <EmojiButton
                                style={{ gridColumn: 'span 2' }}
                                text="shrink"
                                emoji="chartdecreasing"
                                disabled={mode === 'shrinkCanvas'}
                                onClick={() => {
                                    dispatch(selectDrawMode('shrinkCanvas'));
                                }}
                            />

                            <EmojiButton
                                style={{ gridColumn: 'span 2' }}
                                text="multiply"
                                emoji="chartincreasing"
                                disabled={mode === 'multiplyCanvas'}
                                onClick={() => {
                                    dispatch(selectDrawMode('shrinkCanvas'));
                                }}
                            />
                        </>
                    )}
                    {mainMode === 'template' && (
                        <TemplateOptions
                            addTemplateToCurrentLayer={
                                this.addTemplateToCurrentLayer
                            }
                        />
                    )}
                </SidebarItem>
                {mainMode === 'draw' && mode === 'text' && (
                    <>
                        <TextOptions {...this.props} />
                        <FillOptions />
                    </>
                )}
                {mainMode === 'draw' && mode === 'eraser' && (
                    <EraserOptions {...this.props} />
                )}
                {['square', 'circle'].includes(mode) && (
                    <SidebarItem title="shape options" height={2}>
                        <EnabledToggleButton
                            style={{ gridColumn: 'span 4' }}
                            onClick={() => {
                                dispatch(
                                    setOptionByKey({
                                        key: 'fillSquareAndCircle',
                                        value: !fillSquareAndCircle
                                    })
                                );
                            }}
                            active={fillSquareAndCircle}
                            labelActive="Fill Shape On"
                            labelInactive="Fill Shape Off"
                        />
                    </SidebarItem>
                )}
                {showFillOptions && <FillOptions />}
                {mode === 'circle' && <CircleOptions {...this.props} />}
                {mainMode === 'draw' &&
                    (mode === 'straightLine' || mode === 'square') && (
                        <SidebarItem title="line options" height={2}>
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
                {mainMode === 'scale' && mode === 'multiplyCanvas' && (
                    <MultiplyCanvasOptions {...this.props} />
                )}
                {mainMode === 'scale' && mode === 'shrinkCanvas' && (
                    <ShrinkCanvasOptions {...this.props} />
                )}
                {/* unavailable for now */}
                {mainMode === 'select' && <SelectOptions />}
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
        ...state.drawingReducer
    };
};

export default connect(mapStateToProps)(DrawingSidebar);
