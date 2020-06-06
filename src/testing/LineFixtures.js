import id from '../utils/id';

export const testHeight = 600;
export const testWidth = 800;
export const multiplierOne = 10;
export const multiplierTwo = 20;

export const pointArrayContainerOne = [
    [multiplierOne, multiplierOne],
    [testWidth - multiplierOne, multiplierOne],
    [testWidth - multiplierOne, testHeight - multiplierOne],
    [multiplierOne, testHeight - multiplierOne],
    [multiplierOne, multiplierOne]
];

export const pointArrayContainerTwo = [
    [multiplierTwo, multiplierTwo],
    [testWidth - multiplierTwo, multiplierTwo],
    [testWidth - multiplierTwo, testHeight - multiplierTwo],
    [multiplierTwo, testHeight - multiplierTwo],
    [multiplierTwo, multiplierTwo]
];

export const testLines = [
    {
        id: id(),
        pointArrayContainer: pointArrayContainerOne
    },
    {
        id: id(),
        pointArrayContainer: pointArrayContainerTwo
    },
    {
        id: id(),
        pointArrayContainer: []
    }
];

export const makeVerticalLinesPointArrays = (height, width, distance) => {
    const pointArrays = [];
    for (let x = 0; x < width; x += distance) {
        const pointArrayContainer = [];
        for (let y = 0; y < height; y += distance) {
            pointArrayContainer.push([x, y]);
        }
        pointArrays.push(pointArrayContainer);
    }
    return pointArrays;
};
