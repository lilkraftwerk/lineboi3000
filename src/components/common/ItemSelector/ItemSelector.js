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
    const [menuOpen, setMenuOpen] = React.useState(false);

    let selectedKey = '';
    if (items?.items[selectedIndex]) {
        selectedKey = items[selectedIndex].key;
    }

    useEffect(() => {
        onChange(selectedKey);
    }, []);

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
            {menuOpen && (
                <div className={styles.dropdownContainer}>
                    {items.map((filter, index) => (
                        <div
                            onClick={() => {
                                setSelectedIndex(index);
                                setMenuOpen(false);
                                const { key } = items[index];
                                onSelect(key);
                            }}
                            key={filter.key}
                            className={styles.dropdownItem}
                        >
                            {filter.key}
                        </div>
                    ))}
                </div>
            )}
            {!menuOpen && (
                <>
                    <button
                        type="button"
                        onClick={() => {
                            selectLeft();
                        }}
                        className={styles.leftArrow}
                    >
                        ⬅️
                    </button>
                    <div
                        onClick={() => {
                            setMenuOpen(true);
                        }}
                        className={styles.textBox}
                    >
                        {selectedKey}
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            selectRight();
                        }}
                        className={styles.rightArrow}
                    >
                        ➡️
                    </button>
                </>
            )}
            {showConfirmButton && !menuOpen && (
                <button
                    type="button"
                    onClick={() => {
                        onSelect(selectedKey);
                    }}
                    className={styles.confirm}
                >
                    add
                </button>
            )}
            {menuOpen && (
                <button
                    type="button"
                    onClick={() => {
                        setMenuOpen(false);
                    }}
                    className={styles.cancel}
                >
                    X
                </button>
            )}
        </div>
    );
};

export default ItemSelector;
