import MuiSlider from "@mui/material/Slider";
import { useState } from "react";

/**
 * Props for Slider component
 */
export type SliderProps = {
	/**
	 * Current value (controlled mode)
	 */
	value?: number | number[];

	/**
	 * Default value (uncontrolled mode)
	 */
	defaultValue?: number | number[];

	/**
	 * Callback when value changes
	 */
	onChange?: (value: number | number[]) => void;

	/**
	 * Callback when change is committed (e.g. on mouse up)
	 */
	onChangeCommitted?: (value: number | number[]) => void;

	/**
	 * Minimum value
	 */
	min?: number;

	/**
	 * Maximum value
	 */
	max?: number;

	/**
	 * Step increment
	 */
	step?: number;

	/**
	 * Whether slider is disabled
	 */
	disabled?: boolean;

	/**
	 * Marks on slider
	 */
	marks?: boolean | { value: number; label?: string }[];

	/**
	 * Orientation of slider
	 */
	orientation?: "horizontal" | "vertical";

	/**
	 * Size of slider
	 */
	size?: "small" | "medium";

	/**
	 * Color theme
	 */
	color?: "primary" | "secondary";

	/**
	 * Show value label
	 */
	valueLabelDisplay?: "auto" | "on" | "off";

	/**
	 * Custom class
	 */
	className?: string;

	/**
	 * Test identifier
	 */
	testId?: string;


	/**
	 * Optional inline styles applied to the slider.
	 */
	style?: any;

	/**
	 * When `true`, the slider will not swap values when dragging the thumb across the other thumb in range sliders.
	 * Defaults to `false`.
	 */
	disableSwap?: boolean;
};

/**
 * Slider component
 *
 * Wrapper around MUI Slider with simplified API
 */
export const Slider = ({
	value,
	defaultValue = 0,
	onChange,
	onChangeCommitted,
	min = 0,
	max = 100,
	step = 1,
	disabled = false,
	marks = false,
	orientation = "horizontal",
	size = "medium",
	color = "primary",
	valueLabelDisplay = "off",
	className,
	testId,
	style,
	disableSwap = false,
}: SliderProps) => {
	const [internalValue, setInternalValue] = useState<number | number[]>(
		value ?? defaultValue
	);

	const isControlled = value !== undefined;

	const handleChange = (_: Event, newValue: number | number[]) => {
		if (!isControlled) {
			setInternalValue(newValue);
		}
		onChange?.(newValue);
	};

	const handleCommitted = (_: Event | React.SyntheticEvent, newValue: number | number[]) => {
		onChangeCommitted?.(newValue);
	};

	return (
		<MuiSlider
			value={isControlled ? value : internalValue}
			onChange={handleChange}
			onChangeCommitted={handleCommitted}
			min={min}
			max={max}
			step={step}
			disabled={disabled}
			marks={marks}
			orientation={orientation}
			size={size}
			color={color}
			valueLabelDisplay={valueLabelDisplay}
			className={className}
			data-testid={testId}
			sx={style}
			disableSwap={disableSwap}
		/>
	);
};