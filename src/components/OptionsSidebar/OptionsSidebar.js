import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import {
    SidebarContainer,
    SidebarItem
} from 'components/common/SidebarContainer/SidebarContainer';

import PercentClicker from 'components/common/PercentClicker/PercentClicker';
import ColorPicker from 'components/common/Colors/ColorPicker';
import NumberInput from 'components/common/NumberInput/NumberInput';

import ColorList from '../common/Colors/ColorList';
import { setGlobalOptionByKey } from '../../store/options/optionsActions';
import styles from './OptionsSidebar.styles.css';

const initialState = {
    tempHeight: null,
    tempWidth: null,
    tempPointShowRadius: null,
    tempPointShowColor: null
};

const tempKeyValueMap = {
    tempHeight: 'height',
    tempWidth: 'width',
    tempPointShowRadius: 'pointShowRadius',
    tempPointShowColor: 'pointShowColor'
};

class OptionsSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    resetState = () => {
        this.setState(initialState);
    };

    saveOptions = () => {
        const { dispatch } = this.props;
        const { state } = this;
        const changedValues = _.keys(_.omitBy(this.state, _.isNil));
        changedValues.forEach((changedKey) => {
            const reducerKey = tempKeyValueMap[changedKey];
            const value = state[changedKey];
            dispatch(
                setGlobalOptionByKey({
                    key: reducerKey,
                    value
                })
            );
        });
        this.resetState();
    };

    isDirty = () => {
        const { height, width, pointShowRadius, pointShowColor } = this.props;
        const {
            tempHeight,
            tempWidth,
            tempPointShowRadius,
            tempPointShowColor
        } = this.state;

        if (
            (tempHeight && !_.isEqual(height, tempHeight)) ||
            (tempWidth && !_.isEqual(width, tempWidth)) ||
            (tempPointShowRadius &&
                !_.isEqual(pointShowRadius, tempPointShowRadius)) ||
            (tempPointShowColor &&
                !_.isEqual(pointShowColor, tempPointShowColor))
        ) {
            return true;
        }
        return false;
    };

    render() {
        const { height, width, pointShowRadius, pointShowColor } = this.props;
        const {
            tempHeight,
            tempWidth,
            tempPointShowColor,
            tempPointShowRadius
        } = this.state;

        const isDirty = this.isDirty();

        return (
            <SidebarContainer>
                <SidebarItem title="global options">
                    <NumberInput
                        value={tempHeight || height}
                        suffix="px"
                        label="draw area height"
                        onChange={(value) => {
                            this.setState({ tempHeight: Number(value) });
                        }}
                    />
                    <NumberInput
                        value={tempWidth || width}
                        suffix="px"
                        label="draw area width"
                        onChange={(value) => {
                            this.setState({ tempWidth: Number(value) });
                        }}
                    />
                    <PercentClicker
                        setValue={(value) => {
                            this.setState({
                                tempPointShowRadius: Number(value)
                            });
                        }}
                        float={false}
                        title="visible point radius"
                        minLabel="1"
                        maxLabel="5"
                        minValue={1}
                        maxValue={5}
                        currentValue={tempPointShowRadius || pointShowRadius}
                    />
                    <ColorPicker
                        type="button"
                        title="point show color"
                        onColorSelect={(color) => {
                            this.setState({ tempPointShowColor: color });
                        }}
                        colorList={ColorList}
                    />
                    <div
                        style={{
                            backgroundColor:
                                tempPointShowColor || pointShowColor
                        }}
                        className={styles.backgroundColorDiv}
                    />
                    <button
                        style={{ gridColumn: 'span 2' }}
                        type="button"
                        disabled={!isDirty}
                        onClick={() => {
                            this.saveOptions();
                        }}
                    >
                        save
                    </button>
                    <button
                        style={{ gridColumn: 'span 2' }}
                        type="button"
                        disabled={!isDirty}
                        onClick={() => {
                            this.resetState();
                        }}
                    >
                        cancel
                    </button>
                </SidebarItem>
            </SidebarContainer>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.optionsReducer
    };
};

export default connect(mapStateToProps)(OptionsSidebar);
