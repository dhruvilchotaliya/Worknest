import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { type ReactNode, useState, useMemo, useCallback } from "react";
import { ModalContext, type ModalSize, type ModalState } from "./ModalContext.tsx";
import Typography from "../display/Typography.tsx";
import { DialogActions } from "@mui/material";

/**
 * Maps our `ModalSize` token to MUI Dialog's `maxWidth` prop.
 * `"full"` is handled separately via the `fullScreen` prop.
 */
const sizeMap: Record<
	Exclude<ModalSize, "full">,
	"xs" | "sm" | "md" | "lg" | "xl"
> = {
	xs: "xs",
	sm: "sm",
	md: "md",
	lg: "lg",
	xl: "xl",
};

/**
 * Provides modal open/close functionality to the component tree via `ModalContext`.
 *
 * Wrap your app (or a subtree) with `ModalProvider` and consume `ModalContext`
 * anywhere below it to open or close the modal imperatively.
 *
 * Uses MUI `Dialog` under the hood.
 */
const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [state, setState] = useState<ModalState | undefined>();

	const open = useCallback((modalState: ModalState) => {
		console.log('ModalProvider: open called', modalState);
		setState(modalState);
		setIsOpen(true);
	}, []);

	const close = useCallback(() => {
		setIsOpen(false);
		state?.onClose?.();
	}, [state]);

	const handleBackdropClose = (
		_: unknown,
		reason: "backdropClick" | "escapeKeyDown"
	) => {
		if (reason === "backdropClick" && state?.preventOnBlur) return;
		close();
	};

	const isFullScreen = state?.size === "full";

	const maxWidth = useMemo(() => {
		if (!state?.size || state.size === "full") return "md";
		return sizeMap[state.size];
	}, [state?.size]);

	const contextValue = useMemo(
		() => ({ isOpen, state, open, close }),
		[isOpen, state, open, close]
	);

	console.log('ModalProvider: render', { isOpen, state });

	return (
		<ModalContext.Provider value={contextValue}>
			{children}

			<Dialog
				open={isOpen}
				onClose={handleBackdropClose}
				fullScreen={isFullScreen}
				maxWidth={maxWidth}
				fullWidth
				disableRestoreFocus
				data-testid={
					state?.testId ? `${state.testId}-dialog` : undefined
				}
			>
				{(state?.header ?? !state?.hideCloseButton) && (
					<DialogTitle
						component="div"
						sx={{
							display: "flex",
							alignItems: "center",
							position: "relative",
							pr: state?.hideCloseButton ? 2 : 5, 
						}}
						data-testid={
							state?.testId ? `${state.testId}-header` : undefined
						}
					>
						<div className="flex-1">
							{state?.header}
						</div>
						{!state?.hideCloseButton && (
							<IconButton
								onClick={close}
								size="small"
								aria-label="Close modal"
								sx={{
									position: "absolute",
									top: 8,
									right: 8,
									color: "text.primary",
									"&:hover": { color: "primary.main" },
								}}
								data-testid={
									state?.testId
										? `${state.testId}-close-button`
										: undefined
								}
							>
								<CloseIcon fontSize="medium" />
							</IconButton>
						)}
					</DialogTitle>
				)}

				<DialogContent
					data-testid={
						state?.testId ? `${state.testId}-content` : undefined
					}
					className="overflow-hidden"
					sx={{
						display: 'flex',
						flexDirection: 'column',
						flex: 1
					}}
				>
					{state?.content}
				</DialogContent>
				{state?.action && (
					<DialogActions
						data-testid={
							state?.testId ? `${state.testId}-action` : undefined
						}
					>
						{state?.action}
					</DialogActions>
				)}
			</Dialog>
		</ModalContext.Provider>
	);
};

export default ModalProvider;
