import { Drawer, Box, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import type { ReactNode } from "react";
import Typography from "../display/Typography";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type WorknestSidebarProps = {
	/** Controls whether the sidebar is visible */
	open: boolean;

	/** Title displayed in the sidebar header */
	title: string;

	/** Callback invoked when the sidebar is closed */
	onClose: () => void;

	/** Main scrollable content of the sidebar */
	children: ReactNode;

	/** Optional sticky footer content (e.g. action buttons) */
	footer?: ReactNode;

	/** Sidebar width. Defaults to 420 */
	width?: number | string;

	/** Slide direction. Defaults to "right" */
	anchor?: "left" | "right";

	/** When true, shows a loading state (disables close interactions) */
	isSaving?: boolean;

	/** Prevent closing the sidebar by clicking the backdrop */
	disableBackdropClick?: boolean;

	/** Show the close (X) icon in the header. Defaults to true */
	showCloseIcon?: boolean;

	/** data-testid prefix for automated testing */
	testId?: string;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * WorknestSidebar
 *
 * A generic, reusable right-side (or left-side) drawer component.
 * It is NOT tied to any specific domain — pass any content via `children`
 * and optional sticky footer buttons via `footer`.
 *
 * @example
 * <WorknestSidebar
 *   open={open}
 *   title="Add Employee"
 *   onClose={() => setOpen(false)}
 *   footer={<Button onClick={handleSave}>Save</Button>}
 * >
 *   <MyForm />
 * </WorknestSidebar>
 */
const WorknestSidebar = ({
	open,
	title,
	onClose,
	children,
	footer,
	width = 420,
	anchor = "right",
	isSaving = false,
	disableBackdropClick = false,
	showCloseIcon = true,
	testId,
}: WorknestSidebarProps) => {
	const handleBackdropClick = () => {
		if (disableBackdropClick || isSaving) return;
		onClose();
	};

	return (
		<Drawer
			anchor={anchor}
			open={open}
			onClose={handleBackdropClick}
			data-testid={testId ? `${testId}-drawer` : "worknest-sidebar-drawer"}
			slotProps={{
				paper: {
					sx: {
						width,
						display: "flex",
						flexDirection: "column",
						overflow: "hidden",
						// Smooth slide animation
						transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1) !important",
					},
				},
			}}
		>
			{/* ── Header ────────────────────────────────────────────────── */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					px: 2.5,
					py: 2,
					borderBottom: "1px solid",
					borderColor: "divider",
					flexShrink: 0,
					bgcolor: "background.paper",
				}}
				data-testid={testId ? `${testId}-header` : "worknest-sidebar-header"}
			>
				<Typography
					component="h6"
					testId={testId ? `${testId}-title` : "worknest-sidebar-title"}
					style={{ fontWeight: 700, fontSize: "1rem" }}
				>
					{title}
				</Typography>

				{showCloseIcon && (
					<IconButton
						size="small"
						onClick={onClose}
						disabled={isSaving}
						aria-label="Close sidebar"
						data-testid={testId ? `${testId}-close-btn` : "worknest-sidebar-close-btn"}
						sx={{
							color: "text.secondary",
							"&:hover": { bgcolor: "action.hover" },
						}}
					>
						<CloseIcon fontSize="small" />
					</IconButton>
				)}
			</Box>

			{/* ── Scrollable Content ────────────────────────────────────── */}
			<Box
				sx={{ flex: 1, overflowY: "auto", px: 2.5, py: 2.5 }}
				data-testid={testId ? `${testId}-content` : "worknest-sidebar-content"}
			>
				{children}
			</Box>

			{/* ── Sticky Footer (optional) ──────────────────────────────── */}
			{footer && (
				<Box
					sx={{
						flexShrink: 0,
						px: 2.5,
						py: 2,
						borderTop: "1px solid",
						borderColor: "divider",
						bgcolor: "background.paper",
					}}
					data-testid={testId ? `${testId}-footer` : "worknest-sidebar-footer"}
				>
					{footer}
				</Box>
			)}
		</Drawer>
	);
};

export default WorknestSidebar;
