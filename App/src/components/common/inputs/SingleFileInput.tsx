import { FormControl, FormHelperText } from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import type { InputProps } from "./InputProps";
import FlexContainer from "../layout/FlexContainer.tsx";
import Typography from "../display/Typography.tsx";
import IconButton from "../buttons/IconButton";

/**
 * Properties for File input component (Generic)
 */
type SingleFileInputProps = {
  /**
   * Label displayed above the file input
   */
  label?: string;

  /**
   * Currently selected file name
   */
  value?: string;

  /**
   * Callback triggered when file is selected
   */
  onChange?: (file: File | null, event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Helper or error text displayed below the file input
   */
  subtext?: string;

  /**
   * Indicates whether the input is in an error state
   */
  error?: boolean;
} & InputProps;


const SingleFileInput = (props: SingleFileInputProps) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (props.value !== undefined) {
      setFileName(props.value || null);
    }
  }, [props.value]);

  const memoizedId = useMemo(
    () =>
      props.id ??
      `file-input-${Math.random().toString(36).substring(2, 9)}`,
    [props.id]
  );

  const displayFileName = fileName || "No file selected";

  if (props.displayMode === "hidden") return null;

  if (props.displayMode === "text") {
    return (
      <FlexContainer direction="column" gap={true} testId={`${props.testId}-label-container`}>
        {props.label && <Typography component="h5" testId={`${props.testId}-label`}>{props.label}</Typography>}
        <Typography component="body1" testId={`${props.testId}-value`}>{displayFileName}</Typography>
      </FlexContainer>
    );
  }

  const isDisabled = props.displayMode === "disabled";
  const isReadonly = props.displayMode === "readonly";

  const openFilePicker = () => {
    if (isDisabled || isReadonly) return;
    document.getElementById(memoizedId)?.click();
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isReadonly) return;
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    setFileName(file.name);
    props.onChange?.(file, event);
    event.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDisabled || isReadonly) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDisabled || isReadonly) return;
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] ?? null;
    if (!file) return;
    setFileName(file.name);
    props.onChange?.(file, e); 
  };

  return (
    <FormControl
      fullWidth
      size="small"
      required={props.required}
      error={props.error}
      disabled={isDisabled}
      className={props.className}
      style={props.style}
      margin="normal"
    >

      {props.label && (
        <Typography component="body2" testId={`${props.testId}-error`}>
          {props.label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </Typography>
      )}

      <div
        data-testid={props.testId}
        className={`
          flex items-center gap-2 px-3 py-2
          border rounded-lg transition-colors
          ${props.error
            ? "border-red-500"
            : isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600"
          }
          ${isDisabled || isReadonly
            ? "cursor-not-allowed opacity-60 bg-gray-100 dark:bg-gray-800"
            : "cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
          }
        `}
        onClick={openFilePicker}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <IconButton
          icon="Upload"
		  testId={`${props.testId}-button`}
		  displayMode={isDisabled || isReadonly ? "disabled" : "editable"}
          onClick={(e) => {
            e.stopPropagation();
            openFilePicker();
          }}
        />

        <span className="text-sm text-black dark:text-white flex-1 truncate">
          {displayFileName}
        </span>

        <input
          type="file"
          id={memoizedId}
          name={props.name}
          className="hidden"
          accept={props.accept}
          disabled={isDisabled || isReadonly}
          onChange={handleInputChange}
        />
      </div>

      {props.subtext && (
        <FormHelperText id={memoizedId} error={props.error}> 
          {props.subtext}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default SingleFileInput;
