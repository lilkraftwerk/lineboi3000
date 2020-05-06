import PropTypes from 'prop-types';

// visual prop shapes
//
// point: [1, 1];
// pointArrayContainer: [[1, 1], [10, 10]];
// line: {
//     id: '_10lajkn',
//     pointArrayContainer: [[1, 1], [10, 10]]
// }

export const PointType = PropTypes.arrayOf(PropTypes.number);

export const LineType = PropTypes.shape({
    id: PropTypes.string,
    pointArrayContainer: PropTypes.arrayOf(PointType)
});

export const LayerType = PropTypes.shape({
    id: PropTypes.string,
    originalLines: PropTypes.arrayOf(LineType),
    efxLines: PropTypes.arrayOf(LineType),
    settings: PropTypes.shape({
        color: PropTypes.string,
        name: PropTypes.string,
        visible: PropTypes.boolean
    })
});

export const ModeType = PropTypes.oneOf(['draw', 'efx', 'plot', 'onions']);

export default PropTypes;
