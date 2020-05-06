import React, { useState } from 'react';
import { SidebarItem } from 'components/common/SidebarContainer';
import styles from './ShrinkCanvasOptions.styles.css';

const ShrinkCanvasOptions = props => {
    const { globalHeight, globalWidth, onShrinkCanvas } = props;
    const [shrinkFactorIndex, setShrinkFactorIndex] = useState(3);
    const factors = [
        [0.1, '1/10'],
        [0.25, '1/4'],
        [0.5, '1/2'],
        [0.75, '3/4']
    ];

    const [selectedFactor] = factors[shrinkFactorIndex];
    const finalHeight = globalHeight * selectedFactor;
    const finalWidth = globalWidth * selectedFactor;

    return (
        <SidebarItem title="shrink canvas options" height={2}>
            {factors.map(([, displayText], index) => {
                return (
                    <button
                        key={displayText}
                        style={{ gridColumn: 'span 2' }}
                        type="button"
                        disabled={index === shrinkFactorIndex}
                        onClick={() => {
                            setShrinkFactorIndex(index);
                        }}
                    >
                        {displayText}
                    </button>
                );
            })}
            <div className={styles.finalOutputTitle}>
                {finalHeight}H X {finalWidth}W
            </div>
            <button
                style={{ gridColumn: 'span 4' }}
                type="button"
                onClick={() => {
                    onShrinkCanvas(selectedFactor);
                }}
            >
                shrink canvas
            </button>
        </SidebarItem>
    );
};

export default ShrinkCanvasOptions;
