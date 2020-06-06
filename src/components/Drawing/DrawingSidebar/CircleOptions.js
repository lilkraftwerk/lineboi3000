import React from 'react';
import { setOptionByKey } from 'store/drawing/drawingActions';
import { SidebarItem } from 'components/common/SidebarContainer';
import PercentClicker from 'components/common/PercentClicker';

const CircleOptions = (props) => {
    const { pointsOnCircle, dispatch } = props;

    return (
        <SidebarItem title="circle options" height={2}>
            <PercentClicker
                setValue={(value) => {
                    dispatch(
                        setOptionByKey({
                            key: 'pointsOnCircle',
                            value
                        })
                    );
                }}
                float={false}
                title="points on circle"
                minLabel="10"
                maxLabel="500"
                minValue={10}
                maxValue={500}
                currentValue={pointsOnCircle}
            />
        </SidebarItem>
    );
};

export default CircleOptions;
