import {
	type ChartsLegendProps,
	type ContinuousColorLegendProps,
	type PiecewiseColorLegendProps,
	type ChartsLegendPosition,
	legendClasses,
} from "@mui/x-charts-pro";

export const PieHorizontalLegendProps:
	| (Partial<
			| ChartsLegendProps
			| ContinuousColorLegendProps
			| PiecewiseColorLegendProps
	  > &
			ChartsLegendPosition)
	| undefined = {
	direction: "horizontal",
	position: {
		vertical: "bottom",
		horizontal: "center",
	},
	sx: {
		gap: "16px",
		[`.${legendClasses.mark}`]: {
			height: 20,
			width: 20,
		},
		[".MuiChartsLegend-series"]: {
			gap: "8px",
		},
	},
};

export const PieVerticalLegendProps:
	| (Partial<
			| ChartsLegendProps
			| ContinuousColorLegendProps
			| PiecewiseColorLegendProps
	  > &
			ChartsLegendPosition)
	| undefined = {
	direction: "vertical",
	position: {
		vertical: "middle",
		horizontal: "center",
	},
	sx: {
		gap: "16px",
		fontSize: "14px",
		[`.${legendClasses.mark}`]: {
			height: 20,
			width: 20,
		},
		[".MuiChartsLegend-series"]: {
			gap: "8px",
		},
	},
};

export const ScrollableLegendProps:
	| (Partial<
			| ChartsLegendProps
			| ContinuousColorLegendProps
			| PiecewiseColorLegendProps
	  > &
			ChartsLegendPosition)
	| undefined = {
	sx: {
		overflowY: 'scroll',
        flexWrap: 'nowrap',
        height: '100% !important',
	},
};