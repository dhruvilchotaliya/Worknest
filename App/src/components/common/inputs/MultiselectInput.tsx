import { useMemo } from "react";
import type { InputProps } from "./InputProps";
import FlexContainer from "../layout/FlexContainer.tsx";
import Typography from "../display/Typography.tsx";
import { Checkbox, FormControl, FormHelperText, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from "@mui/material";

/**
 * Option item for MultiSelect input
 */
type MultiSelectOption = {
    /**
     * Display label shown to the user
     */
    label: string;

    /**
     * Actual value of the option
     */
    value: string;
};

/**
 * Properties for MultiSelect input component
 */
type MultiSelectInputProps = {
    /**
     * Label displayed above the select input
     */
    label: string;

    /**
     * Currently selected values
     */
    value?: string[];

    /**
     * Callback triggered when selected values change
     */
    setValue?: (value: string[]) => void;

    /**
     * List of selectable options
     */
    options: MultiSelectOption[];

    /**
     * Helper or error text displayed below the select
     */
    subtext?: string;

    /**
     * Indicates whether the select is in an error state
     */
    error?: boolean;

    showCountOnly?: boolean;
    
} & InputProps;

const MultiSelectInput = (props: MultiSelectInputProps) => {

    const memoizedId = useMemo(() => {
        return (props.id ?? `multi-select-input-${Math.random().toString(36).substring(2, 9)}`);
    }, [props.id]);

    const value = props.value ?? [];

    if (props.displayMode === "text") {
        const selectedLabels = props.options
            .filter((opt) => value.includes(opt.value))
            .map((opt) => opt.label)
            .join(", ");

        return (
            <FlexContainer testId="multi-select-container" direction="column">
                {props.label && (
                    <Typography testId="multi-select-container-label" component="h5">
                        {props.label}
                    </Typography>
                )}

                <Typography testId="multi-select-container-select-label" component="body1">
                    {selectedLabels || "-"}
                </Typography>
            </FlexContainer>
        );
    }

    if (props.displayMode === "hidden")
        return <></>;

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
        >
            <InputLabel htmlFor={memoizedId} error={props.error}>
                {props.label}
            </InputLabel>
            <Select
                size={'small'}
                id={memoizedId}
                multiple
                value={value}
                input={<OutlinedInput label={props.label} inputProps={{'data-testid': props.testId}} />}
                renderValue={(selected) => {
                    const values = selected as string[];
                
                    if (props.showCountOnly) {
                        return values.length === 0
                            ? "None selected"
                            : `${values.length} selected`;
                    }
                
                    return values
                        .map((val) => props.options.find((o) => o.value === val)?.label)
                        .filter(Boolean)
                        .join(", ");
                }}
                onChange={(e) => {
                    if (!props.setValue || props.displayMode === "readonly") return;
                    props.setValue(e.target.value as string[]);
                }}
                >
                {props.options.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                        <Checkbox checked={value.includes(opt.value)} size={'small'} />
                        <ListItemText primary={opt.label} />
                    </MenuItem>
                ))}
                
            </Select>
            {props.subtext && (
                <FormHelperText error={props.error}>
                    {props.subtext}
                </FormHelperText>
            )}
        </FormControl>
    );
};

export default MultiSelectInput;
