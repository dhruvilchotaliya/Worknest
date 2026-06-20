import React from "react";
import {
	RadarChart,
	type RadarChartProps,
	type RadarSeriesType,
	type ChartsLegendProps,
	type ChartsTooltipProps,
} from "@mui/x-charts-pro";
import { Box, Typography } from "@mui/material";
import Spinner from "../display/Spinner";

export interface RadarChartSeries extends Partial<RadarSeriesType> {
	label: string;
	data: number[];
	color?: string;
	valueFormatter?: (value: number) => string;
}

export interface RadarChartProProps {
	metrics: string[];
	datasets: RadarChartSeries[];

	height?: number;
	width?: number | string;

	legendProps?: ChartsLegendProps;
	tooltipProps?: ChartsTooltipProps;

	enableAnimation?: boolean;

	onPointClick?: (params: {
		seriesLabel: string;
		metric: string;
		value: number;
	}) => void;

	margin?: RadarChartProps["margin"];
	sx?: RadarChartProps["sx"];
	maxLevel: number;
	isLoading?: boolean;
}

const defaultFormatter = (v: number) => (v != null ? v.toLocaleString() : "");

const MIN_METRICS_REQUIRED = 3;

const RadarChartPro: React.FC<RadarChartProProps> = ({
	metrics = [],
	datasets = [],
	height = 350,
	width = "100%",
	legendProps,
	tooltipProps,
	enableAnimation = true,
	onPointClick,
	margin,
	sx,
	maxLevel = 120,
	isLoading = false
}) => {
	if (
		!metrics.length ||
		!datasets.length ||
		datasets[0].data.length !== metrics.length ||
		maxLevel <= 0
	) {
		return (
			<Box
				sx={{
					width,
					height: "100%",
					borderRadius: 2,
					border: "1px dashed",
					borderColor: "divider",
					color: "text.secondary",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					bgcolor: "background.paper",
				}}
			>
				<Typography variant="body2">No data available</Typography>
			</Box>
		);
	}

	if (metrics.length < MIN_METRICS_REQUIRED) {
		return (
			<Box
				sx={{
					width,
					height: "100%",
					borderRadius: 2,
					border: "1px dashed",
					borderColor: "divider",
					color: "text.secondary",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					bgcolor: "background.paper",
				}}
			>
				<Typography variant="body2">
					Radar charts require at least {MIN_METRICS_REQUIRED} metrics
					to display
				</Typography>
			</Box>
		);
	}

	const handleClick = (e: any) => {
		if (!onPointClick) return;

		const { dataIndex, series } = e;
		if (dataIndex == null || !series) return;

		onPointClick({
			seriesLabel: series.label,
			metric: metrics[dataIndex],
			value: series.data[dataIndex],
		});
	};

	const series: RadarSeriesType[] = datasets.map((s) => ({
		...s,
		valueFormatter: s.valueFormatter ?? defaultFormatter,
	}));

	if (isLoading) {
        return (
            <Box data-testid="radar-chart-loader" sx={{ width, height, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Spinner />
            </Box>
        );
    }

	return (
		<Box sx={{ width, overflow: "hidden", height:"100%" }}>
			<RadarChart
				height={height}
				series={series}
				radar={{
					max: maxLevel,
					metrics: metrics,
				}}
				margin={margin}
				tooltip={{
					valueFormatter:
						tooltipProps?.valueFormatter ?? defaultFormatter,
					trigger: tooltipProps?.trigger ?? "item",
					...tooltipProps,
				}}
				legend={legendProps}
				skipAnimation={!enableAnimation}
				onItemClick={handleClick}
				sx={sx}
			/>
		</Box>
	);
};

export default RadarChartPro;
