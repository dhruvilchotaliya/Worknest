import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { useMsal } from "@azure/msal-react";
import Avatar from "../components/common/display/Avatar";
import { Menu } from "../components/common/display/Menu";
import type { MenuItem } from "../components/common/display/Menu";
import PersonIcon from "@mui/icons-material/Person";
import TuneIcon from "@mui/icons-material/Tune";
import LogoutIcon from "@mui/icons-material/Logout";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string, email: string): string {
	const parts = name.trim().split(/\s+/);
	if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	}
	if (parts[0]) return parts[0].slice(0, 2).toUpperCase();
	return email.slice(0, 2).toUpperCase();
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const UserProfileMenu = () => {
	const { instance, accounts } = useMsal();
	const navigate = useNavigate();

	const account = accounts[0];
	const displayName = account?.name ?? "WorkNest User";
	const email = account?.username ?? "";
	// Derive a readable role label from MSAL idTokenClaims if available.
	// Adjust the claim key to match your Azure AD app registration.
	const roles = (account?.idTokenClaims as Record<string, unknown>)?.roles as string[] | undefined;
	const roleLabel = roles?.[0] ?? "Member";

	const initials = getInitials(displayName, email);

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);

	const handleOpen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(e.currentTarget);
	}, []);

	const handleClose = useCallback(() => setAnchorEl(null), []);

	const handleLogout = useCallback(() => {
		// TODO: wire up MSAL logout when auth is fully configured.
		instance.logoutRedirect().catch((err) => {
			console.error("MSAL logout failed:", err);
		});
	}, [instance]);

	const menuItems: MenuItem[] = [
		{
			kind: "link",
			label: "My Profile",
			href: "/app/profile",
			internal: true,
			icon: <PersonIcon fontSize="small" />,
		},
		{
			kind: "item",
			label: "Preferences",
			icon: <TuneIcon fontSize="small" />,
			onClick: () => {
				// TODO: open preferences panel
			},
		},
		{ kind: "divider" },
		{
			kind: "item",
			label: "Sign out",
			icon: <LogoutIcon fontSize="small" />,
			onClick: handleLogout,
		},
	];

	return (
		<>
			{/* Trigger button */}
			<button
				ref={triggerRef}
				id="user-profile-menu-trigger"
				aria-label="Open user profile menu"
				aria-haspopup="true"
				aria-expanded={Boolean(anchorEl)}
				onClick={handleOpen}
				className={[
					"flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 cursor-pointer",
					"border border-transparent",
					"transition-all duration-200",
					"hover:bg-slate-100 hover:border-slate-200 dark:hover:bg-slate-800/60 dark:hover:border-slate-700",
					"active:bg-slate-200 dark:active:bg-slate-700",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
					Boolean(anchorEl) ? "bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700" : "",
				].join(" ")}
			>
				<Avatar
					testId="user-profile-avatar"
					initials={initials}
					size="sm"
					sx={{ bgcolor: "#4f46e5", fontSize: "0.65rem", fontWeight: 700 }}
				/>
				<span className="hidden sm:flex flex-col items-start leading-none">
					<span className="text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
						{displayName}
					</span>
					<span className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-wide">
						{roleLabel}
					</span>
				</span>
			</button>

			{/* Dropdown menu */}
			<Menu
				testId="user-profile-menu"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				items={menuItems}
			/>
		</>
	);
};

export default UserProfileMenu;
