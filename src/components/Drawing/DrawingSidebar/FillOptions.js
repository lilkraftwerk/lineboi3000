import AngleChooser from 'components/common/AngleChooser/AngleChooser';
import PercentClicker from 'components/common/PercentClicker/PercentClicker';
import { SidebarItem } from 'components/common/SidebarContainer/SidebarContainer';
import React from 'react';
import { connect } from 'react-redux';
import { setOptionByKey } from 'store/drawing/drawingActions';

const FillOptions = (props) => {
    const {
        fillAngle,
        fillRadius,
        fillCircle,
        distanceBetweenLines,
        distanceBetweenPoints,
        mode,
        dispatch
    } = props;

    return (
        <SidebarItem title="fill options" height={2}>
            <AngleChooser
                setValue={(value) => {
                    dispatch(
                        setOptionByKey({
                            key: 'fillAngle',
                            value
                        })
                    );
                }}
                title="fill angle"
                minLabel="1"
                maxLabel="180"
                minValue={1}
                maxValue={180}
                currentValue={fillAngle}
            />
            <PercentClicker
                setValue={(value) => {
                    dispatch(
                        setOptionByKey({
                            key: 'fillRadius',
                            value
                        })
                    );
                }}
                float={false}
                title="fill radius"
                minLabel="1"
                maxLabel="250"
                minValue={1}
                maxValue={250}
                currentValue={fillRadius}
            />
            {mode === 'fill' && (
                <button
                    style={{ gridColumn: 'span 4' }}
                    type="button"
                    onClick={() => {
                        dispatch(
                            setOptionByKey({
                                key: 'fillCircle',
                                value: !fillCircle
                            })
                        );
                    }}
                >
                    {fillCircle ? 'circle' : 'square'}
                </button>
            )}
            <PercentClicker
                setValue={(value) => {
                    dispatch(
                        setOptionByKey({
                            key: 'distanceBetweenLines',
                            value
                        })
                    );
                }}
                float={false}
                title="distance between lines"
                minLabel="1"
                maxLabel="15"
                minValue={1}
                maxValue={15}
                currentValue={distanceBetweenLines}
            />
            <PercentClicker
                setValue={(value) => {
                    dispatch(
                        setOptionByKey({
                            key: 'distanceBetweenPoints',
                            value
                        })
                    );
                }}
                float={false}
                title="distance between points"
                minLabel="1"
                maxLabel="15"
                minValue={1}
                maxValue={15}
                currentValue={distanceBetweenPoints}
            />
        </SidebarItem>
    );
};

const mapStateToProps = (state) => {
    return {
        ...state.drawingReducer
    };
};

export default connect(mapStateToProps)(FillOptions);
