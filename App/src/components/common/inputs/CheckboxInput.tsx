import type {InputProps} from "./InputProps.ts";
import {Checkbox, FormControlLabel} from "@mui/material";

type CheckboxInputProps = {
    /**
     * The label of the toggle input.
     */
    label?: string;

    /**
     * Whether the toggle input is checked.
     */
    checked?: boolean;

    /**
     * Whether the toggle input is in an indeterminate state.
     */
    indeterminate?: boolean;

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
    labelPlacement?: 'end' | 'start' | 'top' | 'bottom';

    /**
     * The spacing between the label and the toggle input.
     * @default 'standard'
     */
    spacing?: 'standard' | 'space-between';
} & InputProps

const toggleInput = (props: CheckboxInputProps) => {

    const component = (
        <Checkbox id={props.id}
                  name={props.name}
                  className={props.className}
                  checked={props.checked}
                  indeterminate={props.indeterminate}
                  size={'medium'}
				  data-testid={props.testId}
                  onChange={
                      (_, v) => props.setChecked && props.displayMode !== 'text' && props.displayMode !== 'readonly'
                          ? props.setChecked(v)
                          : undefined
                  }
                  defaultChecked={props.defaultChecked}
                  disabled={props.displayMode === 'disabled'}
                  readOnly={props.displayMode === 'readonly'}
                  sx={{
                      marginRight: '0.5rem',
                      marginLeft: '0.5rem',
                      paddingTop: '1px',
                      paddingBottom: '1px'
                  }}
        />
    );

    if (props.displayMode === 'hidden')
        return (<></>);
    return (
        <FormControlLabel required={props.required}
                          control={component}
                          label={props.label}
                          labelPlacement={props.labelPlacement}
                          className={props.spacing === 'space-between' ? 'flex justify-between' : undefined}
                          sx={{ '& .MuiFormControlLabel-label': { whiteSpace: 'nowrap' } }}
        />
    )
};

export default toggleInput;