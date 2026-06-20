import type { InputProps } from "./InputProps.ts";
import { FormControlLabel, Switch } from "@mui/material";

type ToggleInputProps = {
	/**
	 * The label of the toggle input.
	 */
	label?: string;

	/**
	 * Whether the toggle input is checked.
	 */
	checked?: boolean;

	/**
	 * Whether the toggle input is initially checked.
	 */
	defaultChecked?: boolean;

	/**
	 * Callback invoked when the toggle input is checked or unchecked.
	 * @param value The new checked state of the toggle input.
	 */
	setChecked?: (value: boolean) => void;

	/**
	 * The placement of the label relative to the toggle input.
	 * @default 'end'
	 */
	labelPlacement?: "end" | "start" | "top" | "bottom";

    /**
     * The spacing between the label and the toggle input.
     * @default 'standard'
     */
    spacing?: 'standard' | 'space-between';

    /**
     * The indentation level of the toggle input, used for nested forms. Each level adds a left margin to visually indicate hierarchy.
     */
    indent?: number;

	/**
	 *  * The color of the toggle input.
	 */
	color?:
		| "primary"
		| "secondary"
		| "error"
		| "info"
		| "success"
		| "warning"
		| "default";
} & InputProps;

const toggleInput = (props: ToggleInputProps) => {
	const component = (
		<Switch
			id={props.id}
			name={props.name}
			className={props.className}
			checked={props.checked}
			size={"small"}
			data-testid={props.testId}
			onChange={(_, v) =>
				props.setChecked &&
				props.displayMode !== "text" &&
				props.displayMode !== "readonly"
					? props.setChecked(v)
					: undefined
			}
			defaultChecked={props.defaultChecked}
			sx={{
				marginRight: "0.5rem",
                marginLeft: props.indent ? `${props.indent * 2}rem` : '0.5rem',
				marginTop: 0,
				marginBottom: 0,
			}}
			disabled={props.displayMode === "disabled"}
			readOnly={props.displayMode === "readonly"}
			color={props.color}
		/>
	);

    if (props.displayMode === 'hidden')
        return (<></>);
    return (
        <FormControlLabel required={props.required}
                          control={component}
                          sx={{
                                marginLeft: 0,
                          }}
                          label={props.label}
                          labelPlacement={props.labelPlacement}
                          className={props.spacing === 'space-between' ? 'flex justify-between' : undefined}
        />
    )
};

export default toggleInput;
