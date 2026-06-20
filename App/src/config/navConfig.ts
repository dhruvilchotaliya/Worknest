import type { NavItem } from "../types/nav";

/**
 * Primary navigation items shown in the sidebar.
 * Order matters — items are rendered top-to-bottom.
 *
 * To enable role-based filtering later, add `allowedRoles` to each item.
 * Example: allowedRoles: ["admin", "manager"]
 */
export const primaryNavItems: NavItem[] = [
	{
		label: "Home",
		path: "/app/home",
		icon: "Home",
		// allowedRoles: [] — available to all
	},
	{
		label: "Projects",
		path: "/app/projects",
		icon: "FolderShared",
	},
	{
		label: "Tasks",
		path: "/app/tasks",
		icon: "Assignment",
	},
	{
		label: "Employees",
		path: "/app/employees",
		icon: "People",
	},
];

/**
 * Bottom-anchored navigation items (e.g. Settings).
 */
export const bottomNavItems: NavItem[] = [
	{
		label: "Settings",
		path: "/app/settings",
		icon: "Settings",
	},
];
