import { type Attachment } from "../../../models/core/attachment";
import { createRef, useContext, useEffect, useMemo, useState } from "react";
import { useDeleteDialog } from "../../../hooks/useDeleteDialog";
import Typography from "../display/Typography";
import IconButton from "../buttons/IconButton";
import ThemeContext from "../../../context/ThemeContext";
import Icon from "../display/Icon";

type FilePortalInputProps = {
	onUpload?: (files: File[]) => void;
	onDownload?: (attachment: Attachment) => void;
	onDelete?: (attachment: Attachment) => void;
	attachments?: Attachment[];
	title?: string;
	description?: string;
	hideHeader?: boolean;
	disabled?: boolean;
	allowMultiple?: boolean;
	maxSize?: number;
	error?: string;
};

type FilePortalInputItemProps = {
	attachment: Attachment;
	onDownload?: (attachment: Attachment) => void;
	onDelete?: (attachment: Attachment) => void;
	disabled?: boolean;
};

const FilePortalInputItem = (props: FilePortalInputItemProps) => {
	const { isDark } = useContext(ThemeContext);
	const dialog = useDeleteDialog();

	const fileSizeString = useMemo(() => {
		const size = props.attachment.size;
		if (size < 1024) return `${size} B`;
		if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
		return `${(size / 1024 / 1024).toFixed(2)} MB`;
	}, [props.attachment.size]);

	const downloadAttachment = () => {
		if (props.onDownload) props.onDownload(props.attachment);
	};

	const deleteAttachment = () => {
		if (props.onDelete) props.onDelete(props.attachment);
	};

	return (
		<div
			className={`w-full flex py-2 px-4 rounded-md gap-4 border ${
				isDark
					? "bg-gray-800 border-gray-700"
					: "bg-white border-gray-200"
			}`}
		>
			<div className="flex flex-grow flex-col">
				<h5 className={isDark ? "text-gray-100" : "text-gray-900"}>
					{props.attachment.fileName}
				</h5>
				<small className={isDark ? "text-gray-400" : "text-gray-500"}>
					{props.attachment.contentType} - {fileSizeString}
				</small>
			</div>
			<div className={"flex items-center"}>
				<IconButton
					testId="attachment-download-button"
					onClick={downloadAttachment}
					icon="Download"
					style={{
						backgroundColor: "transparent",
						boxShadow: "none",
						color: "text.primary",
					}}
					iconStyle={{
						size: 'medium',
						className: "hover:text-primary transition-colors",
					}}
				/>
				{!props.disabled && (
					<IconButton
						testId="attachment-delete-button"
						onClick={() =>
							dialog({
								onConfirm: () => {
									deleteAttachment();
								},
								description: (
									<Typography testId="" component="body1">
										Are you sure you want to delete
										attachment{" "}
										<span className="font-semibold">
											{props.attachment.fileName}
										</span>
										? This change cannot be reverted.
									</Typography>
								),
							})
						}
						icon="Delete"
						style={{
							backgroundColor: "transparent",
							boxShadow: "none",
							color: "text.primary",
						}}
						iconStyle={{
							size: 'medium',
							className: "hover:text-red-500 transition-colors",
						}}
					/>
				)}
			</div>
		</div>
	);
};

export const FilePortalInput = (props: FilePortalInputProps) => {
	const { isDark } = useContext(ThemeContext);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [sizeError, setSizeError] = useState<string[]>([]);
	const [maxSize] = useState<number>(props.maxSize ?? 2);
	const ref = createRef<HTMLInputElement>();

	// Clear size error on component render
	useEffect(() => {
		setSizeError([]);
	}, [props.attachments]);

	const uploadFile = (files: FileList) => {
		setSizeError([]);
		if (props.disabled || !props.onUpload) {
			console.warn(
				"FilePortalInput: Upload is disabled or no onUpload handler provided"
			);
			return;
		}

		const validFiles: File[] = [];
		if (maxSize) {
			const MAX_FILE_SIZE = maxSize * 1024 * 1024; // 2MB
			const oversizedFiles: string[] = [];

			for (const file of Array.from(files)) {
				if (file.size > MAX_FILE_SIZE) {
					oversizedFiles.push(file.name);
					continue;
				}
				validFiles.push(file);
			}

			if (oversizedFiles.length) {
				setSizeError(oversizedFiles);
			}
		} else {
			for (const file of Array.from(files)) {
				validFiles.push(file);
			}
		}
		props.onUpload(Array.from(validFiles));
	};

	const onDragEnter = () => setIsDragging(true);
	const onDragLeave = () => setIsDragging(false);
	const onDropCapture = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(false);
		if (event.dataTransfer.files && event.dataTransfer.files.length > 0)
			uploadFile(event.dataTransfer.files);
	};

	const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) uploadFile(target.files);
	};

	return (
		<div className="w-full flex flex-col gap-4">
			{!props.hideHeader && (
				<div>
					<h2 className={isDark ? "text-gray-100" : "text-gray-900"}>
						{props.title ?? "Attachments"}
					</h2>
					<p className={isDark ? "text-gray-400" : "text-gray-500"}>
						{props.description ??
							"Add or remove attachments associated with the entity"}
					</p>
				</div>
			)}

			{/* Upload Box */}
			<div
				className={`w-full flex flex-col border-2 border-dashed rounded-md p-8 items-center duration-200 ${
					isDark
						? "bg-gray-900 border-gray-700"
						: "bg-gray-50 border-gray-300"
				} ${isDragging && !props.disabled ? "border-primary" : ""}`}
				onDropCapture={onDropCapture}
				onDragOver={(event) => event.preventDefault()}
				onDragEnter={onDragEnter}
				onDragLeave={onDragLeave}
			>
				{!props.disabled && (
					<>
						<div className={"bg-background p-4 rounded-full mb-4"}>
							<Icon icon="Upload" size="large" />
						</div>
						<h5
							className={
								isDark ? "text-gray-200" : "text-gray-800"
							}
						>
							Drop your file here or{" "}
							<span
								onClick={() => ref.current?.click()}
								className="font-black text-primary-400 cursor-pointer hover:text-primary-600"
							>
								browse
							</span>
						</h5>
						<small
							className={
								isDark ? "text-gray-400" : "text-gray-500"
							}
						>
							Select a file up to 2MB
						</small>
						<input
							ref={ref}
							type={"file"}
							className="hidden"
							onChange={onFileChange}
						/>
					</>
				)}
				{props.disabled && (
					<h5 className={isDark ? "text-gray-500" : "text-gray-400"}>
						Uploading attachments is disabled at the present time
					</h5>
				)}
			</div>

			{/* Attachments list */}
			<div className="w-full flex flex-col gap-2">
				{props.attachments &&
					props.attachments.map((attachment) => (
						<FilePortalInputItem
							key={attachment.fileName}
							attachment={attachment}
							disabled={props.disabled}
							onDelete={props.onDelete}
							onDownload={props.onDownload}
						/>
					))}
			</div>

			{/* Error */}
			{props.error && (
				<div>
					<small style={{ paddingLeft: 5, color: "red" }}>
						{props.error}
					</small>
				</div>
			)}
			{sizeError.length > 0 && (
				<div>
					<small style={{ paddingLeft: 5, color: "red" }}>
						The following files exceed the maximum size of {maxSize}{" "}
						MB and were not uploaded: {sizeError.join(", ")}
					</small>
				</div>
			)}
		</div>
	);
};
