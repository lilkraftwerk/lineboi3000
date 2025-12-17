import {
    omitBy as _omitBy,
    isEqual as _isEqual,
    isNil as _isNil
} from 'es-toolkit';
import React from 'react';
import { connect } from 'react-redux';

import {
    SidebarContainer,
    SidebarItem
} from 'components/common/SidebarContainer/SidebarContainer';

import { EnabledToggleButton } from 'components/common/SidebarButton/SidebarButton';

import ColorPicker from 'components/common/Colors/ColorPicker';
import NumberInput from 'components/common/NumberInput/NumberInput';
import PercentClicker from 'components/common/PercentClicker/PercentClicker';

import { setGlobalOptionByKey } from '../../store/options/optionsActions';
import ColorList from '../common/Colors/ColorList';
import * as styles from './OptionsSidebar.styles.css';

const initialState = {
    tempHeight: null,
    tempWidth: null,
    tempPointShowRadius: null,
    tempPointShowColor: null,
    tempShiftToDraw: null
};

const tempKeyValueMap = {
    tempHeight: 'height',
    tempWidth: 'width',
    tempPointShowRadius: 'pointShowRadius',
    tempPointShowColor: 'pointShowColor',
    tempShiftToDraw: 'shiftToDraw'
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
        const changedValues = Object.keys(_omitBy(this.state, _isNil));
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
        const { height, width, pointShowRadius, pointShowColor, shiftToDraw } =
            this.props;
        const {
            tempHeight,
            tempWidth,
            tempPointShowRadius,
            tempPointShowColor,
            tempShiftToDraw
        } = this.state;

        if (
            (tempHeight && !_isEqual(height, tempHeight)) ||
            (tempWidth && !_isEqual(width, tempWidth)) ||
            (tempPointShowRadius &&
                !_isEqual(pointShowRadius, tempPointShowRadius)) ||
            (tempPointShowColor &&
                !_isEqual(pointShowColor, tempPointShowColor)) ||
            (tempShiftToDraw != null && !_isEqual(shiftToDraw, tempShiftToDraw))
        ) {
            return true;
        }
        return false;
    };

    render() {
        const { height, width, pointShowRadius, pointShowColor, shiftToDraw } =
            this.props;
        const {
            tempHeight,
            tempWidth,
            tempPointShowColor,
            tempPointShowRadius,
            tempShiftToDraw
        } = this.state;

        const isDirty = this.isDirty();
        const currentShiftToDraw =
            tempShiftToDraw != null ? tempShiftToDraw : shiftToDraw;

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
                    <EnabledToggleButton
                        style={{ gridColumn: 'span 4' }}
                        onClick={() => {
                            this.setState({
                                tempShiftToDraw: !currentShiftToDraw
                            });
                        }}
                        active={currentShiftToDraw}
                        labelActive="press shift to draw: on"
                        labelInactive="press shift to draw: off"
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
