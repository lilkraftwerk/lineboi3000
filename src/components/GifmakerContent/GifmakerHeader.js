import React, { useState } from 'react';
import PropTypes, { LayerType } from 'customPropTypes';
import { connect } from 'react-redux';
import idGenerator from 'utils/id';
import _ from 'lodash';
import {
    moveFrameUp,
    moveFrameDown,
    deleteFrameFromGif
} from 'store/gifmaker/gifmakerActions';

import SingleHeaderFrame from './SingleHeaderFrame';

import styles from './FrameHeader.styles.css';

export const FrameHeader = ({ activeFrames, dispatch }) => {
    const onDeleteFrame = id => {
        dispatch(deleteFrameFromGif(id));
    };

    const onMoveFrameUp = id => {
        dispatch(moveFrameUp(id));
    };

    const onMoveFrameDown = id => {
        dispatch(moveFrameDown(id));
    };

    const mappedFrames = activeFrames.map(frame => {
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

    return <div className={styles.layerContainer}>{mappedFrames}</div>;
};

const mapStateToProps = state => {
    return {
        activeFrames: state.gifmakerReducer.activeFrames
    };
};

export default connect(mapStateToProps)(FrameHeader);
