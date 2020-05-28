import React, { useEffect } from 'react';

import styles from './ItemSelector.styles.css';

const ItemSelector = ({
    onSelect = () => {},
    onChange = () => {},
    showConfirmButton = true,
    spanCount = 4,
    items
}) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    let selectedKey = '';
    if (items && items[selectedIndex]) {
        selectedKey = items[selectedIndex].key;
    }

    useEffect(() => {
        onChange(selectedKey);
    }, [selectedIndex]);

    const selectLeft = () => {
        if (selectedIndex === 0) {
            return;
        }

        setSelectedIndex(selectedIndex - 1);
    };

    const selectRight = () => {
        if (selectedIndex === items.length - 1) {
            return;
        }

        setSelectedIndex(selectedIndex + 1);
    };

    if (!items) {
        return <div className={styles.itemSelector}>loading</div>;
    }

    return (
        <div
            style={{ gridColumn: `span ${spanCount}` }}
            className={styles.itemSelector}
        >
            <button
                type="button"
                onClick={() => {
                    selectLeft();
                }}
                className={styles.leftArrow}
            >
                ⬅️
            </button>
            <div className={styles.textBox}>{selectedKey}</div>
            <button
                type="button"
                onClick={() => {
                    selectRight();
                }}
                className={styles.rightArrow}
            >
                ➡️
            </button>
            {showConfirmButton && (
                <button
                    type="button"
                    onClick={() => {
                        onSelect(selectedKey);
                    }}
                    className={styles.confirm}
                >
                    ok
                </button>
            )}
        </div>
    );
};

export default ItemSelector;
