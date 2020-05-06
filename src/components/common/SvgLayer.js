import _ from 'lodash';
import React, { useRef, useEffect } from 'react';
import PropTypes, { LineType } from 'customPropTypes';

import styles from './SvgLayer.styles.css';

export const CanvasLayer = ({
    lines,
    color,
    width = 800,
    height = 600,
    strokeWidth,
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
            offScreenContext.strokeStyle = color;

            if (lines.length < 0) {
                return;
            }
            const pointArrayContainers = lines.map(
                line => line.pointArrayContainer
            );
            const pointArraysWithoutZeroLength = pointArrayContainers.filter(
                container => container.length > 0
            );

            pointArraysWithoutZeroLength.forEach(pointArray => {
                offScreenContext.beginPath();
                offScreenContext.lineWidth = strokeWidth;
                offScreenContext.lineJoin = 'miter';

                for (let index = 0; index < pointArray.length; index += 1) {
                    const [currentX, currentY] = pointArray[index];
                    if (currentX != null && currentY != null) {
                        if (index === 0) {
                            offScreenContext.moveTo(currentX, currentY);
                        }
                        offScreenContext.lineTo(currentX, currentY);
                    }
                }

                offScreenContext.stroke();
            });

            offScreenContext.restore();
            const offscreenBitmap = offScreenCanvas.transferToImageBitmap();
            context.transferFromImageBitmap(offscreenBitmap);
        } catch (e) {
            console.error('***** line error *****');
            console.error(lines);
            console.error('***** line error *****');
        }
    }, [lines]);

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

export const PenLocationLayer = ({
    width = 800,
    height = 600,
    currentLine = {},
    scale
}) => {
    console.log('scale', scale);

    const pixelRatio = window.devicePixelRatio;
    const { pointArrayContainer } = currentLine;
    const canvas = useRef(null);

    useEffect(() => {
        if (!pointArrayContainer) {
            return;
        }

        try {
            const context = canvas.current.getContext('bitmaprenderer');
            const offScreenCanvas = new OffscreenCanvas(width, height);
            const offScreenContext = offScreenCanvas.getContext('2d');

            offScreenContext.save();
            offScreenContext.clearRect(0, 0, width, height);
            offScreenContext.strokeStyle = 'red';

            offScreenContext.beginPath();
            offScreenContext.lineWidth = 3;
            offScreenContext.lineJoin = 'miter';

            for (
                let index = 0;
                index < pointArrayContainer.length;
                index += 1
            ) {
                const [currentX, currentY] = pointArrayContainer[index];
                if (currentX != null && currentY != null) {
                    if (index === 0) {
                        offScreenContext.moveTo(currentX, currentY);
                    }
                    offScreenContext.lineTo(currentX, currentY);
                }
            }

            offScreenContext.stroke();
            offScreenContext.restore();
            const offscreenBitmap = offScreenCanvas.transferToImageBitmap();
            context.transferFromImageBitmap(offscreenBitmap);
        } catch (e) {
            console.error('***** line error *****');
            console.error('p[en error');
            console.error('***** line error *****');
        }
    }, [currentLine]);

    const dw = Math.floor(pixelRatio * width);
    const dh = Math.floor(pixelRatio * height);
    const style = { width, height, position: 'absolute' };

    return (
        <canvas
            className={styles.currentLineLayer}
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
    shouldSaveFrame = false
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

            if (layers.length >= 0) {
                layers.forEach(({ efxLines, color }) => {
                    if (efxLines.length <= 0) {
                        return;
                    }

                    offScreenContext.strokeStyle = color;

                    const pointArrayContainers = efxLines.map(
                        line => line.pointArrayContainer
                    );
                    const pointArraysWithoutZeroLength = pointArrayContainers.filter(
                        container => container.length > 0
                    );

                    pointArraysWithoutZeroLength.forEach(pointArray => {
                        offScreenContext.beginPath();
                        // add strokewidth to lines
                        offScreenContext.lineWidth = 3;
                        offScreenContext.lineJoin = 'miter';

                        for (
                            let index = 0;
                            index < pointArray.length;
                            index += 1
                        ) {
                            const [currentX, currentY] = pointArray[index];
                            if (currentX != null && currentY != null) {
                                if (index === 0) {
                                    offScreenContext.moveTo(currentX, currentY);
                                }
                                offScreenContext.lineTo(currentX, currentY);
                            }
                        }

                        offScreenContext.stroke();
                    });
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
    }, [layers]);

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
            offScreenContext.strokeStyle = color;

            if (hullCoords.length > 2) {
                offScreenContext.strokeStyle = 'red';
                offScreenContext.lineJoin = 'miter';
                offScreenContext.fillStyle = 'rgba(255, 255, 255, 0.25)';
                offScreenContext.beginPath();
                _.forEach(hullCoords, ([x, y], index) => {
                    if (index === 0) {
                        offScreenContext.moveTo(x, y);
                    } else {
                        offScreenContext.lineTo(x, y);
                    }
                });
            }
            offScreenContext.closePath();
            offScreenContext.fill();
            _.forEach(selectCoords, ([x, y]) => {
                offScreenContext.beginPath();
                offScreenContext.strokeStyle = 'black';
                offScreenContext.fillStyle = 'black';
                offScreenContext.arc(x, y, 1, 0, 2 * Math.PI);
                offScreenContext.fill();
                offScreenContext.stroke();
            });

            offScreenContext.strokeStyle = 'black';
            offScreenContext.fillStyle = 'none';

            if (fillLines.length > 0) {
                _.forEach(fillLines, currentFillLine => {
                    offScreenContext.beginPath();
                    _.forEach(currentFillLine, ([x, y], index) => {
                        if (index === 0) {
                            offScreenContext.moveTo(x, y);
                        } else {
                            offScreenContext.lineTo(x, y);
                        }
                    });
                    offScreenContext.stroke();
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
