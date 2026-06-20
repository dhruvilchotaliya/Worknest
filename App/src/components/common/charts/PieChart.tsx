import React, { useMemo } from "react";
import {
    PieChart as MuiPieChart,
    type PieChartProps,
    type PieSeriesType,
    type ChartsTooltipProps,
    pieArcLabelClasses,
    type PieItemIdentifier,
} from "@mui/x-charts-pro";

import { PieHorizontalLegendProps, PieVerticalLegendProps, ScrollableLegendProps } from "./legendProps.ts";
import Box from "@mui/material/Box";
import Typography from "../display/Typography.tsx";
import Spinner from "../display/Spinner.tsx";


export interface PieChartSlice extends Partial<PieSeriesType> {
    label?: string;
    count: number;
    color?: string;
}

type LegendVariant = "horizontal" | "vertical" | "scrollable" | "none";

export interface PieChartPropsDS {
    /**
     * Pie chart data slices.
     */
    slices?: PieChartSlice[];

    /* layout */

    /**
     * Height of the chart.
     */
    height?: number;

    /**
     * Width of the chart.
     */
    width?: number | string;

    /**
     * Inner radius of the pie.
     */
    innerRadius?: number;

    /**
     * Outer radius of the pie.
     */
    outerRadius?: number;

    /* legend */

    /**
     * Legend layout variant.
     */
    legendVariant?: LegendVariant;

    /* behavior */

    /**
     * Enable slice animation.
     */
    enableAnimation?: boolean;

    /**
     * Show values on slices.
     */
    showValueLabels?: boolean;

    /* extras */

    /**
     * Tooltip configuration.
     */
    tooltipProps?: ChartsTooltipProps;

    /**
     * Chart margin.
     */
    margin?: PieChartProps["margin"];

    /**
     * Custom styles.
     */
    sx?: PieChartProps["sx"];

    /* events */

    /**
     * Fired when a slice is clicked.
     */
    onSliceClick?: (params: {
        label: string;
        value: number;
        percentage: number;
    }) => void;

    /**
     * Test ID for Playwright/testing.
     */
    dataTestId?: string;

    /**
     * Show loading spinner while data is being fetched.
     */
    isLoading?: boolean;
}


const PieChart: React.FC<PieChartPropsDS> = ({
    slices = [],
    height = 300,
    width = "100%",
    innerRadius = 0,
    outerRadius = 100,
    legendVariant = "horizontal",
    enableAnimation = true,
    showValueLabels = false,
    tooltipProps,
    margin,
    sx,
    onSliceClick,
    dataTestId,
    isLoading = false
}) => {
    const total = useMemo(
        () => slices.reduce((acc, s) => acc + s.count, 0),
        [slices]
    );

    const legendProps = useMemo(() => {
        switch (legendVariant) {
            case "vertical":
                return PieVerticalLegendProps;
            case "scrollable":
                return ScrollableLegendProps;
            case "horizontal":
                return PieHorizontalLegendProps;
            case "none":
            default:
                return undefined;
        }
    }, [legendVariant]);

    if (isLoading) {
        return (
            <Box data-testid={`${dataTestId}-loader`} sx={{ width, height, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Spinner />
            </Box>
        );
    }

    if (!slices.length) {
        return (
            <Box
                data-testid={dataTestId}
                sx={{
                    width,
                    height,
                    borderRadius: 2,
                    border: "1px dashed",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography component="body2" testId={`${dataTestId}-nodata`}>
                    No data available
                </Typography>
            </Box>
        );
    }

    const series: PieSeriesType[] = [
        {
            type: "pie",
            faded: { innerRadius: 30, additionalRadius: -30 },
            innerRadius,
            outerRadius,
            highlightScope: { fade: "global", highlight: "item" },
            arcLabel: showValueLabels ? (item) => `${item.value}` : undefined,
            valueFormatter: ({ value }) =>
                `${value} out of ${total} (${((value / total) * 100).toFixed(0)}%)`,
            data: slices.map((s, index) => ({ id: index, value: s.count, label: s.label, color: s.color })),
        },
    ];

    const handleClick = (_event: React.MouseEvent<SVGElement>, pieItemIdentifier: PieItemIdentifier) => {
        if (!onSliceClick) return;
        const dataIndex = pieItemIdentifier?.dataIndex;
        if (dataIndex == null) return;
        const slice = slices[dataIndex];
        const percentage = total ? (slice.count / total) * 100 : 0;
        onSliceClick({ label: slice.label ?? "", value: slice.count, percentage: Number(percentage.toFixed(2)) });
    };

    return (
        <Box data-testid={dataTestId} sx={{ width, height }}>
            <MuiPieChart
                height={height}
                series={series}
                margin={margin}
                slotProps={{ legend: legendProps, tooltip: tooltipProps }}
                skipAnimation={!enableAnimation}
                onItemClick={handleClick}
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: { fontWeight: "bold", fill: "white" },
                    ...sx,
                }}
            />
        </Box>
    );
};

export default PieChart;