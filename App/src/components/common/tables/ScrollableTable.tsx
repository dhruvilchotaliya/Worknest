import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
	DataGridPro,
	useGridApiRef,
	type GridDataSource,
	type GridGetRowsParams,
} from "@mui/x-data-grid-pro";
import { useMemo, useImperativeHandle, useEffect, useState } from "react";
import type { TableColumnDef } from "./shared";
import { mapColumnsToMUI } from "../../../utils/mui-utils";
import Spinner, { type SpinnerProps } from "../display/Spinner";

/**
 * Represents the response structure for fetching items in a paginated or scrollable table.
 *
 * @template T - The type of the items in the response.
 *
 * @property {T[]} data - An array of items of type `T` returned in the response.
 * @property {number} totalRowCount - The total number of rows/items available,
 *                                    which may be greater than the number of items in `data`.
 */
export type GetItemsResponse<T> = {
	/**
	 * An array of items of type `T` returned in the response.
	 */
	data: T[];

	/**
	 * The total number of rows/items available, which may be greater than the number of items in `data`.
	 */
	totalRowCount: number;
};

/**
 * A function type that defines the structure for retrieving a paginated list of items.
 *
 * @template T - The type of items to be retrieved.
 *
 * @param top - The maximum number of items to retrieve.
 * @param skip - The number of items to skip from the beginning of the list.
 * @param orderBy - (Optional) The field by which to sort the items.
 * @param orderByDescending - (Optional) A boolean indicating whether the sorting should be in descending order.
 *
 * @returns A promise that resolves to a `GetItemsResponse<T>` containing the retrieved items.
 */
export type GetItemsFn<T> = (
	/**
	 * The maximum number of items to retrieve.
	 */
	top: number,

	/**
	 * The number of items to skip from the beginning of the list.
	 */
	skip: number,

	/**
	 * The field by which to sort the items.
	 */
	orderBy?: string,

	/**
	 * A boolean indicating whether the sorting should be in descending order.
	 */
	orderByDescending?: boolean
) => Promise<GetItemsResponse<T>>;

/**
 * Props for the `ScrollableTable` component.
 *
 * @template T - The type of the row model, extending `GridValidRowModel`.
 */
export interface ScrollableTableProps<T extends Record<string, unknown>> {
	/**
	 * An array of column definitions for the table.
	 */
	columns: TableColumnDef<T>[];

	/**
	 * A function to retrieve the items to be displayed in the table.
	 */
	getItems: GetItemsFn<T>;

	/**
	 * An optional array of column keys to pin to the left side of the table.
	 */
	leftPinned?: string[];

	/**
	 * An optional array of column keys to pin to the right side of the table.
	 */
	rightPinned?: string[];

	/**
	 * Optional React children to be rendered inside the table.
	 */
	children?: React.ReactNode;

	/**
	 * If `true`, enables automatic row height adjustment based on content.
	 * Defaults to `false` if not specified.
	 */
	autoRowHeight?: boolean;

	/**
	 * The test identifier used for automated testing.
	 */
	testId: string;

	/**
	 * An optional ref object that allows parent components to call the `refresh` method on the table.
	 * The `refresh` method clears the data cache and triggers a refetch of the table data.
	 */
	tableRef?: React.RefObject<{ 
		refresh: () => void;
		updateRow?: (id: string, updatedData: Partial<T>) => void;
	} | null>

	/**
	 * If `true`, enables checkbox selection column.
	 */
	checkboxSelection?: boolean;

	/**
	 * Controls the selected rows. Pass a MUI GridRowSelectionModel.
	 */
	rowSelectionModel?: {
		type: "include" | "exclude";
		ids: Set<string | number>;
	};

	/**
	 * Callback fired when the selection changes.
	 */
	onRowSelectionModelChange?: (model: { ids: Set<string | number> }) => void;

	/**
	 * A function to determine whether a row is selectable.
	 */
	isRowSelectable?: () => boolean;

	getRowId?: (row: T) => string | number;
}

const ScrollableTable = <T extends Record<string, unknown>>({
	columns,
	getItems,
	leftPinned,
	rightPinned,
	children,
	autoRowHeight,
	testId,
	getRowId,
	checkboxSelection,
	rowSelectionModel,
	onRowSelectionModelChange,
	isRowSelectable,
	tableRef,
}: ScrollableTableProps<T>) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const apiRef = useGridApiRef();
	const [refreshKey, setRefreshKey] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	useImperativeHandle(tableRef, () => ({
		refresh: () => {
			setRefreshKey((prev) => prev + 1);
		},
		updateRow: (id: string, updatedData: Partial<T>) => {
			apiRef.current?.updateRows([{ id, ...updatedData }]);
		}
	}));

	useEffect(() => {
		if (!apiRef.current) return;
		if (!isMobile) {
			apiRef.current.setPinnedColumns({
				left: leftPinned,
				right: rightPinned,
			});
		} else {
			apiRef.current.setPinnedColumns({});
		}
	}, [isMobile, leftPinned, rightPinned]);

	const dataSource: GridDataSource = useMemo(
		() => ({
			getRows: async (params: GridGetRowsParams) => {
				const { sortModel, start } = params;
				const orderBy = sortModel?.[0]?.field;
				const orderByDescending = sortModel?.[0]?.sort === "desc";
				const skip: number = (start as number) ?? 0;

				setIsLoading(true);
				try {
					const { data, totalRowCount } = await getItems(
						params.paginationModel?.pageSize ?? 25,
						skip,
						orderBy,
						orderByDescending
					);
					return { rows: data, totalRowCount };
				} finally {
					setIsLoading(false);
				}
			},
		}),
		[getItems]
	);

	const muiColumns = mapColumnsToMUI(columns);

	return (
		<div
			className="w-full flex flex-col flex-1 overflow-hidden"
			data-testid={testId}
		>
			{children}
			<div className="flex-1 flex min-h-0 overflow-hidden border-1 border-background-extradark rounded-lg">
				<DataGridPro
					key={refreshKey}
					apiRef={apiRef}
					columns={muiColumns}
					rowBufferPx={50}
					dataSource={dataSource}
					loading={isLoading}
					lazyLoading
					paginationModel={{ page: 0, pageSize: 25 }}
					scrollEndThreshold={500}
					getRowId={getRowId ?? ((row) => row.id as string | number)}
					initialState={{
						pinnedColumns: {},
					}}
					slots={{
						loadingOverlay: (props) => (
							<div className="flex items-center justify-center w-full h-full">
								<Spinner {...(props as SpinnerProps)} />
							</div>
						),
					}}
					disableColumnMenu
					localeText={{ noRowsLabel: "No records found" }}
					getRowHeight={autoRowHeight ? () => "auto" : undefined}
					sx={{
						border: "none",
						"& .MuiDataGrid-columnHeaderTitle": {
							fontWeight: "bold",
						},
						"& .MuiDataGrid-virtualScroller": {
							overflowY: "auto",
						},
					}}
					hideFooter
					checkboxSelection={checkboxSelection}
					rowSelectionModel={
						checkboxSelection ? rowSelectionModel : undefined
					}
					onRowSelectionModelChange={
						checkboxSelection && onRowSelectionModelChange
							? (model) =>
									onRowSelectionModelChange(
										model as { ids: Set<string | number> }
									)
							: undefined
					}
					isRowSelectable={
						checkboxSelection && isRowSelectable
							? isRowSelectable
							: undefined
					}
					keepNonExistentRowsSelected={checkboxSelection}
					data-testid={`${testId}-data-grid`}
					filterMode="server"
				/>
			</div>
		</div>
	);
};
export default ScrollableTable;
