import React, { useMemo } from "react";
import {
    BarChart as MuiBarChart,
    type BarChartProps,
    type BarSeriesType,
    type ChartsTooltipProps,
    type ChartsXAxisProps,
    type ChartsYAxisProps,
    barLabelClasses,
} from "@mui/x-charts-pro";
import {
    PieHorizontalLegendProps,
    PieVerticalLegendProps,
    ScrollableLegendProps,
} from "./legendProps.ts";

import Box from "@mui/material/Box";
import Typography from "../display/Typography.tsx";
import Spinner from "../display/Spinner.tsx";
export interface BarChartSeries {
    label?: string;
    data: number[];
    stack?: string;
    color?: string;
    valueFormatter?: BarSeriesType["valueFormatter"];
}

type LegendVariant = "horizontal" | "vertical" | "scrollable" | "none";

export interface BarChartPropsDS {
    /**
     * Bar chart series data.
     */
    datasets?: BarChartSeries[];

    /**
     * X-axis categories.
     */
    xAxisData?: Array<string | { key: string; label: string }>;

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
     * Chart layout direction.
     */
    layout?: "vertical" | "horizontal";

    /* legend */

    /**
     * Legend layout variant.
     */
    legendVariant?: LegendVariant;

    /* behavior */

    /**
     * Enable bar animation.
     */
    enableAnimation?: boolean;

    /**
     * Show values on bars.
     */
    showValueLabels?: boolean;

    /* extras */

    /**
     * Tooltip configuration.
     */
    tooltipProps?: ChartsTooltipProps;

    /**
     * X-axis configuration.
     */
    xAxisProps?: ChartsXAxisProps;

    /**
     * Y-axis configuration.
     */
    yAxisProps?: ChartsYAxisProps;

    /**
     * Chart margin.
     */
    margin?: BarChartProps["margin"];

    /**
     * Custom styles.
     */
    sx?: BarChartProps["sx"];

    /* events */

    /**
     * Fired when a bar is clicked.
     */
    onBarClick?: (params: {
        seriesLabel: string;
        category: string;
        value: number;
    }) => void;

    /**
     * Test ID for Playwright/testing.
     */
    testId?: string;

    /**
     * Show loading spinner while data is being fetched.
     */
    isLoading?: boolean;
}

const BarChart: React.FC<BarChartPropsDS> = ({
    datasets: seriesData = [],
    xAxisData: categories = [],
    height = 300,
    width = "100%",
    layout = "vertical",
    legendVariant = "horizontal",
    enableAnimation = true,
    showValueLabels = false,
    tooltipProps,
    xAxisProps,
    yAxisProps,
    margin,
    sx,
    onBarClick,
    testId,
    isLoading = false
}) => {
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
            <Box data-testid={`${testId}-loader`} sx={{ width, height, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Spinner />
            </Box>
        );
    }

    if (!categories.length || !seriesData.length) {
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

    const normalizedCategories = (categories ?? []).map((c, index) => {
        if (typeof c === "string") {
            return { key: c, label: c };
        }
        return {
            key: c.key ?? `key-${index}`,
            label: c.label ?? c.key ?? `Category ${index + 1}`,
        };
    });

    const defaultFormatter: BarSeriesType["valueFormatter"] = (value) => value == null ? "" : value.toString();

    const series: BarSeriesType[] = (seriesData ?? []).map((s) => ({
        type: "bar",
        data: s.data,
        label: s.label,
        stack: s.stack,
        color: s.color,
        barLabel: showValueLabels ? "value" : undefined,
        valueFormatter: s.valueFormatter ?? defaultFormatter
    }));

    const xAxis =
        layout === "vertical"
            ? [
                {
                    scaleType: "band" as const,
                    data: normalizedCategories.map((c) => c.key),
                    valueFormatter: (key: string) =>
                        normalizedCategories.find((c) => c.key === key)
                            ?.label ?? "",
                    ...xAxisProps,
                },
            ]
            : [{ ...xAxisProps }];

    const yAxis =
        layout === "vertical"
            ? [{ ...yAxisProps }]
            : [
                {
                    scaleType: "band" as const,
                    data: normalizedCategories.map((c) => c.key),
                    valueFormatter: (key: string) =>
                        normalizedCategories.find((c) => c.key === key)
                            ?.label ?? "",
                    ...yAxisProps,
                },
            ];

    const handleClick = (
        _event: React.MouseEvent<SVGElement>,
        params: { series?: BarSeriesType; dataIndex?: number }
    ) => {
        if (!onBarClick) return;

        const { series, dataIndex } = params;
        if (!series || dataIndex == null) return;

        const seriesLabel =
            typeof series.label === "function"
                ? series.label("legend")
                : series.label ?? "";

        const value = series.data?.[dataIndex] ?? 0;
        const category = normalizedCategories[dataIndex]?.label ?? "";

        onBarClick({ seriesLabel, category, value });
    };

    return (
        <Box data-testid={testId} sx={{ width, height }}>
            <MuiBarChart
                layout={layout}
                height={height}
                xAxis={xAxis}
                yAxis={yAxis}
                series={series}
                margin={margin}
                slotProps={{
                    legend: legendProps,
                    tooltip: tooltipProps,
                }}
                skipAnimation={!enableAnimation}
                onItemClick={handleClick}
                sx={{
                    [`& .${barLabelClasses.root}`]: {
                        fontWeight: "bold",
                        fill: "white",
                    },
                    ...sx,
                }}
            />
        </Box>
    );
};

export default BarChart;