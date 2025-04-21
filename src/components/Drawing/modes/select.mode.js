import { clone as _clone } from 'es-toolkit';

export const getPointsAroundCoord = ([centerX, centerY], options) => {
    const { radius } = options;
    const result = [];
    for (let x = centerX - radius; x <= centerX + radius; x += 1) {
        for (let y = centerY - radius; y <= centerY + radius; y += 1) {
            if (
                (x - centerX) * (x - centerX) + (y - centerY) * (y - centerY) <
                radius * radius
            ) {
                /* do something */
                result.push([x, y]);
            }
        }
    }
    return result;
};

const onEnd = (coords, selectCoords) => {
    const newSelectCoords = _clone(selectCoords);
    const pointsAroundCoord = getPointsAroundCoord(coords, {
        radius: 8
    }).map((theseCoords) => JSON.stringify(theseCoords));
    const selectedStrings = newSelectCoords.map((selectedCoords) =>
        JSON.stringify(selectedCoords)
    );
    const filtered = selectedStrings.filter(
        (theseCoords) => !pointsAroundCoord.includes(theseCoords)
    );
    if (filtered.length === newSelectCoords.length) {
        newSelectCoords.push(coords);
        return newSelectCoords;
    }
    return filtered.map((x) => JSON.parse(x));
};

export default {
    onStart: () => {},
    onMove: () => {},
    onEnd
};
