import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
    setFrames,
    setGifmakerLoading,
    addActiveFrame
} from 'store/gifmaker/gifmakerActions';
import {
    SidebarContainer,
    SidebarItem
} from 'components/common/SidebarContainer';

import styles from './GifmakerSidebar.styles.css';

class GifmakerSidebar extends React.Component {
    componentDidMount = async () => {
        const { frames, dispatch } = this.props;
        const promises = frames.map(({ data }) => {
            return fetch(data);
        });

        const fetchPromises = await Promise.all(promises);
        const responsePromises = await fetchPromises.map(response =>
            response.blob()
        );
        const results = await Promise.all(responsePromises);
        const urls = results.map(blob => {
            return URL.createObjectURL(blob);
        });

        const framesWithUrls = frames.map((frame, index) => {
            const objectUrl = urls[index];
            return {
                ...frame,
                objectUrl
            };
        });

        dispatch(setFrames(framesWithUrls));
        dispatch(setGifmakerLoading(false));
    };

    render() {
        const { loading, frames, dispatch } = this.props;

        if (loading) {
            return <SidebarContainer> LOADING </SidebarContainer>;
        }

        const makeFrame = frame => {
            const { id, objectUrl } = frame;
            return (
                <div className={styles.singleFrame}>
                    <img className={styles.framePic} src={objectUrl} />
                    <button
                        className={styles.button}
                        type="button"
                        onClick={() => {
                            dispatch(addActiveFrame(frame));
                        }}
                    >
                        add
                    </button>
                    <button
                        className={styles.button}
                        type="button"
                        onClick={() => {
                            console.log('delete', id);
                        }}
                    >
                        delete
                    </button>
                </div>
            );
        };

        return (
            <SidebarContainer>
                <SidebarItem title="frames">
                    {frames.length === 0 && (
                        <div className={styles.noFrames}>
                            add frames in efx mode
                        </div>
                    )}
                    {frames.map(frame => {
                        return makeFrame(frame);
                    })}
                </SidebarItem>
            </SidebarContainer>
        );
    }
}

const mapStateToProps = state => {
    return {
        frames: state.gifmakerReducer.frames,
        loading: state.gifmakerReducer.loading
    };
};

export default connect(mapStateToProps)(GifmakerSidebar);
