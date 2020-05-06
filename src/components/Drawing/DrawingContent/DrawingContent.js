import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import hull from 'hull.js';
import { LayerType, LineType } from 'customPropTypes';
import { addMultipleLinesToLayerByID } from 'store/line/lineActions';
import { getVisibleOriginalLines } from 'store/line/lineSelectors';
import { getCurrentOptions } from 'store/onions/onionsSelectors';
import { setSelectCoords, setFillLines } from 'store/drawing/drawingActions';
import {
    getCurrentLayer,
    getCurrentLayerID,
    getVisibleLayers
} from 'store/layer/layerSelectors';
import { CanvasLayer, SelectLayer } from 'components/common/SvgLayer';

import generateFillLines from 'utils/fillLineUtils';
import DrawingModes from '../modes';

import styles from './DrawingContent.styles.css';

export class DrawingContent extends React.Component {
    constructor(props) {
        super(props);
        this.drawDivRef = React.createRef();
        this.tempLinesRef = React.createRef();
        this.tempLines = null;
        this.startCoords = null;
    }

    componentDidMount() {
        this.addClickHandlers();
    }

    componentDidUpdate(prevProps) {
        const {
            angle,
            showPreviewLines,
            distanceBetweenLines,
            hullCoords,
            distanceBetweenPoints,
            lineMode,
            randomLineDensity
        } = this.props;
        if (
            prevProps.angle !== angle ||
            prevProps.lineMode !== lineMode ||
            prevProps.randomLineDensity !== randomLineDensity ||
            prevProps.distanceBetweenPoints !== distanceBetweenPoints ||
            prevProps.showPreviewLines !== showPreviewLines ||
            prevProps.distanceBetweenLines !== distanceBetweenLines ||
            !_.isEqual(prevProps.hullCoords, hullCoords)
        ) {
            this.setFillLines();
        }
    }

    setTempLines = tempLines => {
        this.tempLines = tempLines;
        this.drawOnTempLinesDiv();
    };

    setStartCoords = startCoords => {
        this.startCoords = startCoords;
    };

    setFillLines = () => {
        const { showPreviewLines, dispatch } = this.props;

        if (!showPreviewLines) {
            dispatch(setFillLines({ fillLines: [] }));
            return;
        }

        const fillLines = generateFillLines(this.props);
        dispatch(setFillLines({ fillLines }));
    };

    getCoordsFromMouseEvent = event => {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return [x, y];
    };

    getActiveModeHandlers = () => {
        const { drawingMode } = this.props;
        const activeMode = DrawingModes[drawingMode];
        return activeMode;
    };

    handleStartSwitch = event => {
        const { drawingMode } = this.props;
        switch (drawingMode) {
            case 'select':
                // this.handleSelectStart(event);
                break;
            default:
                this.handleDrawStart(event);
        }
    };

    handleDrawStart = event => {
        const startCoords = this.getCoordsFromMouseEvent(event);
        const { onStart } = this.getActiveModeHandlers();
        const tempLines = onStart(startCoords, null, {
            ...this.props
        });
        this.setTempLines(tempLines);
        this.setStartCoords(startCoords);
    };

    handleMoveSwitch = event => {
        const { drawingMode } = this.props;
        switch (drawingMode) {
            case 'select':
                // this.handleSelectMove(event);
                break;
            default:
                this.handleDrawMove(event);
        }
    };

    handleDrawMove = event => {
        const { tempLines, startCoords } = this;

        if (!tempLines) {
            return;
        }

        const { onMove } = this.getActiveModeHandlers();
        const coords = this.getCoordsFromMouseEvent(event);
        const newTempLines = onMove(coords, tempLines, {
            ...this.props,
            startCoords
        });
        this.setTempLines(newTempLines);
    };

    handleEndSwitch = event => {
        const { drawingMode } = this.props;
        switch (drawingMode) {
            case 'select':
                this.handleSelectEnd(event);
                break;
            case 'selectPoly':
                this.handleSelectPolyEnd(event);
                break;
            default:
                this.handleDrawEnd(event);
        }
    };

    getOptions = () => {
        const { currentLayerID } = this.props;

        return {
            currentLayerID
        };
    };

    handleDrawEnd = event => {
        const { dispatch } = this.props;
        const { tempLines } = this;

        if (!tempLines) {
            return;
        }

        const coords = this.getCoordsFromMouseEvent(event);
        const { onEnd } = this.getActiveModeHandlers();

        onEnd(coords, tempLines, this.props, dispatch);
        this.setTempLines(null);
        this.setStartCoords(null);
    };

    handleSelectEnd = event => {
        const { selectCoords, dispatch } = this.props;

        if (!selectCoords) {
            return;
        }

        const { onEnd } = this.getActiveModeHandlers();
        const coords = this.getCoordsFromMouseEvent(event);

        const newSelectCoords = onEnd(coords, selectCoords, this.props);
        const hullCoords = hull(newSelectCoords, 20);
        dispatch(
            setSelectCoords({ selectCoords: newSelectCoords, hullCoords })
        );
    };

    handleSelectPolyEnd = event => {
        const { selectCoords, dispatch } = this.props;

        if (!selectCoords) {
            return;
        }

        const { onEnd } = this.getActiveModeHandlers();
        const coords = this.getCoordsFromMouseEvent(event);

        const newSelectCoords = onEnd(coords, selectCoords, this.props);
        const hullCoords = _.clone(newSelectCoords);

        dispatch(
            setSelectCoords({ selectCoords: newSelectCoords, hullCoords })
        );
    };

    drawOnTempLinesDiv() {
        const { tempLinesRef, tempLines } = this;
        const { width, height } = this.props;
        const context = tempLinesRef.current.getContext('bitmaprenderer');
        const offScreenCanvas = new OffscreenCanvas(width, height);
        const offScreenContext = offScreenCanvas.getContext('2d');

        offScreenContext.save();
        // offScreenContext.scale(pixelRatio, pixelRatio);
        offScreenContext.clearRect(0, 0, width, height);

        if (tempLines && tempLines.length) {
            tempLines.forEach(pointArrays => {
                if (pointArrays.length <= 0) {
                    return;
                }

                offScreenContext.strokeStyle = 'black';

                offScreenContext.beginPath();
                // add strokewidth to lines
                offScreenContext.lineWidth = 3;
                offScreenContext.lineJoin = 'miter';

                for (let index = 0; index < pointArrays.length; index += 1) {
                    const [currentX, currentY] = pointArrays[index];
                    if (currentX != null && currentY != null) {
                        if (index === 0) {
                            offScreenContext.moveTo(currentX, currentY);
                        }
                        offScreenContext.lineTo(currentX, currentY);
                    }
                }

                offScreenContext.stroke();
            });
        }

        offScreenContext.restore();
        const offscreenBitmap = offScreenCanvas.transferToImageBitmap();
        context.transferFromImageBitmap(offscreenBitmap);
    }

    addClickHandlers() {
        const {
            drawDivRef: { current },
            handleStartSwitch,
            handleMoveSwitch,
            handleEndSwitch
        } = this;
        current.addEventListener('mousedown', handleStartSwitch, false);
        current.addEventListener('mousemove', handleMoveSwitch, false);
        current.addEventListener('mouseup', handleEndSwitch, false);
    }

    render() {
        const {
            selectCoords,
            hullCoords,
            height,
            width,
            visibleOriginalLines,
            visibleLayers,
            fillLines,
            mainMode
        } = this.props;

        return (
            <div style={{ height, width }} className={styles.container}>
                <div
                    style={{ height, width }}
                    ref={this.drawDivRef}
                    className={styles.drawingDiv}
                />
                <canvas
                    style={{ height, width }}
                    ref={this.tempLinesRef}
                    className={styles.tempLinesDiv}
                />

                {mainMode === 'select' && (
                    <SelectLayer
                        id="templine"
                        selectCoords={selectCoords}
                        hullCoords={hullCoords}
                        color="black"
                        strokeWidth={3}
                        fillLines={fillLines}
                    />
                )}

                {Object.entries(visibleOriginalLines).map(
                    ([layerID, layerLines]) => {
                        const { color } = visibleLayers.find(
                            layer => layer.id === layerID
                        );
                        return (
                            <CanvasLayer
                                key={layerID}
                                id={layerID}
                                width={width}
                                height={height}
                                lines={layerLines}
                                color={color}
                                strokeWidth={3}
                            />
                        );
                    }
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { color } = getCurrentLayer(state);
    const visibleOriginalLines = getVisibleOriginalLines(state);
    const visibleLayers = getVisibleLayers(state);
    const currentLayerID = getCurrentLayerID(state);
    const options = getCurrentOptions(state);

    return {
        ...options,
        currentLayerID,
        currentLayerColor: color,
        visibleLayers,
        visibleOriginalLines,
        ...state.drawingReducer,
        ...state.drawingReducer.selectOptions,
        drawingMode: state.drawingReducer.mode
    };
};

export default connect(mapStateToProps)(DrawingContent);

DrawingContent.defaultProps = {};

DrawingContent.propTypes = {
    currentLayerID: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    visibleLayers: PropTypes.arrayOf(LayerType).isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    visibleOriginalLines: PropTypes.shape({
        layerId: PropTypes.arrayOf(LineType)
    }).isRequired
};
