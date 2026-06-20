import {
	FormControl,
	FormControlLabel,
	FormHelperText,
	Radio,
	RadioGroup,
} from "@mui/material";
import Typography from "../display/Typography.tsx";
import type { InputProps } from "../inputs/InputProps";

export type RadioGroupOption = {
	label: string;
	value: string;
	disabled?: boolean;
};

type RadioInputGroupProps = {
	/**
	 * Label for the radio group.
	 * Displayed above the radio options.
	 */
	label?: string;

	/**
	 * Currently selected radio value.
	 */
	value?: string | null;

	/**
	 * Callback invoked when the selected radio value changes.
	 */
	setValue?: (value: string) => void;

	/**
	 * List of radio options to render.
	 */
	options: RadioGroupOption[];

	/**
	 * Helper text displayed below the radio group.
	 * Commonly used for validation or guidance messages.
	 */
	subtext?: string;

	/**
	 * When true, error styles and helper text are applied.
	 */
	error?: boolean;

	/**
	 * Layout direction of the radio options.
	 * @default 'column'
	 */
	direction?: "row" | "column";

	/**
	 * Controls spacing and alignment between the radio control and its label.
	 * @default 'standard'
	 */
	spacing?: "standard" | "space-between";

	/**
	 * Placement of the label relative to the radio control.
	 * @default 'end'
	 */
	labelPlacement?: "end" | "start" | "top" | "bottom";
} & InputProps;

const RadioInputGroup = (props: RadioInputGroupProps) => {
	if (props.displayMode === "hidden") return <></>;

	const component = (
		<Radio
			size="medium"
			sx={{
				marginRight: "0.5rem",
				marginLeft: "0.5rem",
				paddingTop: "2px",
				paddingBottom: "2px",
			}}
		/>
	);

	return (
		<FormControl
			error={props.error}
			data-testid={props.testId}
			sx={{ marginBottom: "0.25rem" }}
		>
			{props.label && (
				<Typography component="h5" testId={`${props.testId}-label`}>{props.label}</Typography>
			)}

			<RadioGroup
				row={props.direction === "row"}
				value={props.value ?? ""}
				onChange={(_, v) =>
					props.setValue &&
					props.displayMode !== "text" &&
					props.displayMode !== "readonly"
						? props.setValue(v)
						: undefined
				}
			>
				{props.options.map((option) => (
					<FormControlLabel
						key={option.value}
						value={option.value}
						label={option.label}
						className={
							props.spacing === "space-between"
								? "flex justify-between"
								: undefined
						}
						labelPlacement={props.labelPlacement}
						control={component}
						disabled={props.displayMode === "disabled"}
					/>
				))}
			</RadioGroup>

			{props.subtext && (
				<FormHelperText error={props.error}>
					{props.subtext}
				</FormHelperText>
			)}
		</FormControl>
	);
};

export default RadioInputGroup;
