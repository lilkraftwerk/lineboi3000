import React, { useState } from 'react';

import styles from './SidebarContainer.styles.css';

export const SidebarContainer = props => {
    const { children } = props;
    return <div className={styles.sidebar}>{children}</div>;
};

export const SidebarItem = props => {
    const { children, title, cols, rows, startOpen = true } = props;
    const [open, toggleOpen] = useState(startOpen);

    const openIcon = open ? '-' : '+';

    const gridColumn = cols ? `span ${cols}` : 'span 4';
    const gridRow = rows ? `span ${rows}` : 'span 1';

    return (
        <div
            className={styles.sidebarItem}
            style={{
                gridColumn,
                gridRow
            }}
        >
            {title && (
                <div className={styles.title}>
                    <div
                        onClick={() => {
                            toggleOpen(!open);
                        }}
                        className={styles.openToggleButton}
                        style={{
                            backgroundColor: open ? 'papayawhip' : 'lightgreen'
                        }}
                    >
                        {openIcon}
                    </div>
                    {title}
                </div>
            )}
            {open && <div className={styles.body}>{children}</div>}
        </div>
    );
};
