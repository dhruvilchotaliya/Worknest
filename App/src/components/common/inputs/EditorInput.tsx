import { Box, FormControl, FormHelperText } from "@mui/material";
import {
	RichTextEditor,
	RichTextReadOnly,
	type RichTextEditorRef, MenuControlsContainer, MenuButtonBold, MenuButtonItalic, MenuButtonUnderline,
	MenuButtonStrikethrough, MenuDivider, MenuSelectHeading, MenuButtonBulletedList, MenuButtonOrderedList,
	MenuButtonCode, MenuButtonUndo, MenuButtonRedo,
} from "mui-tiptap";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import type { InputProps } from "./InputProps";
import Typography from "../display/Typography.tsx";

type EditorInputProps = {
	/**
	 * Label shown above the editor
	 */
	label?: string;

	/**
	 * HTML content value
	 */
	value?: string | null;

	/**
	 * Change handler (HTML output)
	 */
	setValue?: (value: string | null) => void;

	/**
	 * Helper / error text
	 */
	subtext?: string;

	/**
	 * Error state
	 */
	error?: boolean;

	/**
	 * Minimum visible rows
	 * @default 5
	 */
	minRows?: number;

	/**
	 * Maximum visible rows (scroll after this)
	 * @default 10
	 */
	maxRows?: number;
} & InputProps;

type EditorMenuControlsProps = {
	disabled?: boolean;
};

const EditorMenuControls = ({ disabled }: EditorMenuControlsProps) => {
	return (
		<MenuControlsContainer>
			<MenuButtonBold disabled={disabled} />
			<MenuButtonItalic disabled={disabled} />
			<MenuButtonUnderline disabled={disabled} />
			<MenuButtonStrikethrough disabled={disabled} />

			<MenuDivider />
			<MenuSelectHeading disabled={disabled} />
			<MenuDivider />

			<MenuButtonBulletedList disabled={disabled} />
			<MenuButtonOrderedList disabled={disabled} />
			<MenuButtonCode disabled={disabled} />

			<MenuDivider />
			<MenuButtonUndo disabled={disabled} />
			<MenuButtonRedo disabled={disabled} />
		</MenuControlsContainer>
	);
};

const EditorInput = (props: EditorInputProps) => {
	const editorRef = useRef<RichTextEditorRef | null>(null);

	useEffect(() => {
		const editor = editorRef.current?.editor;
		if (!editor) return;

		const incoming = props.value ?? "<p></p>";
		const current = editor.getHTML();

		if (current !== incoming) {
			editor.commands.setContent(incoming, { emitUpdate: false });
		}
	}, [props.value]);

	const isReadOnly = props.displayMode === "readonly";
	const isDisabled = props.displayMode === "disabled";

	const ROW_HEIGHT = 24;
	const minRows = props.minRows ?? 5;
	const maxRows = props.maxRows ?? 10;

	const minHeight = minRows * ROW_HEIGHT;
	const maxHeight = maxRows * ROW_HEIGHT;

	if (props.displayMode === "hidden") return null;

	if (props.displayMode === "text") {
		return (
			<Box data-testid={props.testId} sx={{ mb: "0.5rem" }}>
				{props.label && (
					<Typography testId={`editor-label-${props.testId}`} component="h5">
						{props.label}
						{props.required && (
							<span style={{ marginLeft: 3 }}>*</span>
						)}
					</Typography>
				)}

				{props.value ? (
					<RichTextReadOnly
						content={props.value}
						extensions={[StarterKit]}
					/>
				) : (
					<Typography component={'body1'} style={{ paddingBottom: '0.5rem' }} testId={`editor-value-${props.testId}`}><br /></Typography>
				)}
			</Box>
		);
	}

	return (
		<FormControl
			data-testid={props.testId}
			error={props.error}
			sx={{
				marginY: props.subtext ? "0.25rem" : "0.5rem"
			}}
			fullWidth
		>
			{props.label && (
				<Typography testId={`editor-label-${props.testId}`} component="h5">
					{props.label}
					{props.displayMode !== "disabled" && props.displayMode !== "readonly" && props.required && <span style={{ marginLeft: 3 }}>*</span>}
				</Typography>
			)}

			<RichTextEditor
				className={'hover:cursor-text'}
				data-testid={`editor-${props.testId}`}
				ref={editorRef}
				extensions={[StarterKit]}
				content={props.value ?? ""}
				editable={!isReadOnly && !isDisabled}
				renderControls={() => (
					<EditorMenuControls disabled={isDisabled} />
				)}
				sx={{
					mt: 1,
					opacity: isDisabled ? 0.6 : 1,
					"& .ProseMirror": {
						minHeight,
						maxHeight,
						overflowY: "auto",
					},
				}}
				onUpdate={({ editor }) => {
					if (!props.setValue || isReadOnly || isDisabled) return;
					props.setValue(editor.isEmpty ? null : editor.getHTML());
				}}
			/>

			{props.subtext && (
				<FormHelperText error={props.error}>
					{props.subtext}
				</FormHelperText>
			)}
		</FormControl>
	);
};

export default EditorInput;
