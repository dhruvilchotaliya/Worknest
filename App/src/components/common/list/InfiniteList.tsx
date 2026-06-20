import React, { useCallback, useEffect, useRef, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import type { GetItemsFn } from "../tables/ScrollableTable";

export interface InfiniteListProps<T extends object> {
    getItems: GetItemsFn<T>;
    renderItem: (item: T, index: number) => React.ReactNode;
    pageSize?: number;
    scrollEndThreshold?: number;
    testId: string;
    onReady?: (controls: { refresh: () => void }) => void;
}

const InfiniteList = <T extends object>({
    getItems,
    renderItem,
    pageSize = 10,
    scrollEndThreshold = 500,
    testId,
    onReady,
}: InfiniteListProps<T>) => {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLUListElement>(null);
    const skipRef = useRef(0);
    // null = not yet loaded; distinguishes "uninitialised" from "loaded with 0 results",
    // which prevents the scroll guard from blocking the very first fetch.
    const totalRef = useRef<number | null>(null);
    const loadingRef = useRef(false);
    // Holds the latest onReady prop without causing effects to re-run when it changes.
    const onReadyRef = useRef(onReady);
    useEffect(() => { onReadyRef.current = onReady; });

    const load = useCallback(async (reset = false) => {
        if (loadingRef.current) return;

        const skip = reset ? 0 : skipRef.current;
        // Block scroll-triggered loads only after at least one successful fetch.
        if (!reset && totalRef.current !== null && skip >= totalRef.current) return;

        loadingRef.current = true;
        setLoading(true);
        try {
            const result = await getItems(pageSize, skip);
            setItems(prev => reset ? result.data : [...prev, ...result.data]);
            skipRef.current = skip + result.data.length;
            totalRef.current = result.totalRowCount;
        } catch (err) {
            console.error("InfiniteList fetch error:", err);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [getItems, pageSize]);

    const refresh = useCallback(() => {
        skipRef.current = 0;
        totalRef.current = null;
        load(true);
    }, [load]);

    // Notify the parent with the latest refresh handle whenever it is recreated
    // (i.e. on mount and whenever getItems/pageSize changes).
    useEffect(() => {
        onReadyRef.current?.({ refresh });
    }, [refresh]);

    // Trigger a full reload on mount and whenever getItems changes (filter updates).
    // Depends on `refresh` rather than `getItems` directly because refresh already
    // captures the latest load/getItems and resets pagination state before fetching.
    useEffect(() => {
        refresh();
    }, [refresh]);

    // Infinite scroll — load the next page when approaching the bottom.
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onScroll = () => {
            if (el.scrollHeight - el.scrollTop - el.clientHeight < scrollEndThreshold) {
                load();
            }
        };
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, [load, scrollEndThreshold]);

    return (
        <List
            ref={containerRef}
            data-testid={testId}
            disablePadding
            sx={{
                overflow: "auto",
                flex: 1,
                py: 1,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {items.map((item, i) => (
                // Index key is intentional — T is generic so no stable ID is available
                // at this layer; renderItem is responsible for any keyed children within.
                // eslint-disable-next-line react/no-array-index-key
                <ListItem key={i} disablePadding sx={{ display: "block", mb: 1 }}>
                    {renderItem(item, i)}
                </ListItem>
            ))}

            {!loading && items.length === 0 && (
                <ListItem disablePadding>
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", py: 2 }}>
                        <Typography variant="caption" color="text.disabled">
                            No data available
                        </Typography>
                    </Box>
                </ListItem>
            )}

            {loading && (
                <ListItem disablePadding>
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", py: 2 }}>
                        <CircularProgress size={20} />
                    </Box>
                </ListItem>
            )}
        </List>
    );
};

export default InfiniteList;