import { useMemo, useRef, useState, useContext } from "react";
import FlexContainer from "../layout/FlexContainer.tsx";
import Typography from "../display/Typography.tsx";
import IconButton from "../buttons/IconButton";
import ThemeContext from "../../../context/ThemeContext";
import type { InputProps } from "./InputProps";
import type { Attachment } from "../../../models/core/attachment";
import Icon from "../display/Icon.tsx";

/**
 * Properties for Multi File input component 
 */
type MultiFileInputProps = {
    /**
     * Label displayed above the file upload area
     */
    label?: string;

    /**
     * List of uploaded attachments to be displayed
     */
    attachments?: Attachment[];

    /**
     * Callback triggered when one or more files are selected
     * or dropped into the upload area
     */
    onUpload?: (files: File[]) => void;

    /**
     * Callback triggered when an attachment download action is invoked
     */
    onDownload?: (attachment: Attachment) => void;

    /**
     * Callback triggered when an attachment delete action is invoked
     */
    onDelete?: (attachment: Attachment) => void;

    /**
     * Helper or error text displayed below the input
     */
    subtext?: string;

    /**
     * Indicates whether the input is in an error state
     */
    error?: boolean;
} & InputProps;


const MultiFileInput = (props: MultiFileInputProps) => {
    const { isDark } = useContext(ThemeContext);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const memoizedId = useMemo(
        () => props.id ?? `multi-file-input-${Math.random().toString(36).substring(2, 9)}`,
        [props.id]
    );

    const isDisabled = props.displayMode === "disabled";
    const isReadonly = props.displayMode === "readonly";

    if (props.displayMode === "hidden") return null;

    const uploadFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        if (isDisabled || isReadonly) return;
        props.onUpload?.(Array.from(files));
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        uploadFiles(e.target.files);
        e.target.value = "";
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        uploadFiles(e.dataTransfer.files);
    };

    const onDragEnter = () => setIsDragging(true);
    const onDragLeave = () => setIsDragging(false);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    if (props.displayMode === "text") {
        return (
            <FlexContainer testId={props.testId} direction="column" gap>
                {props.label && <Typography component="h5" testId={`${props.testId}-label`}>{props.label}</Typography>}
                <Typography component="body2" testId={`${props.testId}-body`}>
                    {props.attachments?.length
                        ? `${props.attachments.length} attachment(s)`
                        : "No attachments"}
                </Typography>
            </FlexContainer>
        );
    }

    return (
        <div className="w-full flex flex-col gap-4">
            <div>
                <h2 className={isDark ? "text-gray-100" : "text-gray-900"}>
                    {props.label ?? "Attachments"}
                </h2>
                <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                    Add or remove attachments associated with the entity
                </p>
            </div>

            {/* Upload Box */}
            <div
                className={`w-full flex flex-col border-2 border-dashed rounded-md p-8 items-center duration-200 ${isDark ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-300"
                    } ${isDragging && !isDisabled && !isReadonly ? "border-primary" : ""}`}
                data-testid={props.testId}
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
            >
                {!isDisabled && !isReadonly && (
                    <>
                        <div className={'bg-background p-4 rounded-full mb-4'}>
                            <Icon icon="Upload" size="large" />
                        </div>
                        <h5 className={isDark ? "text-gray-200" : "text-gray-800"}>
                            Drop your file here or{" "}
                            <button type="button" onClick={() => inputRef.current?.click()}
                                className="font-black text-primary-400 hover:text-primary-600 bg-transparent border-0 p-0 cursor-pointer" >
                                browse
                            </button>
                        </h5>
                        <small className={isDark ? "text-gray-400" : "text-gray-500"}>
                            Select a file up to 2MB
                        </small>
                        <input
                            ref={inputRef}
                            id={memoizedId}
                            type="file"
                            multiple
                            disabled={isDisabled || isReadonly}
                            className="hidden"
                            onChange={onInputChange}
                        />
                    </>
                )}
                {(isDisabled || isReadonly) && (
                    <h5 className={isDark ? "text-gray-500" : "text-gray-400"}>
                        Uploading attachments is disabled at the present time
                    </h5>
                )}
            </div>

            {/* Attachments List */}
            <div className="w-full flex flex-col gap-2">
                {props.attachments?.map((attachment, index) => (
                    <div
                        key={`${attachment.id}-${index}`}
                        className={`w-full flex py-2 px-4 rounded-md gap-4 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                        <div className="flex flex-grow flex-col">
                            <h5 className={isDark ? "text-gray-100" : "text-gray-900"}>
                                {attachment.fileName}
                            </h5>
                            <small className={isDark ? "text-gray-400" : "text-gray-500"}>
                                {attachment.contentType}
                                {attachment.size != null && ` - ${formatFileSize(attachment.size)}`}
                            </small>
                        </div>

                        <div className="flex items-center">
                            <IconButton
								testId={`${props.testId}-download`}
                                icon="Download"
                                color="primary"
                                onClick={() => props.onDownload?.(attachment)}
                            />

                            {!isDisabled && !isReadonly && (
                                <IconButton
									testId={`${props.testId}-delete`}
                                    icon="Delete"
                                    color="error"
                                    onClick={() => props.onDelete?.(attachment)}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {props.error && props.subtext && (
                <div>
                    <small style={{ paddingLeft: 5, color: "red" }}>
                        {props.subtext}
                    </small>
                </div>
            )}
        </div>
    );
};

export default MultiFileInput;