import React from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import {
    setFrames,
    setGifmakerLoading,
    addActiveFrame,
    deleteLibraryFrame,
    setGifOptionByKey
} from 'store/gifmaker/gifmakerActions';

import { getCurrentOptions } from 'store/options/optionsSelectors';

import ColorPicker from 'components/common/Colors/ColorPicker';
import NumberInput from 'components/common/NumberInput/NumberInput';

import {
    SidebarContainer,
    SidebarItem
} from 'components/common/SidebarContainer/SidebarContainer';
import ColorList from '../common/Colors/ColorList';

import styles from './GifmakerSidebar.styles.css';

class GifmakerSidebar extends React.Component {
    componentDidMount = async () => {
        const { frames, dispatch, globalHeight, globalWidth } = this.props;
        const promises = frames.map(({ data }) => {
            return fetch(data);
        });

        const fetchPromises = await Promise.all(promises);
        const responsePromises = await fetchPromises.map((response) =>
            response.blob()
        );
        const results = await Promise.all(responsePromises);
        const urls = results.map((blob) => {
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
        // match height and width to global values
        dispatch(
            setGifOptionByKey({
                key: 'gifHeight',
                value: globalHeight
            })
        );
        dispatch(
            setGifOptionByKey({
                key: 'gifWidth',
                value: globalWidth
            })
        );
        dispatch(setGifmakerLoading(false));
    };

    selectBackgroundColor = (color) => {
        const { dispatch } = this.props;
        dispatch(
            setGifOptionByKey({
                key: 'gifBackgroundColor',
                value: color
            })
        );
    };

    addAllFrames = () => {
        const { frames, dispatch } = this.props;
        frames.forEach((frame) => {
            dispatch(addActiveFrame(frame));
        });
    };

    render() {
        const { loading, frames, gifFrameDelay, gifBackgroundColor, dispatch } =
            this.props;

        if (loading) {
            return <SidebarContainer> LOADING </SidebarContainer>;
        }

        const makeFrame = (frame) => {
            const { id, objectUrl } = frame;
            return (
                <div className={styles.singleFrame}>
                    <img
                        style={{ backgroundColor: gifBackgroundColor }}
                        className={styles.framePic}
                        src={objectUrl}
                    />
                    <button
                        className={styles.button}
                        type="button"
                        onClick={() => {
                            dispatch(addActiveFrame(frame));
                        }}
                    >
                        add to gif
                    </button>
                    <button
                        className={styles.button}
                        type="button"
                        onClick={() => {
                            dispatch(deleteLibraryFrame(id));
                        }}
                    >
                        delete
                    </button>
                </div>
            );
        };

        return (
            <SidebarContainer>
                {frames.length > 0 && (
                    <SidebarItem title="gif options">
                        <ColorPicker
                            type="button"
                            onColorSelect={(color) => {
                                this.selectBackgroundColor(color);
                            }}
                            colorList={ColorList}
                        />
                        <div
                            style={{ backgroundColor: gifBackgroundColor }}
                            className={styles.backgroundColorDiv}
                        />
                        <button
                            style={{ gridColumn: 'span 2' }}
                            type="button"
                            onClick={() => {
                                this.addAllFrames();
                            }}
                        >
                            add all frames
                        </button>
                        <button
                            style={{ gridColumn: 'span 2' }}
                            type="button"
                            onClick={() => {
                                ipcRenderer.send('main:saveGif');
                            }}
                        >
                            save gif
                        </button>
                        <NumberInput
                            value={gifFrameDelay}
                            suffix="ms"
                            label="frame delay"
                            onChange={(value) => {
                                dispatch(
                                    setGifOptionByKey({
                                        key: 'gifFrameDelay',
                                        value
                                    })
                                );
                            }}
                        />
                    </SidebarItem>
                )}
                <SidebarItem title="frame library">
                    {frames.length === 0 && (
                        <div className={styles.noFrames}>
                            add frames in efx mode
                        </div>
                    )}
                    {frames.map((frame) => {
                        return makeFrame(frame);
                    })}
                </SidebarItem>
            </SidebarContainer>
        );
    }
}

const mapStateToProps = (state) => {
    const options = getCurrentOptions(state);

    return {
        globalSettings: options,
        globalHeight: options.height,
        globalWidth: options.width,
        ...state.gifmakerReducer
    };
};

export default connect(mapStateToProps)(GifmakerSidebar);
