import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid-pro";
import type { TableColumnDef } from "../components/common/tables/shared";

export function mapColumnsToMUI<T extends Record<string, unknown>>(
	columns: TableColumnDef<T>[]
): GridColDef[] {
	return columns.map((col) => {
		const muiCol: GridColDef = {
			field: col.field,
			headerName: col.headerName,
			sortable: col.sortable ?? true,
			filterable: col.filterable ?? true,
			editable: col.editable ?? false,
			hideable: col.hideable ?? true,
			resizable: col.resizable ?? true,
			width: col.width,
			minWidth: col.minWidth,
			maxWidth: col.maxWidth,
			flex: col.flex,
			align: col.align,
			headerAlign: col.headerAlign,
			headerClassName: col.headerClassName,
			cellClassName: col.cellClassName,
		};

		if (col.type) {
			if (col.type === "string" || col.type === "number" || col.type === "boolean" || col.type === "date" || col.type === "dateTime" || col.type === "singleSelect" || col.type === "actions") {
				muiCol.type = col.type;
			}
		}

		if (col.cell) {
			muiCol.renderCell = (params: GridRenderCellParams) => col.cell!(params.row as T);
		}

		if (col.renderHeader) {
			muiCol.renderHeader = () => col.renderHeader!();
		}

		if (col.valueGetter) {
			muiCol.valueGetter = (value, row) => col.valueGetter!(value, row as T);
		} else if (col.accessor) {
			muiCol.valueGetter = (value, row) => (row as T)[col.accessor as keyof T];
		}

		if (col.valueFormatter) {
			muiCol.valueFormatter = (value, row) => col.valueFormatter!(value, row as T);
		}

		return muiCol;
	});
}
