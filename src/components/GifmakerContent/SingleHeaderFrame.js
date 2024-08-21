import Icon from 'components/common/Icon/Icon';
import React from 'react';
import * as styles from './SingleHeaderFrame.styles.css';

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
                    emoji="leftarrow"
                    onClick={() => {
                        onMoveFrameDown(id);
                    }}
                />
                <Icon
                    height={24}
                    width={24}
                    emoji="rightarrow"
                    onClick={() => {
                        onMoveFrameUp(id);
                    }}
                />
                <Icon
                    height={24}
                    width={24}
                    emoji="trashperson"
                    onClick={() => {
                        onDeleteFrame(id);
                    }}
                />
            </div>
        </div>
    );
};

export default SingleHeaderFrame;
