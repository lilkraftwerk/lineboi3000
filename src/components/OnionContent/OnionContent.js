import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { setHeight, setWidth } from 'store/onions/onionsActions';
import { getCurrentOptions } from 'store/onions/onionsSelectors';
import Icon from 'components/common/Icon';

import styles from './OnionContent.styles.css';

const HeightAndWidth = ({ height, width, onSaveOnion }) => {
    const [stateHeight, setHeightState] = useState(height);
    const [stateWidth, setWidthState] = useState(width);
    const [editing, toggleEditing] = useState(false);

    const onSave = () => {
        onSaveOnion('height', stateHeight);
        onSaveOnion('width', stateWidth);
        toggleEditing(!editing);
    };

    const onExit = () => {
        setHeightState(height);
        setWidthState(width);
    };

    return (
        <div className={styles.oneOption}>
            <div className={styles.title}>sizes</div>
            <div className={styles.optionContent}>
                <div className={styles.inputColumn}>
                    <label className={styles.label}>height</label>
                    <input
                        className={styles.input}
                        type="number"
                        min="1"
                        max="1150"
                        value={stateHeight}
                        disabled={!editing}
                        onChange={(e) =>
                            setHeightState(Number.parseFloat(e.target.value))
                        }
                    />
                </div>
                <div className={styles.inputColumn}>
                    <label className={styles.label}>width</label>
                    <input
                        className={styles.input}
                        type="number"
                        min="1"
                        max="1150"
                        value={stateWidth}
                        disabled={!editing}
                        onChange={(e) =>
                            setWidthState(Number.parseFloat(e.target.value))
                        }
                    />
                </div>
                <div className={styles.saveRow}>
                    {!editing && (
                        <Fragment>
                            <Icon
                                height={32}
                                width={32}
                                fileName="pencil"
                                onClick={() => {
                                    toggleEditing(!editing);
                                }}
                            />
                        </Fragment>
                    )}
                    {editing && (
                        <Fragment>
                            <Icon
                                height={32}
                                width={32}
                                fileName="x"
                                onClick={() => {
                                    onExit();
                                    toggleEditing(!editing);
                                }}
                            />
                            <label className={styles.label}>save</label>
                            <Icon
                                height={32}
                                width={32}
                                fileName="ok"
                                onClick={() => {
                                    onSave();
                                }}
                            />
                        </Fragment>
                    )}
                </div>
            </div>
        </div>
    );
};

export class OnionContent extends React.Component {
    state = {};

    onSaveOnion = (name, value) => {
        const { dispatch } = this.props;

        if (name === 'height') {
            dispatch(setHeight(value));
        }

        if (name === 'width') {
            dispatch(setWidth(value));
        }
    };

    render() {
        const {
            options: { height, width }
        } = this.props;

        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <HeightAndWidth
                        onSaveOnion={this.onSaveOnion}
                        height={height}
                        width={width}
                    />
                    <div className={styles.oneOption} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const options = getCurrentOptions(state);
    return {
        options
    };
};

export default connect(mapStateToProps)(OnionContent);

OnionContent.defaultProps = {};

OnionContent.propTypes = {};
