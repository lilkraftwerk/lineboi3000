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
        id: 'abc',
        pointArrayContainer: pointArrayContainerOne
    },
    {
        id: 'def',
        pointArrayContainer: pointArrayContainerTwo
    },
    {
        id: 'xyz',
        pointArrayContainer: []
    }
];
