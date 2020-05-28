import React from 'react';
import PropTypes, { ModeType } from 'customPropTypes';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';

import { switchMode } from 'store/global/globalActions';
import { setGifmakerLoading } from 'store/gifmaker/gifmakerActions';

import DrawingContent from './Drawing/DrawingContent/DrawingContent';
import DrawingSidebar from './Drawing/DrawingSidebar/DrawingSidebar';
import PlotContent from './PlotContent/PlotContent';
import GifmakerContent from './GifmakerContent/GifmakerContent';
import GifmakerSidebar from './GifmakerContent/GifmakerSidebar';
import PlotSidebar from './PlotSidebar/PlotSidebar';
import OnionContent from './OnionContent/OnionContent';
import LayerControls from './LayerHeader/LayerHeader';
import GridContent from './GridContent/GridContent';
import EfxContent from './EfxContent/EfxContent';
import EfxSidebar from './EfxSidebar/EfxSidebar';

import PointCounter from './PointCounter/PointCounter';
import GridControls from './GridControls/GridControls';
import GifmakerHeader from './GifmakerContent/GifmakerHeader';
import Listener from './Listener';

import styles from './AppContainer.styles.css';

const MODES = ['draw', 'efx', 'plot', 'onions', 'gifmaker'];

class AppContainer extends React.Component {
    componentDidMount() {
        const { dispatch } = this.props;
        ipcRenderer.on('menu:startSaveProcess', () => {
            dispatch({ type: 'SEND_TO_MAIN_PROCESS' });
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

        return (
            <div className={styles.wholeApp}>
                <Listener />
                <div className={styles.headerLeft}>lineboi</div>
                <div className={styles.headerRight}>
                    {mode !== 'gifmaker' && <LayerControls />}
                    {mode === 'gifmaker' && <GifmakerHeader />}
                </div>
                <div className={styles.sidebar}>
                    <div className={styles.permanentOptions}>
                        {MODES.map((modeName) => {
                            return (
                                <button
                                    key={modeName}
                                    type="button"
                                    onClick={() => {
                                        this.updateMode(modeName);
                                    }}
                                    disabled={mode === modeName}
                                    className={styles.buttonHalf}
                                >
                                    {modeName}
                                </button>
                            );
                        })}
                        <PointCounter />
                        {showGrid && <GridControls />}
                    </div>
                    {mode === 'efx' && <EfxSidebar />}
                    {mode === 'draw' && <DrawingSidebar />}
                    {mode === 'plot' && <PlotSidebar />}
                    {mode === 'gifmaker' && <GifmakerSidebar />}
                </div>
                <div className={styles.content}>
                    {showGrid && <GridContent />}
                    {mode === 'draw' && <DrawingContent />}
                    {mode === 'efx' && <EfxContent />}
                    {mode === 'plot' && <PlotContent />}
                    {mode === 'onions' && <OnionContent />}
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

AppContainer.propTypes = {
    dispatch: PropTypes.func.isRequired,
    mode: ModeType.isRequired
};
