import React, { useEffect, useRef } from 'react';
import {
    drawLines,
    drawPointCircles,
    prepareLines
} from '../../../utils/drawingUtils';

import * as styles from './SvgLayer.styles.css';

export const CanvasLayer = ({
    lines,
    color,
    width = 800,
    height = 600,
    strokeWidth,
    position = 'absolute',
    showPoints = false,
    pointShowColor = 'black',
    pointShowRadius = 3
}) => {
    const pixelRatio = window.devicePixelRatio;

    const canvas = useRef(null);

    useEffect(() => {
        try {
            if (lines.length === 0) return;
            const context = canvas.current.getContext('bitmaprenderer');
            const offScreenCanvas = new OffscreenCanvas(width, height);
            const offScreenContext = offScreenCanvas.getContext('2d');

            offScreenContext.save();
            offScreenContext.clearRect(0, 0, width, height);
            offScreenContext.strokeStyle = color;

            const formattedPointArrays = prepareLines(lines);
            drawLines({
                context: offScreenContext,
                pointArrays: formattedPointArrays,
                strokeWidth,
                color
            });

            // show points
            if (showPoints) {
                drawPointCircles({
                    context: offScreenContext,
                    pointArrays: formattedPointArrays,
                    radius: pointShowRadius,
                    color: pointShowColor
                });
            }

            offScreenContext.restore();
            const offscreenBitmap = offScreenCanvas.transferToImageBitmap();
            context.transferFromImageBitmap(offscreenBitmap);
        } catch (e) {
            console.error('***** line error *****');
            console.error(lines);
            console.error('***** line error *****');
        }
    }, [lines, showPoints, color]);

    const dw = Math.floor(pixelRatio * width);
    const dh = Math.floor(pixelRatio * height);
    const style = { width, height, position };

    return (
        <canvas
            className={styles.svgLayer}
            ref={canvas}
            width={dw}
            height={dh}
            style={style}
        />
    );
};

export const PenPositionLayer = ({
    penX = 0,
    penY = 0,
    width = 800,
    height = 600,
    position = 'absolute'
}) => {
    const pixelRatio = window.devicePixelRatio;

    const canvas = useRef(null);

    useEffect(() => {
        try {
            const context = canvas.current.getContext('bitmaprenderer');
            const offScreenCanvas = new OffscreenCanvas(width, height);
            const offScreenContext = offScreenCanvas.getContext('2d');

            offScreenContext.save();
            offScreenContext.clearRect(0, 0, width, height);
            offScreenContext.strokeStyle = 'black';
            offScreenContext.fillStyle = 'red';

            offScreenContext.fillRect(penX - 10, penY - 10, 20, 20);
            offScreenContext.strokeRect(penX - 10, penY - 10, 20, 20);

            offScreenContext.restore();
            const offscreenBitmap = offScreenCanvas.transferToImageBitmap();
            context.transferFromImageBitmap(offscreenBitmap);
        } catch (e) {
            console.error('***** line error *****');
            console.error('***** line error *****');
        }
    }, [penX, penY]);

    const dw = Math.floor(pixelRatio * width);
    const dh = Math.floor(pixelRatio * height);
    const style = { width, height, position, zIndex: 50 };

    return (
        <canvas
            className={styles.svgLayer}
            ref={canvas}
            width={dw}
            height={dh}
            style={style}
        />
    );
};

export const CombinedLayer = ({
    layers,
    width = 800,
    height = 600,
    blobCallback = () => {},
    position = 'absolute',
    showPoints = false,
    pointShowColor = 'black',
    pointShowRadius = 3
}) => {
    const pixelRatio = window.devicePixelRatio;
    const canvas = useRef(null);

    useEffect(() => {
        try {
            const context = canvas.current.getContext('bitmaprenderer');
            const offScreenCanvas = new OffscreenCanvas(width, height);
            const offScreenContext = offScreenCanvas.getContext('2d');

            offScreenContext.save();
            offScreenContext.clearRect(0, 0, width, height);
            if (layers.length >= 0) {
                layers.forEach(({ efxLines, color }) => {
                    if (efxLines.length === 0) return;
                    const formattedLines = prepareLines(efxLines);
                    drawLines({
                        context: offScreenContext,
                        pointArrays: formattedLines,
                        strokeWidth: 3,
                        color
                    });

                    // show points
                    if (showPoints) {
                        drawPointCircles({
                            context: offScreenContext,
                            pointArrays: formattedLines,
                            radius: pointShowRadius,
                            color: pointShowColor
                        });
                    }
                });
            }

            offScreenContext.restore();
            const offscreenBitmap = offScreenCanvas.transferToImageBitmap();
            context.transferFromImageBitmap(offscreenBitmap);
        } catch (e) {
            console.error('***** layer error *****');
            console.error(layers);
            console.error('***** layer error *****');
        }
    }, [layers, showPoints]);

    if (canvas?.current) {
        canvas.current.toBlob((blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                blobCallback(base64data);
            };
        }, 'image/png');
    }

    const dw = Math.floor(pixelRatio * width);
    const dh = Math.floor(pixelRatio * height);
    const style = { width, height, position };

    return (
        <canvas
            className={styles.svgLayer}
            ref={canvas}
            width={dw}
            height={dh}
            style={style}
        />
    );
};

export const SelectLayer = ({
    selectCoords = [],
    hullCoords = [],
    fillLines = [],
    // color = 'black',
    width = 800,
    height = 600,
    position = 'absolute'
}) => {
    const pixelRatio = window.devicePixelRatio;
    const canvas = useRef(null);

    useEffect(() => {
        try {
            const context = canvas.current.getContext('bitmaprenderer');
            const offScreenCanvas = new OffscreenCanvas(width, height);
            const offScreenContext = offScreenCanvas.getContext('2d');

            offScreenContext.save();
            // offScreenContext.scale(pixelRatio, pixelRatio);
            offScreenContext.clearRect(0, 0, width, height);

            if (hullCoords.length > 2) {
                offScreenContext.fillStyle = 'rgba(255, 255, 255, 0.25)';
                drawLines({
                    context: offScreenContext,
                    pointArrays: hullCoords,
                    strokeWidth: 3,
                    color: 'red'
                });
            }

            offScreenContext.closePath();
            offScreenContext.fill();

            drawPointCircles(offScreenContext, selectCoords, 'black', 1);

            offScreenContext.fillStyle = 'none';

            if (fillLines.length > 0) {
                drawLines({
                    context: offScreenContext,
                    pointArrays: fillLines,
                    strokeWidth: 1,
                    color: 'black'
                });
            }

            offScreenContext.restore();
            const offscreenBitmap = offScreenCanvas.transferToImageBitmap();
            context.transferFromImageBitmap(offscreenBitmap);
        } catch (e) {
            console.error('***** line error *****');
            console.error(selectCoords);
            console.error('***** line error *****');
        }
        // split this into two
    }, [selectCoords, fillLines]);

    const dw = Math.floor(pixelRatio * width);
    const dh = Math.floor(pixelRatio * height);
    const style = { width, height, position };

    return (
        <canvas
            className={styles.svgLayer}
            ref={canvas}
            width={dw}
            height={dh}
            style={style}
        />
    );
};

CanvasLayer.defaultProps = {
    color: 'black'
};
