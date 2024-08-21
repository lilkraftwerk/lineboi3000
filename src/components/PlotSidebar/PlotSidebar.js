import PercentClicker from 'components/common/PercentClicker/PercentClicker';
import { EnabledToggleButton } from 'components/common/SidebarButton/SidebarButton';
import _ from 'lodash';
import Plotter from 'plotting/Plotter';
import React from 'react';
import { connect } from 'react-redux';
import { getAllEfxLines } from 'store/line/lineSelectors';
import { getCurrentOptions } from 'store/options/optionsSelectors';

import {
    SidebarContainer,
    SidebarItem
} from 'components/common/SidebarContainer/SidebarContainer';
import {
    setCurrentLineId,
    setCurrentPlotPercentage,
    // togglePlotBoundary,
    setPenLocation,
    setPlotSettingByKey
} from 'store/plot/plotActions';
import id from '../../utils/id';
import { sortLinesForPlotter } from '../../utils/lineSortUtils';
import {
    addPercentageCoordinatesToLine,
    formatLayersForPlotDisplay,
    generatePlotBoundaries
} from '../../utils/plotUtils';

import * as styles from './PlotSidebar.styles.css';

const INIT_STATE = {
    connectionStatus: 'searching',
    penState: null
};

class PlotSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = INIT_STATE;
    }

    componentDidMount() {
        this.setupAxidraw();
    }

    componentWillUnmount() {
        clearInterval(this.plotterCheckInterval);
    }

    setupAxidraw = async () => {
        const { dispatch } = this.props;
        this.plotter = new Plotter();
        await this.plotter.createAxidraw();

        this.plotter.setResultCallback((result) => {
            const { x, y } = result;
            dispatch(setPenLocation([x, y]));
        });

        this.setPenHeights();
        this.setPlotterCheckInterval();
    };

    setPlotterCheckInterval = () => {
        this.plotterCheckInterval = setInterval(() => {
            this.checkPlotterConnection();
        }, 1000);
    };

    checkPlotterConnection = async () => {
        try {
            const result = await this.plotter.getPlotterStatus();

            if (result.connectionStatus === 'disconnected') {
                this.setState({
                    connectionStatus: 'disconnected'
                });
                return;
            }

            const { connectionStatus, state } = result;

            this.setState({
                connectionStatus,
                penState: state
            });
        } catch {
            this.setState({
                connectionStatus: 'off'
            });
        }
    };

    setPlottingStatus = (value) => {
        const { dispatch } = this.props;
        dispatch(setPlotSettingByKey('plotting', value));
    };

    setTotalLineCount = (count) => {
        const { dispatch } = this.props;
        dispatch(setPlotSettingByKey('totalPlotLineCount', count));
    };

    setCurrentLineIndex = (index) => {
        const { dispatch } = this.props;
        dispatch(setPlotSettingByKey('currentPlotLineIndex', index));
    };

    startPlot = async (lines) => {
        const { dispatch } = this.props;
        this.setTotalLineCount(lines.length);
        this.setCurrentLineIndex(0);
        dispatch(setCurrentPlotPercentage(0));

        const lineDrawCallback = (response) => {
            const { currentLineId, currentLineCount, totalLineCount } =
                response;

            dispatch(setCurrentLineId(currentLineId));
            this.setCurrentLineIndex(currentLineCount);

            const finishedPercentage =
                (currentLineCount / totalLineCount) * 100;

            dispatch(setCurrentPlotPercentage(finishedPercentage));
        };

        this.setPlottingStatus(true);
        this.plotter.setLines(lines);
        await this.plotter.print((response) => {
            lineDrawCallback(response);
        });
        this.setPlottingStatus(false);
    };

    plotFullBounds = () => {
        const { paperHeightInPixels, paperWidthInPixels } = this.props;

        const fullBounds = [
            [0, 0],
            [100, 0],
            [100, 100],
            [0, 100],
            [0, 0]
        ];
        const plotBoundsLine = {
            id: id(),
            pointArrayContainer: fullBounds
        };

        const withCoords = addPercentageCoordinatesToLine(
            plotBoundsLine,
            paperWidthInPixels,
            paperHeightInPixels
        );
        this.startPlot([withCoords]);
    };

    plotTestLines = () => {
        const { paperHeightInPixels, paperWidthInPixels } = this.props;

        const lines = [];
        for (let i = 0; i < 10; i += 1) {
            const points = [];
            for (let p = 0; p < 5; p += 1) {
                const randoX = _.random(300, 350);
                const randoY = _.random(250, 300);
                points.push([randoX, randoY]);
            }
            const formattedLine = {
                id: id(),
                pointArrayContainer: points
            };

            const withPercentage = addPercentageCoordinatesToLine(
                formattedLine,
                paperWidthInPixels,
                paperHeightInPixels
            );
            lines.push(withPercentage);
        }

        this.startPlot(lines);
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
        this.startPlot([withCoords]);
    };

    plotCoords = () => {
        const {
            formattedLayers,
            paperHeightInPixels,
            paperWidthInPixels,
            optimizeLineOrder
        } = this.props;

        this.parkPen();
        let justLines = _.flatten(formattedLayers.map((x) => x.lines));

        if (optimizeLineOrder) {
            justLines = sortLinesForPlotter(justLines);
        }

        const mappedRelativeLines = justLines.map((line) =>
            addPercentageCoordinatesToLine(
                line,
                paperWidthInPixels,
                paperHeightInPixels
            )
        );

        this.startPlot(mappedRelativeLines);
    };

    abort = () => {
        this.setPlottingStatus(false);
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

    parkPen = () => {
        this.plotter.returnToStart();
    };

    setPenHeights = () => {
        const { penUpHeight, penDownHeight } = this.props;
        this.plotter.setPenHeights({ penUpHeight, penDownHeight });
    };

    handleChange = (key, value) => {
        this.setState({ [key]: Number.parseFloat(value) });
    };

    connectionStatusDisplay = () => {
        const { connectionStatus } = this.state;

        const statuses = {
            searching: ['SEARCHING', styles.searching],
            connected: ['CONNECTED', styles.connected],
            simulated: ['SIMULATED', styles.simulation],
            disconnected: ['DISCONNECTED', styles.disconnected]
        };

        const [statusString, statusClass] = statuses[connectionStatus];

        return (
            <div className={`${styles.plotterStatusBox} ${statusClass}`}>
                {statusString}
            </div>
        );
    };

    penHeightStatusDisplay = () => {
        const { penState } = this.state;
        let penStateString;
        if (penState == null) {
            penStateString = '0';
        } else {
            penStateString = penState.toString();
        }

        // 0 is up/off, 1 is down/on

        return (
            <>
                <div className={`${styles.plotterHeightBox}`}>height</div>
                <div className={`${styles.plotterHeightDisplay}`} />
                <div className={`${styles.plotterHeightBox}`}>
                    {penStateString}
                </div>
            </>
        );
    };

    render() {
        const {
            penUpHeight,
            penDownHeight,
            scale,
            plotting,
            optimizeLineOrder,
            dispatch
        } = this.props;

        return (
            <SidebarContainer>
                <SidebarItem cols={4} title="plotter status">
                    {this.connectionStatusDisplay()}
                    {this.penHeightStatusDisplay()}
                </SidebarItem>

                <SidebarItem title="plot control" cols={4}>
                    {!plotting ? (
                        <button type="button" onClick={this.plotCoords}>
                            plot
                        </button>
                    ) : (
                        <button type="button" onClick={this.abort}>
                            abort
                        </button>
                    )}
                </SidebarItem>
                {/* <SidebarItem title="utils" cols={4}>
                // testing utils - don't show for now
                    <button type="button" onClick={this.plotFullBounds}>
                        plot bounds
                    </button>
                    <button
                        type="button"
                        style={{ gridColumn: 'span 2' }}
                        onClick={() => {
                            dispatch(togglePlotBoundary());
                        }}
                    >
                        show plot boundary
                    </button>
                    <button
                        style={{ gridColumn: 'span 2' }}
                        type="button"
                        onClick={() => {
                            this.plotPlotBoundary();
                        }}
                    >
                        plot plot boundary
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            this.plotTestLines();
                        }}
                    >
                        plot test
                    </button>
                </SidebarItem> */}
                <SidebarItem cols={4} title="pen controls">
                    <button
                        style={{ gridColumn: 'span 2' }}
                        type="button"
                        onClick={this.penUp}
                    >
                        pen up
                    </button>
                    <button
                        style={{ gridColumn: 'span 2' }}
                        type="button"
                        onClick={this.penDown}
                    >
                        pen down
                    </button>
                    <button
                        style={{ gridColumn: 'span 2' }}
                        type="button"
                        onClick={this.setPenHeights}
                    >
                        set heights
                    </button>
                    <button
                        style={{ gridColumn: 'span 2' }}
                        type="button"
                        onClick={this.parkPen}
                    >
                        park pen
                    </button>
                    <button type="button" onClick={this.returnToStart}>
                        return pen to start
                    </button>
                </SidebarItem>
                <SidebarItem title="controls" cols={4}>
                    <EnabledToggleButton
                        style={{ gridColumn: 'span 4' }}
                        onClick={() => {
                            dispatch(
                                setPlotSettingByKey(
                                    'optimizeLineOrder',
                                    !optimizeLineOrder
                                )
                            );
                        }}
                        active={optimizeLineOrder}
                        labelActive="optimize line order on"
                        labelInactive="optimize line order off"
                    />
                    <PercentClicker
                        setValue={(value) => {
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
                        setValue={(value) => {
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
                        setValue={(value) => {
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

const mapStateToProps = (state) => {
    const PIXELS_PER_INCH = 75;

    const {
        paperWidth,
        paperHeight,
        scale,
        penUpHeight,
        penDownHeight,
        optimizeLineOrder,
        isPlotBoundaryVisible
    } = state.plotReducer;

    const { height, width } = getCurrentOptions(state);
    const allEfxLines = getAllEfxLines(state);

    const paperWidthInPixels = PIXELS_PER_INCH * paperWidth;
    const paperHeightInPixels = PIXELS_PER_INCH * paperHeight;

    const formattedLayers = formatLayersForPlotDisplay({
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
        optimizeLineOrder,
        paperWidthInPixels,
        paperHeightInPixels,
        isPlotBoundaryVisible,
        scale,
        paperWidth,
        paperHeight,
        formattedLayers,
        ...state.plotReducer
    };
};

export default connect(mapStateToProps)(PlotSidebar);
