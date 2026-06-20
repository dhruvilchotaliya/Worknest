import { useState, useMemo, useEffect } from "react";
import { FormControl, Divider, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { type Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { InputProps } from "./InputProps";
import BasicButton from "../buttons/Button";
import Typography from "../display/Typography";
import { Popover } from "../layout/Popover";

dayjs.extend(utc);
dayjs.extend(timezone);

type DateRangeInputProps = {
  /**
   * Required label for the overall range (e.g. Request Date)
   */
  label: string;

  /**
   * Start value in ISO format
   */
  fromValue?: string;

  /**
   * End value in ISO format
   */
  toValue?: string;

  /**
   * Callback for changes
   */
  onChange?: (fromValue: string | undefined, toValue: string | undefined) => void;

  format?: string;
} & Omit<InputProps, "value" | "setValue" | "label">;

export const DateRangeInput = (props: DateRangeInputProps) => {
  const displayFormat = props.format ?? "DD-MM-YYYY";

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const initialFrom = useMemo(() => {
    return props.fromValue ? dayjs.utc(props.fromValue).local() : null;
  }, [props.fromValue]);

  const initialTo = useMemo(() => {
    return props.toValue ? dayjs.utc(props.toValue).local() : null;
  }, [props.toValue]);

  const [draftFrom, setDraftFrom] = useState<Dayjs | null>(initialFrom);
  const [draftTo, setDraftTo] = useState<Dayjs | null>(initialTo);
  const [error, setError] = useState('');

  useEffect(() => {
    setDraftFrom(initialFrom);
  }, [initialFrom]);

  useEffect(() => {
    setDraftTo(initialTo);
  }, [initialTo]);

  const formatLabel = () => {
    if (initialFrom && initialTo) {
      return `${initialFrom.format(displayFormat)} -> ${initialTo.format(displayFormat)}`;
    }
    return props.label;
  };

  const handleApply = () => {
    if (!draftFrom || !draftTo) {
      setError('Please select both From and To dates');
      return;
    }
    setError('');
    props.onChange?.(draftFrom.toISOString(), draftTo.toISOString());
    setAnchor(null);
  };

  const handleClear = () => {
    setDraftFrom(null);
    setDraftTo(null);
    setError('');
    props.onChange?.(undefined, undefined);
    setAnchor(null);
  };

  const handleClose = () => {
    setDraftFrom(initialFrom);
    setDraftTo(initialTo);
    setError('');
    setAnchor(null);
  };

  if (props.displayMode === "hidden") return <></>;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div data-testid={props.testId} className={props.className}>
        <BasicButton
          testId={props.testId ? `${props.testId}-button` : undefined}
          label={formatLabel()}
          variant="outlined"
          color="inherit"
          onClick={(e) => setAnchor(e.currentTarget as HTMLElement)}
          displayMode={props.displayMode}
          className="whitespace-nowrap h-10 normal-case"
        />

        <Popover
          open={Boolean(anchor)}
          anchorEl={anchor}
          onClose={handleClose}
        >
          <Stack padding={2} gap={2} width={260}>
            <Typography component="body1" className="font-semibold">{props.label} Range</Typography>
            <Divider />

            <FormControl fullWidth variant="outlined" size="small">
              <DatePicker
                label="From"
                value={draftFrom}
                onChange={(date) => {
                  setDraftFrom(date);
                  setError('');
                }}
                maxDate={draftTo ?? undefined}
                disabled={props.displayMode === "disabled"}
                readOnly={props.displayMode === "readonly"}
                format={displayFormat}
                slotProps={{ textField: { size: "small" } }}
              />
            </FormControl>

            <FormControl fullWidth variant="outlined" size="small">
              <DatePicker
                label="To"
                value={draftTo}
                onChange={(date) => {
                  setDraftTo(date);
                  setError('');
                }}
                minDate={draftFrom ?? undefined}
                disabled={props.displayMode === "disabled"}
                readOnly={props.displayMode === "readonly"}
                format={displayFormat}
                slotProps={{ textField: { size: "small" } }}
              />
            </FormControl>

            {error && (
               <Typography component="caption" className="text-red-500">
                {error}
              </Typography>
            )}

            <Stack direction="row" justifyContent="flex-end" gap={1}>
              <BasicButton
                testId={props.testId ? `${props.testId}-clear` : undefined}
                label="Clear"
                variant="outlined"
                color="inherit"
                onClick={handleClear}
              />
              <BasicButton
                testId={props.testId ? `${props.testId}-apply` : undefined}
                label="Apply"
                variant="contained"
                onClick={handleApply}
              />
            </Stack>
          </Stack>
        </Popover>
      </div>
    </LocalizationProvider>
  );
};

export default DateRangeInput;
