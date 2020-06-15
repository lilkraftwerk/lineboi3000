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

export const zShape = [
    [230, 111],
    [231, 111],
    [237, 111],
    [243, 111],
    [267, 111],
    [287, 111],
    [299, 111],
    [325, 111],
    [349, 111],
    [356, 111],
    [373, 111],
    [377, 111],
    [387, 111],
    [388, 111],
    [393, 111],
    [395, 111],
    [396, 111],
    [397, 111],
    [397, 111],
    [397, 111],
    [398, 111],
    [399, 111],
    [399, 111],
    [401, 111],
    [404, 111],
    [405, 111],
    [406, 111],
    [408, 111],
    [409, 111],
    [410, 111],
    [411, 112],
    [411, 113],
    [411, 114],
    [410, 115],
    [408, 117],
    [404, 120],
    [398, 127],
    [385, 141],
    [372, 161],
    [356, 185],
    [336, 214],
    [316, 244],
    [307, 258],
    [288, 284],
    [271, 308],
    [258, 327],
    [253, 335],
    [244, 348],
    [241, 353],
    [239, 357],
    [235, 363],
    [233, 367],
    [232, 370],
    [231, 372],
    [230, 373],
    [230, 374],
    [230, 374],
    [230, 374],
    [230, 374],
    [230, 374],
    [232, 374],
    [235, 374],
    [240, 373],
    [253, 372],
    [272, 371],
    [312, 370],
    [331, 370],
    [367, 368],
    [405, 368],
    [421, 368],
    [449, 367],
    [472, 367],
    [479, 367],
    [484, 367],
    [495, 367],
    [502, 367],
    [506, 367],
    [509, 366],
    [511, 366],
    [512, 366],
    [512, 366],
    [513, 366],
    [513, 365],
    [513, 364],
    [513, 360],
    [513, 360]
];
