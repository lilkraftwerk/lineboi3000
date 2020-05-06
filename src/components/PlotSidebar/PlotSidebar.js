import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Plotter from 'plotting/Plotter';
import { getAllEfxLines } from 'store/line/lineSelectors';
import { getCurrentOptions } from 'store/onions/onionsSelectors';
import PercentClicker from 'components/common/PercentClicker';

import {
    setPlotSettingByKey,
    togglePlotBoundary,
    setPenLocation,
    setCurrentLineId
} from 'store/plot/plotActions';
import {
    formatLayersForPlotDisplayTwo,
    addPercentageCoordinatesToLine,
    generatePlotBoundaries
} from 'plotting/plotUtils';
import {
    SidebarContainer,
    SidebarItem
} from 'components/common/SidebarContainer';
import id from '../../utils/id';

import styles from './PlotSidebar.styles.css';

class PlotSidebar extends React.Component {
    state = {
        isConnected: null,
        penState: null
    };

    componentDidMount() {
        this.setupAxidraw();
    }

    componentWillUnmount() {
        clearInterval(this.plotterCheckInterval);
    }

    setupAxidraw = async () => {
        this.plotter = new Plotter();
        await this.plotter.createAxidraw();
        this.setPenHeights();
        this.setPlotterCheckInterval();
    };

    setPlotterCheckInterval = () => {
        this.plotterCheckInterval = setInterval(() => {
            this.checkPlotterConnection();
        }, 500);
    };

    checkPlotterConnection = async () => {
        const { dispatch } = this.props;

        try {
            const result = await this.plotter.getPlotterStatus();
            const penX = result.x;
            const penY = result.y;

            // const buffer = await this.plotter.getPlotterBuffer();
            // if (buffer.buffer != null) {
            // console.log(buffer);
            // }
            dispatch(setPenLocation([penX, penY]));
            const { simulation, state } = result;
            const isConnected = simulation != null && simulation === 0;

            this.setState({
                isConnected,
                penState: state,
                penX,
                penY
            });
        } catch {
            this.setState({
                isConnected: false
            });
        }
    };

    plotFullBounds = () => {
        const fullBounds = [
            [0, 0],
            [100, 0],
            [100, 100],
            [0, 100],
            [0, 0]
        ];

        const boundsAsLine = {
            id: id(),
            pointArrayContainer: fullBounds
        };
        this.plotter.setLines([boundsAsLine]);
        this.plotter.print();
    };

    plotPlotBoundary = () => {
        const { scale, paperHeightInPixels, paperWidthInPixels } = this.props;

        const [plotBoundaryLine] = generatePlotBoundaries({
            height: paperHeightInPixels,
            width: paperWidthInPixels,
            scale
        });
        const withCoords = addPercentageCoordinatesToLine(
            plotBoundaryLine,
            paperWidthInPixels,
            paperHeightInPixels
        );
        this.plotter.setLines([withCoords]);
        this.plotter.print();
    };

    plotCoords = () => {
        const {
            formattedLayers,
            paperHeightInPixels,
            paperWidthInPixels,
            dispatch
        } = this.props;
        this.parkPen();
        const justLines = _.flatten(formattedLayers.map(x => x.lines));
        const mappedRelativeLines = justLines.map(line =>
            addPercentageCoordinatesToLine(
                line,
                paperWidthInPixels,
                paperHeightInPixels
            )
        );

        // to do make linecallback work
        this.plotter.setLines(mappedRelativeLines);
        this.plotter.print(currentLineId => {
            dispatch(setCurrentLineId(currentLineId));
        });
    };

    abort = () => {
        this.plotter.abort();
    };

    penDown = () => {
        this.plotter.penDown();
    };

    penUp = () => {
        this.plotter.penUp();
    };

    parkPen = () => {
        this.plotter.parkPen();
    };

    setPenHeights = () => {
        const { penUpHeight, penDownHeight } = this.props;
        this.plotter.setPenHeights({ penUpHeight, penDownHeight });
    };

    handleChange = (key, value) => {
        this.setState({ [key]: Number.parseFloat(value) });
    };

    connectionStatusDisplay = () => {
        const { isConnected } = this.state;

        if (isConnected == null) {
            return (
                <div
                    className={`${styles.plotterStatusBox} ${styles.checking}`}
                >
                    SEARCHING...
                </div>
            );
        }

        if (isConnected === true) {
            return (
                <div
                    className={`${styles.plotterStatusBox} ${styles.connected}`}
                >
                    CONNECTED
                </div>
            );
        }

        return (
            <div
                className={`${styles.plotterStatusBox} ${styles.disconnected}`}
            >
                DISCONNECTED
            </div>
        );
    };

    penHeightStatusDisplay = () => {
        const { penState } = this.state;
        let penStateString;
        if (penState == null) {
            penStateString = 'hi';
        } else {
            penStateString = penState.toString();
        }

        // 0 is up/off, 1 is down/on

        return (
            <React.Fragment>
                <div className={`${styles.plotterHeightBox}`}>height</div>
                <div className={`${styles.plotterHeightDisplay}`} />
                <div className={`${styles.plotterHeightBox}`}>
                    {penStateString}
                </div>
            </React.Fragment>
        );
    };

    render() {
        const { penUpHeight, penDownHeight, scale, dispatch } = this.props;

        return (
            <SidebarContainer>
                <SidebarItem cols={4} title="plotter status">
                    {this.connectionStatusDisplay()}
                    {this.penHeightStatusDisplay()}
                </SidebarItem>
                <SidebarItem cols={2} title="pen controls">
                    <button
                        className={styles.button}
                        type="button"
                        onClick={this.penUp}
                    >
                        pen up
                    </button>
                    <button
                        className={styles.button}
                        type="button"
                        onClick={this.penDown}
                    >
                        pen down
                    </button>
                    <button
                        className={styles.button}
                        type="button"
                        onClick={this.setPenHeights}
                    >
                        set heights
                    </button>
                    <button
                        className={styles.button}
                        type="button"
                        onClick={this.parkPen}
                    >
                        park pen
                    </button>
                </SidebarItem>
                <SidebarItem title="plot stuff" cols={2}>
                    <button
                        className={styles.button}
                        type="button"
                        onClick={this.plotFullBounds}
                    >
                        plot bounds
                    </button>

                    <button
                        className={styles.button}
                        type="button"
                        onClick={this.plotCoords}
                    >
                        plot
                    </button>
                    <button
                        className={styles.button}
                        type="button"
                        onClick={this.abort}
                    >
                        abort
                    </button>
                    <button
                        className={styles.button}
                        type="button"
                        onClick={() => {
                            dispatch(togglePlotBoundary());
                        }}
                    >
                        toggle plot boundary
                    </button>
                    <button
                        className={styles.button}
                        type="button"
                        onClick={() => {
                            this.plotPlotBoundary();
                        }}
                    >
                        plot plot boundary
                    </button>
                </SidebarItem>
                <SidebarItem title="controls" cols={4}>
                    <PercentClicker
                        setValue={value => {
                            dispatch(
                                setPlotSettingByKey(
                                    'penUpHeight',
                                    _.round(value, 2)
                                )
                            );
                        }}
                        float
                        title="pen up height"
                        minLabel="0.01"
                        maxLabel="1.0"
                        minValue={0.01}
                        maxValue={1}
                        currentValue={penUpHeight}
                    />
                    <PercentClicker
                        setValue={value => {
                            dispatch(
                                setPlotSettingByKey(
                                    'penDownHeight',
                                    _.round(value, 2)
                                )
                            );
                        }}
                        float
                        title="pen down height"
                        minLabel="0.01"
                        maxLabel="1.0"
                        minValue={0.01}
                        maxValue={1}
                        currentValue={penDownHeight}
                    />
                    <PercentClicker
                        setValue={value => {
                            const num = Number(value);
                            if (num >= 0 && num <= 100) {
                                dispatch(setPlotSettingByKey('scale', num));
                            }
                        }}
                        title="scale"
                        minLabel="1%"
                        maxLabel="100%"
                        minValue={1}
                        maxValue={100}
                        currentValue={scale}
                    />
                </SidebarItem>
            </SidebarContainer>
        );
    }
}

const mapStateToProps = state => {
    const PIXELS_PER_INCH = 75;

    const {
        paperWidth,
        paperHeight,
        scale,
        penUpHeight,
        penDownHeight,
        isPlotBoundaryVisible
    } = state.plotReducer;

    const { height, width } = getCurrentOptions(state);
    const allEfxLines = getAllEfxLines(state);

    const paperWidthInPixels = PIXELS_PER_INCH * paperWidth;
    const paperHeightInPixels = PIXELS_PER_INCH * paperHeight;

    const formattedLayers = formatLayersForPlotDisplayTwo({
        layers: allEfxLines,
        scale,
        paperHeightInPixels,
        paperWidthInPixels
    });

    return {
        height,
        width,
        penUpHeight,
        penDownHeight,
        paperWidthInPixels,
        paperHeightInPixels,
        isPlotBoundaryVisible,
        scale,
        paperWidth,
        paperHeight,
        formattedLayers
    };
};

export default connect(mapStateToProps)(PlotSidebar);

PlotSidebar.defaultProps = {};

PlotSidebar.propTypes = {
    dispatch: PropTypes.func.isRequired
};
