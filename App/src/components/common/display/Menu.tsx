import MuiMenu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState, useRef } from "react";
import { Link } from "react-router";
import Tooltip from "../display/Tooltip";

/**
 * Represents a single item in the menu.
 *
 * Items are mutually exclusive by kind:
 * - `"item"`    – A standard clickable menu entry.
 * - `"link"`    – Navigates to a URL when clicked.
 * - `"divider"` – A visual separator between groups of items.
 * - `"submenu"` – An item that reveals a nested menu on hover.
 */
export type MenuItem =
	| MenuItemAction
	| MenuItemLink
	| MenuItemDivider
	| MenuItemSubmenu;

/**
 * A standard clickable menu item that fires a callback.
 */
export type MenuItemAction = {
	kind: "item";

	closeOnClick?: boolean | undefined;
	/**
	 * The display label of the menu item.
	 */
	label: string;

	/**
	 * The class list of the element
	 */
	className?: string;

	/**
	 * Optional icon displayed to the left of the label.
	 */
	icon?: React.ReactNode;

	/**
	 * Callback fired when the item is clicked.
	 */
	onClick: () => void;

	/**
	 * When `true`, the item is rendered in a disabled state.
	 * Defaults to `false`.
	 */
	disabled?: boolean;

	/**
	 * When hover just need to show tooltip
	 */
	tooltip?: string;
};

/**
 * A menu item that navigates to a URL when clicked.
 */
export type MenuItemLink = {
	kind: "link";

	className?: string;
	/**
	 * The display label of the menu item.
	 */
	label: string;

	/**
	 * Optional icon displayed to the left of the label.
	 */
	icon?: React.ReactNode;

	/**
	 * The URL to navigate to when the item is clicked.
	 */
	href: string;

	/**
	 * When `true`, navigates using the app's client-side router (no page reload).
	 * When `false`, renders a standard `<a>` tag.
	 * Defaults to `false`.
	 */
	internal?: boolean;

	/**
	 * Specifies where to open the linked URL.
	 * Defaults to `"_self"`.
	 */
	target?: "_self" | "_blank" | "_parent" | "_top";

	/**
	 * When `true`, the item is rendered in a disabled state.
	 * Defaults to `false`.
	 */
	disabled?: boolean;

	/**
	 * Optional state to pass when using internal navigation.
	 * Ignored for external links.
	 */
	state?: any;
};

/**
 * A visual divider that separates groups of menu items.
 */
export type MenuItemDivider = {
	kind: "divider";
	className?: string;
};

/**
 * A menu item that reveals a nested submenu on hover.
 */
export type MenuItemSubmenu = {
	kind: "submenu";

	/**
	 * The display label of the submenu trigger item.
	 */
	label: string;

	className?: string;
	
	/**
	 * Optional icon displayed to the left of the label.
	 */
	icon?: React.ReactNode;

	/**
	 * The list of items inside the nested submenu.
	 * Supports the same types as the root menu (recursive).
	 */
	items: MenuItem[];

	/**
	 * When `true`, the submenu trigger is rendered in a disabled state.
	 * Defaults to `false`.
	 */
	disabled?: boolean;
};
type MenuItemRendererProps = {
	item: MenuItem;
	onClose: () => void;

	/**
	 * The test identifier used for automated testing.
	 */
	testId: string;
};

// Utility to derive a stable key from a menu item
const getMenuItemKey = (item: MenuItem, index: number): string => {
	if (item.kind === "divider") return `divider-${index}`;
	return item.label;
};

/**
 * Internal renderer for a single menu item of any kind.
 * Handles action, link, divider, and submenu types.
 */
export const MenuItemRenderer = ({ item, onClose, testId }: MenuItemRendererProps) => {
	const [submenuAnchor, setSubmenuAnchor] = useState<HTMLElement | null>(
		null
	);
	const itemRef = useRef<HTMLLIElement>(null);

	if (item.kind === "divider") {
		return <Divider data-testid={testId} />;
	}

	if (item.kind === "submenu") {
		const handleSubmenuOpen = () => {
			setSubmenuAnchor(itemRef.current);
		};

		const handleSubmenuClose = () => {
			setSubmenuAnchor(null);
		};

		return (
			<MuiMenuItem
				ref={itemRef}
				disabled={item.disabled}
				onMouseEnter={handleSubmenuOpen}
				onMouseLeave={handleSubmenuClose}
				className={item.className}
				sx={{ justifyContent: "space-between" }}
				data-testid={testId}
			>
				{item.icon && <ListItemIcon sx={{mr:0}}>{item.icon}</ListItemIcon>}
				<ListItemText>{item.label}</ListItemText>
				<ChevronRightIcon fontSize="small" sx={{ ml: 1 }} />

				{/* Inline submenu — anchored to this item */}
				<MuiMenu
					anchorEl={submenuAnchor}
					open={Boolean(submenuAnchor)}
					onClose={handleSubmenuClose}
					anchorOrigin={{ vertical: "top", horizontal: "right" }}
					transformOrigin={{ vertical: "top", horizontal: "left" }}
					disableAutoFocus
					disableEnforceFocus
					// Prevent the submenu from closing the parent
					style={{ pointerEvents: "none" }}
					slotProps={{ paper: { style: { pointerEvents: "auto" } } }}
					data-testid={`${testId}-submenu`}
				>
					{item.items.map((subItem, index) => (
						<MenuItemRenderer
							key={getMenuItemKey(subItem, index)}
							item={subItem}
							onClose={onClose}
							testId={`${testId}-${getMenuItemKey(item, index)}`}
						/>
					))}
				</MuiMenu>
			</MuiMenuItem>
		);
	}

	if (item.kind === "link") {
		if (item.internal) {
			return (
				<MuiMenuItem
					disabled={item.disabled}
					component={Link}
					to={item.href}
					state = {item.state}
					onClick={(e) => {
						e.stopPropagation();
						onClose();
					}}
					className={item.className}
					data-testid={testId}
				>
					{item.icon && <ListItemIcon sx={{mr:0}}>{item.icon}</ListItemIcon>}
					<ListItemText>{item.label}</ListItemText>
				</MuiMenuItem>
			);
		}

		return (
			<MuiMenuItem
				disabled={item.disabled}
				component="a"
				href={item.href}
				target={item.target ?? "_self"}
				rel={
					item.target === "_blank" ? "noopener noreferrer" : undefined
				}
				onClick={(e) => {
					e.stopPropagation();
					onClose();
				}}
				className={item.className}
				data-testid={testId}
			>
				{item.icon && <ListItemIcon sx={{mr:-1}}>{item.icon}</ListItemIcon>}
				<ListItemText>{item.label}</ListItemText>
			</MuiMenuItem>
		);
	}

	// kind === "item"
	return (
		<Tooltip
			title={item.tooltip ?? ""}
			placement="left"
			disableTooltip={!item.tooltip}
			testId={`${testId}-tooltip`}
		>
        	<span>
				<MuiMenuItem
					disabled={item.disabled}
					onClick={(e) => {
						e.stopPropagation();
						item.onClick();
						if(item.closeOnClick !== false){
							onClose();
						}
					}}
					data-testid={testId}
				>
					{item.icon && <ListItemIcon >{item.icon}</ListItemIcon>}
					<ListItemText>{item.label}</ListItemText>
				</MuiMenuItem>
			</span>
		</Tooltip>
	);
};

/**
 * Props for the `Menu` component.
 */
export type MenuProps = {
	/**
	 * The element to anchor the menu to.
	 * Pass the event's `currentTarget` from the trigger's onClick.
	 * Pass `null` to close the menu.
	 */
	anchorEl: HTMLElement | null;

	/**
	 * Whether the menu is open.
	 */
	open: boolean;

	/**
	 * Callback fired when the menu should close —
	 * on backdrop click, Escape key, or after an item is selected.
	 */
	onClose: () => void;

	/**
	 * The list of items to render in the menu.
	 * Supports actions, links, dividers, and nested submenus.
	 */
	items: MenuItem[];

	/**
	 * The test identifier used for automated testing.
	 */
	testId: string;
};

/**
 * A fully composable dropdown menu anchored to any trigger element.
 *
 * Manage open state and anchor element in the parent — pass the trigger's
 * `currentTarget` as `anchorEl` and toggle `open` via `onClose`.
 *
 * Supports action items, link items, dividers, and nested submenus.
 */
export const Menu = ({ anchorEl, open, onClose, items, testId }: MenuProps) => {
	return (
		<MuiMenu
			anchorEl={anchorEl}
			open={open}
			onClose={onClose}
			slotProps={{
				backdrop: {
					onClick: (e) => e.stopPropagation(),
				},
			}}
			anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
			transformOrigin={{ vertical: "top", horizontal: "left" }}
			data-testid={testId}
		>
			{items.map((item, index) => (
				<MenuItemRenderer
					key={getMenuItemKey(item, index)}
					item={item}
					onClose={onClose}
					testId={`${testId}-${getMenuItemKey(item, index)}`}
				/>
			))}
		</MuiMenu>
	);
};
