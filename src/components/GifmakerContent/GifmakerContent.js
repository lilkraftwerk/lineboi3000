import { ipcRenderer } from 'electron';
import GIF from 'gif.js.optimized';
import { isEqual as _isEqual} from 'es-toolkit';
import React from 'react';
import { connect } from 'react-redux';
import {
    // setFrames,
    // setGifmakerLoading,
    setMasterGif
} from 'store/gifmaker/gifmakerActions';

import * as styles from './GifmakerContent.styles.css';

class GifmakerContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateLoading: false,
            progress: 0
        };
    }

    componentDidUpdate(prevProps) {
        const {
            activeFrames,
            gifBackgroundColor,
            gifHeight,
            gifFrameDelay,
            gifWidth,
            gifQuality
        } = this.props;
        const justIds = (frames) => frames.map((frame) => frame.id);

        const prevIds = justIds(prevProps.activeFrames);
        const currentIds = justIds(activeFrames);

        if (
            !_isEqual(prevIds, currentIds) ||
            !_isEqual(gifBackgroundColor, prevProps.gifBackgroundColor) ||
            !_isEqual(gifHeight, prevProps.gifHeight) ||
            !_isEqual(gifWidth, prevProps.gifWidth) ||
            !_isEqual(gifQuality, prevProps.gifQuality) ||
            !_isEqual(gifFrameDelay, prevProps.gifFrameDelay)
        ) {
            this.startGifUpdate();
        }
    }

    startGifUpdate = () => {
        this.setState({ stateLoading: true }, () => {
            this.updateGif();
        });
    };

    updateGif = async () => {
        const {
            activeFrames,
            gifQuality,
            gifFrameDelay,
            gifBackgroundColor,
            gifHeight,
            gifWidth,
            dispatch
        } = this.props;
        const images = activeFrames.map((frame) => frame.objectUrl);

        const gif = new GIF({
            workers: 2,
            background: gifBackgroundColor,
            quality: gifQuality,
            width: gifWidth,
            height: gifHeight,
            workerScript: 'gif.worker.worker.js',
            repeat: 0
        });
        images.forEach((img) => {
            const elem = document.createElement('img');
            elem.setAttribute('src', img);
            gif.addFrame(elem, { delay: gifFrameDelay });
        });
        gif.on('progress', (progress) => {
            this.setState({ progress });
        });
        gif.on('finished', (blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                ipcRenderer.send('main:sendGifBlob', base64data);
            };
            const url = URL.createObjectURL(blob);
            dispatch(setMasterGif(url));
            this.setState({ stateLoading: false });
        });

        gif.render();
    };

    render() {
        const { loading, masterGif } = this.props;
        const { stateLoading, progress } = this.state;

        const progressInPercentage = Math.round(Number(progress) * 100);

        if (loading || stateLoading) {
            return (
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingBarContainer}>
                        <div className={styles.progressContainer}>
                            {`processing: ${progressInPercentage}%`}
                        </div>
                        <div
                            style={{ width: `${progressInPercentage}%` }}
                            className={styles.loading}
                        />
                    </div>
                </div>
            );
        }

        return (
            <div id="gifmakerContent">
                <img src={masterGif} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.gifmakerReducer
    };
};

export default connect(mapStateToProps)(GifmakerContent);
