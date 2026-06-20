import type {InputProps} from "./InputProps.ts";
import {FormControl, FormHelperText, InputLabel, OutlinedInput} from "@mui/material";
import {type ReactNode, useCallback, useEffect, useMemo, useRef, useState} from "react";
import InputAdornment from "@mui/material/InputAdornment";
import FlexContainer from "../layout/FlexContainer.tsx";
import Typography from "../display/Typography.tsx";


type TextInputProps = {
    /**
     * The label of the text input.
     */
    label?: string;

    /**
     * The value of the text input.
     */
    value?: string;

    /**
     * Callback invoked when the value of the text input changes.
     * @param value The new value of the text input.
     */
    setValue?: (value: string) => void;

    /**
     * The default value of the text input.
     */
    defaultValue?: string;

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
     * Whether the text input is multiline.
     * @default false
     */
    multiline?: boolean;

    /**
     * The number of rows to display when the text input is multiline.
     * @default 1
     * @note This property is ignored when `multiline` is set to `false`.
     */
    rows?: number;

    /**
     * The minimum number of rows to display when the text input is multiline.
     * @default 1
     * @note This property is ignored when `multiline` is set to `false`.
     */
    minRows?: number;

    /**
     * The maximum number of rows to display when the text input is multiline.
     * @default 10
     * @note This property is ignored when `multiline` is set to `false`.
     */
    maxRows?: number;

    /**
     * The type of text input.
     * @default 'text'
     */
    type?: 'text' | 'password' | 'email' | 'search' | 'tel' | 'url';

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

    /**
     * Whether to use debounce when invoking the `setValue` callback.
     * @default undefined (no debounce)
     */
    debounce?: number;
    /**
     * Callback triggered when the select loses focus.
     * Note: MUI Select is internally implemented using an input element,
     */
    onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
} & InputProps;

const TextInput = (props: TextInputProps) => {

    const memoizedId = useMemo(() => {
        return props.id ?? `text-input-${Math.random().toString(36).substring(2, 9)}`;
    }, [props.id]);

    const [internalValue, setInternalValue] = useState(props.value ?? props.defaultValue ?? '');
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync internal value when the controlled value changes externally
    useEffect(() => {
        if (props.value !== undefined) {
            setInternalValue(props.value);
        }
    }, [props.value]);

    // Cleanup the debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const handleChange = useCallback((value: string) => {
        if (!props.setValue || props.displayMode === 'text')
            return;
        setInternalValue(value);
        if (props.debounce) {

            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            debounceTimerRef.current = setTimeout(() => {
                props.setValue!(value);
            }, props.debounce);
        } else {
            props.setValue(value);
        }
    }, [props]);

    return useMemo(() => {
        if (props.displayMode === 'text') {
            return (
                <FlexContainer direction={'column'} testId={`${props.testId}-container-label`}>
                    {
                        props.label &&
                        <Typography component={'h5'} testId={`${props.testId}-label`}>{props.label}</Typography>
                    }
                    {
                        props.value && !props.multiline &&
                        <Typography component={'body1'} style={{ paddingBottom: '0.5rem' }} testId={`${props.testId}-value`}>
                            {
                                props.value
                            }
                        </Typography>
                    }
                    {
                        props.value && props.multiline &&
                        <p style={{ paddingBottom: '0.5rem' }}>
                            <span dangerouslySetInnerHTML={
                                {__html: (props.value ?? '').replace(/\n/g, '<br/>')}
                            }/>
                        </p>
                    }
                    {
                        !props.value && <Typography component={'body1'} style={{ paddingBottom: '0.5rem' }} testId={`${props.testId}-nocontent`}><br /></Typography>
                    }
                </FlexContainer>
            );
        }


        if (props.displayMode === 'hidden')
            return (<></>);
        return (
            <FormControl fullWidth variant={'outlined'} size={'small'} sx={{marginBottom: props.subtext ? '0.25rem' : '0.5rem'}} required={props.required}>
                <InputLabel htmlFor={memoizedId} error={props.error}>{props.label}</InputLabel>
                <OutlinedInput id={memoizedId}
                               name={props.name}
                               style={props.style}
                               className={props.className}
							   data-testid={props.testId}
                               required={props.required}
                               size={'small'}
                               label={props.label}
                               value={internalValue}
                               disabled={props.displayMode === 'disabled'}
                               readOnly={props.displayMode === 'readonly'}
                               error={props.error}
                               type={props.type ?? 'text'}
                               defaultValue={props.defaultValue}
                               multiline={props.multiline}
                               rows={props.rows}
                               minRows={props.minRows}
                               maxRows={props.maxRows}
                               placeholder={props.placeholder}
                               onBlur={props.onBlur} 
                               onChange={e => handleChange(e.target.value)}
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
    }, [memoizedId, props, internalValue, handleChange]);
}

export default TextInput;