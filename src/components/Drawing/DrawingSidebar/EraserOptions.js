import PercentClicker from 'components/common/PercentClicker/PercentClicker';
import { SidebarItem } from 'components/common/SidebarContainer/SidebarContainer';
import React from 'react';
import { setOptionByKey } from 'store/drawing/drawingActions';

const EraserOptions = (props) => {
    const { eraserRadius, dispatch } = props;

    return (
        <SidebarItem title="eraser options" height={2}>
            <PercentClicker
                setValue={(value) => {
                    dispatch(
                        setOptionByKey({
                            key: 'eraserRadius',
                            value
                        })
                    );
                }}
                float={false}
                title="radius"
                minLabel="1"
                maxLabel="30"
                minValue={1}
                maxValue={30}
                currentValue={eraserRadius}
            />
        </SidebarItem>
    );
};

export default EraserOptions;
