import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Link } from "react-router";
import Icon from "./Icon.tsx";

/**
 * Represents a single node in the breadcrumb trail.
 */
export type BreadcrumbNode = {
	/**
	 * The display label of the breadcrumb node.
	 */
	label: string;

	/**
	 * The path to navigate to when the node is clicked.
	 * Pass an empty string to render the node as non-clickable (current page).
	 */
	path: string;
};

/**
 * Props for the `Breadcrumb` component.
 */
export type BreadcrumbProps = {
	/**
	 * The list of breadcrumb nodes to render.
	 * The home icon is always prepended automatically.
	 */
	nodes: BreadcrumbNode[];

	/**
	 * Maximum number of nodes to display before collapsing.
	 * Collapsed nodes are shown in an expandable ellipsis.
	 * Defaults to `undefined` (no collapsing).
	 */
	maxItems?: number;

	/**
	 * Optional additional CSS class names applied to the root element.
	 */
	className?: string;
};

/**
 * Renders a breadcrumb trail with a home icon as the first node.
 *
 * Nodes with a non-empty `path` are rendered as clickable links using
 * react-router's `Link`. Nodes with an empty `path` are rendered as
 * plain text — typically used for the current active page.
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   nodes={[
 *     { label: "Dashboard", path: "/dashboard" },
 *     { label: "Users", path: "/dashboard/users" },
 *     { label: "John Doe", path: "" },
 *   ]}
 * />
 * ```
 */
export const Breadcrumb = ({ nodes, maxItems, className }: BreadcrumbProps) => {
	const ignoreNodes = [
		"Athentra",
		"Maturity",
		"Config Mgmt",
		"Provisioning",
		"Access",
		"Compliance",
	];

	const truncateNodeLabelBracket = (label: string) => {
		const match = label.match(/^(.*?)\s*\((.*?)\)$/);
		if (match) {
			const [_, base, bracket] = match;
			const truncatedBracket =
				bracket.length > 35
					? bracket.substring(0, 32) + "..."
					: bracket;
			return `${base} (${truncatedBracket})`;
		} else {
			return label;
		}
	};

	return (
		<MuiBreadcrumbs
			maxItems={maxItems}
			className={className}
			aria-label="breadcrumb"
			separator={
				<Icon
					icon="ChevronRight"
					className="text-foreground fs-[24px]"
				/>
			}
		>
			<MuiLink
				component={Link}
				to="/"
				underline="hover"
				color="inherit"
				sx={{ display: "flex", alignItems: "center" }}
			>
				<Icon icon="Home" size="small" className="text-foreground" />
			</MuiLink>

			{nodes.map((node) => {
				if (ignoreNodes.includes(node.label)) {
					return null;
				}
				return node.path ? (
					<MuiLink
						key={node.label}
						component={Link}
						to={node.path}
						color="textPrimary"
						underline="none"
					>
						{truncateNodeLabelBracket(node.label)}
					</MuiLink>
				) : (
					<Typography key={node.label} color="text.primary">
						{truncateNodeLabelBracket(node.label)}
					</Typography>
				);
			})}
		</MuiBreadcrumbs>
	);
};
