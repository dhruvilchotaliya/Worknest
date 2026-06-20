import MuiList from "@mui/material/List";
import MuiListItem from "@mui/material/ListItem";
import MuiListItemButton from "@mui/material/ListItemButton";
import MuiListItemText from "@mui/material/ListItemText";
import MuiListItemIcon from "@mui/material/ListItemIcon";
import MuiListItemAvatar from "@mui/material/ListItemAvatar";
import MuiListSubheader from "@mui/material/ListSubheader";
import type React from "react";
import type {PropsWithChildren} from "react";

/**
 * Props for the `ListItemIcon` component.
 */
export type ListItemIconProps = {

    /**
     * The icon element to display.
     * Accepts any React node — typically an `<Icon>` or SVG element.
     */
    children: React.ReactNode;

    /**
     * The test identifier used for automated testing.
     * Mapped to `data-testid` on the rendered element.
     */
    testId: string;

};

/**
 * Renders an icon slot on the leading edge of a list item.
 *
 * Must be used as a direct child of `ListItem` or `ListItemButton`.
 *
 * @example
 * ```tsx
 * <ListItemIcon testId="inbox-icon">
 *   <Icon icon="Settings" />
 * </ListItemIcon>
 * ```
 */
export const ListItemIcon = ({children, testId}: ListItemIconProps) => {
    return (
        <MuiListItemIcon data-testid={testId}>
            {children}
        </MuiListItemIcon>
    );
};

/**
 * Props for the `ListItemAvatar` component.
 */
export type ListItemAvatarProps = {

    /**
     * The avatar element to display.
     * Accepts any React node — typically an `<Avatar>` component.
     */
    children: React.ReactNode;

    /**
     * The test identifier used for automated testing.
     * Mapped to `data-testid` on the rendered element.
     */
    testId: string;

};

/**
 * Renders an avatar slot on the leading edge of a list item.
 *
 * Must be used as a direct child of `ListItem` or `ListItemButton`.
 *
 * @example
 * ```tsx
 * <ListItemAvatar testId="user-avatar">
 *   <Avatar>U</Avatar>
 * </ListItemAvatar>
 * ```
 */
export const ListItemAvatar = ({children, testId}: ListItemAvatarProps) => {
    return (
        <MuiListItemAvatar data-testid={testId}>
            {children}
        </MuiListItemAvatar>
    );
};

/**
 * Props for the `ListItemText` component.
 */
export type ListItemTextProps = {

    /**
     * The primary text content of the list item.
     * Rendered as the main label.
     */
    primary?: React.ReactNode;

    /**
     * Optional secondary text displayed below the primary text.
     * Typically used for descriptions or metadata.
     */
    secondary?: React.ReactNode;

    /**
     * When `true`, adds left indentation to align text with items
     * that have an icon or avatar, even when this item does not.
     */
    inset?: boolean;

    /**
     * The test identifier used for automated testing.
     * Mapped to `data-testid` on the rendered element.
     */
    testId: string;

};

/**
 * Renders the text content of a list item — a primary label
 * and an optional secondary description.
 *
 * Must be used as a direct child of `ListItem` or `ListItemButton`.
 *
 * @example
 * ```tsx
 * <ListItemText
 *   primary="Inbox"
 *   secondary="3 unread messages"
 *   testId="inbox-text"
 * />
 * ```
 */
export const ListItemText = ({
                                 primary,
                                 secondary,
                                 inset = false,
                                 testId,
                             }: ListItemTextProps) => {
    return (
        <MuiListItemText
            primary={primary}
            secondary={secondary}
            inset={inset}
            data-testid={testId}
        />
    );
};

/**
 * Props for the `ListItemButton` component.
 */
export type ListItemButtonProps = {

    /**
     * When `true`, renders the button in a visually selected state.
     */
    selected?: boolean;

    /**
     * When `true`, disables the button and prevents interaction.
     */
    disabled?: boolean;

    /**
     * When `true`, uses compact vertical padding for a denser layout.
     */
    dense?: boolean;

    /**
     * When `true`, renders a bottom divider below the button.
     */
    divider?: boolean;

    /**
     * When `true`, removes the default left and right padding.
     */
    disableGutters?: boolean;

    /**
     * Vertical alignment of the button's children.
     *
     * - `"center"` — Children are vertically centred.
     * - `"flex-start"` — Children align to the top.
     */
    alignItems?: "center" | "flex-start";

    /**
     * Callback fired when the button is clicked.
     */
    onClick?: () => void;

    /**
     * The test identifier used for automated testing.
     * Mapped to `data-testid` on the rendered element.
     */
    testId: string;

} & PropsWithChildren;

/**
 * Renders an interactive list item with button behaviour (ripple, hover, focus).
 *
 * Use this instead of `ListItem` when the entire row should be clickable.
 * Compose with `ListItemIcon`, `ListItemAvatar`, and `ListItemText` as children.
 *
 * @example
 * ```tsx
 * <ListItemButton selected={activeId === "inbox"} onClick={() => setActiveId("inbox")} testId="inbox-btn">
 *   <ListItemIcon testId="inbox-icon"><Icon icon="Settings" /></ListItemIcon>
 *   <ListItemText primary="Inbox" testId="inbox-text" />
 * </ListItemButton>
 * ```
 */
export const ListItemButton = ({
                                   selected = false,
                                   disabled = false,
                                   dense = false,
                                   divider = false,
                                   disableGutters = false,
                                   alignItems = "center",
                                   onClick,
                                   children,
                                   testId,
                               }: ListItemButtonProps) => {
    return (
        <MuiListItemButton
            selected={selected}
            disabled={disabled}
            dense={dense}
            divider={divider}
            disableGutters={disableGutters}
            alignItems={alignItems}
            onClick={onClick}
            data-testid={testId}
        >
            {children}
        </MuiListItemButton>
    );
};

/**
 * Props for the `ListItem` component.
 */
export type ListItemProps = {

    /**
     * When `true`, uses compact vertical padding for a denser layout.
     */
    dense?: boolean;

    /**
     * When `true`, renders a bottom divider below the item.
     */
    divider?: boolean;

    /**
     * When `true`, removes the default left and right padding.
     */
    disableGutters?: boolean;

    /**
     * When `true`, removes all padding from the item.
     */
    disablePadding?: boolean;

    /**
     * Vertical alignment of the item's children.
     *
     * - `"center"` — Children are vertically centred.
     * - `"flex-start"` — Children align to the top.
     */
    alignItems?: "center" | "flex-start";

    /**
     * An element rendered at the trailing edge of the item.
     * Typically an icon button or a switch.
     */
    secondaryAction?: React.ReactNode;

    /**
     * The test identifier used for automated testing.
     * Mapped to `data-testid` on the rendered element.
     */
    testId: string;

} & PropsWithChildren;

/**
 * Renders a single row inside a `List`.
 *
 * Use `ListItem` for non-interactive rows. For clickable rows,
 * nest a `ListItemButton` inside or use `ListItemButton` directly.
 *
 * @example
 * ```tsx
 * <ListItem
 *   secondaryAction={<IconButton icon="Delete" testId="delete-btn" />}
 *   testId="settings-item"
 * >
 *   <ListItemText primary="Settings" testId="settings-text" />
 * </ListItem>
 * ```
 */
export const ListItem = ({
                             dense = false,
                             divider = false,
                             disableGutters = false,
                             disablePadding = false,
                             alignItems = "center",
                             secondaryAction,
                             children,
                             testId,
                         }: ListItemProps) => {
    return (
        <MuiListItem
            dense={dense}
            divider={divider}
            disableGutters={disableGutters}
            disablePadding={disablePadding}
            alignItems={alignItems}
            secondaryAction={secondaryAction}
            data-testid={testId}
        >
            {children}
        </MuiListItem>
    );
};

/**
 * Props for the `ListSubheader` component.
 */
export type ListSubheaderProps = {

    /**
     * The colour of the subheader text.
     *
     * - `"default"` — Uses the theme's default text colour.
     * - `"inherit"` — Inherits the colour from the parent.
     * - `"primary"` — Uses the theme's primary colour.
     */
    color?: "default" | "inherit" | "primary";

    /**
     * When `true`, removes the default left and right padding.
     */
    disableGutters?: boolean;

    /**
     * When `true`, disables the sticky positioning behaviour
     * so the subheader scrolls with the list content.
     */
    disableSticky?: boolean;

    /**
     * When `true`, adds left indentation to align with items
     * that have an icon or avatar.
     */
    inset?: boolean;

    /**
     * The test identifier used for automated testing.
     * Mapped to `data-testid` on the rendered element.
     */
    testId: string;

} & PropsWithChildren;

/**
 * Renders a section heading inside a `List`.
 *
 * By default it is sticky — it stays visible at the top of its
 * scroll container while the section content scrolls beneath it.
 *
 * @example
 * ```tsx
 * <List testId="nav-list" subheader={<ListSubheader testId="nav-header">Navigation</ListSubheader>}>
 *   <ListItem testId="home-item">...</ListItem>
 * </List>
 * ```
 */
export const ListSubheader = ({
                                  color = "default",
                                  disableGutters = false,
                                  disableSticky = false,
                                  inset = false,
                                  children,
                                  testId,
                              }: ListSubheaderProps) => {
    return (
        <MuiListSubheader
            color={color}
            disableGutters={disableGutters}
            disableSticky={disableSticky}
            inset={inset}
            data-testid={testId}
        >
            {children}
        </MuiListSubheader>
    );
};

/**
 * Props for the root `List` component.
 */
export type ListProps = {

    /**
     * When `true`, uses compact vertical padding on all items
     * within the list for a denser layout.
     */
    dense?: boolean;

    /**
     * When `true`, removes the default top and bottom padding
     * from the list container.
     */
    disablePadding?: boolean;

    /**
     * An optional subheader element rendered at the top of the list.
     * Typically a `<ListSubheader>` component.
     */
    subheader?: React.ReactNode;

    /**
     * Optional additional CSS class names applied to the root list element.
     */
    className?: string;

    /**
     * The test identifier used for automated testing.
     * Mapped to `data-testid` on the rendered element.
     */
    testId: string;

    /**
     * When `true`, the list will take up the full width of its container.
     */
    fullWidth?: boolean;

    /**
     * Custom flex value for the list container, allowing it to grow or shrink within a flex layout.
     * This can be used to control how the list shares space with sibling elements.
     */
    flex?: string;

} & PropsWithChildren;

/**
 * Root list container. Compose with `ListItem`, `ListItemButton`,
 * `ListSubheader`, and related sub-components as children.
 *
 * @example
 * ```tsx
 * <List testId="settings-list" dense>
 *   <ListItem testId="profile-item">
 *     <ListItemIcon testId="profile-icon"><Icon icon="FaceIcon" /></ListItemIcon>
 *     <ListItemText primary="Profile" secondary="Manage your profile" testId="profile-text" />
 *   </ListItem>
 *   <ListItemButton onClick={() => navigate("/settings")} testId="settings-btn">
 *     <ListItemIcon testId="settings-icon"><Icon icon="Settings" /></ListItemIcon>
 *     <ListItemText primary="Settings" testId="settings-text" />
 *   </ListItemButton>
 * </List>
 * ```
 */
export const List = ({
                         dense = false,
                         disablePadding = false,
                         subheader,
                         className,
                         children,
                         testId,
                         fullWidth,
                     }: ListProps) => {
    return (
        <MuiList
            dense={dense}
            disablePadding={disablePadding}
            subheader={subheader}
            className={className}
            data-testid={testId}
            sx={{
                width: fullWidth ? "100%" : undefined,
            }}
        >
            {children}
        </MuiList>
    );
};
