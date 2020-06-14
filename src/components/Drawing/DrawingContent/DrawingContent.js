import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { LayerType, LineType } from 'customPropTypes';
import { getShowPoints } from 'store/global/globalSelectors';
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
import {
    addMultipleLinesToLayerByID,
    erasePointsAtCoords
} from '../../../store/line/lineActions';

import styles from './DrawingContent.styles.css';

export class DrawingContent extends React.Component {
    constructor(props) {
        super(props);
        this.drawDivRef = React.createRef();
        this.tempLinesRef = React.createRef();
        this.tempCoords = null;
        this.originalTextLines = null;
        this.tempTextLines = null;
        this.textStart = null;
        this.shiftDown = false;
        this.startCoords = null;
    }

    componentDidMount() {
        this.addClickHandlers();
        this.addKeyHandlers();
    }

    componentDidUpdate(prevProps) {
        const {
            angle,
            showPreviewLines,
            distanceBetweenLines,
            hullCoords,
            distanceBetweenPoints,
            lineMode,
            randomLineDensity,
            drawWithShift
        } = this.props;

        const { shiftDown } = this;

        if (drawWithShift === false && shiftDown) {
            this.shiftDown = false;
        }

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

    setTempCoords = (tempCoords) => {
        this.tempCoords = tempCoords;
        this.drawOnTempLinesDiv();
    };

    setStartCoords = (startCoords) => {
        this.startCoords = startCoords;
    };

    handleKeyDown = () => {
        const { drawWithShift } = this.props;
        this.shiftDown = true;
        if (!drawWithShift) {
            return;
        }
        this.setTempCoords([]);
    };

    handleKeyUp = () => {
        const { tempCoords } = this;
        const { drawWithShift } = this.props;
        this.shiftDown = false;
        if (!drawWithShift) {
            return;
        }

        this.processFinalCoords(tempCoords);
        this.setTempCoords(null);
    };

    startDrawing = (event) => {
        const coordsAtEvent = this.getCoordsFromMouseEvent(event);
        this.setTempCoords([coordsAtEvent]);
    };

    continueDrawing = (event) => {
        const { drawingMode } = this.props;
        const { tempCoords } = this;

        if (tempCoords == null) {
            return;
        }

        const coordsAtEvent = this.getCoordsFromMouseEvent(event);

        if (drawingMode === 'text') {
            this.continueTextDrawing(coordsAtEvent);
        }

        this.setTempCoords([...tempCoords, coordsAtEvent]);
    };

    endDrawing = (event) => {
        const { tempCoords } = this;

        const coordsAtEvent = this.getCoordsFromMouseEvent(event);
        const finalCoords = [...tempCoords, coordsAtEvent];
        // dispatch send line to redux here

        this.processFinalCoords(finalCoords);
        this.endTextDrawing();
        this.setTempCoords(null);
    };

    continueTextDrawing = (coordsAtEvent) => {
        const { tempCoords, tempTextLines, originalTextLines } = this;

        if (tempTextLines == null) {
            const endProcessor = this.getDrawingEndProcessor();
            const processedTextLines = endProcessor(tempCoords, this.props);
            this.originalTextLines = processedTextLines;
            this.tempTextLines = processedTextLines;
            this.textStart = coordsAtEvent;
        } else {
            const [newX, newY] = coordsAtEvent;
            const [oldX, oldY] = this.textStart;
            const xDiff = newX - oldX;
            const yDiff = newY - oldY;
            const movedLines = originalTextLines.map((line) => {
                return line.map(([x, y]) => {
                    return [x + xDiff, y + yDiff];
                });
            });
            this.tempTextLines = movedLines;
        }
    };

    endTextDrawing = () => {
        this.tempTextLines = null;
        this.originalTextLines = null;
        this.textStart = null;
    };

    // switch everything in here
    processFinalCoords = (finalCoords) => {
        const {
            drawingMode,
            dispatch,
            currentLayerID,
            eraserRadius
        } = this.props;

        const endProcessor = this.getDrawingEndProcessor();
        const processedLines = endProcessor(finalCoords, this.props);
        this.setTempCoords(null);

        if (drawingMode === 'text') {
            dispatch(
                addMultipleLinesToLayerByID(currentLayerID, processedLines)
            );
            return;
        }

        if (drawingMode === 'eraser') {
            dispatch(
                erasePointsAtCoords(
                    currentLayerID,
                    processedLines,
                    eraserRadius
                )
            );
            return;
        }

        dispatch(addMultipleLinesToLayerByID(currentLayerID, [processedLines]));

        this.setTempCoords(null);
    };

    getDrawingEndProcessor = () => {
        const {
            formatTempCoords,
            formatFinalCoords
        } = this.getActiveModeHandlers();

        if (formatFinalCoords != null) {
            return formatFinalCoords;
        }

        return formatTempCoords;
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

    handleKeyDown = (event) => {
        const { drawWithShift } = this.props;

        if (event.key === 'Shift' && drawWithShift) {
            this.shiftDown = true;
            this.setTempCoords([]);
        }
    };

    handleKeyUp = (event) => {
        const { drawWithShift } = this.props;
        const { tempCoords } = this;

        if (event.key === 'Shift' && drawWithShift) {
            this.shiftDown = false;
            console.log(tempCoords);
            this.processFinalCoords(tempCoords);
        }
    };

    getCoordsFromMouseEvent = (event) => {
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

    // handleStartSwitch = (event) => {
    //     const { drawingMode } = this.props;
    //     switch (drawingMode) {
    //         case 'select':
    //             // this.handleSelectStart(event);
    //             break;
    //         default:
    //             this.handleDrawStart(event);
    //     }
    // };

    // handleDrawStart = (event) => {
    //     const startCoords = this.getCoordsFromMouseEvent(event);
    //     const { onStart } = this.getActiveModeHandlers();
    //     const tempCoords = onStart(startCoords, null, {
    //         ...this.props
    //     });
    //     this.setTempCoords(tempCoords);
    //     this.setStartCoords(startCoords);
    // };

    // handleMoveSwitch = (event) => {
    //     const { drawingMode, drawWithShift } = this.props;
    //     const { shiftDown } = this.state;

    //     if (drawWithShift) {
    //         if (shiftDown) {
    //             this.handleKeydownMove(event);
    //             return;
    //         }

    //         return;
    //     }

    //     switch (drawingMode) {
    //         case 'select':
    //             // this.handleSelectMove(event);
    //             break;
    //         default:
    //             this.handleDrawMove(event);
    //     }
    // };

    // handleDrawMove = (event) => {
    //     const { tempCoords, startCoords } = this;

    //     if (!tempCoords) {
    //         return;
    //     }

    //     const { onMove } = this.getActiveModeHandlers();
    //     const coords = this.getCoordsFromMouseEvent(event);
    //     const newTempLines = onMove(coords, tempCoords, {
    //         ...this.props,
    //         startCoords
    //     });
    //     this.setTempCoords(newTempLines);
    // };

    // handleEndSwitch = (event) => {
    //     const { drawingMode } = this.props;
    //     switch (drawingMode) {
    //         case 'select':
    //             this.handleSelectEnd(event);
    //             break;
    //         case 'selectPoly':
    //             this.handleSelectPolyEnd(event);
    //             break;
    //         default:
    //             this.handleDrawEnd(event);
    //     }
    // };

    // handleDrawEnd = (event) => {
    //     const { dispatch } = this.props;
    //     const { tempCoords } = this;

    //     if (!tempCoords) {
    //         return;
    //     }

    //     const coords = this.getCoordsFromMouseEvent(event);
    //     const { onEnd } = this.getActiveModeHandlers();

    //     onEnd(coords, tempCoords, this.props, dispatch);
    //     this.setTempCoords(null);
    //     this.setStartCoords(null);
    // };

    // handleKeydownMove = (event) => {
    //     const { tempCoords, startCoords } = this;

    //     if (!tempCoords) {
    //         return;
    //     }

    //     const coords = this.getCoordsFromMouseEvent(event);
    //     if (tempCoords.length === 0) {
    //         this.setTempCoords([[coords]]);
    //         return;
    //     }

    //     const { onMove } = this.getActiveModeHandlers();
    //     const newTempLines = onMove(coords, tempCoords, {
    //         ...this.props,
    //         startCoords
    //     });
    //     this.setTempCoords(newTempLines);
    // };

    // handleKeyupEnd = () => {
    //     const { dispatch } = this.props;
    //     const { tempCoords } = this;

    //     if (!tempCoords) {
    //         return;
    //     }

    //     const tempLine = getFirstLineFromTempLines(tempCoords);
    //     const lastCoords = tempLine[tempLine.length - 1];
    //     tempLine.pop();
    //     const { onEnd } = this.getActiveModeHandlers();
    //     onEnd(lastCoords, [tempLine], this.props, dispatch);
    //     this.setTempCoords(null);
    //     this.setStartCoords(null);
    // };

    // handleSelectEnd = (event) => {
    //     const { selectCoords, dispatch } = this.props;

    //     if (!selectCoords) {
    //         return;
    //     }

    //     const { onEnd } = this.getActiveModeHandlers();
    //     const coords = this.getCoordsFromMouseEvent(event);

    //     const newSelectCoords = onEnd(coords, selectCoords, this.props);
    //     const hullCoords = hull(newSelectCoords, 20);
    //     dispatch(
    //         setSelectCoords({ selectCoords: newSelectCoords, hullCoords })
    //     );
    // };

    // handleSelectPolyEnd = (event) => {
    //     const { selectCoords, dispatch } = this.props;

    //     if (!selectCoords) {
    //         return;
    //     }

    //     const { onEnd } = this.getActiveModeHandlers();
    //     const coords = this.getCoordsFromMouseEvent(event);

    //     const newSelectCoords = onEnd(coords, selectCoords, this.props);
    //     const hullCoords = _.clone(newSelectCoords);

    //     dispatch(
    //         setSelectCoords({ selectCoords: newSelectCoords, hullCoords })
    //     );
    // };

    drawOnTempLinesDiv() {
        const { tempLinesRef, tempCoords, tempTextLines } = this;
        const { width, height, drawingMode, eraserRadius } = this.props;
        const context = tempLinesRef.current.getContext('bitmaprenderer');
        const offScreenCanvas = new OffscreenCanvas(width, height);
        const offScreenContext = offScreenCanvas.getContext('2d');

        offScreenContext.save();
        // offScreenContext.scale(pixelRatio, pixelRatio);
        offScreenContext.clearRect(0, 0, width, height);

        if (drawingMode === 'text' && tempTextLines && tempTextLines.length) {
            tempTextLines.forEach((textLine) => {
                offScreenContext.strokeStyle = 'black';

                offScreenContext.beginPath();
                // add strokewidth to lines
                offScreenContext.lineWidth = 3;
                offScreenContext.lineJoin = 'miter';

                for (let index = 0; index < textLine.length; index += 1) {
                    const [currentX, currentY] = textLine[index];
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

        if (
            tempCoords &&
            tempCoords.length > 1 &&
            drawingMode !== 'eraser' &&
            drawingMode !== 'text'
        ) {
            const { formatTempCoords } = this.getActiveModeHandlers();
            const formattedTempCoords = formatTempCoords(
                tempCoords,
                this.props
            );

            offScreenContext.strokeStyle = 'black';

            offScreenContext.beginPath();
            // add strokewidth to lines
            offScreenContext.lineWidth = 3;
            offScreenContext.lineJoin = 'miter';

            for (
                let index = 0;
                index < formattedTempCoords.length;
                index += 1
            ) {
                const [currentX, currentY] = formattedTempCoords[index];
                if (currentX != null && currentY != null) {
                    if (index === 0) {
                        offScreenContext.moveTo(currentX, currentY);
                    }
                    offScreenContext.lineTo(currentX, currentY);
                }
            }

            offScreenContext.stroke();
        }

        if (tempCoords && tempCoords.length && drawingMode === 'eraser') {
            offScreenContext.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            offScreenContext.beginPath();
            // add strokewidth to lines
            offScreenContext.lineWidth = eraserRadius;
            offScreenContext.lineCap = 'round';
            offScreenContext.lineJoin = 'round';

            for (let index = 0; index < tempCoords.length; index += 1) {
                const [currentX, currentY] = tempCoords[index];
                if (currentX != null && currentY != null) {
                    if (index === 0) {
                        offScreenContext.moveTo(currentX, currentY);
                    }
                    offScreenContext.lineTo(currentX, currentY);
                }
            }

            offScreenContext.stroke();
        }

        offScreenContext.restore();
        const offscreenBitmap = offScreenCanvas.transferToImageBitmap();
        context.transferFromImageBitmap(offscreenBitmap);
    }

    addClickHandlers() {
        const {
            drawDivRef: { current },
            startDrawing,
            continueDrawing,
            endDrawing
        } = this;
        current.addEventListener('mousedown', startDrawing, false);
        current.addEventListener('mousemove', continueDrawing, false);
        current.addEventListener('mouseup', endDrawing, false);
    }

    addKeyHandlers() {
        const { handleKeyDown, handleKeyUp } = this;
        document.addEventListener('keydown', handleKeyDown, false);
        document.addEventListener('keyup', handleKeyUp, false);
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
            mainMode,
            showPoints
        } = this.props;

        return (
            <div
                id="drawingContent"
                style={{ height, width }}
                className={styles.container}
            >
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
                            (layer) => layer.id === layerID
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
                                showPoints={showPoints}
                            />
                        );
                    }
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { color } = getCurrentLayer(state);
    const visibleOriginalLines = getVisibleOriginalLines(state);
    const visibleLayers = getVisibleLayers(state);
    const currentLayerID = getCurrentLayerID(state);
    const options = getCurrentOptions(state);
    const showPoints = getShowPoints(state);

    return {
        ...options,
        currentLayerID,
        currentLayerColor: color,
        visibleLayers,
        visibleOriginalLines,
        ...state.drawingReducer,
        ...state.drawingReducer.selectOptions,
        drawingMode: state.drawingReducer.mode,
        showPoints
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
