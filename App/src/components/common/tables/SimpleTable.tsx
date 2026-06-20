import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	CircularProgress,
	Paper,
} from "@mui/material";
import { useTheme, type SxProps } from "@mui/material/styles";
import Typography from "../display/Typography.tsx";
import FlexContainer from "../layout/FlexContainer.tsx";

export type SimpleColumn<T> = {
	key: string | keyof T;
	header: string;
	width?: number | string;
	align?: "left" | "right" | "center";
	sticky?: "left" | "right";
	render?: (row: T) => React.ReactNode;
};

type SimpleTableProps<T> = {
	rows: T[];
	columns: SimpleColumn<T>[];

	title?: string;
	subtitle?: string;
	actions?: React.ReactNode;

	isLoading?: boolean;
	emptyMessage?: string | React.ReactNode;

	stickyHeader?: boolean;
	size?: "small" | "medium";
	bordered?: boolean;
	hideHeader?: boolean;

	className?: string;

	rowHeight?: number;
	headerHeight?: number;
	/**
	 * The test identifier used for automated testing.
	 */
	testId: string;
	style?: SxProps;
};

function SimpleTable<T>({
	rows,
	columns,
	title,
	subtitle,
	actions,
	isLoading = false,
	emptyMessage = "No data available",
	stickyHeader = true,
	size = "small",
	bordered = true,
	hideHeader = false,
	className,
	rowHeight,
	headerHeight,
	testId,
	style
}: SimpleTableProps<T>) {
	const theme = useTheme();

	return (
		<FlexContainer
			direction="column"
			className={`w-full ${className ?? ""}`}
			testId={`${testId}-container`}
		>
			{(title || subtitle || actions) && (
				<FlexContainer
					className="mb-2 justify-between align-middle"
					testId={`${testId}-header`}
				>
					<FlexContainer
						direction="column"
						gap
						testId={`${testId}-header-text`}
					>
						{title && (
							<Typography
								component="h5"
								testId={`${testId}-title`}
							>
								{title}
							</Typography>
						)}
						{subtitle && (
							<Typography
								component="subtitle2"
								testId={`${testId}-subtitle`}
							>
								{subtitle}
							</Typography>
						)}
					</FlexContainer>

					{actions && <div>{actions}</div>}
				</FlexContainer>
			)}

			<TableContainer
				component={Paper}
				elevation={0}
				className="overflow-auto"
				data-testid={`${testId}-table-container`}
			>
				<Table
					stickyHeader={stickyHeader}
					size={size}
					data-testid={`${testId}-table`}
					sx={style ?? { minWidth: "max-content" }}
				>
					{!hideHeader && (
						<TableHead data-testid={`${testId}-table-head`}>
							<TableRow
								sx={{
									height: rowHeight,
								}}
							>
								{columns.map((col) => (
									<TableCell
										key={String(col.key)}
										align={col.align ?? "left"}
										sx={{
											height: headerHeight,
											width: col.width,
											fontWeight: 600,
											fontSize: "0.875rem",
											py: "6px",
											position: col.sticky
												? "sticky"
												: undefined,
											left:
												col.sticky === "left"
													? 0
													: undefined,
											right:
												col.sticky === "right"
													? 0
													: undefined,
											zIndex: col.sticky ? 2 : undefined,
											backgroundColor:
												theme.palette.background
													.default,
										}}
									>
										{col.header}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
					)}

					<TableBody>
						{(() => {
							if (isLoading) {
								return (
									<TableRow
										sx={{
											height: rowHeight,
										}}
									>
										<TableCell colSpan={columns.length}>
											<div className="flex justify-center py-6">
												<FlexContainer
													direction="column"
													className="align-middle"
													gap
													testId={`${testId}-loading-state`}
												>
													<CircularProgress
														size={28}
													/>
													<Typography
														component="body2"
														testId={`${testId}-loading-text`}
													>
														Loading data...
													</Typography>
												</FlexContainer>
											</div>
										</TableCell>
									</TableRow>
								);
							}

							if (rows.length > 0) {
								return rows.map((row, index) => (
									<TableRow
										key={index}
										hover
										sx={{
											height: rowHeight,
										}}
									>
										{columns.map((col) => (
											<TableCell
												key={String(col.key)}
												align={col.align ?? "left"}
												sx={{
													height: headerHeight,
													borderTop: bordered
														? `1px solid ${theme.palette.divider}`
														: "none",
													fontSize: "0.875rem",
													py: "6px",
													width: col.width,
													position: col.sticky
														? "sticky"
														: undefined,
													left:
														col.sticky === "left"
															? 0
															: undefined,
													right:
														col.sticky === "right"
															? 0
															: undefined,
													zIndex: col.sticky
														? 2
														: undefined,
													backgroundColor:
														theme.palette.background
															.default,
												}}
											>
												{col.render
													? col.render(row)
													: String(
															row[
																col.key as keyof T
															] ?? ""
													  )}
											</TableCell>
										))}
									</TableRow>
								));
							}

							return (
								<TableRow
									sx={{
										height: rowHeight,
									}}
								>
									<TableCell
										colSpan={columns.length}
										align="center"
										sx={{
											height: headerHeight,
										}}
									>
										<Typography
											component="body2"
											style={{
												color: theme.palette.text
													.secondary,
											}}
											testId={`${testId}-empty-state`}
										>
											<em>{emptyMessage}</em>
										</Typography>
									</TableCell>
								</TableRow>
							);
						})()}
					</TableBody>
				</Table>
			</TableContainer>
		</FlexContainer>
	);
}

export default SimpleTable;
