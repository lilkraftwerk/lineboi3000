import _ from 'lodash';
import isPointInPolygon from 'point-in-polygon';

const generateFillLines = ({
    distanceBetweenLines,
    distanceBetweenPoints,
    lineMode,
    randomLineDensity,
    height,
    width,
    hullCoords
}) => {
    const fillLines = [];

    const setHorizontalLines = () => {
        for (
            let yIterator = 0;
            yIterator < height;
            yIterator += distanceBetweenLines
        ) {
            const line = [];
            for (
                let xIterator = 0;
                xIterator < width;
                xIterator += distanceBetweenPoints
            ) {
                line.push([xIterator, yIterator]);
            }
            fillLines.push(line);
        }
    };

    const setVerticalLines = () => {
        for (
            let xIterator = 0;
            xIterator < width;
            xIterator += distanceBetweenLines
        ) {
            const line = [];
            for (
                let yIterator = 0;
                yIterator < height;
                yIterator += distanceBetweenPoints
            ) {
                line.push([xIterator, yIterator]);
            }
            fillLines.push(line);
        }
    };

    const setRandomLines = () => {
        const xValues = hullCoords.map(([x, y]) => x); // eslint-disable-line
        const yValues = hullCoords.map(([x, y]) => y); // eslint-disable-line

        const minX = _.min(xValues);
        const minY = _.min(yValues);

        const maxX = _.max(xValues);
        const maxY = _.max(yValues);

        const lineCountMultiplier = 100;
        const pointCountMultiplier = 125;

        _.times(lineCountMultiplier * randomLineDensity, () => {
            const line = [];
            const xOffset = _.random(-10, 10);
            const yOffset = _.random(-10, 10);

            let currentX = _.random(minX, maxX);
            let currentY = _.random(minY, maxY);

            line.push([currentX, currentY]);

            _.times(pointCountMultiplier * randomLineDensity, () => {
                currentX += xOffset;
                currentY += yOffset;

                line.push([currentX, currentY]);
            });

            fillLines.push(line);
        });
    };

    if (lineMode === 'random') {
        setRandomLines();
    } else if (lineMode === 'horizontal') {
        setHorizontalLines();
    } else {
        setVerticalLines();
    }

    const splitLines = [];
    // go throughe very point on line
    // if next point is within polygon, add to current line
    // if not, push current line (if >= 2 length) to splitLines
    // start next line at next
    fillLines.forEach((line) => {
        let currentLine = [];
        line.forEach((coords) => {
            if (isPointInPolygon(coords, hullCoords)) {
                currentLine.push(coords);
            } else {
                if (currentLine.length >= 2) {
                    splitLines.push(currentLine);
                }
                currentLine = [];
            }
        });
    });

    return splitLines;
};

export default generateFillLines;
