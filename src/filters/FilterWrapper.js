import React from 'react';
import { SidebarItem } from '../components/common/SidebarContainer';
import { EnabledToggleButton } from '../components/common/SidebarButton';
import './Filters.styles.css';

const FilterWrapper = ({
    displayName = '',
    filterSettings: { enabled },
    updateOptions,
    deleteFilter,
    canMoveUp,
    canMoveDown,
    moveFilterUp,
    moveFilterDown,
    children
}) => (
    <SidebarItem title={displayName}>
        <button
            type="button"
            style={{ gridColumn: 'span 1' }}
            disabled={!canMoveUp}
            onClick={() => {
                moveFilterUp();
            }}
        >
            ⬇️
        </button>
        <button
            type="button"
            style={{ gridColumn: 'span 1' }}
            disabled={!canMoveDown}
            onClick={() => {
                moveFilterDown();
            }}
        >
            ⬆️
        </button>
        <button
            type="button"
            style={{ gridColumn: 'span 1' }}
            onClick={() => {
                deleteFilter();
            }}
        >
            ❌
        </button>

        <EnabledToggleButton
            style={{ height: '100%' }}
            onClick={newValue => {
                updateOptions({ enabled: newValue });
            }}
            active={enabled}
            labelActive="ON"
            labelInactive="OFF"
        />
        {children}
    </SidebarItem>
);

export default FilterWrapper;
