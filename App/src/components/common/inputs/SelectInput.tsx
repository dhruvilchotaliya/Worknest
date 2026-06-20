import { FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select} from "@mui/material";
import { useMemo } from "react";
import type { InputProps } from "./InputProps";
import FlexContainer from "../layout/FlexContainer.tsx";
import Typography from "../display/Typography.tsx";

/**
 * Option item for Select input
 */
export type SelectOption = {
  /**
   * Display label shown to the user
   */
  label: string;

  /**
   * Actual value of the option
   */
  value: string | number;

  variant?: 'default' | 'italic'
};

/**
 * Properties for Select input component
 */
type SelectInputProps = {
  /**
   * Label displayed above the select input
   */
  label: string;

  /**
   * Currently selected value
   */
  value?: string | number;

  /**
   * Callback triggered when selected value changes
   */
  setValue?: (value: string) => void;

  /**
   * List of selectable options
   */
  options: SelectOption[];

  /**
   * Helper or error text displayed below the select
   */
  subtext?: string;

  /**
   * Indicates whether the select is in an error state
   */
  error?: boolean;
  /**
   * Callback triggered when the select loses focus.
   * Note: MUI Select is internally implemented using an input element,
   */
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;} & InputProps;

const SelectInput = (props: SelectInputProps) => {

  const memoizedId = useMemo(() => {
    return props.id ?? `select-input-${Math.random().toString(36).substring(2, 9)}`;
  }, [props.id]);

  const value = props.value ?? "";

  if (props.displayMode === "hidden") return <></>;

  if (props.displayMode === "text") {
    const selectedOption = props.options.find(
      (opt) => opt.value === props.value
    );

    const displayText = selectedOption?.label ?? "";

    return (
      <FlexContainer direction="column" className="mb-0"  testId={`${props.testId}-select-input-text`}>
        {props.label && (
          <Typography component="h5" testId={`${props.testId}-label`}>
            {props.label}
          </Typography>
        )}

        <Typography component="body1" testId={`${props.testId}-display-value`}>
          {displayText}
        </Typography>
      </FlexContainer>
    );
  }

  return (
    <FormControl
      fullWidth
      size="small"
      variant="outlined"
      required={props.required}
      error={props.error}
      disabled={props.displayMode === "disabled"}
      className={props.className}
      style={props.style}
      sx={{marginBottom: props.subtext ? '0.25rem' : '0.5rem'}}
    >
      <InputLabel htmlFor={memoizedId} error={props.error}>
        {props.label}
      </InputLabel>


      <Select
        id={memoizedId}
        name={props.name}
        value={value}
        label={props.label}
		    data-testid={props.testId}
        input={<OutlinedInput label={props.label}/>}
        onBlur={props.onBlur} 
        onChange={(e) => {
          if (!props.setValue || props.displayMode === "readonly")
            return;
          props.setValue(e.target.value.toString());
        }}
      >
        {props.options.map((opt) => (
          <MenuItem data-testid={`${props.testId}-${opt.value}`} key={opt.value} value={opt.value}>
            {
              opt.variant === 'italic' ? <em>{opt.label}</em> : opt.label
            }
          </MenuItem>
        ))}
      </Select>

      {props.subtext && (
        <FormHelperText id={memoizedId} error={props.error}>{props.subtext}</FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectInput;