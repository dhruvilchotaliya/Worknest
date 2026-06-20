import { createContext } from "react";

// ModalSize
export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

/**
 * Defines the content and behavior of a modal when opened.
 */
export type ModalState = {
	/**
	 * The main content rendered inside the modal body.
	 */
	content: React.ReactNode;

	/**
	 * Optional header rendered at the top of the modal, above the content.
	 */
	header?: React.ReactNode;

	/**
	 * The size of the modal.
	 * Defaults to `"md"`.
	 */
	size?: ModalSize;

	/**
	 * When `true`, clicking the backdrop does not close the modal.
	 * Defaults to `false`.
	 */
	preventOnBlur?: boolean;

	/**
	 * When `true`, the close button in the top-right corner is hidden.
	 * Defaults to `false`.
	 */
	hideCloseButton?: boolean;

	/**
	 * Callback fired when the modal is closed.
	 */
	onClose?: () => void;

	/**
	 * The test identifier used for automated testing.
	 */
	testId: string;
	/**
	 * The action element(s) rendered in the modal's action area (e.g., buttons).
	 */
	action?: React.ReactNode;
};

/**
 * The shape of the modal context value.
 */
export type ModalContextState = {
	/**
	 * Whether the modal is currently open.
	 */
	isOpen: boolean;

	/**
	 * The current modal state. Undefined when the modal has never been opened.
	 */
	state: ModalState | undefined;

	/**
	 * Opens the modal with the provided state.
	 */
	open: (modalState: ModalState) => void;

	/**
	 * Closes the modal and fires the `onClose` callback if provided.
	 */
	close: () => void;
};

export const ModalContext = createContext<ModalContextState>({
	isOpen: false,
	state: undefined,
	open: () => {},
	close: () => {},
});
