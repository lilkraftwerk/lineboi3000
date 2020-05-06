const ColorList = [
    '#2D383A',
    '#C62D42',
    '#FE6F5E',
    '#FF8833',
    '#FBE7B2',
    '#F1E788',
    '#FFFF99',
    '#AFE313',
    '#63B76C',
    '#1AB385',
    '#93DFB8',
    '#00CCCC',
    '#009DC4',
    '#02A4D3',
    '#C3CDE6',
    '#9999CC',
    '#8E3179',
    '#FF3399',
    '#F7A38E',
    '#9E5B40',
    '#E6BE8A',
    '#C9C0BB',
    '#FFFFFF',
    '#FF355E',
    '#FD5B78',
    '#FF6037',
    '#66FF66',
    '#FEBAAD',
    '#F091A9',
    '#DEA681',
    '#BB3385',
    '#FDD5B1'
].map(hex => {
    return hex.replace('#', '');
});

const sorted = ColorList.sort();
const mapped = sorted.map(x => `#${x}`);
export default mapped;
