import React from 'react';
import { connect } from 'react-redux';

import { getShowPoints } from 'store/global/globalSelectors';
import { getVisibleOriginalLines } from 'store/line/lineSelectors';
import { getCurrentOptions } from 'store/options/optionsSelectors';

import {
    getCurrentLayer,
    getCurrentLayerID,
    getVisibleLayers
} from 'store/layer/layerSelectors';
import { CanvasLayer, SelectLayer } from 'components/common/SvgLayer/SvgLayer';
import {
    printLinesViaFillCoords,
    printFillLinesForSquare,
    printFillLinesForCircle
} from '../../../utils/lineUtils';
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

    componentDidUpdate() {
        const { shiftToDraw } = this.props;
        const { shiftDown } = this;

        if (shiftToDraw === false && shiftDown) {
            this.shiftDown = false;
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
        const { shiftToDraw } = this.props;
        this.shiftDown = true;
        if (!shiftToDraw) {
            return;
        }
        this.setTempCoords([]);
    };

    handleKeyUp = () => {
        const { tempCoords } = this;
        const { shiftToDraw } = this.props;
        this.shiftDown = false;
        if (!shiftToDraw) {
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

    processFinalCoords = (finalCoords) => {
        const {
            drawingMode,
            dispatch,
            currentLayerID,
            eraserRadius,
            fillRadius,
            fillCircle,
            fillAngle,
            distanceBetweenLines,
            distanceBetweenPoints,
            fillSquareAndCircle
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

        if (drawingMode === 'fill') {
            const resultingLines = printLinesViaFillCoords({
                fillCircle,
                fillCoords: processedLines,
                radius: fillRadius,
                distanceBetweenLines,
                distanceBetweenPoints,
                angle: fillAngle
            });
            dispatch(
                addMultipleLinesToLayerByID(currentLayerID, resultingLines)
            );
            return;
        }

        if (drawingMode === 'square' && fillSquareAndCircle) {
            const fillLines = printFillLinesForSquare({
                squareLine: processedLines,
                distanceBetweenLines,
                distanceBetweenPoints,
                angle: fillAngle
            });
            dispatch(
                addMultipleLinesToLayerByID(currentLayerID, [
                    processedLines,
                    ...fillLines
                ])
            );
            return;
        }

        if (drawingMode === 'circle' && fillSquareAndCircle) {
            const fillLines = printFillLinesForCircle({
                circleLine: processedLines,
                distanceBetweenLines,
                distanceBetweenPoints,
                angle: fillAngle
            });
            dispatch(
                addMultipleLinesToLayerByID(currentLayerID, [
                    processedLines,
                    ...fillLines
                ])
            );
            return;
        }

        dispatch(addMultipleLinesToLayerByID(currentLayerID, [processedLines]));
    };

    getDrawingEndProcessor = () => {
        const { formatTempCoords, formatFinalCoords } =
            this.getActiveModeHandlers();

        if (formatFinalCoords != null) {
            return formatFinalCoords;
        }

        return formatTempCoords;
    };

    handleKeyDown = (event) => {
        const { shiftToDraw } = this.props;

        if (event.key === 'Shift' && shiftToDraw) {
            this.shiftDown = true;
            this.setTempCoords([]);
        }
    };

    handleKeyUp = (event) => {
        const { shiftToDraw } = this.props;
        const { tempCoords } = this;

        if (event.key === 'Shift' && shiftToDraw) {
            this.shiftDown = false;
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

    drawOnTempLinesDiv() {
        const { tempLinesRef, tempCoords, tempTextLines } = this;
        const {
            width,
            height,
            drawingMode,
            eraserRadius,
            fillRadius,
            fillCircle
        } = this.props;
        if (!tempLinesRef || !tempLinesRef.current) {
            return;
        }

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
            drawingMode !== 'fill' &&
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

        if (tempCoords && tempCoords.length && drawingMode === 'fill') {
            offScreenContext.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            offScreenContext.beginPath();
            // add strokewidth to lines
            const lineCap = fillCircle ? 'round' : 'butt';

            offScreenContext.lineWidth = fillRadius * 2;
            offScreenContext.lineCap = lineCap;
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
            showPoints,
            pointShowRadius,
            pointShowColor
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
                                pointShowColor={pointShowColor}
                                pointShowRadius={pointShowRadius}
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
        drawingMode: state.drawingReducer.mode,
        showPoints
    };
};

export default connect(mapStateToProps)(DrawingContent);
