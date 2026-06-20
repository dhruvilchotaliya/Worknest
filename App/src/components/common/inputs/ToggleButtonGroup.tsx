import { useRef, useState, useLayoutEffect } from "react";
import {
	ToggleButtonGroup as MUIToggleButtonGroup,
	type SxProps,
	type Theme,
} from "@mui/material";
import ToggleButton from "../buttons/ToggleButton";
import type { IconType } from "../display/Icon";
import Icon from "../display/Icon";

export type ToggleOption<T> = {
	value: T;
	label: string;
	icon?: IconType;
};

type ToggleButtonGroupWrapperProps<T extends string | number> = Readonly<{
	value: T;
	onChange: (value: T) => void;
	options: ToggleOption<T>[];
	size?: "small" | "medium" | "large";
	orientation?: "horizontal" | "vertical";
	fullWidth?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	className?: string;
	color?:
		| "standard"
		| "primary"
		| "secondary"
		| "error"
		| "info"
		| "success"
		| "warning";
	sx?: SxProps<Theme>;
	/**
	 * The test identifier used for automated testing.
	 * Mapped to `data-testid` on the rendered input element.
	 */
	testId: string;

	/**
	 * Controls the text transformation of the button labels.
	 */
	textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";
}>;

function ToggleButtonGroup<T extends string | number>({
	value,
	onChange,
	options,
	size = "medium",
	orientation = "horizontal",
	fullWidth,
	disabled,
	readonly,
	color,
	className,
	sx,
	testId,
	textTransform = "uppercase",
}: ToggleButtonGroupWrapperProps<T>) {
	const activeIndex = options.findIndex((opt) => opt.value === value);
	const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const [pillStyle, setPillStyle] = useState<{
		top: number;
		left: number;
		width: number;
		height: number;
	}>({
		top: 4,
		left: 4,
		width: 0,
		height: 0,
	});

	useLayoutEffect(() => {
		const activeButton = buttonRefs.current[activeIndex];
		if (!activeButton) return;

		setPillStyle({
			top: activeButton.offsetTop,
			left: activeButton.offsetLeft,
			width: activeButton.offsetWidth,
			height: activeButton.offsetHeight,
		});
	}, [activeIndex, options, orientation]);

	return (
		<MUIToggleButtonGroup
			value={value}
			exclusive
			orientation={orientation}
			size={size}
			color={color ?? "primary"}
			disabled={disabled}
			data-testid={testId}
			className={`relative inline-flex bg-gray-100 dark:bg-neutral-800 z-0 p-1 ${
				fullWidth ? "w-full" : ""
			} ${className ?? ""}`}
			onChange={(_, newValue) => {
				if (readonly || newValue === null) return;
				onChange(newValue as T);
			}}
			sx={{
				"&::before": {
					content: '""',
					position: "absolute",
					top: `${pillStyle.top}px`,
					left: `${pillStyle.left}px`,
					width: `${pillStyle.width}px`,
					height: `${pillStyle.height}px`,
					backgroundColor: "#ffffff",
					borderRadius: "6px",
					transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
					".dark &": {
						backgroundColor: "#404040",
					},
				},
				...sx,
			}}
		>
			{options.map((option, index) => {
				const isActive = value === option.value;

				return (
					<ToggleButton
						color={color}
						key={String(option.value)}
						value={option.value}
						className={`flex items-center gap-2 relative z-1 border-none bg-transparent whitespace-nowrap
						${
							isActive
								? "text-blue-600 dark:text-blue-400"
								: "text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
						}`}
						ref={(el) => {
							buttonRefs.current[index] = el;
						}}
						data-testid={`${testId}-option-${option.value}`}
						disableRipple
						sx={{
							"&:hover": {
								backgroundColor: "transparent",
							},
							textTransform: textTransform,
						}}
					>
					{option.icon && <Icon icon={option.icon} />}
					<span className="hidden sm:block">{option.label}</span>
					</ToggleButton>
				);
			})}
		</MUIToggleButtonGroup>
	);
}

export default ToggleButtonGroup;
