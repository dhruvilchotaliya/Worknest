/**
 * Alignment options for cell and header content.
 */
type TableAlignment = "left" | "right" | "center";

/**
 * The data type of the column.
 */
type TableColType =
	| "string"
	| "number"
	| "date"
	| "dateTime"
	| "boolean"
	| "singleSelect"
	| "actions";

/**
 * The direction of the sort.
 */
type TableSortDirection = "asc" | "desc" | null;

/**
 * A wrapper for defining a column within a MUI DataGrid table.
 * Consumers do not need to import anything from MUI to use this type.
 */
export type TableColumnDef<TData extends Record<string, unknown>> = {
	/**
	 * The unique identifier of the column.
	 * Maps directly to the row data key when accessor is not provided.
	 */
	field: string;

	/**
	 * The title displayed in the column header cell.
	 */
	headerName?: string;

	/**
	 * The property name of the object associated with the column
	 * to retrieve the value of the entity.
	 */
	accessor?: keyof TData;

	/**
	 * The data type of the column.
	 * Drives sorting, filtering and rendering behaviour.
	 */
	type?: TableColType;

	/**
	 * Whether the column is sortable or not.
	 */
	sortable?: boolean;

	/**
	 * Whether the column is filterable or not.
	 */
	filterable?: boolean;

	/**
	 * Whether the cells of the column are editable.
	 */
	editable?: boolean;

	/**
	 * Whether the column can be hidden by the user.
	 */
	hideable?: boolean;

	/**
	 * Whether the column can be resized by the user.
	 */
	resizable?: boolean;

	/**
	 * Fixed width of the column in pixels.
	 */
	width?: number;

	/**
	 * Minimum width of the column in pixels.
	 */
	minWidth?: number;

	/**
	 * Maximum width of the column in pixels.
	 */
	maxWidth?: number;

	/**
	 * Flex grow factor of the column.
	 * Use instead of width for responsive columns.
	 */
	flex?: number;

	/**
	 * Custom renderer for the cell content.
	 * Receives the full row object for maximum flexibility.
	 */
	cell?: (row: TData) => React.ReactNode;

	/**
	 * Custom renderer for the column header.
	 */
	renderHeader?: () => React.ReactNode;

	/**
	 * Function to extract a custom display value from the row
	 * when the field key doesn't map directly to the data.
	 */
	valueGetter?: (value: unknown, row: TData) => unknown;

	/**
	 * Formats the cell value before rendering (e.g. dates, currency).
	 */
	valueFormatter?: (value: unknown, row: TData) => string;

	/**
	 * Alignment of the cell content.
	 */
	align?: TableAlignment;

	/**
	 * Alignment of the column header content.
	 */
	headerAlign?: TableAlignment;

	/**
	 * Custom CSS class for the column header cell.
	 */
	headerClassName?: string;

	/**
	 * Custom CSS class for the cells in this column.
	 */
	cellClassName?: string;
};

/**
 * Represents a single column sort configuration.
 */
export type TableSortItem<TData> = {
	/**
	 * The property name of the object to sort by.
	 * Constrained to the keys of TData for type safety.
	 */
	field: keyof TData & string;

	/**
	 * The direction of the sort.
	 * Use null to clear sorting on this column.
	 */
	sort: TableSortDirection;
};

/**
 * Represents the complete sort state of the table.
 * Supports multi-column sorting via an array of TableSortItem.
 */
export type TableSortModel<TData> = TableSortItem<TData>[];
