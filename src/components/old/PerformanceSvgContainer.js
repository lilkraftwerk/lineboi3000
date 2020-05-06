import _ from 'lodash';
import React, { Fragment, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    getEfxLinesToRender,
    getCurrentLayerSettings
} from 'store/layer/layerSelectors';
import SVG from 'svg.js';

import styles from './PerformanceSvgContainer.styles.css';

const SvgDisplay = ({ lines, height, width, color }) => {
    const svgEl = useRef(null);

    useEffect(() => {
        if (!svgEl) {
            return;
        }
        const svgJs = SVG(svgEl.current.id);
        lines.forEach(line => {
            const polyline = svgJs.polyline(line.points).fill('none');
            polyline.stroke({
                color: 'black',
                width: 3,
                linecap: 'round',
                linejoin: 'round'
            });
        });
    });

    return (
        <div>
            <svg className={styles.raw} width={1000} height={1000} />
        </div>
    );
};

const SvgDisplayRaw = ({ lines, color }) => {
    const svgEl = useRef(null);
    const customId = `constiner${_.random(1000000)}`;

    const createPolyline = line => {
        const pointsJoined = line.points.join(' ');

        return <polyline points={pointsJoined} fill="none" stroke={color} />;
    };

    const allLines = lines.map(x => createPolyline(x));

    return (
        <div>
            <svg className={styles.raw} width={1000} height={1000}>
                {allLines}
            </svg>
        </div>
    );
};

const createPoint = () => {
    return [_.random(1000), _.random(1000)];
};

const createLine = numPoints => {
    const points = [];

    _.times(numPoints, () => {
        points.push(createPoint());
    });

    return {
        points
    };
};

export class PerformanceSvgContainer extends React.Component {
    state = {
        redLines: [],
        blackLines: [],
        blueLines: [],
        orangeLines: [],
        pinkLines: []
    };

    constructor(props) {
        super(props);
        this.svgRef = React.createRef();
    }

    componentDidMount() {
        this.updateLines();
    }

    updateLines = () => {
        const numLines = 10;
        const pointsPerLine = 100;

        const redLines = [];
        const blackLines = [];
        const blueLines = [];
        const orangeLines = [];
        const pinkLines = [];

        _.times(numLines, () => {
            blackLines.push(createLine(pointsPerLine));
        });

        _.times(numLines, () => {
            redLines.push(createLine(pointsPerLine));
        });

        _.times(numLines, () => {
            blueLines.push(createLine(pointsPerLine));
        });

        _.times(numLines, () => {
            orangeLines.push(createLine(pointsPerLine));
        });

        _.times(numLines, () => {
            pinkLines.push(createLine(pointsPerLine));
        });

        this.setState({
            redLines,
            blackLines,
            blueLines,
            orangeLines,
            pinkLines
        });
    };

    render() {
        const {
            redLines,
            blackLines,
            blueLines,
            orangeLines,
            pinkLines
        } = this.state;

        return (
            <div className={styles.whole}>
                <button
                    onClick={() => {
                        this.updateLines();
                    }}
                >
                    update
                </button>
                <SvgDisplayRaw lines={redLines} color="red" />
                <SvgDisplayRaw lines={blackLines} color="black" />
                <SvgDisplayRaw lines={blueLines} color="blue" />
                <SvgDisplayRaw lines={orangeLines} color="orange" />
                <SvgDisplayRaw lines={pinkLines} color="pink" />
            </div>
        );
    }
}

export default PerformanceSvgContainer;
