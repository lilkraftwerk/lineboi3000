import React from 'react';
import { connect } from 'react-redux';
import { getAllEfxLines } from 'store/line/lineSelectors';
import { getCurrentOptions } from 'store/options/optionsSelectors';
import { CanvasLayer } from 'components/common/SvgLayer/SvgLayer';
import {
    formatLayersForPlotDisplay,
    generatePlotBoundaries
} from '../../utils/plotUtils';
import PaperCanvas from './PaperCanvas';

import styles from './PlotContent.styles.css';

// to do make configurable
const PIXELS_PER_INCH = 75;

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
            isPlotBoundaryVisible
            // scale,
            // currentLineId
        } = this.props;

        // const currentLine = _.flatten(
        //     formattedLayers.map(layer => layer.efxLines)
        // ).find(line => line.id === currentLineId);

        return (
            <div id="plotContent" className={styles.plotContentContainer}>
                <PaperCanvas
                    width={paperWidthInPixels}
                    height={paperHeightInPixels}
                />

                <div style={{ paperWidth }} className={styles.container}>
                    {isPlotBoundaryVisible && this.renderPlotBoundary()}
                    {formattedLayers.map((layer) => {
                        return (
                            <CanvasLayer
                                key={layer.layerID}
                                id={layer.layerID}
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
        currentLineId
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
        paperWidthInPixels,
        paperHeightInPixels,
        scale,
        paperWidth,
        paperHeight,
        formattedLayers,
        isPlotBoundaryVisible
    };
};

export default connect(mapStateToProps)(PlotContent);

PlotContent.defaultProps = {
    lineCallback: null,
    lines: []
};
