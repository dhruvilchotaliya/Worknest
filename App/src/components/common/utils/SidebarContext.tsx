import React, { createContext } from "react";

export type SidebarSize = "xs" | "sm" | "md" | "lg" | "xl" | "full" | "auto";

/**
 * Defines the content and behavior of a sidebar when opened.
 */
export type SidebarState = {

	/**
	 * The test identifier used for automated testing.
	 */
	testId: string

	/**
	 * The content rendered inside the sidebar panel.
	 */
	content: React.ReactNode;

	/**
	 * The size of the sidebar.
	 * Defaults to `"md"`.
	 */
	size?: SidebarSize;

	/**
	 * When `true`, shows the back/close button even when stacking is used.
	 * Defaults to `false`.
	 */
	hasMultiState?: boolean;

	/**
	 * Callback fired when this sidebar state is closed or popped from the stack.
	 * Return `false` to prevent closing — useful for unsaved changes guards.
	 * Return `true` or `undefined` to allow closing.
	 */
	onClose?: () => boolean | void;
};

/**
 * Internal state — extends `SidebarState` with the current stack depth.
 */
export type SidebarStateInternal = SidebarState & {
	statesCount: number;
};

// SidebarContext

/**
 * The shape of the sidebar context value.
 */
export type SidebarContextState = {
	/**
	 * Whether the sidebar is currently open.
	 */
	isOpen: boolean;

	/**
	 * The currently visible sidebar state (top of the stack).
	 * Includes `statesCount` for determining back vs close icon.
	 */
	currentState?: SidebarStateInternal;

	/**
	 * Opens the sidebar with the provided state.
	 *
	 * @param state   - The sidebar state to display.
	 * @param stack   - When `true`, pushes onto the existing stack instead of replacing it.
	 */
	open: (state: SidebarState, stack?: boolean) => void;

	/**
	 * Closes the sidebar or pops the top state from the stack.
	 * Respects the `onClose` guard — if `onClose` returns `false`, the sidebar stays open.
	 */
	close: () => void;
};

export const SidebarContext = createContext<SidebarContextState>({
	isOpen: false,
	open: () => {},
	close: () => {},
});