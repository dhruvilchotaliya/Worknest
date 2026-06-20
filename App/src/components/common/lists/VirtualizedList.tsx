import React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { List, type RowComponentProps } from "react-window";

/**
 * Interface for the properties required by the MuiVirtualizedList.
 * @template T - The type of the data item being rendered.
 */
interface MuiVirtualizedListProps<T> {
    /** Array of data items to be virtualized */
    items: T[];

    /** Total height of the scrollable list container (in pixels) */
    height: number;

    /** Fixed height for each individual row (in pixels) */
    getRowHeight: (index: number) => number;

    /** * Callback to render the content inside the list item button.
     * Allows the consumer to define the look and feel of the row.
     */
    renderItem: (item: T) => React.ReactNode;

    /** Callback triggered when a list item is clicked */
    onItemClick?: (item: T) => void;

    /** * Optional callback to define dynamic styles for the ListItemButton.
     * Useful for dynamic borders, background colors, etc.
     */
    getItemStyles?: (item: T) => React.CSSProperties | object;

    /** Optional test ID for automation */
    testId?: string;

    /** Optional CSS class name for the outer container */
    className?: string;
}

export function VirtualizedList<T>({
    items,
    height,
    renderItem,
    getRowHeight,
    onItemClick,
    getItemStyles,
    testId,
    className,
}: Readonly<MuiVirtualizedListProps<T>>) {

    const Row = ({
        index,
        style,
        ariaAttributes,
    }: RowComponentProps) => {
        const item = items[index];

        return (
            <Box sx={{ p: 0.5 }}>
                <ListItem
                    style={style}
                    component="div"
                    disablePadding
                    {...ariaAttributes}
                >
                    <ListItemButton
                        onClick={() => onItemClick?.(item)}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            height: '100%',
                            minHeight: '100%',
                            px: 2,
                            ...getItemStyles?.(item),
                        }}
                    >
                        {renderItem(item)}
                    </ListItemButton>
                </ListItem>
            </Box>
        );
    };

    return (
        <Box
            data-testid={testId}
            className={className}
            sx={{ width: '100%', height }}
        >
            <List
                rowHeight={getRowHeight}
                rowCount={items.length}
                style={{ height, width: '100%' }}
                rowProps={{}}
                rowComponent={Row}
            />
        </Box>
    );
}