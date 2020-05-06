export const makePercentage = (part, whole) => {
    return Math.floor((100 * part) / whole);
};

export const translateLineToPercentages = (line, height, width) => {
    return line.map(([x, y]) => {
        const newX = makePercentage(x, width);
        const newY = makePercentage(y, height);
        return [newX, newY];
    });
};

// min = 0, max = maxHeight or maxWidth
export const mapPercentagePointToCoordRange = (
    coordMin,
    coordMax,
    percentage
) => {
    return (percentage * (coordMax - coordMin)) / 100 + coordMin;
};

export const mapLineToAbsPercentages = ({
    currentX,
    currentY,
    endX,
    endY,
    line
}) => {
    return line.map(([x, y]) => {
        const newX = mapPercentagePointToCoordRange(currentX, endX, x);
        const newY = mapPercentagePointToCoordRange(currentY, endY, y);
        return [newX, newY];
    });
};
