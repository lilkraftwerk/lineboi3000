import {
    CanvasLayer,
    PenPositionLayer
} from 'components/common/SvgLayer/SvgLayer';
import React from 'react';
import { connect } from 'react-redux';
import { getAllEfxLines } from 'store/line/lineSelectors';
import { getCurrentOptions } from 'store/options/optionsSelectors';
import {
    formatLayersForPlotDisplay,
    generatePlotBoundaries
} from '../../utils/plotUtils';
import PaperCanvas from './PaperCanvas';

import * as styles from './PlotContent.styles.css';

// to do make configurable
const PIXELS_PER_INCH = 75;
const AXIDRAW_WIDTH_IN_STEPS = 12000;
const AXIDRAW_HEIGHT_IN_STEPS = 8720;

class PlotContent extends React.Component {
    componentDidMount() {}

    renderPlotBoundary() {
        const { paperWidthInPixels, paperHeightInPixels, scale } = this.props;
        const plotBoundaryLines = generatePlotBoundaries({
            width: paperWidthInPixels,
            height: paperHeightInPixels,
            scale
        });

        return (
            <CanvasLayer
                key="plotBoundary"
                id="plotBoundary"
                height={paperHeightInPixels}
                width={paperWidthInPixels}
                color="black"
                strokeWidth={3}
                lines={plotBoundaryLines}
            />
        );
    }

    render() {
        const {
            paperWidth,
            paperWidthInPixels,
            paperHeightInPixels,
            formattedLayers,
            isPlotBoundaryVisible,
            plotting,
            penX,
            penY
        } = this.props;

        const penWidthAsPercent = penX / AXIDRAW_WIDTH_IN_STEPS;
        const penHeightAsPercent = penY / AXIDRAW_HEIGHT_IN_STEPS;
        const penXInPixels = paperWidthInPixels * penWidthAsPercent;
        const penYInPixels = paperHeightInPixels * penHeightAsPercent;

        return (
            <div id="plotContent" className={styles.plotContentContainer}>
                <PaperCanvas
                    width={paperWidthInPixels}
                    height={paperHeightInPixels}
                />
                <div style={{ paperWidth }}>
                    {plotting && (
                        <PenPositionLayer
                            height={paperHeightInPixels}
                            width={paperWidthInPixels}
                            penX={penXInPixels}
                            penY={penYInPixels}
                        />
                    )}
                    {isPlotBoundaryVisible && this.renderPlotBoundary()}
                    {formattedLayers.map((layer) => {
                        return (
                            <CanvasLayer
                                key={layer.id}
                                id={layer.id}
                                height={paperHeightInPixels}
                                width={paperWidthInPixels}
                                color={layer.color}
                                strokeWidth={1.2}
                                lines={layer.lines}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {
        paperWidth,
        paperHeight,
        scale,
        isPlotBoundaryVisible,
        penLocation,
        currentLineId,
        currentPlotPercentage,
        plotting
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

    const [penX, penY] = penLocation;

    return {
        height,
        width,
        penX,
        penY,
        currentLineId,
        currentPlotPercentage,
        paperWidthInPixels,
        paperHeightInPixels,
        scale,
        paperWidth,
        paperHeight,
        formattedLayers,
        isPlotBoundaryVisible,
        plotting
    };
};

export default connect(mapStateToProps)(PlotContent);

PlotContent.defaultProps = {
    lineCallback: null,
    lines: []
};
