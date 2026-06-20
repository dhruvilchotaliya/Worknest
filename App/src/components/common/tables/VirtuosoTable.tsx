import {
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { TableVirtuoso, type TableVirtuosoHandle } from "react-virtuoso";

// ─── Types (mirrors your existing ScrollableTable API) ────────────────────────

export type GetItemsResponse<T> = {
	/** Items returned for this page */
	data: T[];
	/** Total number of rows across all pages */
	totalRowCount: number;
};

export type GetItemsFn<T> = (
	top: number,
	skip: number,
	orderBy?: string,
	orderByDescending?: boolean
) => Promise<GetItemsResponse<T>>;

export type SortDirection = "asc" | "desc" | null;

export type SortState = {
	field: string;
	direction: SortDirection;
};

export type TableColumnDef<T> = {
	/** Unique key matching a field in T */
	field: keyof T & string;
	/** Column header label */
	headerName: string;
	/** Column width in px (default: 150) */
	width?: number;
	/** Allow this column to fill remaining space */
	flex?: number;
	/** Custom cell renderer */
	renderCell?: (row: T, rowIndex: number) => React.ReactNode;
	/** Whether this column is sortable (default: true) */
	sortable?: boolean;
	/** Text alignment for cells */
	align?: "left" | "center" | "right";
};

export type VirtuosoTableRef<T> = {
	/** Clears cache and re-fetches from page 0 */
	refresh: () => void;
	/** Patch a single row in-place without a full refetch */
	updateRow: (id: string | number, updatedData: Partial<T>) => void;
};

export type VirtuosoTableProps<T extends Record<string, unknown>> = {
	/** Column definitions */
	columns: TableColumnDef<T>[];
	/** Paginated data fetcher — same signature as ScrollableTable */
	getItems: GetItemsFn<T>;
	/** How many rows to fetch per page (default: 25) */
	pageSize?: number;
	/** How many px from the bottom to trigger the next page load (default: 300) */
	scrollEndThreshold?: number;
	/** Render extra UI above the table (toolbars, filters, etc.) */
	children?: React.ReactNode;
	/** data-testid placed on the outer wrapper */
	testId: string;
	/** Ref for refresh() / updateRow() */
	tableRef?: React.RefObject<VirtuosoTableRef<T> | null>;
	/** Derive a stable row ID — defaults to row.id */
	getRowId?: (row: T) => string | number;
	/** Message shown when there is no data */
	emptyLabel?: string;
	/** If true, row height adjusts to content */
	autoRowHeight?: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DEFAULT_PAGE_SIZE = 25;
const DEFAULT_THRESHOLD = 300;

function SortIcon({ direction }: { direction: SortDirection }) {
	if (!direction) {
		return (
			<span style={styles.sortIconInactive} aria-hidden="true">
				⇅
			</span>
		);
	}
	return (
		<span style={styles.sortIconActive} aria-hidden="true">
			{direction === "asc" ? "↑" : "↓"}
		</span>
	);
}

// ─── Component ────────────────────────────────────────────────────────────────

const VirtuosoTable = <T extends Record<string, unknown>>({
	columns,
	getItems,
	pageSize = DEFAULT_PAGE_SIZE,
	scrollEndThreshold = DEFAULT_THRESHOLD,
	children,
	testId,
	tableRef,
	getRowId,
	emptyLabel = "No records found",
	autoRowHeight = false,
}: VirtuosoTableProps<T>) => {
	const virtuosoRef = useRef<TableVirtuosoHandle>(null);
	const rowsRef = useRef<T[]>([]);

	const [rows, setRows] = useState<T[]>([]);
	const [totalRowCount, setTotalRowCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(false);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const [sort, setSort] = useState<SortState>({ field: "", direction: null });

	// Tracks the next skip value — avoids stale-closure issues inside callbacks
	const nextSkipRef = useRef(0);
	const hasMoreRef = useRef(true);
	// Prevents concurrent in-flight requests
	const fetchingRef = useRef(false);
	// Incremented by refresh() to reset everything
	const [resetKey, setResetKey] = useState(0);

	// ── Sync rowsRef with state so updateRow can mutate without a full re-render
	useEffect(() => {
		rowsRef.current = rows;
	}, [rows]);

	// ── Imperative handle (same surface as ScrollableTable) ──────────────────
	useImperativeHandle(tableRef, () => ({
		refresh: () => {
			setResetKey((k) => k + 1);
		},
		updateRow: (id, updatedData) => {
			setRows((prev) =>
				prev.map((row) => {
					const rowId = getRowId ? getRowId(row) : (row.id as string | number);
					return rowId === id ? { ...row, ...updatedData } : row;
				})
			);
		},
	}));

	// ── Reset state whenever resetKey or sort changes ─────────────────────────
	useEffect(() => {
		nextSkipRef.current = 0;
		hasMoreRef.current = true;
		fetchingRef.current = false;
		setRows([]);
		setTotalRowCount(0);
		setIsInitialLoad(true);
	}, [resetKey, sort.field, sort.direction]);

	// ── Core fetch ────────────────────────────────────────────────────────────
	const loadMore = useCallback(async () => {
		if (fetchingRef.current || !hasMoreRef.current) return;

		fetchingRef.current = true;
		setIsLoading(true);

		try {
			const skip = nextSkipRef.current;
			const { data, totalRowCount: total } = await getItems(
				pageSize,
				skip,
				sort.field || undefined,
				sort.direction === "desc" ? true : sort.direction === "asc" ? false : undefined
			);

			nextSkipRef.current = skip + data.length;
			hasMoreRef.current = nextSkipRef.current < total;

			setRows((prev) => (skip === 0 ? data : [...prev, ...data]));
			setTotalRowCount(total);
		} finally {
			fetchingRef.current = false;
			setIsLoading(false);
			setIsInitialLoad(false);
		}
	}, [getItems, pageSize, sort]);

	// ── Trigger initial load after reset ─────────────────────────────────────
	useEffect(() => {
		if (isInitialLoad) loadMore();
	}, [isInitialLoad, loadMore]);

	// ── Sort toggling ─────────────────────────────────────────────────────────
	const handleSort = useCallback((field: string, sortable: boolean) => {
		if (!sortable) return;
		setSort((prev) => {
			if (prev.field !== field) return { field, direction: "asc" };
			if (prev.direction === "asc") return { field, direction: "desc" };
			return { field: "", direction: null };
		});
	}, []);

	// ── Column width helpers ──────────────────────────────────────────────────
	const totalFlex = columns.reduce((sum, c) => sum + (c.flex ?? 0), 0);
	const fixedWidth = columns.reduce(
		(sum, c) => sum + (c.flex ? 0 : (c.width ?? 150)),
		0
	);

	function getColWidth(col: TableColumnDef<T>): string {
		if (col.flex) {
			return totalFlex > 0 ? `${(col.flex / totalFlex) * 100}%` : "auto";
		}
		return `${col.width ?? 150}px`;
	}

	// ── Render ────────────────────────────────────────────────────────────────
	return (
		<div
			className="w-full flex h-full flex-col flex-1 overflow-hidden"
			data-testid={testId}
		>
			{children}

			<div
				className="flex-1 flex flex-col min-h-0 overflow-hidden border border-[var(--color-border,#e5e7eb)] rounded-lg relative bg-[var(--color-background-primary,#fff)]"
				data-testid={`${testId}-table`}
			>
				{/* ── Initial full-page spinner ── */}
				{isInitialLoad && isLoading && (
					<div style={styles.spinnerOverlay}>
						<div style={styles.spinner} aria-label="Loading" />
					</div>
				)}

				{/* ── Empty state ── */}
				{!isLoading && !isInitialLoad && rows.length === 0 && (
					<div style={styles.emptyState}>{emptyLabel}</div>
				)}

				<TableVirtuoso
					ref={virtuosoRef}
					data={rows}
					style={{ height: "100%", width: "100%" }}
					endReached={loadMore}
					increaseViewportBy={scrollEndThreshold}
					overscan={200}
					fixedHeaderContent={() => (
						<tr style={styles.headerRow}>
							{columns.map((col) => (
								<th
									key={col.field}
									style={{
										...styles.th,
										width: getColWidth(col),
										minWidth: col.flex ? undefined : `${col.width ?? 150}px`,
										textAlign: col.align ?? "left",
										cursor: col.sortable !== false ? "pointer" : "default",
										userSelect: "none",
									}}
									onClick={() => handleSort(col.field, col.sortable !== false)}
									aria-sort={
										sort.field === col.field
											? sort.direction === "asc"
												? "ascending"
												: "descending"
											: "none"
									}
								>
									<span style={styles.thInner}>
										{col.headerName}
										{col.sortable !== false && (
											<SortIcon
												direction={
													sort.field === col.field ? sort.direction : null
												}
											/>
										)}
									</span>
								</th>
							))}
						</tr>
					)}
					itemContent={(index, row) => (
						<>
							{columns.map((col) => (
								<td
									key={col.field}
									style={{
										...styles.td,
										width: getColWidth(col),
										textAlign: col.align ?? "left",
										height: autoRowHeight ? "auto" : 64,
									}}
								>
									{col.renderCell
										? col.renderCell(row, index)
										: (row[col.field] as React.ReactNode)}
								</td>
							))}
						</>
					)}
					components={{
						// Inline loader row at the bottom while paginating
						Footer: () =>
							isLoading && !isInitialLoad ? (
								<tr>
									<td
										colSpan={columns.length}
										style={styles.footerLoader}
									>
										<div style={styles.footerInner}>
											<div
												style={{ ...styles.spinner, width: 16, height: 16, borderWidth: 2 }}
												aria-label="Loading more"
											/>
											<span>Loading more…</span>
										</div>
									</td>
								</tr>
							) : null,
						// Wrapper <table> — keeps border-collapse
						Table: ({ style, ...props }) => (
							<table
								{...props}
								style={{
									...style,
									borderCollapse: "collapse",
									tableLayout: "fixed",
									width: "100%",
								}}
							/>
						),
					}}
				/>
			</div>
		</div>
	);
};

export default VirtuosoTable;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
	wrapper: {
		display: "flex",
		flexDirection: "column" as const,
		flex: 1,
		width: "100%",
		overflow: "hidden",
	},
	tableContainer: {
		flex: 1,
		display: "flex",
		flexDirection: "column" as const,
		minHeight: 0,
		overflow: "hidden",
		border: "1px solid var(--color-border, #e5e7eb)",
		borderRadius: 8,
		position: "relative" as const,
		background: "var(--color-background-primary, #fff)",
	},
	headerRow: {
		background: "var(--color-background-primary, #fff)",
	},
	th: {
		padding: "16px 16px",
		fontSize: 11,
		fontWeight: 700,
		color: "var(--color-text-secondary, #6b7280)",
		letterSpacing: "0.05em",
		textTransform: "uppercase" as const,
		borderBottom: "1px solid var(--color-border, #e5e7eb)",
		whiteSpace: "nowrap" as const,
		overflow: "hidden",
		textOverflow: "ellipsis",
	},
	thInner: {
		display: "inline-flex",
		alignItems: "center",
		gap: 4,
	},
	td: {
		padding: "12px 16px",
		fontSize: 13,
		color: "var(--color-text-primary, #111)",
		borderBottom: "0.5px solid var(--color-border, #f3f4f6)",
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap" as const,
		verticalAlign: "middle",
	},
	spinnerOverlay: {
		position: "absolute" as const,
		inset: 0,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		background: "var(--color-background-primary, #fff)",
		zIndex: 2,
	},
	spinner: {
		width: 28,
		height: 28,
		border: "3px solid var(--color-border, #e5e7eb)",
		borderTop: "3px solid var(--color-text-secondary, #6b7280)",
		borderRadius: "50%",
		animation: "vt-spin 0.7s linear infinite",
	},
	emptyState: {
		position: "absolute" as const,
		inset: 0,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: 14,
		color: "var(--color-text-secondary, #6b7280)",
	},
	footerLoader: {
		padding: "12px 16px",
		borderTop: "0.5px solid var(--color-border, #f3f4f6)",
	},
	footerInner: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		fontSize: 13,
		color: "var(--color-text-secondary, #6b7280)",
	},
	sortIconInactive: {
		fontSize: 11,
		opacity: 0.35,
	},
	sortIconActive: {
		fontSize: 11,
		opacity: 0.8,
	},
} as const;