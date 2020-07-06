import React from 'react';
import Icon from 'components/common/Icon/Icon';

import styles from './FrameHeader.styles.css';

const SingleHeaderFrame = ({
    id,
    objectUrl,
    onMoveFrameUp,
    onMoveFrameDown,
    onDeleteFrame
    // canMoveFrameUp,
    // canMoveFrameDown
}) => {
    return (
        <div className={styles.singleFrame}>
            <img className={styles.image} src={objectUrl} />
            <div className={styles.controls}>
                <Icon
                    height={24}
                    width={24}
                    fileName="arrow-left"
                    onClick={() => {
                        onMoveFrameDown(id);
                    }}
                />
                <Icon
                    height={24}
                    width={24}
                    fileName="arrow-right"
                    onClick={() => {
                        onMoveFrameUp(id);
                    }}
                />
                <Icon
                    height={24}
                    width={24}
                    fileName="trash"
                    onClick={() => {
                        onDeleteFrame(id);
                    }}
                />
            </div>
        </div>
    );
};

export default SingleHeaderFrame;
