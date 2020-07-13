import React, { useState } from 'react';
import Popover from 'react-tiny-popover';

import styles from './SidebarContainer.styles.css';

export const SidebarContainer = (props) => {
    const { children } = props;
    return <div className={styles.sidebar}>{children}</div>;
};

export const SidebarItem = (props) => {
    const {
        children,
        title,
        cols,
        rows,
        styleOverride,
        helpText = '',
        startOpen = true
    } = props;
    const [open, toggleOpen] = useState(startOpen);
    const [showHelp, toggleShowHelp] = useState(false);

    const openIcon = open ? '-' : '+';
    const leftIcon = '?';
    const hasHelpIcon = helpText !== '';

    const gridColumn = cols ? `span ${cols}` : 'span 4';
    const gridRow = rows ? `span ${rows}` : 'span 1';

    const popoverHelpIcon = () => {
        return (
            <Popover
                isOpen={showHelp}
                position={['right']}
                padding={25}
                onClickOutside={() => {
                    toggleShowHelp(false);
                }}
                containerClassName={styles.sidebarPopover}
                transitionDuration={0.001}
                content={() => {
                    return <>{helpText}</>;
                }}
            >
                <div
                    onClick={() => {
                        toggleShowHelp(!showHelp);
                    }}
                    className={styles.helpButton}
                    style={{
                        backgroundColor: showHelp ? 'papayawhip' : 'lightgreen'
                    }}
                >
                    {leftIcon}
                </div>
            </Popover>
        );
    };

    return (
        <div
            className={styles.sidebarItem}
            style={{
                gridColumn,
                gridRow
            }}
        >
            {hasHelpIcon && popoverHelpIcon()}
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
            {open && (
                <div className={styles.body} style={{ ...styleOverride }}>
                    {children}
                </div>
            )}
        </div>
    );
};
