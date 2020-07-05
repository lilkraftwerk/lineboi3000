/* global GIF */
import React from 'react';
import { ipcRenderer } from 'electron';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
    // setFrames,
    // setGifmakerLoading,
    setMasterGif
} from 'store/gifmaker/gifmakerActions';

class GifmakerContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateLoading: false
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
            !_.isEqual(prevIds, currentIds) ||
            !_.isEqual(gifBackgroundColor, prevProps.gifBackgroundColor) ||
            !_.isEqual(gifHeight, prevProps.gifHeight) ||
            !_.isEqual(gifWidth, prevProps.gifWidth) ||
            !_.isEqual(gifQuality, prevProps.gifQuality) ||
            !_.isEqual(gifFrameDelay, prevProps.gifFrameDelay)
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
            repeat: 0,
            workerScript: './gifjs/gif.worker.js'
        });
        images.forEach((img) => {
            const elem = document.createElement('img');
            elem.setAttribute('src', img);
            gif.addFrame(elem, { delay: gifFrameDelay });
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
        const { stateLoading } = this.state;

        if (loading || stateLoading) {
            return (
                <div>
                    <img src="./assets/loading.gif" />
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
