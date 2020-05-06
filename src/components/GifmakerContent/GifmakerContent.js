import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import './gif';
import './gif.worker';
import {
    setFrames,
    setGifmakerLoading,
    setMasterGif
} from 'store/gifmaker/gifmakerActions';

class GifmakerContent extends React.Component {
    componentDidUpdate(prevProps) {
        const { activeFrames } = this.props;
        const justIds = frames => frames.map(frame => frame.id);

        const prevIds = justIds(prevProps.activeFrames);
        const currentIds = justIds(activeFrames);

        if (!_.isEqual(prevIds, currentIds)) {
            this.updateGif();
        }
    }

    updateGif = async () => {
        const { activeFrames, dispatch } = this.props;
        const images = activeFrames.map(frame => frame.objectUrl);
        const gif = new GIF({
            //eslint-disable-line
            workers: 2,
            quality: 2,
            width: 800,
            height: 600,
            repeat: 0,
            workerScript: './gif.worker.js'
        });
        images.forEach(async img => {
            const elem = document.createElement('img');
            elem.setAttribute('src', img);
            gif.addFrame(elem, { delay: 100 });
        });
        gif.on('finished', function(blob) {
            const url = URL.createObjectURL(blob);
            dispatch(setMasterGif(url));
        });

        gif.render();
    };

    render() {
        const { loading, masterGif } = this.props;

        if (loading) {
            return <div>loading...</div>;
        }

        return (
            <div>
                <img src={masterGif} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.gifmakerReducer.loading,
        activeFrames: state.gifmakerReducer.activeFrames,
        masterGif: state.gifmakerReducer.masterGif
    };
};

export default connect(mapStateToProps)(GifmakerContent);
