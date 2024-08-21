import { ipcRenderer } from 'electron';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import { setGifmakerLoading } from 'store/gifmaker/gifmakerActions';
import { switchMode } from 'store/global/globalActions';

import DrawingContent from './Drawing/DrawingContent/DrawingContent';
import DrawingSidebar from './Drawing/DrawingSidebar/DrawingSidebar';
import EfxContent from './EfxContent/EfxContent';
import EfxSidebar from './EfxSidebar/EfxSidebar';
import GifmakerContent from './GifmakerContent/GifmakerContent';
import GifmakerSidebar from './GifmakerContent/GifmakerSidebar';
import GridContent from './GridContent/GridContent';
import LayerControls from './LayerHeader/LayerHeader';
import OptionsContent from './OptionsContent/OptionsContent';
import OptionsSidebar from './OptionsSidebar/OptionsSidebar';
import PlotContent from './PlotContent/PlotContent';
import PlotHeader from './PlotHeader/PlotHeader';
import PlotSidebar from './PlotSidebar/PlotSidebar';

import GifmakerHeader from './GifmakerContent/GifmakerHeader';
import GridControls from './GridControls/GridControls';
import Listener from './Listener';
import PointCounter from './PointCounter/PointCounter';

import * as styles from './AppContainer.styles.css';

const MODES = {
    draw: {
        displayName: 'draw',
        emoji: 'fountainpen'
    },
    efx: {
        displayName: 'efx',
        emoji: 'toolbox'
    },
    plot: {
        displayName: 'plot',
        emoji: 'pagecurl'
    },
    gifmaker: {
        displayName: 'gif',
        emoji: 'moviecamera'
    },
    options: {
        displayName: 'options',
        emoji: 'gear'
    }
};

class AppContainer extends React.Component {
    componentDidMount() {
        const { dispatch } = this.props;
        ipcRenderer.on('menu:startSaveProcess', () => {
            dispatch({ type: 'SEND_TO_MAIN_PROCESS' });
        });

        ipcRenderer.on('app:reloadBackground', () => {
            ipcRenderer.send('main:reloadBackground');
        });
    }

    updateMode = (mode) => {
        const { dispatch } = this.props;
        if (mode === 'gifmaker') {
            dispatch(setGifmakerLoading(true));
        }
        dispatch(switchMode(mode));
    };

    render() {
        const { mode } = this.props;
        const showGrid = ['efx', 'draw'].includes(mode);
        const showLayerHeader = ['draw', 'efx'].includes(mode);
        const showPlotHeader = mode === 'plot';
        const showGifHeader = mode === 'gifmaker';
        const headerRightClass =
            mode === 'options'
                ? styles.headerRightDisabled
                : styles.headerRight;

        return (
            <div className={styles.wholeApp}>
                <Listener />
                <div className={styles.headerLeft}>lineboi3000</div>
                <div className={headerRightClass}>
                    {showLayerHeader && <LayerControls />}
                    {showPlotHeader && <PlotHeader />}
                    {showGifHeader && <GifmakerHeader />}
                </div>
                <div className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        {_.keys(MODES).map((modeName) => {
                            const { displayName, emoji } = MODES[modeName];
                            return (
                                <button
                                    id={`modeButton-${modeName}`}
                                    key={modeName}
                                    type="button"
                                    onClick={() => {
                                        this.updateMode(modeName);
                                    }}
                                    disabled={mode === modeName}
                                    className={styles.buttonHalf}
                                >
                                    {displayName}{' '}
                                    <img
                                        className={styles.mainModeButtonImg}
                                        src={`assets/emojis/${emoji}.png`}
                                    />
                                </button>
                            );
                        })}
                        <PointCounter />
                    </div>
                    <div className={styles.sidebarContent}>
                        {showGrid && <GridControls />}
                        {mode === 'efx' && <EfxSidebar />}
                        {mode === 'draw' && <DrawingSidebar />}
                        {mode === 'plot' && <PlotSidebar />}
                        {mode === 'options' && <OptionsSidebar />}
                        {mode === 'gifmaker' && <GifmakerSidebar />}
                    </div>
                </div>
                <div className={styles.content}>
                    {showGrid && <GridContent />}
                    {mode === 'draw' && <DrawingContent />}
                    {mode === 'efx' && <EfxContent />}
                    {mode === 'plot' && <PlotContent />}
                    {mode === 'options' && <OptionsContent />}
                    {mode === 'gifmaker' && <GifmakerContent />}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mode: state.globalReducer.mode
    };
};

export default connect(mapStateToProps)(AppContainer);
