import React from 'react';
import { setMultiplyCanvasOptions } from 'store/drawing/drawingActions';
import { multiplyCanvas } from 'store/line/lineActions';
import { SidebarItem } from 'components/common/SidebarContainer';
import PercentClicker from 'components/common/PercentClicker';

import styles from './ShrinkCanvasOptions.styles.css';

const MultiplyCanvasOptions = (props) => {
    const {
        multiplyCanvasOptions,
        globalHeight,
        globalWidth,
        dispatch
    } = props;

    const { x, y } = multiplyCanvasOptions;
    const finalHeight = globalHeight * y;
    const finalWidth = globalWidth * x;

    return (
        <SidebarItem title="multiply canvas" height={2}>
            <PercentClicker
                setValue={(value) => {
                    dispatch(setMultiplyCanvasOptions('x', value));
                }}
                title="times x"
                minLabel="2"
                maxLabel="15"
                minValue={1}
                maxValue={15}
                currentValue={x}
            />
            <PercentClicker
                setValue={(value) => {
                    dispatch(setMultiplyCanvasOptions('y', value));
                }}
                title="times y"
                minLabel="2"
                maxLabel="15"
                minValue={1}
                maxValue={15}
                currentValue={y}
            />
            <div className={styles.finalOutputTitle}>
                {finalHeight}H X {finalWidth}W
            </div>
            <button
                style={{ gridColumn: 'span 4' }}
                type="button"
                onClick={() => {
                    dispatch(
                        multiplyCanvas({
                            currentHeight: globalHeight,
                            currentWidth: globalWidth,
                            timesX: x,
                            timesY: y
                        })
                    );
                }}
            >
                multiply canvas
            </button>
        </SidebarItem>
    );
};

export default MultiplyCanvasOptions;
