import type { IconType } from "../components/common/display/Icon";

/**
 * Supported user roles for role-based navigation filtering.
 */
export type UserRole = "admin" | "manager" | "member" | "viewer";

/**
 * A single navigation item configuration.
 * `allowedRoles` — when empty or undefined, the item is visible to all roles.
 */
export interface NavItem {
	label: string;
	path: string;
	icon: IconType;
	allowedRoles?: UserRole[];
}
