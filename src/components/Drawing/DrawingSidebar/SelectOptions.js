import React from 'react';
import { setOptionByKey, setSelectCoords } from 'store/drawing/drawingActions';
import { getCurrentLayerID } from 'store/layer/layerSelectors';
import {
    addMultipleLinesToLayerByID,
    deleteFillLinesFromLayerByID
} from 'store/line/lineActions';

import { EnabledToggleButton } from 'components/common/SidebarButton/SidebarButton';

import PercentClicker from 'components/common/PercentClicker/PercentClicker';
import { SidebarItem } from 'components/common/SidebarContainer/SidebarContainer';
import { connect } from 'react-redux';

class SelectOptions extends React.Component {
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

    clearSelection = () => {
        const { dispatch } = this.props;
        dispatch(
            setSelectCoords({
                selectCoords: [],
                hullCoords: []
            })
        );
    };

    render = () => {
        const {
            randomLineDensity,
            distanceBetweenLines,
            distanceBetweenPoints,
            showPreviewLines,
            lineMode,
            dispatch
        } = this.props;

        return (
            <SidebarItem title="select options" height={2}>
                select options
                <PercentClicker
                    setValue={(value) => {
                        dispatch(
                            setOptionByKey({
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
                            setOptionByKey({
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
                            setOptionByKey({
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
                            setOptionByKey({
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
                    disabled={lineMode === 'random'}
                    onClick={() => {
                        dispatch(
                            setOptionByKey({
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
        );
    };
}

const mapStateToProps = (state) => {
    const currentLayerID = getCurrentLayerID(state);

    return {
        currentLayerID,
        ...state.drawingReducer
    };
};

export default connect(mapStateToProps)(SelectOptions);
