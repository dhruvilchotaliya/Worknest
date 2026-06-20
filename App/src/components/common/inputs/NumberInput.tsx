import {FormControl, FormHelperText, InputLabel, OutlinedInput} from "@mui/material";
import Typography from "../display/Typography.tsx";
import type {InputProps} from "./InputProps";
import {type ReactNode, useMemo} from "react";
import FlexContainer from "../layout/FlexContainer.tsx";
import InputAdornment from "@mui/material/InputAdornment";

type NumberInputProps = {
    /**
     * The label of the text input.
     */
    label?: string;

    /**
     * The value of the text input.
     */
    value?: number;

    /**
     * Callback invoked when the value of the text input changes.
     * @param value The new value of the text input.
     */
    setValue?: (value: number) => void;

    /**
     * The default value of the text input.
     */
    defaultValue?: number;

    /**
     * The placeholder text displayed when the text input is empty.
     * @example 'Enter your email address'
     */
    placeholder?: string;

    /**
     * The subtext displayed below the text input.
     * @example 'Must be a valid email address'
     */
    subtext?: string;

    /**
     * Whether the text input is in an error state.
     * @note You can utilise the helper text to provide more information about the error.
     */
    error?: boolean;

    /**
     * Minimum allowed value.
     */
    min?: number;

    /**
     * Maximum allowed value.
     */
    max?: number;

    /**
     * Step increment for the number input.
     * @default 1
     */
    step?: number;

    /**
     * The adornment displayed at the start of the text input.
     * @example <Icon icon={'user'} />
     */
    startAdornment?: ReactNode;

    /**
     * The adornment displayed at the end of the text input.
     * @example <Icon icon={'lock'} />
     */
    endAdornment?: ReactNode;
} & InputProps;

const NumberInput = (props: NumberInputProps) => {

    const memoizedId = useMemo(() => {
        return props.id ?? `number-input-${Math.random().toString(36).substring(2, 9)}`;
    }, [props.id]);

    return useMemo(() => {
        if (props.displayMode === 'text') {
            return (
                <FlexContainer direction={'column'} testId={`${props.testId}-text-container`}>
                    {
                        props.label &&
                        <Typography component={'h5'} testId={`${props.testId}-label`}>{props.label}</Typography>
                    }
                    {
                        !Number.isNaN(props.value) && props.value &&
                        <Typography component={'body1'} style={{ paddingBottom: '0.5rem' }} testId={`${props.testId}-value`}>
                            {
                                props.value
                            }
                        </Typography>
                    }
                    {
                        (!props.value || Number.isNaN(props.value)) &&
                        <Typography component={'body1'} style={{ paddingBottom: '0.5rem' }} testId={`${props.testId}-body`}><br/></Typography>
                    }
                </FlexContainer>
            );
        }


        if (props.displayMode === 'hidden')
            return (<></>);
        return (
            <FormControl variant={'outlined'} size={'small'} sx={{marginBottom: props.subtext ? '0.25rem' : '0.5rem'}}>
                <InputLabel htmlFor={memoizedId} error={props.error}>{props.label} {props.required ?'*':''}</InputLabel>
                <OutlinedInput id={memoizedId}
                               name={props.name}
                               style={props.style}
                               className={props.className}
							   data-testid={props.testId}
                               required={props.required}
                               size={'small'}
                               label={props.label}
                               value={props.value}
                               disabled={props.displayMode === 'disabled'}
                               readOnly={props.displayMode === 'readonly'}
                               error={props.error}
                               type={'number'}
                               defaultValue={props.defaultValue}
                               placeholder={props.placeholder}
                               inputProps={{ min: props.min, max: props.max, step: props.step }}
                               onChange={
                                   e => props.setValue && props.displayMode !== 'text'
                                       ? props.setValue(e.target.value ? parseInt(e.target.value) : NaN)
                                       : undefined
                               }
                               startAdornment={
                                   props.startAdornment ? (
                                       <InputAdornment position={'start'}>
                                           {props.startAdornment}
                                       </InputAdornment>
                                   ) : undefined
                               }
                               endAdornment={
                                   props.endAdornment ? (
                                       <InputAdornment position={'end'}>
                                           {props.endAdornment}
                                       </InputAdornment>
                                   ) : undefined
                               }/>
                {
                    props.subtext &&
                    <FormHelperText id={memoizedId} error={props.error}>{props.subtext}</FormHelperText>
                }
            </FormControl>
        );
    }, [memoizedId, props]);
};

export default NumberInput;