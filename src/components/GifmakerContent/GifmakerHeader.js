import React from 'react';
import { connect } from 'react-redux';
import {
    deleteActiveFrame,
    moveFrameDown,
    moveFrameUp
} from 'store/gifmaker/gifmakerActions';

import SingleHeaderFrame from './SingleHeaderFrame';

import styles from './GifmakerHeader.styles.css';

export const FrameHeader = ({ activeFrames, dispatch }) => {
    const onDeleteFrame = (id) => {
        dispatch(deleteActiveFrame(id));
    };

    const onMoveFrameUp = (id) => {
        dispatch(moveFrameUp(id));
    };

    const onMoveFrameDown = (id) => {
        dispatch(moveFrameDown(id));
    };

    const mappedFrames = activeFrames.map((frame) => {
        return (
            <SingleHeaderFrame
                key={frame.id}
                id={frame.id}
                objectUrl={frame.objectUrl}
                onMoveFrameUp={onMoveFrameUp}
                onDeleteFrame={onDeleteFrame}
                onMoveFrameDown={onMoveFrameDown}
            />
        );
    });

    return <div className={styles.gifHeaderContainer}>{mappedFrames}</div>;
};

const mapStateToProps = (state) => {
    return {
        activeFrames: state.gifmakerReducer.activeFrames
    };
};

export default connect(mapStateToProps)(FrameHeader);
