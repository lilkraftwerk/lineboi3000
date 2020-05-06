import _ from 'lodash';
import bresenham from 'bresenham-js';
import React from 'react';
import Experimental from 'filters/Experimental';
import Dots from 'filters/Dots';
import Multiply from 'filters/Multiply';
import Simplify from 'filters/Simplify';
import Wiggle from 'filters/Wiggle';
import Move from 'filters/Move';
import Distort from 'filters/Distort';
import Exes from 'filters/Exes';

import { CanvasLayer } from 'components/common/SvgLayer';
import { allPointsBetweenTwoCoords } from 'utils/coordUtils';

import styles from './FilterPlaygroundContainer.styles.css';

// const FILTERS = [Experimental, Dots, Multiply, Simplify, Wiggle, Move];

const ACTIVE_FILTER = Exes;

class FilterPlaygroundContainer extends React.Component {
    state = {
        origLines: [],
        efxLines: []
    };

    createRandomLines = count => {
        const lines = [];
        _.times(count, () => {
            const startX = _.random(500);
            const startY = _.random(500);
            const endX = _.random(500);
            const endY = _.random(500);
            const pointArrayContainer = allPointsBetweenTwoCoords(
                [startX, startY],
                [endX, endY],
                { maxPointCount: 100 }
            );

            const line = {
                pointArrayContainer
            };
            lines.push(line);
        });
        this.setState({ origLines: lines });
    };

    createSquares = count => {
        const squares = [];
        const start = 5;
        const interval = 10;

        const makeSquare = distanceFromSide => {
            const topLeft = [distanceFromSide, distanceFromSide];
            const topRight = [500 - distanceFromSide, distanceFromSide];
            const bottomRight = [
                500 - distanceFromSide,
                500 - distanceFromSide
            ];
            const bottomLeft = [distanceFromSide, 500 - distanceFromSide];

            const lines = _.flatten([
                allPointsBetweenTwoCoords(topLeft, topRight, {
                    maxPointCount: 100
                }),
                allPointsBetweenTwoCoords(topRight, bottomRight, {
                    maxPointCount: 100
                }),
                allPointsBetweenTwoCoords(bottomRight, bottomLeft, {
                    maxPointCount: 100
                }),
                allPointsBetweenTwoCoords(bottomLeft, topLeft, {
                    maxPointCount: 100
                })
            ]);
            const line = {
                pointArrayContainer: lines
            };

            squares.push(line);
        };

        let currentDistance = start;
        _.times(10, () => {
            makeSquare(currentDistance);
            currentDistance += interval;
        });
        this.setState({ origLines: squares });
    };

    updateSettings = (settings, pointArrays) => {
        return {
            filterSettings: {
                ...settings,
                enabled: true
            },
            pointArrays
        };
    };

    affectLines = lines => {
        const pointArrays = lines.map(x => x.pointArrayContainer);
        const settings = this.updateSettings(
            ACTIVE_FILTER.initSettings(),
            pointArrays
        );
        const affected = ACTIVE_FILTER.filter(settings);
        const exesSettings = Distort.initSettings();
        const affectedTwo = Distort.filter({
            filterSettings: exesSettings,
            pointArrays: affected
        });
        return affectedTwo.map(pointArrayContainer => {
            return {
                pointArrayContainer
            };
        });
    };

    render() {
        const { origLines, efxLines } = this.state;
        const affected = this.affectLines(origLines);
        return (
            <div className={styles.container}>
                <div className={styles.buttons}>
                    <button
                        type="button"
                        onClick={() => {
                            this.createRandomLines(100);
                        }}
                    >
                        random lines
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            this.createSquares(10);
                        }}
                    >
                        squares
                    </button>
                </div>

                <div className={styles.before}>
                    <CanvasLayer
                        lines={origLines}
                        height={500}
                        width={500}
                        strokeWidth={2}
                    />
                </div>

                <div className={styles.after}>
                    <CanvasLayer
                        lines={affected}
                        height={500}
                        width={500}
                        strokeWidth={2}
                    />
                </div>
            </div>
        );
    }
}

export default FilterPlaygroundContainer;
