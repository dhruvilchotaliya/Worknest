import { useMemo } from 'react';
import { FormControl, FormHelperText } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { InputProps } from './InputProps.ts';
import Typography from '../display/Typography.tsx';
import FlexContainer from "../layout/FlexContainer.tsx";
import type {PickerValue} from "@mui/x-date-pickers/internals";

dayjs.extend(utc);
dayjs.extend(timezone);

type DateInputProps = {
  /**
   * Label of the date input
   */
  label?: string;

  /**
   * Value in ISO format (e.g. '2024-03-20' or '2024-03-20T14:30:00Z').
   * Parsed as UTC and displayed in the user's local timezone.
   */
  value?: string;

  /**
   * Callback when date changes. Returns an ISO date string (YYYY-MM-DD) or null.
   */
  setValue?: (value: string | undefined) => void;

  /**
   * Helper / error text
   */
  subtext?: string;

  /**
   * Error state
   */
  error?: boolean;

  /**
   * Date display format
   * @default 'DD-MM-YYYY'
   */
  format?: string;

  maxDate?: dayjs.Dayjs;
  
  minDate?: dayjs.Dayjs;
} & InputProps;

const DateInput = (props: DateInputProps) => {

  const memoizedId = useMemo(() => {
    return props.id ?? `date-input-${Math.random().toString(36).substring(2, 9)}`;
  }, [props.id]);

  const dayjsValue = useMemo(() => {
    if (!props.value) return null;
    return dayjs.utc(props.value).local();
  }, [props.value]);

  const displayFormat = props.format ?? 'DD-MM-YYYY';

  return useMemo(() => {
    if (props.displayMode === 'text') {
      return (
          <FlexContainer direction={'column'} testId={`${props.testId}-label`}>
            {
                props.label &&
                <Typography component={'h5'} testId={`${props.testId}-label`}>{props.label}</Typography>
            }
            {
                dayjsValue &&
                <Typography component={'body1'} style={{ paddingBottom: '0.5rem' }} testId={`${props.testId}-value`}>
                  {dayjsValue.format(displayFormat)}
                </Typography>
            }
            {
                !dayjsValue && <Typography component={'body1'} style={{ paddingBottom: '0.5rem' }} testId={`${props.testId}-novalue`}><br /></Typography>
            }
          </FlexContainer>
      );
    }

    if (props.displayMode === 'hidden')
      return (<></>);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormControl variant={'outlined'} size={'small'} sx={{marginBottom: props.subtext ? '0.25rem' : '0.5rem'}}>
            <DatePicker
                label={props.label}
                value={dayjsValue}
                onChange={(newValue: PickerValue) => {
                  if (props.displayMode == null || props.displayMode === 'editable') {
                    if (props.setValue)
                      props.setValue(newValue?.toISOString());
                  }
                }}
                disabled={props.displayMode === 'disabled'}
                readOnly={props.displayMode === 'readonly'}
                format={displayFormat}
				        data-testid={props.testId}
                maxDate={props.maxDate}
                minDate={props.minDate}
                slotProps={{
                  textField: {
                    id: memoizedId,
                    name: props.name,
                    size: 'small',
                    required: props.required,
                    error: props.error,
                    style: props.style,
                    className: props.className,
                  },
                }}
            />
            {
                props.subtext &&
                <FormHelperText id={memoizedId} error={props.error}>{props.subtext}</FormHelperText>
            }
          </FormControl>
        </LocalizationProvider>
    );
  }, [memoizedId, props, dayjsValue, displayFormat]);

};

export default DateInput;
