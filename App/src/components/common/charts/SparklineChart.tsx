import React from "react";
import {
	SparkLineChart as MuiSparkLineChart,
	type SparkLineChartProps,
} from "@mui/x-charts-pro";
import Box from "@mui/material/Box";
import Typography from "../display/Typography.tsx";

export type SparklineChartType = "line" | "bar";

export type SparklineCurve =
	| "linear"
	| "natural"
	| "monotoneX"
	| "monotoneY"
	| "step"
	| "stepBefore"
	| "stepAfter";

export interface SparklineChartPropsDS {
	/**
	 * Data points for the sparkline.
	 */
	data?: number[];

	/**
	 * Chart type — line or bar.
	 */
	type?: SparklineChartType;

	/* layout */

	/**
	 * Height of the chart.
	 */
	height?: number;

	/**
	 * Width of the chart.
	 */
	width?: number | string;

	/* appearance */

	/**
	 * Color of the sparkline or bars.
	 */
	color?: string;

	/**
	 * Curve interpolation type (line only).
	 */
	curve?: SparklineCurve;

	/**
	 * Fill the area under the line (line only).
	 */
	showArea?: boolean;

	/**
	 * Show dots on data points (line only).
	 */
	showDots?: boolean;

	/**
	 * Show tooltip on hover.
	 */
	showTooltip?: boolean;

	/**
	 * Show highlighted value (last value) label.
	 */
	showHighlightedValue?: boolean;

	/* behavior */

	/**
	 * Enable animation.
	 */
	enableAnimation?: boolean;

	/* extras */

	/**
	 * Value formatter applied in the tooltip and highlighted value.
	 */
	valueFormatter?: (value: number | null) => string;

	/**
	 * X-axis data — used for tooltip labels. Matches index-for-index with `data`.
	 */
	xAxisData?: Array<string | number | Date>;

	/**
	 * Chart margin.
	 */
	margin?: SparkLineChartProps["margin"];

	/**
	 * Custom styles.
	 */
	sx?: SparkLineChartProps["sx"];

	/**
	 * Test ID for Playwright/testing.
	 */
	testId?: string;

	/**
	 * Show No data label if it is true.
	 */
	showNoData?: boolean;
}

const SparklineChart: React.FC<SparklineChartPropsDS> = ({
	data = [],
	type = "line",
	height = 60,
	width = "100%",
	color,
	curve = "linear",
	showArea = false,
	showDots = false,
	showTooltip = true,
	showHighlightedValue = false,
	enableAnimation = true,
	valueFormatter,
	xAxisData,
	margin,
	sx,
	testId,
	showNoData,
}) => {
	if (!data.length) {
		if (!showNoData) {
			return <></>;
		}

		return (
			<Box
				data-testid={testId}
				sx={{
					width,
					height,
					borderRadius: 2,
					border: "1px dashed",
					borderColor: "divider",
					color: "text.secondary",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: 14,
					bgcolor: "background.paper",
				}}
			>
				<Typography component="body2" testId={`${testId}-nodata`}>
					No data available
				</Typography>
			</Box>
		);
	}

	return (
		<Box data-testid={testId} sx={{ width, height }}>
			<MuiSparkLineChart
				data={data}
				type={type}
				height={height}
				colors={color ? [color] : undefined}
				curve={curve}
				area={showArea}
				showTooltip={showTooltip}
				showHighlightedValue={showHighlightedValue}
				valueFormatter={valueFormatter}
				xAxis={
					xAxisData
						? {
								data: xAxisData,
								scaleType:
									xAxisData[0] instanceof Date
										? "time"
										: "band",
								valueFormatter:
									xAxisData[0] instanceof Date
										? (v: Date) => v.toLocaleDateString()
										: undefined,
						  }
						: undefined
				}
				margin={margin}
				skipAnimation={!enableAnimation}
				slotProps={{
					dot: showDots
						? { r: 3 }
						: { r: 0, style: { display: "none" } },
					highlightedDot: { r: 5 },
				}}
				sx={sx}
			/>
		</Box>
	);
};

export default SparklineChart;
