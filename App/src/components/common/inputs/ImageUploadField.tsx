import { useState, useRef, useCallback, useEffect } from "react";
import { useAlerts } from "../../../hooks/useAlerts";
import IconButton from "../buttons/IconButton";
import Icon from "../display/Icon";

type ImageUploadFieldProps = {
	label?: string;
	value?: string | null;
	disabled?: boolean;
	onUpload: (file: File) => Promise<void>;
	onRemove?: () => Promise<void>;
	accept?: string;
	maxSizeMB?: number;
};

export const ImageUploadField = ({
	label = "Image",
	value,
	disabled = false,
	onUpload,
	onRemove,
	accept = ".svg,.png,.jpg,.jpeg",
	maxSizeMB = 2,
}: ImageUploadFieldProps) => {
	const [isDragging, setIsDragging] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const alerts = useAlerts();
	const maxSizeBytes = maxSizeMB * 1024 * 1024;

	useEffect(() => {
		if (value) {
			setPreviewUrl(value);
		} else {
			setPreviewUrl(null);
		}
	}, [value]);

	const validateFile = useCallback(
		(file: File): boolean => {
			const validExtensions = accept
				.split(",")
				.map((ext) => ext.trim().toLowerCase());
			const fileExtension = `.${file.name
				.split(".")
				.pop()
				?.toLowerCase()}`;

			if (!validExtensions.includes(fileExtension)) {
				alerts.error(
					"Invalid file type",
					`Please upload a file with one of these extensions: ${accept}`
				);
				return false;
			}

			if (file.size > maxSizeBytes) {
				alerts.error(
					"File too large",
					`Please upload a file smaller than ${maxSizeMB}MB`
				);
				return false;
			}

			return true;
		},
		[accept, maxSizeBytes, maxSizeMB, alerts]
	);

	const checkAspectRatio = useCallback(
		(file: File): Promise<boolean> => {
			return new Promise((resolve) => {
				const img = new Image();
				const objectUrl = URL.createObjectURL(file);

				img.onload = () => {
					const aspectRatio = img.width / img.height;
					URL.revokeObjectURL(objectUrl);

					if (Math.abs(aspectRatio - 1) > 0.1) {
						alerts.error(
							"Invalid aspect ratio",
							"Please upload a square image (1:1 aspect ratio)"
						);
						resolve(false);
					} else {
						resolve(true);
					}
				};

				img.onerror = () => {
					URL.revokeObjectURL(objectUrl);
					resolve(true);
				};

				img.src = objectUrl;
			});
		},
		[alerts]
	);

	const handleFile = useCallback(
		async (file: File) => {
			if (!validateFile(file)) return;

			const isValidAspectRatio = await checkAspectRatio(file);
			if (!isValidAspectRatio) return;

			setIsUploading(true);
			try {
				await onUpload(file);
				const objectUrl = URL.createObjectURL(file);
				setPreviewUrl(objectUrl);
			} catch {
				alerts.error("Upload failed", "Failed to upload the image");
			} finally {
				setIsUploading(false);
			}
		},
		[validateFile, checkAspectRatio, onUpload, alerts]
	);

	const handleDragEnter = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			if (!disabled) {
				setIsDragging(true);
			}
		},
		[disabled]
	);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			if (disabled) return;

			const files = e.dataTransfer.files;
			if (files.length > 0) {
				handleFile(files[0]);
			}
		},
		[disabled, handleFile]
	);

	const handleClick = useCallback(() => {
		if (!disabled && fileInputRef.current) {
			fileInputRef.current.click();
		}
	}, [disabled]);

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (files && files.length > 0) {
				handleFile(files[0]);
			}
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		},
		[handleFile]
	);

	const handleRemove = useCallback(
		async (e: React.MouseEvent) => {
			e.stopPropagation();
			if (onRemove) {
				try {
					await onRemove();
					setPreviewUrl(null);
				} catch {
					alerts.error("Remove failed", "Failed to remove the image");
				}
			}
		},
		[onRemove, alerts]
	);

	const getDropzoneBorderClass = () => {
		if (previewUrl)
			return "border border-dashed border-background-extradark hover:border-primary/50 p-2";
		if (isDragging)
			return "border-2 border-dashed p-3 border-primary bg-primary/5";
		return "border-2 border-dashed p-3 border-background-extradark hover:border-primary/50";
	};

	const getUploadLabel = () => {
		if (isDragging) return "Drop here";
		if (previewUrl) return "Replace icon";
		return "Click or drag to upload icon";
	};

	const renderUploadContent = () => {
		if (isUploading) {
			return (
				<div className="flex items-center justify-center gap-2 py-1">
					<div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
					<span className="text-sm text-foreground-light">
						Uploading...
					</span>
				</div>
			);
		}

		const uploadLabel = getUploadLabel();

		return (
			<div
				className={`flex items-center gap-2 ${
					previewUrl ? "justify-center" : ""
				}`}
			>
				<Icon
					icon="CloudUpload"
					size="medium"
					className={
						isDragging ? "text-primary" : "text-foreground-light"
					}
				/>
				<div className={previewUrl ? "" : "flex-1"}>
					<span
						className={`text-foreground-light ${
							previewUrl ? "text-xs" : "text-sm"
						}`}
					>
						{uploadLabel}
					</span>
					{!previewUrl && (
						<p className="text-xs text-foreground-light/70 mt-0.5">
							SVG, PNG, JPG (max {maxSizeMB}MB)
						</p>
					)}
				</div>
			</div>
		);
	};

	const renderDropzone = () => {
		if (disabled && !previewUrl) {
			return (
				<div className="border-2 border-dashed border-background-extradark rounded-md p-3 opacity-50 cursor-not-allowed">
					<div className="flex items-center gap-2">
						<Icon
							icon="CloudUpload"
							size="medium"
							className="text-foreground-light"
						/>
						<div className="flex-1">
							<span className="text-sm text-foreground-light">
								Image upload not available yet
							</span>
							<p className="text-xs text-foreground-light/70 mt-0.5">
								Save the record first to enable image upload
							</p>
						</div>
					</div>
				</div>
			);
		}

		if (!disabled) {
			return (
				<button
					type="button"
					className={`relative rounded-md transition-all cursor-pointer w-full text-left bg-transparent ${getDropzoneBorderClass()}`}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					onClick={handleClick}
					onKeyDown={(e) => e.key === "Enter" && handleClick()}
				>
					<input
						ref={fileInputRef}
						type="file"
						accept={accept}
						onChange={handleFileChange}
						className="hidden"
						disabled={disabled}
					/>
					{renderUploadContent()}
				</button>
			);
		}

		return null;
	};

	return (
		<div className="flex flex-col gap-1.5 mb-3">
			{label && (
				<label
					className={`text-sm ${
						disabled
							? "text-foreground-light/50"
							: "text-foreground-light"
					}`}
				>
					{label}
				</label>
			)}
			{previewUrl && (
				<div className="flex items-center gap-3 p-2 border border-background-extradark rounded-md bg-background-dark/30">
					<img
						src={previewUrl}
						alt="Icon preview"
						className="w-12 h-12 object-cover rounded border border-background-extradark"
					/>
					<div className="flex-1 min-w-0">
						<p className="text-sm text-foreground truncate">
							Icon uploaded
						</p>
						<p className="text-xs text-foreground-light">
							{disabled ? "Read only" : "Click below to change"}
						</p>
					</div>
					{!disabled && onRemove && (
						<IconButton
							testId="profile-upload-field"
							icon="Delete"
							onClick={handleRemove}
							className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
							tooltip="Remove icon"
						/>
					)}
				</div>
			)}
			{renderDropzone()}
		</div>
	);
};
