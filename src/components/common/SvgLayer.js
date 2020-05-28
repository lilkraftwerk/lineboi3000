import _ from 'lodash';
import React, { useRef, useEffect } from 'react';
import PropTypes, { LineType } from '../../customPropTypes';
import { prepareLines, drawLines, drawPointCircles } from './DrawingLayerUtils';

import styles from './SvgLayer.styles.css';

export const CanvasLayer = ({
    lines,
    color,
    width = 800,
    height = 600,
    strokeWidth,
    position = 'absolute',
    showPoints = false
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
            offScreenContext.strokeStyle = color;

            const formattedPointArrays = prepareLines(lines);
            drawLines(
                offScreenContext,
                formattedPointArrays,
                strokeWidth,
                color
            );

            // show points
            if (showPoints) {
                drawPointCircles(offScreenContext, formattedPointArrays, 3);
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

export const CombinedLayer = ({
    layers,
    width = 800,
    height = 600,
    blobCallback = () => {},
    position = 'absolute',
    showPoints = false
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
                    const formattedLines = prepareLines(efxLines);
                    drawLines(offScreenContext, formattedLines, 3, color);
                    if (showPoints) {
                        drawPointCircles(
                            offScreenContext,
                            formattedLines,
                            'black',
                            3
                        );
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

    if (canvas && canvas.current) {
        canvas.current.toBlob(blob => {
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
    color = 'black',
    width = 800,
    height = 600,
    position = 'absolute'
}) => {
    const pixelRatio = window.devicePixelRatio;
    console.log('select coords', selectCoords);
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
                drawLines(offScreenContext, hullCoords, 3, 'red');
            }

            offScreenContext.closePath();
            offScreenContext.fill();

            drawPointCircles(offScreenContext, selectCoords, 'black', 1);

            offScreenContext.fillStyle = 'none';

            if (fillLines.length > 0) {
                drawLines(offScreenContext, fillLines, 1, 'black');
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

const commonPropTypes = {
    lines: PropTypes.arrayOf(LineType).isRequired,
    color: PropTypes.string,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    strokeWidth: PropTypes.number.isRequired
};

CanvasLayer.propTypes = commonPropTypes;

CanvasLayer.defaultProps = {
    color: 'black'
};
